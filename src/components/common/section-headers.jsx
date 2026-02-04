export default function SectionHeader({
  title,
  description,
  narration,
}) {
  // Render nothing if no content is provided
  if (!title && !description && !narration) return null

  return (
    <>
      {(title || description) && (
        <div style={{ textAlign: 'start' }}>
          {title && (
            <h1
              style={{
                fontSize: '2.5rem',
                color: '#2d3748',
                marginBottom: description ? '1rem' : 0,
              }}
            >
              {title}
            </h1>
          )}

          {description && (
            <p
              style={{
                fontSize: '1.25rem',
                color: '#718096',
                margin: '1rem'
              }}
            >
              {description}
            </p>
          )}
        </div>
      )}

      {/* Narration Text Box */}
      {narration && (
        <div
          style={{
            background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
            border: '2px solid #667eea',
            borderRadius: '12px',
            padding: '8px',
            margin: '1rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
            }}
          >
            <span style={{ fontSize: '2rem' }}>💬</span>
            <p
              style={{
                fontSize: '1.1rem',
                lineHeight: '1.8',
                color: '#2d3748',
                margin: 0,
                fontStyle: 'italic',
              }}
            >
              {narration}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
