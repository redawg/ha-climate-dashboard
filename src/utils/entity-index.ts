import { HomeAssistant } from 'custom-card-helpers';
import {
  ClimateCommandCenterConfig,
  HassEntity,
  ZoneConfig,
  ZoneValve,
} from '../types';
import { listWwsdEntityIds } from './wwsd';

/** Cached scan results — rebuilt when entity count or config changes. */
export interface EntityIndex {
  entityCount: number;
  configKey: string;
  climateIds: string[];
  temperatureSensorIds: string[];
  humiditySensorIds: string[];
  floorHeatLinkedIds: Set<string>;
  /** Precomputed when config.room_sensors is unset */
  assignableSensorIds: string[] | null;
  /** climate_entity -> valve entity ids (discovery only; state read at use time) */
  valveIdsByClimate: Map<string, string[]>;
  allValveEntityIds: Set<string>;
}

let cachedIndex: EntityIndex | null = null;

export function invalidateEntityIndex(): void {
  cachedIndex = null;
}

export function configCacheKey(config: ClimateCommandCenterConfig): string {
  return JSON.stringify({
    auto_discover: config.auto_discover,
    zones: config.zones,
    room_sensors: config.room_sensors,
    sensor_map: config.sensor_map,
    exclude_entities: config.exclude_entities,
    sensor_assignments: config.sensor_assignments,
    zone_kinds: config.zone_kinds,
    other_sensor_patterns: config.other_sensor_patterns,
  });
}

type IndexDeps = {
  normalize: (value: string) => string;
  friendlyName: (entity: HassEntity) => string;
  entityAreaId: (hass: HomeAssistant, entityId: string) => string | undefined;
  climateZoneSlug: (climateEntityId: string) => string;
  isExcluded: (name: string, entityId: string, extra?: string[]) => boolean;
  isClimateSensorEntity: (entity: HassEntity) => boolean;
  isClimateLinkedSensor: (entityId: string, name: string, floorHeatIds: Set<string>) => boolean;
  discoverValveEntityIds: (
    hass: HomeAssistant,
    climateEntity: string,
    zoneConfig?: ZoneConfig
  ) => string[];
  buildAssignableSensorIds: (
    hass: HomeAssistant,
    config: ClimateCommandCenterConfig,
    floorHeatIds: Set<string>,
    candidateSensorIds: string[],
    zoneConfigs: ZoneConfig[],
    tempIds: string[],
    humIds: string[]
  ) => string[];
};

let indexDeps: IndexDeps | null = null;

/** Wire resolver helpers after entity-resolver module init (avoids circular imports). */
export function registerEntityIndexDeps(deps: IndexDeps): void {
  indexDeps = deps;
}

export function getEntityIndex(
  hass: HomeAssistant,
  config: ClimateCommandCenterConfig
): EntityIndex {
  const entityCount = Object.keys(hass.states).length;
  const configKey = configCacheKey(config);
  if (
    cachedIndex &&
    cachedIndex.entityCount === entityCount &&
    cachedIndex.configKey === configKey
  ) {
    return cachedIndex;
  }
  if (!indexDeps) {
    throw new Error('entity-index: registerEntityIndexDeps not called');
  }

  const climateIds: string[] = [];
  const temperatureSensorIds: string[] = [];
  const humiditySensorIds: string[] = [];
  const floorHeatLinkedIds = new Set<string>();

  for (const entity of Object.values(hass.states)) {
    const eid = entity.entity_id;
    if (eid.startsWith('climate.')) {
      climateIds.push(eid);
      const zoneSlug = indexDeps.climateZoneSlug(eid);
      floorHeatLinkedIds.add(`sensor.${zoneSlug}_floor_temperature`);
      floorHeatLinkedIds.add(`sensor.${zoneSlug}_room_temperature`);
    } else if (eid.startsWith('sensor.')) {
      const dc = entity.attributes.device_class as string | undefined;
      if (dc === 'temperature') temperatureSensorIds.push(eid);
      else if (dc === 'humidity') humiditySensorIds.push(eid);
    }
  }

  climateIds.sort();

  const zoneConfigs: ZoneConfig[] = config.zones?.length
    ? config.zones
    : climateIds.map((eid) => {
        const entity = hass.states[eid] as HassEntity;
        const rawName =
          (entity?.attributes?.friendly_name as string | undefined) ??
          eid.replace('climate.', '').replace(/_/g, ' ');
        return {
          name: rawName,
          climate_entity: eid,
          area_id: indexDeps!.entityAreaId(hass, eid),
        };
      });

  const candidateSensorIds = [...temperatureSensorIds, ...humiditySensorIds];

  const assignableSensorIds = config.room_sensors?.length
    ? null
    : indexDeps.buildAssignableSensorIds(
        hass,
        config,
        floorHeatLinkedIds,
        candidateSensorIds,
        zoneConfigs,
        temperatureSensorIds,
        humiditySensorIds
      );

  const valveIdsByClimate = new Map<string, string[]>();
  const allValveEntityIds = new Set<string>();
  for (const zone of zoneConfigs) {
    const ids = indexDeps.discoverValveEntityIds(hass, zone.climate_entity, zone);
    valveIdsByClimate.set(zone.climate_entity, ids);
    for (const id of ids) allValveEntityIds.add(id);
  }

  cachedIndex = {
    entityCount,
    configKey,
    climateIds,
    temperatureSensorIds,
    humiditySensorIds,
    floorHeatLinkedIds,
    assignableSensorIds,
    valveIdsByClimate,
    allValveEntityIds,
  };
  return cachedIndex;
}

export function valvesFromEntityIds(hass: HomeAssistant, entityIds: string[]): ZoneValve[] {
  const valves: ZoneValve[] = [];
  for (const eid of entityIds) {
    const state = hass.states[eid];
    if (!state) continue;
    if (eid.startsWith('number.') || eid.startsWith('sensor.')) {
      const pos = parseFloat(state.state);
      if (!isNaN(pos)) {
        valves.push({ entity_id: eid, position: pos, active: pos > 0 });
      }
    } else if (eid.startsWith('switch.') || eid.startsWith('binary_sensor.')) {
      const active = state.state === 'on';
      valves.push({ entity_id: eid, position: active ? 100 : 0, active });
    }
  }
  return valves;
}

export function resolveWeatherEntityId(
  hass: HomeAssistant,
  config: ClimateCommandCenterConfig
): string | undefined {
  if (config.weather_entity) return config.weather_entity;
  return (
    Object.keys(hass.states).find(
      (eid) =>
        eid.startsWith('weather.') &&
        (eid.includes('weatherflow') || eid.includes('tempest'))
    ) ?? Object.keys(hass.states).find((eid) => eid.startsWith('weather.'))
  );
}

export function getTrackedEntityIds(
  hass: HomeAssistant,
  config: ClimateCommandCenterConfig,
  index: EntityIndex,
  floorSystemEntityIds: string[] | null | undefined
): string[] {
  const ids = new Set<string>(index.climateIds);
  ids.add('sun.sun');

  const weatherId = resolveWeatherEntityId(hass, config);
  if (weatherId) ids.add(weatherId);

  if (index.assignableSensorIds) {
    for (const eid of index.assignableSensorIds) ids.add(eid);
  } else if (config.room_sensors?.length) {
    for (const eid of config.room_sensors) ids.add(eid);
  }

  for (const eid of index.allValveEntityIds) ids.add(eid);

  if (floorSystemEntityIds?.length) {
    for (const eid of floorSystemEntityIds) ids.add(eid);
  }

  for (const eid of Object.keys(config.sensor_map ?? {})) ids.add(eid);

  for (const eid of listWwsdEntityIds(hass, config)) ids.add(eid);

  return [...ids];
}

export function trackedStatesChanged(
  prev: HomeAssistant,
  next: HomeAssistant,
  trackedIds: string[]
): boolean {
  for (const entityId of trackedIds) {
    const oldState = prev.states[entityId];
    const newState = next.states[entityId];
    if (!oldState || !newState) {
      if (oldState !== newState) return true;
      continue;
    }
    if (oldState.state !== newState.state) return true;
    if (oldState.last_updated !== newState.last_updated) return true;
  }
  return false;
}
