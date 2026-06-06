export interface ZoneConfig {
  name: string;
  climate_entity: string;
  floor?: string;
  floor_sensor?: string;
  room_sensor?: string;
  humidity_sensor?: string;
}

export interface FloorConfig {
  name: string;
  zones?: string[];
  room_sensors?: string[];
}

export interface ClimateCommandCenterConfig {
  type: 'custom:climate-command-center';
  title?: string;
  auto_discover?: boolean;
  show_weather?: boolean;
  show_room_sensors?: boolean;
  group_by_floor?: boolean;
  weather_entity?: string;
  weather_temperature?: string;
  weather_humidity?: string;
  weather_feels_like?: string;
  weather_dew_point?: string;
  zones?: ZoneConfig[];
  floors?: FloorConfig[];
  room_sensors?: string[];
  exclude_entities?: string[];
}

export interface ZoneSensors {
  floor?: number;
  room?: number;
  humidity?: number;
}

export interface ClimateZone {
  name: string;
  climate_entity: string;
  floor?: string;
  kind: 'floor_heat' | 'thermostat';
  sensors: ZoneSensors;
}

export interface RoomSensor {
  name: string;
  entity_id: string;
  area?: string;
  floor?: string;
  temperature?: number;
}

export interface FloorSection {
  name: string;
  zones: ClimateZone[];
  roomSensors: RoomSensor[];
}

export interface WeatherData {
  label: string;
  temperature?: number;
  humidity?: number;
  feels_like?: number;
  dew_point?: number;
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
}
