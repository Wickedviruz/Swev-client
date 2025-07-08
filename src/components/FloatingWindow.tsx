// src/components/FloatingWindow.tsx
import React, { useState, useRef, useEffect } from 'react';

// Definierar props för FloatingWindow-komponenten
type FloatingWindowProps = {
  id: string;        // Unikt ID för fönstret
  title: string;     // Fönstrets titel
  initialX: number;  // Initial X-position
  initialY: number;  // Initial Y-position
  width: number;     // Fönstrets bredd
  height: number;    // Fönstrets höjd
  onClose: (id: string) => void; // Funktion för att stänga fönstret
  children: React.ReactNode;     // Innehållet i fönstret
};

const FloatingWindow: React.FC<FloatingWindowProps> = ({
  id,
  title,
  initialX,
  initialY,
  width,
  height,
  onClose,
  children
}) => {
  // State för fönstrets position
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  // State för om fönstret dras
  const [isDragging, setIsDragging] = useState(false);
  // Ref för att lagra startpositionen för musen vid drag
  const dragStart = useRef({ x: 0, y: 0 });
  // Ref för att lagra fönstrets startposition vid drag
  const windowStart = useRef({ x: 0, y: 0 });

  // Hanterar när musknappen trycks ner på titelraden (startar drag)
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    windowStart.current = { x: position.x, y: position.y };
  };

  // Hanterar när musen rör sig (under drag)
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    // Beräknar ny position baserat på musens rörelse
    const newX = windowStart.current.x + (e.clientX - dragStart.current.x);
    const newY = windowStart.current.y + (e.clientY - dragStart.current.y);

    setPosition({ x: newX, y: newY });
  };

  // Hanterar när musknappen släpps (slutar drag)
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Lägger till och tar bort globala eventlyssnare för drag
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    // Rensar eventlyssnare vid unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]); // Beroende på isDragging state

  return (
    <div
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        width: width,
        height: height,
        backgroundColor: "#252525",
        border: "2px solid #404040",
        borderRadius: "4px",
        zIndex: 1000, // Säkerställer att flytande fönster ligger över annat innehåll
        display: "flex",
        flexDirection: "column",
        boxShadow: "0px 4px 8px rgba(0,0,0,0.5)" // Lägger till en skugga
      }}
    >
      {/* Fönstrets titelrad */}
      <div
        style={{
          height: "20px",
          backgroundColor: "#404040",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 8px",
          color: "#cccccc",
          fontSize: "10px",
          fontWeight: "bold",
          cursor: "grab", // Ändrar muspekaren vid drag
          borderTopLeftRadius: "2px",
          borderTopRightRadius: "2px"
        }}
        onMouseDown={handleMouseDown} // Startar drag vid musnedtryck
      >
        {title}
        {/* Stäng-knapp */}
        <button
          onClick={() => onClose(id)}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "#cccccc",
            cursor: "pointer",
            fontSize: "12px",
            padding: "0",
            width: "16px",
            height: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          ×
        </button>
      </div>
      {/* Fönstrets innehållsarea */}
      <div style={{
        flex: 1,
        padding: "4px",
        overflow: "auto", // Aktiverar scroll om innehållet är för stort
        backgroundColor: "#1a1a1a", // Bakgrundsfärg för innehållet
        borderBottomLeftRadius: "2px",
        borderBottomRightRadius: "2px"
      }}>
        {children} {/* Renderar det skickade innehållet */}
      </div>
    </div>
  );
};

export default FloatingWindow;
