import React, { useState } from 'react';
import SectionHeader from './common/section-headers';


const sectionTitle = "Test your knowledge";
const sectionDescription = " Answer the following questions before starting the lab. This helps us understand your current knowledge level. Don't worry if you don't know all the answers!";
const QUESTIONS = [
    {
        q: 'What is osmosis?',
        options: [
            'Movement of any molecules across a membrane',
            'Movement of water across a semi-permeable membrane',
            'Movement of salt particles through cells',
            'The diffusion of gases in air'
        ],
        answer: 1  // Movement of water across a semi-permeable membrane
    },
    {
        q: 'What is a semi-permeable membrane?',
        options: [
            'A membrane that blocks all substances',
            'A membrane that allows everything to pass through',
            'A membrane that selectively allows certain molecules to pass',
            'A type of cell wall found only in plants'
        ],
        answer: 2  // A membrane that selectively allows certain molecules to pass
    },
    {
        q: 'What happens to a plant cell placed in pure water?',
        options: [
            'It shrinks',
            'It stays the same',
            'It swells and becomes turgid',
            'It dissolves'
        ],
        answer: 2  // It swells and becomes turgid
    },
    {
        q: 'Which solution has a higher concentration of solutes than the cell?',
        options: [
            'Hypotonic solution',
            'Hypertonic solution',
            'Isotonic solution',
            'Distilled water'
        ],
        answer: 1  // Hypertonic solution
    }
];

export default function PreTest({ answers, setAnswers, score, setScore, markComplete, navigationButtons }) {
    const [submitted, setSubmitted] = useState(score !== null);

    const handleSelect = (qIdx, oIdx) => {
        if (submitted) return;
        setAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
    };

    const handleSubmit = () => {
        let s = 0;
        QUESTIONS.forEach((q, i) => {
            if (answers[i] === q.answer) s++;
        });
        setScore(s);
        setSubmitted(true);
        markComplete();
    };

    const allAnswered = QUESTIONS.every((_, i) => answers[i] !== undefined);

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', gap: '1.5rem',
            paddingTop: '2rem',
            paddingLeft: '2rem',
            paddingRight: '2rem',
            marginBottom: '2rem'
        }}>

            <SectionHeader title={sectionTitle} description={sectionDescription} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {QUESTIONS.map((q, qIdx) => {
                    const selected = answers[qIdx];
                    const isCorrect = submitted && selected === q.answer;
                    const isWrong = submitted && selected !== undefined && selected !== q.answer;

                    return (
                        <div
                            key={qIdx}
                            style={{
                                background: 'white',
                                border: `2px solid ${submitted
                                    ? (isCorrect ? '#48bb78' : isWrong ? '#f56565' : '#e2e8f0')
                                    : '#e2e8f0'
                                    }`,
                                borderRadius: '12px',
                                padding: '1.5rem'
                            }}
                        >
                            <p style={{
                                fontWeight: 600,
                                color: '#2d3748',
                                marginBottom: '1rem',
                                fontSize: '1.05rem'
                            }}>
                                Question {qIdx + 1}: {q.q}
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {q.options.map((opt, oIdx) => {
                                    const isSel = selected === oIdx;
                                    const isAns = submitted && oIdx === q.answer;

                                    let backgroundColor = 'white';
                                    let borderColor = '#e2e8f0';

                                    if (isSel && !submitted) {
                                        backgroundColor = '#ebf4ff';
                                        borderColor = '#4299e1';
                                    }
                                    if (submitted && isAns) {
                                        backgroundColor = '#f0fff4';
                                        borderColor = '#48bb78';
                                    }
                                    if (submitted && isSel && !isAns) {
                                        backgroundColor = '#fff5f5';
                                        borderColor = '#f56565';
                                    }

                                    return (
                                        <button
                                            key={oIdx}
                                            onClick={() => handleSelect(qIdx, oIdx)}
                                            disabled={submitted}
                                            style={{
                                                width: '100%',
                                                textAlign: 'left',
                                                padding: '0.75rem 1rem',
                                                borderRadius: '8px',
                                                border: `2px solid ${borderColor}`,
                                                background: backgroundColor,
                                                cursor: submitted ? 'not-allowed' : 'pointer',
                                                transition: 'all 0.2s ease',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem'
                                            }}
                                            onMouseOver={(e) => {
                                                if (!submitted) {
                                                    e.currentTarget.style.background = '#f7fafc';
                                                }
                                            }}
                                            onMouseOut={(e) => {
                                                if (!submitted) {
                                                    e.currentTarget.style.background = isSel ? '#ebf4ff' : 'white';
                                                }
                                            }}
                                        >
                                            <span style={{
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '50%',
                                                border: `2px solid ${isSel
                                                    ? (submitted && !isAns ? '#f56565' : '#4299e1')
                                                    : '#cbd5e0'
                                                    }`,
                                                background: isSel
                                                    ? (submitted && !isAns ? '#f56565' : '#4299e1')
                                                    : 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0
                                            }}>
                                                {isSel && (
                                                    <span style={{
                                                        width: '8px',
                                                        height: '8px',
                                                        borderRadius: '50%',
                                                        background: 'white'
                                                    }}></span>
                                                )}
                                            </span>

                                            <span style={{
                                                fontSize: '0.95rem',
                                                color: '#2d3748',
                                                flex: 1
                                            }}>
                                                {opt}
                                            </span>

                                            {submitted && isAns && isSel && (
                                                <span style={{
                                                    color: '#48bb78',
                                                    fontSize: '1rem',
                                                    fontWeight: 'bold'
                                                }}>
                                                    ✓
                                                </span>
                                            )}
                                            {submitted && isAns && !isSel && (
                                                <span style={{
                                                    color: '#48bb78',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 600
                                                }}>
                                                    ← Correct
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Submit button */}
            {!submitted && (
                <button
                    onClick={handleSubmit}
                    disabled={!allAnswered}
                    style={{
                        // width: '100%',
                        width: '20%',
                        padding: '1rem',
                        borderRadius: '8px',
                        background: allAnswered
                            ? 'linear-gradient(135deg, #0077B6 0%, #005A8C 100%)'
                            : '#cbd5e0',
                        color: 'white',
                        border: 'none',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        cursor: allAnswered ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s ease',
                        boxShadow: allAnswered ? '0 4px 12px rgba(102, 126, 234, 0.4)' : 'none'
                    }}
                >
                    Submit Pre-Test
                </button>
            )}

            {/* Score display */}
            {submitted && (
                <div style={{
                    borderRadius: '12px',
                    padding: '1.5rem',
                    textAlign: 'center',
                    background: score === QUESTIONS.length
                        ? 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)'
                        : 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
                    color: 'white',
                    animation: 'fadeIn 0.5s ease'
                }}>
                    <p style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        margin: '0 0 0.5rem 0'
                    }}>
                        Your Pre-Test Score: {score}/{QUESTIONS.length}
                    </p>
                    <p style={{
                        fontSize: '1rem',
                        margin: 0,
                        opacity: 0.95
                    }}>
                        {score === QUESTIONS.length
                            ? '🎉 Perfect! You already have a great understanding of osmosis basics!'
                            : score >= 3
                                ? '👍 Good knowledge! The lab will help reinforce and expand your understanding.'
                                : score >= 2
                                    ? '📚 Some knowledge detected! The lab will help clarify these concepts.'
                                    : '💡 No worries! The lab is designed to teach you everything you need to know.'}
                    </p>
                </div>
            )}

            <style>
                {`
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}
            </style>

            {navigationButtons}
        </div>
    );
}
