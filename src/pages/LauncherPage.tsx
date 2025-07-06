import { useEffect, useState } from "react";

// Fullscreen launcher with matching button style (ENGLISH)
export default function LauncherPage({ onReady }: { onReady: () => void }) {
  const [status, setStatus] = useState("Searching for updates...");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Simulate patch check
    setTimeout(() => {
      setStatus("You have the latest version!");
      setReady(true);
    }, 1500);
  }, []);

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      background: "url('/assets/launcher-bg.png') no-repeat center/cover",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Uncial Antiqua', serif"
    }}>
      <img src="/assets/logo.png" alt="SWEV Logo" style={{ width: 180, marginBottom: 32, filter: "drop-shadow(0 0 14px #000)" }} />
      <div style={{
        color: "#ffeab6",
        fontSize: 24,
        marginBottom: 28,
        textShadow: "0 2px 8px #000a, 0 0 2px #ffd96b55",
        fontFamily: "'Uncial Antiqua', serif"
      }}>
        {status}
      </div>
      <button
        style={{
          fontFamily: "'Uncial Antiqua', serif",
          fontSize: 20,
          background: "linear-gradient(180deg, #d3b47c 0%, #ab7d29 95%)",
          color: "#3a2106",
          border: "2.2px solid #e2ce8a",
          borderRadius: 11,
          fontWeight: 600,
          padding: "12px 38px",
          boxShadow: "0 2px 12px #0008, 0 0 2px #ffd96b99",
          marginBottom: 2,
          letterSpacing: 0.5,
          cursor: ready ? "pointer" : "not-allowed",
          opacity: ready ? 1 : 0.68,
          transition: "all 0.13s"
        }}
        disabled={!ready}
        onClick={onReady}
        onMouseDown={e => (e.currentTarget.style.transform = "scale(0.97)")}
        onMouseUp={e => (e.currentTarget.style.transform = "")}
        onMouseLeave={e => (e.currentTarget.style.transform = "")}
      >
        Continue
      </button>
    </div>
  );
}
