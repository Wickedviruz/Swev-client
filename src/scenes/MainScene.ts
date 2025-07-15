import Phaser from 'phaser';
import { TILE_SIZE, GRID_WIDTH, GRID_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT } from './../constants';
import { Player } from '../objects/Player';
import { OtherPlayer } from '../objects/OtherPlayer';
import { BubbleTextManager } from '../managers/BubbleTextManager';
import { AssetManager } from '../managers/AssetManager'; // VIKTIGT: Importera din nya AssetManager
import { assetRegistry } from '../assetRegistry'; // Importera assetRegistry direkt

type PlayerData = {
    id: number;
    name: string;
    x: number;
    y: number;
    lookbody: number;
    lookfeet: number;
    lookhead: number;
    looklegs: number;
    looktype: number;
    direction: number;
    level?: number;
    health?: number;
    mana?: number;
};

export class MainScene extends Phaser.Scene {
    private socket: any;
    private characterId: number;
    private characterName: string;
    
    private currentPlayer: Player | null = null;
    private otherPlayers: Record<number, OtherPlayer> = {};
    private playerGroup: Phaser.Physics.Arcade.Group | null = null;

    private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
    private lastMoveTime: number = 0;
    private socketListenersSetup: boolean = false;

    private bubbleTextManager: BubbleTextManager;

    constructor(socket: any, characterId: number, characterName: string) {
        super({ key: 'MainScene' });
        this.socket = socket;
        this.characterId = characterId;
        this.characterName = characterName;
        this.bubbleTextManager = new BubbleTextManager(this);
    }

    preload() {
        console.log('[MainScene] Preloading assets...');
        
        this.load.on('loaderror', (file: any) => {
            console.error('[MainScene] Failed to load asset:', file.key, file.url);
        });
        this.load.on('complete', () => {
            console.log('[MainScene] All assets loaded successfully');
        });

        this.load.image("ground", "/assets/ground.png");

        const atlasesToLoad = AssetManager.getUniqueAtlasKeys();
        atlasesToLoad.forEach(atlasKey => {
            this.load.atlas(atlasKey, `./assets/${atlasKey}.png`, `./assets/${atlasKey}.json`);
        });
    }

    create() {
        console.log('[MainScene] Creating scene...');
        
        for (let x = 0; x < GRID_WIDTH; x++) {
            for (let y = 0; y < GRID_HEIGHT; y++) {
                this.add.image(x * TILE_SIZE, y * TILE_SIZE, "ground").setOrigin(0);
            }
        }

        this.playerGroup = this.physics.add.group();

        // Initiera animationerna globalt i scenen
        AssetManager.createAllAnimations(this.anims);

        this.setupSocketListeners();

        if (this.input && this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
        }
        
        console.log('[MainScene] Scene created, waiting for currentPlayers event...');
    }

    private setupSocketListeners() {
        if (this.socketListenersSetup) {
            console.log('[MainScene] Socket listeners already set up, skipping');
            return;
        }

        console.log('[MainScene] Setting up socket listeners...');
        
        this.socket.removeAllListeners("currentPlayers");
        this.socket.removeAllListeners("playerJoined");
        this.socket.removeAllListeners("playerMoved");
        this.socket.removeAllListeners("playerLeft");
        this.socket.removeAllListeners("chat");

        this.socket.on("currentPlayers", (players: PlayerData[]) => {
            console.log('[MainScene] ✅ Received currentPlayers:', players);
            
            if (this.currentPlayer) { this.currentPlayer.destroy(); this.currentPlayer = null; }
            Object.values(this.otherPlayers).forEach(op => op.destroy());
            this.otherPlayers = {};
            this.bubbleTextManager.clearAllBubbles();
            
            if (this.playerGroup) {
                this.playerGroup.clear(true, true);
            } else {
                this.playerGroup = this.physics.add.group();
            }

            players.forEach((p) => {
                const look = AssetManager.getCharacterLook(p.looktype);
                // Använd 'players' som fallback för atlasKey om looktype inte hittas
                const atlasKey = look ? look.atlas : 'players'; 

                if (p.id === this.characterId) {
                    // Skicka med looktype och direction
                    this.currentPlayer = new Player(this, p.x, p.y, atlasKey, p.name, p.looktype, p.direction);
                    this.playerGroup?.add(this.currentPlayer.sprite);
                    this.cameras.main.startFollow(this.currentPlayer.sprite, true, 0.08, 0.08);

                    const initialAnimationKey = AssetManager.getAnimationKey(p.looktype, p.direction, 'idle');
                    this.currentPlayer.sprite.play(initialAnimationKey);
                } else {
                    // Skicka med looktype och direction till OtherPlayer också
                    const otherPlayer = new OtherPlayer(this, p.x, p.y, atlasKey, p.name, p.id, p.looktype, p.direction);
                    this.otherPlayers[p.id] = otherPlayer;
                    this.playerGroup?.add(otherPlayer.sprite);

                    const initialAnimationKey = AssetManager.getAnimationKey(p.looktype, p.direction, 'idle');
                    otherPlayer.sprite.play(initialAnimationKey);
                }
            });
            this.physics.add.collider(this.playerGroup, this.playerGroup);
            console.log('[MainScene] Scene setup complete. Main player exists:', !!this.currentPlayer);
        });

        this.socket.on("playerJoined", (p: PlayerData) => {
            console.log('[MainScene] ✅ Player joined:', p);
            if (p.id !== this.characterId && !this.otherPlayers[p.id]) {
                const look = AssetManager.getCharacterLook(p.looktype);
                const atlasKey = look ? look.atlas : 'players'; // Använd 'players' som fallback

                // Skicka med looktype och direction
                const otherPlayer = new OtherPlayer(this, p.x, p.y, atlasKey, p.name, p.id, p.looktype, p.direction);
                this.otherPlayers[p.id] = otherPlayer;
                this.playerGroup?.add(otherPlayer.sprite);

                const initialAnimationKey = AssetManager.getAnimationKey(p.looktype, p.direction, 'idle');
                otherPlayer.sprite.play(initialAnimationKey);
            }
        });

        this.socket.on("playerMoved", (data: { id: number; x: number; y: number; direction: number; looktype: number }) => {
            if (data.id === this.characterId) return;
            const op = this.otherPlayers[data.id];
            if (!op) return;
            op.updatePosition(data.x, data.y);
            
            // NYTT: Hämta animationKey baserat på looktype och direction
            const animationKey = AssetManager.getAnimationKey(data.looktype, data.direction, 'walk');
            op.playAnimation(animationKey, true);
        });

        this.socket.on("playerLeft", ({ id }: { id: number }) => {
            console.log('[MainScene] ✅ Player left:', id);
            if (this.otherPlayers[id]) {
                this.otherPlayers[id].destroy();
                delete this.otherPlayers[id];
            }
            this.bubbleTextManager.removeBubble(id);
        });

        this.socket.on("chat", ({ id, text }: { id: number; text: string }) => {
            console.log('[MainScene] ✅ Chat received:', { id, text });
            this.bubbleTextManager.addBubble(id, text);
        });

        this.socket.on("test", (data: any) => {
            console.log('[MainScene] ✅ Test event received:', data);
        });

        this.socketListenersSetup = true;
        console.log('[MainScene] ✅ All socket listeners set up');

        this.socket.emit("requestCurrentPlayers");
    }

    update(time: number, delta: number) {
        if (!this.currentPlayer || !this.cursors) return;
        
        const speed = 160;
        let vx = 0, vy = 0;
        let direction = this.currentPlayer.direction;

        if (this.cursors.left.isDown) {
            vx = -speed;
            direction = 0;
        } else if (this.cursors.right.isDown) {
            vx = speed;
            direction = 3;
        } else if (this.cursors.up.isDown) {
            vy = -speed;
            direction = 1;
        } else if (this.cursors.down.isDown) {
            vy = speed;
            direction = 2;
        }

        this.currentPlayer.setVelocity(vx, vy);

        const action = (vx === 0 && vy === 0) ? 'idle' : 'walk';
        const animationKey = AssetManager.getAnimationKey(this.currentPlayer.looktype, direction, action);
        
        this.currentPlayer.direction = direction;
        
        this.currentPlayer.playAnimation(animationKey, true);

        this.currentPlayer.updateNameTextPosition();
        this.bubbleTextManager.updateBubbles(time);

        const now = Date.now();
        if (now - this.lastMoveTime > 10) {
            this.socket.emit("move", { 
                x: this.currentPlayer.sprite.x, 
                y: this.currentPlayer.sprite.y, 
                looktype: this.currentPlayer.looktype, 
                direction: direction
            });
            this.lastMoveTime = now;
        }

        this.bubbleTextManager.updateBubbles(now);
    }
}