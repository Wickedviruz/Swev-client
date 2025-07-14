// src/components/TopMenuBar.tsx
import React from 'react';

// Definierar props för TopMenuBar-komponenten
type TopMenuBarProps = {
  onOpenBag: () => void; // Funktion för att öppna ryggsäcken
  onExit: () => void;    // Funktion för att avsluta spelet
};

const TopMenuBar: React.FC<TopMenuBarProps> = ({ onOpenBag, onExit }) => {
  return (
    <div style={{
      height: "24px",
      backgroundColor: "#2d2d2d",
      borderBottom: "1px solid #404040",
      display: "flex",
      alignItems: "center",
      paddingLeft: "8px",
      color: "#cccccc",
      zIndex: 999,
      flexShrink: 0, // Förhindrar att menyn krymper
      width: "100%", // Säkerställer att menyn sträcker sig över hela bredden
      boxSizing: "border-box" // Inkluderar padding och border i bredden
    }}>
      <span>Game Menu</span>
      <button
        onClick={onOpenBag}
        style={{
          marginLeft: "20px",
          backgroundColor: "#404040",
          color: "#cccccc",
          border: "1px solid #606060",
          padding: "2px 8px",
          fontSize: "10px",
          cursor: "pointer",
          borderRadius: "3px" // Lägger till lite rundade hörn
        }}
      >
        Open Bag
      </button>
      <button
        onClick={onExit} // Använder onExit-funktionen
        style={{
          marginLeft: "auto", // Skjuter knappen till höger
          marginRight: "8px",
          backgroundColor: "#404040",
          color: "#cccccc",
          border: "1px solid #606060",
          padding: "2px 8px",
          fontSize: "10px",
          cursor: "pointer",
          borderRadius: "3px" // Lägger till lite rundade hörn
        }}
      >
        Exit
      </button>
    </div>
  );
};

export default TopMenuBar;
