import { CSSResultGroup, css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';
import { ClimateCommandCenterConfig, ZoneConfig } from './types';
import { buildZones, floorNames, listAssignableSensors, listHaAreas } from './utils/entity-resolver';

@customElement('climate-command-center-editor')
export class ClimateCommandCenterEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: ClimateCommandCenterConfig;

  public setConfig(config: ClimateCommandCenterConfig): void {
    this._config = {
      auto_discover: true,
      show_weather: true,
      show_room_sensors: true,
      group_by_floor: true,
      allow_sensor_reassign: true,
      reference_height_ft: 5,
      ...config,
    };
  }

  private _valueChanged(field: string, value: unknown): void {
    const event = new CustomEvent('config-changed', {
      detail: { config: { ...this._config, [field]: value } },
    });
    this.dispatchEvent(event);
  }

  private _zoneChanged(index: number, field: keyof ZoneConfig, value: string): void {
    const zones = [...(this._config.zones ?? [])];
    zones[index] = { ...zones[index], [field]: value };
    this._valueChanged('zones', zones);
    this._valueChanged('auto_discover', false);
  }

  private _addZone(): void {
    const zones = [...(this._config.zones ?? []), { name: 'New Zone', climate_entity: '' }];
    this._valueChanged('zones', zones);
    this._valueChanged('auto_discover', false);
  }

  private _removeZone(index: number): void {
    const zones = (this._config.zones ?? []).filter((_, i) => i !== index);
    this._valueChanged('zones', zones);
  }

  private _sensorAssignmentChanged(entityId: string, value: string): void {
    const sensor_map = { ...(this._config.sensor_map ?? {}) };
    const exclude = new Set(this._config.exclude_entities ?? []);

    if (value === '__hidden__') {
      exclude.add(entityId);
      delete sensor_map[entityId];
    } else if (value === '__auto__') {
      exclude.delete(entityId);
      delete sensor_map[entityId];
    } else {
      exclude.delete(entityId);
      sensor_map[entityId] = value;
    }

    this._valueChanged('sensor_map', sensor_map);
    this._valueChanged('exclude_entities', [...exclude]);
  }

  private _climateEntities(): string[] {
    return Object.keys(this.hass.states).filter((id) => id.startsWith('climate.'));
  }

  private _sensorEntities(): string[] {
    return Object.keys(this.hass.states).filter((id) => id.startsWith('sensor.'));
  }

  private _zoneOptions(): Array<{ id: string; name: string }> {
    return buildZones(this.hass, this._config).map((z) => ({
      id: z.climate_entity,
      name: `${z.name}${z.area ? ` (${z.area})` : ''}`,
    }));
  }

  private _sensorHeightChanged(entityId: string, raw: string): void {
    const sensor_heights = { ...(this._config.sensor_heights ?? {}) };
    const trimmed = raw.trim();
    if (!trimmed) {
      delete sensor_heights[entityId];
    } else {
      const height = parseFloat(trimmed);
      if (Number.isNaN(height) || height < 0) return;
      sensor_heights[entityId] = height;
    }
    this._valueChanged('sensor_heights', sensor_heights);
  }

  private _referenceHeightChanged(raw: string): void {
    const height = parseFloat(raw);
    if (Number.isNaN(height) || height < 0) return;
    this._valueChanged('reference_height_ft', height);
  }

  private _zoneFloorChanged(climateEntity: string, floorName: string): void {
    const zone_floors = { ...(this._config.zone_floors ?? {}) };
    if (floorName === '__default__') delete zone_floors[climateEntity];
    else zone_floors[climateEntity] = floorName;
    this._valueChanged('zone_floors', zone_floors);
  }

  protected render() {
    if (!this.hass) return html``;

    const assignable = listAssignableSensors(this.hass, this._config);
    const zones = buildZones(this.hass, this._config);
    const haAreas = listHaAreas(this.hass);
    const floors = floorNames(this._config);

    return html`
      <div class="editor">
        <div class="field">
          <label>Title</label>
          <input
            type="text"
            .value=${this._config.title ?? 'Climate Command Center'}
            @change=${(e: Event) =>
              this._valueChanged('title', (e.target as HTMLInputElement).value)}
          />
        </div>

        <div class="field checkbox">
          <label>
            <input
              type="checkbox"
              .checked=${this._config.auto_discover ?? true}
              @change=${(e: Event) =>
                this._valueChanged('auto_discover', (e.target as HTMLInputElement).checked)}
            />
            Auto-discover climate entities
          </label>
        </div>

        <div class="field checkbox">
          <label>
            <input
              type="checkbox"
              .checked=${this._config.show_weather ?? true}
              @change=${(e: Event) =>
                this._valueChanged('show_weather', (e.target as HTMLInputElement).checked)}
            />
            Show weather strip
          </label>
        </div>

        <div class="field checkbox">
          <label>
            <input
              type="checkbox"
              .checked=${this._config.show_room_sensors ?? true}
              @change=${(e: Event) =>
                this._valueChanged('show_room_sensors', (e.target as HTMLInputElement).checked)}
            />
            Show area sensors with thermostats
          </label>
        </div>

        <div class="field checkbox">
          <label>
            <input
              type="checkbox"
              .checked=${this._config.group_by_floor ?? true}
              @change=${(e: Event) =>
                this._valueChanged('group_by_floor', (e.target as HTMLInputElement).checked)}
            />
            Group by floor
          </label>
        </div>

        <div class="field checkbox">
          <label>
            <input
              type="checkbox"
              .checked=${this._config.allow_sensor_reassign ?? true}
              @change=${(e: Event) =>
                this._valueChanged('allow_sensor_reassign', (e.target as HTMLInputElement).checked)}
            />
            Allow sensor reassignment on dashboard
          </label>
        </div>

        <div class="field">
          <label>Reference height for averages (feet from floor)</label>
          <input
            type="number"
            min="0"
            step="0.5"
            .value=${String(this._config.reference_height_ft ?? 5)}
            @change=${(e: Event) =>
              this._referenceHeightChanged((e.target as HTMLInputElement).value)}
          />
        </div>

        <div class="sensors-section">
          <div class="section-header">
            <span>Sensor assignments</span>
            <span class="section-meta">${assignable.length} sensors</span>
          </div>
          <p class="help">
            Auto uses HA areas. Use the dashboard Assign mode to set HA areas on entities. Override zone or hide below.
          </p>
          ${assignable.map((sensor) => {
            const current = sensor.hidden
              ? '__hidden__'
              : sensor.assigned_zone ?? '__auto__';
            const autoLabel = sensor.area
              ? `Auto (HA: ${sensor.area}${sensor.auto_zone_name ? ` → ${sensor.auto_zone_name}` : ''})`
              : sensor.auto_zone_name
                ? `Auto (→ ${sensor.auto_zone_name})`
                : 'Auto (by HA area)';
            return html`
              <div class="sensor-row-editor ${sensor.kind}">
                <div class="sensor-row-info">
                  <strong>${sensor.name}</strong>
                  <span class="sensor-meta">${sensor.entity_id}${sensor.area ? ` · HA area: ${sensor.area}` : ' · no HA area'}</span>
                  <span class="sensor-kind">${sensor.kind === 'other' ? 'gear/misc' : 'room'}</span>
                </div>
                <div class="sensor-row-controls">
                  <label class="height-field">
                    <span>Height</span>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="ft"
                      .value=${sensor.height_ft != null ? String(sensor.height_ft) : ''}
                      @change=${(e: Event) =>
                        this._sensorHeightChanged(
                          sensor.entity_id,
                          (e.target as HTMLInputElement).value
                        )}
                    />
                  </label>
                  <select
                    .value=${current}
                    @change=${(e: Event) =>
                      this._sensorAssignmentChanged(
                        sensor.entity_id,
                        (e.target as HTMLSelectElement).value
                      )}
                  >
                    <option value="__auto__">${autoLabel}</option>
                    <optgroup label="HA Areas (set on dashboard)">
                      ${haAreas.map((a) => html`<option disabled value=${`area:${a.area_id}`}>${a.name}</option>`)}
                    </optgroup>
                    <optgroup label="Climate zones">
                      ${this._zoneOptions().map(
                        (z) => html`<option value=${z.id}>${z.name}</option>`
                      )}
                    </optgroup>
                    <option value="__hidden__">Hide</option>
                  </select>
                </div>
              </div>
            `;
          })}
        </div>

        <div class="zones-section">
          <div class="section-header">
            <span>Zone floors</span>
            <span class="section-meta">${zones.length} zones</span>
          </div>
          <p class="help">Override which floor section a climate zone appears in. Auto uses HA area mapping.</p>
          ${zones.map(
            (zone) => html`
              <div class="zone-floor-row">
                <div>
                  <strong>${zone.name}</strong>
                  <span class="sensor-meta">${zone.area ?? 'no HA area'}</span>
                </div>
                <select
                  .value=${this._config.zone_floors?.[zone.climate_entity] ?? '__default__'}
                  @change=${(e: Event) =>
                    this._zoneFloorChanged(
                      zone.climate_entity,
                      (e.target as HTMLSelectElement).value
                    )}
                >
                  <option value="__default__">Auto (from HA area)</option>
                  ${floors.map((f) => html`<option value=${f}>${f}</option>`)}
                </select>
              </div>
            `
          )}
        </div>

        ${!(this._config.auto_discover ?? true)
          ? html`
              <div class="zones-section">
                <div class="section-header">
                  <span>Zones</span>
                  <button @click=${this._addZone}>+ Add Zone</button>
                </div>
                ${(this._config.zones ?? []).map(
                  (zone, i) => html`
                    <div class="zone-editor">
                      <input
                        type="text"
                        placeholder="Zone name"
                        .value=${zone.name}
                        @change=${(e: Event) =>
                          this._zoneChanged(i, 'name', (e.target as HTMLInputElement).value)}
                      />
                      <select
                        .value=${zone.climate_entity}
                        @change=${(e: Event) =>
                          this._zoneChanged(
                            i,
                            'climate_entity',
                            (e.target as HTMLSelectElement).value
                          )}
                      >
                        <option value="">Select climate entity</option>
                        ${this._climateEntities().map(
                          (id) => html`<option value=${id}>${id}</option>`
                        )}
                      </select>
                      <button class="remove" @click=${() => this._removeZone(i)}>Remove</button>
                    </div>
                  `
                )}
              </div>
            `
          : ''}
      </div>
    `;
  }

  static get styles(): CSSResultGroup {
    return css`
      .editor {
        padding: 8px;
      }
      .field {
        margin-bottom: 12px;
      }
      .field label {
        display: block;
        font-size: 0.85rem;
        margin-bottom: 4px;
        color: var(--primary-text-color);
      }
      .field input[type='text'] {
        width: 100%;
        padding: 8px;
        border-radius: 4px;
        border: 1px solid var(--divider-color);
        background: var(--card-background-color);
        color: var(--primary-text-color);
      }
      .checkbox label {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
      }
      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 16px 0 8px;
        font-weight: 600;
      }
      .section-meta {
        font-size: 0.75rem;
        color: var(--secondary-text-color);
        font-weight: 400;
      }
      .help {
        font-size: 0.78rem;
        color: var(--secondary-text-color);
        margin: 0 0 8px;
      }
      .sensors-section {
        max-height: 320px;
        overflow-y: auto;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        padding: 8px;
        margin-bottom: 12px;
      }
      .sensor-row-editor {
        display: grid;
        grid-template-columns: 1fr 200px;
        gap: 8px;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      }
      .sensor-row-controls {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .height-field {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 0.68rem;
        color: var(--secondary-text-color);
      }
      .height-field input {
        width: 56px;
        padding: 4px 6px;
        border-radius: 4px;
        border: 1px solid var(--divider-color);
        background: var(--card-background-color);
        color: var(--primary-text-color);
        font-size: 0.72rem;
      }
      .field input[type='number'] {
        width: 100%;
        max-width: 120px;
        padding: 8px;
        border-radius: 4px;
        border: 1px solid var(--divider-color);
        background: var(--card-background-color);
        color: var(--primary-text-color);
      }
      .sensor-row-editor.other {
        opacity: 0.85;
      }
      .sensor-row-info strong {
        display: block;
        font-size: 0.82rem;
      }
      .sensor-meta {
        display: block;
        font-size: 0.68rem;
        color: var(--secondary-text-color);
      }
      .sensor-kind {
        font-size: 0.62rem;
        text-transform: uppercase;
        color: var(--primary-color);
      }
      .sensor-row-editor select {
        padding: 6px;
        border-radius: 4px;
        border: 1px solid var(--divider-color);
        background: var(--card-background-color);
        color: var(--primary-text-color);
        font-size: 0.75rem;
      }
      .zone-floor-row {
        display: grid;
        grid-template-columns: 1fr 160px;
        gap: 8px;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      }
      .zone-floor-row select {
        padding: 6px;
        border-radius: 4px;
        border: 1px solid var(--divider-color);
        background: var(--card-background-color);
        color: var(--primary-text-color);
        font-size: 0.75rem;
      }
      .section-header button {
        padding: 4px 12px;
        border-radius: 4px;
        border: none;
        background: var(--primary-color);
        color: white;
        cursor: pointer;
      }
      .zone-editor {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 10px;
        margin-bottom: 8px;
        border-radius: 8px;
        background: var(--secondary-background-color);
      }
      .zone-editor select,
      .zone-editor input {
        padding: 6px;
        border-radius: 4px;
        border: 1px solid var(--divider-color);
        background: var(--card-background-color);
        color: var(--primary-text-color);
      }
      .remove {
        align-self: flex-end;
        padding: 4px 10px;
        border: none;
        border-radius: 4px;
        background: #c62828;
        color: white;
        cursor: pointer;
        font-size: 0.8rem;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'climate-command-center-editor': ClimateCommandCenterEditor;
  }
}
