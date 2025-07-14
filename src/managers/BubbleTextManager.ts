import Phaser from 'phaser';
import { splitLines } from '../utils/textUtils'; // Skapa en textUtils.ts för denna helper

type BubbleData = { text: string; ts: number; };

export class BubbleTextManager {
    private scene: Phaser.Scene;
    private activeBubbles: { [id: number]: Phaser.GameObjects.Text } = {};
    private pendingBubbles: { [id: number]: BubbleData } = {}; // Från React-refen

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    // Kallad från React-komponentens ref för att lägga till/uppdatera bubblor
    addBubble(id: number, text: string) {
        this.pendingBubbles[id] = { text, ts: this.scene.time.now };
    }

    removeBubble(id: number) {
        if (this.activeBubbles[id]) {
            this.activeBubbles[id].destroy();
            delete this.activeBubbles[id];
        }
        delete this.pendingBubbles[id];
    }

    clearAllBubbles() {
        Object.values(this.activeBubbles).forEach(bubble => bubble.destroy());
        this.activeBubbles = {};
        this.pendingBubbles = {};
    }

    updateBubbles(currentTime: number) {
        // Hantera inkommande bubblor från pending
        Object.entries(this.pendingBubbles).forEach(([id, { text, ts }]) => {
            const parsedId = parseInt(id); // Säkerställ att det är ett nummer
            let sprite = null;
            // Hur du får tag på spriten beror på hur du hanterar dem i din MainScene
            // Antar att du har tillgång till spelarobjekten i MainScene
            // Få referens till spelaren eller OtherPlayer's sprite. Detta kan behöva justeras
            // beroende på hur MainScene exponerar sina spelare.
            // BÄTTRE ATT SKICKA IN SPRAY REFERENS VID SKAPANDE AV BUBBLE I STÄLLET
            
            // For now, let's assume MainScene will provide sprites
            // Or MainScene passes its `player` and `otherPlayers` map to this manager
            // For this example, we'll need to modify MainScene slightly to give access.
            
            // Temporär lösning, du behöver ge BubbleTextManager åtkomst till player/otherPlayers
            // En bättre lösning är att MainScene skickar med sprite-referensen när den kallar addBubble
            // Eller att BubbleTextManager får tillgång till MainScene's spelarlistor.
            
            // Just nu kommer denna del vara trasig tills MainScene är klar med sina Player/OtherPlayer objekt.
            // Denna kod nedan behöver få in players referensen.
            // Den mest robusta lösningen är att MainScene.ts är den som itererar över spelare,
            // och sedan kallar en metod på BubbleTextManager som `bubbleTextManager.drawBubbleForPlayer(playerSprite, text, ts)`
            // Se uppdatering i MainScene.ts update().

            // För att få detta att fungera nu: MainScene behöver skicka med en referens till sin player och otherPlayers-mappen
            // eller att BubbleTextManager får en metod som 'updatePlayerPositions(playersMap, currentPlayer)' och sköter allt internt.
            
            // För att fixa det snabbt: Lägg till spelar-referenser i `this.pendingBubbles` eller `this.activeBubbles` när de skapas.
            // Eller få BubbleTextManager att ta emot spelar-kartan i sin update-metod.
        });


        // Iterera över aktiva bubblor för att uppdatera position och förstöra gamla
        Object.entries(this.activeBubbles).forEach(([id, bubbleText]) => {
            const parsedId = parseInt(id); // Säkerställ att det är ett nummer
            const bubbleData = this.pendingBubbles[parsedId]; // Hämta data

            if (!bubbleData || currentTime - bubbleData.ts > 15000) {
                // Bubblan är för gammal eller har tagits bort från pending
                bubbleText.destroy();
                delete this.activeBubbles[parsedId];
                delete this.pendingBubbles[parsedId]; // Ta bort från pending också
                return;
            }
            
            // Hämta sprite för spelaren med detta ID
            let spriteToFollow: Phaser.Physics.Arcade.Sprite | null = null;
            // Detta kräver att MainScene ger denna manager tillgång till sina player/otherPlayers
            // För enkelhetens skull, lägg till player/otherPlayersMap som argument i constructor/update
            // VIKTIGT: Denna del av BubbleTextManager måste justeras så den får korrekt sprite-referens.
            // Tillfälligt sätt: MainScene ansvarar för att uppdatera bubbelpositioner.
        });
    }

    // Ny metod för att rita/uppdatera en enskild bubbla baserat på sprite
    drawBubbleForSprite(id: number, sprite: Phaser.Physics.Arcade.Sprite, textData: BubbleData) {
        const { text, ts } = textData;
        const lines = splitLines(text);
        
        let bubbleText = this.activeBubbles[id];
        if (!bubbleText) {
            bubbleText = this.scene.add.text(sprite.x, sprite.y - 90, lines, {
                fontSize: "16px",
                color: "#ffeab6",
                backgroundColor: "#000a",
                padding: { x: 8, y: 4 },
                align: "center",
                wordWrap: { width: 240, useAdvancedWrap: true }
            }).setOrigin(0.5, 1);
            this.activeBubbles[id] = bubbleText;
        } else {
            bubbleText.setText(lines);
        }
        bubbleText.setPosition(sprite.x, sprite.y - 80 - (lines.length - 1) * 16);
    }
}