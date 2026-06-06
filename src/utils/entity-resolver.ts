import { HomeAssistant } from 'custom-card-helpers';
import {
  ClimateCommandCenterConfig,
  ClimateZone,
  FloorConfig,
  FloorSection,
  HassEntity,
  RoomSensor,
  WeatherData,
  ZoneConfig,
  ZoneSensors,
} from '../types';

const WEATHER_PATTERNS = ['weather', 'tempest', 'wet bulb', 'dew point', 'feels like'];
const EXCLUDE_PATTERNS = [
  'deye',
  'sunsynk',
  'sol-ark',
  'battery',
  'oven',
  'cavity',
  'inverter',
  ...WEATHER_PATTERNS,
];

const DEFAULT_FLOORS: FloorConfig[] = [
  {
    name: 'Main Floor',
    zones: ['Laundry', 'Living Room', 'Main Area', 'Redmond Thermostat'],
    room_sensors: [
      'Family Room',
      'Kitchen',
      'Hallway',
      'Stairs',
      'Entryway',
      'Primary Bath',
      'Primary Bedroom',
    ],
  },
  {
    name: 'Upper Floor',
    zones: ['Main Office'],
    room_sensors: ['Hunters', 'Sydney', 'Upstair Office', 'Upstairs Office'],
  },
];

function dedupeFriendlyName(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2 && words.length % 2 === 0) {
    const half = words.length / 2;
    if (words.slice(0, half).join(' ') === words.slice(half).join(' ')) {
      return words.slice(0, half).join(' ');
    }
  }
  return name;
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function friendlyName(entity: HassEntity): string {
  return (entity.attributes.friendly_name as string | undefined) ?? entity.entity_id;
}

function entityArea(hass: HomeAssistant, entityId: string): string | undefined {
  const reg = (hass as HomeAssistant & { entities?: Record<string, { area_id?: string }> }).entities?.[
    entityId
  ];
  if (!reg?.area_id) return undefined;
  const areas = (hass as HomeAssistant & { areas?: Record<string, { name?: string }> }).areas;
  return areas?.[reg.area_id]?.name;
}

function parseNumber(state: HassEntity | undefined): number | undefined {
  if (!state || state.state === 'unavailable' || state.state === 'unknown') return undefined;
  const val = parseFloat(state.state);
  return isNaN(val) ? undefined : Math.round(val * 10) / 10;
}

function getEntity(hass: HomeAssistant, entityId: string | undefined): HassEntity | undefined {
  if (!entityId) return undefined;
  return hass.states[entityId] as HassEntity | undefined;
}

function isExcluded(name: string, entityId: string, extra: string[] = []): boolean {
  const haystack = `${normalize(name)} ${normalize(entityId)}`;
  return [...EXCLUDE_PATTERNS, ...extra].some((p) => haystack.includes(normalize(p)));
}

function scoreMatch(name: string, entityId: string, zoneName: string, hint: string): number {
  const nName = normalize(name);
  const nZone = normalize(zoneName);
  const nId = normalize(entityId);
  const nHint = normalize(hint);
  let score = 0;
  if (nName.includes(nZone) || nId.includes(nZone.replace(/\s+/g, '_'))) score += 3;
  if (nName.includes(nHint)) score += 4;
  if (nHint === 'humidity' && (name.includes('%') || entityId.includes('humidity'))) score += 2;
  return score;
}

function findBestSensor(
  hass: HomeAssistant,
  zoneName: string,
  hint: string,
  deviceClass: 'temperature' | 'humidity'
): string | undefined {
  let best: { id: string; score: number } | undefined;
  for (const entity of Object.values(hass.states)) {
    if (!entity.entity_id.startsWith('sensor.')) continue;
    if (entity.attributes.device_class !== deviceClass) continue;
    const name = friendlyName(entity as HassEntity);
    if (isExcluded(name, entity.entity_id)) continue;
    const score = scoreMatch(name, entity.entity_id, zoneName, hint);
    if (score >= 5 && (!best || score > best.score)) {
      best = { id: entity.entity_id, score };
    }
  }
  return best?.id;
}

function resolveSensors(hass: HomeAssistant, zone: ZoneConfig): ZoneSensors {
  const floorEntity = getEntity(
    hass,
    zone.floor_sensor ?? findBestSensor(hass, zone.name, 'floor temperature', 'temperature')
  );
  const roomEntity = getEntity(
    hass,
    zone.room_sensor ?? findBestSensor(hass, zone.name, 'room temperature', 'temperature')
  );
  const humidityEntity = getEntity(
    hass,
    zone.humidity_sensor ?? findBestSensor(hass, zone.name, 'humidity', 'humidity')
  );

  return {
    floor: parseNumber(floorEntity),
    room: parseNumber(roomEntity),
    humidity: parseNumber(humidityEntity),
  };
}

function zoneKind(hass: HomeAssistant, zone: ZoneConfig, sensors: ZoneSensors): 'floor_heat' | 'thermostat' {
  if (sensors.floor != null) return 'floor_heat';
  const name = normalize(zone.name);
  if (name.includes('thermostat')) return 'thermostat';
  const state = getEntity(hass, zone.climate_entity);
  const modes = (state?.attributes.hvac_modes as string[] | undefined) ?? [];
  if (modes.includes('heat_cool')) return 'thermostat';
  return 'floor_heat';
}

function autoDiscoverZones(hass: HomeAssistant): ZoneConfig[] {
  return Object.values(hass.states)
    .filter((e) => e.entity_id.startsWith('climate.'))
    .map((e) => {
      const rawName =
        (e.attributes.friendly_name as string | undefined) ??
        e.entity_id.replace('climate.', '').replace(/_/g, ' ');
      return {
        name: dedupeFriendlyName(rawName),
        climate_entity: e.entity_id,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function buildZones(hass: HomeAssistant, config: ClimateCommandCenterConfig): ClimateZone[] {
  const zoneConfigs =
    config.zones?.length ? config.zones : config.auto_discover ? autoDiscoverZones(hass) : [];

  return zoneConfigs.map((zone) => {
    const sensors = resolveSensors(hass, zone);
    return {
      name: zone.name,
      climate_entity: zone.climate_entity,
      floor: zone.floor,
      kind: zoneKind(hass, zone, sensors),
      sensors,
    };
  });
}

function inferFloor(name: string, area: string | undefined, floors: FloorConfig[]): string {
  const haystack = normalize(`${name} ${area ?? ''}`);
  for (const floor of floors) {
    const zoneHit = floor.zones?.some((z) => haystack.includes(normalize(z)));
    const sensorHit = floor.room_sensors?.some((s) => haystack.includes(normalize(s)));
    if (zoneHit || sensorHit) return floor.name;
  }
  if (/office|hunter|sydney|upstair|primary bed|primary bath/.test(haystack)) return 'Upper Floor';
  return 'Main Floor';
}

function isStandaloneRoomSensor(name: string, entityId: string): boolean {
  const n = normalize(name);
  if (n.includes('floor temperature') || n.includes('room temperature')) return false;
  if (n.includes('current temperature') && n.includes('thermostat')) return false;
  if (!n.includes('temperature') && !entityId.includes('temperature')) return false;
  return true;
}

export function discoverRoomSensors(
  hass: HomeAssistant,
  config: ClimateCommandCenterConfig,
  zones: ClimateZone[]
): RoomSensor[] {
  if (config.show_room_sensors === false) return [];
  if (config.room_sensors?.length) {
    return config.room_sensors
      .map((entityId) => {
        const entity = getEntity(hass, entityId);
        if (!entity) return null;
        const floors = config.floors ?? DEFAULT_FLOORS;
        const name = dedupeFriendlyName(friendlyName(entity).replace(/\s+temperature$/i, ''));
        return {
          name,
          entity_id: entityId,
          area: entityArea(hass, entityId),
          floor: inferFloor(name, entityArea(hass, entityId), floors),
          temperature: parseNumber(entity),
        };
      })
      .filter((s): s is RoomSensor => s != null);
  }

  const usedIds = new Set<string>();
  for (const zone of config.zones ?? []) {
    if (zone.floor_sensor) usedIds.add(zone.floor_sensor);
    if (zone.room_sensor) usedIds.add(zone.room_sensor);
    if (zone.humidity_sensor) usedIds.add(zone.humidity_sensor);
  }

  for (const entity of Object.values(hass.states)) {
    if (!entity.entity_id.startsWith('sensor.')) continue;
    if (entity.attributes.device_class !== 'temperature') continue;
    const z = zones.find((zone) => normalize(friendlyName(entity as HassEntity)).includes(normalize(zone.name)));
    if (z) {
      const n = normalize(friendlyName(entity as HassEntity));
      if (n.includes('floor temperature') || n.includes('room temperature') || n.includes('humidity')) {
        usedIds.add(entity.entity_id);
      }
    }
  }

  const floors = config.floors ?? DEFAULT_FLOORS;
  const results: RoomSensor[] = [];

  for (const entity of Object.values(hass.states)) {
    if (!entity.entity_id.startsWith('sensor.')) continue;
    if (entity.attributes.device_class !== 'temperature') continue;
    if (usedIds.has(entity.entity_id)) continue;

    const nameRaw = friendlyName(entity as HassEntity);
    if (isExcluded(nameRaw, entity.entity_id)) continue;
    if (!isStandaloneRoomSensor(nameRaw, entity.entity_id)) continue;

    const name = dedupeFriendlyName(nameRaw.replace(/\s+temperature$/i, ''));
    const area = entityArea(hass, entity.entity_id);
    results.push({
      name,
      entity_id: entity.entity_id,
      area,
      floor: inferFloor(name, area, floors),
      temperature: parseNumber(entity as HassEntity),
    });
  }

  return results.sort((a, b) => a.name.localeCompare(b.name));
}

export function buildFloorSections(
  hass: HomeAssistant,
  config: ClimateCommandCenterConfig
): FloorSection[] {
  const floors = config.floors ?? DEFAULT_FLOORS;
  const zones = buildZones(hass, config);
  const roomSensors = discoverRoomSensors(hass, config, zones);
  const groupByFloor = config.group_by_floor !== false;

  if (!groupByFloor) {
    return [{ name: 'Climate Zones', zones, roomSensors }];
  }

  const sectionMap = new Map<string, FloorSection>();
  for (const floor of floors) {
    sectionMap.set(floor.name, { name: floor.name, zones: [], roomSensors: [] });
  }
  const other: FloorSection = { name: 'Other', zones: [], roomSensors: [] };

  const assignZoneFloor = (zone: ClimateZone): string => {
    if (zone.floor) return zone.floor;
    for (const floor of floors) {
      if (
        floor.zones?.some(
          (z) =>
            normalize(zone.name).includes(normalize(z)) || normalize(z).includes(normalize(zone.name))
        )
      ) {
        return floor.name;
      }
    }
    return inferFloor(zone.name, entityArea(hass, zone.climate_entity), floors);
  };

  for (const zone of zones) {
    const floorName = assignZoneFloor(zone);
    const section = sectionMap.get(floorName);
    if (section) section.zones.push(zone);
    else other.zones.push(zone);
  }

  for (const sensor of roomSensors) {
    const section = sectionMap.get(sensor.floor ?? '');
    if (section) section.roomSensors.push(sensor);
    else other.roomSensors.push(sensor);
  }

  const ordered = floors
    .map((f) => sectionMap.get(f.name)!)
    .filter((s) => s.zones.length || s.roomSensors.length);

  if (other.zones.length || other.roomSensors.length) ordered.push(other);
  return ordered;
}

export function getWeatherData(
  hass: HomeAssistant,
  config: ClimateCommandCenterConfig
): WeatherData | null {
  const findWeatherSensor = (pattern: string, deviceClass: 'temperature' | 'humidity' = 'temperature'): string | undefined =>
    Object.values(hass.states).find((e) => {
      const name = normalize(friendlyName(e as HassEntity));
      return (
        e.entity_id.startsWith('sensor.') &&
        e.attributes.device_class === deviceClass &&
        (name.includes('weather') || name.includes('tempest')) &&
        name.includes(normalize(pattern))
      );
    })?.entity_id;

  const tempEntity = getEntity(
    hass,
    config.weather_temperature ??
      findWeatherSensor('temperature') ??
      Object.values(hass.states).find((e) => {
        const name = normalize(friendlyName(e as HassEntity));
        return (
          e.entity_id.startsWith('sensor.') &&
          e.attributes.device_class === 'temperature' &&
          name.includes('weather station') &&
          name.includes('temperature') &&
          !name.includes('wet bulb') &&
          !name.includes('dew') &&
          !name.includes('feels')
        );
      })?.entity_id
  );

  if (!tempEntity) return null;

  const label =
    friendlyName(tempEntity).replace(/\s+(Temperature|Temp)$/i, '') || 'Outside';

  return {
    label,
    temperature: parseNumber(tempEntity),
    humidity: parseNumber(getEntity(hass, config.weather_humidity ?? findWeatherSensor('humidity', 'humidity'))),
    feels_like: parseNumber(
      getEntity(
        hass,
        config.weather_feels_like ??
          Object.values(hass.states).find((e) =>
            normalize(friendlyName(e as HassEntity)).includes('feels like')
          )?.entity_id
      )
    ),
    dew_point: parseNumber(
      getEntity(
        hass,
        config.weather_dew_point ??
          Object.values(hass.states).find((e) =>
            normalize(friendlyName(e as HassEntity)).includes('dew point')
          )?.entity_id
      )
    ),
  };
}
