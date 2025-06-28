// PlayerInfoPanel.tsx
type PlayerInfoPanelProps = {
  name: string;
  level: number;
  hp: number;
  hpMax: number;
  mana: number;
  manaMax: number;
};

const PlayerInfoPanel = ({ name, level, hp, hpMax, mana, manaMax }: PlayerInfoPanelProps) => {
  return (
    <div style={{
      position: "absolute",
      top: 24,
      left: 24,
      width: 220,
      padding: 12,
      background: "rgba(30, 30, 38, 0.92)",
      border: "2px solid #555",
      borderRadius: 10,
      fontFamily: "Verdana, Geneva, sans-serif",
      color: "#ffe",
      boxShadow: "0 0 12px #000a"
    }}>
      <div style={{ fontWeight: "bold", fontSize: 18, marginBottom: 6 }}>{name}</div>
      <div>Level: <b>{level}</b></div>
      <div style={{ margin: "6px 0" }}>
        <div style={{ color: "#b55" }}>HP:</div>
        <div style={{
          width: "100%",
          height: 16,
          background: "#442",
          borderRadius: 6,
          overflow: "hidden"
        }}>
          <div style={{
            width: `${(hp/hpMax)*100}%`,
            height: "100%",
            background: "linear-gradient(90deg, #f00, #c30)",
          }} />
        </div>
        <span style={{ fontSize: 12 }}>{hp} / {hpMax}</span>
      </div>
      <div style={{ margin: "6px 0" }}>
        <div style={{ color: "#559" }}>Mana:</div>
        <div style={{
          width: "100%",
          height: 16,
          background: "#223",
          borderRadius: 6,
          overflow: "hidden"
        }}>
          <div style={{
            width: `${(mana/manaMax)*100}%`,
            height: "100%",
            background: "linear-gradient(90deg, #22f, #07a)",
          }} />
        </div>
        <span style={{ fontSize: 12 }}>{mana} / {manaMax}</span>
      </div>
    </div>
  );
};

export default PlayerInfoPanel;
