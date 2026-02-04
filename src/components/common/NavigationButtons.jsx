import React from 'react';

export default function NavigationButtons({ currentSection, totalSections, onNext, onPrevious }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '3rem',
      paddingTop: '2rem',
      paddingLeft: '2rem',
      paddingRight: '2rem',
      borderTop: '2px solid #e2e8f0'
    }}>
      <button
        onClick={onPrevious}
        disabled={currentSection === 0}
        style={{
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          fontWeight: 600,
          border: '2px solid #cbd5e0',
          background: 'white',
          color: '#4a5568',
          borderRadius: '8px',
          cursor: currentSection === 0 ? 'not-allowed' : 'pointer',
          opacity: currentSection === 0 ? 0 : 1,
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
        onMouseEnter={(e) => {
          if (currentSection !== 0) {
            e.target.style.background = '#f7fafc';
            e.target.style.borderColor = '#667eea';
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'white';
          e.target.style.borderColor = '#cbd5e0';
        }}
      >
        ← Previous Section
      </button>

      <button
        onClick={onNext}
        disabled={currentSection === totalSections - 1}
        style={{
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          fontWeight: 600,
          border: 'none',
          background: currentSection === totalSections - 1 ? '#cbd5e0' : '#0066cc',
          color: 'white',
          borderRadius: '8px',
          cursor: currentSection === totalSections - 1 ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          boxShadow: currentSection === totalSections - 1 ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.4)'
        }}
        onMouseEnter={(e) => {
          if (currentSection !== totalSections - 1) {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.5)';
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
        }}
      >
        Next Section →
      </button>
    </div>
  );
}