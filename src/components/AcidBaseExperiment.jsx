'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

// Step definitions for Acid-Base Litmus experiment
const STEPS = [
  {
    label: 'Place test tube on rack',
    icon: '🧪',
    hint: 'Drag a test tube from the shelf to the laboratory bench.'
  },
  {
    label: 'Select & pour solution',
    icon: '⚗️',
    hint: 'Choose a solution and drag the flask to pour into the test tube.'
  },
  {
    label: 'Insert litmus paper',
    icon: '📄',
    hint: 'Drag blue or red litmus paper into the solution.'
  },
  {
    label: 'Observe color change',
    icon: '👁️',
    hint: 'Click on the litmus paper to see the observation.'
  },
  {
    label: 'Record results',
    icon: '📝',
    hint: 'Enter your observations and predict the nature of the solution.'
  },
];

// Solution data
const SOLUTION_DATA = {
  lemon: { name: 'Lemon Juice', type: 'acid', color: '#fde68a' },
  vinegar: { name: 'Vinegar', type: 'acid', color: '#e5e7eb' },
  hcl: { name: 'Hydrochloric Acid (HCl)', type: 'acid', color: '#dbeafe' },
  soap: { name: 'Soap Solution', type: 'base', color: '#bfdbfe' },
  naoh: { name: 'Sodium Hydroxide (NaOH)', type: 'base', color: '#e0e7ff' },
  baking: { name: 'Baking Soda', type: 'base', color: '#f3f4f6' },
  water: { name: 'Distilled Water', type: 'neutral', color: '#e0f2fe' },
  salt: { name: 'Salt Solution', type: 'neutral', color: '#f1f5f9' }
};

// Main component
export default function AcidBaseExperiment({ markComplete, navigationButtons }) {
  // ── experiment state ──
  const [experimentStep, setExperimentStep] = useState(0);

  // ── apparatus state ──
  const [rackTubes, setRackTubes] = useState([true, true, true, true]); // tubes on shelf rack
  const [benchTubes, setBenchTubes] = useState([null, null, null, null]); // slots on bench rack
  const [selectedSolution, setSelectedSolution] = useState('');
  const [pouring, setPouring] = useState(false);
  const [pouringTubeIndex, setPouringTubeIndex] = useState(null);

  // ── observation state ──
  const [activeLitmusId, setActiveLitmusId] = useState(null);
  const [observationText, setObservationText] = useState('');
  const [litmusInput, setLitmusInput] = useState('');
  const [predictedNature, setPredictedNature] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedTubeForObservation, setSelectedTubeForObservation] = useState(0);

  // ── drag-and-drop state ──
  const [dragging, setDragging] = useState(null);
  const [dropping, setDropping] = useState(false);

  // ── refs ──
  const benchRef = useRef(null);

  // ── derived ──
  const isStepComplete = (stepIndex) => experimentStep > stepIndex;
  const isStepActive = (stepIndex) => experimentStep === stepIndex;

  // ── Trash can state ──
const [trashHover, setTrashHover] = useState(false); // lid open hover
const [disposedLitmus, setDisposedLitmus] = useState([]); // list of used litmus disposed

  
  // Get tubes that have been placed on bench
  const placedTubes = benchTubes.filter(t => t !== null);
  const hasAnyTubeWithSolution = placedTubes.some(t => t?.solution);
  const hasAnyTubeWithLitmus = placedTubes.some(t => t?.litmus?.length > 0);
  
  // Get first tube with solution for observation
  const tubeWithSolution = benchTubes.find(t => t?.solution);
  const actualResult = tubeWithSolution?.solution?.type || '';

  // ── step completion ──
  const completeStep = useCallback((step) => {
    setExperimentStep((prev) => Math.max(prev, step + 1));
    if (step === 4) {
      if (markComplete) markComplete();
    }
  }, [markComplete]);

  // ── reset experiment ──
  const resetExperiment = () => {
    setExperimentStep(0);
    setRackTubes([true, true, true, true]);
    setBenchTubes([null, null, null, null]);
    setSelectedSolution('');
    setPouring(false);
    setPouringTubeIndex(null);
    setActiveLitmusId(null);
    setObservationText('');
    setLitmusInput('');
    setPredictedNature('');
    setFeedbackText('');
    setShowAnswer(false);
    setSelectedTubeForObservation(0);
    setDragging(null);
    setDropping(false);
  };

  // ── drag handlers ──
  const handleDragStart = (e, item) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
    setDragging(item);
  };

  const handleDragEnd = () => {
    setDragging(null);
    setDropping(false);
    setPouring(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // ── drop tube on specific bench slot ──
  const handleDropOnBenchSlot = (slotIndex) => {
    if (!dragging || dragging.type !== 'tube') return;
    if (benchTubes[slotIndex] !== null) return; // slot already occupied

    // Mark tube as used on shelf rack
    setRackTubes(r => r.map((v, i) => (i === dragging.index ? 'ghost' : v)));

    // Add tube to specific bench slot
    setBenchTubes(t => {
      const copy = [...t];
      copy[slotIndex] = {
        id: Date.now(),
        originalIndex: dragging.index,
        solution: null,
        fill: 0,
        litmus: []
      };
      return copy;
    });

    // Complete step 0 on first tube placement
    if (experimentStep === 0) {
      completeStep(0);
    }

    setDragging(null);
    setDropping(false);
  };

  // ── pour solution into tube ──
  const startPour = (tubeIndex) => {
    if (!selectedSolution) return;
    if (!benchTubes[tubeIndex] || benchTubes[tubeIndex].solution) return;

    setPouring(true);
    setPouringTubeIndex(tubeIndex);
    let fill = 0;

    const interval = setInterval(() => {
      fill += 5;
      setBenchTubes(t => {
        const copy = [...t];
        if (copy[tubeIndex]) {
          copy[tubeIndex] = { ...copy[tubeIndex], fill };
        }
        return copy;
      });

      if (fill >= 70) {
        clearInterval(interval);
        setPouring(false);
        setPouringTubeIndex(null);

        setBenchTubes(t => {
          const copy = [...t];
          if (copy[tubeIndex]) {
            copy[tubeIndex] = {
              ...copy[tubeIndex],
              solution: SOLUTION_DATA[selectedSolution]
            };
          }
          return copy;
        });

        // Complete step 1 on first solution pour
        if (experimentStep === 1) {
          completeStep(1);
        }
      }
    }, 80);
  };

  // ── insert litmus paper ──
  const insertLitmus = (tubeIndex, litmusColor) => {
    const tube = benchTubes[tubeIndex];
    if (!tube?.solution || tube.litmus.length >= 2) return;

    const isBlue = litmusColor === 'blue';
    const solutionType = tube.solution.type;

    let finalColor;
    let observation;

    if (solutionType === 'acid') {
      finalColor = '#dc2626';
      observation = isBlue ? 'Blue litmus turned RED → Acid detected!' : 'Red litmus shows no change in acid.';
    } else if (solutionType === 'base') {
      finalColor = '#2563eb';
      observation = isBlue ? 'Blue litmus shows no change in base.' : 'Red litmus turned BLUE → Base detected!';
    } else {
      finalColor = isBlue ? '#2563eb' : '#dc2626';
      observation = 'No color change → Neutral solution.';
    }

    const litmusId = Date.now();
    const newLitmus = {
      id: litmusId,
      original: isBlue ? '#2563eb' : '#dc2626',
      reacted: finalColor,
      shown: false,
      observation
    };

    setBenchTubes(t => t.map((tb, i) =>
      i === tubeIndex && tb
        ? { ...tb, litmus: [...tb.litmus, newLitmus] }
        : tb
    ));

    // Complete step 2 on first litmus insertion
    if (experimentStep === 2) {
      completeStep(2);
    }

    setTimeout(() => {
      setBenchTubes(t => t.map((tb, i) =>
        i === tubeIndex && tb
          ? {
            ...tb,
            litmus: tb.litmus.map(l =>
              l.id === litmusId ? { ...l, shown: true } : l
            )
          }
          : tb
      ));
    }, 800);
  };

  // ── show observation popup ──
  const showObservation = (litmusId, text, tubeIndex) => {
    setActiveLitmusId(litmusId);
    setObservationText(text);
    setSelectedTubeForObservation(tubeIndex);
    
    // Complete step 3 on first observation
    if (experimentStep === 3) {
      completeStep(3);
    }

    setTimeout(() => {
      setActiveLitmusId(null);
    }, 5000);
  };

  // ── evaluate student observation ──
  const evaluateObservation = () => {
    const tube = benchTubes[selectedTubeForObservation];
    if (!tube?.litmus?.length) {
      setFeedbackText('⚠️ No litmus paper in solution yet. Please insert litmus first.');
      return;
    }

    const litmus = tube.litmus[0];
    const actualColor = litmus.reacted === '#dc2626' ? 'red' :
      litmus.reacted === '#2563eb' ? 'blue' : 'no change';

    const input = litmusInput.trim().toLowerCase();

    let feedback = '';
    if (input === actualColor) {
      feedback = `✅ Correct! The submerged part of the litmus turned ${actualColor}.`;
      completeStep(4);
    } else if ((input === 'red' && actualColor === 'blue') || (input === 'blue' && actualColor === 'red')) {
      feedback = `❌ Not quite. You observed "${input}", but the color change is "${actualColor}". Remember: Blue litmus → Red in acid, Red litmus → Blue in base.`;
    } else {
      feedback = `❌ Incorrect. The actual color of the submerged part is "${actualColor}". Observe carefully!`;
    }

    setFeedbackText(feedback);
  };

  // ── color tokens ──
  const clr = {
    primary: '#0077B6',
    dark: '#005A8C',
    green: '#48bb78',
    orange: '#ed8936',
    red: '#e53e3e',
    muted: '#718096',
    bg: '#f7fafc',
    lightBg: '#ffffff',
    border: '#e2e8f0'
  };

  /* ═══════════ RENDER FUNCTIONS ═══════════ */

  /* Wooden Shelf Component */
  const WoodenShelf = () => (
    <div style={{
      position: 'relative',
      width: '100%',
      filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))',
      marginBottom: '1.5rem',
      marginTop: '0.5rem',
    }}>
      <div style={{
        height: 10,
        width: '100%',
background: `
  linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 30%),
  linear-gradient(160deg, #0b1e3a 0%, #132a52 25%, #1c3f75 50%, #132a52 75%, #0b1e3a 100%)
`,

        
        borderRadius: '4px 4px 0 0',
      }} />
      <div style={{
        height: 10,
        width: '100%',
background: `
  linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 30%),
  linear-gradient(160deg, #0b1e3a 0%, #132a52 25%, #1c3f75 50%, #132a52 75%, #0b1e3a 100%)
`,

        borderRadius: '0 0 4px 4px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
      }} />
    </div>
  );

  /* LEFT SIDEBAR - Steps Panel */
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
          Test solutions with litmus indicator
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

      {/* Quick Reference */}
      <div style={{
        margin: '0 0.75rem 1rem',
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        borderRadius: '8px',
        padding: '12px',
        border: '1px solid #f59e0b'
      }}>
        <h4 style={{ margin: '0 0 8px', fontSize: '0.85rem', color: '#92400e', fontWeight: 600 }}>
          💡 Quick Reference
        </h4>
        <div style={{ fontSize: '0.75rem', color: '#78350f', lineHeight: 1.6 }}>
          <div>🔴 <strong>Acid:</strong> Blue → Red</div>
          <div>🔵 <strong>Base:</strong> Red → Blue</div>
          <div>⚪ <strong>Neutral:</strong> No change</div>
        </div>
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

  /* RIGHT SIDEBAR - Apparatus Panel */
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
      boxShadow: '-2px 0 8px rgba(0,0,0,0.05)',
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
          ⚗️ Experiment Apparatus
        </h3>
        <p style={{
          margin: '0.5rem 0 0',
          fontSize: '0.8rem',
          color: clr.muted
        }}>
          Drag apparatus to the laboratory bench
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

        {/* Test Tube Rack on Shelf */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <p style={{ fontSize: '0.75rem', color: '#4a5568', fontWeight: 600, margin: '0 0 8px' }}>
            Test Tube Rack
          </p>
          
          {/* Rack Structure */}
          <div style={{
            position: 'relative',
            width: '200px',
            height: '170px',
          }}>
            {/* Rack Left Support */}
            <div style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: 15,
              height: 150,
              background: `linear-gradient(160deg, #0b1e3a 0%,#132a52 20%, #1c3f75 35%, #2a5aa3 45%, #1c3f75 55%, #132a52 70%, #0b1e3a 100%)`,
              boxShadow: `inset 0 3px 8px rgba(255,255,255,0.35), inset 0 -6px 14px rgba(0,0,0,0.65), 0 8px 18px rgba(0,0,0,0.4)`,
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '3px 0 0 3px',
            }} />
            
            {/* Rack Right Support */}
            <div style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: 15,
              height: 150,
              borderRadius: '0 3px 3px 0',
              background: `linear-gradient(160deg, #0b1e3a 0%,#132a52 20%, #1c3f75 35%, #2a5aa3 45%, #1c3f75 55%, #132a52 70%, #0b1e3a 100%)`,
              boxShadow: `inset 0 3px 8px rgba(255,255,255,0.35), inset 0 -6px 14px rgba(0,0,0,0.65), 0 8px 18px rgba(0,0,0,0.4)`,
              border: '1px solid rgba(255,255,255,0.2)'

            }} />

            {/* Rack Top Bar with Holes */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 8,
              right: 8,
              height: 27,
              marginTop:70,
              background: `linear-gradient(160deg, #0b1e3a 0%,#132a52 20%, #1c3f75 35%, #2a5aa3 45%, #1c3f75 55%, #132a52 70%, #0b1e3a 100%)`,
              boxShadow: `inset 0 3px 8px rgba(255,255,255,0.35), inset 0 -6px 14px rgba(0,0,0,0.65), 0 8px 18px rgba(0,0,0,0.4)`,
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '3px 3px 0 0',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '28px',
            }}>
              {[0, 1, 2, 3].map(i => (
                <div key={i} style={{
                  width: '22px',
                  height: '10px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle at 30% 30%,#f5f5f5 0%, #d6d6d6 25%, #a8a8a8 45%, #7a7a7a 65%, #4f4f4f 85%, #2f2f2f 100%)`,
                  boxShadow: `inset 0 6px 12px rgba(0,0,0,0.7), inset 0 -2px 4px rgba(255,255,255,0.25), 0 2px 6px rgba(0,0,0,0.4)`,
                  border: '1px solid rgba(255,255,255,0.25)',

                }} />
              ))}
            </div>

            {/* Rack Middle with Tubes */}
            <div style={{
              position: 'absolute',
              top: 18,
              left: 15,
              right: 15,
              bottom: 15,
              background: 'transparent',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              gap: '28px',
              paddingTop: '5px',
            }}>
              {rackTubes.map((v, i) => (
                <div
                  key={i}
                  draggable={v === true}
                  onDragStart={e => v === true && handleDragStart(e, { type: 'tube', index: i })}
                  onDragEnd={handleDragEnd}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    cursor: v === true ? 'grab' : 'not-allowed',
                    opacity: v === 'ghost' ? 0.3 : 1,
                    transition: 'all 0.3s',
                  }}
                >
                  {/* Test tube */}
                  <div style={{
                    width: '20px',
                    height: '115px',
                    marginTop: '15px',
                    background: v === 'ghost'
                      ? 'rgba(200,200,200,0.3)'
                      : 'linear-gradient(90deg, rgba(200,220,230,0.6), rgba(255,255,255,0.9), rgba(200,220,230,0.6))',
                    borderRadius: '4px 4px 10px 10px',
                    border: v === 'ghost' ? '1px dashed #aaa' : '1.5px solid rgba(100,150,180,0.4)',
                    boxShadow: v !== 'ghost' ? 'inset 0 0 8px rgba(255,255,255,0.5)' : 'none',
                    position: 'relative',
                  }}>
                    {/* Tube rim */}
                    {v !== 'ghost' && (
                      <div style={{
                        position: 'absolute',
                        top: '-2px',
                        left: '-2px',
                        right: '-2px',
                        height: '5px',
                        background: 'linear-gradient(180deg, #e2e8f0, #cbd5e1)',
                        borderRadius: '3px 3px 0 0',
                        border: '1px solid rgba(160, 180, 200, 0.5)',
                      }} />
                    )}
                  </div>
                  <span style={{ fontSize: '0.6rem', color: v === 'ghost' ? '#aaa' : '#4a5568' }}>
                    {v === 'ghost' ? '✓' : `${i + 1}`}
                  </span>
                </div>
              ))}
            </div>

            {/* Rack Bottom Base */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 8,
              right: 8,
              height: 15,
              background: `linear-gradient(160deg, #0b1e3a 0%,#132a52 20%, #1c3f75 35%, #2a5aa3 45%, #1c3f75 55%, #132a52 70%, #0b1e3a 100%)`,
              boxShadow: `inset 0 3px 8px rgba(255,255,255,0.35), inset 0 -6px 14px rgba(0,0,0,0.65), 0 8px 18px rgba(0,0,0,0.4)`,
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '0 0 3px 3px',
            }} />
          </div>

          <p style={{ fontSize: '0.65rem', color: clr.muted, textAlign: 'center', marginTop: '6px' }}>
            {rackTubes.every(v => v === 'ghost') ? 'All tubes placed' : 'Drag tubes to bench'}
          </p>
        </div>

        <WoodenShelf />

        {/* Round Bottom Flask */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}>
          <p style={{ fontSize: '0.75rem', color: '#4a5568', fontWeight: 600, margin: 0 }}>
            Round Bottom Flask
          </p>

          {/* Solution selector */}
          <select
            value={selectedSolution}
            onChange={e => setSelectedSolution(e.target.value)}
            style={{
              width: '90%',
              padding: '8px',
              borderRadius: '6px',
              border: `1px solid ${clr.border}`,
              fontSize: '0.8rem',
              cursor: 'pointer',
              background: 'white',
            }}
          >
            <option value="">Select solution...</option>
            {Object.entries(SOLUTION_DATA).map(([k, v]) => (
              <option key={k} value={k}>{v.name}</option>
            ))}
          </select>

          {/* Solution name tag */}
          {selectedSolution && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              background: 'white',
              borderRadius: '6px',
              border: `1px solid ${clr.border}`,
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            }}>
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: SOLUTION_DATA[selectedSolution].color,
                border: '1px solid #ccc'
              }} />
              <span style={{ fontSize: '0.75rem', color: '#4a5568', fontWeight: 600 }}>
                {SOLUTION_DATA[selectedSolution].name}
              </span>
            </div>
          )}

          {/* Flask visualization */}
          <div
            draggable={!!selectedSolution && placedTubes.length > 0}
            onDragStart={e => {
  if (selectedSolution && placedTubes.length > 0) {
    handleDragStart(e, { type: 'flask' });

    // create floating flask clone
    const rect = e.currentTarget.getBoundingClientRect();
    setFlaskDragPosition({
      x: rect.left,
      y: rect.top
    });
  }
}}

onDrag={(e) => {
  if (flaskDragPosition) {
    setFlaskDragPosition({
      x: e.clientX - 35,
      y: e.clientY - 35
    });
  }
}}

onDragEnd={() => {
  handleDragEnd();
  setFlaskDragPosition(null);
}}

style={{
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  cursor: selectedSolution && placedTubes.length > 0 ? 'grab' : 'not-allowed',
  opacity: selectedSolution && placedTubes.length > 0 ? 1 : 0.5,
  transition: 'transform 0.4s ease',
  transform: pouring
    ? 'translateX(40px) translateY(20px) rotate(-35deg)'
    : 'translateX(0px) translateY(0px) rotate(0deg)',
  transformOrigin: 'top center',
}}

          >
            {/* Flask neck */}
            <div style={{
              width: '16px',
              height: '25px',
              background: 'linear-gradient(90deg, rgba(200,220,230,0.8), rgba(255,255,255,0.9), rgba(200,220,230,0.8))',
              borderRadius: '3px 3px 0 0',
              border: '2px solid rgba(100,150,180,0.4)',
              borderBottom: 'none',
            }} />
            {/* Flask body */}
            <div style={{
              width: '70px',
              height: '70px',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(200,220,230,0.6) 100%)',
              borderRadius: '50%',
              border: '2px solid rgba(100,150,180,0.4)',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 'inset 0 0 20px rgba(255,255,255,0.5)',
            }}>
              {selectedSolution && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '60%',
                  background: SOLUTION_DATA[selectedSolution]?.color || '#e0f2fe',
                  borderRadius: '0 0 50% 50%',
                  transition: 'all 0.3s',
                }} />
              )}
            </div>
          </div>
          <span style={{ fontSize: '0.65rem', color: clr.muted }}>
            {placedTubes.length > 0 ? 'Drag to pour into tube' : 'Place tube first'}
          </span>
        </div>
{/* Pour stream */}
{pouring && (
  <div style={{
    position: 'absolute',
    bottom: '-40px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '8px',
    height: '50px',
    background: SOLUTION_DATA[selectedSolution]?.color || '#e0f2fe',
    borderRadius: '4px',
    opacity: 0.8,
    animation: 'pourFlow 0.4s infinite alternate',
  }} />
)}

    {/* Flask neck */}
    <div style={{
      width: '16px',
      height: '25px',
      background: 'linear-gradient(90deg, rgba(200,220,230,0.8), rgba(255,255,255,0.9), rgba(200,220,230,0.8))',
      borderRadius: '3px 3px 0 0',
      border: '2px solid rgba(100,150,180,0.4)',
      borderBottom: 'none',
      margin: '0 auto'
    }} />
    {/* Flask body */}
    <div style={{
      width: '70px',
      height: '70px',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(200,220,230,0.6) 100%)',
      borderRadius: '50%',
      border: '2px solid rgba(100,150,180,0.4)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60%',
        background: SOLUTION_DATA[selectedSolution]?.color || '#e0f2fe',
        borderRadius: '0 0 50% 50%',
      }} />
    </div>
  

        <WoodenShelf />

        {/* Litmus Papers */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <p style={{ fontSize: '0.75rem', color: '#4a5568', fontWeight: 600, margin: '0 0 8px' }}>
            Litmus Papers
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
          }}>
            {/* Blue Litmus */}
            <div
              draggable={hasAnyTubeWithSolution}
              onDragStart={e => handleDragStart(e, { type: 'litmus', color: 'blue' })}
              onDragEnd={handleDragEnd}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                cursor: hasAnyTubeWithSolution ? 'grab' : 'not-allowed',
                opacity: hasAnyTubeWithSolution ? 1 : 0.5,
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => hasAnyTubeWithSolution && (e.currentTarget.style.transform = 'translateY(-3px)')}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{
                width: '18px',
                height: '55px',
                background: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)',
                borderRadius: '2px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }} />
              <span style={{ fontSize: '0.7rem', color: '#4a5568', fontWeight: 600 }}>Blue</span>
            </div>

            {/* Red Litmus */}
            <div
              draggable={hasAnyTubeWithSolution}
              onDragStart={e => handleDragStart(e, { type: 'litmus', color: 'red' })}
              onDragEnd={handleDragEnd}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                cursor: hasAnyTubeWithSolution ? 'grab' : 'not-allowed',
                opacity: hasAnyTubeWithSolution ? 1 : 0.5,
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => hasAnyTubeWithSolution && (e.currentTarget.style.transform = 'translateY(-3px)')}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{
                width: '18px',
                height: '55px',
                background: 'linear-gradient(180deg, #ef4444 0%, #dc2626 100%)',
                borderRadius: '2px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }} />
              <span style={{ fontSize: '0.7rem', color: '#4a5568', fontWeight: 600 }}>Red</span>
            </div>
          </div>
          <p style={{ fontSize: '0.65rem', color: clr.muted, textAlign: 'center', marginTop: '6px' }}>
            {hasAnyTubeWithSolution ? 'Drag into solution' : 'Add solution first'}
          </p>
        </div>

        <WoodenShelf />
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

  /* WORKING TABLE - Main laboratory bench */
  const renderWorkingTable = () => {
    const TABLE_W = 900;
    const TABLE_H = 32;
    const RACK_WIDTH = 320;
    const RACK_HEIGHT = 240;

    return (
      <div
        ref={benchRef}
        onDragOver={handleDragOver}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '1rem 2rem 2rem',
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
          {experimentStep === 0 && '🧪 Drag test tubes from the shelf to the bench rack'}
          {experimentStep === 1 && '⚗️ Select a solution and drag the flask to pour'}
          {experimentStep === 2 && '📄 Drag litmus paper into the solution'}
          {experimentStep === 3 && '👁️ Click on the litmus paper to observe'}
          {experimentStep >= 4 && '📝 Record your observations below'}
        </div>

        {/* Reset button */}
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
          height: RACK_HEIGHT + TABLE_H + 60,
          margin: '0 auto',
          transform: 'translateY(-180px)', // 👈 MOVE UP (adjust this value)
        }}>

{/* Lower Table Layer */}
<div style={{
  position: 'absolute',
  bottom: 20, // slightly lower than upper table
  left: 0,
  right: 0,
  height: TABLE_H,
  background: 'linear-gradient(160deg, #081730 0%, #0b1e3a 100%)',
  borderRadius: '0 0 6px 6px',
  zIndex: 0,
}} />

{/* Upper Table Layer (existing) */}
<div style={{
  position: 'absolute',
  bottom: 40, // raise this higher than lower layer
  left: 0,
  right: 0,
  height: TABLE_H,
  background: `linear-gradient(160deg, #0b1e3a 0%,#132a52 20%, #1c3f75 35%, #2a5aa3 45%, #1c3f75 55%, #132a52 70%, #0b1e3a 100%)`,
  boxShadow: `inset 0 3px 8px rgba(255,255,255,0.35), inset 0 -6px 14px rgba(0,0,0,0.65), 0 8px 18px rgba(0,0,0,0.4)`,
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: '0 0 6px 6px',
  zIndex: 2,
}} />



          {/* Laboratory Bench (wooden table) */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: TABLE_H,
            background: `linear-gradient(160deg, #0b1e3a 0%,#132a52 20%, #1c3f75 35%, #2a5aa3 45%, #1c3f75 55%, #132a52 70%, #0b1e3a 100%)`,
            boxShadow: `inset 0 3px 8px rgba(255,255,255,0.35), inset 0 -6px 14px rgba(0,0,0,0.65), 0 8px 18px rgba(0,0,0,0.4)`,
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '0 0 6px 6px',
            
          }}>
            {[5, 12, 20, 30, 40, 50, 60, 70, 80, 88, 95].map((p) => (
              <div key={p} style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${p}%`,
                width: 1,
                background: 'rgba(0,0,0,0.08)'
              }} />
            ))}
          </div>



          

         {/* Table Legs */}
{[0, 1].map((side) => (
  <div
    key={side}
    style={{
      position: 'absolute',
      bottom: -200, // how long legs go down
      left: side === 0 ? 40 : TABLE_W - 60,
      width: 28,
      height: 200,
      background:
        'linear-gradient(160deg, #0a1f3a 0%, #132a52 30%, #1c3f75 60%, #0a1f3a 100%)',
      boxShadow:
        'inset 0 4px 10px rgba(255,255,255,0.25), inset 0 -6px 14px rgba(0,0,0,0.6), 0 6px 14px rgba(0,0,0,0.4)',
      borderRadius: '4px',
    }}
  />
))}



{/* Test Tube Rack on Bench */}
<div style={{
  position: 'absolute',
  bottom: TABLE_H + 30, // 40px higher than before
  left: '50%',
  transform: 'translateX(-50%)',
  width: RACK_WIDTH,
  height: RACK_HEIGHT,
}}>

            
            {/* Rack Left Support */}
            <div style={{
              position: 'absolute',
              left: -45,
              bottom: 0,
              width: 22,
              height: RACK_HEIGHT + 70,
              background: `linear-gradient(160deg, #0b1e3a 0%,#132a52 20%, #1c3f75 35%, #2a5aa3 45%, #1c3f75 55%, #132a52 70%, #0b1e3a 100%)`,
              boxShadow: `inset 0 3px 8px rgba(255,255,255,0.35), inset 0 -6px 14px rgba(0,0,0,0.65), 0 8px 18px rgba(0,0,0,0.4)`,
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '4px 0 0 4px',
              
            }} />

            {/* Rack Right Support */}
            <div style={{
              position: 'absolute',
              right: -45,
              bottom: 0,
              width: 22,
              height: RACK_HEIGHT + 70,
              background: `linear-gradient(160deg, #0b1e3a 0%,#132a52 20%, #1c3f75 35%, #2a5aa3 45%, #1c3f75 55%, #132a52 70%, #0b1e3a 100%)`,
              boxShadow: `inset 0 3px 8px rgba(255,255,255,0.35), inset 0 -6px 14px rgba(0,0,0,0.65), 0 8px 18px rgba(0,0,0,0.4)`,
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '0 4px 4px 0',
              
            }} />

            {/* Rack Top Bar with Holes */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: -32,
              right: -32,
              height: 22,
              background: `linear-gradient(160deg, #0b1e3a 0%,#132a52 20%, #1c3f75 35%, #2a5aa3 45%, #1c3f75 55%, #132a52 70%, #0b1e3a 100%)`,
              boxShadow: `inset 0 3px 8px rgba(255,255,255,0.35), inset 0 -6px 14px rgba(0,0,0,0.65), 0 8px 18px rgba(0,0,0,0.4)`,
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '4px 4px 0 0',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '42px'
            }}>
              {[0, 1, 2, 3].map(i => (
                <div key={i} style={{
                  width: '38px',
                  height: '14px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle at 30% 30%,#f5f5f5 0%, #d6d6d6 25%, #a8a8a8 45%, #7a7a7a 65%, #4f4f4f 85%, #2f2f2f 100%)`,
                  boxShadow: `inset 0 6px 12px rgba(0,0,0,0.7), inset 0 -2px 4px rgba(255,255,255,0.25), 0 2px 6px rgba(0,0,0,0.4)`,
                  border: '1px solid rgba(255,255,255,0.25)',

                }} />
              ))}
            </div>

            {/* Rack Middle Section with Tube Slots */}
            <div style={{
              position: 'absolute',
              top: 22,
              left: 22,
              right: 22,
              bottom: 22,
              background: 'transparent',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              gap: '42px',
              paddingTop: '12px',
            }}>
              {/* Test Tube Slots */}
              {[0, 1, 2, 3].map(slotIndex => {
                const tube = benchTubes[slotIndex];
                const isDropTarget = dragging?.type === 'tube' && tube === null;

                return (
                  <div
                    key={slotIndex}
                    style={{
                      width: '42px',
                      height: '300px',
                      position: 'relative',
                      marginTop:'-80px',
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (dragging?.type === 'tube' && tube === null) {
                        setDropping(true);
                      }
                    }}
                    onDragLeave={() => setDropping(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (dragging?.type === 'tube') {
                        handleDropOnBenchSlot(slotIndex);
                      } else if (dragging?.type === 'flask' && tube && !tube.solution) {
                        startPour(slotIndex);
                        setDragging(null);
                      } else if (dragging?.type === 'litmus' && tube?.solution) {
                        insertLitmus(slotIndex, dragging.color);
                        setDragging(null);
                      }
                    }}
                  >
                    {tube ? (
                      <>
                        {/* Tube Label */}
                        <div style={{
                          position: 'absolute',
                          top: '-70px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          color: '#4a5568',
                          whiteSpace: 'nowrap',
                          background: 'rgba(255,255,255,0.95)',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          zIndex: 5,
                        }}>
                          Tube {slotIndex + 1}
                        </div>

                        {/* Solution name tag above tube */}
                        {tube.solution && (
                          <div style={{
                            position: 'absolute',
                            top: '-44px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            fontSize: '0.6rem',
                            fontWeight: 600,
                            color: 'white',
                            whiteSpace: 'nowrap',
                            background: clr.primary,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                            zIndex: 6,
                          }}>
                            {tube.solution.name}
                          </div>
                        )}

                        {/* Test Tube Glass */}
                        <div style={{
                          width: '100%',
                          height: '89%',
                          
                          background: 'linear-gradient(90deg, rgba(200,220,230,0.4), rgba(255,255,255,0.85), rgba(200,220,230,0.4))',
                          
                          borderRadius: '4px 4px 10px 10px',


                          border: '2px solid rgba(100,150,180,0.5)',
                          position: 'relative',
                          overflow: 'hidden',
                          boxShadow: 'inset 0 0 15px rgba(255,255,255,0.5), 0 4px 8px rgba(0,0,0,0.15)',
                        }}>
                          {/* Tube rim */}
                          <div style={{
                            position: 'absolute',
                            top: '-4px',
                            left: '-3px',
                            right: '-3px',
                            height: '10px',
                            background: 'linear-gradient(180deg, #e2e8f0, #cbd5e1)',
                            borderRadius: '5px 5px 0 0',
                            border: '1px solid rgba(160, 180, 200, 0.5)',
                          }} />

                          {/* Liquid */}
                          {tube.fill > 0 && (
                            <div style={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              height: `${tube.fill}%`,
                              background: tube.solution?.color || '#e0f2fe',
                              borderRadius: '4px 4px 10px 10px',

                              transition: 'height 0.3s ease',
                            }}>
                              {/* Water shimmer */}
                              <div style={{
                                position: 'absolute',
                                top: 0,
                                left: '10%',
                                right: '10%',
                                height: '2px',
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7) 30%, rgba(255,255,255,0.7) 70%, transparent)',
                                animation: 'shimmer 2.4s ease-in-out infinite',
                              }} />
                            </div>
                          )}

                          {/* Litmus papers in tube */}
                          {tube.litmus.map((l, idx) => (
                            <div
                              key={l.id}
                              onClick={() => {
                                if (!l.shown) {
                                  setBenchTubes(t => t.map((tb, ti) =>
                                    ti === slotIndex && tb
                                      ? {
                                        ...tb,
                                        litmus: tb.litmus.map(x =>
                                          x.id === l.id ? { ...x, shown: true } : x
                                        )
                                      }
                                      : tb
                                  ));
                                }
                                showObservation(l.id, l.observation, slotIndex);
                              }}
                              style={{
                                position: 'absolute',
                                left: idx === 0 ? '18%' : '52%',
                                top: '6%',
                                width: '11px',
                                height: '85px',
                                cursor: 'pointer',
                                zIndex: 5,
                                transition: 'transform 0.3s',
                              }}
                              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                            >
                              {/* Top part (above liquid) */}
                              <div style={{
                                width: '100%',
                                height: '35%',
                                background: l.original,
                                borderRadius: '2px 2px 0 0',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                              }} />
                              {/* Bottom part (in liquid - reacted) */}
                              <div style={{
                                width: '100%',
                                height: '65%',
                                background: l.shown ? l.reacted : l.original,
                                borderRadius: '0 0 2px 2px',
                                transition: 'background 0.8s ease',
                              }} />

                              {/* Observation popup */}
                              {activeLitmusId === l.id && (
                                <div style={{
                                  position: 'absolute',
                                  top: '-70px',
                                  left: '50%',
                                  transform: 'translateX(-50%)',
                                  background: 'white',
                                  padding: '10px 14px',
                                  borderRadius: '8px',
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                  fontSize: '0.75rem',
                                  fontWeight: 500,
                                  color: '#2d3748',
                                  whiteSpace: 'nowrap',
                                  zIndex: 20,
                                  border: `2px solid ${clr.primary}`,
                                }}>
                                  {observationText}
                                  <div style={{
                                    position: 'absolute',
                                    bottom: '-8px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: 0,
                                    height: 0,
                                    borderLeft: '8px solid transparent',
                                    borderRight: '8px solid transparent',
                                    borderTop: `8px solid ${clr.primary}`,
                                  }} />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      /* Empty slot - drop target */
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          border: `2px dashed ${isDropTarget ? clr.green : 'rgba(100,100,100,0.25)'}`,
                          borderRadius: '6px 6px 50% 50%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: isDropTarget ? 'rgba(72,187,120,0.1)' : 'transparent',
                          transition: 'all 0.3s',
                        }}
                      >
                        <span style={{
                          fontSize: '0.65rem',
                          color: isDropTarget ? clr.green : '#999',
                          textAlign: 'center',
                          fontWeight: isDropTarget ? 600 : 400,
                        }}>
                          {isDropTarget ? 'Drop here!' : `Slot ${slotIndex + 1}`}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

              {/* Rack Bottom Base */}
<div
  style={{
    position: 'absolute',
    bottom: 0,
    left: -32,
    right: -32,
    height: 42, // slightly taller to fit holes nicely
    background:'linear-gradient(145deg, #0a1f3a 0%, #1a2b4e 20%, #0f2340 40%, #17305a 60%, #0a1f3a 80%, #1b2c4f 100%)',
    boxShadow:'inset 0 4px 12px rgba(255,255,255,0.3), inset 0 -4px 12px rgba(0,0,0,0.6), 0 4px 10px rgba(0,0,0,0.4)',
    borderRadius: '0 0 6px 6px',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '0 40px',
  }}
>
  {[0, 1, 2, 3].map((_, i) => (
    <div
      key={i}
      style={{
        width: 38,
        height: 14,
        borderRadius: '50%',
        background: `radial-gradient( circle at 30% 30%, #f5f5f5 0%, #d6d6d6 25%, #a8a8a8 45%, #7a7a7a 65%, #4f4f4f 85%, #2f2f2f 100%)`,
        boxShadow: `inset 0 6px 12px rgba(0,0,0,0.8),inset 0 -2px 4px rgba(255,255,255,0.3),0 2px 6px rgba(0,0,0,0.4)`,
        border: '1px solid rgba(255,255,255,0.25)',
      }}
    />
  ))}
</div>
</div>

          {/* Pouring animation */}
          {pouring && pouringTubeIndex !== null && (
            <div style={{
              position: 'absolute',
              top: '5%',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <div style={{
                width: '8px',
                height: '80px',
                background: SOLUTION_DATA[selectedSolution]?.color || '#e0f2fe',
                borderRadius: '4px',
                animation: 'stream 0.3s ease-in-out infinite',
                boxShadow: '0 0 8px rgba(66,153,225,0.4)',
              }} />
            </div>
          )}
        </div>



        {/* Observation & Results Panel */}
        {experimentStep >= 3 && hasAnyTubeWithLitmus && (
          <div style={{
            width: '100%',
            maxWidth: '700px',
            marginTop: '1.5rem',
            background: 'white',
            borderRadius: '12px',
            padding: '1.25rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            border: `1px solid ${clr.border}`,
          }}>
            <h4 style={{
              margin: '0 0 1rem',
              color: clr.primary,
              fontSize: '1rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              📝 Observation & Results
            </h4>

            {/* Tube selector for observation */}
            {placedTubes.filter(t => t?.litmus?.length > 0).length > 1 && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.85rem', color: '#4a5568', fontWeight: 500 }}>
                  Select Tube to Evaluate:
                </label>
                <select
                  value={selectedTubeForObservation}
                  onChange={e => setSelectedTubeForObservation(parseInt(e.target.value))}
                  style={{
                    marginLeft: '10px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: `1px solid ${clr.border}`,
                    fontSize: '0.85rem',
                  }}
                >
                  {benchTubes.map((t, i) => t?.litmus?.length > 0 && (
                    <option key={i} value={i}>Tube {i + 1} - {t.solution?.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {/* Litmus Color Input */}
              <div>
                <label style={{ fontSize: '0.85rem', color: '#4a5568', fontWeight: 500 }}>
                  Submerged Litmus Color:
                </label>
                <input
                  type="text"
                  placeholder="Red / Blue / No change"
                  value={litmusInput}
                  onChange={e => setLitmusInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: `1px solid ${clr.border}`,
                    marginTop: '6px',
                    fontSize: '0.9rem',
                  }}
                />
                <button
                  onClick={evaluateObservation}
                  style={{
                    marginTop: '8px',
                    padding: '8px 16px',
                    background: clr.primary,
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  Check Observation
                </button>
              </div>

              {/* Predicted Nature */}
              <div>
                <label style={{ fontSize: '0.85rem', color: '#4a5568', fontWeight: 500 }}>
                  Predicted Nature:
                </label>
                <select
                  value={predictedNature}
                  onChange={e => setPredictedNature(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: `1px solid ${clr.border}`,
                    marginTop: '6px',
                    fontSize: '0.9rem',
                  }}
                >
                  <option value="">Select...</option>
                  <option value="acid">Acid</option>
                  <option value="base">Base</option>
                  <option value="neutral">Neutral</option>
                </select>
                <button
                  onClick={() => setShowAnswer(!showAnswer)}
                  style={{
                    marginTop: '8px',
                    padding: '8px 16px',
                    background: showAnswer ? clr.green : '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  👁️ {showAnswer ? 'Hide' : 'Reveal'} Answer
                </button>
              </div>
            </div>

            {/* Feedback */}
            {feedbackText && (
              <div style={{
                marginTop: '1rem',
                padding: '12px',
                borderRadius: '8px',
                background: feedbackText.includes('✅') ? 'rgba(72,187,120,0.1)' : 'rgba(239,68,68,0.1)',
                border: `1px solid ${feedbackText.includes('✅') ? clr.green : clr.red}`,
                fontSize: '0.9rem',
                color: feedbackText.includes('✅') ? '#276749' : '#c53030',
              }}>
                {feedbackText}
              </div>
            )}

            {/* Answer reveal */}
            {showAnswer && benchTubes[selectedTubeForObservation]?.solution && (
              <div style={{
                marginTop: '1rem',
                padding: '12px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%)',
                border: `1px solid ${clr.green}`,
              }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#276749', marginBottom: '6px' }}>
                  Actual Result: <span style={{ textTransform: 'uppercase' }}>
                    {benchTubes[selectedTubeForObservation].solution.type}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#2f855a' }}>
                  {benchTubes[selectedTubeForObservation].solution.type === 'acid' && '🔴 Acids turn blue litmus paper red. They have a pH less than 7.'}
                  {benchTubes[selectedTubeForObservation].solution.type === 'base' && '🔵 Bases turn red litmus paper blue. They have a pH greater than 7.'}
                  {benchTubes[selectedTubeForObservation].solution.type === 'neutral' && '⚪ Neutral solutions do not change litmus color. They have a pH of 7.'}
                </div>
                {predictedNature && (
                  <div style={{
                    marginTop: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: predictedNature === benchTubes[selectedTubeForObservation].solution.type ? '#276749' : '#c53030',
                  }}>
                    {predictedNature === benchTubes[selectedTubeForObservation].solution.type
                      ? '✅ Your prediction was correct!'
                      : `❌ Your prediction "${predictedNature}" was incorrect.`}
                  </div>
                )}
              </div>
            )}
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
          {renderWorkingTable()}
        </div>

        {renderRightSidebar()}
      </div>

      {/* Navigation buttons */}
      {navigationButtons}
    </div>
  );
}
