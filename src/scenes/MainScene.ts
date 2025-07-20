// src/scenes/MainScene.ts
import Phaser from 'phaser';
import { TILE_SIZE, GRID_WIDTH, GRID_HEIGHT} from './../constants';
import { Player } from '../objects/Player';
import { OtherPlayer } from '../objects/OtherPlayer';
import { BubbleTextManager } from '../managers/BubbleTextManager';
import { AssetManager } from '../managers/AssetManager'; 
import type { Character } from '../types'; // Importera Character typen

type PlayerData = {
    id: number;
    name: string;
    x: number;
    y: number;
    z: number;
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
    private mainCharacterData: Character; 
    
    private currentPlayer: Player | null = null;
    private otherPlayers: Record<number, OtherPlayer> = {};
    private playerGroup: Phaser.Physics.Arcade.Group | null = null;

    private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
    private lastMoveTime: number = 0;
    private isChatInputFocused: boolean = false; 

    private bubbleTextManager: BubbleTextManager;

    // Uppdatera konstruktorn för att ta emot mainCharacterData
    constructor(socket: any, characterId: number, characterName: string, mainCharacterData: Character) {
        super({ key: 'MainScene' });
        this.socket = socket;
        this.characterId = characterId;
        this.characterName = characterName;
        this.mainCharacterData = mainCharacterData; 
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
            this.load.atlas(atlasKey, `/assets/${atlasKey}.png`, `/assets/${atlasKey}.json`);
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

        // Flytta skapandet av huvudspelaren hit, efter att alla animationer skapats
        this.createMainPlayer(this.mainCharacterData);

        this.setupSocketListeners(); 

        if (this.input && this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
        }
        
        console.log('[MainScene] Scene created and main player attempted to be created.');
    }

    // NY FUNKTION: Skapa huvudspelaren direkt med den mottagna datan
    private createMainPlayer(p: Character) {
        console.log(`[MainScene] Creating currentPlayer for ID ${p.id} with looktype ${p.looktype} and atlasKey ${AssetManager.getCharacterLook(p.looktype)?.atlas || 'players'}`);
        const look = AssetManager.getCharacterLook(p.looktype);
        const atlasKey = look ? look.atlas : 'players'; 

        this.currentPlayer = new Player(this, p.pos_x, p.pos_y, atlasKey, p.name, p.looktype, p.direction);
        this.playerGroup?.add(this.currentPlayer.sprite);
        this.cameras.main.startFollow(this.currentPlayer.sprite, true, 0.08, 0.08);

        const initialAnimationKey = AssetManager.getAnimationKey(p.looktype, p.direction, 'idle');
        console.log(`[MainScene] Playing initial animation: ${initialAnimationKey} on currentPlayer`);
        this.currentPlayer.sprite.play(initialAnimationKey);

        console.log('[MainScene] Main player created and camera following.');
    }

    // Funktion för att skapa andra spelares sprites
    private createOtherPlayerSprite(p: PlayerData) {
        if (this.otherPlayers[p.id]) {
            console.warn(`[MainScene] Attempted to create player ${p.id} but they already exist.`);
            return;
        }
        console.log(`[MainScene] Creating other player sprite for ID ${p.id} at (${p.x}, ${p.y}) with looktype ${p.looktype}`);
        const look = AssetManager.getCharacterLook(p.looktype);
        const atlasKey = look ? look.atlas : 'players'; 

        const otherPlayer = new OtherPlayer(this, p.x, p.y, atlasKey, p.name, p.id, p.looktype, p.direction);
        this.otherPlayers[p.id] = otherPlayer;
        this.playerGroup?.add(otherPlayer.sprite);

        const initialAnimationKey = AssetManager.getAnimationKey(p.looktype, p.direction, 'idle');
        otherPlayer.sprite.play(initialAnimationKey);
    }

    // Lägg till denna metod för att hantera chat input focus från GameCanvas
    public setChatInputFocus(isFocused: boolean) {
        this.isChatInputFocused = isFocused;
        if (this.input && this.input.keyboard) {
            this.input.keyboard.enabled = !isFocused;
            console.log(`[MainScene] Keyboard input ${isFocused ? 'disabled' : 'enabled'} for game.`);
        }
    }


    private setupSocketListeners() {
        console.log('[MainScene] Setting up socket listeners...');
        
        // Ta bort ALLA gamla lyssnare för att förhindra dubbla triggers vid re-initialisering
        this.socket.removeAllListeners("currentPlayers");
        this.socket.removeAllListeners("playerJoined");
        this.socket.removeAllListeners("playerMoved");
        this.socket.removeAllListeners("playerLeft");
        this.socket.removeAllListeners("chat");
        this.socket.removeAllListeners("test"); // Om du har en test-listener

        this.socket.on("currentPlayers", (players: PlayerData[]) => {
            console.log('[MainScene] ✅ Received currentPlayers:', players);
            
            // Rensa alla andra spelare, men behåll currentPlayer (om den finns)
            Object.values(this.otherPlayers).forEach(op => op.destroy());
            this.otherPlayers = {};
            this.bubbleTextManager.clearAllBubbles();
            
            // Iterera över inkomna spelare.
            players.forEach((p) => {
                if (p.id !== this.characterId) { 
                    this.createOtherPlayerSprite(p);
                } else {
                    // Om det är din egen spelare och av någon anledning inte skapades, skapa den nu.
                    // Detta bör sällan hända med den nya villkorliga renderingen, men är en bra fallback.
                    if (!this.currentPlayer) {
                        console.warn("[MainScene] currentPlayers event received my own data, but currentPlayer was null. Creating now as fallback.");
                        this.createMainPlayer(p as Character); // Type-cast p till Character
                    } else {
                        // Uppdatera befintlig currentPlayer om det behövs (t.ex. vid re-sync från server)
                        this.currentPlayer.updatePosition(p.x, p.y, p.z);
                        this.currentPlayer.direction = p.direction;
                        const animationKey = AssetManager.getAnimationKey(p.looktype, p.direction, 'idle');
                        this.currentPlayer.playAnimation(animationKey);
                    }
                }
            });
            // Kolla att playerGroup finns innan collider läggs till
            if (this.playerGroup) {
                this.physics.add.collider(this.playerGroup, this.playerGroup);
            } else {
                console.warn("[MainScene] playerGroup is null when trying to add collider.");
            }
            console.log('[MainScene] All players processed. Main player exists:', !!this.currentPlayer);
        });

        this.socket.on("playerJoined", (p: PlayerData) => {
            console.log('[MainScene] ✅ Player joined:', p);
            if (p.id !== this.characterId) { 
                this.createOtherPlayerSprite(p);
            }
        });

        this.socket.on("playerMoved", (data: { id: number; x: number; y: number; direction: number; looktype: number }) => {
            if (data.id === this.characterId) {
                if (this.currentPlayer) {
                    this.currentPlayer.updatePosition(data.x, data.y);
                    this.currentPlayer.direction = data.direction;
                    const animationKey = AssetManager.getAnimationKey(data.looktype, data.direction, 'walk');
                    this.currentPlayer.playAnimation(animationKey);
                }
                return;
            }
            
            const op = this.otherPlayers[data.id];
            if (!op) return;
            op.updatePosition(data.x, data.y);
            
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
            const targetSprite = (id === this.characterId && this.currentPlayer) ? this.currentPlayer.sprite : (this.otherPlayers[id] ? this.otherPlayers[id].sprite : null);
            if (targetSprite) {
                this.bubbleTextManager.addBubble(id, text, targetSprite);
            } else {
                console.warn(`[MainScene] Could not find sprite for player ID ${id} to attach chat bubble.`);
            }
        });

        this.socket.on("test", (data: unknown) => {
            console.log('[MainScene] ✅ Test event received:', data);
        });

        console.log('[MainScene] ✅ All socket listeners set up');
    }

    update(time: number) {
        if (this.isChatInputFocused) {
            if (this.currentPlayer && this.currentPlayer.sprite.body) {
                this.currentPlayer.setVelocity(0, 0); 
                const currentAnimKey = this.currentPlayer.sprite.anims.currentAnim?.key;
                const expectedIdleAnim = AssetManager.getAnimationKey(this.currentPlayer.looktype, this.currentPlayer.direction, 'idle');
                 if (currentAnimKey !== expectedIdleAnim) {
                    this.currentPlayer.playAnimation(expectedIdleAnim);
                }
            }
            return;
        }

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
        
        if (this.currentPlayer.direction !== direction) {
            this.currentPlayer.direction = direction;
        }
        
        this.currentPlayer.playAnimation(animationKey, true);

        this.currentPlayer.updateNameTextPosition();
        this.bubbleTextManager.updateBubbles(time);

        const now = Date.now();
        const prevX = this.currentPlayer.sprite.body?.x; 
        const prevY = this.currentPlayer.sprite.body?.y;

        // Bättre kontroll för att skicka "move" event
        // Skicka om vi rör oss, eller om 100ms har passerat (för att synkronisera idle)
        // Lägg till en check för om positionen faktiskt har ändrats för att undvika onödiga emits under idle.
        if (vx !== 0 || vy !== 0 || (now - this.lastMoveTime > 100)) { 
            const currentX = this.currentPlayer.sprite.x;
            const currentY = this.currentPlayer.sprite.y;

            // Skicka endast om position eller riktning har ändrats, eller om det är en periodisk "idle" uppdatering
            if (currentX !== prevX || currentY !== prevY || this.currentPlayer.direction !== direction || (vx === 0 && vy === 0 && now - this.lastMoveTime > 500)) { // 500ms för idle-uppdatering
                 this.socket.emit("move", { 
                    x: this.currentPlayer.sprite.x, 
                    y: this.currentPlayer.sprite.y, 
                    looktype: this.currentPlayer.looktype, 
                    direction: direction
                });
                this.lastMoveTime = now;
            }
        }
    }
}