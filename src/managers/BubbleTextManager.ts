// src/managers/BubbleTextManager.ts
import Phaser from 'phaser';
import { splitLines } from '../utils/textUtils'; // Ensure this utility is available

interface ActiveBubbleData {
    textObject: Phaser.GameObjects.Text;
    timer: Phaser.Time.TimerEvent;
    attachedSprite: Phaser.Physics.Arcade.Sprite; // Store the sprite reference
}

export class BubbleTextManager {
    private scene: Phaser.Scene;
    private activeBubbles: Map<number, ActiveBubbleData> = new Map(); // Map player ID to bubble data

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    /**
     * Adds or updates a chat bubble for a given player ID, attached to their sprite.
     * @param playerId The ID of the player.
     * @param message The text content of the bubble.
     * @param attachedSprite The Phaser sprite that the bubble should follow.
     */
    addBubble(playerId: number, message: string, attachedSprite: Phaser.Physics.Arcade.Sprite) {
        // If a bubble already exists for this player, destroy it and its timer first
        this.removeBubble(playerId);

        const lines = splitLines(message);
        
        const bubbleText = this.scene.add.text(
            attachedSprite.x,
            // Position it above the sprite, adjusted for sprite height and text lines
            attachedSprite.y - (attachedSprite.displayHeight / 2) - 10 - (lines.length * 10), 
            lines,
            { 
                fontSize: '10px', 
                color: '#FFFFFF', 
                backgroundColor: '#333333', 
                padding: { x: 5, y: 2 }, 
                borderRadius: 5, // For rounded corners if your Phaser version supports it or if you simulate it
                wordWrap: { width: 100, useWordWrap: true },
                align: 'center' 
            }
        ).setOrigin(0.5, 1).setDepth(11); // Set depth high enough to be above players and other objects

        // Set up a timer to destroy the bubble after a certain duration (e.g., 3 seconds)
        const timer = this.scene.time.addEvent({
            delay: 3000, 
            callback: () => this.removeBubble(playerId),
            callbackScope: this
        });

        this.activeBubbles.set(playerId, { textObject: bubbleText, timer, attachedSprite });
    }

    /**
     * Removes a chat bubble for a given player ID.
     * @param playerId The ID of the player whose bubble to remove.
     */
    removeBubble(playerId: number) {
        const bubbleData = this.activeBubbles.get(playerId);
        if (bubbleData) {
            bubbleData.textObject.destroy();
            bubbleData.timer.remove(false); // Stop the timer if it's still running
            this.activeBubbles.delete(playerId);
        }
    }

    /**
     * Updates the position of an active chat bubble for a given player ID.
     * This should be called whenever the player's sprite moves.
     * @param playerId The ID of the player.
     * @param spriteX The new X coordinate of the player's sprite.
     * @param spriteY The new Y coordinate of the player's sprite.
     * @param spriteDisplayHeight The display height of the player's sprite.
     */
    updateBubblePosition(playerId: number, spriteX: number, spriteY: number, spriteDisplayHeight: number) {
        const bubbleData = this.activeBubbles.get(playerId);
        if (bubbleData) {
            const lines = splitLines(bubbleData.textObject.text); // Recalculate based on current text to adjust height
            // Position the bubble relative to the sprite
            bubbleData.textObject.setPosition(spriteX, spriteY - (spriteDisplayHeight / 2) - 10 - (lines.length * 10));
        }
    }

    /**
     * Clears all active chat bubbles.
     */
    clearAllBubbles() {
        this.activeBubbles.forEach(bubble => {
            bubble.textObject.destroy();
            bubble.timer.remove(false);
        });
        this.activeBubbles.clear();
    }

    /**
     * This method can be used for general updates if needed (e.g., fading effects).
     * For now, it simply ensures the timers are being processed (though Phaser's Time Manager handles most of it).
     */
    updateBubbles(time: number) {
        // This method can be kept for future features like fading or complex animations.
        // For basic positioning, `updateBubblePosition` is called directly when a player moves.
    }
}