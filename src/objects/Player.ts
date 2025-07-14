import Phaser from 'phaser';

export class Player {
    public sprite: Phaser.Physics.Arcade.Sprite;
    public nameText: Phaser.GameObjects.Text;
    public name: string;
    public looktype: number; // Lägg till denna egenskap
    public direction: number; // Lägg till denna egenskap

    private scene: Phaser.Scene;

    constructor(
        scene: Phaser.Scene, 
        x: number, 
        y: number, 
        atlasKey: string, 
        name: string,
        looktype: number, // Lägg till denna parameter
        direction: number // Lägg till denna parameter
    ) {
        this.scene = scene;
        this.name = name;
        this.looktype = looktype; // Spara looktype
        this.direction = direction; // Spara direction

        this.sprite = this.scene.physics.add.sprite(x, y, atlasKey, 'orc_down_idle').setOrigin(0.5);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setDamping(true).setDrag(0.99);
        this.sprite.body.onOverlap = true;

        this.nameText = this.scene.add.text(x, y - 20, name, {
            fontFamily: 'Arial',
            fontSize: '12px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Skicka med `this` som data för att kunna uppdatera namnet och bubblan
        this.sprite.setData('owner', this);
    }
    
    updateNameTextPosition() {
        this.nameText.x = this.sprite.x;
        this.nameText.y = this.sprite.y - 20;
    }

    setVelocity(vx: number, vy: number) {
        this.sprite.setVelocity(vx, vy);
    }

    playAnimation(key: string, ignoreIfPlaying?: boolean) {
        this.sprite.play(key, ignoreIfPlaying);
    }

    destroy() {
        this.sprite.destroy();
        this.nameText.destroy();
    }
}