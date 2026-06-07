import { AreaSensor, ClimateCommandCenterConfig, ClimateZone } from '../types';

export interface HeightPoint {  height_ft: number;
  temp: number;
  label: string;
}

export interface ZoneHeightStats {
  reference_height_ft: number;
  point_count: number;
  simple_average?: number;
  estimated_at_reference?: number;
  gradient_per_ft?: number;
}

export function estimateTempAtHeight(
  points: HeightPoint[],
  targetHeightFt: number
): { value?: number; gradient?: number } {
  if (!points.length) return {};
  if (points.length === 1) {
    return { value: points[0].temp };
  }

  const n = points.length;
  const sumH = points.reduce((s, p) => s + p.height_ft, 0);
  const sumT = points.reduce((s, p) => s + p.temp, 0);
  const sumHT = points.reduce((s, p) => s + p.height_ft * p.temp, 0);
  const sumH2 = points.reduce((s, p) => s + p.height_ft * p.height_ft, 0);
  const denom = n * sumH2 - sumH * sumH;

  if (Math.abs(denom) < 1e-6) {
    const avg = sumT / n;
    return { value: Math.round(avg * 10) / 10 };
  }

  const gradient = (n * sumHT - sumH * sumT) / denom;
  const intercept = (sumT - gradient * sumH) / n;
  const value = gradient * targetHeightFt + intercept;

  return {
    value: Math.round(value * 10) / 10,
    gradient: Math.round(gradient * 100) / 100,
  };
}

export function resolveSensorHeight(
  entityId: string,
  config: ClimateCommandCenterConfig,
  hints?: { kind?: 'room' | 'other'; isFloor?: boolean; isRoom?: boolean }
): number | undefined {
  const configured = config.sensor_heights?.[entityId];
  if (configured != null && !Number.isNaN(configured)) return configured;
  if (hints?.isFloor) return 0;
  if (hints?.isRoom) return 5;
  return undefined;
}

export function collectZoneHeightPoints(
  zone: ClimateZone,
  config: ClimateCommandCenterConfig,
  climateCurrent?: number
): HeightPoint[] {
  const points: HeightPoint[] = [];
  const heights = config.sensor_heights ?? {};
  const zoneHeights = config.zone_heights ?? {};

  const addPoint = (label: string, temp: number | undefined, entityId: string | undefined, hints?: {
    isFloor?: boolean;
    isRoom?: boolean;
  }) => {
    if (temp == null) return;
    const heightFt =
      (entityId ? heights[entityId] : undefined) ??
      resolveSensorHeight(entityId ?? '', config, hints);
    if (heightFt == null) return;
    points.push({ label, temp, height_ft: heightFt });
  };

  if (zone.sensors.floor != null) {
    addPoint('Floor', zone.sensors.floor, zone.linked_sensor_ids?.floor, { isFloor: true });
  }
  if (zone.sensors.room != null) {
    addPoint('Room', zone.sensors.room, zone.linked_sensor_ids?.room, { isRoom: true });
  }
  if (climateCurrent != null) {
    const heightFt = zoneHeights[zone.climate_entity] ?? config.reference_height_ft ?? 5;
    points.push({ label: 'Thermostat', temp: climateCurrent, height_ft: heightFt });
  }

  for (const sensor of zone.roomSensors) {
    if (sensor.value == null || sensor.height_ft == null) continue;
    points.push({ label: sensor.name, temp: sensor.value, height_ft: sensor.height_ft });
  }

  return points;
}

export function computeZoneHeightStats(
  zone: ClimateZone,
  config: ClimateCommandCenterConfig,
  climateCurrent?: number
): ZoneHeightStats | null {
  const reference = config.reference_height_ft ?? 5;
  const points = collectZoneHeightPoints(zone, config, climateCurrent);
  if (!points.length) return null;

  const simple_average = Math.round((points.reduce((s, p) => s + p.temp, 0) / points.length) * 10) / 10;
  const { value: estimated_at_reference, gradient } = estimateTempAtHeight(points, reference);

  return {
    reference_height_ft: reference,
    point_count: points.length,
    simple_average,
    estimated_at_reference,
    gradient_per_ft: gradient,
  };
}
