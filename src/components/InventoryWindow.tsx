// src/components/InventoryWindow.tsx
import React from 'react';
import FloatingWindow from './FloatingWindow'; // Importerar den generiska FloatingWindow-komponenten

// Definierar props för InventoryWindow-komponenten
type InventoryWindowProps = {
  id: string;        // Unikt ID för fönstret
  initialX: number;  // Initial X-position
  initialY: number;  // Initial Y-position
  width: number;     // Fönstrets bredd
  height: number;    // Fönstrets höjd
  onClose: (id: string) => void; // Funktion för att stänga fönstret
};

const InventoryWindow: React.FC<InventoryWindowProps> = ({
  id,
  initialX,
  initialY,
  width,
  height,
  onClose
}) => {
  return (
    <FloatingWindow
      id={id}
      title="Backpack" // Fast titel för ryggsäcksfönstret
      initialX={initialX}
      initialY={initialY}
      width={width}
      height={height}
      onClose={onClose}
    >
      {/* Innehållet i ryggsäcksfönstret (rutnät med platser) */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)", // 4 kolumner med lika bredd
        gap: "2px", // Mellanrum mellan rutorna
        height: "100%", // Fyller tillgänglig höjd
        overflow: "auto" // Aktiverar scroll om det finns många föremål
      }}>
        {/* Skapar 20 inventarieplatser */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} style={{
            width: "32px",
            height: "32px",
            backgroundColor: "#1a1a1a",
            border: "1px solid #404040",
            borderRadius: "2px", // Lite rundade hörn
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "8px",
            color: "#888",
            boxShadow: "inset 0px 0px 2px rgba(0,0,0,0.5)" // Inre skugga för djup
          }}>
            {/* Exempel på föremål (ryggsäcksemoji) */}
            {i < 5 ? "🎒" : ""}
          </div>
        ))}
      </div>
    </FloatingWindow>
  );
};

export default InventoryWindow;
