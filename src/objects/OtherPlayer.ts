import Phaser from 'phaser';
import { AssetManager } from '../managers/AssetManager'; // Importera AssetManager

export class OtherPlayer {
    public sprite: Phaser.Physics.Arcade.Sprite;
    public nameText: Phaser.GameObjects.Text;
    public name: string;
    public id: number;
    public looktype: number; // Lägg till denna egenskap
    public direction: number; // Lägg till denna egenskap

    private scene: Phaser.Scene;

    constructor(
        scene: Phaser.Scene, 
        x: number, 
        y: number, 
        atlasKey: string, 
        name: string, 
        id: number,
        looktype: number, // Lägg till denna parameter
        direction: number // Lägg till denna parameter
    ) {
        this.scene = scene;
        this.name = name;
        this.id = id;
        this.looktype = looktype; // Spara looktype
        this.direction = direction; // Spara direction

        // Använd AssetManager för att få den initiala framen
        const initialFrame = AssetManager.getAnimationKey(looktype, direction, 'idle');
        this.sprite = this.scene.physics.add.sprite(x, y, atlasKey, initialFrame).setOrigin(0.5);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setDamping(true).setDrag(0.99);

        this.nameText = this.scene.add.text(x, y - 20, name, {
            fontFamily: 'Arial',
            fontSize: '12px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        this.sprite.setData('owner', this);
    }

    updatePosition(x: number, y: number) {
        this.sprite.x = x;
        this.sprite.y = y;
        this.updateNameTextPosition();
    }

    updateNameTextPosition() {
        this.nameText.x = this.sprite.x;
        this.nameText.y = this.sprite.y - 20;
    }

    playAnimation(key: string, ignoreIfPlaying?: boolean) {
        if (!this.sprite) return; // Säkerhetskoll
        this.sprite.play(key, ignoreIfPlaying);
    }

    destroy() {
        this.sprite.destroy();
        this.nameText.destroy();
    }
}