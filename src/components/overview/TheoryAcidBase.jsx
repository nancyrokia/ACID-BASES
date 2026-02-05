export default function TheoryAcidBasePage() {

  const labNarration = `In this virtual laboratory, we will learn how to identify acids, bases, and neutral solutions using indicators.
  Indicators help us observe chemical properties through visible colour changes.
  Let’s explore how litmus paper makes this possible!`;


  const theoryContent = {
    summary:
      'Acids, bases, and neutral substances can be identified using indicators, which show characteristic colour changes when they react with different solutions.',
    points: [
      {
        title: 'What Are Acids and Bases?',
        desc: 'Water molecules move from an area of low solute concentration (hypotonic) to an area of high solute concentration (hypertonic) until equilibrium is reached.',
      },
      {
        title: 'Indicators',
        desc: 'A barrier that selectively allows certain molecules — like water — to pass through while blocking larger solute particles.',
      },
      {
        title: 'Litmus Paper',
        desc: 'The pressure that must be applied to a solution to prevent the inward flow of water across a semi-permeable membrane.',
      },
      {
        title: 'Why Colour Changes Occur',
        desc: 'Plant roots absorb water from soil, kidney tubules reabsorb water during filtration, and red blood cells regulate volume — all via osmosis.',
      },
    ],

     

    keyConcepts: [
      { term: 'Acid', desc: 'A substance that turns blue litmus paper red.' },
      { term: 'Base', desc: 'A substance that turns red litmus paper blue.' },
      { term: 'Neutral Solution', desc: 'A solution that causes no change in litmus paper colour.' },
      { term: 'Litmus Paper', desc: 'A natural indicator used to test whether a solution is acidic or basic.' },
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

