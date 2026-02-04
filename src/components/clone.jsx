'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

// Step definitions for Osmosis experiment
const STEPS = [
  {
    label: 'Place petri dish',
    icon: '🧫',
    hint: 'Drag petri dish from shelf to working table.'
  },
  {
    label: 'Place potato in dish',
    icon: '🥔',
    hint: 'Place scooped potato in petri dish with side profile view.'
  },
  {
    label: 'Add distilled water',
    icon: '💧',
    hint: 'Turn on the tap to fill the petri dish with water.'
  },
  {
    label: 'Add salt crystals',
    icon: '🧂',
    hint: 'Pour salt into the scooped section of the potato.'
  },
  {
    label: 'Observe osmosis',
    icon: '👁️',
    hint: 'Watch water level rise in potato over ~30 seconds.'
  },
];

// Format time helper
const formatTime = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

// Main component
export default function PotatoExperiment({ markComplete, navigationButtons }) {
  // ── experiment state ──
  const [experimentStep, setExperimentStep] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [beakerWaterLevel, setBeakerWaterLevel] = useState(0);   // 0→75 when filling
  const [potatoWaterLevel, setPotatoWaterLevel] = useState(0);   // 0→100 during osmosis

  // ── tap state ──
  const [tapOn, setTapOn] = useState(false);
  const [tapFilling, setTapFilling] = useState(false);

  // ── drag-and-drop state ──
  const [dragging, setDragging] = useState(null);
  const [dropping, setDropping] = useState(false);

  // ── refs ──
  const tableRef = useRef(null);
  const timerRef = useRef(null);

  // ── derived ──
  const isStepComplete = (stepIndex) => experimentStep > stepIndex;
  const isStepActive = (stepIndex) => experimentStep === stepIndex;

  // ── step completion ──
  const completeStep = useCallback((step) => {
    setExperimentStep((prev) => Math.max(prev, step + 1));
    if (step === 4) {
      if (markComplete) markComplete();
    }
  }, [markComplete]);

  // ── tap filling effect ──
  useEffect(() => {
    if (tapOn && beakerWaterLevel < 75) {
      setTapFilling(true);
      const tapTimer = setInterval(() => {
        setBeakerWaterLevel(prev => {
          const newLevel = Math.min(75, prev + 2.5);
          if (newLevel >= 75) {
            setTapOn(false);
            setTapFilling(false);
            completeStep(2);
          }
          return newLevel;
        });
      }, 100);

      return () => clearInterval(tapTimer);
    } else {
      setTapFilling(false);
    }
  }, [tapOn, completeStep]);

  // ── timer logic ──
  useEffect(() => {
    if (experimentStep === 4 && !isTimerRunning) {
      setIsTimerRunning(true);
      setTimeElapsed(0);
      setPotatoWaterLevel(0);

      let timeCounter = 0;
      const osmosisTimer = setInterval(() => {
        timeCounter += 1;
        setTimeElapsed(timeCounter);
        setPotatoWaterLevel(Math.min(100, (timeCounter / 30) * 100));
        setBeakerWaterLevel(prev => Math.max(25, prev - 1.5));

        if (timeCounter >= 30) {
          clearInterval(osmosisTimer);
          setIsTimerRunning(false);
          completeStep(4);
        }
      }, 1000);

      timerRef.current = osmosisTimer;
      return () => clearInterval(osmosisTimer);
    }
  }, [experimentStep, completeStep]);

  // ── reset experiment ──
  const resetExperiment = () => {
    clearInterval(timerRef.current);
    setExperimentStep(0);
    setTimeElapsed(0);
    setIsTimerRunning(false);
    setBeakerWaterLevel(0);
    setPotatoWaterLevel(0);
    setTapOn(false);
    setTapFilling(false);
  };

  // ── drag handlers ──
  const handleDragStart = (e, itemId) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', itemId);
    setDragging(itemId);
  };

  const handleDragEnd = () => {
    setDragging(null);
    setDropping(false);
  };

  const isOverTable = (e) => {
    const rect = tableRef.current?.getBoundingClientRect();
    if (!rect) return false;
    return (
      e.clientX >= rect.left && e.clientX <= rect.right &&
      e.clientY >= rect.top && e.clientY <= rect.bottom
    );
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!isOverTable(e)) {
      setDragging(null);
      setDropping(false);
      return;
    }

    setDropping(true);
    const itemId = e.dataTransfer.getData('text/plain');

    // Step-gated drops
    if (itemId === 'petri' && experimentStep === 0) {
      setTimeout(() => {
        completeStep(0);
        setDropping(false);
      }, 500);
    }
    else if (itemId === 'potato' && experimentStep === 1) {
      setTimeout(() => {
        completeStep(1);
        setDropping(false);
      }, 500);
    }
    else if (itemId === 'salt' && experimentStep === 3) {
      setTimeout(() => {
        completeStep(3);
        setDropping(false);
      }, 500);
    }
    else {
      setDropping(false);
    }

    setDragging(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // ── color tokens ──
  const clr = {
    primary: '#0077B6',
    dark: '#005A8C',
    green: '#48bb78',
    orange: '#ed8936',
    muted: '#718096',
    bg: '#f7fafc',
    lightBg: '#ffffff',
    border: '#e2e8f0'
  };

  /* ═══════════ RENDER FUNCTIONS ═══════════ */

  /* LEFT SIDEBAR - Light Themed with Step Cards */
  const renderLeftSidebar = () => (
    <aside style={{
      width: 280,
      minWidth: 280,
      background: clr.lightBg,
      color: '#2d3748',
      borderRight: `1px solid ${clr.border}`,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
    }}>
      {/* header */}
      <div style={{
        padding: '1.5rem 1rem 1rem',
        borderBottom: `1px solid ${clr.border}`,
        background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '1.1rem',
          fontWeight: 700,
          color: clr.primary,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          📋 Experiment Steps
        </h3>
        <p style={{
          margin: '0.5rem 0 0',
          fontSize: '0.8rem',
          color: clr.muted
        }}>
          Follow these steps to complete the osmosis experiment
        </p>
      </div>

      {/* step list */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem 0.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {STEPS.map((step, i) => {
          const done = isStepComplete(i);
          const active = isStepActive(i);

          return (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '12px',
              borderRadius: '8px',
              background: active ? 'rgba(0,119,182,0.1)' : done ? 'rgba(72,187,120,0.1)' : 'transparent',
              border: `1px solid ${active ? clr.primary : done ? clr.green : clr.border}`,
              transition: 'all 0.25s',
            }}>
              {/* step number */}
              <div style={{
                width: '28px',
                height: '28px',
                minWidth: '28px',
                borderRadius: '50%',
                background: done ? clr.green : active ? clr.primary : clr.border,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 600,
                color: done ? 'white' : active ? 'white' : clr.muted,
                transition: 'all 0.3s',
              }}>
                {done ? '✓' : i + 1}
              </div>

              {/* step content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: done ? clr.green : active ? clr.primary : '#2d3748',
                  marginBottom: '4px'
                }}>
                  {step.label}
                </div>
                <div style={{
                  fontSize: '0.8rem',
                  color: active ? clr.muted : '#a0aec0',
                  lineHeight: 1.4
                }}>
                  {step.hint}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* progress indicator */}
      <div style={{
        padding: '1rem',
        borderTop: `1px solid ${clr.border}`,
        background: '#f7fafc'
      }}>
        <div style={{
          fontSize: '0.8rem',
          color: clr.muted,
          marginBottom: '8px',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span>Progress</span>
          <span>{Math.round((experimentStep / STEPS.length) * 100)}%</span>
        </div>
        <div style={{
          height: '6px',
          background: clr.border,
          borderRadius: '3px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${(experimentStep / STEPS.length) * 100}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${clr.primary}, ${clr.green})`,
            transition: 'width 0.3s ease',
            borderRadius: '3px'
          }} />
        </div>
      </div>
    </aside>
  );

  // Side shelf
  const SideShelf = ({ visible }) => {
    if (!visible) return null;

    const SHELF_W = 200;
    const SHELF_H = 10;

    return (
      <div style={{
        position: 'relative',
        width: '100%',
        filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))',
        marginBottom: '4rem',
      }}>
        {/* Top Surface of the Wood */}
        <div style={{
          height: 10,
          width: '100%',
          background: 'linear-gradient(to bottom, #d2b48c, #c4a484)',
          borderRadius: '4px 4px 0 0',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Wood Grain Lines */}
          {[15, 35, 55, 75, 90].map((p) => (
            <div key={p} style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${p}%`,
              width: '20px',
              background: 'rgba(92, 64, 51, 0.05)',
              transform: 'skewX(-20deg)'
            }} />
          ))}
        </div>

        {/* Front Edge of the Wood (The "Thick" part) */}
        <div style={{
          height: SHELF_H,
          width: '100%',
          background: 'linear-gradient(180deg, #a8896a 0%, #8b6d4d 100%)',
          borderRadius: '0 0 4px 4px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
        }}>
          {/* Knots/imperfections on the front edge */}
          <div style={{
            position: 'absolute',
            left: '20%',
            top: '4px',
            width: '8px',
            height: '4px',
            background: 'rgba(60, 40, 20, 0.2)',
            borderRadius: '50%'
          }} />
        </div>
      </div>
    );
  };

  /* RIGHT SIDEBAR - Light Themed with Step Cards */
  const renderRightSidebar = () => (
    <aside style={{
      width: 280,
      minWidth: 280,
      background: clr.lightBg,
      color: '#2d3748',
      borderLeft: `1px solid ${clr.border}`,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
    }}>
      {/* header */}
      <div style={{
        padding: '1.5rem 1rem 1rem',
        borderBottom: `1px solid ${clr.border}`,
        background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '1.1rem',
          fontWeight: 700,
          color: clr.primary,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          📋 Experiment Apparatus
        </h3>
        <p style={{
          margin: '0.5rem 0 0',
          fontSize: '0.8rem',
          color: clr.muted
        }}>
          Drag an apparatus as instructed in the steps and drop into the canvas
        </p>
      </div>

      {/* apparatus list */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem 0.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {/* Petri dish */}
        {experimentStep < 1 ? (
          <div
            draggable={experimentStep <= 0}
            onDragStart={e => handleDragStart(e, 'petri')}
            onDragEnd={handleDragEnd}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              cursor: experimentStep >= 1 ? 'grab' : 'not-allowed',
              userSelect: 'none',
              opacity: experimentStep >= 1 ? 1 : 0.5,
            }}
          >
            <div style={{ position: 'relative', width: 68, height: 52 }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, #ecc94b, #d69e2e)',
                borderRadius: '5% 5% 10% 10%',
                border: '2px solid #a0b8c8',
                boxShadow: '0 3px 8px rgba(0,0,0,0.25)',
                transition: 'transform 0.15s',
              }}
                onMouseEnter={e => experimentStep >= 1 && (e.currentTarget.style.transform = 'translateY(-3px)')}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              />
              <div style={{
                position: 'absolute',
                top: -10, left: '50%', transform: 'translateX(-50%)',
                width: 60, height: 58,
                background: 'linear-gradient(180deg, #e3eaf0, #fef5e7)',
                borderRadius: '10% 10%',
                borderBottom: '1.5px solid #975a16',
                borderTop: 'none',
              }} />
            </div>
            <span style={{ fontSize: '0.7rem', color: '#4a5568', fontWeight: 600 }}>Petridish</span>
          </div>
        ) : (
          <div
            draggable={experimentStep <= 0}
            onDragStart={e => handleDragStart(e, 'petri')}
            onDragEnd={handleDragEnd}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              cursor: experimentStep >= 1 ? 'grab' : 'not-allowed',
              userSelect: 'none',
              opacity: experimentStep >= 1 ? 1 : 0.5,
            }}
          >
            <div style={{ position: 'relative', width: 68, height: 52 }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(180deg, rgba(200,218,230,0.7), rgba(160,190,210,0.5))',
                borderRadius: '5% 5% 10% 10% / 45% 45% 35% 35%',
                border: '2px solid #a0b8c8',
                boxShadow: '0 3px 8px rgba(0,0,0,0.25)',
                transition: 'transform 0.15s',
              }}
                onMouseEnter={e => experimentStep >= 1 && (e.currentTarget.style.transform = 'translateY(-3px)')}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              />
              <div style={{
                position: 'absolute',
                top: -10, left: '50%', transform: 'translateX(-50%)',
                width: 60, height: 58,
                // background: 'linear-gradient(180deg, #e3eaf0, #fef5e7)',
                borderRadius: '10% 10%',
                // borderBottom: '1.5px solid #4a5568',
                borderTop: 'none',
              }} />
            </div>
            <span style={{ fontSize: '0.7rem', color: '#4a5568', fontWeight: 600 }}>Petridish</span>
          </div>
        )}

        {/* Shelf */}
        <SideShelf visible={true} />

        {/* Potato */}
        {experimentStep < 2 ? (
          <div
            draggable={experimentStep >= 1}
            onDragStart={e => handleDragStart(e, 'potato')}
            onDragEnd={handleDragEnd}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              cursor: experimentStep >= 1 ? 'grab' : 'not-allowed',
              userSelect: 'none',
              opacity: experimentStep >= 1 ? 1 : 0.5,
            }}
          >
            <div style={{ position: 'relative', width: 68, height: 52 }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, #ecc94b, #d69e2e)',
                borderRadius: '50% 50% 42% 42% / 45% 45% 35% 35%',
                border: '2px solid #975a16',
                boxShadow: '0 3px 8px rgba(0,0,0,0.25)',
                transition: 'transform 0.15s',
              }}
                onMouseEnter={e => experimentStep >= 1 && (e.currentTarget.style.transform = 'translateY(-3px)')}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              />
              <div style={{
                position: 'absolute',
                top: -10, left: '50%', transform: 'translateX(-50%)',
                width: 50, height: 50,
                background: 'linear-gradient(180deg, #e3eaf0, #fef5e7)',
                borderRadius: '0 0 40% 40%',
                borderBottom: '1.5px solid #975a16',
                borderTop: 'none',
              }} />
            </div>
            <span style={{ fontSize: '0.7rem', color: '#4a5568', fontWeight: 600 }}>Potato</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: 0.3 }}>
            <div style={{ position: 'relative', width: 68, height: 52 }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, #ecc94b, #d69e2e)',
                borderRadius: '50% 50% 42% 42% / 45% 45% 35% 35%',
                border: '2px solid #975a16',
              }} />
              <div style={{
                position: 'absolute',
                top: 0, left: '50%', transform: 'translateX(-50%)',
                width: 36, height: 18,
                background: 'linear-gradient(180deg, #fffaf0, #fef5e7)',
                borderRadius: '0 0 40% 40%',
                border: '1.5px solid #975a16',
              }} />
            </div>
            <span style={{ fontSize: '0.7rem', color: '#4a5568', fontWeight: 600 }}>✓ Placed</span>
          </div>
        )}

        <SideShelf visible={true} />

        {/* Salt BOWL */}
        {experimentStep < 5 ? (
          <div
            draggable={experimentStep >= 3}
            onDragStart={e => handleDragStart(e, 'salt')}
            onDragEnd={handleDragEnd}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              opacity: experimentStep >= 3 ? 1 : 0.5,
              cursor: experimentStep >= 3 ? 'grab' : 'not-allowed',
            }}
          >
            {/* Salt bowl */}
            <div style={{
              position: 'relative',
              width: 50,
              height: 40,
              transition: 'transform 0.15s',
            }}
              onMouseEnter={e => experimentStep >= 3 && (e.currentTarget.style.transform = 'translateY(-3px)')}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {/* Bowl body */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 30,
                background: 'linear-gradient(180deg, #f6ad55 0%, #ed8936 100%)',
                borderRadius: '0 0 50% 50% / 0 0 100% 100%',
                border: '2px solid #c05621',
                boxShadow: '0 3px 10px rgba(0,0,0,0.22)',
              }} />
              {/* Salt crystals in bowl */}
              <div style={{
                position: 'absolute',
                bottom: 5,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 32,
                height: 16,
                background: '#ffffff',
                backgroundSize: 'cover',
                borderRadius: '0 0 50% 50% / 0 0 100% 100%',
              }} />
            </div>
            <span style={{ fontSize: '0.7rem', color: '#4a5568', fontWeight: 600 }}>Salt Bowl</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: 0.3 }}>
            <div style={{
              position: 'relative',
              width: 50,
              height: 40,
            }}>
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 30,
                background: 'linear-gradient(180deg, #f6ad55 0%, #ed8936 100%)',
                borderRadius: '0 0 50% 50% / 0 0 100% 100%',
                border: '2px solid #c05621',
              }} />
            </div>
            <span style={{ fontSize: '0.7rem', color: '#4a5568', fontWeight: 600 }}>✓ Placed</span>
          </div>
        )}
        <SideShelf visible={true} />
      </div>

      {/* progress indicator */}
      <div style={{
        padding: '1rem',
        borderTop: `1px solid ${clr.border}`,
        background: '#f7fafc'
      }}>
        <div style={{
          fontSize: '0.8rem',
          color: clr.muted,
          marginBottom: '8px',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span>Progress</span>
          <span>{Math.round((experimentStep / STEPS.length) * 100)}%</span>
        </div>
        <div style={{
          height: '6px',
          background: clr.border,
          borderRadius: '3px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${(experimentStep / STEPS.length) * 100}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${clr.primary}, ${clr.green})`,
            transition: 'width 0.3s ease',
            borderRadius: '3px'
          }} />
        </div>
      </div>
    </aside>
  );

  /* WORKING TABLE - Main experiment visualization */
  const renderWorkingTable = () => {
    // Layout constants - LONGER AND THINNER TABLE
    const TABLE_W = 900;   // longer
    const TABLE_H = 24;    // thinner
    const DISH_OUTER_W = 600;
    const DISH_OUTER_H = 400;
    const WALL_T = 8;
    const INNER_W = DISH_OUTER_W - WALL_T * 2;
    const INNER_H = DISH_OUTER_H - 18;
    const DISH_FLOOR_T = 10;

    // LARGER POTATO (increased from 0.60 to 0.75)
    const POT_W = Math.round(INNER_W * 0.75);
    const POT_H = Math.round(POT_W * 0.6);
    const SCOOP_W = Math.round(POT_W * 0.60);
    const SCOOP_H = Math.round(POT_H * 0.94);

    const MAX_WATER_H = INNER_H;
    const waterH = Math.min((beakerWaterLevel / 100) * MAX_WATER_H, MAX_WATER_H);

    // TODO:{UPDATED} Potato sits ON FLOOR initially, then rises with water (displaced volume)
    // const POTATO_DISPLACEMENT = POT_H * 0.8; // potato displaces ~40% of its height
    const POTATO_DISPLACEMENT = waterH * 0.8; // potato displaces ~40% of its height
    const potatoBottom = experimentStep >= 3
      ? TABLE_H + DISH_FLOOR_T + Math.max(0, waterH - POTATO_DISPLACEMENT)
      : TABLE_H + DISH_FLOOR_T;

    const saltH = Math.round((potatoWaterLevel / 100) * SCOOP_H);

    return (
      <div
        ref={tableRef}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',  // LOWER POSITION - align to bottom
          padding: '1rem 2rem 2rem',    // less top padding
          background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
          margin: '1rem',
          borderRadius: '12px',
          border: `2px dashed ${dropping ? clr.green : clr.border}`,
          transition: 'all 0.3s',
          minHeight: '500px',
          position: 'relative',
          overflow: 'visible',
        }}
      >
        {/* Drop indicator */}
        {dropping && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(72,187,120,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            animation: 'pulse 1s infinite',
          }}>
            <div style={{
              fontSize: '1.5rem',
              color: clr.green,
              fontWeight: 'bold',
            }}>
              Drop here!
            </div>
          </div>
        )}

        {/* Instructions */}
        <div style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          fontSize: '0.85rem',
          color: clr.muted,
          background: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          border: `1px solid ${clr.border}`,
          zIndex: 2
        }}>
          {experimentStep === 0 && 'Drag the petri dish to the working table'}
          {experimentStep === 1 && 'Drag the potato into the petri dish'}
          {experimentStep === 2 && 'Turn on the tap to add water'}
          {experimentStep === 3 && 'Drag salt bowl and pour into the potato scoop'}
          {experimentStep >= 4 && 'Observing osmosis process...'}
        </div>

        <button
          onClick={resetExperiment}
          style={{
            background: 'white',
            border: `2px solid ${clr.primary}`,
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 600,
            color: clr.primary,
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = clr.primary;
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.color = clr.primary;
          }}
        >
          🔄 Reset Experiment
        </button>

        {/* Scene container */}
        <div style={{
          position: 'relative',
          width: TABLE_W,
          height: DISH_OUTER_H + TABLE_H + 140,
          margin: '0 auto',
        }}>

          {/* TABLE (wood surface - longer and thinner) */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: TABLE_H,
            background: 'linear-gradient(180deg, #c4a882 0%, #a8896a 50%, #9a7d5e 100%)',
            borderRadius: '0 0 6px 6px',
            boxShadow: 'inset 0 3px 8px rgba(0,0,0,0.15)',
          }}>
            {[5, 12, 20, 30, 40, 50, 60, 70, 80, 88, 95].map((p) => (
              <div key={p} style={{ position: 'absolute', top: 0, bottom: 0, left: `${p}%`, width: 1, background: 'rgba(0,0,0,0.08)' }} />
            ))}
          </div>

          {/* TAP (appears when potato is in dish and water not filled) */}
          {/* {experimentStep >= 2 && experimentStep < 3 && ( */}
          <div style={{
            position: 'absolute',
            top: 10,
            left: '12%',
            height: 60, width: 80
          }}>
            {/* 1. Main Vertical Body (The base) */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 8,
              width: 14,
              height: 40,
              background: 'linear-gradient(90deg, #718096, #2d3748)',
              borderRadius: '4px 4px 0 0',
            }} />

            {/* 2. Horizontal Spout (Facing Right) */}
            <div style={{
              position: 'absolute',
              top: 20,
              left: 0,
              width: 80, // How far the tap reaches
              height: 12,
              background: 'linear-gradient(180deg, #a0aec0, #4a5568)',
              borderRadius: '0 8px 8px 0',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }} />

            {/* 3. The Tip (Where water comes out) */}
            <div style={{
              position: 'absolute',
              top: 28,
              left: 64, // Positioned near the end of the spout
              width: 12,
              height: 8,
              background: '#2d3748',
              borderRadius: '0 0 4px 4px',
            }} />

            <div
              onClick={() => {
                if (!tapOn && beakerWaterLevel < 75) {
                  setTapOn(true);
                }
              }}
              style={{
                position: 'absolute',
                left: 0,
                top: -20,
                width: 50,
                height: 22,
                borderRadius: 22,
                background:
                  tapOn
                    ? clr.primary
                    : beakerWaterLevel >= 75
                      ? '#cbd5e0'
                      : '#94a3b8',
                cursor:
                  tapOn || beakerWaterLevel >= 75
                    ? 'not-allowed'
                    : 'pointer',
                transition: 'background 0.25s ease',
                boxShadow:
                  tapOn
                    ? '0 2px 8px rgba(0,119,182,0.4)'
                    : 'inset 0 0 4px rgba(0,0,0,0.2)',
              }}
            >
              {/* Toggle label */}
              <div
                style={{
                  width: 200,
                  color: '#111111',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: -5,
                  left: -200,
                  transition: 'left 0.25s ease',
                }}
              >
                <p>Toggle switch to turn the tap on or off</p>
              </div>
              {/* Toggle knob */}
              <div
                style={{
                  width: 18,
                  height: 18,
                  background: '#fff',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: 2,
                  left: tapOn ? 30 : 2,
                  transition: 'left 0.25s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                }}
              />
            </div>

            {/* 4. The Water Stream (Relocated to the tip) */}
            {tapFilling && (
              <div style={{
                position: 'absolute',
                top: 36,
                left: 70, // Aligned with the tip
                width: 4,
                height: DISH_OUTER_H + TABLE_H - 50,
                background: 'linear-gradient(180deg, rgba(66,153,225,0.7) 0%, rgba(66,153,225,0.9) 100%)',
                borderRadius: 2,
                animation: 'waterStream 0.3s ease-in-out infinite ',
              }} />
            )}
          </div>

          {/* PETRI DISH (appears after step 0) */}
          {experimentStep >= 1 && (
            <>
              {/* Dish base */}
              <div style={{
                position: 'absolute',
                bottom: TABLE_H,
                left: '50%',
                transform: 'translateX(-50%)',
                width: DISH_OUTER_W,
                height: DISH_FLOOR_T,
                background: 'linear-gradient(180deg, #c8d6df, #a3b8c4)',
                borderRadius: '0 0 6px 6px',
                boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
              }} />

              {/* Left wall */}
              <div style={{
                position: 'absolute',
                bottom: TABLE_H + DISH_FLOOR_T,
                left: '50%',
                transform: 'translateX(-50%)',
                marginLeft: -DISH_OUTER_W / 2,
                width: WALL_T,
                height: INNER_H,
                background: 'linear-gradient(90deg, rgba(160,185,200,0.6), rgba(200,218,230,0.2))',
                borderRadius: '0 0 0 5px',
              }}>
                <div style={{ position: 'absolute', top: '12%', left: 3, width: 2, bottom: '12%', background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.6) 30%, rgba(255,255,255,0.6) 70%, transparent)', borderRadius: 1 }} />
              </div>

              {/* Right wall */}
              <div style={{
                position: 'absolute',
                bottom: TABLE_H + DISH_FLOOR_T,
                left: '50%',
                transform: 'translateX(-50%)',
                marginLeft: DISH_OUTER_W / 2 - WALL_T,
                width: WALL_T,
                height: INNER_H,
                background: 'linear-gradient(270deg, rgba(160,185,200,0.6), rgba(200,218,230,0.2))',
                borderRadius: '0 0 5px 0',
              }}>
                <div style={{ position: 'absolute', top: '12%', right: 3, width: 2, bottom: '12%', background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.6) 30%, rgba(255,255,255,0.6) 70%, transparent)', borderRadius: 1 }} />
              </div>
            </>
          )}

          {/* WATER in dish - ONLY VISIBLE when water added (step 3+) */}
          {experimentStep >= 2 && beakerWaterLevel > 0 && (
            <div style={{
              position: 'absolute',
              bottom: TABLE_H + DISH_FLOOR_T,
              left: '49%',
              transform: 'translateX(-49%)',
              width: INNER_W,
              height: waterH,
              background: 'linear-gradient(180deg, rgba(66,153,225,0.35) 0%, rgba(56,130,195,0.65) 100%)',
              borderRadius: '0 0 4px 4px',
              transition: 'height 0.3s ease',  // slower transition to see changes
              zIndex: 1,
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: '6%',
                right: '6%',
                height: 2,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7) 30%, rgba(255,255,255,0.7) 70%, transparent)',
                animation: 'shimmer 2.4s ease-in-out infinite',
              }} />
              <div style={{
                position: 'absolute',
                bottom: 6,
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '0.68rem',
                fontWeight: 700,
                color: '#fff',
                whiteSpace: 'nowrap',
                background: 'rgba(0,70,120,0.6)',
                padding: '2px 10px',
                borderRadius: 8,
                textShadow: '0 1px 2px rgba(0,0,0,0.4)',
              }}>
                Distilled Water ({beakerWaterLevel.toFixed(0)}%)
              </div>
            </div>
          )}

          {/* POTATO (LARGER, rises with water, displaces it) */}
          {experimentStep >= 2 && (
            <div style={{
              position: 'absolute',
              bottom: potatoBottom,
              left: '50%',
              transform: 'translateX(-50%)',
              width: POT_W,
              height: POT_H,
              zIndex: 2,
              transition: 'bottom 0.3s ease',  // smooth rising
            }}>
              {/* Potato body */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, #ecc94b 0%, #d69e2e 50%, #b7791f 100%)',
                borderRadius: '48% 48% 45% 45% / 50% 50% 35% 35%',
                border: '3px solid #975a16',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }} />

              {/* U-shaped scoop */}
              <div style={{
                position: 'absolute',
                top: -8,
                left: '50%',
                transform: 'translateX(-50%)',
                width: SCOOP_W,
                height: SCOOP_H,
                background: 'linear-gradient(180deg, #f4f7fa 0%, #c9c1b6 100%)',
                borderRadius: '12% 12% 50% 50%',
                overflow: 'hidden',
              }}>
                {/* TODO:SALT HEAP (before osmosis) */}
                {/* {experimentStep >= 4 && !isTimerRunning && ( */}
                {experimentStep >= 4 ? (
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: SCOOP_W,
                    // height: saltH,
                    height: `${Math.min(saltH, (SCOOP_H - 50))}px`,
                    // height: 48,
                    background: 'pink',
                    backgroundSize: 'cover',
                    borderRadius: '0 0 50% 50%',
                  }}>
                  </div>
                ) : <></>}

                {/* SALT crystals rising (osmosis) */}
                {isTimerRunning && (
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: `${Math.min(saltH, (SCOOP_H - 50))}px`,
                    background: `linear-gradient(180deg, rgba(246,173,85,0.6) 0%, rgba(237,137,54,0.85) 100%)`,
                    transition: 'height 1s linear',  // match timer interval
                    borderRadius: '0 0 48% 48%',
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: '10%',
                      right: '10%',
                      height: 2,
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.65) 40%, rgba(255,255,255,0.65) 60%, transparent)',
                      animation: 'shimmer 1.8s ease-in-out infinite',
                    }} />
                    {saltH > 8 && (
                      <div style={{
                        position: 'absolute',
                        top: 3,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: clr.green,
                        color: '#fff',
                        fontSize: '0.58rem',
                        fontWeight: 700,
                        padding: '2px 7px',
                        borderRadius: 7,
                        boxShadow: '0 1px 4px rgba(56,161,105,0.5)',
                        animation: 'bounce 0.5s ease-in-out infinite',
                        whiteSpace: 'nowrap',
                      }}>
                        RISING ↑
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* TODO: Osmosis complete badge */}
              {/* {experimentStep > 4 && (
                <div style={{
                  position: 'absolute',
                  top: -28,
                  right: -40,
                  background: clr.green,
                  color: '#fff',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: 10,
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 8px rgba(56,161,105,0.4)',
                }}>
                  ✓ OSMOSIS COMPLETE
                </div>
              )} */}
            </div>
          )}

          {/* WATER MOLECULES moving through potato shell (during osmosis) */}
          {isTimerRunning && beakerWaterLevel > 30 && (
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3 }}>
              {/* Molecules rise from beaker water, through potato bottom/sides into scoop [LEFT SIDE MOLECULES]*/}
              {[0, 1, 2, 3, 4, 5].map((i) => {
                const startX = (TABLE_W - INNER_W) / 2 + WALL_T + 30 + i * 22;
                const startY = TABLE_H + DISH_FLOOR_T + waterH - 200;
                return (
                  <div
                    key={`L${i}`}
                    style={{
                      position: 'absolute',
                      bottom: startY,
                      left: startX,
                      width: 7,
                      height: 7,
                      background: '#63b3ed',
                      borderRadius: '50%',
                      boxShadow: '0 0 6px rgba(66,153,225,0.8)',
                      animation: 'moleculeThroughShell 2.5s ease-in-out infinite',
                      animationDelay: `${i * 0.35}s`,
                      opacity: 0.9,
                    }}
                  />
                );
              })}
              {/* RIGHT SIDE MOLECULES */}
              {[0, 1, 2, 3, 4, 5].map((i) => {
                const startX = (TABLE_W + INNER_W) / 2 - WALL_T - 30 - i * 22;
                const startY = TABLE_H + DISH_FLOOR_T + waterH - 200;
                return (
                  <div
                    key={`R${i}`}
                    style={{
                      position: 'absolute',
                      bottom: startY,
                      left: startX,
                      width: 7,
                      height: 7,
                      background: '#63b3ed',
                      borderRadius: '50%',
                      boxShadow: '0 0 6px rgba(66,153,225,0.8)',
                      animation: 'moleculeThroughShellRight 2.5s ease-in-out infinite',
                      animationDelay: `${i * 0.3 + 0.2}s`,
                      opacity: 0.9,
                    }}
                  />
                );
              })}
            </div>
          )}

          {/* Progress bar (during osmosis) */}
          {isTimerRunning && (
            <div style={{
              position: 'absolute',
              bottom: TABLE_H + DISH_OUTER_H + 100,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 300,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4a5568' }}>Osmosis Progress</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: clr.primary }}>{potatoWaterLevel.toFixed(0)}%</span>
              </div>
              <div style={{ height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${potatoWaterLevel}%`,
                  background: `linear-gradient(90deg, ${clr.primary}, ${clr.green})`,
                  borderRadius: 4,
                  transition: 'width 1s linear',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4a5568' }}>Salt Level</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#d69e2e' }}>{potatoWaterLevel.toFixed(0)}%</span>
              </div>
            </div>
          )}

          {/* Timer display */}
          {isTimerRunning && (
            <div style={{
              position: 'absolute',
              top: 10,
              right: 10,
              background: clr.primary,
              color: 'white',
              padding: '7px 14px',
              borderRadius: '7px',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              zIndex: 4,
              boxShadow: '0 2px 6px rgba(0,119,182,0.4)',
            }}>
              ⏱️ {formatTime(timeElapsed)} / 30s
            </div>
          )}
        </div>

        {/* Empty state */}
        {experimentStep === 0 && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: clr.muted,
            padding: '3rem',
            pointerEvents: 'none',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧫</div>
            <h3 style={{ margin: '0 0 0.5rem', color: clr.primary }}>Empty Working Table</h3>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>Drag apparatus from the shelf to begin the experiment</p>
          </div>
        )}
      </div>
    );
  };

  /* ═══════════════ MAIN RETURN ═══════════════ */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 6em)', overflow: 'hidden' }}>
      {/* Main content area */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {renderLeftSidebar()}

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>

          {/* Working table */}
          {renderWorkingTable()}
        </div>
        {renderRightSidebar()}
      </div>

      {/* Controls */}
      {navigationButtons}

      {/* Animations */}
      <style>{`
        @keyframes moleculeThroughShell {
          0%   { transform: translate(0, 0) scale(1); opacity: 0.9; }
          25%  { transform: translate(15px, -25px) scale(1.15); opacity: 1; }
          50%  { transform: translate(30px, -55px) scale(1); opacity: 0.85; }
          75%  { transform: translate(42px, -85px) scale(0.8); opacity: 0.6; }
          100% { transform: translate(48px, -105px) scale(0.4); opacity: 0; }
        }
        @keyframes moleculeThroughShellRight {
          0%   { transform: translate(0, 0) scale(1); opacity: 0.9; }
          25%  { transform: translate(-15px, -25px) scale(1.15); opacity: 1; }
          50%  { transform: translate(-30px, -55px) scale(1); opacity: 0.85; }
          75%  { transform: translate(-42px, -85px) scale(0.8); opacity: 0.6; }
          100% { transform: translate(-48px, -105px) scale(0.4); opacity: 0; }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.5; transform: scaleX(0.85); }
          50%      { opacity: 1;   transform: scaleX(1); }
        }
        @keyframes waterStream {
          0%   { opacity: 0.7; transform: translateX(-50%) scaleY(0.95); }
          100% { opacity: 0.9; transform: translateX(-50%) scaleY(1.05); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%      { transform: translateX(-50%) translateY(-3px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.7; transform: scale(1.05); }
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
