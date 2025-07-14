import Phaser from 'phaser';

export class AnimationManager {

    /**
     * Skapar alla standardanimationer för en karaktärstyp (idle, walk i 4 riktningar).
     * Kräver att spritesheets har följt namngivningskonventionen:
     * [characterKey]_down_idle, [characterKey]_down_walk_0, [characterKey]_down_walk_1 etc.
     * @param anims Phasers AnimationManager-instans (this.anims från scenen)
     * @param characterKey En unik nyckel för karaktärstypen (t.ex. 'orc', 'goblin')
     * @param atlasKey Nyckeln för spritesheeten som laddades i preload (t.ex. 'orc_character')
     * @param frameRate Walk animationens framerate
     * @param walkFrames Antal walk-frames (standard är 2 för walk_0, walk_1)
     */
    static createCharacterAnimations(
        anims: Phaser.Animations.AnimationManager, 
        characterKey: string, 
        atlasKey: string, 
        frameRate: number = 6, 
        walkFrames: number = 2
    ) {
        // Idle animations
        anims.create({
            key: `${characterKey}_idle_down`,
            frames: [{ key: atlasKey, frame: `${characterKey}_down_idle` }],
            frameRate: 1, repeat: -1
        });
        anims.create({
            key: `${characterKey}_idle_up`,
            frames: [{ key: atlasKey, frame: `${characterKey}_up_idle` }],
            frameRate: 1, repeat: -1
        });
        anims.create({
            key: `${characterKey}_idle_left`,
            frames: [{ key: atlasKey, frame: `${characterKey}_left_idle` }],
            frameRate: 1, repeat: -1
        });
        anims.create({
            key: `${characterKey}_idle_right`,
            frames: [{ key: atlasKey, frame: `${characterKey}_right_idle` }],
            frameRate: 1, repeat: -1
        });

        // Walk animations
        anims.create({
            key: `${characterKey}_walk_down`,
            frames: anims.generateFrameNames(atlasKey, { prefix: `${characterKey}_down_walk_`, start: 0, end: walkFrames - 1, zeroPad: 0 }),
            frameRate: frameRate, repeat: -1
        });
        anims.create({
            key: `${characterKey}_walk_up`,
            frames: anims.generateFrameNames(atlasKey, { prefix: `${characterKey}_up_walk_`, start: 0, end: walkFrames - 1, zeroPad: 0 }),
            frameRate: frameRate, repeat: -1
        });
        anims.create({
            key: `${characterKey}_walk_left`,
            frames: anims.generateFrameNames(atlasKey, { prefix: `${characterKey}_left_walk_`, start: 0, end: walkFrames - 1, zeroPad: 0 }),
            frameRate: frameRate, repeat: -1
        });
        anims.create({
            key: `${characterKey}_walk_right`,
            frames: anims.generateFrameNames(atlasKey, { prefix: `${characterKey}_right_walk_`, start: 0, end: walkFrames - 1, zeroPad: 0 }),
            frameRate: frameRate, repeat: -1
        });
    }

    /**
     * Kallar på createCharacterAnimations för alla karaktärer/monster i spelet.
     * Denna metod kallas en gång i MainScene.create().
     */
    static createAllCharacterAnimations(anims: Phaser.Animations.AnimationManager) {
        // För spelaren (orc-grafik)
        AnimationManager.createCharacterAnimations(anims, 'orc', 'orc_character', 6, 2); 
        // För en goblin
        AnimationManager.createCharacterAnimations(anims, 'goblin', 'goblin_character', 8, 2);
        // Lägg till fler monster/karaktärer här
        // AnimationManager.createCharacterAnimations(anims, 'dragon', 'dragon_character', 10, 4);
    }
}