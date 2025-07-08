import { useEffect, useRef, useState } from "react";
import Phaser from "phaser";

type GameCanvasProps = {
  characterId: number;
  characterName: string;
  socket: any;
};

const TILE_SIZE = 64;
const GRID_WIDTH = 20;
const GRID_HEIGHT = 15;
const CANVAS_WIDTH = TILE_SIZE * GRID_WIDTH;
const CANVAS_HEIGHT = TILE_SIZE * GRID_HEIGHT;

// Helper för radbrytning
function splitLines(text: string, maxLen = 28): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    if ((line + word).length > maxLen) {
      if (line.length) lines.push(line);
      line = word;
    } else {
      line = line.length ? `${line} ${word}` : word;
    }
  }
  if (line.length) lines.push(line);
  return lines;
}

const GameCanvas = ({ characterId, characterName, socket }: GameCanvasProps) => {
  const phaserRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const gameRef = useRef<Phaser.Game | null>(null);
  const initializationRef = useRef<boolean>(false);

  // Ref till chatbubblor per spelare
  const bubbleTextsRef = useRef<{ [id: number]: { text: string; ts: number } }>({});

  useEffect(() => {
    function updateScale() {
      const scaleW = window.innerWidth / CANVAS_WIDTH;
      const scaleH = window.innerHeight / CANVAS_HEIGHT;
      setScale(Math.min(scaleW, scaleH, 1));
    }
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  useEffect(() => {
    // Prevent multiple initializations
    if (initializationRef.current) {
      console.log('[GameCanvas] Skipping duplicate initialization');
      return;
    }

    // Förhindra att flera spel skapas
    if (gameRef.current) {
      console.log('[GameCanvas] Destroying existing game instance');
      gameRef.current.destroy(true);
      gameRef.current = null;
    }

    if (!socket) {
      console.log('[GameCanvas] No socket provided, skipping initialization');
      return;
    }

    console.log('[GameCanvas] Starting with characterId:', characterId, 'characterName:', characterName);
    console.log('[GameCanvas] Socket state:', socket.connected, socket.id);

    // Mark as initializing
    initializationRef.current = true;

    const otherPlayers: Record<number, {
      sprite: Phaser.Physics.Arcade.Sprite;
      nameText: Phaser.GameObjects.Text;
    }> = {};

    let sceneBubbleTexts: { [id: string]: Phaser.GameObjects.Text } = {};

    class MainScene extends Phaser.Scene {
      cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
      player: Phaser.Physics.Arcade.Sprite | null = null;
      playerName: Phaser.GameObjects.Text | null = null;
      playerGroup: Phaser.Physics.Arcade.Group | null = null;
      lastMoveTime: number = 0;
      socketListenersSetup: boolean = false;

      preload() {
        console.log('[GameCanvas] Preloading assets...');
        
        // Lägg till error handling för assets
        this.load.on('loaderror', (file: any) => {
          console.error('[GameCanvas] Failed to load asset:', file.key, file.url);
        });
        
        this.load.on('complete', () => {
          console.log('[GameCanvas] All assets loaded successfully');
        });

        this.load.image("player", "/assets/Char.png");
        this.load.image("other", "/assets/stone.png");
        this.load.image("ground", "/assets/ground.png");
      }

      create() {
        console.log('[GameCanvas] Creating scene...');
        
        // Skapa bakgrund
        for (let x = 0; x < GRID_WIDTH; x++) {
          for (let y = 0; y < GRID_HEIGHT; y++) {
            this.add.image(x * TILE_SIZE, y * TILE_SIZE, "ground").setOrigin(0);
          }
        }

        this.playerGroup = this.physics.add.group();

        // Setup socket listeners only once
        this.setupSocketListeners();

        if (this.input && this.input.keyboard) {
          this.cursors = this.input.keyboard.createCursorKeys();
        }
        
        console.log('[GameCanvas] Scene created, waiting for currentPlayers event...');
      }

      setupSocketListeners() {
        if (this.socketListenersSetup) {
          console.log('[GameCanvas] Socket listeners already set up, skipping');
          return;
        }

        console.log('[GameCanvas] Setting up socket listeners...');
        
        // Rensa alla lyssnare INNAN vi lägger till nya
        socket.removeAllListeners("currentPlayers");
        socket.removeAllListeners("playerJoined");
        socket.removeAllListeners("playerMoved");
        socket.removeAllListeners("playerLeft");
        socket.removeAllListeners("chat");

        socket.on("currentPlayers", (players: any[]) => {
          console.log('[GameCanvas] ✅ Received currentPlayers:', players);
          console.log('[GameCanvas] Looking for characterId:', characterId);
          
          // Rensa tidigare spelare
          if (this.player) { 
            console.log('[GameCanvas] Destroying existing player');
            this.player.destroy(); 
            this.player = null; 
          }
          if (this.playerName) { 
            this.playerName.destroy(); 
            this.playerName = null; 
          }
          if (this.playerGroup) { 
            this.playerGroup.clear(true, true); 
            this.playerGroup = null; 
          }
          
          Object.values(otherPlayers).forEach(({ sprite, nameText }) => {
            sprite.destroy();
            nameText.destroy();
          });
          Object.keys(otherPlayers).forEach((id) => delete otherPlayers[+id]);
          
          Object.values(sceneBubbleTexts).forEach(bubble => bubble.destroy());
          sceneBubbleTexts = {};

          this.playerGroup = this.physics.add.group();

          // Gå igenom alla spelare
          players.forEach((p) => {
            console.log('[GameCanvas] Processing player:', p.id, p.name, 'at position:', p.x, p.y);
            
            if (p.id === characterId) {
              console.log('[GameCanvas] Creating main player sprite');
              
              // Skapa huvudspelaren
              this.player = this.physics.add.sprite(p.x || 400, p.y || 300, "player");
              this.player.setCollideWorldBounds(true);
              this.playerGroup.add(this.player);
              
              // Sätt upp kamera
              this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
              
              // Skapa namn
              this.playerName = this.add.text(
                this.player.x, 
                this.player.y - 40, 
                p.name || characterName || "Player",
                {
                  fontSize: "16px",
                  color: "#fff",
                  backgroundColor: "#0008",
                  padding: { x: 4, y: 2 }
                }
              ).setOrigin(0.5, 1);
              
              console.log('[GameCanvas] Main player created at:', this.player.x, this.player.y);
              
            } else {
              console.log('[GameCanvas] Creating other player sprite');
              
              // Skapa andra spelare
              const sprite = this.physics.add.sprite(p.x || 400, p.y || 300, "other");
              const nameText = this.add.text(
                p.x || 400, 
                (p.y || 300) - 40, 
                p.name || "Player", 
                {
                  fontSize: "16px",
                  color: "#fff",
                  backgroundColor: "#0008",
                  padding: { x: 4, y: 2 }
                }
              ).setOrigin(0.5, 1);
              
              otherPlayers[p.id] = { sprite, nameText };
              this.playerGroup.add(sprite);
              
              console.log('[GameCanvas] Other player created at:', sprite.x, sprite.y);
            }
          });

          // Sätt upp kollisioner
          this.physics.add.collider(this.playerGroup, this.playerGroup);
          
          console.log('[GameCanvas] Scene setup complete. Main player exists:', !!this.player);
        });

        socket.on("playerJoined", (p: any) => {
          console.log('[GameCanvas] ✅ Player joined:', p);
          if (p.id !== characterId && !otherPlayers[p.id]) {
            const sprite = this.physics.add.sprite(p.x || 400, p.y || 300, "other");
            const nameText = this.add.text(
              p.x || 400, 
              (p.y || 300) - 40, 
              p.name || "Player", 
              {
                fontSize: "16px",
                color: "#fff",
                backgroundColor: "#0008",
                padding: { x: 4, y: 2 }
              }
            ).setOrigin(0.5, 1);
            otherPlayers[p.id] = { sprite, nameText };
            this.playerGroup?.add(sprite);
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
          console.log('[GameCanvas] ✅ Player left:', id);
          if (otherPlayers[id]) {
            this.playerGroup?.remove(otherPlayers[id].sprite, true, true);
            otherPlayers[id].nameText.destroy();
            delete otherPlayers[id];
          }
          if (sceneBubbleTexts[id]) {
            sceneBubbleTexts[id].destroy();
            delete sceneBubbleTexts[id];
            delete bubbleTextsRef.current[+id];
          }
        });

        socket.on("chat", ({ id, text }: any) => {
          console.log('[GameCanvas] ✅ Chat received:', { id, text });
          bubbleTextsRef.current = {
            ...bubbleTextsRef.current,
            [id]: { text, ts: Date.now() }
          };
        });

        // Add test listener to verify socket is working
        socket.on("test", (data: any) => {
          console.log('[GameCanvas] ✅ Test event received:', data);
        });

        this.socketListenersSetup = true;
        console.log('[GameCanvas] ✅ All socket listeners set up');

        socket.emit("requestCurrentPlayers");
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

        // Begränsa move-meddelanden för att undvika överbelastning
        const now = Date.now();
        if (now - this.lastMoveTime > 50) { // Max 20 FPS för move events
          socket.emit("move", { x: this.player.x, y: this.player.y });
          this.lastMoveTime = now;
        }

        // ---- CHAT BUBBLES ----
        Object.entries(bubbleTextsRef.current).forEach(([id, { text, ts }]) => {
          if (now - ts > 15000) {
            if (sceneBubbleTexts[id]) {
              sceneBubbleTexts[id].destroy();
              delete sceneBubbleTexts[id];
            }
            delete bubbleTextsRef.current[+id];
            return;
          }
          
          let sprite = null;
          if (this.player && String(characterId) === id) sprite = this.player;
          else if (otherPlayers[+id]) sprite = otherPlayers[+id].sprite;
          if (!sprite) return;
          
          const lines = splitLines(text);
          if (!sceneBubbleTexts[id]) {
            const txt = this.add.text(sprite.x, sprite.y - 90, lines, {
              fontSize: "16px",
              color: "#ffeab6",
              backgroundColor: "#000a",
              padding: { x: 8, y: 4 },
              align: "center",
              wordWrap: { width: 240, useAdvancedWrap: true }
            }).setOrigin(0.5, 1);
            sceneBubbleTexts[id] = txt;
          } else {
            sceneBubbleTexts[id].setText(lines);
          }
          sceneBubbleTexts[id].setPosition(sprite.x, sprite.y - 80 - (lines.length - 1) * 16);
        });
      }
    }

    // Wait for socket to be connected before initializing game
    const initializeGame = () => {
      if (!socket.connected) {
        console.log('[GameCanvas] Socket not connected yet, waiting...');
        setTimeout(initializeGame, 100);
        return;
      }

      console.log('[GameCanvas] Socket connected, initializing game...');

      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        physics: { default: "arcade", arcade: { debug: false } },
        scene: MainScene,
        parent: phaserRef.current!,
        backgroundColor: "#23272f"
      };

      gameRef.current = new Phaser.Game(config);
    };

    // Start initialization
    initializeGame();

    return () => {
      console.log('[GameCanvas] Cleaning up GameCanvas');
      initializationRef.current = false;
      
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [characterId, characterName, socket?.id]); // Use socket.id to detect socket changes

  // Separate useEffect to handle socket connection events
  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      console.log('[GameCanvas] Socket connected event received');
    };

    const handleDisconnect = (reason: string) => {
      console.log('[GameCanvas] Socket disconnected event received:', reason);
    };

    const handleConnectError = (error: any) => {
      console.error('[GameCanvas] Socket connection error:', error);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
    };
  }, [socket]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#151518",
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      <div
        ref={phaserRef}
        style={{
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          boxShadow: "0 0 36px #000d",
          background: "#23272f"
        }}
      />
    </div>
  );
};

export default GameCanvas;