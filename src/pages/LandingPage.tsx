import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginBox from "../components/LoginBox";
import RegisterBox from "../components/RegisterBox";

export default function LandingPage({ onLogin }: { onLogin: (user: any) => void }) {
  const [menu, setMenu] = useState<"login" | "register" | null>(null);

  // Close all modals
  const closeAll = () => setMenu(null);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: `url('/assets/landing-bg.jpg') no-repeat center/cover`,
        fontFamily: "'Uncial Antiqua', serif",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* LOGO */}
      <img
        src="/assets/logo.png"
        alt="Swev Online"
        style={{
          position: "absolute",
          top: 36,
          left: 36,
          width: 180,
          filter: "drop-shadow(0 0 16px #000)"
        }}
      />

      {/* MENU bottom left */}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          left: 32,
          background: "rgba(36, 29, 11, 0.96)",
          borderRadius: 14,
          border: "2.6px solid #e6cc7b",
          boxShadow: "0 8px 36px #000c, 0 0 0 2.5px #88622c80",
          padding: "18px 13px",
          minWidth: 150,
          display: "flex",
          flexDirection: "column",
          gap: 13,
          alignItems: "center"
        }}
      >
        <button
          onClick={() => setMenu("login")}
          style={{
            fontFamily: "'Uncial Antiqua', serif",
            fontSize: 17,
            background: "linear-gradient(180deg, #d3b47c 0%, #ab7d29 95%)",
            color: "#3a2106",
            border: "1.7px solid #e2ce8a",
            borderRadius: 9,
            fontWeight: 600,
            padding: "8px 0",
            width: "150px",
            boxShadow: "0 2px 12px #0007, 0 0 2px #ffd96b88",
            marginBottom: 2,
            letterSpacing: 0.5,
            cursor: "pointer",
            transition: "all 0.12s"
          }}
          onMouseDown={e => (e.currentTarget.style.transform = "scale(0.97)")}
          onMouseUp={e => (e.currentTarget.style.transform = "")}
          onMouseLeave={e => (e.currentTarget.style.transform = "")}
        >
          Log In
        </button>
        <button
          onClick={() => setMenu("register")}
          style={{
            fontFamily: "'Uncial Antiqua', serif",
            fontSize: 16,
            background: "linear-gradient(180deg, #cdb193 0%, #81632b 100%)",
            color: "#251800",
            border: "1.7px solid #e2ce8a",
            borderRadius: 9,
            fontWeight: 600,
            padding: "8px 0",
            width: "150px",
            boxShadow: "0 2px 12px #0007, 0 0 2px #ffd96b88",
            marginBottom: 2,
            letterSpacing: 0.4,
            cursor: "pointer",
            transition: "all 0.12s"
          }}
          onMouseDown={e => (e.currentTarget.style.transform = "scale(0.97)")}
          onMouseUp={e => (e.currentTarget.style.transform = "")}
          onMouseLeave={e => (e.currentTarget.style.transform = "")}
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
            padding: "8px 0",
            width: "150px",
            cursor: "not-allowed"
          }}
        >
          Forgot password?
        </button>
      </div>

      {/* Modal box center + blur */}
      <AnimatePresence>
        {menu && (
          <>
            {/* BLUR BACKDROP */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={closeAll}
              style={{
                position: "fixed",
                left: 0, top: 0, right: 0, bottom: 0,
                zIndex: 99,
                backdropFilter: "blur(10px)",
                background: "rgba(22,22,32,0.45)"
              }}
            />
            <motion.div
              key={menu}
              initial={{ opacity: 0, scale: 0.97, y: 32 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 32 }}
              transition={{ type: "spring", bounce: 0.13, duration: 0.36 }}
              style={{
                position: "fixed",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 100,
                background: "linear-gradient(120deg, #1e232a 80%, #2d2319 100%)",
                borderRadius: 20,
                minWidth: 340,
                maxWidth: "90vw",
                padding: "38px 28px 30px",
                boxShadow: "0 8px 48px #000b, 0 0 0 3px #c5a96744",
                border: "1.5px solid #b59c6c88"
              }}
            >
              {menu === "login" && <LoginBox onLogin={onLogin} onClose={closeAll} />}
              {menu === "register" && <RegisterBox onRegister={() => setMenu("login")} onClose={closeAll} />}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
