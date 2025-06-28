import { useEffect, useState } from "react";
import GameCanvas from "../components/GameCanvas";
import PlayerInfoPanel from "../components/PlayerInfoPanel";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:7172";

const GamePage = () => {
  const params = new URLSearchParams(window.location.search);
  const urlCharacterId = Number(params.get("characterId"));
  const localCharacterId = Number(localStorage.getItem("characterId") || 0);
  const characterId = urlCharacterId || localCharacterId;

  const [characterData, setCharacterData] = useState<any>(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, { auth: { characterId } });

    // DEBUG
    (window as any).socket = socket;
    
    // När du får alla spelare (vid anslutning):
    socket.on("currentPlayers", (players) => {
      const me = players.find((p: any) => p.id === characterId);
      if (me) setCharacterData(me);
    });

    // Lyssna på live stat-uppdateringar:
    socket.on("playerStats", (stats) => {
      setCharacterData(stats);
    });

    return () => socket.disconnect();
  }, [characterId]);

  if (!characterId || !characterData) {
    return <div>Laddar spelare...</div>;
  }

  return (
    <div style={{ background: "#1a1c1e", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1 style={{ color: "#fff", margin: "2rem 0 1rem" }}>Swev Online</h1>
      <PlayerInfoPanel
        name={characterData.name}
        level={characterData.level}
        hp={characterData.health}
        hpMax={characterData.healthmax}
        mana={characterData.mana}
        manaMax={characterData.manamax}
      />
      <GameCanvas characterId={characterId} characterName={characterData.name} />
    </div>
  );
};

export default GamePage;
