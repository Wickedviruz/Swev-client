// src/components/SidebarRight.tsx
import React from 'react';

const SidebarRight: React.FC = () => {
  return (
    <div style={{
      width: "168px",
      backgroundColor: "#2d2d2d",
      borderLeft: "1px solid #404040",
      flexShrink: 0, // Förhindrar att sidopanelen krymper
      position: "relative", // För positionering av dockade fönster
      display: "flex",
      zIndex: 999,
      flexDirection: "column",
      alignItems: "center",
      paddingTop: "10px", // Lite padding upptill
      color: "#cccccc", // Standard textfärg
      fontSize: "12px",
      boxSizing: "border-box"
    }}>
      {/* Exempel på innehåll för höger sidopanel */}
      <div style={{
        width: "90%",
        backgroundColor: "#1a1a1a",
        border: "1px solid #404040",
        borderRadius: "4px",
        padding: "8px",
        marginBottom: "10px",
        textAlign: "center"
      }}>
        <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>Battle List</p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "10px" }}>
          <li style={{ marginBottom: "3px", color: "#ff5555" }}>- Orc (HP: 80%)</li>
          <li style={{ marginBottom: "3px", color: "#ffaa00" }}>- Goblin (HP: 50%)</li>
          <li style={{ marginBottom: "3px", color: "#00cc00" }}>- Deer (HP: 100%)</li>
          <li>- Troll (HP: 90%)</li>
        </ul>
      </div>

      <div style={{
        width: "90%",
        backgroundColor: "#1a1a1a",
        border: "1px solid #404040",
        borderRadius: "4px",
        padding: "8px",
        textAlign: "center"
      }}>
        <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>Minimap</p>
        <div style={{
          width: "100px",
          height: "100px",
          backgroundColor: "#003300",
          border: "1px solid #404040",
          margin: "8px auto",
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#888"
        }}>
          [Map Area]
        </div>
      </div>

      {/* Här kan dockade fönster placeras */}
    </div>
  );
};

export default SidebarRight;
