// src/components/StatusBar.tsx
import React from 'react';

// Definierar props för StatusBar-komponenten
type StatusBarProps = {
  hp: number;            // Aktuell HP
  hpMax: number;         // Maximal HP
  mana: number;          // Aktuell Mana
  manaMax: number;       // Maximal Mana
  xp: number;            // Aktuell XP
  xpNextLevel: number;   // XP som krävs för nästa nivå
  level: number;         // Aktuell nivå
  hasXpBoost: boolean;   // Indikerar om XP-boost är aktiv
};

const StatusBar: React.FC<StatusBarProps> = ({
  hp,
  hpMax,
  mana,
  manaMax,
  xp,
  xpNextLevel,
  level,
  hasXpBoost,
}) => {
  // Beräkna procentandelar för staplarna
  const hpPercentage = (hp / hpMax) * 100;
  const manaPercentage = (mana / manaMax) * 100;
  const xpPercentage = (xp / xpNextLevel) * 100;

  return (
    <div style={{
      height: "48px", // Högre höjd för att rymma två rader
      backgroundColor: "#2d2d2d",
      borderBottom: "1px solid #404040",
      display: "flex",
      flexDirection: "column", // Staplarna ligger under varandra
      alignItems: "center",
      justifyContent: "center",
      padding: "4px 8px", // Padding för att ge utrymme
      color: "#cccccc",
      zIndex: 999,
      flexShrink: 0,
      width: "100%",
      boxSizing: "border-box",
      fontFamily: "Arial, sans-serif", // Specifik font för att matcha Tibia
      fontSize: "10px",
      position: "relative", // För absolut positionering av XP Boost
    }}>
      {/* Övre raden: HP och Mana staplar */}
      <div style={{
        display: "flex",
        width: "100%", // Fyller hela bredden
        justifyContent: "center", // Centrerar staplarna
        gap: "4px", // Mellanrum mellan HP och Mana
        marginBottom: "4px", // Mellanrum till XP-stapeln
      }}>
        {/* HP Stapel */}
        <div style={{
          flex: 1, // Tar upp lika mycket utrymme
          maxWidth: "200px", // Maxbredd för att inte bli för bred
          height: "18px", // Högre stapel
          backgroundColor: "#1a1a1a",
          border: "1px solid #404040",
          borderRadius: "2px",
          overflow: "hidden",
          position: "relative",
        }}>
          <div style={{
            width: `${hpPercentage}%`,
            backgroundColor: "#00cc00", // Grön för HP
            height: "100%",
            transition: "width 0.3s ease-in-out",
          }}></div>
          <span style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#ffffff", // Vit text för siffrorna
            fontWeight: "bold",
            fontSize: "10px",
            textShadow: "1px 1px 2px rgba(0,0,0,0.7)", // Skugga för läsbarhet
          }}>
            {hp}/{hpMax}
          </span>
        </div>

        {/* Mana Stapel */}
        <div style={{
          flex: 1,
          maxWidth: "200px",
          height: "18px",
          backgroundColor: "#1a1a1a",
          border: "1px solid #404040",
          borderRadius: "2px",
          overflow: "hidden",
          position: "relative",
        }}>
          <div style={{
            width: `${manaPercentage}%`,
            backgroundColor: "#0077ff", // Blå för Mana
            height: "100%",
            transition: "width 0.3s ease-in-out",
          }}></div>
          <span style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#ffffff",
            fontWeight: "bold",
            fontSize: "10px",
            textShadow: "1px 1px 2px rgba(0,0,0,0.7)",
          }}>
            {mana}/{manaMax}
          </span>
        </div>
      </div>

      {/* Undre raden: XP Stapel */}
      <div style={{
        width: "calc(100% - 16px)", // Nästan full bredd, med padding
        maxWidth: "408px", // Matchar bredden på de övre staplarna kombinerat med gap
        height: "10px", // Smalare stapel
        backgroundColor: "#1a1a1a",
        border: "1px solid #404040",
        borderRadius: "2px",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        alignItems: "center", // Centrerar innehållet vertikalt
      }}>
        <div style={{
          width: `${xpPercentage}%`,
          backgroundColor: "#ff0000", // Röd för XP
          height: "100%",
          transition: "width 0.3s ease-in-out",
        }}></div>
        <span style={{
          position: "absolute",
          left: "4px", // Positionerar nivåtexten
          color: "#cccccc",
          fontSize: "8px", // Mindre font för nivå
          fontWeight: "bold",
          textShadow: "1px 1px 2px rgba(0,0,0,0.7)",
        }}>
          {level}
        </span>
        {hasXpBoost && (
          <div style={{
            position: "absolute",
            right: "4px", // Positionerar XP Boost
            backgroundColor: "#ffaa00", // Gul/orange bakgrund
            color: "#333333", // Mörk text
            padding: "0px 3px",
            borderRadius: "2px",
            fontSize: "7px", // Mycket liten font
            fontWeight: "bold",
            textTransform: "uppercase",
            border: "1px solid #cc8800",
          }}>
            XP Boost
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusBar;
