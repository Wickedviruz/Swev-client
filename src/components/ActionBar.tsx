// src/components/ActionBar.tsx
import React from 'react';

const ActionBar: React.FC = () => {
  return (
    <div style={{
      position: "absolute",
      bottom: "8px",
      left: "50%",
      transform: "translateX(-50%)", // Centrerar horisontellt
      display: "flex",
      gap: "2px", // Mellanrum mellan knapparna
      zIndex: 500 // Säkerställer att den ligger ovanpå spelvärlden
    }}>
      {/* Skapar 8 action-platser */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} style={{
          width: "32px",
          height: "32px",
          backgroundColor: "#252525",
          border: "1px solid #404040",
          borderRadius: "4px", // Rundade hörn
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#cccccc",
          fontSize: "10px",
          cursor: "pointer",
          boxShadow: "0px 2px 4px rgba(0,0,0,0.3)" // Liten skugga
        }}>
          {i + 1} {/* Visar numret på platsen */}
        </div>
      ))}
    </div>
  );
};

export default ActionBar;
