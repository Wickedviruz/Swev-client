# Swev-client

Swev-client is the official game client for **SwevGame** – a modern 2D multiplayer online RPG inspired by classic MMORPGs, built with React, Phaser, and Tauri for desktop-native performance.

It is designed to work seamlessly with [Swev-server](https://github.com/Wickedviruz/Swev-server), providing a fast, responsive, and moddable game experience.

---

## Features

- **React + Phaser** hybrid architecture for flexible UI and high-performance 2D game rendering
- **Tauri** integration for lightweight, secure, native desktop builds
- **Real-time multiplayer** via WebSocket connection to Swev-server
- **Modular and scalable** code structure, inspired by classic game clients but rewritten for modern JS/TS
- **Built-in state management** (Redux or Context API)
- **Cross-platform:** Windows, Linux, macOS

---

## Project Structure

```plaintext
src/
  components/      # React UI components (menus, HUD, dialogs)
  game/            # Phaser game logic, scenes, and assets
  hooks/           # Custom React hooks
  services/        # API and WebSocket client logic
  assets/          # Sprites, maps, sounds, and media
  main.tsx         # App entry point
```

## Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- npm or yarn
- (For building desktop app: Tauri dependencies – see [Tauri setup](https://tauri.app/v1/guides/getting-started/prerequisites))

### Installation

```bash
git clone https://github.com/Wickedviruz/Swev-client.git
cd Swev-client
npm install
```

### Running in Development Mode (Web)

```bash
npm start
```

Open http://localhost:5173 in your browser.

### Building Desktop App (Tauri)

```bash
npm run tauri dev
```

See [Tauri documentation](https://tauri.app/v1/guides/) for OS-specific requirements.

### Connecting to the Server

Swev-client connects to Swev-server via WebSocket.

Default configuration points to `localhost:8080`, but you can change this in the config file or environment variables.

## Roadmap

- [ ] Phaser + React integration
- [ ] WebSocket multiplayer connection
- [ ] Map rendering and player movement
- [ ] Basic combat and UI
- [ ] Desktop builds (Tauri)
- [ ] Inventory, chat, and more

## Contributing

Pull requests and suggestions are welcome! Please open an issue first for major changes.

## Credits

Inspired by classic MMORPG clients and modern open source projects.

## License

MIT (see LICENSE file)