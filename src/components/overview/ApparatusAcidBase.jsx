const apparatusContent = {
    description:
        'The following equipment and materials will be used throughout the virtual lab simulations. Familiarise yourself with each item before proceeding.',
    items: [

        {name: 'Test Tubes',icon: '🧪',use: 'Used to hold small quantities of solutions for testing with indicators.'},
        {name: 'Test Tube Rack',icon: '🧫',use: 'Supports and organizes test tubes upright on the laboratory bench.'},
        {name: 'Dropper / Pipette',icon: '💧',use: 'Transfers small amounts of solutions or indicators into test tubes.'},
        {name: 'Litmus Paper',icon: '📄',use: 'Acts as an indicator to detect whether a solution is acidic or basic by changing colour.'},
        {name: 'Solutions (Acid, Base, Neutral)',icon: '⚗️',use: 'Unknown or known solutions tested to determine their acidic, basic, or neutral nature.'},
        {name: 'Waste Container',icon: '🗑️',use: 'Used for safe disposal of used litmus paper and leftover solutions.'},
    ],
};

export default function ApparatusAcidBasePage() {
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
