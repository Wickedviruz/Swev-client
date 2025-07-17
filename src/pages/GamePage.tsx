// src/pages/GamePage.tsx

import { useEffect, useRef, useState } from "react";
import GameCanvas from "../components/GameCanvas";
import type { User, Character } from "../types";
import { createSocket, resetSocket } from "../socket";

import ChatWindow from "../components/gameUI/ChatWindow";
import SidebarLeft from "../components/gameUI/SidebarLeft";
import SidebarRight from "../components/gameUI/SidebarRight";
import StatusBar from "../components/gameUI/StatusBar";
import ActionBar from "../components/gameUI/ActionBar";
import FloatingWindow from "../components/FloatingWindow"; 
import InventoryWindow from "../components/gameUI/InventoryWindow"; 
import SettingsWindow from '../components/SettingsWindow'; 

interface OpenWindow {
  id: string;
  type: 'inventory' | 'settings' | 'other';
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DockedWindow {
  id: string;
  type: 'inventory' | 'settings' | 'other';
  title: string;
}

type GamePageProps = {
  user: User;
  character: Character; 
  onExit: () => void; // Funktion för att återvända till landing page
};

const GamePage = ({ user, character, onExit }: GamePageProps) => {
  const initialCharacterId = character.id; 
  const socketRef = useRef<any>(null);
  const [characterData, setCharacterData] = useState<Character | null>(null); 
  const [chatMessages, setChatMessages] = useState<{ name: string; text: string; color?: string }[]>([]);
  const [isConnected, setIsConnected] = useState(false); // Socket anslutningsstatus

  // States för UI-element (oförändrade)
  const [dockedLeftWindow, setDockedLeftWindow] = useState<DockedWindow | null>(null);
  const [dockedRightWindow, setDockedRightWindow] = useState<DockedWindow | null>(null);
  const [floatingWindows, setFloatingWindows] = useState<OpenWindow[]>([]);

  // Mock data för statusfältet (oförändrade)
  const [xp, setXp] = useState(0);
  const [xpNextLevel, setXpNextLevel] = useState(100);
  const [hasXpBoost, setHasXpBoost] = useState(false);
  const [gold, setGold] = useState(0);
  const [capacity, setCapacity] = useState(0);
  const [capacityMax, setCapacityMax] = useState(100); 
  const [soul, setSoul] = useState(0); 

  // Chatt input focus state (oförändrade)
  const [isChatInputFocused, setIsChatInputFocused] = useState(false);
  const chatInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    socketRef.current = createSocket(initialCharacterId);

    const socket = socketRef.current;
    const handleConnect = () => {
      console.log('[GamePage] Socket connected');
      setIsConnected(true);
      setChatMessages(prev => [...prev, { name: "System", text: "Welcome to the game!", color: "#00ff00" }]);
      
      socket.emit("requestCurrentPlayers"); 
      console.log("[GamePage] Sent 'requestCurrentPlayers' to server.");
    };
    
    const handleDisconnect = () => {
      console.log('[GamePage] Socket disconnected');
      setIsConnected(false);
      setChatMessages(prev => [...prev, { name: "System", text: "Disconnected from server.", color: "#ff0000" }]);
    };
    
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    if (socket.connected) {
      setIsConnected(true);
      socket.emit("requestCurrentPlayers"); 
      console.log("[GamePage] Socket already connected on mount. Sent 'requestCurrentPlayers'.");
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      resetSocket();
    };
  }, [initialCharacterId]);

  // Player events (oförändrade, förutom characterData null check)
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !isConnected) return;

    const onPlayers = (players: Character[]) => {
      console.log("[GamePage] FICK currentPlayers från servern!", players);
      const me = players.find((p: Character) => p.id === initialCharacterId);
      if (me) {
        setCharacterData(me); 
        console.log("[GamePage] characterData set:", me); 
      } else {
        console.warn(`[GamePage] My character (ID: ${initialCharacterId}) not found in currentPlayers list.`);
      }
    };
    const onStats = (stats: any) => { 
      setCharacterData((prev: Character | null) => {
        if (prev) {
          return { ...prev, ...stats };
        }
        return prev;
      });
      if (stats.xp !== undefined) setXp(stats.xp);
      if (stats.xpNextLevel !== undefined) setXpNextLevel(stats.xpNextLevel);
      if (stats.hasXpBoost !== undefined) setHasXpBoost(stats.hasXpBoost);
      if (stats.gold !== undefined) setGold(stats.gold);
      if (stats.capacity !== undefined) setCapacity(stats.capacity);
      if (stats.soul !== undefined) setSoul(stats.soul);
    };

    socket.off("currentPlayers");
    socket.off("playerStats");

    socket.on("currentPlayers", onPlayers);
    socket.on("playerStats", onStats);

    return () => {
      socket.off("currentPlayers", onPlayers);
      socket.off("playerStats", onStats);
    };
  }, [isConnected, initialCharacterId]);

  // Chat events (oförändrade)
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !isConnected) return;

    const onChatMessage = (msg: { name: string; text: string; color?: string }) => {
      setChatMessages((prevMessages) => [...prevMessages, msg]);
      if (chatInputRef.current) {
        chatInputRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    };

    socket.off("chatMessage"); 
    socket.on("chatMessage", onChatMessage);

    return () => {
      socket.off("chatMessage", onChatMessage);
    };
  }, [isConnected]);

  // Övriga handlers (oförändrade)
  const handleSendChat = (message: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("chat", message);
      setChatMessages((prevMessages) => [...prevMessages, { name: character.name, text: message, color: "#ffffff" }]);
    }
  };

  const handleExit = () => {
    onExit();
  };

  const openBag = () => {
    const windowId = 'inventory-window';
    if (!floatingWindows.some(w => w.id === windowId)) {
      setFloatingWindows(prev => [...prev, {
        id: windowId,
        type: 'inventory',
        title: 'Inventory',
        x: 100, 
        y: 100,
        width: 300,
        height: 400
      }]);
    }
  };

  const openSettings = () => {
    const windowId = 'settings-window';
    if (!floatingWindows.some(w => w.id === windowId)) {
      setFloatingWindows(prev => [...prev, {
        id: windowId,
        type: 'settings',
        title: 'Settings',
        x: 200, 
        y: 150,
        width: 400,
        height: 300
      }]);
    }
  };

  const closeWindow = (id: string) => {
    setFloatingWindows(prev => prev.filter(w => w.id !== id));
  };

  const handleChatInputFocus = () => {
    setIsChatInputFocused(true);
  };

  const handleChatInputBlur = () => {
    setIsChatInputFocused(false);
  };

  const renderDockedWindowContent = (window: DockedWindow | null) => {
    if (!window) return null;
    switch (window.type) {
      case 'inventory':
        return <InventoryWindow id={window.id} onClose={() => {}} />; 
      default:
        return <div>{window.title} Content</div>;
    }
  };

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
      {/* StatusBar visas när characterData har laddats */}
      {characterData ? ( 
        <StatusBar
          hp={characterData.health}
          hpMax={characterData.healthmax}
          mana={characterData.mana}
          manaMax={characterData.manamax}
          xp={xp}
          xpNextLevel={xpNextLevel}
          level={characterData.level}
          hasXpBoost={hasXpBoost}
          gold={gold}
          capacity={capacity}
          capacityMax={capacityMax}
        />
      ) : (
        <div style={{ 
          height: "40px", 
          backgroundColor: "#333", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          color: "#eee",
          padding: "0 10px", 
          boxSizing: "border-box" 
        }}>
            Laddar statusdata...
        </div>
      )}

      {/* Huvudspelytan */}
      <div style={{
        flex: 1,
        display: "flex",
        minHeight: 0,
        position: "relative"
      }}>
        <SidebarLeft dockedWindowContent={renderDockedWindowContent(dockedLeftWindow)} />

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
            {/* Villkorlig rendering av GameCanvas:
                Renderas ENDAST när socketRef.current finns, characterData har laddats från servern OCH vi är anslutna */}
            {socketRef.current && characterData && isConnected ? ( 
                <GameCanvas
                  characterId={characterData.id} // Använd serverns ID
                  characterName={characterData.name} // Använd serverns namn
                  socket={socketRef.current}
                  isChatInputFocused={isChatInputFocused} 
                  mainCharacterData={characterData} // Skicka den kompletta serverdatan
                  isConnected={isConnected} // Skicka socketens anslutningsstatus
                />
            ) : (
              // Overlay som visar laddningsstatus och "Avsluta"-knapp
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.7)", 
                display: "flex",
                flexDirection: "column", // Ändra till kolumn för att stapla element
                alignItems: "center",
                justifyContent: "center",
                color: "#ffeab6", 
                fontSize: "18px",
                zIndex: 1000 
              }}>
                {`Laddar spel... ${!isConnected ? "(Ansluter till server)" : !characterData ? "(Hämtar karaktärsdata)" : ""}`}
                <button
                  onClick={handleExit} // Anropa onExit när knappen klickas
                  style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    backgroundColor: '#cc0000',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '16px',
                  }}
                >
                  Avsluta
                </button>
              </div>
            )}
          </div>

          {characterData && ( 
            <div style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              zIndex: 999
            }}>
              {/* Din PlayerInfoPanel kan placeras här */}
            </div>
          )}

          <ActionBar />
        </div>

        <SidebarRight
          hp={characterData?.health ?? 0} 
          hpMax={characterData?.healthmax ?? 100}
          mana={characterData?.mana ?? 0}
          manaMax={characterData?.manamax ?? 100}
          onOpenBag={openBag}
          onOpenSettings={openSettings}
          onExit={handleExit}
          dockedWindowContent={renderDockedWindowContent(dockedRightWindow)} 
        />

        {/* Flytande fönster (oförändrade) */}
        {floatingWindows.map(window => {
          if (window.type === 'settings') {
            return (
              <SettingsWindow
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
          else if (window.type === 'inventory') {
            return (
              <FloatingWindow
                key={window.id}
                id={window.id}
                title={window.title}
                initialX={window.x}
                initialY={window.y}
                width={window.width}
                height={window.height}
                onClose={closeWindow}
              >
                <InventoryWindow id={window.id} onClose={closeWindow} />
              </FloatingWindow>
            );
          }
          return null; 
        })}
      </div>

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
          inputRef={chatInputRef}
          onFocus={handleChatInputFocus}
          onBlur={handleChatInputBlur}
        />
      </div>
    </div>
  );
};

export default GamePage;