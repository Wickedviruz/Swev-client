// src/components/InventoryWindow.tsx
import React from 'react';

// Definierar props för InventoryWindow-komponenten
type InventoryWindowProps = {
  id: string; // Fönstrets ID, används för att stänga det
  onClose: (id: string) => void; // Funktion för att stänga fönstret
  // Inga initialX, initialY, width, height längre, de hanteras av föräldern
};

const InventoryWindow: React.FC<InventoryWindowProps> = ({ id, onClose }) => {
  // Mock data för ryggsäckens innehåll
  const items = [
    { id: 1, name: 'Gold Coin', icon: '💰', quantity: 100 },
    { id: 2, name: 'Health Potion', icon: '🧪', quantity: 5 },
    { id: 3, name: 'Sword', icon: '🗡️', quantity: 1 },
    { id: 4, name: 'Shield', icon: '🛡️', quantity: 1 },
    { id: 5, name: 'Empty Bottle', icon: '🍾', quantity: 12 },
    { id: 6, name: 'Rope', icon: '🪢', quantity: 1 },
    { id: 7, name: 'Bread', icon: '🍞', quantity: 3 },
    { id: 8, name: 'Torch', icon: '🔦', quantity: 2 },
    { id: 9, name: 'Scroll', icon: '📜', quantity: 1 },
  ];

  return (
    <div style={{
      width: '100%', // Fyller tillgängligt utrymme i sin förälder (dockningsplatsen)
      height: '100%',
      backgroundColor: '#1a1a1a',
      border: '1px solid #404040',
      borderRadius: '4px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden', // Förhindra scroll på hela fönstret
      boxSizing: 'border-box',
    }}>
      {/* Fönstertitel och stängningsknapp (om vi vill ha en intern stängningsknapp) */}
      <div style={{
        backgroundColor: '#404040',
        color: '#ffffff',
        padding: '5px 10px',
        borderBottom: '1px solid #505050',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontWeight: 'bold',
        fontSize: '12px',
      }}>
        Backpack
        <button
          onClick={() => onClose(id)}
          style={{
            backgroundColor: '#ff4444',
            color: '#ffffff',
            border: 'none',
            borderRadius: '3px',
            padding: '1px 5px',
            cursor: 'pointer',
            fontSize: '10px',
            fontWeight: 'bold',
          }}
        >
          X
        </button>
      </div>

      {/* Innehåll i ryggsäcken */}
      <div style={{
        flex: 1, // Tar upp resterande utrymme
        padding: '5px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)', // 4 kolumner för föremål
        gap: '4px',
        overflowY: 'auto', // Aktivera scroll för föremålslistan
      }}>
        {items.map(item => (
          <div key={item.id} style={{
            backgroundColor: '#252525',
            border: '1px solid #3a3a3a',
            borderRadius: '3px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '5px',
            fontSize: '10px',
            color: '#cccccc',
            textAlign: 'center',
            position: 'relative',
            height: '48px', // Fast höjd för varje föremålsruta
          }}>
            <span style={{ fontSize: '20px', marginBottom: '2px' }}>{item.icon}</span>
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{item.name}</span>
            {item.quantity > 1 && (
              <span style={{
                position: 'absolute',
                bottom: '2px',
                right: '2px',
                backgroundColor: '#000a',
                color: '#fff',
                padding: '0 3px',
                borderRadius: '2px',
                fontSize: '8px',
              }}>
                {item.quantity}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryWindow;
