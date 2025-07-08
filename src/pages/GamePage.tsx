// src/pages/GamePage.tsx
import { useEffect, useRef, useState } from "react";
import GameCanvas from "../components/GameCanvas";
import PlayerInfoPanel from "../components/PlayerInfoPanel";
import type { User, Character } from "../types";
import { createSocket, resetSocket } from "../socket";
import ChatWindow from "../components/ChatWindow";

import SidebarLeft from "../components/SidebarLeft";
import SidebarRight from "../components/SidebarRight";
import StatusBar from "../components/StatusBar"; // <-- Uppdaterad import här!
import ActionBar from "../components/ActionBar";
import FloatingWindow from "../components/FloatingWindow";
import InventoryWindow from "../components/InventoryWindow";

// Definierar typen för ett öppet fönster
interface OpenWindow {
  id: string;
  title: string;
  type: 'inventory' | 'other'; // Kan utökas med fler typer
  x: number;
  y: number;
  width: number;
  height: number;
}

type GamePageProps = {
  user: User;
  character: Character;
  onExit: () => void;
};

const GamePage = ({ user, character, onExit }: GamePageProps) => {
  const characterId = character.id;
  const socketRef = useRef<any>(null);
  const [characterData, setCharacterData] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<{ name: string; text: string; color?: string }[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);

  // Mock data för guld och kapacitet (ersätt med verklig data från servern)
  // Dessa kan uppdateras via socket.on('playerStats') om din server skickar dem
  const [gold, setGold] = useState(12345);
  const [capacity, setCapacity] = useState(350);
  const capacityMax = 1000;

  // Skapa socket vid mount, stäng vid unmount
  useEffect(() => {
    socketRef.current = createSocket(characterId);

    const socket = socketRef.current;
    const handleConnect = () => {
      console.log('[GamePage] Socket connected');
      setIsConnected(true);
      setChatMessages(prev => [...prev, { name: "System", text: "Welcome to the game!", color: "#00ff00" }]);
    };
    const handleDisconnect = () => {
      console.log('[GamePage] Socket disconnected');
      setIsConnected(false);
      setChatMessages(prev => [...prev, { name: "System", text: "Disconnected from server.", color: "#ff0000" }]);
    };
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    if (socket.connected) setIsConnected(true);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      resetSocket();
    };
  }, [characterId]);

  // Player events
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !isConnected) return;

    const onPlayers = (players: Character[]) => {
      console.log("[GamePage] FICK currentPlayers från servern!", players);
      const me = players.find((p: Character) => p.id === characterId);
      if (me) setCharacterData(me);
    };
    // Uppdatera characterData och mock-data för guld/kapacitet här
    const onStats = (stats: any) => {
      setCharacterData(stats);
      // Uppdatera mock data för guld och kapacitet med verklig data om tillgänglig
      if (stats.gold !== undefined) setGold(stats.gold);
      if (stats.capacity !== undefined) setCapacity(stats.capacity);
    };

    socket.off("currentPlayers");
    socket.off("playerStats");
    socket.on("currentPlayers", onPlayers);
    socket.on("playerStats", onStats);

    return () => {
      socket.off("currentPlayers", onPlayers);
      socket.off("playerStats", onStats);
    };
  }, [isConnected, characterId]);

  // Chat events
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !isConnected) return;

    const onChat = (msg: { name: string; text: string }) => {
      setChatMessages((prev) => [...prev.slice(-99), { ...msg, color: "#ffffff" }]);
    };

    socket.off("chat");
    socket.on("chat", onChat);

    return () => {
      socket.off("chat", onChat);
    };
  }, [isConnected]);

  function handleSendChat(text: string) {
    const socket = socketRef.current;
    if (!socket || !isConnected) return;
    const name = characterData.name;
    socket.emit("chat", { name, text });
    setChatMessages((prev) => [...prev.slice(-99), { name, text, color: "#ffff00" }]);
  }

  function handleExit() {
    resetSocket();
    onExit();
  }

  const openBag = () => {
    if (!openWindows.some(w => w.id === 'bag1')) {
      setOpenWindows(prev => [...prev, {
        id: 'bag1',
        title: 'Backpack',
        type: 'inventory',
        x: 20,
        y: 50,
        width: 160,
        height: 200
      }]);
    }
  };

  const closeWindow = (id: string) => {
    setOpenWindows(prev => prev.filter(w => w.id !== id));
  };

  if (!socketRef.current || !isConnected) {
    return (
      <div style={{
        background: "#1a1c1e",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffeab6",
        fontSize: "18px"
      }}>
        {"Ansluter till server..."}
      </div>
    );
  }

  if (!characterData) {
    return (
      <div style={{
        background: "#1a1c1e",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffeab6",
        fontSize: "18px"
      }}>
        Laddar speldata...
      </div>
    );
  }

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      minWidth: "800px",
      minHeight: "600px",
      backgroundColor: "#1a1a1a",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      fontFamily: "Arial, sans-serif",
      fontSize: "11px",
      position: "relative"
    }}>
      {/* Statusraden överst */}
      <StatusBar
        onOpenBag={openBag}
        onExit={handleExit}
        hp={characterData.health}
        hpMax={characterData.healthmax}
        mana={characterData.mana}
        manaMax={characterData.manamax}
        gold={gold} // Skickar med mock-data eller verklig data
        capacity={capacity} // Skickar med mock-data eller verklig data
        capacityMax={capacityMax} // Skickar med mock-data eller verklig data
      />

      {/* Huvudspelytan */}
      <div style={{
        flex: 1,
        display: "flex",
        minHeight: 0,
        position: "relative"
      }}>
        {/* Vänster sidopanel */}
        <SidebarLeft />

        {/* Spelcanvas och relaterade element */}
        <div style={{
          flex: 1,
          backgroundColor: "#000000",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          minWidth: "480px",
          overflow: "hidden"
        }}>
          {/* Spelvärldens canvas */}
          <div style={{
            width: "480px",
            height: "352px",
            backgroundColor: "#1a4a1a",
            border: "2px solid #404040",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#cccccc",
            fontSize: "14px",
            position: "relative",
            overflow: "hidden"
          }}>
            <GameCanvas
              characterId={characterId}
              characterName={characterData.name}
              socket={socketRef.current}
            />
          </div>

          {/* Action Bar */}
          <ActionBar />
        </div>

        {/* Höger sidopanel */}
        <SidebarRight />

        {/* PlayerInfoPanel – nu positionerad till höger, ovanpå SidebarRight */}
        {characterData && ( // Rendera bara om characterData finns
          <div style={{
            position: "absolute",
            top: "8px", // Justera positionen för att matcha Tibia-mockupen
            right: "8px", // Placeras till höger
            zIndex: 999
          }}>
            <PlayerInfoPanel
              name={characterData.name}
              level={characterData.level}
              hp={characterData.health}
              hpMax={characterData.healthmax}
              mana={characterData.mana}
              manaMax={characterData.manamax}
            />
          </div>
        )}

        {/* Flytande fönster */}
        {openWindows.map(window => {
          if (window.type === 'inventory') {
            return (
              <InventoryWindow
                key={window.id}
                id={window.id}
                initialX={window.x}
                initialY={window.y}
                width={window.width}
                height={window.height}
                onClose={closeWindow}
              />
            );
          }
          return null;
        })}
      </div>

      {/* Chattfönster längst ner */}
      <div style={{
        height: "120px",
        backgroundColor: "#252525",
        borderTop: "1px solid #404040",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        width: "100%",
        boxSizing: "border-box"
      }}>
        <ChatWindow
          messages={chatMessages}
          onSend={handleSendChat}
        />
      </div>
    </div>
  );
};

export default GamePage;
