export interface ZoneConfig {
  name: string;
  climate_entity: string;
  floor?: string;
  area?: string;
  area_id?: string;
  floor_sensor?: string;
  room_sensor?: string;
  humidity_sensor?: string;
}

export interface FloorConfig {
  name: string;
  zones?: string[];
  room_sensors?: string[];
}

export interface SensorAssignment {
  entity_id: string;
  zone?: string;
  hidden?: boolean;
}

export interface ClimateCommandCenterConfig {
  type: 'custom:climate-command-center';
  title?: string;
  auto_discover?: boolean;
  show_weather?: boolean;
  show_room_sensors?: boolean;
  group_by_floor?: boolean;
  allow_sensor_reassign?: boolean;
  weather_entity?: string;
  weather_temperature?: string;
  weather_humidity?: string;
  weather_feels_like?: string;
  weather_dew_point?: string;
  zones?: ZoneConfig[];
  floors?: FloorConfig[];
  room_sensors?: string[];
  /** entity_id -> climate_entity_id */
  sensor_map?: Record<string, string>;
  /** entity_id list to hide completely */
  exclude_entities?: string[];
  /** entity_id -> height in feet from floor */
  sensor_heights?: Record<string, number>;
  /** climate_entity_id -> thermostat sensor height in feet */
  zone_heights?: Record<string, number>;
  /** climate_entity_id -> floor section name */
  zone_floors?: Record<string, string>;
  /** HA area_id or area name -> floor section name */
  area_floor_map?: Record<string, string>;
  /** target height for interpolated average (feet), default 5 */
  reference_height_ft?: number;
  /** legacy / alias for exclude_entities in editor */
  sensor_assignments?: SensorAssignment[];
  other_sensor_patterns?: string[];
  /** climate_entity_id -> 'floor_heat' | 'thermostat' override */
  zone_kinds?: Record<string, 'floor_heat' | 'thermostat'>;
  /** Floor plan visualization config */
  floor_plan?: FloorPlanConfig;
  /** Floor heating system config (supply/return temps, flow, etc.) */
  floor_system?: FloorSystemConfig;
  /** Google Maps Static API key for sun tracker background (optional, uses ESRI satellite if omitted) */
  google_maps_key?: string;
  /** Show sun tracker card */
  show_sun_tracker?: boolean;
}

export interface ZoneSensors {
  floor?: number;
  room?: number;
  humidity?: number;
}

export interface AreaSensor {
  name: string;
  entity_id: string;
  area?: string;
  area_id?: string;
  value?: number;
  unit?: string;
  kind: 'room' | 'other';
  height_ft?: number;
}

export interface ClimateZone {
  name: string;
  climate_entity: string;
  area?: string;
  area_id?: string;
  floor?: string;
  kind: 'floor_heat' | 'thermostat';
  sensors: ZoneSensors;
  roomSensors: AreaSensor[];
  otherSensors: AreaSensor[];
  linked_sensor_ids?: {
    floor?: string;
    room?: string;
    humidity?: string;
  };
}

export interface FloorSection {
  name: string;
  zones: ClimateZone[];
  unassignedSensors: AreaSensor[];
}

export interface ForecastEntry {
  datetime: string;
  temperature?: number;
  templow?: number;
  condition?: string;
  precipitation_probability?: number;
  precipitation?: number;
  wind_speed?: number;
}

export interface WeatherData {
  label: string;
  temperature?: number;
  humidity?: number;
  feels_like?: number;
  dew_point?: number;
  condition?: string;
  wind_speed?: number;
  wind_bearing?: number;
  wind_gust?: number;
  pressure?: number;
  uv_index?: number;
  visibility?: number;
  precipitation?: number;
  forecast?: ForecastEntry[];
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
}

export interface AssignableSensor {
  entity_id: string;
  name: string;
  area?: string;
  area_id?: string;
  value?: number;
  unit?: string;
  kind: 'room' | 'other';
  assigned_zone?: string;
  auto_zone?: string;
  auto_zone_name?: string;
  hidden: boolean;
  height_ft?: number;
}

export interface HaAreaOption {
  area_id: string;
  name: string;
}

export interface FloorPlanThermostat {
  entity_id: string;
  label: string;
  kind: 'wall' | 'floor';
  /** X position as percentage (0\u2013100) of floor plan width */
  x: number;
  /** Y position as percentage (0\u2013100) of floor plan height */
  y: number;
}

export interface FloorPlanArea {
  id: string;
  label: string;
  /** Position/size as percentage of floor plan image (0\u2013100) */
  x: number;
  y: number;
  w: number;
  h: number;
  zone?: number;
  heated?: boolean;
}

export interface FloorPlanConfig {
  image_url?: string;
  areas?: FloorPlanArea[];
  thermostats?: FloorPlanThermostat[];
}

export interface FloorSystemConfig {
  /** Supply water temperature sensor entity_id */
  supply_temp?: string;
  /** Return water temperature sensor entity_id */
  return_temp?: string;
  /** Flow rate sensor entity_id */
  flow_rate?: string;
  /** Boiler/pump status entity_id (binary_sensor or switch) */
  pump_status?: string;
  /** Additional sensor entity_ids to display */
  extra_sensors?: string[];
  /** Auto-discover floor system sensors by pattern matching */
  auto_discover?: boolean;
}

export interface FloorSystemMetric {
  entity_id: string;
  value: number;
  unit: string;
}

export interface FloorSystemData {
  supply_temp?: FloorSystemMetric;
  return_temp?: FloorSystemMetric;
  delta_t?: number;
  flow_rate?: FloorSystemMetric;
  pump_active?: boolean;
  pump_entity?: string;
  extra?: Array<{ entity_id: string; name: string; value: number; unit: string }>;
}

export interface SunData {
  state: 'above_horizon' | 'below_horizon';
  elevation: number;
  azimuth: number;
  rising: Date;
  setting: Date;
  /** 0 = sunrise, 0.5 = solar noon, 1 = sunset. <0 or >1 means night */
  progress: number;
  daylight_minutes: number;
  remaining_minutes: number;
}
