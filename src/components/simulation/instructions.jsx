import React, { useState, useEffect, useRef, useCallback } from 'react';

// Apparatus data for Osmosis experiment
const APPARATUS = [
  {
    id: 'potato',
    name: 'Potato',
    icon: '🥔',
    desc: 'U-shaped scooped potato with semi-permeable membrane',
    activeAtStep: 0,
  },
  {
    id: 'petri',
    name: 'Petri Dish',
    icon: '🧫',
    desc: 'Glass dish to hold distilled water',
    activeAtStep: 1,
  },
  {
    id: 'water',
    name: 'Distilled Water',
    icon: '💧',
    desc: 'Water with lower solute concentration',
    activeAtStep: 2,
  },
  {
    id: 'salt',
    name: 'Salt Crystals',
    icon: '🧂',
    desc: 'Sodium chloride to create hypertonic solution',
    activeAtStep: 4,
  },
];

// Step definitions for Osmosis experiment
const STEPS = [
  {
    label: 'Place petri dish',
    icon: '🧫',
    hint: 'Drag petri dish from shelf to working table.'
  },
  {
    label: 'Add distilled water',
    icon: '💧',
    hint: 'Add distilled water to the petri dish.'
  },
  {
    label: 'Place potato in dish',
    icon: '🥔',
    hint: 'Place scooped potato in petri dish with side profile view.'
  },
  {
    label: 'Add salt crystals',
    icon: '🧂',
    hint: 'They put some salt solution into the scoop'
  },
  {
    label: 'Observe osmosis',
    icon: '👁️',
    hint: 'Watch water level rise over 30 seconds.'
  },
];

// Helper functions
const formatTime = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

// Main component
export default function PotatoExperiment({ markComplete, navigationButtons }) {
  // ── experiment state ──
  const [experimentStep, setExperimentStep] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [waterLevel, setWaterLevel] = useState(0);
  const [potatoWaterLevel, setPotatoWaterLevel] = useState(0);
  const [componentsOnTable, setComponentsOnTable] = useState([]);
  const [observation, setObservation] = useState('');
  const [userExplanation, setUserExplanation] = useState('');

  // ── drag-and-drop state ──
  const [dragging, setDragging] = useState(null);
  const [dropping, setDropping] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });

  // ── refs ──
  const canvasRef = useRef(null);
  const tableRef = useRef(null);
  const timerRef = useRef(null);

  // ── derived ──
  const isStepComplete = (stepIndex) => experimentStep > stepIndex;
  const isStepActive = (stepIndex) => experimentStep === stepIndex;

  // ── step completion ──
  const completeStep = (step) => {
    setExperimentStep((prev) => Math.max(prev, step + 1));
    if (step === 5) {
      markComplete();
    }
  };

  // ── timer effect for osmosis simulation ──
  useEffect(() => {
    if (experimentStep === 5 && !isTimerRunning) {
      setIsTimerRunning(true);
      setTimeElapsed(0);
      setPotatoWaterLevel(0);

      const osmosisTimer = setInterval(() => {
        setTimeElapsed((prev) => {
          const newTime = prev + 1;
          // Water rises gradually over 30 seconds
          setPotatoWaterLevel(Math.min(100, (newTime / 30) * 100));

          if (newTime >= 30) {
            clearInterval(osmosisTimer);
            setIsTimerRunning(false);
            return 30;
          }
          return newTime;
        });
      }, 1000);

      timerRef.current = osmosisTimer;
      return () => clearInterval(osmosisTimer);
    }
  }, [experimentStep, isTimerRunning]);

  // ── drag handlers ──
  const handleDragStart = (e, itemId) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', itemId);
    setDragging(itemId);

    // Calculate relative position for dragging visual
    const rect = e.currentTarget.getBoundingClientRect();
    setDragPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleDragEnd = () => {
    setDragging(null);
    setDropping(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDropping(true);

    const itemId = e.dataTransfer.getData('text/plain');

    // Check if component can be placed at current step
    if (itemId === 'petri' && experimentStep === 0) {
      setComponentsOnTable([...componentsOnTable, 'petri']);
      setTimeout(() => {
        completeStep(0);
        setDropping(false);
      }, 500);
    }
    else if (itemId === 'water' && experimentStep === 1 && componentsOnTable.includes('petri')) {
      setWaterLevel(100);
      setTimeout(() => {
        completeStep(1);
        setDropping(false);
      }, 500);
    }
    else if (itemId === 'potato' && experimentStep === 2 && componentsOnTable.includes('petri')) {
      setComponentsOnTable([...componentsOnTable, 'potato']);
      setTimeout(() => {
        completeStep(2);
        setDropping(false);
      }, 500);
    }
    else if (itemId === 'salt' && experimentStep === 3 && componentsOnTable.includes('potato')) {
      setComponentsOnTable([...componentsOnTable, 'salt']);
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

  const handleDrag = useCallback((e) => {
    if (dragging && e.clientX !== 0 && e.clientY !== 0) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        setDragPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    }
  }, [dragging]);

  useEffect(() => {
    if (dragging) {
      document.addEventListener('mousemove', handleDrag);
      return () => document.removeEventListener('mousemove', handleDrag);
    }
  }, [dragging, handleDrag]);

  const resetExperiment = () => {
    clearInterval(timerRef.current);
    setExperimentStep(0);
    setTimeElapsed(0);
    setIsTimerRunning(false);
    setWaterLevel(0);
    setPotatoWaterLevel(0);
    setComponentsOnTable([]);
    setObservation('');
    setUserExplanation('');
  };

  // ── shared style tokens ──
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

  /* LEFT SIDEBAR - Light Themed */
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

  /* APPARATUS SHELF */
  const renderApparatusShelf = () => (
    <div style={{
      padding: '1rem',
      background: 'linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%)',
      borderBottom: `1px solid ${clr.border}`,
      borderRadius: '8px 8px 0 0',
      margin: '0 1rem',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem'
      }}>
        <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#4a5568', fontWeight: 600 }}>
          🧪 Apparatus Shelf - Drag items to the working table
        </h4>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '1rem',
      }}>
        {APPARATUS.map((item) => {
          const canDrag = item.activeAtStep <= experimentStep;
          const isOnTable = componentsOnTable.includes(item.id);

          return (
            <div
              key={item.id}
              draggable={canDrag && !isOnTable}
              onDragStart={(e) => canDrag && !isOnTable && handleDragStart(e, item.id)}
              onDragEnd={handleDragEnd}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '0.75rem',
                background: canDrag ? 'white' : '#f7fafc',
                border: `2px solid ${canDrag ? (isOnTable ? clr.green : clr.border) : '#e2e8f0'}`,
                borderRadius: '8px',
                cursor: canDrag && !isOnTable ? 'grab' : 'not-allowed',
                opacity: canDrag ? 1 : 0.6,
                transition: 'all 0.2s',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                if (canDrag && !isOnTable) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (canDrag && !isOnTable) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {isOnTable && (
                <div style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  background: clr.green,
                  color: 'white',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                }}>
                  ✓
                </div>
              )}

              <div style={{
                fontSize: '2rem',
                marginBottom: '0.5rem',
                opacity: isOnTable ? 0.5 : 1
              }}>
                {item.icon}
              </div>

              <div style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#2d3748',
                textAlign: 'center',
                marginBottom: '0.25rem'
              }}>
                {item.name}
              </div>

              <div style={{
                fontSize: '0.75rem',
                color: clr.muted,
                textAlign: 'center',
                lineHeight: 1.3
              }}>
                {item.desc}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  /* WORKING TABLE - Petridish with Potato */
  const renderWorkingTable = () => (
    <div
      ref={tableRef}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
        margin: '1rem',
        borderRadius: '12px',
        border: `2px dashed ${dropping ? clr.green : clr.border}`,
        transition: 'all 0.3s',
        minHeight: '400px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
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
        {experimentStep === 1 && 'Add distilled water to the petri dish'}
        {experimentStep === 2 && 'Place the scooped potato in the dish'}
        {experimentStep === 3 && 'Add salt crystals to the potato scoop'}
        {experimentStep >= 4 && 'Observing osmosis process...'}
      </div>

      {/* Petri Dish */}
      {componentsOnTable.includes('petri') && (
        <div style={{
          position: 'relative',
          width: '300px',
          height: '200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}>
          {/* Petri Dish Container */}
          <div style={{
            width: '250px',
            height: '40px',
            background: 'linear-gradient(180deg, #e2e8f0 0%, #cbd5e0 100%)',
            borderRadius: '50%',
            border: '3px solid #a0aec0',
            position: 'relative',
            zIndex: 1,
          }}>
            {/* Water in petri dish */}
            {waterLevel > 0 && (
              <div style={{
                position: 'absolute',
                bottom: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                width: `${100 - (100 - waterLevel)}%`,
                height: '30px',
                background: 'linear-gradient(180deg, rgba(66,153,225,0.7) 0%, rgba(56,130,195,0.9) 100%)',
                borderRadius: '50%',
                transition: 'width 0.5s ease',
                zIndex: 2,
              }}>
                <div style={{
                  position: 'absolute',
                  top: '5px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                }}>
                  Distilled Water
                </div>
              </div>
            )}
          </div>

          {/* Potato in dish - side profile view */}
          {componentsOnTable.includes('potato') && (
            <div style={{
              position: 'absolute',
              bottom: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '180px',
              height: '100px',
              zIndex: 3,
            }}>
              {/* Potato body */}
              <div style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #ecc94b, #d69e2e)',
                borderRadius: '50% 50% 30% 30%',
                border: '3px solid #975a16',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}>
                {/* Scooped section (U-shaped) */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '120px',
                  height: '60px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '0 0 50% 50%',
                  border: '2px dashed #975a16',
                  borderTop: 'none',
                  overflow: 'hidden',
                }}>
                  {/* Salt crystals in scoop */}
                  {componentsOnTable.includes('salt') && (
                    <>
                      <div style={{
                        position: 'absolute',
                        bottom: '0',
                        left: '0',
                        width: '100%',
                        height: `${potatoWaterLevel}%`,
                        background: 'linear-gradient(180deg, rgba(246,173,85,0.8) 0%, rgba(237,137,54,0.9) 100%)',
                        borderRadius: '0 0 50% 50%',
                        transition: 'height 1s linear',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                      }}>
                        {potatoWaterLevel > 10 && 'Salt Solution'}
                      </div>

                      {/* Salt crystals floating */}
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          style={{
                            position: 'absolute',
                            top: `${10 + i * 15}%`,
                            left: `${10 + i * 25}%`,
                            width: '8px',
                            height: '8px',
                            background: 'white',
                            borderRadius: '2px',
                            transform: 'rotate(45deg)',
                            animation: `float 2s ease-in-out infinite ${i * 0.3}s`,
                            opacity: 0.8,
                          }}
                        />
                      ))}
                    </>
                  )}
                </div>
              </div>

              {/* Water movement animation */}
              {experimentStep >= 4 && (
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '100%',
                  height: '40px',
                  pointerEvents: 'none',
                }}>
                  {/* Water molecules moving from dish to potato */}
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        bottom: '0',
                        left: `${20 + i * 30}%`,
                        width: '6px',
                        height: '6px',
                        background: '#4299e1',
                        borderRadius: '50%',
                        animation: `waterFlow 2s ease-in-out infinite ${i * 0.2}s`,
                        boxShadow: '0 0 8px rgba(66,153,225,0.8)',
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Osmosis progress indicator */}
          {experimentStep >= 4 && (
            <div style={{
              position: 'absolute',
              top: '-40px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(26,32,44,0.9)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              zIndex: 4,
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                background: clr.green,
                borderRadius: '50%',
                animation: 'pulse 1s infinite'
              }} />
              Osmosis in Progress: {potatoWaterLevel.toFixed(0)}%
            </div>
          )}

          {/* Time indicator */}
          {isTimerRunning && (
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: clr.primary,
              color: 'white',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              zIndex: 4,
            }}>
              ⏱️ {formatTime(timeElapsed)} / 30s
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!componentsOnTable.includes('petri') && (
        <div style={{
          textAlign: 'center',
          color: clr.muted,
          padding: '3rem',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧫</div>
          <h3 style={{ margin: '0 0 0.5rem', color: clr.primary }}>
            Empty Working Table
          </h3>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            Drag apparatus from the shelf to begin the experiment
          </p>
        </div>
      )}
    </div>
  );

  /* OBSERVATIONS PANEL */
  const renderObservations = () => (
    experimentStep >= 4 ? (
      <div style={{
        background: 'white',
        border: `2px solid ${clr.primary}`,
        borderRadius: '12px',
        padding: '1.5rem',
        margin: '1rem',
        animation: 'fadeIn 0.4s ease',
      }}>
        <h3 style={{
          margin: '0 0 1rem',
          color: clr.primary,
          fontSize: '1.2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          📝 Record Your Observations
        </h3>

        <div style={{ display: 'grid', gap: '1rem' }}>
          {/* Measurement cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '12px',
            marginBottom: '1rem'
          }}>
            {[
              {
                label: 'WATER IN DISH',
                value: `${waterLevel}%`,
                sub: 'Distilled Water Level',
                color: '#4299e1'
              },
              {
                label: 'SOLUTION IN POTATO',
                value: `${potatoWaterLevel.toFixed(1)}%`,
                sub: 'Salt Solution Level',
                color: '#ed8936'
              },
              {
                label: 'TIME ELAPSED',
                value: formatTime(timeElapsed),
                sub: 'Osmosis Duration',
                color: clr.green
              },
              {
                label: 'EXPERIMENT STEP',
                value: `${experimentStep + 1}/${STEPS.length}`,
                sub: 'Current Progress',
                color: clr.primary
              },
            ].map((c) => (
              <div key={c.label} style={{
                background: '#f7fafc',
                borderRadius: '8px',
                padding: '0.75rem',
                border: `2px solid ${c.color}40`,
                transition: 'all 0.3s',
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: c.color,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '4px'
                }}>
                  {c.label}
                </div>
                <div style={{
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  color: '#2d3748',
                  marginBottom: '4px'
                }}>
                  {c.value}
                </div>
                <div style={{
                  fontSize: '0.7rem',
                  color: c.color,
                  fontWeight: 600
                }}>
                  {c.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Observation textarea */}
          <div>
            <label style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: '#2d3748',
              marginBottom: '8px',
              display: 'block'
            }}>
              What did you observe about the water movement?
            </label>
            <textarea
              value={observation}
              onChange={e => setObservation(e.target.value)}
              placeholder="I observed that the water level in the potato scoop rose from 0% to ___% over 30 seconds. This shows that water moved from the petri dish (high water concentration) into the potato scoop (low water concentration)..."
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '0.75rem',
                borderRadius: '8px',
                border: `2px solid ${clr.border}`,
                fontSize: '0.9rem',
                fontFamily: 'inherit',
                resize: 'vertical',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s',
              }}
              onFocus={(e) => e.target.style.borderColor = clr.primary}
              onBlur={(e) => e.target.style.borderColor = clr.border}
            />
          </div>

          {/* Explanation textarea */}
          <div>
            <label style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: '#2d3748',
              marginBottom: '8px',
              display: 'block'
            }}>
              Explain why this happened (use: osmosis, semi-permeable membrane, concentration):
            </label>
            <textarea
              value={userExplanation}
              onChange={e => setUserExplanation(e.target.value)}
              placeholder="This demonstrates osmosis - the movement of water molecules through the semi-permeable membrane of the potato cells. Water moved from an area of high concentration (distilled water in petri dish) to an area of low concentration (salt solution in potato scoop)..."
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '0.75rem',
                borderRadius: '8px',
                border: `2px solid ${clr.border}`,
                fontSize: '0.9rem',
                fontFamily: 'inherit',
                resize: 'vertical',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s',
              }}
              onFocus={(e) => e.target.style.borderColor = clr.primary}
              onBlur={(e) => e.target.style.borderColor = clr.border}
            />
          </div>
        </div>
      </div>
    ) : null
  );

  /* SCIENTIFIC EXPLANATION */
  const renderExplanation = () => (
    experimentStep >= 5 ? (
      <div style={{
        background: 'linear-gradient(135deg, #48bb78, #38a169)',
        color: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        margin: '1rem',
        animation: 'fadeIn 0.4s ease',
      }}>
        <h3 style={{
          margin: '0 0 1rem',
          fontSize: '1.2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          🔬 Scientific Explanation
        </h3>
        <div style={{ lineHeight: 1.6 }}>
          <p style={{ margin: '0 0 0.75rem' }}>
            <strong>What happened:</strong> Water moved by <strong>osmosis</strong> from the distilled water (high water concentration, low solute concentration) through the <strong>semi-permeable membrane</strong> of the potato cells into the salt solution (low water concentration, high solute concentration).
          </p>
          <p style={{ margin: '0 0 0.75rem' }}>
            <strong>Key Observations:</strong> The water level in the potato scoop rose from 0% to {potatoWaterLevel.toFixed(1)}% as water entered. The distilled water level decreased as water moved out of the petri dish.
          </p>
          <p style={{ margin: 0 }}>
            <strong>Conclusion:</strong> This experiment demonstrates how osmosis works in living cells. The potato cells act as semi-permeable membranes allowing water to pass through but not salt, resulting in net water movement into the area of higher solute concentration.
          </p>
        </div>
      </div>
    ) : null
  );

  // Dragging visual
  const renderDraggingVisual = () => (
    dragging && (
      <div style={{
        position: 'fixed',
        left: dragPosition.x,
        top: dragPosition.y,
        pointerEvents: 'none',
        zIndex: 1000,
        transform: 'translate(-50%, -50%)',
      }}>
        <div style={{
          fontSize: '2rem',
          opacity: 0.8,
          filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))',
        }}>
          {APPARATUS.find(a => a.id === dragging)?.icon}
        </div>
      </div>
    )
  );

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden'
    }}>
      {/* Main content area */}
      <div style={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden'
      }}>
        {renderLeftSidebar()}

        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto'
        }}>
          {/* Header */}
          <div style={{
            padding: '1rem 1.5rem',
            background: 'white',
            borderBottom: `1px solid ${clr.border}`,
          }}>
            <h1 style={{
              margin: 0,
              fontSize: '1.5rem',
              color: '#2d3748',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              🥔 VirtualLab: Potato Osmosis Experiment
            </h1>
            <p style={{
              margin: '0.5rem 0 0',
              fontSize: '0.9rem',
              color: clr.muted
            }}>
              Simulate osmosis by setting up the experiment with drag and drop
            </p>
          </div>

          {/* Apparatus shelf */}
          {renderApparatusShelf()}

          {/* Working table */}
          {renderWorkingTable()}
        </div>
      </div>

      {/* Observations and explanation */}
      <div style={{
        flex: '0 0 auto',
        maxHeight: '40vh',
        overflow: 'auto',
        borderTop: `1px solid ${clr.border}`,
        background: '#f7fafc'
      }}>
        {renderObservations()}
        {renderExplanation()}
      </div>

      {/* Controls */}
      <div style={{
        padding: '1rem',
        background: 'white',
        borderTop: `1px solid ${clr.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
      }}>
        <div>
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
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          {navigationButtons}
        </div>
      </div>

      {/* Dragging visual */}
      {renderDraggingVisual()}

      {/* Animations */}
      <style>{`
        @keyframes waterFlow {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translateY(-60px) scale(0.5);
            opacity: 0;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(45deg);
          }
          50% {
            transform: translateY(-5px) rotate(45deg);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.05);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        * {
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        }
      `}</style>
    </div>
  );
}