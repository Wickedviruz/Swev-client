import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { io, Socket } from "socket.io-client";

type GameCanvasProps = {
  characterId: number;
};

const SOCKET_URL = "http://localhost:7172";

const GameCanvas = ({ characterId }: GameCanvasProps) => {
  const phaserRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, { auth: { characterId } });
    socketRef.current = socket;

    // Håll koll på andra spelare
    const otherPlayers: { [id: number]: Phaser.Physics.Arcade.Sprite } = {};

    class MainScene extends Phaser.Scene {
      cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
      player!: Phaser.Physics.Arcade.Sprite;
      myId!: number;

      preload() {
        this.load.image("player", "https://cdn.jsdelivr.net/gh/photonstorm/phaser@v3.55.2/public/assets/sprites/phaser-dude.png");
        this.load.image("other", "https://cdn.jsdelivr.net/gh/photonstorm/phaser@v3.55.2/public/assets/sprites/mushroom2.png");
        this.load.image("ground", "https://cdn.jsdelivr.net/gh/photonstorm/phaser@v3.55.2/public/assets/sprites/block.png");
      }

      create() {
        // Bygg din egen spelare
        this.player = this.physics.add.sprite(100, 100, "player");
        this.player.setCollideWorldBounds(true);

        // Hantera ALLA andra players från servern
        socket.on("currentPlayers", (players) => {
          players.forEach((p: any) => {
            if (p.id !== characterId && !otherPlayers[p.id]) {
              otherPlayers[p.id] = this.add.sprite(p.x, p.y, "other");
            }
          });
        });

        socket.on("playerJoined", (p) => {
          if (p.id !== characterId && !otherPlayers[p.id]) {
            otherPlayers[p.id] = this.add.sprite(p.x, p.y, "other");
          }
        });

        socket.on("playerMoved", (data) => {
          if (data.id === characterId) return; // ignorera dig själv
          if (!otherPlayers[data.id]) {
            // skapa sprite om den saknas
            otherPlayers[data.id] = this.add.sprite(data.x, data.y, "other");
          }
          otherPlayers[data.id].x = data.x;
          otherPlayers[data.id].y = data.y;
        });

        socket.on("playerLeft", ({ id }) => {
          if (otherPlayers[id]) {
            otherPlayers[id].destroy();
            delete otherPlayers[id];
          }
        });

        this.cursors = this.input.keyboard.createCursorKeys();
      }

      update() {
        if (!this.player || !this.cursors) return;
        const speed = 160;
        let vx = 0, vy = 0;
        if (this.cursors.left.isDown) vx = -speed;
        if (this.cursors.right.isDown) vx = speed;
        if (this.cursors.up.isDown) vy = -speed;
        if (this.cursors.down.isDown) vy = speed;
        this.player.setVelocity(vx, vy);

        // Skicka min position till servern
        socket.emit("move", { x: this.player.x, y: this.player.y });
      }
    }

    // === DITTA SKA VARA UTANFÖR KLASSEN! ===
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 640,
      height: 480,
      physics: { default: "arcade", arcade: { debug: false } },
      scene: MainScene,
      parent: phaserRef.current!,
      backgroundColor: "#23272f",
    };

    const game = new Phaser.Game(config);

    return () => {
      socket.disconnect();
      game.destroy(true);
    };
  }, [characterId]);

  return <div ref={phaserRef} style={{ width: 640, height: 480 }} />;
};

export default GameCanvas;
