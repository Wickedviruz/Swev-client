import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginBox from "../components/LoginBox";
import RegisterBox from "../components/RegisterBox";
import MenuBox from "../components/MenuBox";
import CharacterBox, { type Character } from "../components/CharacterBox";

type LandingPageProps = {
  onLogin: (params: { username: string; password: string }) => void;
  showCharacterBox?: boolean;
  characters?: Character[];
  onSelectChar?: (char: Character) => void;
  onLogout?: () => void;
};

export default function LandingPage({
  onLogin,
  showCharacterBox = false,
  characters = [],
  onSelectChar,
  onLogout,
}: LandingPageProps) {
  const [menu, setMenu] = useState<"menu" | "login" | "register">("menu");

  // Close all modals
  const closeAll = () => setMenu("menu");

  // --- Visa characterbox som overlay/modal ---
  if (showCharacterBox && onSelectChar && onLogout) {
    return (
      <div
        style={{
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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

        {/* BLUR BACKDROP */}
        <div
          style={{
            position: "fixed",
            left: 0, top: 0, right: 0, bottom: 0,
            zIndex: 99,
            backdropFilter: "blur(10px)",
            background: "rgba(22,22,32,0.45)"
          }}
        />
        {/* CharacterBox modal */}
        <div
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
            padding: "0",
            boxShadow: "0 8px 48px #000b, 0 0 0 3px #c5a96744",
            border: "1.5px solid #b59c6c88",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <CharacterBox
            characters={characters}
            onSelect={onSelectChar}
            onLogout={onLogout}
          />
        </div>
      </div>
    );
  }

  // --- Annars, visa vanliga modals ---
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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

      {/* Modal box center + blur */}
      <AnimatePresence mode="wait">
        {/* Blur/Backdrop */}
        {menu !== "menu" && (
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
        )}

        {/* BOXES: Menu, Login, Register */}
        <motion.div
          key={menu}
          initial={{ opacity: 0, scale: 0.97, y: 32 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 32 }}
          transition={{ type: "spring", bounce: 0.13, duration: 0.36 }}
          style={{
            zIndex: 100,
            background: "linear-gradient(120deg, #1e232a 80%, #2d2319 100%)",
            borderRadius: 20,
            minWidth: 340,
            maxWidth: "90vw",
            padding: "0", // All padding i box-komponenterna!
            boxShadow: "0 8px 48px #000b, 0 0 0 3px #c5a96744",
            border: "1.5px solid #b59c6c88",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {menu === "menu" && (
            <MenuBox
              onLogin={() => setMenu("login")}
              onRegister={() => setMenu("register")}
            />
          )}
          {menu === "login" && <LoginBox onLogin={onLogin} onClose={closeAll} />}
          {menu === "register" && <RegisterBox onRegister={() => setMenu("login")} onClose={closeAll} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
