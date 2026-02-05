import React, { useEffect, useState } from 'react';
import TheoryAcidBasePage from './overview/TheoryAcidBase';
import LearningOutcomesPage from './overview/LearningOutcomes';
import ApparatusPage from './overview/Apparatus';

const labName = 'Identifying Acids and Bases Using Indicators';

const sectionTitle = "Experiment oveview";
const sectionDescription = ""

// Subsection config
const SUBSECTIONS = [
  { id: 'theory', label: 'Theory', icon: '📘', Component: TheoryAcidBasePage },
  { id: 'outcomes', label: 'Learning Outcomes', icon: '🎯', Component: LearningOutcomesPage },
  { id: 'apparatus', label: 'Apparatus', icon: '⚙️', Component: ApparatusPage },
];

//Main
export default function OverviewAcidBase({ markComplete, navigationButtons }) {
  const [activeTab, setActiveTab] = useState(0);
  const isLastTab = activeTab === SUBSECTIONS.length - 1;

  // Mark the parent Overview section complete once the user lands on the final subsection
  useEffect(() => {
    if (isLastTab) {
      const timer = setTimeout(() => markComplete(), 2000);
      return () => clearTimeout(timer);
    }
  }, [isLastTab, markComplete]);

  const { Component } = SUBSECTIONS[activeTab];

  return (
    <div className="fade-in" style={{
      paddingTop: '2rem',
      paddingLeft: '2rem',
      paddingRight: '2rem',
    }}>
      {/* ── Page header ── */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#2d3748', margin: '0 0 0.25rem' }}>
          Welcome to {labName} Virtual Lab!
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#718096', margin: 0 }}>
          {SUBSECTIONS[activeTab].label}
        </p>
      </div>

      {/* ── Subsection tab bar ── */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.75rem',
          background: '#f0f4f8',
          borderRadius: '10px',
          padding: '0.35rem',
        }}
      >
        {SUBSECTIONS.map((sub, i) => {
          const isActive = activeTab === i;
          const isPast = i < activeTab;

          return (
            <button
              key={sub.id}
              onClick={() => setActiveTab(i)}
              style={{
                flex: 1,
                border: 'none',
                cursor: 'pointer',
                padding: '0.65rem 0.75rem',
                borderRadius: '8px',
                background: isActive ? 'white' : 'transparent',
                color: isActive ? '#0077B6' : isPast ? '#48bb78' : '#718096',
                fontSize: '0.88rem',
                fontWeight: isActive ? 700 : 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                boxShadow: isActive ? '0 2px 6px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <span>{sub.icon}</span>
              <span>{sub.label}</span>
              {isPast && <span style={{ fontSize: '0.75rem' }}>✓</span>}
            </button>
          );
        })}
      </div>

      {/* ── Active subsection content ── */}
      <Component />

      {/* ── Internal prev / next footer ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '2px solid #e2e8f0',
        }}
      >
        {/* Previous */}
        <button
          onClick={() => setActiveTab((p) => Math.max(p - 1, 0))}
          disabled={activeTab === 0}
          style={{
            border: '2px solid #0077B6',
            background: activeTab === 0 ? '#f0f4f8' : 'white',
            color: activeTab === 0 ? '#a0aec0' : '#0077B6',
            cursor: activeTab === 0 ? 'not-allowed' : 'pointer',
            padding: '0.6rem 1.25rem',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.9rem',
            transition: 'all 0.2s ease',
          }}
        >
          ← Previous
        </button>

        {/* Step indicator */}
        <span style={{ fontSize: '0.85rem', color: '#718096', fontWeight: 600 }}>
          {activeTab + 1} / {SUBSECTIONS.length}
        </span>

        {/* Next  ──OR──  parent "Next Section" once we're on Apparatus */}
        {isLastTab ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#48bb78', fontWeight: 600 }}>
              ✓ Overview Complete
            </span>
            {navigationButtons}
          </div>
        ) : (
          <button
            onClick={() => setActiveTab((p) => p + 1)}
            style={{
              border: 'none',
              background: '#0077B6',
              color: 'white',
              cursor: 'pointer',
              padding: '0.6rem 1.25rem',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#005A8C')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#0077B6')}
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}