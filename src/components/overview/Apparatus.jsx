const apparatusContent = {
    description:
        'The following equipment and materials will be used throughout the virtual lab simulations. Familiarise yourself with each item before proceeding.',
    items: [
        { name: 'Potato Slices', icon: '🥔', use: 'Used as a biological semi-permeable membrane to observe osmosis in a living tissue.' },
        { name: 'Beakers / Containers', icon: '🧪', use: 'Hold the solutions (water, salt water, sugar water) in which the potato samples are submerged.' },
        { name: 'Solutions', icon: '💧', use: 'Hypotonic (pure water), isotonic, and hypertonic (salt/sugar) solutions to compare osmotic effects.' },
        { name: 'Balance / Scale', icon: '⚖️', use: 'Measures the mass of potato samples before and after submersion to quantify water gain or loss.' },
        { name: 'Timer', icon: '⏱️', use: 'Tracks elapsed time so results can be recorded at consistent intervals.' },
        { name: 'Ruler', icon: '📏', use: 'Measures dimensional changes (swelling or shrinkage) of potato samples over time.' },
    ],
};

export default function ApparatusPage() {
    const { description, items } = apparatusContent;

    return (
        <div>
            <p style={{ fontSize: '1.05rem', color: '#4a5568', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                {description}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {items.map((item, i) => (
                    <div
                        key={i}
                        style={{
                            background: 'white',
                            border: '2px solid #e2e8f0',
                            borderRadius: '10px',
                            padding: '1.25rem',
                            display: 'flex',
                            gap: '1rem',
                            alignItems: 'flex-start',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#ed8936';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(237,137,54,0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#e2e8f0';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <span style={{ fontSize: '2rem', lineHeight: 1 }}>{item.icon}</span>
                        <div>
                            <h4 style={{ margin: '0 0 0.3rem', color: '#2d3748' }}>{item.name}</h4>
                            <p style={{ margin: 0, fontSize: '0.88rem', color: '#718096', lineHeight: 1.5 }}>{item.use}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
