// src/components/GameCanvas.tsx

import { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import { MainScene } from "../scenes/MainScene"; 
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../constants"; 
import type { Character } from '../types'; 

type GameCanvasProps = {
  socket: any;
  isChatInputFocused: boolean;
  mainCharacterData: Character | null; // Acceptera null initialt
  isConnected: boolean; // Ny prop för att veta om socket är ansluten
};

const GameCanvas = ({ socket, isChatInputFocused, mainCharacterData, isConnected }: GameCanvasProps) => {
  const phaserRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const gameRef = useRef<Phaser.Game | null>(null);

  // Effekt för att hantera skalning av canvas baserat på fönsterstorlek
  useEffect(() => {
    function updateScale() {
      const scaleW = window.innerWidth / CANVAS_WIDTH;
      const scaleH = window.innerHeight / CANVAS_HEIGHT;
      setScale(Math.min(scaleW, scaleH, 1));
    }
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  // Effekt för att initialisera Phaser-spelet
  useEffect(() => {
    // VIKTIGT: Denna check garanterar att Phaser ENDAST initialiseras när vi har
    // - en socket-instans
    // - en aktiv anslutning (isConnected)
    // - den serverbekräftade mainCharacterData
    if (!socket || !isConnected || !mainCharacterData) {
      console.log('[GameCanvas] Waiting for socket connection and character data. Socket:', !!socket, 'Connected:', isConnected, 'CharacterData:', !!mainCharacterData);
      // Om spelet redan är igång och vi plötsligt tappar data/anslutning, förstör det.
      if (gameRef.current) {
         console.log('[GameCanvas] Conditions not met, destroying existing game instance.');
         gameRef.current.destroy(true);
         gameRef.current = null;
      }
      return;
    }

    // Om spelet redan finns, förstör det först för att undvika dubbelinstansiering vid React re-render.
    if (gameRef.current) {
      console.log('[GameCanvas] Destroying existing game instance before re-initialization (due to prop change).');
      gameRef.current.destroy(true);
      gameRef.current = null;
    }

    // Logga de FAKTISKA värdena som används för initialiseringen
    console.log('[GameCanvas] Initializing Phaser with characterId:', mainCharacterData.id, 'characterName:', mainCharacterData.name);
    console.log('[GameCanvas] Socket state (at init):', socket.connected, socket.id);
    console.log('[GameCanvas] Full mainCharacterData received for initialization:', mainCharacterData);


    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      physics: { default: "arcade", arcade: { debug: false } }, 
      // Skicka mainCharacterData direkt till MainScene konstruktorn
      scene: new MainScene(socket, mainCharacterData.id, mainCharacterData.name, mainCharacterData), 
      parent: phaserRef.current!,
      backgroundColor: "#23272f"
    };

    gameRef.current = new Phaser.Game(config);
    console.log('[GameCanvas] Phaser game instance created.');

    return () => {
      console.log('[GameCanvas] Cleaning up GameCanvas: Destroying Phaser game instance on unmount or dependency change.');
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [socket, isConnected, mainCharacterData]); // Beroende på socket, dess anslutningsstatus och characterData

  // Effekt för att skicka chatt input focus state till Phaser
  useEffect(() => {
    // Endast om spelet är igång och MainScene är aktiv
    if (gameRef.current && gameRef.current.scene.isActive('MainScene')) {
      const mainScene = gameRef.current.scene.getScene('MainScene') as MainScene;
      if (mainScene && typeof mainScene.setChatInputFocus === 'function') {
        mainScene.setChatInputFocus(isChatInputFocused);
      }
    }
  }, [isChatInputFocused]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#2d2d2d",
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      <div
        ref={phaserRef}
        style={{
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          boxShadow: "0 0 36px #000d",
          border: "2px solid #404040",
          background: "#2d2d2d"
        }}
      />
    </div>
  );
};

export default GameCanvas;