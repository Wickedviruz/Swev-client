import GameCanvas from "../components/GameCanvas";

const GamePage = () => {
  const params = new URLSearchParams(window.location.search);
  const urlCharacterId = Number(params.get("characterId"));
  const localCharacterId = Number(localStorage.getItem("characterId") || 0);
  const characterId = urlCharacterId || localCharacterId;

  if (!characterId) {
    return (
      <div style={{ color: "red", textAlign: "center", marginTop: "3rem" }}>
        <h2>No character selected!</h2>
        <p>Please use the portal to select a character.</p>
      </div>
    );
  }

  return (
    <div style={{ background: "#1a1c1e", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1 style={{ color: "#fff", margin: "2rem 0 1rem" }}>Swev Online</h1>
      <GameCanvas characterId={characterId} />
    </div>
  );
};

export default GamePage;
