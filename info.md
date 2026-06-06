# Climate Command Center

Unified temperature dashboard for Home Assistant.

## Features

- Auto-discovers climate entities (heated floors + thermostats)
- Pairs floor, room, and humidity sensors by zone name
- Weather strip for Tempest / Weatherflow outdoor data
- Floor grouping with read-only room sensor chips
- Tap a zone to adjust HVAC mode and setpoint

## Install

Install via HACS as a **Dashboard** plugin using:

`https://github.com/redawg/lovelace-climate-command-center`

Then add the card:

```yaml
type: custom:climate-command-center
auto_discover: true
show_weather: true
show_room_sensors: true
group_by_floor: true
```

See [README.md](README.md) for full configuration.
