import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { io, Socket } from "socket.io-client";

type GameCanvasProps = {
  characterId: number;
  characterName: string;
};

const SOCKET_URL = "http://localhost:7172";

const GameCanvas = ({ characterId, characterName }: GameCanvasProps) => {
  const phaserRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, { auth: { characterId } });
    socketRef.current = socket;

    const handleUnload = () => {
      socket.disconnect();
    };
    window.addEventListener("beforeunload", handleUnload);

    // Spara andra spelares sprites
    const otherPlayers: Record<number, {
      sprite: Phaser.Physics.Arcade.Sprite;
      nameText: Phaser.GameObjects.Text;
    }> = {};

    class MainScene extends Phaser.Scene {
      cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
      player: Phaser.Physics.Arcade.Sprite | null = null;
      playerName: Phaser.GameObjects.Text | null = null;
      playerGroup: Phaser.Physics.Arcade.Group | null = null;

        createPlayer(x: number, y: number, name: string) {
          if (!this.playerGroup) return; // skydd mot null
          this.player = this.physics.add.sprite(x, y, "player");
          this.player.setCollideWorldBounds(true);
          this.playerGroup.add(this.player);

          this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

          this.playerName = this.add.text(
            this.player.x, this.player.y - 40, name,
            {
              fontSize: "16px",
              color: "#fff",
              backgroundColor: "#0008",
              padding: { x: 4, y: 2 }
            }
          ).setOrigin(0.5, 1);
        }

      preload() {
        this.load.image("player", "/assets/Char.png");
        this.load.image("other", "/assets/stone.png");
        this.load.image("ground", "/assets/ground.png");
      }

      create() {
        socket.removeAllListeners();
        for (let x = 0; x < 40; x++) {
          for (let y = 0; y < 22; y++) {
            this.add.image(x * 32, y * 32, "ground").setOrigin(0);
          }
        }

        this.playerGroup = this.physics.add.group();

        // Hantera ALLA events EN gång per scen
        socket.on("currentPlayers", (players) => {
        // Rensa ALLT gammalt
        if (this.player) { this.player.destroy(); this.player = null; }
        if (this.playerName) { this.playerName.destroy(); this.playerName = null; }
        if (this.playerGroup) { this.playerGroup.clear(true, true); this.playerGroup = null; }
        Object.values(otherPlayers).forEach(({ sprite, nameText }) => {
          sprite.destroy();
          nameText.destroy();
        });
        Object.keys(otherPlayers).forEach((id) => delete otherPlayers[+id]);

        // Skapa om ALLT
        this.playerGroup = this.physics.add.group();

        players.forEach((p) => {
          if (p.id === characterId) {
            this.player = this.physics.add.sprite(p.x, p.y, "player");
            this.player.setCollideWorldBounds(true);
            this.playerGroup.add(this.player);
            this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
            this.playerName = this.add.text(
              this.player.x, this.player.y - 40, p.name ?? characterName,
              {
                fontSize: "16px",
                color: "#fff",
                backgroundColor: "#0008",
                padding: { x: 4, y: 2 }
              }
            ).setOrigin(0.5, 1);
            console.log("Created my player at", p.x, p.y);
          } else {
            const sprite = this.physics.add.sprite(p.x, p.y, "other");
            const nameText = this.add.text(p.x, p.y - 40, p.name ?? "Player", {
              fontSize: "16px",
              color: "#fff",
              backgroundColor: "#0008",
              padding: { x: 4, y: 2 }
            }).setOrigin(0.5, 1);
            otherPlayers[p.id] = { sprite, nameText };
            this.playerGroup.add(sprite);
            console.log("Created OTHER player", p.id, "at", p.x, p.y);
          }
        });

        this.physics.add.collider(this.playerGroup, this.playerGroup);
      });
        socket.on("playerJoined", (p: any) => {
          if (p.id !== characterId && !otherPlayers[p.id]) {
            const sprite = this.physics.add.sprite(p.x, p.y, "other");
            const nameText = this.add.text(p.x, p.y - 40, p.name ?? "Player", {
              fontSize: "16px",
              color: "#fff",
              backgroundColor: "#0008",
              padding: { x: 4, y: 2 }
            }).setOrigin(0.5, 1);
            otherPlayers[p.id] = { sprite, nameText };
            this.playerGroup.add(sprite);
          }
        });

        socket.on("playerMoved", (data: any) => {
          if (data.id === characterId) return;
          const op = otherPlayers[data.id];
          if (!op) return;
          op.sprite.x = data.x;
          op.sprite.y = data.y;
          op.nameText.x = data.x;
          op.nameText.y = data.y - 40;
        });

        socket.on("playerLeft", ({ id }: any) => {
          if (otherPlayers[id]) {
            this.playerGroup.remove(otherPlayers[id].sprite, true, true);
            otherPlayers[id].nameText.destroy();
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

        if (this.player && this.playerName) {
          this.playerName.x = this.player.x;
          this.playerName.y = this.player.y - 40;
        }

        socket.emit("move", { x: this.player.x, y: this.player.y });
      }
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1280,
      height: 720,
      physics: { default: "arcade", arcade: { debug: false } },
      scene: MainScene,
      parent: phaserRef.current!,
      backgroundColor: "#23272f",
    };

    const game = new Phaser.Game(config);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      // TA BORT ALLA EVENTS!
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
      }
      game.destroy(true);
    };
  }, [characterId, characterName]);

  return <div ref={phaserRef} style={{ width: 1280, height: 720 }} />;
};

export default GameCanvas;
