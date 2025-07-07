import { useEffect, useState } from "react";
import GameCanvas from "../components/GameCanvas";
import PlayerInfoPanel from "../components/PlayerInfoPanel";
import { io } from "socket.io-client";
import type { User, Character } from "../types";

const SOCKET_URL = "http://localhost:7172";

type GamePageProps = {
  user: User;
  character: Character;
  onExit: () => void;
};

const GamePage = ({ user, character, onExit }: GamePageProps) => {
  const characterId = character.id;
  const [characterData, setCharacterData] = useState<any>(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, { auth: { characterId } });
    (window as any).socket = socket;

    socket.on("currentPlayers", (players) => {
      const me = players.find((p: any) => p.id === characterId);
      if (me) setCharacterData(me);
    });
    socket.on("playerStats", (stats) => setCharacterData(stats));
    return () => socket.disconnect();
  }, [characterId]);

  if (!characterData) {
    return <div>Laddar spelare...</div>;
  }

  return (
    <div style={{
      background: "#1a1c1e",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      <h1 style={{ color: "#fff", margin: "2rem 0 1rem" }}>Swev Online</h1>
      {/* Exit/Logout knapp */}
      <button
        style={{
          position: "absolute",
          top: 16,
          right: 32,
          zIndex: 1000,
          fontSize: 18,
          padding: "8px 24px",
          borderRadius: 9,
          border: "2px solid #e2ce8a",
          background: "#33281d",
          color: "#ffeab6",
          fontWeight: 700,
          cursor: "pointer"
        }}
        onClick={onExit}
      >
        Exit
      </button>
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
