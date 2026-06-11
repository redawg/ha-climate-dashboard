# Climate Command Center

Unified temperature dashboard for Home Assistant — heated floors, thermostats, room sensors, and outdoor weather on one screen.

## Features

- Auto-discovers climate entities (heated floors + thermostats)
- Pairs floor, room, and humidity sensors by zone name and HA area
- Weather strip for Tempest / Weatherflow outdoor data
- Floor grouping with read-only room sensor chips
- Tap a zone to adjust HVAC mode and setpoint

## Install

Install via HACS as a **Dashboard** plugin:

`https://github.com/redawg/ha-climate-dashboard`

Then add the card:

```yaml
type: custom:climate-command-center
auto_discover: true
show_weather: true
show_room_sensors: true
group_by_floor: true
```

See [README.md](README.md) for full configuration.
