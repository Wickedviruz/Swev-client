import { useState } from "react";
import LauncherPage from "./pages/LauncherPage";
import LandingPage from "./pages/LandingPage";
import GamePage from "./pages/GamePage";
import { login as apiLogin } from "./api/auth";
import axios from "axios";
import type { User, Character } from "./types";

export default function App() {
  const [stage, setStage] = useState<"launcher" | "login" | "character" | "game">("launcher");
  const [user, setUser] = useState<User | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);

  async function fetchCharacters(accountId: number) {
    const res = await axios.get(`http://localhost:7172/api/character/${accountId}`);
    return res.data.characters as Character[];
  }

  async function handleLogin({ username, password }: { username: string; password: string }) {
    try {
      const result = await apiLogin(username, password);
      if (!result.success) throw new Error(result.error || "Login failed");
      setUser(result.user);
      const chars = await fetchCharacters(result.user.id);
      setCharacters(chars);
      setStage("character");
    } catch (err: any) {
      alert(err.message || "Login error");
    }
  }

  function handleSelectChar(char: Character) {
    setSelectedChar(char);
    setStage("game");
  }

  function handleLogout() {
    setUser(null);
    setCharacters([]);
    setSelectedChar(null);
    setStage("login");
  }

  function handleExitGame() {
    setSelectedChar(null);
    setStage("character");
  }

  if (stage === "launcher") {
    return <LauncherPage onReady={() => setStage("login")} />;
  }
  if (stage === "login" || stage === "character") {
    return (
      <LandingPage
        onLogin={({ username, password }) => handleLogin({ username, password })}
        showCharacterBox={stage === "character"}
        characters={characters}
        onSelectChar={handleSelectChar}
        onLogout={handleLogout}
      />
    );
  }
  if (stage === "game") {
    return <GamePage user={user!} character={selectedChar!} onExit={handleExitGame} />;
  }
  return null;
}
