import { useState } from "react";
import LauncherPage from "./pages/LauncherPage";
import LandingPage from "./pages/LandingPage";
import GamePage from "./pages/GamePage";

export default function App() {
  const [stage, setStage] = useState<"launcher" | "login" | "game">("launcher");
  const [user, setUser] = useState(null);

  if (stage === "launcher") {
    return <LauncherPage onReady={() => setStage("login")} />;
  }
  if (stage === "login") {
    return <LandingPage onLogin={(userObj) => { setUser(userObj); setStage("game"); }} />;
  }
  if (stage === "game") {
    return <GamePage user={user} />;
  }
  return null;
}
