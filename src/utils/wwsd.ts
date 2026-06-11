import { HomeAssistant } from 'custom-card-helpers';
import { ClimateCommandCenterConfig, WwsdState } from '../types';

const DEFAULT_SHUTDOWN_ENTITY = 'number.sensorlinx_outdoor_reset_heating_curve_shutdown_temp';
const DEFAULT_OUTDOOR_RESET_ENABLED = 'switch.sensorlinx_outdoor_reset_outdoor_reset_enabled';

function resolveWeatherEntityId(
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

function parseNumericState(state: string | undefined): number | undefined {
  if (state == null || state === 'unavailable' || state === 'unknown') return undefined;
  const n = Number(state);
  return Number.isFinite(n) ? n : undefined;
}

function normalizeTempUnit(unit?: string): 'F' | 'C' | undefined {
  if (!unit) return undefined;
  const u = unit.replace('°', '').trim().toUpperCase();
  if (u === 'F' || u === 'FAHRENHEIT') return 'F';
  if (u === 'C' || u === 'CELSIUS') return 'C';
  return undefined;
}

function toFahrenheit(value: number, unit?: 'F' | 'C'): number {
  if (unit === 'C') return (value * 9) / 5 + 32;
  return value;
}

function entityTemp(
  hass: HomeAssistant,
  entityId: string | undefined
): { value?: number; unit?: 'F' | 'C' } {
  if (!entityId) return {};
  const entity = hass.states[entityId];
  if (!entity) return {};
  const value = parseNumericState(entity.state);
  const unit =
    normalizeTempUnit(entity.attributes.unit_of_measurement as string | undefined) ??
    normalizeTempUnit(entity.attributes.temperature_unit as string | undefined);
  return { value, unit };
}

function outdoorTempFromWeather(
  hass: HomeAssistant,
  config: ClimateCommandCenterConfig
): { value?: number; unit?: 'F' | 'C' } {
  const weatherId = resolveWeatherEntityId(hass, config);
  if (!weatherId) return {};
  const weather = hass.states[weatherId];
  if (!weather) return {};

  const explicit = config.weather_temperature
    ? entityTemp(hass, config.weather_temperature)
    : {};
  if (explicit.value != null) return explicit;

  const attrTemp = weather.attributes.temperature as number | undefined;
  if (attrTemp != null && Number.isFinite(attrTemp)) {
    const unit =
      normalizeTempUnit(weather.attributes.temperature_unit as string | undefined) ??
      normalizeTempUnit(hass.config?.unit_system?.temperature as string | undefined);
    return { value: attrTemp, unit };
  }

  const stateTemp = parseNumericState(weather.state);
  if (stateTemp != null) return { value: stateTemp, unit: 'F' };
  return {};
}

function isEntityActive(hass: HomeAssistant, entityId: string): boolean | undefined {
  const entity = hass.states[entityId];
  if (!entity) return undefined;
  const state = entity.state.toLowerCase();
  if (state === 'on' || state === 'active' || state === 'wwsd') return true;
  if (state === 'off' || state === 'inactive' || state === 'idle') return false;
  return undefined;
}

export function listWwsdEntityIds(
  hass: HomeAssistant,
  config: ClimateCommandCenterConfig
): string[] {
  const ids = new Set<string>();
  if (config.wwsd_entity) ids.add(config.wwsd_entity);

  const shutdownId = config.wwsd_shutdown_temp_entity ?? DEFAULT_SHUTDOWN_ENTITY;
  if (hass.states[shutdownId]) ids.add(shutdownId);

  if (hass.states[DEFAULT_OUTDOOR_RESET_ENABLED]) ids.add(DEFAULT_OUTDOOR_RESET_ENABLED);

  if (config.wwsd_outdoor_temp_entity) ids.add(config.wwsd_outdoor_temp_entity);
  if (config.weather_temperature) ids.add(config.weather_temperature);

  return [...ids];
}

export function resolveWwsdState(
  hass: HomeAssistant,
  config: ClimateCommandCenterConfig
): WwsdState {
  if (config.wwsd_entity === false) {
    return { active: false };
  }

  if (config.wwsd_entity) {
    const explicit = isEntityActive(hass, config.wwsd_entity);
    if (explicit != null) {
      return { active: explicit };
    }
  }

  const resetEnabled = hass.states[DEFAULT_OUTDOOR_RESET_ENABLED];
  if (resetEnabled && resetEnabled.state === 'off') {
    return { active: false };
  }

  const shutdownId = config.wwsd_shutdown_temp_entity ?? DEFAULT_SHUTDOWN_ENTITY;
  const shutdown = entityTemp(hass, shutdownId);
  if (shutdown.value == null || shutdown.value <= 0) {
    return { active: false, shutdownTemp: shutdown.value, shutdownUnit: shutdown.unit ?? 'F' };
  }

  const outdoor = config.wwsd_outdoor_temp_entity
    ? entityTemp(hass, config.wwsd_outdoor_temp_entity)
    : outdoorTempFromWeather(hass, config);

  if (outdoor.value == null) {
    return {
      active: false,
      outdoorTemp: undefined,
      outdoorUnit: outdoor.unit,
      shutdownTemp: shutdown.value,
      shutdownUnit: shutdown.unit ?? 'F',
    };
  }

  const outdoorF = toFahrenheit(outdoor.value, outdoor.unit);
  const shutdownF = toFahrenheit(shutdown.value, shutdown.unit ?? 'F');

  return {
    active: outdoorF >= shutdownF,
    outdoorTemp: outdoor.value,
    outdoorUnit: outdoor.unit,
    shutdownTemp: shutdown.value,
    shutdownUnit: shutdown.unit ?? 'F',
  };
}
