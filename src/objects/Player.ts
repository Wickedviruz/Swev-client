import Phaser from 'phaser';

export class Player extends Phaser.Physics.Arcade.Sprite {
    public nameText: Phaser.GameObjects.Text;
    public sprite: this; // En referens till sig själv för tydlighet

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, name: string) {
        super(scene, x, y, texture);

        scene.add.existing(this); // Lägg till i scenen
        scene.physics.add.existing(this); // Lägg till i fysiksystemet

        this.setCollideWorldBounds(true); // Kollidera med världens gränser
        this.setOrigin(0.5, 0.5); // Sätt origin till mitten
        
        this.sprite = this; // Ge en tydlig referens till sig själv

        this.nameText = scene.add.text(
            this.x,
            this.y - (this.displayHeight / 2) - 10, // Placera ovanför sprite
            name,
            {
                fontSize: "16px",
                color: "#fff",
                backgroundColor: "#0008",
                padding: { x: 4, y: 2 }
            }
        ).setOrigin(0.5, 1);
    }

    // Metod för att uppdatera namntextens position
    updateNameTextPosition() {
        this.nameText.setPosition(this.x, this.y - (this.displayHeight / 2) - 10);
    }

    // Metod för att spela animationer
    playAnimation(key: string, ignoreIfPlaying: boolean = false) {
        this.play(key, ignoreIfPlaying);
    }

    destroy() {
        super.destroy();
        this.nameText.destroy();
    }
}