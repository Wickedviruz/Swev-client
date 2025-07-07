import { useState } from "react";

type LoginBoxProps = {
  onLogin: (params: { username: string; password: string }) => void;
  onClose: () => void;
};

export default function LoginBox({ onLogin, onClose }: LoginBoxProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      onLogin({ username, password });
    } else {
      setErr("Enter both username and password");
    }
  };

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
      gap: 12,
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Uncial Antiqua', serif"
    }}>
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

      <form onSubmit={handleLogin} style={{ width: "100%" }}>
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
            boxSizing: "border-box",
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
            boxSizing: "border-box",
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
            background: "linear-gradient(180deg, #d3b47c 0%, #ab7d29 95%)",
            border: "1.7px solid #e2ce8a",
            borderRadius: 9,
            fontWeight: 600,
            fontSize: 18,
            fontFamily: "'Uncial Antiqua', serif",
            color: "#3a2106",
            boxShadow: "0 2px 12px #0007, 0 0 2px #ffd96b88",
            marginBottom: 6,
            letterSpacing: 0.5,
            cursor: "pointer",
            padding: "12px 0",
            transition: "all 0.12s"
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
