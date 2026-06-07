import { CSSResultGroup, css } from 'lit';

export const styles: CSSResultGroup = css`
  :host {
    display: block;
  }

  ha-card {
    padding: 16px;
    background: var(--card-background-color, var(--ha-card-background, #1c1c1c));
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .edit-sensors-btn {
    padding: 4px 10px;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: transparent;
    color: var(--secondary-text-color);
    font-size: 0.72rem;
    cursor: pointer;
  }

  .edit-sensors-btn.active {
    background: var(--primary-color, #0288d1);
    border-color: var(--primary-color, #0288d1);
    color: white;
  }

  .edit-hint {
    font-size: 0.75rem;
    color: var(--secondary-text-color);
    margin: -4px 0 12px;
    padding: 8px 10px;
    border-radius: 8px;
    background: rgba(2, 136, 209, 0.1);
  }

  .card-title {
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--primary-text-color);
  }

  .zone-count {
    font-size: 0.75rem;
    color: var(--secondary-text-color);
    opacity: 0.7;
  }

  .weather-strip {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 18px;
    margin-bottom: 18px;
    border-radius: 14px;
    background: linear-gradient(135deg, rgba(2, 136, 209, 0.28), rgba(0, 150, 136, 0.18));
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
  }

  .weather-main {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .weather-icon {
    font-size: 2rem;
  }

  .weather-temp {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--primary-text-color);
    line-height: 1.1;
  }

  .weather-label {
    font-size: 0.75rem;
    color: var(--secondary-text-color);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .weather-stats {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 0.82rem;
    color: var(--secondary-text-color);
    text-align: right;
  }

  .floor-section {
    margin-bottom: 20px;
  }

  .floor-section:last-child {
    margin-bottom: 0;
  }

  .floor-header {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin-bottom: 10px;
    padding-bottom: 6px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .floor-name {
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--primary-color, #0288d1);
  }

  .floor-meta {
    font-size: 0.72rem;
    color: var(--secondary-text-color);
  }

  .zones-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 12px;
    margin-bottom: 12px;
  }

  .zone-card {
    padding: 14px;
    border-radius: 14px;
    background: var(--secondary-background-color, rgba(255, 255, 255, 0.04));
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-left: 3px solid var(--primary-color, #0288d1);
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
    cursor: pointer;
  }

  .zone-card:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
  }

  .zone-card.expanded {
    border-color: var(--primary-color, #0288d1);
    box-shadow: 0 0 0 1px var(--primary-color, #0288d1);
  }

  .zone-card.floor_heat {
    border-left-color: #ff7043;
  }

  .zone-card.thermostat {
    border-left-color: #42a5f5;
  }

  .zone-card.mode-heat {
    background: linear-gradient(180deg, rgba(255, 112, 67, 0.08), transparent 60%);
  }

  .zone-card.mode-cool {
    background: linear-gradient(180deg, rgba(66, 165, 245, 0.08), transparent 60%);
  }

  .zone-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 10px;
  }

  .zone-name-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .zone-name {
    font-weight: 600;
    font-size: 0.95rem;
    color: var(--primary-text-color);
  }

  .zone-kind-badge {
    font-size: 0.62rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 2px 6px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.08);
    color: var(--secondary-text-color);
  }

  .zone-mode {
    font-size: 0.7rem;
    text-transform: uppercase;
    margin-top: 4px;
    letter-spacing: 0.04em;
    color: var(--secondary-text-color);
  }

  .zone-mode.mode-heat { color: #ff7043; }
  .zone-mode.mode-cool { color: #42a5f5; }
  .zone-mode.mode-auto { color: #26a69a; }

  .zone-area-label {
    font-size: 0.68rem;
    color: var(--secondary-text-color);
    margin-top: 2px;
    opacity: 0.85;
  }

  .zone-floor-edit,
  .zone-area-edit {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 4px;
    font-size: 0.68rem;
    color: var(--secondary-text-color);
  }

  .zone-floor-edit select,
  .zone-area-edit select {
    max-width: 160px;
    padding: 2px 4px;
    border-radius: 4px;
    border: 1px solid var(--divider-color);
    background: var(--card-background-color);
    color: var(--primary-text-color);
    font-size: 0.68rem;
  }

  .zone-area-sensors {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }

  .zone-temps {
    text-align: right;
  }

  .current-temp {
    font-size: 1.45rem;
    font-weight: 700;
    color: var(--primary-text-color);
  }

  .target-temp {
    display: block;
    font-size: 0.8rem;
    color: var(--secondary-text-color);
  }

  .temp-delta {
    display: inline-block;
    margin-top: 4px;
    font-size: 0.68rem;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 999px;
  }

  .temp-delta.above {
    background: rgba(255, 112, 67, 0.18);
    color: #ff7043;
  }

  .temp-delta.below {
    background: rgba(66, 165, 245, 0.18);
    color: #42a5f5;
  }

  .temp-delta.at {
    background: rgba(38, 166, 154, 0.18);
    color: #26a69a;
  }

  .zone-sensors {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 16px;
    margin-bottom: 4px;
  }

  .sensor-row {
    display: flex;
    gap: 6px;
    font-size: 0.78rem;
  }

  .sensor-label {
    color: var(--secondary-text-color);
  }

  .sensor-value {
    color: var(--primary-text-color);
    font-weight: 500;
  }

  .height-stats {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 12px;
    margin: 6px 0 8px;
    padding: 6px 8px;
    border-radius: 8px;
    background: rgba(2, 136, 209, 0.08);
    border: 1px solid rgba(2, 136, 209, 0.15);
    font-size: 0.72rem;
    color: var(--secondary-text-color);
  }

  .height-stats-meta {
    opacity: 0.7;
  }

  .height-badge {
    display: inline-block;
    margin-left: 4px;
    padding: 0 4px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.06);
    font-size: 0.58rem;
    color: var(--secondary-text-color);
    vertical-align: middle;
  }

  .height-edit,
  .zone-height-edit {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 4px;
    font-size: 0.68rem;
    color: var(--secondary-text-color);
  }

  .height-edit input,
  .zone-height-edit input {
    width: 52px;
    padding: 2px 4px;
    border-radius: 4px;
    border: 1px solid var(--divider-color);
    background: var(--card-background-color);
    color: var(--primary-text-color);
    font-size: 0.72rem;
  }

  .zone-height-edit {
    margin-bottom: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  .room-sensors-block {
    margin-top: 4px;
  }

  .room-sensors-label {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--secondary-text-color);
    margin-bottom: 8px;
  }

  .room-sensors-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 8px;
    margin-bottom: 8px;
  }

  .room-sensor-chip {
    padding: 8px 10px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .other-sensors-box {
    margin-top: 6px;
    padding: 6px 8px;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.12);
    border: 1px dashed rgba(255, 255, 255, 0.08);
  }

  .other-sensors-label,
  .unassigned-label {
    font-size: 0.62rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--secondary-text-color);
    opacity: 0.75;
    margin-bottom: 4px;
  }

  .other-sensors-list {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 8px;
  }

  .other-sensor-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 6px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.03);
    font-size: 0.62rem;
    line-height: 1.2;
    max-width: 100%;
  }

  .other-sensor-name {
    color: var(--secondary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 120px;
  }

  .other-sensor-value {
    color: var(--primary-text-color);
    font-weight: 600;
    white-space: nowrap;
  }

  .sensor-assign-select {
    width: 100%;
    margin-top: 4px;
    font-size: 0.65rem;
    padding: 2px 4px;
    border-radius: 4px;
    border: 1px solid var(--divider-color);
    background: var(--card-background-color);
    color: var(--primary-text-color);
  }

  .other-sensor-chip .sensor-assign-select {
    margin-top: 2px;
    font-size: 0.58rem;
    min-width: 100px;
  }

  .unassigned-block {
    margin-top: 10px;
    padding: 8px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.02);
  }

  .room-sensor-name {
    font-size: 0.78rem;
    color: var(--secondary-text-color);
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .room-sensor-temp {
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--primary-text-color);
  }

  .room-sensor-area {
    font-size: 0.65rem;
    color: var(--secondary-text-color);
    opacity: 0.75;
    margin-top: 2px;
  }

  .zone-controls {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .mode-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 10px;
  }

  .mode-btn {
    padding: 4px 10px;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: transparent;
    color: var(--secondary-text-color);
    font-size: 0.72rem;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.15s;
  }

  .mode-btn:hover {
    border-color: var(--primary-color, #0288d1);
    color: var(--primary-text-color);
  }

  .mode-btn.active {
    color: white;
  }

  .mode-btn.active.mode-heat { background: #ff7043; border-color: #ff7043; }
  .mode-btn.active.mode-cool { background: #42a5f5; border-color: #42a5f5; }
  .mode-btn.active.mode-auto { background: #26a69a; border-color: #26a69a; }
  .mode-btn.active.mode-off { background: #616161; border-color: #616161; }

  .setpoint-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
  }

  .step-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.05);
    color: var(--primary-text-color);
    font-size: 1.2rem;
    cursor: pointer;
    transition: background 0.15s;
  }

  .step-btn:hover {
    background: var(--primary-color, #0288d1);
    border-color: var(--primary-color, #0288d1);
    color: white;
  }

  .setpoint-display {
    font-size: 1.2rem;
    font-weight: 600;
    min-width: 48px;
    text-align: center;
    color: var(--primary-text-color);
  }

  .empty {
    text-align: center;
    padding: 24px;
    color: var(--secondary-text-color);
    font-size: 0.9rem;
  }

  @media (max-width: 600px) {
    .weather-strip {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    .weather-stats {
      flex-direction: row;
      gap: 12px;
      text-align: left;
    }

    .zones-grid,
    .room-sensors-grid {
      grid-template-columns: 1fr;
    }
  }
`;
