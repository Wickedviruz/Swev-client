// src/components/SidebarLeft.tsx
import React from 'react';

const SidebarLeft: React.FC = () => {
  return (
    <div style={{
      width: "168px",
      backgroundColor: "#2d2d2d",
      borderRight: "1px solid #404040",
      flexShrink: 0, // Förhindrar att sidopanelen krymper
      position: "relative", // För positionering av dockade fönster
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      zIndex: 999,
      paddingTop: "10px", // Lite padding upptill
      color: "#cccccc", // Standard textfärg
      fontSize: "12px",
      boxSizing: "border-box"
    }}>
      {/* Exempel på innehåll för vänster sidopanel */}
      <div style={{
        width: "90%",
        backgroundColor: "#1a1a1a",
        border: "1px solid #404040",
        borderRadius: "4px",
        padding: "8px",
        marginBottom: "10px",
        textAlign: "center"
      }}>
        <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>Quests</p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "10px" }}>
          <li style={{ marginBottom: "3px" }}>- Kill 10 Rats</li>
          <li style={{ marginBottom: "3px" }}>- Find the Lost Key</li>
          <li>- Deliver Message</li>
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
        <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>Skills</p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "10px" }}>
          <li style={{ marginBottom: "3px" }}>- Melee: 25</li>
          <li style={{ marginBottom: "3px" }}>- Distance: 18</li>
          <li style={{ marginBottom: "3px" }}>- Shielding: 22</li>
          <li>- Magic: 15</li>
        </ul>
      </div>

      {/* Här kan dockade fönster placeras */}
    </div>
  );
};

export default SidebarLeft;
