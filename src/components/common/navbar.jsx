export default function TopBar({
    sections,
    currentSection,
    completedSections,
    onSectionChange,
    labTitle,
    strand,
    substrand,
}) {
    return (
        <header
            style={{
                background: '#0077B6',
                color: 'white',
                padding: '1rem 2rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '2rem',
                    flexWrap: 'wrap',
                }}
            >
                {/* Lab Info */}
                <div>
                    <h1
                        style={{
                            margin: 0,
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                        }}
                    >
                        🔬 {labTitle}
                    </h1>
                    <div
                        style={{
                            fontSize: '0.75rem',
                            opacity: 0.9,
                            marginTop: '0.25rem',
                        }}
                    >
                        {strand} • {substrand}
                    </div>
                </div>

                {/* Horizontal Nav */}
                <nav
                    style={{
                        display: 'flex',
                        gap: '0.5rem',
                        flexWrap: 'wrap',
                    }}
                >
                    {sections.map((section, index) => {
                        const isActive = currentSection === index;
                        const isDone = completedSections.includes(index);

                        return (
                            <button
                                key={section.id}
                                onClick={() => onSectionChange(index)}
                                style={{
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '0.6rem 1rem',
                                    borderRadius: '999px',
                                    background: isActive ? 'white' : 'rgba(255,255,255,0.15)',
                                    color: isActive ? '#0077B6' : 'white',
                                    fontSize: '0.85rem',
                                    fontWeight: isActive ? 700 : 500,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    transition: 'all 0.2s ease',
                                }}
                                title={section.name}
                            >
                                <span>{section.icon}</span>
                                <span>{section.name}</span>
                                {isDone && <span>✓</span>}
                            </button>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
}