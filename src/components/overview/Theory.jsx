export default function TheoryPage() {

  const labNarration = `Today, we'll explore how water moves in and out of cells. 
  Osmosis is the movement of water molecules across a semi-permeable membrane 
  from a less concentrated solution to a more concentrated one. Let's begin this exciting journey!`;


  const theoryContent = {
    summary:
      'Osmosis is the passive movement of water molecules through a semi-permeable membrane, driven by differences in solute concentration on either side.',
    points: [
      {
        title: 'What is Osmosis?',
        desc: 'Water molecules move from an area of low solute concentration (hypotonic) to an area of high solute concentration (hypertonic) until equilibrium is reached.',
      },
      {
        title: 'Semi-Permeable Membrane',
        desc: 'A barrier that selectively allows certain molecules — like water — to pass through while blocking larger solute particles.',
      },
      {
        title: 'Osmotic Pressure',
        desc: 'The pressure that must be applied to a solution to prevent the inward flow of water across a semi-permeable membrane.',
      },
      {
        title: 'Real-World Examples',
        desc: 'Plant roots absorb water from soil, kidney tubules reabsorb water during filtration, and red blood cells regulate volume — all via osmosis.',
      },
    ],
    keyConcepts: [
      { term: 'Semi-permeable Membrane', desc: 'Allows some molecules to pass through' },
      { term: 'Hypotonic Solution', desc: 'Lower concentration outside the cell' },
      { term: 'Hypertonic Solution', desc: 'Higher concentration outside the cell' },
      { term: 'Isotonic Solution', desc: 'Equal concentration inside and outside' },
    ],
  };

  return (
    <div>
      {/* Narration box */}
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
          border: '2px solid #667eea',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#2d3748', margin: 0, fontStyle: 'italic' }}>
          {labNarration}
        </p>
      </div>

      {/* Theory summary */}
      <p style={{ fontSize: '1.05rem', color: '#4a5568', lineHeight: 1.7, marginBottom: '1.5rem' }}>
        {theoryContent.summary}
      </p>

      {/* Theory points */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {theoryContent.points.map((point, i) => (
          <div
            key={i}
            style={{
              background: 'white',
              border: '2px solid #e2e8f0',
              borderRadius: '10px',
              padding: '1.25rem',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#0077B6';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,119,182,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <h4 style={{ margin: '0 0 0.4rem', color: '#0077B6' }}>{point.title}</h4>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#718096', lineHeight: 1.6 }}>{point.desc}</p>
          </div>
        ))}
      </div>

      {/* Key Concepts */}
      <div style={{ background: '#f7fafc', border: '2px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
        <h3 style={{ margin: '0 0 1rem', color: '#2d3748', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          💡 Key Concepts
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
          {theoryContent.keyConcepts.map((c, i) => (
            <div
              key={i}
              style={{ background: 'white', padding: '0.9rem', borderRadius: '8px', border: '2px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s ease' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <strong style={{ color: '#667eea', display: 'block', marginBottom: '0.3rem' }}>{c.term}</strong>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#718096' }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
