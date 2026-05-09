# Voidfront

> An infinite looping space world built with HTML Canvas 2D - drifting ships, animated stars, asteroids, smooth trails, and a minimap. Strangely relaxing to watch.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit-blueviolet?style=for-the-badge)](https://voidfront.netlify.app/)


## ✨ Features

- 🌌 **Infinite looping world** - objects exit one edge and reappear on the opposite side, creating a seamless toroidal space
- 🚀 **Drifting ships** - multiple planes drifting independently through the world
- ✨ **Smooth trails** - each ship leaves a fading trail as it moves
- ⭐ **Animated stars** - parallax star field for depth
- ☄️ **Asteroids** - scattered across the world adding life and obstacles
- 🗺️ **Minimap** - spot approaching ships before they reach your screen
- 🛠️ **Shape editor** - a built-in visual tool for designing and exporting normalized ship/object vertices


## 🌐 Live Demo

👉 [**Try it here**]([https://your-live-demo-url](https://voidfront.netlify.app/))

## 🧠 How It Works

### Toroidal World

The world is **not actually infinite** - it's a looping toroidal space. Think of it like the surface of a donut:

- Left edge → connects to the right edge
- Top edge → connects to the bottom edge

When any object crosses a boundary, it wraps around to the opposite side. This creates the illusion of endless space while keeping the simulation simple and efficient.

### Minimap

The minimap renders a scaled-down version of the world, showing all active ships as dots. This lets you track movement happening off-screen and anticipate ships before they enter view.

## 🛠️ Shape Editor

A lightweight built-in tool for designing custom ship and object shapes:

- Draw vertices on a snapping grid for consistency
- Export shapes as **normalized vertex arrays** (`-1.0` to `1.0` range)
- Paste directly into game object definitions - no extra tooling needed

> ⚠️ The editor is intentionally rough - it was built to scratch an itch, not to ship. It works well enough for its purpose.


## 🗺️ Roadmap

This project is the foundation for something bigger. Here's what's planned:

- [ ] Player-controlled ship
- [ ] Combat system
- [ ] Collectibles and power-ups
- [ ] Multiplayer (WebSockets)
- [ ] Full game loop → evolving into **Rocket Raiders**



## 🎥 Canvas 2D Tutorial Series

This project was built as part of a larger effort to teach **Canvas 2D programming from the ground up**. If you want to learn how to build things like this yourself, check out the full YouTube series:

📺 [**Canvas 2D - Full Tutorial Series**](https://youtube.com/playlist?list=PLeyWCaA5QkkT4xh0k7fTQED4pIl2SHpE_&si=c3CPPNYt8pTjUNEi)

New episodes drop regularly. Like and subscribe to stay updated 🔔


## 🔗 Related Projects

- [**Rocket Raiders**](https://github.com/GoldenThrust/Rocket-Raiders) - the older space shooter this project is spiritually connected to


<p align="center">Built with ❤️ and HTML Canvas 2D</p>
