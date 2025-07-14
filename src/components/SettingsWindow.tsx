// src/components/SettingsWindow.tsx
import React, { useState, useRef, useEffect } from 'react';

// Definierar props för SettingsWindow-komponenten
type SettingsWindowProps = {
  id: string;
  initialX: number;
  initialY: number;
  width: number;
  height: number;
  onClose: (id: string) => void;
};

const SettingsWindow: React.FC<SettingsWindowProps> = ({
  id,
  initialX,
  initialY,
  width,
  height,
  onClose,
}) => {
  // State för fönstrets position och storlek
  const [currentX, setCurrentX] = useState(initialX);
  const [currentY, setCurrentY] = useState(initialY);
  const [currentWidth, setCurrentWidth] = useState(width); // Behåller bredden som en state
  const [currentHeight, setCurrentHeight] = useState(height); // Behåller höjden som en state

  // State för dragfunktion
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  // State för att hålla reda på vilken kategori som är aktiv
  const [activeCategory, setActiveCategory] = useState('Screenshots');
  // State för skärmbildsinställningar
  const [screenshotSettings, setScreenshotSettings] = useState({
    onlyCaptureGameWindow: true,
    keepBacklog: true,
    enableAutoScreenshots: true,
    events: {
      levelUp: true,
      skillUp: true,
      achievement: true,
      bestiaryEntryUnlocked: true,
      treasureFound: true,
      valuableLoot: false,
      bossDefeated: false,
      deathPvE: false,
      deathPvP: false,
      playerKill: false,
      playerKillAssist: false,
      playerAttacking: false,
      highestDamageDealt: false,
      highestHealingDone: false,
      lowHealth: false,
      giftOfLifeTriggered: true,
    },
  });
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  // Hanterare för att starta dragning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (windowRef.current) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - windowRef.current.getBoundingClientRect().left,
        y: e.clientY - windowRef.current.getBoundingClientRect().top,
      });
    }
  };

  // Hanterare för att flytta fönstret under dragning
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setCurrentX(e.clientX - dragOffset.x);
      setCurrentY(e.clientY - dragOffset.y);
    }
  };

  // Hanterare för att sluta dra
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Lägg till och ta bort eventlyssnare för dragning
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]); // Beroenden för useEffect

  // Hanterare för att ändra skärmbildsinställningar
  const handleScreenshotSettingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    if (name in screenshotSettings.events) {
      setScreenshotSettings(prev => ({
        ...prev,
        events: {
          ...prev.events,
          [name]: checked,
        },
      }));
    } else {
      setScreenshotSettings(prev => ({
        ...prev,
        [name]: checked,
      }));
    }
  };

  // Funktion för att hantera "Ok"-knappen
  const handleOk = () => {
    console.log("Settings saved and window closed:", screenshotSettings);
    onClose(id);
  };

  // Funktion för att hantera "Apply"-knappen
  const handleApply = () => {
    console.log("Settings applied:", screenshotSettings);
    // Här skulle du normalt skicka inställningarna till en backend eller globalt tillstånd
  };

  // Funktion för att hantera "Cancel"-knappen
  const handleCancel = () => {
    console.log("Settings cancelled, changes discarded.");
    onClose(id);
  };

  // Funktion för att rendera innehållet för den aktiva kategorin
  const renderContent = () => {
    switch (activeCategory) {
      case 'Controls':
        return <div style={{ padding: '15px' }}>Controls settings go here.</div>;
      case 'Interface':
        return <div style={{ padding: '15px' }}>Interface settings go here.</div>;
      case 'Graphics':
        return <div style={{ padding: '15px' }}>Graphics settings go here.</div>;
      case 'Sound':
        return <div style={{ padding: '15px' }}>Sound settings go here.</div>;
      case 'Misc.':
        return <div style={{ padding: '15px' }}>Miscellaneous settings go here.</div>;
      case 'Gameplay':
        return <div style={{ padding: '15px' }}>Gameplay settings go here.</div>;
      case 'Screenshots':
        return (
          <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#ffeab6', fontSize: '14px' }}>Screenshots</h3>

            {/* Checkboxar överst */}
            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontSize: '12px' }}>
              <input
                type="checkbox"
                name="onlyCaptureGameWindow"
                checked={screenshotSettings.onlyCaptureGameWindow}
                onChange={handleScreenshotSettingChange}
                style={{ marginRight: '5px', accentColor: '#0077ff' }}
              />
              Only Capture Game Window
            </label>
            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontSize: '12px' }}>
              <input
                type="checkbox"
                name="keepBacklog"
                checked={screenshotSettings.keepBacklog}
                onChange={handleScreenshotSettingChange}
                style={{ marginRight: '5px', accentColor: '#0077ff' }}
              />
              Keep Backlog of the Screenshots of the Last 5 Seconds
            </label>
            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', fontSize: '12px' }}>
              <input
                type="checkbox"
                name="enableAutoScreenshots"
                checked={screenshotSettings.enableAutoScreenshots}
                onChange={handleScreenshotSettingChange}
                style={{ marginRight: '5px', accentColor: '#0077ff' }}
              />
              Enable Auto Screenshots
            </label>

            {/* Villkorlig rendering för händelseval */}
            {screenshotSettings.enableAutoScreenshots && (
              <>
                <p style={{ margin: '0 0 10px 0', fontSize: '11px' }}>
                  Select all events that should trigger auto screenshots:
                </p>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr', // Två kolumner
                  gap: '5px 10px', // Rad- och kolumnmellanrum
                  marginBottom: '15px',
                  fontSize: '11px',
                }}>
                  {Object.entries(screenshotSettings.events).map(([key, value]) => (
                    <label key={key} style={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        type="checkbox"
                        name={key}
                        checked={value}
                        onChange={handleScreenshotSettingChange}
                        style={{ marginRight: '5px', accentColor: '#0077ff' }}
                      />
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} {/* Gör camelCase läsbar */}
                    </label>
                  ))}
                </div>
              </>
            )}

            <button style={{
              backgroundColor: "#3a3a3a",
              color: "#cccccc",
              border: "1px solid #505050",
              padding: "6px 12px",
              borderRadius: "3px",
              cursor: "pointer",
              alignSelf: 'flex-start', // Justera till vänster
              marginBottom: '10px',
              fontSize: '11px',
            }}>
              Open Screenshot Folder
            </button>
            <button style={{
              backgroundColor: "#3a3a3a",
              color: "#cccccc",
              border: "1px solid #505050",
              padding: "6px 12px",
              borderRadius: "3px",
              cursor: "pointer",
              alignSelf: 'flex-start', // Justera till vänster
              fontSize: '11px',
            }}>
              Reset
            </button>
          </div>
        );
      case 'Help':
        return <div style={{ padding: '15px' }}>Help content goes here.</div>;
      default:
        return <div style={{ padding: '15px' }}>Select a category.</div>;
    }
  };

  const categories = [
    { name: 'Controls', icon: '🎮' },
    { name: 'Interface', icon: '🖥️' },
    { name: 'Graphics', icon: '🎨' },
    { name: 'Sound', icon: '🎵' },
    { name: 'Misc.', icon: '📦' },
    { name: 'Gameplay', icon: '⚔️' },
    { name: 'Screenshots', icon: '📸' },
    { name: 'Help', icon: '❓' },
  ];

  return (
    <div
      ref={windowRef}
      style={{
        position: 'absolute',
        left: currentX,
        top: currentY,
        width: currentWidth,
        height: currentHeight,
        minWidth: '600px', // Minsta storlek från FloatingWindow
        minHeight: '450px', // Minsta storlek från FloatingWindow
        backgroundColor: '#2d2d2d',
        border: '1px solid #404040',
        borderRadius: '4px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden', // Förhindra scroll på hela fönstret
        zIndex: 999, // Se till att fönstret ligger överst
        resize: 'none', // Tillåter manuell resizning (om webbläsaren stöder det)
      }}
    >
      {/* Titelrad */}
      <div
        onMouseDown={handleMouseDown}
        style={{
          backgroundColor: '#404040',
          color: '#ffffff',
          padding: '8px 10px',
          borderBottom: '1px solid #505050',
          cursor: 'grab',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: 'bold',
          fontSize: '13px',
        }}
      >
        Options {/* Titel för fönstret */}
        <button
          onClick={() => onClose(id)}
          style={{
            backgroundColor: '#ff4444',
            color: '#ffffff',
            border: 'none',
            borderRadius: '3px',
            padding: '2px 6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold',
          }}
        >
          X
        </button>
      </div>

      <div style={{ display: 'flex', height: 'calc(100% - 40px)', borderBottom: '1px solid #404040' }}> {/* Justera höjden för att ge plats åt bottenfältet */}
        {/* Vänster sidomeny */}
        <div style={{
          width: '150px',
          backgroundColor: '#252525',
          borderRight: '1px solid #404040',
          padding: '5px',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto', // Scroll för sidomenyn om den blir för lång
        }}>
          {categories.map(cat => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              style={{
                backgroundColor: activeCategory === cat.name ? '#404040' : '#2d2d2d',
                color: '#cccccc',
                border: '1px solid #404040',
                borderRadius: '3px',
                padding: '8px 5px',
                marginBottom: '3px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                fontSize: '12px',
                fontWeight: activeCategory === cat.name ? 'bold' : 'normal',
                boxShadow: activeCategory === cat.name ? 'inset 0 0 5px rgba(0,0,0,0.5)' : 'none',
              }}
            >
              <span style={{ marginRight: '5px', fontSize: '14px' }}>{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>

        {/* Höger innehållsområde */}
        <div style={{
          flex: 1,
          backgroundColor: '#1a1a1a',
          padding: '10px',
          overflowY: 'auto', // Återinfört 'auto' här för innehållsspecifik scroll
        }}>
          {renderContent()}
        </div>
      </div>

      {/* Bottenfält med knappar */}
      <div style={{
        height: '40px',
        backgroundColor: '#2d2d2d',
        borderTop: '1px solid #404040',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 10px',
      }}>
        <label style={{ display: 'flex', alignItems: 'center', fontSize: '11px', color: '#cccccc' }}>
          <input
            type="checkbox"
            checked={showAdvancedOptions}
            onChange={(e) => setShowAdvancedOptions(e.target.checked)}
            style={{ marginRight: '5px', accentColor: '#0077ff' }}
          />
          Show Advanced Options
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleOk}
            style={{
              backgroundColor: "#404040",
              color: "#cccccc",
              border: "1px solid #606060",
              padding: "6px 12px",
              borderRadius: "3px",
              cursor: "pointer",
              fontSize: "11px",
              boxShadow: "0px 1px 2px rgba(0,0,0,0.2)"
            }}
          >
            Ok
          </button>
          <button
            onClick={handleApply}
            style={{
              backgroundColor: "#404040",
              color: "#cccccc",
              border: "1px solid #606060",
              padding: "6px 12px",
              borderRadius: "3px",
              cursor: "pointer",
              fontSize: "11px",
              boxShadow: "0px 1px 2px rgba(0,0,0,0.2)"
            }}
          >
            Apply
          </button>
          <button
            onClick={handleCancel}
            style={{
              backgroundColor: "#404040",
              color: "#cccccc",
              border: "1px solid #606060",
              padding: "6px 12px",
              borderRadius: "3px",
              cursor: "pointer",
              fontSize: "11px",
              boxShadow: "0px 1px 2px rgba(0,0,0,0.2)"
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsWindow;
