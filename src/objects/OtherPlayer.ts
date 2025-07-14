import Phaser from 'phaser';

export class OtherPlayer extends Phaser.Physics.Arcade.Sprite {
    public nameText: Phaser.GameObjects.Text;
    public id: number;
    public sprite: this;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, name: string, id: number) {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0.5, 0.5);
        this.setCollideWorldBounds(true); // Kan behövas för kollisioner mellan andra spelare
        this.id = id;
        this.sprite = this;

        this.nameText = scene.add.text(
            this.x,
            this.y - (this.displayHeight / 2) - 10,
            name,
            {
                fontSize: "16px",
                color: "#fff",
                backgroundColor: "#0008",
                padding: { x: 4, y: 2 }
            }
        ).setOrigin(0.5, 1);
    }

    updatePosition(x: number, y: number) {
        this.setPosition(x, y);
        this.nameText.setPosition(x, y - (this.displayHeight / 2) - 10);
    }

    playAnimation(key: string, ignoreIfPlaying: boolean = false) {
        this.play(key, ignoreIfPlaying);
    }

    destroy() {
        super.destroy();
        this.nameText.destroy();
    }
}