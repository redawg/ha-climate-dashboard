import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { fireEvent, HomeAssistant, LovelaceCard, LovelaceCardEditor } from 'custom-card-helpers';
import { styles } from './styles';
import {
  AreaSensor,
  ClimateCommandCenterConfig,
  ClimateZone,
  FloorPlanConfig,
  FloorPlanRoom,
  FloorPlanThermostat,
  FloorSection,
  WeatherData,
  ZoneSensors,
} from './types';
import { buildFloorSections, buildZones, DEFAULT_FLOORS, floorNames, getWeatherData, autoAssignSensorToZone, listHaAreas } from './utils/entity-resolver';
import { computeZoneHeightStats } from './utils/height-averages';

declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
    }>;
  }
}

@customElement('climate-command-center')
export class ClimateCommandCenterCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) private _config!: ClimateCommandCenterConfig;
  @state() private _expandedZone: string | null = null;
  @state() private _editSensors = false;
  @state() private _view: 'cards' | 'floorplan' = 'floorplan';
  @state() private _placingThermostat: 'wall' | 'floor' | null = null;

  static get styles(): CSSResultGroup {
    return styles;
  }

  public setConfig(config: ClimateCommandCenterConfig): void {
    if (!config.zones?.length && !config.auto_discover) {
      throw new Error('Configure zones or enable auto_discover');
    }
    this._config = {
      title: 'Climate Command Center',
      auto_discover: true,
      show_weather: true,
      show_room_sensors: true,
      group_by_floor: true,
      allow_sensor_reassign: true,
      reference_height_ft: 5,
      ...config,
      floors: config.floors?.length ? config.floors : DEFAULT_FLOORS,
    };
  }

  public getCardSize(): number {
    return 6;
  }

  private get sections(): FloorSection[] {
    return buildFloorSections(this.hass, this._config);
  }

  private get weather(): WeatherData | null {
    if (!this._config.show_weather) return null;
    return getWeatherData(this.hass, this._config);
  }

  private get totalZones(): number {
    return this.sections.reduce((sum, s) => sum + s.zones.length, 0);
  }

  private get zoneOptions(): ClimateZone[] {
    return buildZones(this.hass, this._config);
  }

  private get haAreas() {
    return listHaAreas(this.hass);
  }

  private get floorOptions(): string[] {
    return floorNames(this._config);
  }

  private async setEntityHaArea(entityId: string, areaId: string): Promise<void> {
    const hass = this.hass as HomeAssistant & {
      callWS?: (msg: Record<string, unknown>) => Promise<unknown>;
    };
    if (!hass.callWS) return;
    await hass.callWS({
      type: 'config/entity_registry/update',
      entity_id: entityId,
      area_id: areaId,
    });
  }

  private async updateSensorAssignment(entityId: string, value: string): Promise<void> {
    if (value.startsWith('area:')) {
      const areaId = value.slice(5);
      try {
        await this.setEntityHaArea(entityId, areaId);
      } catch (err) {
        console.error('Failed to set HA area', entityId, areaId, err);
      }
      this.updateSensorMap(entityId, '__auto__');
      return;
    }
    this.updateSensorMap(entityId, value);
  }

  private updateZoneFloor(climateEntity: string, floorName: string): void {
    const zone_floors = { ...(this._config.zone_floors ?? {}) };
    if (floorName === '__default__') {
      delete zone_floors[climateEntity];
    } else {
      zone_floors[climateEntity] = floorName;
    }
    const next = { ...this._config, zone_floors };
    this._config = next;
    fireEvent(this, 'config-changed', { config: next });
  }

  private async updateZoneHaArea(climateEntity: string, areaId: string): Promise<void> {
    if (!areaId) return;
    try {
      await this.setEntityHaArea(climateEntity, areaId);
    } catch (err) {
      console.error('Failed to set zone HA area', climateEntity, areaId, err);
    }
  }

  private callService(domain: string, service: string, data: Record<string, unknown>): void {
    this.hass.callService(domain, service, data);
  }

  private setClimate(entityId: string, data: Record<string, unknown>): void {
    this.callService('climate', 'set_temperature', { entity_id: entityId, ...data });
  }

  private setHvacMode(entityId: string, hvac_mode: string): void {
    this.callService('climate', 'set_hvac_mode', { entity_id: entityId, hvac_mode });
  }

  private adjustSetpoint(entityId: string, current: number | undefined, delta: number): void {
    const base = current ?? 70;
    this.setClimate(entityId, { temperature: Math.round(base + delta) });
  }

  private toggleExpand(entityId: string): void {
    this._expandedZone = this._expandedZone === entityId ? null : entityId;
  }

  private updateSensorMap(entityId: string, zoneClimateEntity: string): void {
    const sensor_map = { ...(this._config.sensor_map ?? {}) };
    const exclude = new Set(this._config.exclude_entities ?? []);

    if (zoneClimateEntity === '__hidden__') {
      exclude.add(entityId);
      delete sensor_map[entityId];
    } else if (zoneClimateEntity === '__auto__') {
      exclude.delete(entityId);
      delete sensor_map[entityId];
    } else {
      exclude.delete(entityId);
      sensor_map[entityId] = zoneClimateEntity;
    }

    const next = {
      ...this._config,
      sensor_map,
      exclude_entities: [...exclude],
    };
    this._config = next;
    fireEvent(this, 'config-changed', { config: next });
  }

  private updateSensorHeight(entityId: string, raw: string): void {
    const sensor_heights = { ...(this._config.sensor_heights ?? {}) };
    const trimmed = raw.trim();
    if (!trimmed) {
      delete sensor_heights[entityId];
    } else {
      const height = parseFloat(trimmed);
      if (Number.isNaN(height) || height < 0) return;
      sensor_heights[entityId] = height;
    }
    const next = { ...this._config, sensor_heights };
    this._config = next;
    fireEvent(this, 'config-changed', { config: next });
  }

  private updateZoneHeight(climateEntity: string, raw: string): void {
    const zone_heights = { ...(this._config.zone_heights ?? {}) };
    const trimmed = raw.trim();
    if (!trimmed) {
      delete zone_heights[climateEntity];
    } else {
      const height = parseFloat(trimmed);
      if (Number.isNaN(height) || height < 0) return;
      zone_heights[climateEntity] = height;
    }
    const next = { ...this._config, zone_heights };
    this._config = next;
    fireEvent(this, 'config-changed', { config: next });
  }

  private renderHeightEditor(entityId: string, height?: number): TemplateResult | null {
    if (!this._editSensors) return null;
    return html`
      <label class="height-edit" @click=${(e: Event) => e.stopPropagation()}>
        <span>Height</span>
        <input
          type="number"
          min="0"
          step="0.5"
          placeholder="ft"
          .value=${height != null ? String(height) : ''}
          @change=${(e: Event) =>
            this.updateSensorHeight(entityId, (e.target as HTMLInputElement).value)}
        />
        <span>ft</span>
      </label>
    `;
  }

  private renderHeightBadge(height?: number): TemplateResult | null {
    if (height == null) return null;
    return html`<span class="height-badge">${height} ft</span>`;
  }

  private renderZoneHeightStats(zone: ClimateZone, climateCurrent?: number): TemplateResult | null {
    const stats = computeZoneHeightStats(zone, this._config, climateCurrent);
    if (!stats) return null;

    return html`
      <div class="height-stats">
        <span>Avg ${stats.simple_average ?? '—'}°</span>
        <span>
          Est. @ ${stats.reference_height_ft} ft:
          ${stats.estimated_at_reference ?? '—'}°
        </span>
        ${stats.gradient_per_ft != null
          ? html`<span>${stats.gradient_per_ft > 0 ? '+' : ''}${stats.gradient_per_ft}°/ft</span>`
          : ''}
        <span class="height-stats-meta">${stats.point_count} height points</span>
      </div>
    `;
  }

  private modeClass(mode: string): string {
    if (mode === 'heat') return 'mode-heat';
    if (mode === 'cool') return 'mode-cool';
    if (mode === 'heat_cool') return 'mode-auto';
    if (mode === 'off') return 'mode-off';
    return '';
  }

  private actionLabel(action: string | undefined): string {
    if (!action || action === 'off') return 'Off';
    if (action === 'heating') return 'Heating';
    if (action === 'cooling') return 'Cooling';
    if (action === 'idle') return 'Idle';
    if (action === 'drying') return 'Drying';
    if (action === 'fan') return 'Fan';
    return action;
  }

  private actionClass(action: string | undefined): string {
    if (action === 'heating') return 'action-heating';
    if (action === 'cooling') return 'action-cooling';
    if (action === 'idle') return 'action-idle';
    return 'action-off';
  }

  private tempDelta(current: number | undefined, target: number | undefined): number | undefined {
    if (current == null || target == null) return undefined;
    return Math.round((current - target) * 10) / 10;
  }

  private renderWeatherStrip(): TemplateResult | null {
    const weather = this.weather;
    if (!weather) return null;

    return html`
      <div class="weather-strip">
        <div class="weather-main">
          <span class="weather-icon">🌤</span>
          <div>
            <div class="weather-temp">${weather.temperature ?? '—'}°</div>
            <div class="weather-label">${weather.label}</div>
          </div>
        </div>
        <div class="weather-stats">
          ${weather.humidity != null ? html`<span>💧 ${Math.round(weather.humidity)}%</span>` : ''}
          ${weather.feels_like != null ? html`<span>Feels ${Math.round(weather.feels_like)}°</span>` : ''}
          ${weather.dew_point != null ? html`<span>Dew ${Math.round(weather.dew_point)}°</span>` : ''}
        </div>
      </div>
    `;
  }

  private renderSensorRow(label: string, value: number | undefined, unit = '°'): TemplateResult {
    return html`
      <div class="sensor-row">
        <span class="sensor-label">${label}</span>
        <span class="sensor-value">${value != null ? `${value}${unit}` : '—'}</span>
      </div>
    `;
  }

  private renderSensorAssign(sensor: AreaSensor): TemplateResult | null {
    if (!this._editSensors) return null;
    const current =
      this._config.sensor_map?.[sensor.entity_id] ??
      (this._config.exclude_entities?.includes(sensor.entity_id) ? '__hidden__' : '__auto__');
    const autoZone = autoAssignSensorToZone(sensor, this.zoneOptions);
    const autoLabel = sensor.area
      ? `Auto (HA: ${sensor.area}${autoZone ? ` → ${autoZone.name}` : ''})`
      : autoZone
        ? `Auto (→ ${autoZone.name})`
        : 'Auto (by HA area)';

    return html`
      <select
        class="sensor-assign-select"
        .value=${current}
        @change=${(e: Event) =>
          void this.updateSensorAssignment(sensor.entity_id, (e.target as HTMLSelectElement).value)}
        @click=${(e: Event) => e.stopPropagation()}
      >
        <option value="__auto__">${autoLabel}</option>
        <optgroup label="HA Areas (updates Home Assistant)">
          ${this.haAreas.map(
            (a) => html`<option value=${`area:${a.area_id}`}>${a.name}</option>`
          )}
        </optgroup>
        <optgroup label="Climate zones">
          ${this.zoneOptions.map(
            (z) =>
              html`<option value=${z.climate_entity}>${z.name}${z.area ? ` (${z.area})` : ''}</option>`
          )}
        </optgroup>
        <option value="__hidden__">Hide</option>
      </select>
    `;
  }

  private renderZoneFloorEdit(zone: ClimateZone): TemplateResult | null {
    if (!this._editSensors) return null;
    const current = this._config.zone_floors?.[zone.climate_entity] ?? '__default__';
    return html`
      <label class="zone-floor-edit" @click=${(e: Event) => e.stopPropagation()}>
        Floor
        <select
          .value=${current}
          @change=${(e: Event) =>
            this.updateZoneFloor(zone.climate_entity, (e.target as HTMLSelectElement).value)}
        >
          <option value="__default__">Auto (from HA area)</option>
          ${this.floorOptions.map((f) => html`<option value=${f}>${f}</option>`)}
        </select>
      </label>
    `;
  }

  private renderZoneAreaEdit(zone: ClimateZone): TemplateResult | null {
    if (!this._editSensors) return null;
    return html`
      <label class="zone-area-edit" @click=${(e: Event) => e.stopPropagation()}>
        HA area
        <select
          .value=${zone.area_id ?? ''}
          @change=${(e: Event) =>
            void this.updateZoneHaArea(zone.climate_entity, (e.target as HTMLSelectElement).value)}
        >
          <option value="">—</option>
          ${this.haAreas.map((a) => html`<option value=${a.area_id}>${a.name}</option>`)}
        </select>
      </label>
    `;
  }

  private renderAreaLabel(sensor: AreaSensor): TemplateResult | null {
    if (!sensor.area) return null;
    return html`<div class="room-sensor-area">${sensor.area}</div>`;
  }

  private renderRoomSensorChip(sensor: AreaSensor): TemplateResult {
    return html`
      <div class="room-sensor-chip">
        <div class="room-sensor-name">${sensor.name} ${this.renderHeightBadge(sensor.height_ft)}</div>
        ${this.renderAreaLabel(sensor)}
        <div class="room-sensor-temp">${sensor.value ?? '—'}${sensor.unit ?? '°'}</div>
        ${this.renderSensorAssign(sensor)}
        ${this.renderHeightEditor(sensor.entity_id, sensor.height_ft)}
      </div>
    `;
  }

  private renderOtherSensorChip(sensor: AreaSensor): TemplateResult {
    return html`
      <div class="other-sensor-chip">
        <span class="other-sensor-name">${sensor.name}</span>
        <span class="other-sensor-value">${sensor.value ?? '—'}${sensor.unit ?? ''}</span>
        ${this.renderHeightBadge(sensor.height_ft)}
        ${this.renderSensorAssign(sensor)}
        ${this.renderHeightEditor(sensor.entity_id, sensor.height_ft)}
      </div>
    `;
  }

  private renderZoneSensorsBlock(zone: ClimateZone): TemplateResult {
    const hasRoom = zone.roomSensors.length > 0;
    const hasOther = zone.otherSensors.length > 0;
    if (!hasRoom && !hasOther) return html``;

    return html`
      <div class="zone-area-sensors">
        ${hasRoom
          ? html`
              <div class="room-sensors-grid">
                ${zone.roomSensors.map((s) => this.renderRoomSensorChip(s))}
              </div>
            `
          : ''}
        ${hasOther
          ? html`
              <div class="other-sensors-box">
                <div class="other-sensors-label">Other sensors</div>
                <div class="other-sensors-list">
                  ${zone.otherSensors.map((s) => this.renderOtherSensorChip(s))}
                </div>
              </div>
            `
          : ''}
      </div>
    `;
  }

  private renderZone(zone: ClimateZone): TemplateResult {
    const state = this.hass.states[zone.climate_entity];
    if (!state) return html``;

    const attrs = state.attributes;
    const current = attrs.current_temperature as number | undefined;
    const target = attrs.temperature as number | undefined;
    const humidity = attrs.humidity as number | undefined;
    const hvacAction = attrs.hvac_action as string | undefined;
    const mode = state.state;
    const expanded = this._expandedZone === zone.climate_entity;
    const sensors: ZoneSensors = zone.sensors;
    const allModes = (attrs.hvac_modes as string[] | undefined) ?? ['heat', 'off'];
    const hvacModes =
      zone.kind === 'floor_heat'
        ? allModes.filter((m) => m === 'heat' || m === 'off')
        : allModes;

    return html`
      <div class="zone-card ${expanded ? 'expanded' : ''} ${zone.kind} ${this.modeClass(mode)} ${this.actionClass(hvacAction)}">
        <div class="zone-header" @click=${() => this.toggleExpand(zone.climate_entity)}>
          <div class="zone-info">
            <div class="zone-name-row">
              <span class="zone-name">${zone.name}</span>
              <span class="zone-kind-badge">${zone.kind === 'floor_heat' ? 'Floor' : 'HVAC'}</span>
            </div>
            <div class="zone-status-row">
              <span class="zone-mode ${this.modeClass(mode)}">${mode.replace('_', ' ')}</span>
              <span class="zone-action ${this.actionClass(hvacAction)}">
                ${hvacAction === 'heating' ? '🔥 ' : hvacAction === 'cooling' ? '❄️ ' : ''}${this.actionLabel(hvacAction)}
              </span>
            </div>
            ${zone.area ? html`<div class="zone-area-label">${zone.area}</div>` : ''}
            ${this.renderZoneFloorEdit(zone)}
            ${this.renderZoneAreaEdit(zone)}
          </div>
          <div class="zone-temps">
            <div class="temp-target-row">
              <span class="target-label">Set to</span>
              <span class="target-temp">${target ?? '—'}°</span>
            </div>
          </div>
        </div>

        <div class="zone-temp-grid">
          ${sensors.floor != null
            ? html`
                <div class="temp-cell">
                  <span class="temp-cell-label">Floor</span>
                  <span class="temp-cell-value">${sensors.floor}°</span>
                </div>
              `
            : ''}
          ${sensors.room != null
            ? html`
                <div class="temp-cell">
                  <span class="temp-cell-label">Room</span>
                  <span class="temp-cell-value">${sensors.room}°</span>
                </div>
              `
            : ''}
          ${current != null && sensors.floor == null && sensors.room == null
            ? html`
                <div class="temp-cell">
                  <span class="temp-cell-label">Current</span>
                  <span class="temp-cell-value">${current}°</span>
                </div>
              `
            : ''}
          ${current != null && (sensors.floor != null || sensors.room != null)
            ? html`
                <div class="temp-cell">
                  <span class="temp-cell-label">Thermostat</span>
                  <span class="temp-cell-value">${current}°</span>
                </div>
              `
            : ''}
          <div class="temp-cell temp-cell-target">
            <span class="temp-cell-label">Target</span>
            <span class="temp-cell-value">${target ?? '—'}°</span>
          </div>
          ${humidity != null
            ? html`
                <div class="temp-cell">
                  <span class="temp-cell-label">Humidity</span>
                  <span class="temp-cell-value">${humidity}%</span>
                </div>
              `
            : sensors.humidity != null
              ? html`
                  <div class="temp-cell">
                    <span class="temp-cell-label">Humidity</span>
                    <span class="temp-cell-value">${sensors.humidity}%</span>
                  </div>
                `
              : ''}
        </div>

        ${this.renderZoneHeightStats(zone, current)}

        ${this.renderZoneSensorsBlock(zone)}

        ${expanded
          ? html`
              <div class="zone-controls">
                ${this._editSensors
                  ? html`
                      <label class="zone-height-edit" @click=${(e: Event) => e.stopPropagation()}>
                        Thermostat height
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          placeholder="${this._config.reference_height_ft ?? 5}"
                          .value=${String(
                            this._config.zone_heights?.[zone.climate_entity] ??
                              this._config.reference_height_ft ??
                              5
                          )}
                          @change=${(e: Event) =>
                            this.updateZoneHeight(
                              zone.climate_entity,
                              (e.target as HTMLInputElement).value
                            )}
                        />
                        ft
                      </label>
                    `
                  : ''}
                <div class="mode-buttons">
                  ${hvacModes.map(
                    (m) => html`
                      <button
                        class="mode-btn ${mode === m ? 'active' : ''} ${this.modeClass(m)}"
                        @click=${(e: Event) => {
                          e.stopPropagation();
                          this.setHvacMode(zone.climate_entity, m);
                        }}
                      >
                        ${m.replace('_', '/')}
                      </button>
                    `
                  )}
                </div>
                <div class="setpoint-controls">
                  <button
                    class="step-btn"
                    @click=${(e: Event) => {
                      e.stopPropagation();
                      this.adjustSetpoint(zone.climate_entity, target, -1);
                    }}
                  >
                    −
                  </button>
                  <span class="setpoint-display">${target ?? '—'}°</span>
                  <button
                    class="step-btn"
                    @click=${(e: Event) => {
                      e.stopPropagation();
                      this.adjustSetpoint(zone.climate_entity, target, 1);
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            `
          : ''}
      </div>
    `;
  }

  /* ── Floor plan data helpers ── */

  private static readonly FP_ZONE_MAP: Array<{
    zone: number; label: string; sqft: number; climate_entity: string;
  }> = [
    { zone: 1, label: 'Laundry',     sqft: 54,  climate_entity: 'climate.laundry_laundry' },
    { zone: 2, label: 'Main Area',   sqft: 577, climate_entity: 'climate.main_area_main_area' },
    { zone: 3, label: 'Kitchen',     sqft: 187, climate_entity: 'climate.main_floor' },
    { zone: 4, label: 'Living Room', sqft: 98,  climate_entity: 'climate.living_room_living_room' },
  ];

  private static readonly DEFAULT_FP_ROOMS: FloorPlanRoom[] = [
    // Rooms positioned as percentage of a 100x100 viewport.
    // Layout derived from the ThermalBoard zoning drawing.
    // Top row (left to right): Entry | Living Room | Family Room / Main Area | Kitchen
    // Bottom row: Laundry | Hallway | Main Office | Pantry
    { id: 'entry',       label: 'Entry',       x: 0,  y: 0,  w: 15, h: 35, heated: false },
    { id: 'living',      label: 'Living Room', x: 15, y: 0,  w: 22, h: 55, zone: 4, heated: true },
    { id: 'family',      label: 'Family Room', x: 37, y: 0,  w: 33, h: 55, zone: 2, heated: true },
    { id: 'kitchen',     label: 'Kitchen',     x: 70, y: 0,  w: 30, h: 40, zone: 3, heated: true },
    { id: 'pantry',      label: 'Pantry',      x: 70, y: 40, w: 15, h: 20, heated: false },
    { id: 'laundry',     label: 'Laundry',     x: 0,  y: 55, w: 15, h: 25, zone: 1, heated: true },
    { id: 'hall',        label: 'Hallway',     x: 15, y: 55, w: 15, h: 25, zone: 2, heated: true },
    { id: 'office',      label: 'Main Office', x: 30, y: 55, w: 25, h: 25, heated: false },
    { id: 'stairs',      label: 'Stairs',      x: 0,  y: 35, w: 15, h: 20, heated: false },
    { id: 'half_bath',   label: '1/2 Bath',    x: 55, y: 55, w: 15, h: 25, heated: false },
    { id: 'dining',      label: 'Dining',      x: 85, y: 40, w: 15, h: 20, heated: false },
  ];

  private get fpRooms(): FloorPlanRoom[] {
    return this._config.floor_plan?.rooms?.length
      ? this._config.floor_plan.rooms
      : ClimateCommandCenterCard.DEFAULT_FP_ROOMS;
  }

  private get fpThermostats(): FloorPlanThermostat[] {
    return this._config.floor_plan?.thermostats ?? [];
  }

  private fpZoneData(zoneNum: number) {
    const m = ClimateCommandCenterCard.FP_ZONE_MAP.find((z) => z.zone === zoneNum);
    if (!m) return null;
    const st = this.hass.states[m.climate_entity];
    const attrs = st?.attributes ?? {};
    const linked = this.zoneOptions.find((z) => z.climate_entity === m.climate_entity);
    return {
      ...m,
      state: st?.state,
      action: attrs.hvac_action as string | undefined,
      current: attrs.current_temperature as number | undefined,
      target: attrs.temperature as number | undefined,
      floor_temp: linked?.sensors.floor,
      room_temp: linked?.sensors.room,
    };
  }

  private fpZoneColor(action?: string, state?: string): string {
    if (state === 'off') return 'rgba(97,97,97,0.18)';
    if (action === 'heating') return 'rgba(255,112,67,0.28)';
    if (action === 'cooling') return 'rgba(66,165,245,0.28)';
    return 'rgba(255,152,0,0.10)';
  }
  private fpZoneStroke(action?: string, state?: string): string {
    if (state === 'off') return '#616161';
    if (action === 'heating') return '#ff7043';
    if (action === 'cooling') return '#42a5f5';
    return '#ff9800';
  }

  private fpThermostatData(entityId: string) {
    const st = this.hass.states[entityId];
    if (!st) return null;
    const attrs = st.attributes ?? {};
    const isClimate = entityId.startsWith('climate.');
    return {
      state: st.state,
      action: isClimate ? (attrs.hvac_action as string | undefined) : undefined,
      current: isClimate
        ? (attrs.current_temperature as number | undefined)
        : (parseFloat(st.state) || undefined),
      target: isClimate ? (attrs.temperature as number | undefined) : undefined,
      name: (attrs.friendly_name as string) ?? entityId,
      unit: (attrs.unit_of_measurement as string) ?? (isClimate ? '°' : ''),
    };
  }

  private handleFpClick(e: MouseEvent): void {
    if (!this._placingThermostat) return;
    const svg = (e.currentTarget as SVGSVGElement);
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const svgPt = pt.matrixTransform(ctm.inverse());
    const x = Math.round(svgPt.x / 7);
    const y = Math.round(svgPt.y / 5);

    const newTstat: FloorPlanThermostat = {
      entity_id: '',
      label: this._placingThermostat === 'wall' ? 'Wall Thermostat' : 'Floor Sensor',
      kind: this._placingThermostat,
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    };

    const existing = [...this.fpThermostats];
    existing.push(newTstat);
    const newConfig = {
      ...this._config,
      floor_plan: { ...this._config.floor_plan, thermostats: existing },
    };
    this._config = newConfig;
    fireEvent(this, 'config-changed', { config: newConfig });
    this._placingThermostat = null;
  }

  private removeFpThermostat(idx: number): void {
    const thermostats = [...this.fpThermostats];
    thermostats.splice(idx, 1);
    const newConfig = {
      ...this._config,
      floor_plan: { ...this._config.floor_plan, thermostats },
    };
    this._config = newConfig;
    fireEvent(this, 'config-changed', { config: newConfig });
  }

  private updateFpThermostat(idx: number, field: string, value: string): void {
    const thermostats = this.fpThermostats.map((t, i) =>
      i === idx ? { ...t, [field]: value } : t
    );
    const newConfig = {
      ...this._config,
      floor_plan: { ...this._config.floor_plan, thermostats },
    };
    this._config = newConfig;
    fireEvent(this, 'config-changed', { config: newConfig });
  }

  private renderFpManifold(rooms: FloorPlanRoom[], W: number, H: number, PAD: number): TemplateResult | string {
    const pantry = rooms.find((r) => r.id === 'pantry');
    if (!pantry) return '';
    const mx = PAD + ((pantry.x + pantry.w / 2) / 100) * (W - PAD * 2);
    const my = PAD + ((pantry.y + pantry.h / 2) / 100) * (H - PAD * 2);
    return html`
      <rect x="${mx - 30}" y="${my + 4}" width="60" height="18" rx="3"
            fill="rgba(2,136,209,0.25)" stroke="#0288d1" stroke-width="1.5"/>
      <text x="${mx}" y="${my + 17}" class="fp-manifold-label" text-anchor="middle">MANIFOLD</text>
      <text x="${mx}" y="${my + 32}" class="fp-vent-label" text-anchor="middle">10 loops</text>
    `;
  }

  private renderFpPexRuns(rooms: FloorPlanRoom[], W: number, H: number, PAD: number): TemplateResult[] {
    const pantry = rooms.find((r) => r.id === 'pantry');
    if (!pantry) return [];
    const mx = PAD + ((pantry.x + pantry.w / 2) / 100) * (W - PAD * 2);
    const my = PAD + ((pantry.y + pantry.h / 2) / 100) * (H - PAD * 2);
    return rooms.filter((r) => r.heated).map((r) => {
      const tx = PAD + ((r.x + r.w / 2) / 100) * (W - PAD * 2);
      const ty = PAD + ((r.y + r.h / 2) / 100) * (H - PAD * 2);
      return html`<line x1="${mx}" y1="${my}" x2="${tx}" y2="${ty}"
                        stroke="#0288d1" stroke-width="1" stroke-dasharray="4" opacity="0.3"/>`;
    });
  }

  private renderFpVents(W: number, H: number, PAD: number): TemplateResult[] {
    const vents = [
      { rx: 45, ry: 30 }, { rx: 55, ry: 45 },
      { rx: 25, ry: 25 }, { rx: 80, ry: 20 }, { rx: 80, ry: 35 },
    ];
    return vents.map((v) => {
      const vx = PAD + (v.rx / 100) * (W - PAD * 2);
      const vy = PAD + (v.ry / 100) * (H - PAD * 2);
      return html`<circle cx="${vx}" cy="${vy}" r="4" fill="none"
                          stroke="rgba(255,255,255,0.2)" stroke-width="1"/>`;
    });
  }

  private renderFloorPlan(): TemplateResult {
    const rooms = this.fpRooms;
    const thermostats = this.fpThermostats;
    const placing = this._placingThermostat;
    const allSensors = Object.keys(this.hass.states).filter((e) =>
      e.startsWith('climate.') || e.startsWith('sensor.'));

    // SVG viewBox: 700x500 gives space for the layout
    const W = 700, H = 500;
    const PAD = 15;

    return html`
      <div class="floor-plan-container">
        <!-- Toolbar -->
        <div class="fp-toolbar">
          <span class="fp-toolbar-title">Heated Floor Plan</span>
          <div class="fp-toolbar-actions">
            <button class="fp-place-btn ${placing === 'wall' ? 'active' : ''}"
              @click=${() => (this._placingThermostat = placing === 'wall' ? null : 'wall')}>
              + Wall Thermostat
            </button>
            <button class="fp-place-btn ${placing === 'floor' ? 'active' : ''}"
              @click=${() => (this._placingThermostat = placing === 'floor' ? null : 'floor')}>
              + Floor Sensor
            </button>
          </div>
        </div>
        ${placing ? html`<div class="fp-placing-hint">Click on the floor plan to place the ${placing === 'wall' ? 'wall thermostat' : 'floor sensor'}</div>` : ''}

        <svg viewBox="0 0 ${W} ${H}" class="floor-plan-svg ${placing ? 'placing' : ''}"
             xmlns="http://www.w3.org/2000/svg"
             @click=${(e: MouseEvent) => this.handleFpClick(e)}>
          <defs>
            <pattern id="fp-grid" width="14" height="14" patternUnits="userSpaceOnUse">
              <path d="M 14 0 L 0 0 0 14" fill="none" stroke="rgba(255,255,255,0.025)" stroke-width="0.5"/>
            </pattern>
          </defs>
          <rect width="${W}" height="${H}" fill="url(#fp-grid)" rx="8"/>

          <!-- House outer walls -->
          <rect x="${PAD}" y="${PAD}" width="${W - PAD * 2}" height="${H - PAD * 2}" rx="3"
                fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2.5"/>

          <!-- Rooms -->
          ${rooms.map((room) => {
            const rx = PAD + (room.x / 100) * (W - PAD * 2);
            const ry = PAD + (room.y / 100) * (H - PAD * 2);
            const rw = (room.w / 100) * (W - PAD * 2);
            const rh = (room.h / 100) * (H - PAD * 2);
            const zd = room.zone != null ? this.fpZoneData(room.zone) : null;
            const fill = room.heated && zd ? this.fpZoneColor(zd.action, zd.state) : 'rgba(255,255,255,0.02)';
            const stroke = room.heated && zd ? this.fpZoneStroke(zd.action, zd.state) : 'rgba(255,255,255,0.10)';
            const sw = room.heated ? '2' : '1';
            const cx = rx + rw / 2;
            const cy = ry + rh / 2;

            return html`
              <g class="fp-room">
                <rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" rx="2"
                      fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>
                <text x="${cx}" y="${cy - (zd ? 14 : 4)}" class="fp-room-label" text-anchor="middle">${room.label}</text>
                ${room.zone != null ? html`
                  <text x="${cx}" y="${cy}" class="fp-zone-tag" text-anchor="middle">Zone ${room.zone}</text>
                ` : ''}
                ${zd && room.heated ? html`
                  ${zd.action === 'heating'
                    ? html`<text x="${cx}" y="${cy + 14}" class="fp-status fp-heat" text-anchor="middle">HEATING</text>`
                    : zd.state === 'off'
                      ? html`<text x="${cx}" y="${cy + 14}" class="fp-status fp-off" text-anchor="middle">OFF</text>`
                      : html`<text x="${cx}" y="${cy + 14}" class="fp-status fp-idle" text-anchor="middle">IDLE</text>`
                  }
                  <!-- Temps row -->
                  ${rw > 100 ? html`
                    ${zd.floor_temp != null ? html`
                      <text x="${cx - 40}" y="${cy + 32}" class="fp-t-lbl" text-anchor="middle">FLR</text>
                      <text x="${cx - 40}" y="${cy + 46}" class="fp-t-val" text-anchor="middle">${zd.floor_temp}°</text>
                    ` : ''}
                    ${zd.room_temp != null ? html`
                      <text x="${cx}" y="${cy + 32}" class="fp-t-lbl" text-anchor="middle">ROOM</text>
                      <text x="${cx}" y="${cy + 46}" class="fp-t-val" text-anchor="middle">${zd.room_temp}°</text>
                    ` : ''}
                    <text x="${cx + 40}" y="${cy + 32}" class="fp-t-lbl" text-anchor="middle">TGT</text>
                    <text x="${cx + 40}" y="${cy + 46}" class="fp-t-val" text-anchor="middle">${zd.target ?? '—'}°</text>
                  ` : html`
                    <text x="${cx}" y="${cy + 30}" class="fp-t-val" text-anchor="middle">${zd.target ?? '—'}°</text>
                  `}
                ` : ''}
              </g>
            `;
          })}

          <!-- Manifold marker in Pantry area -->
          ${this.renderFpManifold(rooms, W, H, PAD)}

          <!-- PEX runs from manifold -->
          ${this.renderFpPexRuns(rooms, W, H, PAD)}

          <!-- Floor vents -->
          ${this.renderFpVents(W, H, PAD)}

          <!-- Placed thermostats -->
          ${thermostats.map((t, idx) => {
            const tx = PAD + (t.x / 100) * (W - PAD * 2);
            const ty = PAD + (t.y / 100) * (H - PAD * 2);
            const td = t.entity_id ? this.fpThermostatData(t.entity_id) : null;
            const isWall = t.kind === 'wall';
            return html`
              <g class="fp-thermostat" transform="translate(${tx}, ${ty})">
                <circle r="12" fill="${isWall ? 'rgba(76,175,80,0.3)' : 'rgba(255,152,0,0.3)'}"
                        stroke="${isWall ? '#4caf50' : '#ff9800'}" stroke-width="1.5"/>
                <text y="1" class="fp-tstat-icon" text-anchor="middle">${isWall ? 'T' : 'F'}</text>
                ${td ? html`
                  <text x="16" y="-4" class="fp-tstat-temp" text-anchor="start">${td.current ?? '—'}°</text>
                  <text x="16" y="8" class="fp-tstat-name" text-anchor="start">${t.label}</text>
                ` : html`
                  <text x="16" y="4" class="fp-tstat-name" text-anchor="start">${t.label}</text>
                `}
              </g>
            `;
          })}
        </svg>

        <!-- Thermostat list / editor below the plan -->
        ${thermostats.length ? html`
          <div class="fp-tstat-list">
            <div class="fp-tstat-list-title">Thermostats on Plan</div>
            ${thermostats.map((t, idx) => html`
              <div class="fp-tstat-row">
                <span class="fp-tstat-badge ${t.kind}">${t.kind === 'wall' ? 'Wall' : 'Floor'}</span>
                <input class="fp-tstat-input" type="text" .value=${t.label}
                       placeholder="Label"
                       @change=${(e: Event) => this.updateFpThermostat(idx, 'label', (e.target as HTMLInputElement).value)}/>
                <select class="fp-tstat-select"
                        @change=${(e: Event) => this.updateFpThermostat(idx, 'entity_id', (e.target as HTMLSelectElement).value)}>
                  <option value="" ?selected=${!t.entity_id}>Pick entity...</option>
                  ${allSensors.map((eid) => html`
                    <option value="${eid}" ?selected=${t.entity_id === eid}>
                      ${(this.hass.states[eid]?.attributes?.friendly_name as string) ?? eid}
                    </option>
                  `)}
                </select>
                <span class="fp-tstat-pos">(${t.x}, ${t.y})</span>
                <button class="fp-tstat-del" @click=${() => this.removeFpThermostat(idx)}>✕</button>
              </div>
            `)}
          </div>
        ` : ''}

        <!-- Legend -->
        <div class="fp-legend-bar">
          <div class="fp-legend-item"><span class="fp-legend-swatch" style="background:rgba(255,112,67,0.28);border-color:#ff7043"></span>Heating</div>
          <div class="fp-legend-item"><span class="fp-legend-swatch" style="background:rgba(255,152,0,0.10);border-color:#ff9800"></span>Idle</div>
          <div class="fp-legend-item"><span class="fp-legend-swatch" style="background:rgba(97,97,97,0.18);border-color:#616161"></span>Off</div>
          <div class="fp-legend-item"><span class="fp-legend-swatch fp-legend-circle" style="border-color:rgba(255,255,255,0.2)"></span>Vent</div>
          <div class="fp-legend-item"><span class="fp-legend-swatch" style="background:rgba(76,175,80,0.3);border-color:#4caf50;border-radius:50%"></span>Wall T-stat</div>
          <div class="fp-legend-item"><span class="fp-legend-swatch" style="background:rgba(255,152,0,0.3);border-color:#ff9800;border-radius:50%"></span>Floor Sensor</div>
        </div>
      </div>
    `;
  }

  private renderUnassigned(section: FloorSection): TemplateResult | null {
    if (!section.unassignedSensors.length) return null;
    return html`
      <div class="unassigned-block">
        <div class="unassigned-label">Unassigned sensors</div>
        <div class="other-sensors-list">
          ${section.unassignedSensors.map((s) =>
            s.kind === 'other' ? this.renderOtherSensorChip(s) : this.renderRoomSensorChip(s)
          )}
        </div>
      </div>
    `;
  }

  private renderFloorSection(section: FloorSection): TemplateResult {
    return html`
      <section class="floor-section">
        <div class="floor-header">
          <span class="floor-name">${section.name}</span>
          <span class="floor-meta">${section.zones.length} zones</span>
        </div>

        ${section.zones.length
          ? html`<div class="zones-grid">${section.zones.map((z) => this.renderZone(z))}</div>`
          : ''}
        ${this.renderUnassigned(section)}
      </section>
    `;
  }

  protected render(): TemplateResult {
    const sections = this.sections;
    const canEdit = this._config.allow_sensor_reassign !== false;
    const isFloorPlan = this._view === 'floorplan';

    return html`
      <ha-card>
        <div class="card-header">
          <span class="card-title">${this._config.title}</span>
          <div class="header-actions">
            <div class="view-toggle">
              <button class="view-btn ${!isFloorPlan ? 'active' : ''}" @click=${() => (this._view = 'cards')}>Cards</button>
              <button class="view-btn ${isFloorPlan ? 'active' : ''}" @click=${() => (this._view = 'floorplan')}>Floor Plan</button>
            </div>
            ${!isFloorPlan && canEdit
              ? html`
                  <button
                    class="edit-sensors-btn ${this._editSensors ? 'active' : ''}"
                    @click=${() => (this._editSensors = !this._editSensors)}
                  >
                    ${this._editSensors ? 'Done' : 'Assign sensors'}
                  </button>
                `
              : ''}
            <span class="zone-count">${this.totalZones} zones</span>
          </div>
        </div>
        ${isFloorPlan
          ? html`
              ${this.renderWeatherStrip()}
              ${this.renderFloorPlan()}
            `
          : html`
              ${this._editSensors
                ? html`<div class="edit-hint">Assign sensors to HA areas or zones, set floor per zone, or hide. Save the dashboard to keep layout changes.</div>`
                : ''}
              ${this.renderWeatherStrip()}
              ${sections.length
                ? sections.map((s) => this.renderFloorSection(s))
                : html`<div class="empty">No climate zones found. Check your configuration.</div>`}
            `}
      </ha-card>
    `;
  }
}

window.customCards = window.customCards ?? [];
window.customCards.push({
  type: 'climate-command-center',
  name: 'Climate Command Center',
  description: 'Unified dashboard for thermostats, heated floors, and weather sensors',
  preview: true,
});

console.info(
  '%c CLIMATE-COMMAND-CENTER %c v0.5.1 ',
  'color: white; background: #0288d1; font-weight: 700;',
  'color: #0288d1; background: white; font-weight: 700;'
);

import './editor';

declare global {
  interface HTMLElementTagNameMap {
    'climate-command-center': ClimateCommandCenterCard;
  }
}

export const getCard = (): typeof ClimateCommandCenterCard => ClimateCommandCenterCard;

export const getCardEditor = (): LovelaceCardEditor => {
  return document.createElement('climate-command-center-editor') as LovelaceCardEditor;
};
