// src/components/SidebarRight.tsx
import React from 'react';

// Definierar props för SidebarRight-komponenten
type SidebarRightProps = {
  hp: number;
  hpMax: number;
  mana: number;
  manaMax: number;
  onOpenBag: () => void;
  onOpenSettings: () => void; // Ny prop för att öppna inställningar
  onExit: () => void; // Ny prop för att avsluta (kan vara redundant om den redan finns i StatusBar)
  dockedWindowContent: React.ReactNode | null; // NY PROP FÖR DOCKAT FÖNSTER
};

const SidebarRight: React.FC<SidebarRightProps> = ({
  hp,
  hpMax,
  mana,
  manaMax,
  onOpenBag,
  onOpenSettings,
  onExit,
  dockedWindowContent, // Ta emot den nya prop
}) => {
  const hpPercentage = (hp / hpMax) * 100;
  const manaPercentage = (mana / manaMax) * 100;

  // Mock-data för utrustningsplatser (kan ersättas med faktiska föremål)
  const equipmentSlots = [
    { id: 'amulet', icon: '📿', onClick: () => console.log('Amulet slot clicked') },
    { id: 'helmet', icon: '🪖', onClick: () => console.log('Helmet slot clicked') },
    { id: 'backpack', icon: '🎒', onClick: onOpenBag },
    { id: 'weapon', icon: '⚔️', onClick: () => console.log('Weapon slot clicked') },
    { id: 'armor', icon: '🥼', onClick: () => console.log('Armor slot clicked') },
    { id: 'shield', icon: '🛡️', onClick: () => console.log('Shield slot clicked') },
    { id: 'ring', icon: '💍', onClick: () => console.log('Ring slot clicked') },
    { id: 'legs', icon: '👖', onClick: () => console.log('Legs slot clicked') },
    { id: 'charm', icon: '📊', onClick: () => console.log('charm slot clicked') },
    { id: 'none', icon: '', onClick: () => console.log('none slot clicked') },
    { id: 'boots', icon: '👢', onClick: () => console.log('Boots slot clicked') },
    { id: 'none1', icon: '', onClick: () => console.log('none1 slot clicked') },
  ];

  // Generiska knappar längst ner
  const actionButtons = [
    { id: 'button1', icon: '🔎', onClick: () => console.log('Button 1 clicked') },
    { id: 'button2', icon: '💡', onClick: () => console.log('Button 2 clicked') },
    { id: 'button3', icon: '🗺️', onClick: () => console.log('Button 3 clicked') },
    { id: 'button4', icon: '⚙️', onClick: onOpenSettings }, // Settings-knapp
    { id: 'button5', icon: '📊', onClick: () => console.log('Button 5 clicked') },
    { id: 'button6', icon: '📜', onClick: () => console.log('Button 6 clicked') },
    { id: 'button7', icon: '👥', onClick: () => console.log('Button 7 clicked') },
    { id: 'button8', icon: '💬', onClick: () => console.log('Button 8 clicked') },
    { id: 'button9', icon: '🏆', onClick: () => console.log('Button 9 clicked') },
    { id: 'button10', icon: '❓', onClick: () => console.log('Button 10 clicked') },
    { id: 'button11', icon: '🚪', onClick: onExit }, // Exit-knapp
  ];


  return (
    <div style={{
      width: "168px",
      backgroundColor: "#2d2d2d",
      borderLeft: "1px solid #404040",
      flexShrink: 0,
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: "4px", // Mindre padding upptill för att matcha bilden
      color: "#cccccc",
      fontSize: "11px", // Mindre fontstorlek för det mesta
      boxSizing: "border-box",
      overflowY: "auto", // Lägg till scroll om innehållet blir för långt
    }}>
      {/* Minimap */}
      <div style={{
        width: "150px", // Matchar bildens bredd
        height: "150px", // Matchar bildens höjd
        backgroundColor: "#000000", // Svart bakgrund
        border: "1px solid #404040",
        borderRadius: "2px", // Lätt rundade hörn
        marginBottom: "4px", // Mellanrum till nästa sektion
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#888",
        fontSize: "10px",
        position: "relative",
        overflow: "hidden"
      }}>
        <img
          src="https://placehold.co/150x150/003300/ffffff?text=Minimap"
          alt="Minimap Placeholder"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { e.currentTarget.src = "https://placehold.co/150x150/003300/ffffff?text=Minimap"; }}
        />
        {/* Liten orange fyrkant för spelarens position */}
        <div style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          width: "8px",
          height: "8px",
          backgroundColor: "#ff8c00",
          border: "1px solid #cc7000",
        }}></div>
      </div>

      {/* HP/Mana staplar med numeriska värden */}
      <div style={{
        width: "150px",
        marginBottom: "4px",
        display: "flex",
        flexDirection: "column",
        gap: "2px",
      }}>
        {/* HP Bar */}
        <div style={{
          height: "12px", // Mindre höjd
          backgroundColor: "#1a1a1a",
          border: "1px solid #404040",
          borderRadius: "2px",
          overflow: "hidden",
          position: "relative",
        }}>
          <div style={{
            width: `${hpPercentage}%`,
            backgroundColor: "#00cc00",
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
            fontSize: "9px", // Mindre font
            textShadow: "1px 1px 2px rgba(0,0,0,0.7)",
          }}>
            {hp}/{hpMax}
          </span>
        </div>
        {/* Mana Bar */}
        <div style={{
          height: "12px", // Mindre höjd
          backgroundColor: "#1a1a1a",
          border: "1px solid #404040",
          borderRadius: "2px",
          overflow: "hidden",
          position: "relative",
        }}>
          <div style={{
            width: `${manaPercentage}%`,
            backgroundColor: "#0077ff",
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
            fontSize: "9px", // Mindre font
            textShadow: "1px 1px 2px rgba(0,0,0,0.7)",
          }}>
            {mana}/{manaMax}
          </span>
        </div>
      </div>

      {/* Dockningsplats för fönster (t.ex. ryggsäcken) */}
      {dockedWindowContent && (
        <div style={{
          width: '150px', // Bredd på dockningsområdet
          // Höjden kan vara flexibel eller fast beroende på innehållet
          // För InventoryWindow är det 200px i GamePage, så vi matchar det här
          height: '200px',
          marginBottom: '4px',
          border: '1px solid #404040',
          backgroundColor: '#1a1a1a',
          borderRadius: '2px',
          overflow: 'hidden', // Förhindra scroll här, låt InventoryWindow hantera sin egen scroll
        }}>
          {dockedWindowContent}
        </div>
      )}

      {/* Utrustningsplatser */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)", // 3 kolumner
        gap: "2px", // Mellanrum mellan rutorna
        width: "150px", // Matchar bredden på minimappen
        marginBottom: "4px",
        border: "1px solid #404040", // Ram runt hela utrustningssektionen
        backgroundColor: "#1a1a1a",
        padding: "2px",
        borderRadius: "2px",
      }}>
        {equipmentSlots.map(slot => (
          <button
            key={slot.id}
            onClick={slot.onClick}
            style={{
              width: "48px", // Storlek på ikonrutor
              height: "48px",
              backgroundColor: "#252525",
              border: "1px solid #404040",
              borderRadius: "2px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px", // Storlek på emoji/ikon
              cursor: "pointer",
              padding: 0, // Ta bort standardpadding
              boxShadow: "inset 0px 0px 2px rgba(0,0,0,0.5)",
              color: "#cccccc"
            }}
          >
            {slot.icon}
          </button>
        ))}
      </div>

      {/* Rutnät med små knappar */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)", // 4 kolumner
        gap: "2px", // Mellanrum mellan knapparna
        width: "150px", // Matchar bredden
        padding: "2px",
        backgroundColor: "#1a1a1a",
        border: "1px solid #404040",
        borderRadius: "2px",
        marginBottom: "4px", // Mellanrum till botten
      }}>
        {actionButtons.map((btn) => (
          <button
            key={btn.id}
            onClick={btn.onClick}
            style={{
              width: "35px",
              height: "35px",
              backgroundColor: "#252525",
              border: "1px solid #404040",
              borderRadius: "2px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              cursor: "pointer",
              padding: 0,
              boxShadow: "inset 0px 0px 2px rgba(0,0,0,0.5)",
              color: "#cccccc"
            }}
          >
            {btn.icon}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SidebarRight;
