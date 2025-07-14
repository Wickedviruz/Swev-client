import Phaser from 'phaser';
import { TILE_SIZE, GRID_WIDTH, GRID_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT } from './../constants'; // Skapa en constants.ts
import { Player } from '../objects/Player'; // Kommer att skapa denna fil
import { OtherPlayer } from '../objects/OtherPlayer'; // Kommer att skapa denna fil
import { BubbleTextManager } from '../managers/BubbleTextManager'; // Kommer att skapa denna fil
import { AnimationManager } from '../managers/AnimationManager'; // VIKTIGAST FÖR DINA SPRITES

type PlayerData = {
    id: number;
    name: string;
    x: number;
    y: number;
    // Lägg till fler egenskaper från servern, t.ex. 'currentAnimation'
};

export class MainScene extends Phaser.Scene {
    private socket: any;
    private characterId: number;
    private characterName: string;
    
    // Lokala referenser till spelobjekt
    private currentPlayer: Player | null = null;
    private otherPlayers: Record<number, OtherPlayer> = {};
    private playerGroup: Phaser.Physics.Arcade.Group | null = null; // För kollisioner

    private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
    private lastMoveTime: number = 0;
    private socketListenersSetup: boolean = false;

    private bubbleTextManager: BubbleTextManager; // Manager för chattbubblor

    // Constructor för att ta emot props från React-komponenten
    constructor(socket: any, characterId: number, characterName: string) {
        super({ key: 'MainScene' });
        this.socket = socket;
        this.characterId = characterId;
        this.characterName = characterName;
        this.bubbleTextManager = new BubbleTextManager(this); // Skicka med scenen
    }

    preload() {
        console.log('[MainScene] Preloading assets...');
        
        this.load.on('loaderror', (file: any) => {
            console.error('[MainScene] Failed to load asset:', file.key, file.url);
        });
        this.load.on('complete', () => {
            console.log('[MainScene] All assets loaded successfully');
        });

        // Ladda din orc_sheet (och andra char-sheets här)
        this.load.atlas('orc_character', '/assets/orc_sheet.png', '/assets/orc_sheet.json');
        this.load.atlas('goblin_character', '/assets/goblin_sheet.png', '/assets/goblin_sheet.json'); // Exempel för goblin
        // this.load.image("other", "/assets/stone.png"); // Denna behövs inte längre om alla har riktiga sprites
        this.load.image("ground", "/assets/ground.png");
    }

    create() {
        console.log('[MainScene] Creating scene...');
        
        // Skapa bakgrund (fortfarande här då det är en del av scenens visuella uppbyggnad)
        for (let x = 0; x < GRID_WIDTH; x++) {
            for (let y = 0; y < GRID_HEIGHT; y++) {
                this.add.image(x * TILE_SIZE, y * TILE_SIZE, "ground").setOrigin(0);
            }
        }

        // Skapa Player-gruppen för kollisioner
        this.playerGroup = this.physics.add.group();

        // Initiera animationerna globalt i scenen (VIKTIGT!)
        AnimationManager.createAllCharacterAnimations(this.anims);

        this.setupSocketListeners();

        if (this.input && this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
        }
        
        console.log('[MainScene] Scene created, waiting for currentPlayers event...');
    }

    // Flytta all socket-logik hit
    private setupSocketListeners() {
        if (this.socketListenersSetup) {
            console.log('[MainScene] Socket listeners already set up, skipping');
            return;
        }

        console.log('[MainScene] Setting up socket listeners...');
        
        // Rensa alla lyssnare INNAN vi lägger till nya (mycket viktigt vid re-render av React-komponent)
        this.socket.removeAllListeners("currentPlayers");
        this.socket.removeAllListeners("playerJoined");
        this.socket.removeAllListeners("playerMoved");
        this.socket.removeAllListeners("playerLeft");
        this.socket.removeAllListeners("chat");

        this.socket.on("currentPlayers", (players: PlayerData[]) => {
            console.log('[MainScene] ✅ Received currentPlayers:', players);
            
            // Rensa befintliga spelare vid full synkronisering
            if (this.currentPlayer) {
                this.currentPlayer.destroy();
                this.currentPlayer = null;
            }
            Object.values(this.otherPlayers).forEach(op => op.destroy());
            this.otherPlayers = {};
            this.bubbleTextManager.clearAllBubbles();
            
            if (this.playerGroup) {
                this.playerGroup.clear(true, true);
            } else {
                this.playerGroup = this.physics.add.group();
            }

            players.forEach((p) => {
                if (p.id === this.characterId) {
                    this.currentPlayer = new Player(this, p.x, p.y, 'orc_character', p.name); // Använd Player-klassen
                    this.playerGroup?.add(this.currentPlayer);
                    this.cameras.main.startFollow(this.currentPlayer.sprite, true, 0.08, 0.08); // Använd sprite-objektet
                    this.currentPlayer.sprite.play('orc_idle_down'); // Initial animation
                } else {
                    const otherPlayer = new OtherPlayer(this, p.x, p.y, 'goblin_character', p.name, p.id); // Använd OtherPlayer-klass
                    this.otherPlayers[p.id] = otherPlayer;
                    this.playerGroup?.add(otherPlayer.sprite);
                    otherPlayer.sprite.play('goblin_idle_down'); // Initial animation
                }
            });

            // Sätt upp kollisioner
            this.physics.add.collider(this.playerGroup, this.playerGroup);
            
            console.log('[MainScene] Scene setup complete. Main player exists:', !!this.currentPlayer);
        });

        this.socket.on("playerJoined", (p: PlayerData) => {
            console.log('[MainScene] ✅ Player joined:', p);
            if (p.id !== this.characterId && !this.otherPlayers[p.id]) {
                const otherPlayer = new OtherPlayer(this, p.x, p.y, 'goblin_character', p.name, p.id);
                this.otherPlayers[p.id] = otherPlayer;
                this.playerGroup?.add(otherPlayer.sprite);
                otherPlayer.sprite.play('goblin_idle_down'); // Initial animation
            }
        });

        this.socket.on("playerMoved", (data: { id: number; x: number; y: number; animationKey: string }) => {
            if (data.id === this.characterId) return; // Main player is handled by client input
            const op = this.otherPlayers[data.id];
            if (!op) return;
            op.updatePosition(data.x, data.y);
            op.playAnimation(data.animationKey, true); // Spela animation från servern
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
        let animationKey = '';

        if (this.cursors.left.isDown) {
            vx = -speed;
            animationKey = 'orc_walk_left';
        } else if (this.cursors.right.isDown) {
            vx = speed;
            animationKey = 'orc_walk_right';
        } else if (this.cursors.up.isDown) {
            vy = -speed;
            animationKey = 'orc_walk_up';
        } else if (this.cursors.down.isDown) {
            vy = speed;
            animationKey = 'orc_walk_down';
        }

        this.currentPlayer.setVelocity(vx, vy);

        if (vx === 0 && vy === 0) {
            // No movement, play idle animation based on last direction
            let currentAnimKey = this.currentPlayer.sprite.anims.currentAnim ? this.currentPlayer.sprite.anims.currentAnim.key : null;
            if (currentAnimKey && currentAnimKey.startsWith('orc_walk_')) {
                animationKey = currentAnimKey.replace('orc_walk_', 'orc_idle_');
            } else if (!currentAnimKey || currentAnimKey.startsWith('orc_idle_')) {
                // If already idle or no animation, ensure it stays idle (or default down idle)
                animationKey = currentAnimKey || 'orc_idle_down';
            }
        }

        // Spela animationen
        if (animationKey) {
            this.currentPlayer.playAnimation(animationKey, true);
        }

        // Uppdatera namntextens position
        this.currentPlayer.updateNameTextPosition();

        // Begränsa move-meddelanden för att undvika överbelastning
        const now = Date.now();
        if (now - this.lastMoveTime > 10) { // Max 20 FPS för move events
            this.socket.emit("move", { x: this.currentPlayer.sprite.x, y: this.currentPlayer.sprite.y, animationKey: animationKey });
            this.lastMoveTime = now;
        }

        // Uppdatera chattbubblor
        this.bubbleTextManager.updateBubbles(now);
    }
}