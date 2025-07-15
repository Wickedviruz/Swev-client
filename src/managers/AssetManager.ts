import Phaser from 'phaser';
import { assetRegistry } from '../assetRegistry'; // Korrekt import

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

    public static getUniqueAtlasKeys(): string[] {
        const uniqueKeys = new Set<string>();
        for (const category of Object.values(assetRegistry)) {
            // Kontrollera om kategorin är 'characters' och hantera den specifikt
            if (category === assetRegistry.characters) {
                for (const lookType in category) {
                    const character = category[lookType as unknown as number];
                    if (character.atlas && typeof character.atlas === 'string') {
                        uniqueKeys.add(character.atlas);
                    }
                }
            } else {
                // Generell hantering för andra kategorier
                for (const asset of Object.values(category)) {
                    if ('atlas' in asset && typeof asset.atlas === 'string') {
                        uniqueKeys.add(asset.atlas);
                    }
                }
            }
        }
        return Array.from(uniqueKeys);
    }
    
    public static createAllAnimations(anims: Phaser.Animations.AnimationManager): void {
        console.log('[AssetManager] Creating all animations...');

        // Loopa igenom alla karaktärer i registret
        for (const looktypeStr in assetRegistry.characters) {
            const looktype = parseInt(looktypeStr, 10);
            const characterInfo = assetRegistry.characters[looktype];

            if (!characterInfo) {
                console.warn(`[AssetManager] Missing character info for looktype: ${looktype}`);
                continue;
            }

            const { key, atlas } = characterInfo; // key är nu 'outfit_73' för din Hero
            const framesPerDirection = 3; // Antal frames per riktning (idle + 2 walk frames)
            const frameRate = 8; // Hastighet för walk-animation

            // Riktningar: 0=left, 1=up, 2=down, 3=right
            const directions = ['left', 'up', 'down', 'right'];

            directions.forEach((dirString, directionIndex) => {
                const startFrameIndex = directionIndex * framesPerDirection;
                const endFrameIndex = startFrameIndex + framesPerDirection - 1;

                // Skapa "walk" animation
                anims.create({
                    key: `${key}_walk_${dirString}`, // t.ex. 'outfit_73_walk_left'
                    frames: anims.generateFrameNames(atlas, {
                        prefix: `${key}-`, // t.ex. 'outfit_73-'
                        start: startFrameIndex,
                        end: endFrameIndex,
                        suffix: '.png', // Se till att suffix matchar din JSON
                        zeroPad: 0 // Ingen padding behövs om filnamnen är outfit_73-0.png, outfit_73-1.png
                    }),
                    frameRate: frameRate,
                    repeat: -1
                });

                // Skapa "idle" animation (använd första framen i varje riktning)
                anims.create({
                    key: `${key}_idle_${dirString}`, // t.ex. 'outfit_73_idle_left'
                    frames: [{ key: atlas, frame: `${key}-${startFrameIndex}.png` }],
                    frameRate: 1,
                    repeat: -1
                });
            });
        }
        console.log('[AssetManager] All animations created');
    }

    public static getCharacterLook(looktype: number): CharacterLook | undefined {
        return assetRegistry.characters[looktype];
    }
    
    public static getAnimationKey(looktype: number, direction: number, action: 'idle' | 'walk'): string {
        const look = this.getCharacterLook(looktype);
        // Fallback till 'outfit_73' om looktype inte finns, för att matcha din players.json
        const characterKey = look ? look.key : 'outfit_73'; 
        
        let dirString = '';
        switch (direction) {
            case 0: dirString = 'left'; break;
            case 1: dirString = 'up'; break;
            case 2: dirString = 'down'; break;
            case 3: dirString = 'right'; break;
            default: dirString = 'down'; break; // Standardriktning
        }
        return `${characterKey}_${action}_${dirString}`;
    }
}