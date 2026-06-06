import { CSSResultGroup, css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';
import { ClimateCommandCenterConfig, ZoneConfig } from './types';

@customElement('climate-command-center-editor')
export class ClimateCommandCenterEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: ClimateCommandCenterConfig;

  public setConfig(config: ClimateCommandCenterConfig): void {
    this._config = {
      auto_discover: true,
      show_weather: true,
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

  private _climateEntities(): string[] {
    return Object.keys(this.hass.states).filter((id) => id.startsWith('climate.'));
  }

  private _sensorEntities(): string[] {
    return Object.keys(this.hass.states).filter((id) => id.startsWith('sensor.'));
  }

  protected render() {
    if (!this.hass) return html``;

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
            Show room sensors
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
                      <select
                        .value=${zone.floor_sensor ?? ''}
                        @change=${(e: Event) =>
                          this._zoneChanged(
                            i,
                            'floor_sensor',
                            (e.target as HTMLSelectElement).value
                          )}
                      >
                        <option value="">Floor sensor (auto)</option>
                        ${this._sensorEntities().map(
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
    return [
      css`
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
      `,
    ];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'climate-command-center-editor': ClimateCommandCenterEditor;
  }
}
