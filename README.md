# Climate Command Center

A Home Assistant Lovelace custom card that puts all your temperature controls and data on one screen — heated floors, thermostats, room sensors, and external weather stations (Weatherflow Tempest, etc.).

## Features

- **Auto-discovery** of all `climate.*` entities (heated floors, thermostats)
- **Smart sensor pairing** — matches floor, room, and humidity sensors by zone name
- **Weather strip** — outside temp, humidity, feels-like, and dew point from Tempest or other weather sensors
- **Floor grouping** — Main Floor / Upper Floor sections with climate zones and room sensors
- **Room sensor grid** — read-only chips for standalone temperature sensors (bedrooms, hallways, etc.)
- **Inline controls** — tap a zone to adjust HVAC mode and setpoint
- **Visual editor** — configure via the Lovelace UI

## Installation (HACS)

1. Add this repo as a [custom HACS repository](https://hacs.xyz/docs/faq/custom_repositories/) (category: **Dashboard**)
2. Install **Climate Command Center**
3. Add the resource (if not auto-added):

```yaml
lovelace:
  resources:
    - url: /hacsfiles/climate-command-center/climate-command-center.js
      type: module
```

4. Add the card to a dashboard — see [examples/dashboard.yaml](examples/dashboard.yaml)

## Quick start

```yaml
type: custom:climate-command-center
auto_discover: true
show_weather: true
show_room_sensors: true
group_by_floor: true
```

## Configuration

| Option | Default | Description |
|--------|---------|-------------|
| `title` | Climate Command Center | Card header title |
| `auto_discover` | `true` | Find all climate entities automatically |
| `show_weather` | `true` | Show outside weather strip |
| `show_room_sensors` | `true` | Show standalone room temperature sensors |
| `group_by_floor` | `true` | Group zones and sensors by floor |
| `floors` | built-in defaults | Floor names with zone/sensor name hints |
| `weather_temperature` | auto | Override outside temp sensor entity |
| `zones` | — | Manual zone list (disables auto_discover) |
| `room_sensors` | auto | Manual list of room sensor entity IDs |
| `exclude_entities` | — | Entity IDs to exclude from discovery |

### Floor grouping

The card ships with defaults tuned for a multi-floor home (Main Floor + Upper Floor). Override with:

```yaml
floors:
  - name: Main Floor
    zones: [Laundry, Living Room, Main Area, Redmond Thermostat]
    room_sensors: [Family Room, Kitchen, Hallway, Primary Bedroom]
  - name: Upper Floor
    zones: [Main Office]
    room_sensors: [Hunters, Sydney, Upstair Office]
```

Zone and sensor names are matched case-insensitively against entity friendly names.

## Development

```bash
npm install
npm run build
```

Copy `dist/climate-command-center.js` to `config/www/` for local testing:

```yaml
resources:
  - url: /local/climate-command-center.js
    type: module
```

## License

MIT
