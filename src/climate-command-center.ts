import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { fireEvent, HomeAssistant, LovelaceCard, LovelaceCardEditor } from 'custom-card-helpers';
import { styles } from './styles';
import {
  AreaSensor,
  ClimateCommandCenterConfig,
  ClimateZone,
  ForecastEntry,
  FloorPlanThermostat,
  FloorSection,
  FloorSystemData,
  SunData,
  WeatherData,
  ZoneSensors,
} from './types';
import {
  buildFloorSections,
  buildZones,
  DEFAULT_FLOORS,
  floorNames,
  getWeatherData,
  getSunData,
  autoAssignSensorToZone,
  listHaAreas,
  resolveFloorSystem,
} from './utils/entity-resolver';
import { computeZoneHeightStats } from './utils/height-averages';
import { FLOORPLAN_IMAGE } from './floorplan-image';

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
  @state() private _setupMode = false;
  @state() private _view: 'cards' | 'floorplan' = 'cards';
  @state() private _placingThermostat: 'wall' | 'floor' | null = null;
  @state() private _forecast: ForecastEntry[] | null = null;

  private _forecastUnsub?: () => void;

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

  public connectedCallback(): void {
    super.connectedCallback();
    this._subscribeForecast();
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unsubscribeForecast();
  }

  protected updated(changedProps: Map<string, unknown>): void {
    if (changedProps.has('hass') && !this._forecastUnsub) {
      this._subscribeForecast();
    }
  }

  private async _subscribeForecast(): Promise<void> {
    this._unsubscribeForecast();
    if (!this.hass) return;
    const weatherEntityId =
      this._config.weather_entity ??
      Object.keys(this.hass.states).find(
        (eid) => eid.startsWith('weather.') && (eid.includes('weatherflow') || eid.includes('tempest'))
      ) ??
      Object.keys(this.hass.states).find((eid) => eid.startsWith('weather.'));
    if (!weatherEntityId) return;
    try {
      this._forecastUnsub = await (this.hass.connection as { subscribeMessage: (
        callback: (msg: { forecast?: ForecastEntry[] }) => void,
        subscribeMessage: { type: string; forecast_type: string; entity_id: string }
      ) => Promise<() => void> }).subscribeMessage(
        (msg) => {
          if (msg.forecast) {
            this._forecast = msg.forecast.slice(0, 8);
          }
        },
        {
          type: 'weather/subscribe_forecast',
          forecast_type: 'hourly',
          entity_id: weatherEntityId,
        }
      );
    } catch {
      // Fallback: forecast from entity attributes (handled in getWeatherData)
    }
  }

  private _unsubscribeForecast(): void {
    if (this._forecastUnsub) {
      this._forecastUnsub();
      this._forecastUnsub = undefined;
    }
  }

  private get sections(): FloorSection[] {
    return buildFloorSections(this.hass, this._config);
  }

  private get weather(): WeatherData | null {
    if (!this._config.show_weather) return null;
    const data = getWeatherData(this.hass, this._config);
    if (data && this._forecast?.length && !data.forecast?.length) {
      data.forecast = this._forecast;
    }
    return data;
  }

  private get floorSystem(): FloorSystemData | null {
    return resolveFloorSystem(this.hass, this._config);
  }

  private get sunData(): SunData | null {
    return getSunData(this.hass);
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

  private updateZoneKind(climateEntity: string, kind: 'floor_heat' | 'thermostat'): void {
    const zone_kinds = { ...(this._config.zone_kinds ?? {}) };
    zone_kinds[climateEntity] = kind;
    const next = { ...this._config, zone_kinds };
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
        <span>Avg ${stats.simple_average ?? '\u2014'}\u00B0</span>
        <span>
          Est. @ ${stats.reference_height_ft} ft:
          ${stats.estimated_at_reference ?? '\u2014'}\u00B0
        </span>
        ${stats.gradient_per_ft != null
          ? html`<span>${stats.gradient_per_ft > 0 ? '+' : ''}${stats.gradient_per_ft}\u00B0/ft</span>`
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

  private tempToColor(temp: number | undefined): string {
    if (temp == null) return '#64b5f6';
    // Map temperature range: 50°F=cold blue, 90°F=warm orange, 130°F+=hot red
    const t = Math.max(50, Math.min(140, temp));
    const ratio = (t - 50) / 90;
    if (ratio < 0.33) {
      // Blue to cyan
      const r = Math.round(30 + ratio * 3 * 70);
      const g = Math.round(130 + ratio * 3 * 70);
      const b = Math.round(245 - ratio * 3 * 50);
      return `rgb(${r},${g},${b})`;
    } else if (ratio < 0.66) {
      // Cyan to orange
      const subRatio = (ratio - 0.33) / 0.33;
      const r = Math.round(100 + subRatio * 155);
      const g = Math.round(200 - subRatio * 50);
      const b = Math.round(195 - subRatio * 145);
      return `rgb(${r},${g},${b})`;
    } else {
      // Orange to red
      const subRatio = (ratio - 0.66) / 0.34;
      const r = Math.round(255);
      const g = Math.round(150 - subRatio * 80);
      const b = Math.round(50 - subRatio * 30);
      return `rgb(${r},${g},${b})`;
    }
  }

  private renderFloorSystem(): TemplateResult | null {
    const data = this.floorSystem;
    if (!data) return null;

    const inletTemp = data.return_temp?.value; // inlet = cold return
    const outletTemp = data.supply_temp?.value; // outlet = hot supply
    const inletColor = this.tempToColor(inletTemp);
    const outletColor = this.tempToColor(outletTemp);
    const inletUnit = data.return_temp?.unit ?? '°';
    const outletUnit = data.supply_temp?.unit ?? '°';

    return html`
      <div class="floor-system tankless-visual">
        <svg class="tankless-svg" viewBox="0 0 400 160" preserveAspectRatio="xMidYMid meet">
          <defs>
            <!-- Animated flow particles for inlet (cold) pipe -->
            <pattern id="inletFlow" x="0" y="0" width="20" height="10" patternUnits="userSpaceOnUse">
              <circle r="2.5" cx="5" cy="5" fill="${inletColor}" opacity="0.7">
                <animate attributeName="cx" from="-5" to="25" dur="1.2s" repeatCount="indefinite"/>
              </circle>
              <circle r="1.8" cx="15" cy="5" fill="${inletColor}" opacity="0.5">
                <animate attributeName="cx" from="5" to="35" dur="1.2s" repeatCount="indefinite"/>
              </circle>
            </pattern>
            <!-- Animated flow particles for outlet (hot) pipe -->
            <pattern id="outletFlow" x="0" y="0" width="20" height="10" patternUnits="userSpaceOnUse">
              <circle r="2.5" cx="5" cy="5" fill="${outletColor}" opacity="0.7">
                <animate attributeName="cx" from="-5" to="25" dur="0.9s" repeatCount="indefinite"/>
              </circle>
              <circle r="1.8" cx="15" cy="5" fill="${outletColor}" opacity="0.5">
                <animate attributeName="cx" from="5" to="35" dur="0.9s" repeatCount="indefinite"/>
              </circle>
            </pattern>
          </defs>

          <!-- Inlet pipe (cold, bottom) -->
          <rect x="0" y="105" width="130" height="14" rx="7" fill="rgba(100,181,246,0.15)" stroke="${inletColor}" stroke-width="1.5"/>
          <rect x="5" y="107" width="120" height="10" rx="5" fill="url(#inletFlow)"/>

          <!-- Outlet pipe (hot, top) -->
          <rect x="270" y="45" width="130" height="14" rx="7" fill="rgba(255,183,77,0.15)" stroke="${outletColor}" stroke-width="1.5"/>
          <rect x="275" y="47" width="120" height="10" rx="5" fill="url(#outletFlow)"/>

          <!-- Tankless water heater body -->
          <rect x="130" y="20" width="140" height="120" rx="10" fill="rgba(60,60,80,0.9)" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>

          <!-- Heater inner panel -->
          <rect x="145" y="35" width="110" height="50" rx="5" fill="rgba(30,30,45,0.8)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>

          <!-- Flame icons inside heater -->
          <text x="175" y="68" font-size="22" text-anchor="middle" fill="#ff7043" opacity="0.9">🔥</text>
          <text x="200" y="63" font-size="28" text-anchor="middle" fill="#ff9800">🔥</text>
          <text x="225" y="68" font-size="22" text-anchor="middle" fill="#ff7043" opacity="0.9">🔥</text>

          <!-- Heater label -->
          <text x="200" y="108" font-size="10" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-family="sans-serif" font-weight="600" letter-spacing="0.5">TANKLESS</text>
          <text x="200" y="122" font-size="8" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="sans-serif" letter-spacing="0.3">WATER HEATER</text>

          <!-- Connection pipes from unit to main pipes -->
          <!-- Inlet connection (bottom-left of heater to inlet pipe) -->
          <path d="M 155 140 L 155 112 Q 130 112 130 112" fill="none" stroke="${inletColor}" stroke-width="2" opacity="0.6"/>
          <!-- Outlet connection (top-right of heater to outlet pipe) -->
          <path d="M 245 40 L 245 52 Q 270 52 270 52" fill="none" stroke="${outletColor}" stroke-width="2" opacity="0.6"/>

          <!-- Inlet temp label -->
          <text x="60" y="100" font-size="11" text-anchor="middle" fill="${inletColor}" font-family="sans-serif" font-weight="700">${inletTemp != null ? `${inletTemp}${inletUnit}` : '—'}</text>
          <text x="60" y="133" font-size="8" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="sans-serif" font-weight="600">INLET</text>

          <!-- Outlet temp label -->
          <text x="340" y="40" font-size="11" text-anchor="middle" fill="${outletColor}" font-family="sans-serif" font-weight="700">${outletTemp != null ? `${outletTemp}${outletUnit}` : '—'}</text>
          <text x="340" y="73" font-size="8" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="sans-serif" font-weight="600">OUTLET</text>

          <!-- Delta T badge -->
          ${data.delta_t != null
            ? html`
                <rect x="170" y="132" width="60" height="18" rx="9" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" stroke-width="0.8"/>
                <text x="200" y="145" font-size="9" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-family="sans-serif" font-weight="600">ΔT ${data.delta_t}°</text>
              `
            : ''}

          <!-- Flow rate (if available) -->
          ${data.flow_rate
            ? html`
                <text x="200" y="15" font-size="8" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="sans-serif">Flow: ${data.flow_rate.value} ${data.flow_rate.unit}</text>
              `
            : ''}

          <!-- Pump status (if available) -->
          ${data.pump_entity != null
            ? html`
                <circle cx="385" cy="52" r="5" fill="${data.pump_active ? '#4caf50' : '#616161'}"/>
                <text x="385" y="70" font-size="6" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="sans-serif">PUMP</text>
              `
            : ''}
        </svg>
      </div>
    `;
  }

  private conditionIcon(condition?: string): string {
    const map: Record<string, string> = {
      'clear-night': '🌙',
      sunny: '☀️',
      partlycloudy: '⛅',
      cloudy: '☁️',
      rainy: '🌧️',
      snowy: '❄️',
      'snowy-rainy': '🌨️',
      hail: '🌨️',
      lightning: '⚡',
      'lightning-rainy': '⛈️',
      fog: '🌫️',
      windy: '💨',
      'windy-variant': '💨',
      exceptional: '⚠️',
      pouring: '🌧️',
    };
    return map[condition ?? ''] ?? '🌤️';
  }

  private renderWeatherStrip(): TemplateResult | null {
    const weather = this.weather;
    if (!weather) return null;

    return html`
      <div class="weather-strip">
        <div class="weather-main">
          <span class="weather-icon">${this.conditionIcon(weather.condition)}</span>
          <div>
            <div class="weather-temp">${weather.temperature ?? '\u2014'}\u00B0</div>
            <div class="weather-label">${weather.label}</div>
          </div>
        </div>
        <div class="weather-stats">
          ${weather.humidity != null ? html`<span>\uD83D\uDCA7 ${Math.round(weather.humidity)}%</span>` : ''}
          ${weather.feels_like != null ? html`<span>Feels ${Math.round(weather.feels_like)}\u00B0</span>` : ''}
          ${weather.dew_point != null ? html`<span>Dew ${Math.round(weather.dew_point)}\u00B0</span>` : ''}
          ${weather.wind_speed != null
            ? html`<span>\uD83D\uDCA8 ${Math.round(weather.wind_speed)}${weather.wind_gust ? ` (${Math.round(weather.wind_gust)})` : ''} mph</span>`
            : ''}
          ${weather.pressure != null ? html`<span>\uD83D\uDCCA ${Math.round(weather.pressure)} mb</span>` : ''}
          ${weather.uv_index != null ? html`<span>\u2600\uFE0F UV ${weather.uv_index}</span>` : ''}
        </div>
        ${weather.forecast?.length
          ? html`
              <div class="weather-forecast">
                ${weather.forecast.map((f) => {
                  const time = new Date(f.datetime).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
                  return html`
                    <div class="forecast-day">
                      <span class="forecast-day-name">${time}</span>
                      <span class="forecast-condition">${this.conditionIcon(f.condition)}</span>
                      <span class="forecast-temps">
                        <span class="forecast-hi">${f.temperature ?? '\u2014'}\u00B0</span>
                        <span class="forecast-lo">${f.templow ?? ''}${f.templow != null ? '\u00B0' : ''}</span>
                      </span>
                      ${f.precipitation_probability != null
                        ? html`<span class="forecast-precip">\uD83D\uDCA7${f.precipitation_probability}%</span>`
                        : ''}
                    </div>
                  `;
                })}
              </div>
            `
          : ''}
      </div>
    `;
  }

  private renderSunTracker(): TemplateResult | null {
    if (this._config.show_sun_tracker === false) return null;
    const sun = this.sunData;
    if (!sun) return null;

    const isUp = sun.state === 'above_horizon';

    // Use azimuth for horizontal position (E=90° on left, S=180° center, W=270° right)
    // Facing south: east is left, west is right (standard sun path diagram)
    const azNorm = Math.max(0, Math.min(1, (sun.azimuth - 45) / 270));
    // Use elevation for vertical position (higher elevation = higher on arc)
    const maxElev = 90;
    const elevNorm = Math.max(0, sun.elevation) / maxElev;

    // Arc points based on azimuth sweep (45° to 315°)
    const arcPoints: string[] = [];
    for (let i = 0; i <= 100; i++) {
      const t = i / 100;
      const x = 4 + t * 92;
      const y = 88 - Math.sin(t * Math.PI) * 55;
      arcPoints.push(`${x},${y}`);
    }
    const arcPath = `M ${arcPoints.join(' L ')}`;

    // Sun position: x from azimuth, y from elevation
    const sunX = 4 + azNorm * 92;
    const sunY = isUp ? 88 - elevNorm * 55 : 95;

    const fmt = (d: Date) =>
      d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const riseTime = fmt(sun.rising);
    const setTime = fmt(sun.setting);

    const hrs = Math.floor(sun.remaining_minutes / 60);
    const mins = sun.remaining_minutes % 60;
    const remaining = isUp ? `${hrs}h ${mins}m left` : 'Night';

    return html`
      <div class="sun-tracker">
        <svg class="sun-tracker-svg" viewBox="0 0 400 55">
          <defs>
            <linearGradient id="skyBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="${isUp ? 'rgba(25,118,210,0.35)' : 'rgba(20,20,60,0.6)'}" />
              <stop offset="100%" stop-color="${isUp ? 'rgba(255,183,77,0.08)' : 'rgba(30,30,80,0.2)'}" />
            </linearGradient>
            <radialGradient id="sunG">
              <stop offset="0%" stop-color="rgba(255,235,59,0.9)" />
              <stop offset="60%" stop-color="rgba(255,193,7,0.3)" />
              <stop offset="100%" stop-color="rgba(255,193,7,0)" />
            </radialGradient>
            <linearGradient id="arcG" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="rgba(255,183,77,0.5)" />
              <stop offset="50%" stop-color="rgba(255,235,59,0.7)" />
              <stop offset="100%" stop-color="rgba(255,138,80,0.5)" />
            </linearGradient>
          </defs>

          <rect x="0" y="0" width="400" height="55" rx="7" fill="url(#skyBg)" />
          <line x1="16" y1="48" x2="384" y2="48" stroke="rgba(255,255,255,0.15)" stroke-width="0.5" stroke-dasharray="3,2"/>

          <!-- Full arc (dashed) -->
          <path d="${arcPath}" fill="none" stroke="rgba(255,235,59,0.15)" stroke-width="0.6" stroke-dasharray="2,1.5"
                transform="scale(4,0.55) translate(0,0)"/>

          <!-- Traveled arc -->
          ${isUp ? html`
            <path d="M ${arcPoints.slice(0, Math.round(azNorm * 100) + 1).join(' L ')}"
                  fill="none" stroke="url(#arcG)" stroke-width="0.8"
                  transform="scale(4,0.55) translate(0,0)"/>
          ` : ''}

          <!-- Sun / Moon -->
          ${isUp ? html`
            <circle cx="${sunX * 4}" cy="${sunY * 0.55}" r="12" fill="url(#sunG)"/>
            <circle cx="${sunX * 4}" cy="${sunY * 0.55}" r="4" fill="#FFD54F" stroke="#FFF176" stroke-width="0.5"/>
          ` : html`
            <circle cx="200" cy="20" r="3.5" fill="rgba(200,200,220,0.7)" stroke="rgba(255,255,255,0.2)" stroke-width="0.4"/>
          `}

          <!-- E/W compass labels -->
          <text x="10" y="46" font-size="7" fill="rgba(255,255,255,0.35)" font-family="sans-serif" font-weight="600">E</text>
          <text x="196" y="10" font-size="7" fill="rgba(255,255,255,0.25)" font-family="sans-serif" font-weight="600" text-anchor="middle">S</text>
          <text x="390" y="46" font-size="7" fill="rgba(255,255,255,0.35)" font-family="sans-serif" font-weight="600" text-anchor="end">W</text>

          <!-- Sunrise label -->
          <text x="22" y="13" font-size="8" fill="#FFB74D" font-family="sans-serif" font-weight="600">↗ ${riseTime}</text>

          <!-- Sunset label -->
          <text x="378" y="13" font-size="8" fill="#FF8A50" font-family="sans-serif" font-weight="600" text-anchor="end">${setTime} ↘</text>

          <!-- Center info -->
          <text x="200" y="46" font-size="8" fill="rgba(255,255,255,0.6)" font-family="sans-serif" text-anchor="middle">
            ${isUp ? `${Math.round(sun.elevation)}° · ${remaining}` : 'Night'}
          </text>
        </svg>
      </div>
    `;
  }

  private renderSensorRow(label: string, value: number | undefined, unit = '\u00B0'): TemplateResult {
    return html`
      <div class="sensor-row">
        <span class="sensor-label">${label}</span>
        <span class="sensor-value">${value != null ? `${value}${unit}` : '\u2014'}</span>
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
      ? `Auto (HA: ${sensor.area}${autoZone ? ` \u2192 ${autoZone.name}` : ''})`
      : autoZone
        ? `Auto (\u2192 ${autoZone.name})`
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

  private renderZoneKindSetup(zone: ClimateZone): TemplateResult {
    const current = this._config.zone_kinds?.[zone.climate_entity] ?? zone.kind;
    const hasOverride = !!this._config.zone_kinds?.[zone.climate_entity];
    return html`
      <div class="zone-kind-setup" @click=${(e: Event) => e.stopPropagation()}>
        <span class="zone-kind-setup-label">Heating type${!hasOverride ? ' (auto)' : ''}</span>
        <div class="zone-kind-toggle">
          <button
            class="zone-kind-btn ${current === 'floor_heat' ? 'active floor' : ''}"
            @click=${() => this.updateZoneKind(zone.climate_entity, 'floor_heat')}
          >Floor Heat</button>
          <button
            class="zone-kind-btn ${current === 'thermostat' ? 'active hvac' : ''}"
            @click=${() => this.updateZoneKind(zone.climate_entity, 'thermostat')}
          >HVAC</button>
        </div>
      </div>
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
          <option value="">\u2014</option>
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
        <div class="room-sensor-temp">${sensor.value ?? '\u2014'}${sensor.unit ?? '\u00B0'}</div>
        ${this.renderSensorAssign(sensor)}
        ${this.renderHeightEditor(sensor.entity_id, sensor.height_ft)}
      </div>
    `;
  }

  private renderOtherSensorChip(sensor: AreaSensor): TemplateResult {
    return html`
      <div class="other-sensor-chip">
        <span class="other-sensor-name">${sensor.name}</span>
        <span class="other-sensor-value">${sensor.value ?? '\u2014'}${sensor.unit ?? ''}</span>
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
                ${hvacAction === 'heating' ? '\uD83D\uDD25 ' : hvacAction === 'cooling' ? '\u2744\uFE0F ' : ''}${this.actionLabel(hvacAction)}
              </span>
            </div>
            ${zone.area ? html`<div class="zone-area-label">${zone.area}</div>` : ''}
            ${this._setupMode ? this.renderZoneKindSetup(zone) : ''}
            ${this.renderZoneFloorEdit(zone)}
            ${this.renderZoneAreaEdit(zone)}
          </div>
          <div class="zone-temps">
            <div class="temp-target-row">
              <span class="target-label">Set to</span>
              <span class="target-temp">${target ?? '\u2014'}\u00B0</span>
            </div>
          </div>
        </div>

        <div class="zone-temp-grid">
          ${sensors.floor != null
            ? html`
                <div class="temp-cell">
                  <span class="temp-cell-label">Floor</span>
                  <span class="temp-cell-value">${sensors.floor}\u00B0</span>
                </div>
              `
            : ''}
          ${sensors.room != null
            ? html`
                <div class="temp-cell">
                  <span class="temp-cell-label">Room</span>
                  <span class="temp-cell-value">${sensors.room}\u00B0</span>
                </div>
              `
            : ''}
          ${current != null && sensors.floor == null && sensors.room == null
            ? html`
                <div class="temp-cell">
                  <span class="temp-cell-label">Current</span>
                  <span class="temp-cell-value">${current}\u00B0</span>
                </div>
              `
            : ''}
          ${current != null && (sensors.floor != null || sensors.room != null)
            ? html`
                <div class="temp-cell">
                  <span class="temp-cell-label">Thermostat</span>
                  <span class="temp-cell-value">${current}\u00B0</span>
                </div>
              `
            : ''}
          <div class="temp-cell temp-cell-target">
            <span class="temp-cell-label">Target</span>
            <span class="temp-cell-value">${target ?? '\u2014'}\u00B0</span>
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
                    \u2212
                  </button>
                  <span class="setpoint-display">${target ?? '\u2014'}\u00B0</span>
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

  /* \u2500\u2500 Floor plan \u2500\u2500 */

  private get fpThermostats(): FloorPlanThermostat[] {
    return this._config.floor_plan?.thermostats ?? [];
  }

  private fpEntityData(entityId: string) {
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
      unit: (attrs.unit_of_measurement as string) ?? '',
    };
  }

  private handleFpClick(e: MouseEvent): void {
    if (!this._placingThermostat) return;
    const container = (e.currentTarget as HTMLElement);
    const rect = container.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

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

  private renderFloorPlan(): TemplateResult {
    const thermostats = this.fpThermostats;
    const placing = this._placingThermostat;
    const allEntities = Object.keys(this.hass.states)
      .filter((e) => e.startsWith('climate.') || e.startsWith('sensor.'))
      .sort();

    return html`
      <div class="floor-plan-container">
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
        ${placing
          ? html`<div class="fp-placing-hint">Click on the floor plan to place a ${placing === 'wall' ? 'wall thermostat' : 'floor sensor'}</div>`
          : ''}

        <div class="fp-map ${placing ? 'placing' : ''}"
             @click=${(e: MouseEvent) => this.handleFpClick(e)}>
          <img class="fp-img" src="${FLOORPLAN_IMAGE}" alt="Floor Plan"/>

          ${thermostats.map((t) => {
            const td = t.entity_id ? this.fpEntityData(t.entity_id) : null;
            const isWall = t.kind === 'wall';
            return html`
              <div class="fp-marker ${isWall ? 'wall' : 'floor'}"
                   style="left:${t.x}%;top:${t.y}%">
                <div class="fp-marker-dot">${isWall ? 'T' : 'F'}</div>
                <div class="fp-marker-info">
                  <span class="fp-marker-label">${t.label}</span>
                  ${td ? html`<span class="fp-marker-temp">${td.current ?? '\u2014'}${td.unit || '\u00B0'}</span>` : ''}
                </div>
              </div>
            `;
          })}
        </div>

        ${thermostats.length ? html`
          <div class="fp-tstat-list">
            <div class="fp-tstat-list-title">Sensors on Plan</div>
            ${thermostats.map((t, idx) => html`
              <div class="fp-tstat-row">
                <span class="fp-tstat-badge ${t.kind}">${t.kind === 'wall' ? 'Wall' : 'Floor'}</span>
                <input class="fp-tstat-input" type="text" .value=${t.label}
                       placeholder="Label"
                       @change=${(e: Event) => this.updateFpThermostat(idx, 'label', (e.target as HTMLInputElement).value)}/>
                <select class="fp-tstat-select"
                        @change=${(e: Event) => this.updateFpThermostat(idx, 'entity_id', (e.target as HTMLSelectElement).value)}>
                  <option value="" ?selected=${!t.entity_id}>Pick entity...</option>
                  ${allEntities.map((eid) => html`
                    <option value="${eid}" ?selected=${t.entity_id === eid}>
                      ${(this.hass.states[eid]?.attributes?.friendly_name as string) ?? eid}
                    </option>
                  `)}
                </select>
                <button class="fp-tstat-del" @click=${() => this.removeFpThermostat(idx)}>\u2715</button>
              </div>
            `)}
          </div>
        ` : ''}

        <div class="fp-legend-bar">
          <div class="fp-legend-item"><span class="fp-legend-swatch fp-swatch-wall"></span>Wall Thermostat</div>
          <div class="fp-legend-item"><span class="fp-legend-swatch fp-swatch-floor"></span>Floor Sensor</div>
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
            ${!isFloorPlan
              ? html`
                  <button
                    class="edit-sensors-btn ${this._setupMode ? 'active' : ''}"
                    @click=${() => { this._setupMode = !this._setupMode; if (this._setupMode) this._editSensors = false; }}
                  >
                    ${this._setupMode ? 'Done' : 'Setup'}
                  </button>
                `
              : ''}
            ${!isFloorPlan && canEdit && !this._setupMode
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
              <div class="top-strip">
                ${this.renderWeatherStrip()}
                ${this.renderFloorSystem()}
              </div>
              ${this.renderSunTracker()}
              ${this.renderFloorPlan()}
            `
          : html`
              ${this._setupMode
                ? html`<div class="edit-hint">Set each zone's heating type: Floor Heat or HVAC. Save the dashboard to keep changes.</div>`
                : this._editSensors
                  ? html`<div class="edit-hint">Assign sensors to HA areas or zones, set floor per zone, or hide. Save the dashboard to keep layout changes.</div>`
                  : ''}
              <div class="top-strip">
                ${this.renderWeatherStrip()}
                ${this.renderFloorSystem()}
              </div>
              ${this.renderSunTracker()}
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
