import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCard, LovelaceCardEditor } from 'custom-card-helpers';
import { styles } from './styles';
import {
  ClimateCommandCenterConfig,
  ClimateZone,
  FloorSection,
  RoomSensor,
  WeatherData,
  ZoneSensors,
} from './types';
import { buildFloorSections, getWeatherData } from './utils/entity-resolver';

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
      ...config,
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

  private renderRoomSensor(sensor: RoomSensor): TemplateResult {
    return html`
      <div class="room-sensor-chip">
        <div class="room-sensor-name">${sensor.name}</div>
        <div class="room-sensor-temp">${sensor.temperature ?? '—'}°</div>
        ${sensor.area ? html`<div class="room-sensor-area">${sensor.area}</div>` : ''}
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
    const hvacModes = (attrs.hvac_modes as string[] | undefined) ?? ['heat', 'cool', 'heat_cool', 'off'];

    return html`
      <div class="zone-card ${expanded ? 'expanded' : ''} ${zone.kind} ${this.modeClass(mode)}">
        <div class="zone-header" @click=${() => this.toggleExpand(zone.climate_entity)}>
          <div class="zone-info">
            <div class="zone-name-row">
              <span class="zone-name">${zone.name}</span>
              <span class="zone-kind-badge">${zone.kind === 'floor_heat' ? 'Floor' : 'HVAC'}</span>
            </div>
            <div class="zone-mode ${this.modeClass(mode)}">${mode.replace('_', ' ')}</div>
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

        ${expanded
          ? html`
              <div class="zone-controls">
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

  private renderFloorSection(section: FloorSection): TemplateResult {
    return html`
      <section class="floor-section">
        <div class="floor-header">
          <span class="floor-name">${section.name}</span>
          <span class="floor-meta">
            ${section.zones.length ? `${section.zones.length} zones` : ''}
            ${section.zones.length && section.roomSensors.length ? ' · ' : ''}
            ${section.roomSensors.length ? `${section.roomSensors.length} sensors` : ''}
          </span>
        </div>

        ${section.zones.length
          ? html`<div class="zones-grid">${section.zones.map((z) => this.renderZone(z))}</div>`
          : ''}

        ${section.roomSensors.length
          ? html`
              <div class="room-sensors-block">
                <div class="room-sensors-label">Room Sensors</div>
                <div class="room-sensors-grid">
                  ${section.roomSensors.map((s) => this.renderRoomSensor(s))}
                </div>
              </div>
            `
          : ''}
      </section>
    `;
  }

  protected render(): TemplateResult {
    const sections = this.sections;

    return html`
      <ha-card>
        <div class="card-header">
          <span class="card-title">${this._config.title}</span>
          <span class="zone-count">${this.totalZones} zones</span>
        </div>
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
  '%c CLIMATE-COMMAND-CENTER %c v0.2.0 ',
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
