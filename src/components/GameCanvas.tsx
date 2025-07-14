import { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import { MainScene } from "../scenes/MainScene"; // Importera din separata scen
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../constants"; // Importera konstanter

type GameCanvasProps = {
  characterId: number;
  characterName: string;
  socket: any;
};

const GameCanvas = ({ characterId, characterName, socket }: GameCanvasProps) => {
  const phaserRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const gameRef = useRef<Phaser.Game | null>(null);
  const initializationRef = useRef<boolean>(false);

  // bubbleTextsRef ligger kvar här i React då den är en del av React-state
  // som sedan skickas ner till MainScene via konstruktorn för bubblornas hantering
  const bubbleTextsRef = useRef<{ [id: number]: { text: string; ts: number } }>({});

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

  useEffect(() => {
    if (initializationRef.current) {
      console.log('[GameCanvas] Skipping duplicate initialization');
      return;
    }

    if (gameRef.current) {
      console.log('[GameCanvas] Destroying existing game instance');
      gameRef.current.destroy(true);
      gameRef.current = null;
    }

    if (!socket) {
      console.log('[GameCanvas] No socket provided, skipping initialization');
      return;
    }

    console.log('[GameCanvas] Starting with characterId:', characterId, 'characterName:', characterName);
    console.log('[GameCanvas] Socket state:', socket.connected, socket.id);

    initializationRef.current = true;

    // Wait for socket to be connected before initializing game
    const initializeGame = () => {
      if (!socket.connected) {
        console.log('[GameCanvas] Socket not connected yet, waiting...');
        setTimeout(initializeGame, 100);
        return;
      }

      console.log('[GameCanvas] Socket connected, initializing game...');

      // Skicka in socket, characterId och characterName till MainScene via konstruktorn
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        physics: { default: "arcade", arcade: { debug: false } },
        scene: new MainScene(socket, characterId, characterName), // Pass props here
        parent: phaserRef.current!,
        backgroundColor: "#23272f"
      };

      gameRef.current = new Phaser.Game(config);
    };

    initializeGame();

    return () => {
      console.log('[GameCanvas] Cleaning up GameCanvas');
      initializationRef.current = false;
      
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [characterId, characterName, socket?.id]);

  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => { console.log('[GameCanvas] Socket connected event received'); };
    const handleDisconnect = (reason: string) => { console.log('[GameCanvas] Socket disconnected event received:', reason); };
    const handleConnectError = (error: any) => { console.error('[GameCanvas] Socket connection error:', error); };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
    };
  }, [socket]);

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