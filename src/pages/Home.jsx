import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        background: '#f7fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div
        style={{
          maxWidth: '900px',
          width: '100%',
          background: 'white',
          borderRadius: '14px',
          padding: '3rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        }}
      >
        {/* Header */}
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ margin: 0, fontSize: '2.2rem' }}>
            🔬 Virtual Science Laboratories(G2)
          </h1>
          <p style={{ marginTop: '0.75rem', color: '#4a5568', lineHeight: 1.6 }}>
            These interactive virtual laboratories are designed to support the
            teaching and learning of science through inquiry, experimentation,
            and conceptual understanding, in line with modern pedagogical
            practices promoted by <strong>CEMASTEA</strong>.
          </p>
        </header>

        {/* Description */}
        <section style={{ marginBottom: '2.5rem' }}>
          <p style={{ color: '#2d3748', lineHeight: 1.7 }}>
            Learners are guided through structured laboratory experiences that
            include background theory, simulations, and formative assessments.
            These virtual labs complement physical experiments by allowing
            learners to visualize processes, test ideas safely, and reflect on
            outcomes at their own pace.
          </p>
        </section>

        {/* Lab selection */}
        <section>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>
            Select a Laboratory
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {/* Osmosis Lab */}
            <div
              onClick={() => navigate('/labs/osmosis')}
              style={{
                cursor: 'pointer',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.5rem',
                transition: 'all 0.2s ease',
              }}
            >
              <h3 style={{ marginTop: 0 }}>🧪 Osmosis Experiment</h3>
              <p style={{ color: '#4a5568', lineHeight: 1.5 }}>
                Explore the movement of water across semi-permeable membranes
                using a guided potato strip simulation. Includes pre-test,
                simulation, and post-test.
              </p>
            </div>

            {/* Acid–Base Lab */}
            <div
              onClick={() => navigate('/labs/acid-bases')}
              style={{
                cursor: 'pointer',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.5rem',
                opacity: 0.85,
              }}
            >
              <h3 style={{ marginTop: 0 }}>⚗️ Acids and Bases</h3>
              <p style={{ color: '#4a5568', lineHeight: 1.5 }}>
                Investigate the properties of acids and bases, indicators, and
                pH changes through interactive experimentation.
              </p>
              <p style={{ fontSize: '0.85rem', color: '#718096' }}>
                (Coming soon)
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ marginTop: '3rem', fontSize: '0.85rem', color: '#718096' }}>
          Developed to support effective science instruction and learner
          engagement in line with CEMASTEA-guided professional practice.
        </footer>
      </div>
    </div>
  );
}

