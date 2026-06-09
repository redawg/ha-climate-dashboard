import { HomeAssistant } from 'custom-card-helpers';
import { resolveSensorHeight } from './height-averages';
import {
  AreaSensor,
  AssignableSensor,
  ClimateCommandCenterConfig,
  ClimateZone,
  FloorConfig,
  FloorSection,
  HaAreaOption,
  HassEntity,
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
  'outdoor',
  'outside',
  'exterior',
  'sensorlinx',
  ...WEATHER_PATTERNS,
];

const DEFAULT_OTHER_PATTERNS = [
  'outlet',
  'plug',
  'switch',
  'hallway',
  'flex',
  'unifi',
  'usw',
  'uap',
  'udm',
  'signal level',
  'cloud connection',
  'network',
  'uptime',
  'cpu',
  'memory',
  'mac',
  'energy',
  'power',
  'voltage',
  'current',
  'consumption',
  'co2',
  'voc',
  'aqi',
  'auto-off',
  'auto-update',
  'led',
  'overheated',
  'smooth on',
  'smooth off',
];

export const DEFAULT_FLOORS: FloorConfig[] = [
  {
    name: 'Main Floor',
    zones: ['Laundry', 'Living Room', 'Main Area', 'Main Office', 'Redmond Thermostat'],
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
    zones: [],
    room_sensors: ['Hunters', 'Sydney', 'Upstair Office', 'Upstairs Office'],
  },
];

export const DEFAULT_AREA_FLOOR_MAP: Record<string, string> = {
  office: 'Main Floor',
  'Main Office': 'Main Floor',
  upstairs_office: 'Upper Floor',
  upstairs_hallway: 'Upper Floor',
  hunters_room: 'Upper Floor',
  sidney_s_room: 'Upper Floor',
  'Upstairs Office': 'Upper Floor',
  'Upstairs Hallway': 'Upper Floor',
  'Hunters Room': 'Upper Floor',
  "Sidney's Room": 'Upper Floor',
};

export const DEFAULT_ZONE_FLOORS: Record<string, string> = {};

function floorZoneNameMatches(zoneName: string, floorZoneName: string): boolean {
  const z = normalize(zoneName);
  const f = normalize(floorZoneName);
  if (z === f) return true;
  // Require whole-token overlap so "Main Office" does not match "Main Area"
  const zTokens = z.split(' ');
  const fTokens = f.split(' ');
  if (zTokens[0] === fTokens[0] && zTokens.length > 1 && fTokens.length > 1 && zTokens[0] === 'main') {
    return zTokens.slice(1).join(' ') === fTokens.slice(1).join(' ');
  }
  return z.includes(f) || f.includes(z);
}

export function listHaAreas(hass: HomeAssistant): HaAreaOption[] {
  const areas = (hass as HomeAssistant & { areas?: Record<string, { name?: string }> }).areas;
  if (!areas) return [];
  return Object.entries(areas)
    .map(([area_id, entry]) => ({ area_id, name: entry.name ?? area_id }))
    .filter((a) => !['weather', 'whole_house_energy'].includes(a.area_id))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function floorNames(config: ClimateCommandCenterConfig): string[] {
  return (config.floors ?? DEFAULT_FLOORS).map((f) => f.name);
}

function mergedAreaFloorMap(config: ClimateCommandCenterConfig): Record<string, string> {
  return { ...DEFAULT_AREA_FLOOR_MAP, ...(config.area_floor_map ?? {}) };
}

function mergedZoneFloors(config: ClimateCommandCenterConfig): Record<string, string> {
  return { ...DEFAULT_ZONE_FLOORS, ...(config.zone_floors ?? {}) };
}

function lookupAreaFloor(
  areaId: string | undefined,
  areaName: string | undefined,
  config: ClimateCommandCenterConfig
): string | undefined {
  const map = mergedAreaFloorMap(config);
  if (areaId && map[areaId]) return map[areaId];
  if (areaName && map[areaName]) return map[areaName];
  return undefined;
}

export function resolveZoneFloor(
  zone: ClimateZone,
  config: ClimateCommandCenterConfig,
  floors: FloorConfig[] = config.floors ?? DEFAULT_FLOORS
): string {
  const zoneFloors = mergedZoneFloors(config);
  if (zoneFloors[zone.climate_entity]) return zoneFloors[zone.climate_entity];

  for (const floor of floors) {
    if (floor.zones?.some((z) => floorZoneNameMatches(zone.name, z))) {
      return floor.name;
    }
  }

  const byArea = lookupAreaFloor(zone.area_id, zone.area, config);
  if (byArea) return byArea;

  if (zone.floor) return zone.floor;

  return inferFloor(zone.name, zone.area, floors);
}

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

function entityAreaId(hass: HomeAssistant, entityId: string): string | undefined {
  const reg = (hass as HomeAssistant & {
    entities?: Record<string, { area_id?: string | null; device_id?: string | null }>;
    devices?: Record<string, { area_id?: string | null }>;
  }).entities?.[entityId];

  if (reg?.area_id) return reg.area_id;

  const deviceId = reg?.device_id;
  if (deviceId) {
    const deviceArea = (hass as HomeAssistant & {
      devices?: Record<string, { area_id?: string | null }>;
    }).devices?.[deviceId]?.area_id;
    if (deviceArea) return deviceArea;
  }

  return undefined;
}

function areaName(hass: HomeAssistant, areaId: string | undefined): string | undefined {
  if (!areaId) return undefined;
  const areas = (hass as HomeAssistant & { areas?: Record<string, { name?: string }> }).areas;
  return areas?.[areaId]?.name;
}

function entityArea(hass: HomeAssistant, entityId: string): string | undefined {
  return areaName(hass, entityAreaId(hass, entityId));
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

function excludedSet(config: ClimateCommandCenterConfig): Set<string> {
  const hidden = new Set(config.exclude_entities ?? []);
  for (const item of config.sensor_assignments ?? []) {
    if (item.hidden) hidden.add(item.entity_id);
  }
  return hidden;
}

function sensorMap(config: ClimateCommandCenterConfig): Map<string, string> {
  const map = new Map<string, string>(Object.entries(config.sensor_map ?? {}));
  for (const item of config.sensor_assignments ?? []) {
    if (item.zone && !item.hidden) map.set(item.entity_id, item.zone);
  }
  return map;
}

function isExcluded(name: string, entityId: string, extra: string[] = []): boolean {
  const haystack = `${normalize(name)} ${normalize(entityId)}`;
  return [...EXCLUDE_PATTERNS, ...extra].some((p) => haystack.includes(normalize(p)));
}

function climateZoneSlug(climateEntityId: string): string {
  const slug = climateEntityId.replace(/^climate\./, '');
  const parts = slug.split('_');
  if (parts.length >= 2 && parts.length % 2 === 0) {
    const half = parts.length / 2;
    const first = parts.slice(0, half).join('_');
    const second = parts.slice(half).join('_');
    if (first === second) return first;
  }
  return slug;
}

function floorHeatSensorIds(hass: HomeAssistant): Set<string> {
  const ids = new Set<string>();
  for (const entity of Object.values(hass.states)) {
    if (!entity.entity_id.startsWith('climate.')) continue;
    const zoneSlug = climateZoneSlug(entity.entity_id);
    ids.add(`sensor.${zoneSlug}_floor_temperature`);
    ids.add(`sensor.${zoneSlug}_room_temperature`);
  }
  return ids;
}

/** Floor-heat companion sensors and thermostat built-in readings — not standalone room sensors. */
function isClimateLinkedSensor(
  entityId: string,
  name: string,
  floorHeatIds: Set<string>
): boolean {
  if (floorHeatIds.has(entityId)) return true;
  const n = normalize(name);
  return n.includes('current temperature') && n.includes('thermostat');
}

function isClimateSensorEntity(entity: HassEntity): boolean {
  const deviceClass = entity.attributes.device_class as string | undefined;
  if (deviceClass === 'temperature' || deviceClass === 'humidity') return true;
  const stateClass = entity.attributes.state_class as string | undefined;
  const unit = entity.attributes.unit_of_measurement as string | undefined;
  if (stateClass === 'measurement' && unit) {
    if (unit === '%') return true;
    if (/°|deg/i.test(unit)) return true;
  }
  return false;
}

function isOtherSensor(name: string, entityId: string, patterns: string[]): boolean {
  const haystack = `${normalize(name)} ${normalize(entityId)}`;
  return patterns.some((p) => haystack.includes(normalize(p)));
}

function sensorKind(
  name: string,
  entityId: string,
  deviceClass: string | undefined,
  patterns: string[]
): 'room' | 'other' {
  if (isOtherSensor(name, entityId, patterns)) return 'other';
  if (deviceClass === 'temperature' || deviceClass === 'humidity') return 'room';
  return 'other';
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
  deviceClass: 'temperature' | 'humidity',
  climateEntityId?: string
): string | undefined {
  const zoneAreaId = climateEntityId ? entityAreaId(hass, climateEntityId) : undefined;
  let best: { id: string; score: number } | undefined;
  for (const entity of Object.values(hass.states)) {
    if (!entity.entity_id.startsWith('sensor.')) continue;
    if (entity.attributes.device_class !== deviceClass) continue;
    const name = friendlyName(entity as HassEntity);
    if (isExcluded(name, entity.entity_id)) continue;
    let score = scoreMatch(name, entity.entity_id, zoneName, hint);
    if (zoneAreaId && entityAreaId(hass, entity.entity_id) === zoneAreaId) score += 6;
    if (score >= 5 && (!best || score > best.score)) {
      best = { id: entity.entity_id, score };
    }
  }
  return best?.id;
}

function resolveLinkedSensorIds(
  hass: HomeAssistant,
  zone: ZoneConfig
): ClimateZone['linked_sensor_ids'] {
  return {
    floor:
      zone.floor_sensor ??
      findBestSensor(hass, zone.name, 'floor temperature', 'temperature', zone.climate_entity),
    room:
      zone.room_sensor ??
      findBestSensor(hass, zone.name, 'room temperature', 'temperature', zone.climate_entity),
    humidity:
      zone.humidity_sensor ??
      findBestSensor(hass, zone.name, 'humidity', 'humidity', zone.climate_entity),
  };
}

function resolveSensors(hass: HomeAssistant, zone: ZoneConfig): ZoneSensors {
  const links = resolveLinkedSensorIds(hass, zone);
  const floorEntity = getEntity(hass, links.floor);
  const roomEntity = getEntity(hass, links.room);
  const humidityEntity = getEntity(hass, links.humidity);

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
      const area_id = entityAreaId(hass, e.entity_id);
      return {
        name: dedupeFriendlyName(rawName),
        climate_entity: e.entity_id,
        area: areaName(hass, area_id),
        area_id,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

function inferFloor(name: string, area: string | undefined, floors: FloorConfig[]): string {
  const haystack = normalize(`${name} ${area ?? ''}`);
  for (const floor of floors) {
    const zoneHit = floor.zones?.some((z) => haystack.includes(normalize(z)));
    const sensorHit = floor.room_sensors?.some((s) => haystack.includes(normalize(s)));
    if (zoneHit || sensorHit) return floor.name;
  }
  if (/hunter|sydney|upstair/.test(haystack)) return 'Upper Floor';
  return 'Main Floor';
}

function areasMatch(a?: string, b?: string): boolean {
  if (!a || !b) return false;
  return normalize(a) === normalize(b);
}

function namesMatchZone(sensorName: string, zone: ClimateZone): boolean {
  const nSensor = normalize(sensorName);
  const nZone = normalize(zone.name);
  return nSensor.includes(nZone) || nZone.includes(nSensor);
}

function resolveZoneTarget(
  target: string,
  zones: ClimateZone[]
): ClimateZone | undefined {
  return zones.find(
    (z) =>
      z.climate_entity === target ||
      normalize(z.name) === normalize(target) ||
      normalize(z.climate_entity) === normalize(target)
  );
}

function friendlyLabel(nameRaw: string, entityId: string): string {
  let label = dedupeFriendlyName(nameRaw.replace(/\s+(temperature|humidity|temp)$/i, ''));
  const hay = `${normalize(nameRaw)} ${normalize(entityId)}`;
  if (hay.includes('outdoor reset')) {
    const zoneMatch = nameRaw.match(/:\s*(.+)$/);
    return zoneMatch ? `Outdoor reset target (${zoneMatch[1].trim()})` : 'Outdoor reset target';
  }
  if (hay.includes('ecobee') && hay.includes('remote')) {
    label = label.replace(/\s*ecobee\s*/i, ' ').trim();
    if (!/remote/i.test(label)) label = `${label} (Remote)`;
  }
  return label;
}

function buildAreaSensor(
  hass: HomeAssistant,
  entityId: string,
  patterns: string[],
  config: ClimateCommandCenterConfig
): AreaSensor | undefined {
  const entity = getEntity(hass, entityId);
  if (!entity) return undefined;
  const deviceClass = entity.attributes.device_class as string | undefined;
  const nameRaw = friendlyName(entity);
  const name = friendlyLabel(nameRaw, entityId);
  const unit = (entity.attributes.unit_of_measurement as string | undefined) ?? (deviceClass === 'humidity' ? '%' : '°');
  const kind = sensorKind(nameRaw, entityId, deviceClass, patterns);
  const isFloor = /floor/i.test(nameRaw) || /floor/i.test(entityId);
  const area_id = entityAreaId(hass, entityId);
  return {
    name,
    entity_id: entityId,
    area: areaName(hass, area_id),
    area_id,
    value: parseNumber(entity),
    unit,
    kind,
    height_ft: resolveSensorHeight(entityId, config, {
      kind,
      isFloor,
      isRoom: kind === 'room' && !isFloor,
    }),
  };
}

function climateLinkedSensorIds(hass: HomeAssistant, config: ClimateCommandCenterConfig, zones: ClimateZone[]): Set<string> {
  const used = new Set<string>();
  for (const zone of config.zones ?? []) {
    if (zone.floor_sensor) used.add(zone.floor_sensor);
    if (zone.room_sensor) used.add(zone.room_sensor);
    if (zone.humidity_sensor) used.add(zone.humidity_sensor);
  }
  for (const zone of zones) {
    const zc: ZoneConfig = config.zones?.find((z) => z.climate_entity === zone.climate_entity) ?? {
      name: zone.name,
      climate_entity: zone.climate_entity,
    };
    for (const id of [
      zc.floor_sensor ??
        findBestSensor(hass, zone.name, 'floor temperature', 'temperature', zone.climate_entity),
      zc.room_sensor ??
        findBestSensor(hass, zone.name, 'room temperature', 'temperature', zone.climate_entity),
      zc.humidity_sensor ??
        findBestSensor(hass, zone.name, 'humidity', 'humidity', zone.climate_entity),
    ]) {
      if (id) used.add(id);
    }
  }
  return used;
}

function collectAssignableEntityIds(
  hass: HomeAssistant,
  config: ClimateCommandCenterConfig,
  zones: ClimateZone[]
): string[] {
  if (config.room_sensors?.length) return [...config.room_sensors];

  const linked = climateLinkedSensorIds(hass, config, zones);
  const floorHeatIds = floorHeatSensorIds(hass);
  const ids: string[] = [];

  for (const entity of Object.values(hass.states)) {
    if (!entity.entity_id.startsWith('sensor.')) continue;
    if (!isClimateSensorEntity(entity as HassEntity)) continue;
    if (linked.has(entity.entity_id)) continue;
    const nameRaw = friendlyName(entity as HassEntity);
    if (isExcluded(nameRaw, entity.entity_id)) continue;
    if (isClimateLinkedSensor(entity.entity_id, nameRaw, floorHeatIds)) continue;
    ids.push(entity.entity_id);
  }

  for (const entityId of sensorMap(config).keys()) {
    if (!ids.includes(entityId)) ids.push(entityId);
  }

  return ids.sort();
}

export function autoAssignSensorToZone(sensor: AreaSensor, zones: ClimateZone[]): ClimateZone | undefined {
  if (sensor.area_id) {
    const byAreaId = zones.find((z) => z.area_id && z.area_id === sensor.area_id);
    if (byAreaId) return byAreaId;
  }

  const byArea = zones.find((z) => areasMatch(sensor.area, z.area));
  if (byArea) return byArea;

  return zones.find((z) => namesMatchZone(sensor.name, z));
}

function assignSensorToZone(
  sensor: AreaSensor,
  zones: ClimateZone[],
  config: ClimateCommandCenterConfig
): ClimateZone | undefined {
  const overrides = sensorMap(config);
  const overrideTarget = overrides.get(sensor.entity_id);
  if (overrideTarget) return resolveZoneTarget(overrideTarget, zones);

  return autoAssignSensorToZone(sensor, zones);
}

export function buildZones(hass: HomeAssistant, config: ClimateCommandCenterConfig): ClimateZone[] {
  const zoneConfigs =
    config.zones?.length ? config.zones : config.auto_discover ? autoDiscoverZones(hass) : [];

  return zoneConfigs.map((zone) => {
    const sensors = resolveSensors(hass, zone);
    const area_id = zone.area_id ?? entityAreaId(hass, zone.climate_entity);
    const area = zone.area ?? areaName(hass, area_id);
    const linked_sensor_ids = resolveLinkedSensorIds(hass, zone);
    return {
      name: zone.name,
      climate_entity: zone.climate_entity,
      area,
      area_id,
      floor: zone.floor,
      kind: zoneKind(hass, zone, sensors),
      sensors,
      roomSensors: [],
      otherSensors: [],
      linked_sensor_ids,
    };
  });
}

export function attachSensorsToZones(
  hass: HomeAssistant,
  config: ClimateCommandCenterConfig,
  zones: ClimateZone[]
): { zones: ClimateZone[]; unassigned: AreaSensor[] } {
  if (config.show_room_sensors === false) return { zones, unassigned: [] };

  const hidden = excludedSet(config);
  const patterns = config.other_sensor_patterns ?? DEFAULT_OTHER_PATTERNS;
  const unassigned: AreaSensor[] = [];

  const enriched = zones.map((z) => ({ ...z, roomSensors: [] as AreaSensor[], otherSensors: [] as AreaSensor[] }));

  for (const entityId of collectAssignableEntityIds(hass, config, zones)) {
    if (hidden.has(entityId)) continue;
    const sensor = buildAreaSensor(hass, entityId, patterns, config);
    if (!sensor || sensor.value == null) continue;

    const zone = assignSensorToZone(sensor, enriched, config);
    if (!zone) {
      unassigned.push(sensor);
      continue;
    }
    const target = enriched.find((z) => z.climate_entity === zone.climate_entity)!;
    if (sensor.kind === 'other') target.otherSensors.push(sensor);
    else target.roomSensors.push(sensor);
  }

  for (const z of enriched) {
    z.roomSensors.sort((a, b) => a.name.localeCompare(b.name));
    z.otherSensors.sort((a, b) => a.name.localeCompare(b.name));
  }
  unassigned.sort((a, b) => a.name.localeCompare(b.name));

  return { zones: enriched, unassigned };
}

export function buildFloorSections(
  hass: HomeAssistant,
  config: ClimateCommandCenterConfig
): FloorSection[] {
  const floors = config.floors ?? DEFAULT_FLOORS;
  const baseZones = buildZones(hass, config);
  const { zones, unassigned } = attachSensorsToZones(hass, config, baseZones);
  const groupByFloor = config.group_by_floor !== false;

  if (!groupByFloor) {
    return [{ name: 'Climate Zones', zones, unassignedSensors: unassigned }];
  }

  const sectionMap = new Map<string, FloorSection>();
  for (const floor of floors) {
    sectionMap.set(floor.name, { name: floor.name, zones: [], unassignedSensors: [] });
  }
  const other: FloorSection = { name: 'Other', zones: [], unassignedSensors: [] };

  const assignZoneFloor = (zone: ClimateZone): string => resolveZoneFloor(zone, config, floors);

  for (const zone of zones) {
    const floorName = assignZoneFloor(zone);
    const section = sectionMap.get(floorName);
    if (section) section.zones.push(zone);
    else other.zones.push(zone);
  }

  for (const sensor of unassigned) {
    const floorName =
      lookupAreaFloor(sensor.area_id, sensor.area, config) ?? inferFloor(sensor.name, sensor.area, floors);
    const section = sectionMap.get(floorName);
    if (section) section.unassignedSensors.push(sensor);
    else other.unassignedSensors.push(sensor);
  }

  const ordered = floors
    .map((f) => sectionMap.get(f.name)!)
    .filter((s) => s.zones.length || s.unassignedSensors.length);

  if (other.zones.length || other.unassignedSensors.length) ordered.push(other);
  return ordered;
}

export function listAssignableSensors(
  hass: HomeAssistant,
  config: ClimateCommandCenterConfig
): AssignableSensor[] {
  const zones = buildZones(hass, config);
  const hidden = excludedSet(config);
  const overrides = sensorMap(config);
  const patterns = config.other_sensor_patterns ?? DEFAULT_OTHER_PATTERNS;

  return collectAssignableEntityIds(hass, config, zones).map((entityId) => {
    const sensor = buildAreaSensor(hass, entityId, patterns, config);
    const assigned = overrides.get(entityId);
    const autoZone = sensor ? autoAssignSensorToZone(sensor, zones) : undefined;
    return {
      entity_id: entityId,
      name: sensor?.name ?? entityId,
      area: sensor?.area,
      area_id: sensor?.area_id,
      value: sensor?.value,
      unit: sensor?.unit,
      kind: sensor?.kind ?? 'other',
      assigned_zone: assigned,
      auto_zone: autoZone?.climate_entity,
      auto_zone_name: autoZone?.name,
      hidden: hidden.has(entityId),
      height_ft: sensor?.height_ft,
    };
  });
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

  const label = friendlyName(tempEntity).replace(/\s+(Temperature|Temp)$/i, '') || 'Outside';

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
