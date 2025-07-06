import { useState } from "react";

export default function LoginBox({
  onLogin,
  onClose
}: { onLogin: (user: any) => void, onClose: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      onLogin({ username });
    } else {
      setErr("Enter both username and password");
    }
  };

  return (
    <div style={{ width: 320, position: "relative" }}>  {/* Bara width och rel. */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 13,
          right: 14,
          background: "none",
          border: "none",
          color: "#ffeab6",
          fontSize: 24,
          fontWeight: 600,
          cursor: "pointer",
          padding: 0,
          lineHeight: 1,
          filter: "drop-shadow(0 1px 2px #000b)",
          fontFamily: "'Uncial Antiqua', serif"
        }}
        aria-label="Close"
        tabIndex={0}
      >×</button>

      <h3 style={{
        marginTop: 0,
        marginBottom: 20,
        color: "#ffeab6",
        textAlign: "center",
        fontFamily: "'Uncial Antiqua', serif",
        fontWeight: 500,
        letterSpacing: 0.2,
        fontSize: 26,
        textShadow: "0 2px 8px #000a, 0 0 2px #ffd96b55"
      }}>Log In</h3>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
          required
          style={{
            width: "100%",
            marginBottom: 10,
            fontSize: 16,
            padding: "10px 12px",
            borderRadius: 7,
            border: "1.2px solid #7e7157",
            background: "#222c",
            color: "#f5ddb0",
            fontFamily: "'Uncial Antiqua', serif",
            letterSpacing: 0.2,
            outline: "none"
          }}
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
          style={{
            width: "100%",
            marginBottom: 18,
            fontSize: 16,
            padding: "10px 12px",
            borderRadius: 7,
            border: "1.2px solid #7e7157",
            background: "#222c",
            color: "#f5ddb0",
            fontFamily: "'Uncial Antiqua', serif",
            letterSpacing: 0.2,
            outline: "none"
          }}
        />
        <button
          type="submit"
          style={{
            width: "100%",
            background: "linear-gradient(90deg, #44352e 0%, #916c3e 100%)",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 18,
            fontFamily: "'Uncial Antiqua', serif",
            color: "#ffeab6",
            border: "none",
            padding: "13px 0",
            marginBottom: 3,
            boxShadow: "0 2px 12px #4a2c0e30",
            transition: "all 0.13s",
            cursor: "pointer"
          }}
        >Log In</button>
        {err && <div style={{
          color: "#e66a2b",
          background: "#2a1919bb",
          marginTop: 10,
          borderRadius: 5,
          padding: "6px 0",
          textAlign: "center",
          fontWeight: 500,
          fontSize: 15
        }}>{err}</div>}
      </form>
    </div>
  );
}
