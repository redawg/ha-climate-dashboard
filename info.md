# Climate Command Center

Unified temperature dashboard for Home Assistant.

![Climate Command Center](https://github.com/user-attachments/assets/placeholder)

## Features

- Auto-discovers all climate entities (heated floors, thermostats)
- Pairs floor, room, and humidity sensors by zone name
- Weather strip for Tempest / Weatherflow and other outdoor sensors
- Tap a zone to adjust HVAC mode and setpoint

## Install

Install via HACS as a **Dashboard** plugin, then add the card:

```yaml
type: custom:climate-command-center
auto_discover: true
show_weather: true
```

See [README.md](README.md) for full configuration options.
