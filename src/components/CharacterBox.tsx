import React, { useEffect, useRef, useState } from "react";

export type Character = {
  name: string;
  vocation: string;
  level: number;
  id?: number; // om du har id från backend
};

type CharacterBoxProps = {
  characters: Character[];
  onSelect: (character: Character) => void;
  onLogout: () => void;
};

export default function CharacterBox({
  characters,
  onSelect,
  onLogout,
}: CharacterBoxProps) {
  const [selected, setSelected] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  // Autofocus for keyboard navigation
  useEffect(() => {
    listRef.current?.focus();
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (characters.length === 0) return;

    if (e.key === "ArrowDown") {
      setSelected((prev) => (prev + 1) % characters.length);
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setSelected((prev) => (prev - 1 + characters.length) % characters.length);
      e.preventDefault();
    } else if (e.key === "Enter") {
      onSelect(characters[selected]);
    } else if (e.key === "Escape") {
      onLogout();
    }
  };

  return (
    <div
      style={{
        width: 380,
        position: "relative",
        background: "rgba(36, 29, 11, 0.96)",
        borderRadius: 20,
        border: "2.6px solid #e6cc7b",
        boxShadow: "0 8px 36px #000c, 0 0 0 2.5px #88622c80",
        padding: "36px 24px 28px",
        minWidth: 250,
        maxWidth: "96vw",
        display: "flex",
        flexDirection: "column",
        gap: 15,
        alignItems: "center",
        fontFamily: "'Uncial Antiqua', serif"
      }}
    >
      <h3
        style={{
          marginTop: 0,
          marginBottom: 20,
          color: "#ffeab6",
          textAlign: "center",
          fontFamily: "'Uncial Antiqua', serif",
          fontWeight: 500,
          letterSpacing: 0.2,
          fontSize: 24,
          textShadow: "0 2px 8px #000a, 0 0 2px #ffd96b55",
        }}
      >
        Choose Your Character
      </h3>

      <div
        ref={listRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginBottom: 18,
          outline: "none", // remove focus ring
        }}
      >
        {characters.length === 0 ? (
          <div style={{ color: "#e66a2b", textAlign: "center", fontSize: 18 }}>
            No characters found.
          </div>
        ) : (
          characters.map((char, idx) => (
            <div
              key={char.name + idx}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: selected === idx
                  ? "linear-gradient(90deg, #af8946aa 10%, #6a5235 100%)"
                  : idx % 2 === 0
                  ? "#2a211e99"
                  : "#31271899",
                borderRadius: 9,
                padding: "10px 14px",
                border: selected === idx
                  ? "2.3px solid #ffdf93"
                  : "1.2px solid #aa9a6b55",
                marginBottom: 2,
                fontSize: 17,
                color: "#ffeab6",
                boxShadow: selected === idx
                  ? "0 2px 10px #ca9d3cbb"
                  : "0 1px 6px #0006",
                fontFamily: "'Uncial Antiqua', serif",
                cursor: "pointer",
                transition: "all 0.12s"
              }}
              onClick={() => {
                setSelected(idx);
                onSelect(char);
              }}
              onMouseEnter={() => setSelected(idx)}
            >
              <div>
                <span style={{ fontWeight: 600 }}>{char.name}</span>{" "}
                <span style={{ opacity: 0.82, fontSize: 15, marginLeft: 8 }}>
                  {char.vocation}
                </span>
                <span style={{ opacity: 0.7, fontSize: 15, marginLeft: 8 }}>
                  Lv.{char.level}
                </span>
              </div>
              <button
                style={{
                  background: "linear-gradient(180deg, #d3b47c 0%, #ab7d29 95%)",
                  color: "#3a2106",
                  border: "1.7px solid #e2ce8a",
                  borderRadius: 9,
                  fontWeight: 600,
                  padding: "7px 20px",
                  fontSize: 15,
                  fontFamily: "'Uncial Antiqua', serif",
                  cursor: "pointer",
                  boxShadow: "0 2px 12px #0007, 0 0 2px #ffd96b88",
                  transition: "all 0.12s"
                }}
                onClick={e => {
                  e.stopPropagation();
                  setSelected(idx);
                  onSelect(char);
                }}
                tabIndex={-1}
              >
                Play
              </button>
            </div>
          ))
        )}
      </div>

      <button
        onClick={onLogout}
        style={{
          background: "#333c",
          border: "1.7px solid #bda06d80",
          color: "#9ba3b7",
          borderRadius: 9,
          fontWeight: 600,
          padding: "9px 0",
          width: "100%",
          fontSize: 15,
          marginTop: 4,
          opacity: 0.8,
          cursor: "pointer",
          fontFamily: "'Uncial Antiqua', serif"
        }}
      >
        Log out
      </button>
    </div>
  );
}
