// src/pages/GamePage.tsx
import { useEffect, useRef, useState } from "react";
import GameCanvas from "../components/GameCanvas";
import type { User, Character } from "../types";
import { createSocket, resetSocket } from "../socket";

import ChatWindow from "../components/ChatWindow";
import SidebarLeft from "../components/SidebarLeft";
import SidebarRight from "../components/SidebarRight";
import StatusBar from "../components/StatusBar";
import ActionBar from "../components/ActionBar";
import FloatingWindow from "../components/FloatingWindow"; // Fortfarande för andra flytande fönster om de behövs
import InventoryWindow from "../components/InventoryWindow"; // Nu bara innehållet, inte en FloatingWindow
import SettingsWindow from '../components/SettingsWindow'; // Nu en fristående flytande komponent

// Definierar typen för ett öppet fönster (nu bara för flytande fönster som INTE är InventoryWindow eller SettingsWindow)
interface OpenWindow {
  id: string;
  title: string;
  type: 'other'; // 'inventory' och 'settings' hanteras separat nu
  x: number;
  y: number;
  width: number;
  height: number;
}

// Definierar typen för ett dockat fönster
interface DockedWindow {
  id: string;
  type: 'inventory'; // Endast 'inventory' för nuvarande dockningslogik
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

  // States för dockade och flytande fönster
  const [dockedRightWindow, setDockedRightWindow] = useState<DockedWindow | null>(null);
  const [dockedLeftWindow, setDockedLeftWindow] = useState<DockedWindow | null>(null);
  const [floatingWindows, setFloatingWindows] = useState<
    Array<{ id: string; title: string; type: 'settings' | 'other' | 'inventory'; x: number; y: number; width: number; height: number; }>
  >([]); // Använder en mer specifik typ för flytande fönster

  // Mock data för XP och XP Boost (ersätt med verklig data från servern)
  const [xp, setXp] = useState(15000);
  const [xpNextLevel, setXpNextLevel] = useState(20000);
  const [hasXpBoost, setHasXpBoost] = useState(true);

  // Mock data för guld och kapacitet (behövs fortfarande för StatusBar)
  // Dessa finns inte i din senaste GamePage, så jag lägger till dem igen för StatusBar
  const [gold, setGold] = useState(12345);
  const [capacity, setCapacity] = useState(350);
  const capacityMax = 1000;
  const [soul, setSoul] = useState(200); // Lade till soul igen då den kan användas i StatusBar eller PlayerInfoPanel

  // Ref för chattinmatningsfältet
  const chatInputRef = useRef<HTMLInputElement>(null);
  // State för att indikera om chattfältet är fokuserat
  const [isChatInputFocused, setIsChatInputFocused] = useState(false);

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
    const onStats = (stats: any) => {
      setCharacterData(stats);
      if (stats.xp !== undefined) setXp(stats.xp);
      if (stats.xpNextLevel !== undefined) setXpNextLevel(stats.xpNextLevel);
      if (stats.hasXpBoost !== undefined) setHasXpBoost(stats.hasXpBoost);
      // Uppdatera mock data för guld och kapacitet med verklig data om tillgänglig
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

  // Funktion för att öppna ryggsäcken och försöka docka den
  const openBag = () => {
    const bagId = 'bag1';
    // Kontrollera om ryggsäcken redan är öppen/dockad/flytande
    if (dockedRightWindow?.id === bagId || dockedLeftWindow?.id === bagId || floatingWindows.some(w => w.id === bagId)) {
      console.log('Bag is already open/docked.');
      return;
    }

    // Försök docka i höger sidopanel först
    if (!dockedRightWindow) {
      setDockedRightWindow({ id: bagId, type: 'inventory' });
      console.log('Bag docked in right sidebar.');
    }
    // Om höger är upptagen, försök docka i vänster sidopanel
    else if (!dockedLeftWindow) {
      setDockedLeftWindow({ id: bagId, type: 'inventory' });
      console.log('Bag docked in left sidebar.');
    }
    // Om båda är upptagna, öppna den som ett flytande fönster
    else {
      setFloatingWindows(prev => [...prev, {
        id: bagId,
        title: 'Backpack (Floating)',
        type: 'inventory',
        x: 200, // Standardposition om den är flytande
        y: 100,
        width: 180,
        height: 250
      }]);
      console.log('Bag opened as floating window (sidebars full).');
    }
  };

  // Funktion för att stänga ett fönster (både dockade och flytande)
  const closeWindow = (idToClose: string) => {
    // Kontrollera dockade fönster
    if (dockedRightWindow?.id === idToClose) {
      setDockedRightWindow(null);
      console.log(`Window ${idToClose} undocked from right sidebar.`);
      return;
    }
    if (dockedLeftWindow?.id === idToClose) {
      setDockedLeftWindow(null);
      console.log(`Window ${idToClose} undocked from left sidebar.`);
      return;
    }
    // Kontrollera flytande fönster
    setFloatingWindows(prev => prev.filter(w => w.id !== idToClose));
    console.log(`Floating window ${idToClose} closed.`);
  };

  // Funktion för att öppna inställningsfönster (fortsätter vara flytande)
  const openSettings = () => {
    const settingsId = 'settings';
    if (!floatingWindows.some(w => w.id === settingsId)) {
      setFloatingWindows(prev => [...prev, {
        id: settingsId,
        title: 'Settings',
        type: 'settings',
        x: 400,
        y: 250,
        width: 685, // Använder fast storlek från SettingsWindow
        height: 530  // Använder fast storlek från SettingsWindow
      }]);
    }
  };

  // Hanterare för fokus/blur på chattinmatningen
  const handleChatInputFocus = () => {
    setIsChatInputFocused(true);
    console.log("Chat input focused. Inform Phaser to disable game input.");
  };

  const handleChatInputBlur = () => {
    setIsChatInputFocused(false);
    console.log("Chat input blurred. Inform Phaser to enable game input.");
  };

  // Rendera innehållet för dockade fönster
  const renderDockedWindowContent = (dockedWin: DockedWindow | null) => {
    if (!dockedWin) return null;

    switch (dockedWin.type) {
      case 'inventory':
        return <InventoryWindow id={dockedWin.id} onClose={closeWindow} />;
      default:
        return null;
    }
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

      {/* Huvudspelytan */}
      <div style={{
        flex: 1,
        display: "flex",
        minHeight: 0,
        position: "relative"
      }}>
        {/* Vänster sidopanel */}
        <SidebarLeft dockedWindowContent={renderDockedWindowContent(dockedLeftWindow)} />

        {/* Spelcanvas och relaterade element */}
        <div style={{
          flex: 1,
          backgroundColor: "#000000",
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // Centrerar horisontellt
          justifyContent: "center", // Centrerar vertikalt
          position: "relative",
          minWidth: "480px",
          overflow: "hidden"
        }}>
          {/* Spelvärldens canvas container */}
          <div style={{
            width: "480px", // Fast bredd för spelvärlden
            height: "352px", // Fast höjd för spelvärlden
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
              isChatInputFocused={isChatInputFocused} // Skickar isChatInputFocused till GameCanvas
            />
          </div>

          {/* PlayerInfoPanel – nu positionerad till höger, ovanpå SidebarRight */}
          {characterData && ( // Rendera bara om characterData finns
            <div style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              zIndex: 999
            }}>
            </div>
          )}

          {/* Action Bar */}
          <ActionBar />
        </div>

        {/* Höger sidopanel */}
        <SidebarRight
          hp={characterData.health}
          hpMax={characterData.healthmax}
          mana={characterData.mana}
          manaMax={characterData.manamax}
          onOpenBag={openBag}
          onOpenSettings={openSettings}
          onExit={handleExit}
          dockedWindowContent={renderDockedWindowContent(dockedRightWindow)} // Skicka dockat fönster
        />

        {/* Flytande fönster */}
        {floatingWindows.map(window => {
          // SettingsWindow hanterar sin egen flytande logik
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
          // Om InventoryWindow öppnas som flytande (när sidebars är fulla)
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
          inputRef={chatInputRef}
          onFocus={handleChatInputFocus}
          onBlur={handleChatInputBlur}
        />
      </div>
    </div>
  );
};

export default GamePage;
