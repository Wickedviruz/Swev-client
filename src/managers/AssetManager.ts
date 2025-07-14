import Phaser from 'phaser';
import { assetRegistry } from '../assetRegistry';

// Definiera gränssnitten (interfaces) för enhetlig datahantering
interface SpriteInfo {
  key: string;
  atlas: string;
  frame?: string;
}

interface CharacterLook extends SpriteInfo {
  // Specifika egenskaper för karaktärsutseenden kan läggas till här
}

export class AssetManager {

    /**
     * Skapar en lista med alla unika spritesheet-nycklar som ska laddas från registret.
     * @returns En array av unika atlas-nycklar.
     */
    public static getUniqueAtlasKeys(): string[] {
        const uniqueKeys = new Set<string>();
        for (const category of Object.values(assetRegistry)) {
            for (const asset of Object.values(category)) {
                if ('atlas' in asset && typeof asset.atlas === 'string') {
                    uniqueKeys.add(asset.atlas);
                }
            }
        }
        return Array.from(uniqueKeys);
    }
    
    /**
     * Skapar alla standardanimationer (idle, walk) för karaktärerna från registret.
     * @param anims Phasers AnimationManager-instans (this.anims från scenen).
     */
    public static createAllAnimations(anims: Phaser.Animations.AnimationManager): void {
        const characters = Object.values(assetRegistry.characters);
        characters.forEach((look: CharacterLook) => {
            const { key, atlas } = look;
            
            // Idle animations
            anims.create({
                key: `${key}_idle_down`,
                frames: [{ key: atlas, frame: `${key}_down_idle` }],
                frameRate: 1, repeat: -1
            });
            anims.create({
                key: `${key}_idle_up`,
                frames: [{ key: atlas, frame: `${key}_up_idle` }],
                frameRate: 1, repeat: -1
            });
            anims.create({
                key: `${key}_idle_left`,
                frames: [{ key: atlas, frame: `${key}_left_idle` }],
                frameRate: 1, repeat: -1
            });
            anims.create({
                key: `${key}_idle_right`,
                frames: [{ key: atlas, frame: `${key}_right_idle` }],
                frameRate: 1, repeat: -1
            });
    
            // Walk animations
            const walkFrames = 2; // Antal walk-frames, kan också finnas i registret
            anims.create({
                key: `${key}_walk_down`,
                frames: anims.generateFrameNames(atlas, { prefix: `${key}_down_walk_`, start: 0, end: walkFrames - 1 }),
                frameRate: 6, repeat: -1
            });
            anims.create({
                key: `${key}_walk_up`,
                frames: anims.generateFrameNames(atlas, { prefix: `${key}_up_walk_`, start: 0, end: walkFrames - 1 }),
                frameRate: 6, repeat: -1
            });
            anims.create({
                key: `${key}_walk_left`,
                frames: anims.generateFrameNames(atlas, { prefix: `${key}_left_walk_`, start: 0, end: walkFrames - 1 }),
                frameRate: 6, repeat: -1
            });
            anims.create({
                key: `${key}_walk_right`,
                frames: anims.generateFrameNames(atlas, { prefix: `${key}_right_walk_`, start: 0, end: walkFrames - 1 }),
                frameRate: 6, repeat: -1
            });
        });
    }

    /**
     * Hämtar information för en karaktärs-look baserat på dess ID.
     * @param looktype ID från servern.
     * @returns Ett objekt med key och atlas, eller undefined om det inte hittas.
     */
    public static getCharacterLook(looktype: number): CharacterLook | undefined {
        return assetRegistry.characters[looktype];
    }
    
    /**
     * Skapar den fullständiga animationsnyckeln utifrån karaktärsdata.
     * @param looktype Karaktärens looktype från servern.
     * @param direction Karaktärens riktning (0=vänster, 1=upp, 2=ner, 3=höger).
     * @param action 'idle' eller 'walk'.
     * @returns Den kompletta nyckeln för animationen (t.ex. 'orc_walk_down').
     */
    public static getAnimationKey(looktype: number, direction: number, action: 'idle' | 'walk'): string {
        const look = this.getCharacterLook(looktype);
        const characterKey = look ? look.key : 'orc'; // Använd fallback om looktype inte finns
        
        let dirString = '';
        switch (direction) {
            case 0: dirString = 'left'; break;
            case 1: dirString = 'up'; break;
            case 2: dirString = 'down'; break;
            case 3: dirString = 'right'; break;
            default: dirString = 'down'; break;
        }
        return `${characterKey}_${action}_${dirString}`;
    }
}