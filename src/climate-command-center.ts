import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { fireEvent, HomeAssistant, LovelaceCard, LovelaceCardEditor } from 'custom-card-helpers';
import { styles } from './styles';
import {
  AreaSensor,
  ClimateCommandCenterConfig,
  ClimateZone,
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
    const mode = state.state;
    const expanded = this._expandedZone === zone.climate_entity;
    const sensors: ZoneSensors = zone.sensors;
    const delta = this.tempDelta(current, target);
    const allModes = (attrs.hvac_modes as string[] | undefined) ?? ['heat', 'off'];
    const hvacModes =
      zone.kind === 'floor_heat'
        ? allModes.filter((m) => m === 'heat' || m === 'off')
        : allModes;

    return html`
      <div class="zone-card ${expanded ? 'expanded' : ''} ${zone.kind} ${this.modeClass(mode)}">
        <div class="zone-header" @click=${() => this.toggleExpand(zone.climate_entity)}>
          <div class="zone-info">
            <div class="zone-name-row">
              <span class="zone-name">${zone.name}</span>
              <span class="zone-kind-badge">${zone.kind === 'floor_heat' ? 'Floor' : 'HVAC'}</span>
            </div>
            <div class="zone-mode ${this.modeClass(mode)}">${mode.replace('_', ' ')}</div>
            ${zone.area ? html`<div class="zone-area-label">${zone.area}</div>` : ''}
            ${this.renderZoneFloorEdit(zone)}
            ${this.renderZoneAreaEdit(zone)}
          </div>
          <div class="zone-temps">
            <span class="current-temp">${current ?? '—'}°</span>
            <span class="target-temp">→ ${target ?? '—'}°</span>
            ${delta != null
              ? html`<span class="temp-delta ${delta > 0 ? 'above' : delta < 0 ? 'below' : 'at'}">
                  ${delta > 0 ? '+' : ''}${delta}°
                </span>`
              : ''}
          </div>
        </div>

        <div class="zone-sensors">
          ${sensors.floor != null ? this.renderSensorRow('Floor', sensors.floor) : ''}
          ${sensors.room != null ? this.renderSensorRow('Room', sensors.room) : ''}
          ${humidity != null ? this.renderSensorRow('Humidity', humidity, '%') : ''}
          ${sensors.humidity != null && humidity == null
            ? this.renderSensorRow('Humidity', sensors.humidity, '%')
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

    return html`
      <ha-card>
        <div class="card-header">
          <span class="card-title">${this._config.title}</span>
          <div class="header-actions">
            ${canEdit
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
        ${this._editSensors
          ? html`<div class="edit-hint">Assign sensors to HA areas or zones, set floor per zone, or hide. Save the dashboard to keep layout changes.</div>`
          : ''}
        ${this.renderWeatherStrip()}
        ${sections.length
          ? sections.map((s) => this.renderFloorSection(s))
          : html`<div class="empty">No climate zones found. Check your configuration.</div>`}
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
