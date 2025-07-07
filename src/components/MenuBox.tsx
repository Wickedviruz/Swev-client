// src/components/MenuBox.jsx
export default function MenuBox({ onLogin, onRegister }) {
  return (
    <div style={{
      width: 320,
      position: "relative",
      background: "rgba(36, 29, 11, 0.96)",
      borderRadius: 20,
      border: "2.6px solid #e6cc7b",
      boxShadow: "0 8px 36px #000c, 0 0 0 2.5px #88622c80",
      padding: "38px 28px 30px",
      minWidth: 250,
      maxWidth: "90vw",
      display: "flex",
      flexDirection: "column",
      gap: 15,
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Uncial Antiqua', serif"
    }}>
      <button
        onClick={onLogin}
        style={{
          fontFamily: "'Uncial Antiqua', serif",
          fontSize: 17,
          background: "linear-gradient(180deg, #d3b47c 0%, #ab7d29 95%)",
          color: "#3a2106",
          border: "1.7px solid #e2ce8a",
          borderRadius: 9,
          fontWeight: 600,
          padding: "12px 0",
          width: "100%",
          boxShadow: "0 2px 12px #0007, 0 0 2px #ffd96b88",
          marginBottom: 6,
          letterSpacing: 0.5,
          cursor: "pointer",
          transition: "all 0.12s"
        }}
      >
        Log In
      </button>
      <button
        onClick={onRegister}
        style={{
          fontFamily: "'Uncial Antiqua', serif",
          fontSize: 16,
          background: "linear-gradient(180deg, #cdb193 0%, #81632b 100%)",
          color: "#251800",
          border: "1.7px solid #e2ce8a",
          borderRadius: 9,
          fontWeight: 600,
          padding: "12px 0",
          width: "100%",
          boxShadow: "0 2px 12px #0007, 0 0 2px #ffd96b88",
          marginBottom: 6,
          letterSpacing: 0.4,
          cursor: "pointer",
          transition: "all 0.12s"
        }}
      >
        Create Account
      </button>
      <button
        disabled
        style={{
          fontFamily: "'Uncial Antiqua', serif",
          fontSize: 15,
          background: "#333c",
          border: "1.4px solid #bda06d80",
          color: "#9ba3b7",
          borderRadius: 9,
          opacity: 0.7,
          padding: "12px 0",
          width: "100%",
          cursor: "not-allowed"
        }}
      >
        Forgot password?
      </button>
    </div>
  );
}
