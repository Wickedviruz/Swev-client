// src/components/ChatWindow.tsx
import React, { useState, useEffect, useRef } from 'react';

// Definierar props för ChatWindow-komponenten
type ChatWindowProps = {
  messages: { name: string; text: string; color?: string }[]; // Array av chattmeddelanden
  onSend: (text: string) => void; // Funktion för att skicka meddelanden
};

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSend }) => {
  const [chatInput, setChatInput] = useState(""); // State för chattinmatningsfältet
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref för att scrolla till botten

  // Scrollar ner till det senaste meddelandet när meddelanden uppdateras
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Hanterar skickning av chattmeddelande
  const handleSendChat = () => {
    // chatInput.trim() tar bort mellanslag från början och slutet av strängen.
    // Om du vill tillåta att meddelanden som enbart består av mellanslag skickas,
    // eller om du vill behålla ledande/avslutande mellanslag,
    // kan du ändra villkoret nedan till t.ex. 'if (chatInput)' istället för 'if (chatInput.trim())'.
    if (chatInput.trim()) {
      onSend(chatInput);   // Anropar onSend-funktionen med meddelandet
      setChatInput("");     // Rensar inmatningsfältet
    }
  };

  // Hanterar tangenttryckningar (Enter för att skicka)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendChat();
    }
  };

  return (
    <div style={{
      height: "100%", // Fyller förälderns höjd
      backgroundColor: "#252525",
      borderTop: "1px solid #404040",
      display: "flex",
      zIndex: 999,
      flexDirection: "column",
      flexShrink: 0,
      width: "100%",
      boxSizing: "border-box",
      borderRadius: "4px" // Rundade hörn för hela chattfönstret
    }}>
      {/* Chattmeddelanden */}
      <div style={{
        flex: 1, // Tar upp resterande vertikalt utrymme
        padding: "4px",
        overflowY: "auto", // Aktiverar vertikal scrollning
        backgroundColor: "#1a1a1a",
        borderBottom: "1px solid #2d2d2d", // Lätt avgränsare
        borderRadius: "2px" // Rundade hörn för meddelandeområdet
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            fontSize: "11px",
            marginBottom: "2px",
            color: msg.color || "#cccccc" // Använder färg om den finns, annars standard
          }}>
            <span style={{ fontWeight: "bold" }}>{msg.name}:</span> {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Tom div för att scrolla till */}
      </div>
      {/* Chattinmatning */}
      <div style={{
        height: "24px",
        display: "flex",
        padding: "2px",
        backgroundColor: "#2d2d2d",
        borderTop: "1px solid #404040", // Avgränsare från meddelanden
        borderBottomLeftRadius: "4px",
        borderBottomRightRadius: "4px"
      }}>
        <input
          type="text"
          tabIndex={0} // <-- hjälper ibland för att säkerställa fokus!
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={e => {
            e.stopPropagation(); // <-- stoppar event från att gå vidare!
            handleKeyPress(e);
          }}
          placeholder="Say something..."
          style={{
            flex: 1,
            backgroundColor: "#1a1a1a",
            border: "1px solid #404040",
            color: "#cccccc",
            padding: "2px 4px",
            fontSize: "11px",
            outline: "none",
            borderRadius: "3px"
          }}
        />
        <button
          onClick={handleSendChat}
          style={{
            backgroundColor: "#404040",
            color: "#cccccc",
            border: "1px solid #606060",
            padding: "2px 8px",
            marginLeft: "4px",
            fontSize: "10px",
            cursor: "pointer",
            borderRadius: "3px", // Rundade hörn för knappen
            boxShadow: "0px 1px 2px rgba(0,0,0,0.2)" // Liten skugga
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
