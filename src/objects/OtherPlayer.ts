import Phaser from 'phaser';
import { AssetManager } from '../managers/AssetManager'; // Importera AssetManager

export class OtherPlayer {
    public sprite: Phaser.Physics.Arcade.Sprite;
    public nameText: Phaser.GameObjects.Text;
    public name: string;
    public id: number;
    public looktype: number; // Lägg till denna egenskap
    public direction: number; // Lägg till denna egenskap
    public pos_x: number; 
    public pos_y: number;
    public pos_z: number;

    private scene: Phaser.Scene;

    constructor(
        scene: Phaser.Scene, 
        pos_x: number, 
        pos_y: number, 
        pos_z: number,
        atlasKey: string, 
        name: string, 
        id: number,
        looktype: number,
        direction: number 
    ) {
        this.scene = scene;
        this.name = name;
        this.id = id;
        this.looktype = looktype; 
        this.direction = direction; 
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.pos_z = pos_z;

        // Använd AssetManager för att få den initiala framen
        const initialFrame = AssetManager.getAnimationKey(looktype, direction, 'idle');
        this.sprite = this.scene.physics.add.sprite(pos_x, pos_y, atlasKey, initialFrame).setOrigin(0.5);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setDamping(true).setDrag(0.99);

        this.nameText = this.scene.add.text(pos_x, pos_y - 20, name, {
            fontFamily: 'Arial',
            fontSize: '12px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        this.sprite.setData('owner', this);
    }

    updatePosition(pos_x: number, pos_y: number, pos_z: number) {
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.pos_z = pos_z;
        this.sprite.setPosition(pos_x, pos_y);
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