// src/components/PlayerInfoPanel.tsx
import React from 'react';

// Definierar props för PlayerInfoPanel-komponenten
type PlayerInfoPanelProps = {
  name: string;
  level: number;
  hp: number;
  hpMax: number;
  mana: number;
  manaMax: number;
};

const PlayerInfoPanel: React.FC<PlayerInfoPanelProps> = ({
  name,
  level,
  hp,
  hpMax,
  mana,
  manaMax,
}) => {
  // Beräkna HP- och Mana-procent för staplarna
  const hpPercentage = (hp / hpMax) * 100;
  const manaPercentage = (mana / manaMax) * 100;

  return (
    <div style={{
      backgroundColor: "#252525", // Mörk bakgrund som matchar andra paneler
      border: "2px solid #404040", // Kant som matchar andra element
      borderRadius: "4px", // Rundade hörn
      padding: "8px",
      color: "#cccccc", // Ljus textfärg
      fontSize: "11px",
      width: "160px", // Fast bredd för panelen
      boxShadow: "0px 4px 8px rgba(0,0,0,0.5)", // Liten skugga för djup
      display: "flex",
      flexDirection: "column",
      gap: "4px" // Mellanrum mellan elementen
    }}>
      {/* Spelarens namn och nivå */}
      <div style={{
        fontWeight: "bold",
        fontSize: "12px",
        marginBottom: "4px",
        color: "#ffeab6" // Gulaktig färg för namn/nivå
      }}>
        {name} (Level {level})
      </div>

      {/* HP-sektion */}
      <div style={{ marginBottom: "4px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>HP:</span>
          <span>{hp}/{hpMax}</span>
        </div>
        <div style={{
          backgroundColor: "#1a1a1a", // Bakgrund för HP-stapeln
          border: "1px solid #404040",
          borderRadius: "2px",
          height: "8px",
          overflow: "hidden" // Döljer överflödig del av stapeln
        }}>
          <div style={{
            width: `${hpPercentage}%`, // Dynamisk bredd baserad på HP
            backgroundColor: "#00cc00", // Grön färg för HP
            height: "100%",
            transition: "width 0.3s ease-in-out" // Mjuk övergång vid ändring
          }}></div>
        </div>
      </div>

      {/* Mana-sektion */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Mana:</span>
          <span>{mana}/{manaMax}</span>
        </div>
        <div style={{
          backgroundColor: "#1a1a1a", // Bakgrund för Mana-stapeln
          border: "1px solid #404040",
          borderRadius: "2px",
          height: "8px",
          overflow: "hidden"
        }}>
          <div style={{
            width: `${manaPercentage}%`, // Dynamisk bredd baserad på Mana
            backgroundColor: "#0077ff", // Blå färg för Mana
            height: "100%",
            transition: "width 0.3s ease-in-out" // Mjuk övergång vid ändring
          }}></div>
        </div>
      </div>
    </div>
  );
};

export default PlayerInfoPanel;
