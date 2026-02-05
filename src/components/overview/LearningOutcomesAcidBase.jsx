const learningOutcomesContent = {
    outcome: 'Identify and distinguish between acidic, basic, and neutral solutions using indicators through interactive virtual experiments',
    objectives: [
        'Understand the properties of acids, bases, and neutral substances',
        'Observe colour changes produced by indicators',
        'Relate indicator behaviour to solution nature',
    ],
    activities: [
        'Drag and place test tubes on the laboratory bench',
        'Pour different solutions into test tubes',
        'Test solutions using red and blue litmus paper',
        'Observe and record colour changes',
        'Predict and verify whether a solution is acidic, basic, or neutral',
    ],
};


// ── Sub-page components ─────────────────────────────────────────────────────
export default function LearningOutcomesAcidBasePage() {
    const { outcome, objectives, activities } = learningOutcomesContent;

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {/* Outcome */}
            <div style={{ background: 'linear-gradient(135deg, #0077B6 0%, #005A8C 100%)', color: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎯</div>
                <h3 style={{ marginTop: 0, fontSize: '1.25rem' }}>Learning Outcome</h3>
                <p style={{ margin: 0, opacity: 0.95 }}>{outcome}</p>
            </div>

            {/* Objectives */}
            <div style={{ background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', color: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📖</div>
                <h3 style={{ marginTop: 0, fontSize: '1.25rem' }}>What You'll Learn</h3>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', opacity: 0.95 }}>
                    {objectives.map((o, i) => <li key={i}>{o}</li>)}
                </ul>
            </div>

            {/* Activities */}
            <div style={{ background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)', color: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔬</div>
                <h3 style={{ marginTop: 0, fontSize: '1.25rem' }}>Lab Activities</h3>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', opacity: 0.95 }}>
                    {activities.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
            </div>
        </div>
    );
}
