import React, { useState } from 'react';
import SectionHeader from './common/section-headers';


const sectionTitle = "✅ Post-Test";
const sectionDescription = "Now that you've completed the osmosis lab, let's see how much you've learned! This post-test will assess your understanding of the key concepts.";

const QUESTIONS = [
    {
        q: 'What happens to a plant cell in a hypotonic solution?',
        options: [
            'It shrinks and becomes plasmolyzed',
            'It swells and becomes turgid',
            'It stays the same size',
            'It bursts immediately'
        ],
        answer: 1  // It swells and becomes turgid
    },
    {
        q: 'Why do animal cells burst in freshwater while plant cells do not?',
        options: [
            'Animal cells are smaller',
            'Plant cells have a rigid cell wall that prevents bursting',
            'Animal cells absorb more water',
            'Plant cells cannot perform osmosis'
        ],
        answer: 1  // Plant cells have a rigid cell wall that prevents bursting
    },
    // {
    //     q: 'In the potato experiment, why did the salt solution level rise?',
    //     options: [
    //         'Salt evaporated and created more volume',
    //         'The potato produced water',
    //         'Water moved by osmosis from distilled water through potato cells into the salt solution',
    //         'The potato absorbed the salt'
    //     ],
    //     answer: 2  // Water moved by osmosis from distilled water through potato cells into the salt solution
    // },
    // {
    //     q: 'What is the process called when plant cells lose water in a hypertonic solution?',
    //     options: [
    //         'Turgidity',
    //         'Plasmolysis',
    //         'Cytolysis',
    //         'Hydration'
    //     ],
    //     answer: 1  // Plasmolysis
    // },
    // {
    //     q: 'Which solution type has the same solute concentration as the cell interior?',
    //     options: [
    //         'Hypotonic solution',
    //         'Hypertonic solution',
    //         'Isotonic solution',
    //         'Distilled water'
    //     ],
    //     answer: 2  // Isotonic solution
    // },
    // {
    //     q: 'Why do salted vegetables become wilted?',
    //     options: [
    //         'Salt destroys the cell walls',
    //         'Salt creates a hypertonic environment, drawing water out by osmosis',
    //         'Salt blocks the cell membranes',
    //         'Vegetables naturally wilt over time'
    //     ],
    //     answer: 1  // Salt creates a hypertonic environment, drawing water out by osmosis
    // }
];

export default function PostTest({ answers, setAnswers, score, setScore, markComplete, navigationButtons }) {
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
    const percentage = submitted ? Math.round((score / QUESTIONS.length) * 100) : 0;

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', gap: '1.5rem',
            paddingTop: '2rem',
            paddingLeft: '2rem',
            paddingRight: '2rem',
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
                        width: '15%',
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
                    Submit Post-Test
                </button>
            )}

            {/* Score display */}
            {submitted && (
                <div style={{
                    borderRadius: '12px',
                    padding: '2rem',
                    textAlign: 'center',
                    background: percentage >= 70
                        ? 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)'
                        : percentage >= 50
                            ? 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)'
                            : 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
                    color: 'white',
                    animation: 'fadeIn 0.5s ease'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                        {percentage >= 70 ? '🎉' : percentage >= 50 ? '📚' : '💪'}
                    </div>

                    <p style={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        margin: '0 0 0.5rem 0'
                    }}>
                        {score}/{QUESTIONS.length}
                    </p>

                    <p style={{
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        margin: '0 0 1rem 0'
                    }}>
                        {percentage}%
                    </p>

                    <p style={{
                        fontSize: '1.1rem',
                        margin: 0,
                        opacity: 0.95,
                        lineHeight: 1.6
                    }}>
                        {percentage === 100
                            ? '🌟 Perfect score! You have excellent understanding of osmosis!'
                            : percentage >= 70
                                ? '✨ Great job! You have a strong understanding of osmosis concepts!'
                                : percentage >= 50
                                    ? '📖 Good effort! Review the concepts and you\'ll master osmosis soon!'
                                    : '🔬 Keep learning! Review the lab sections to strengthen your understanding.'}
                    </p>

                    {/* Detailed breakdown */}
                    <div style={{
                        marginTop: '1.5rem',
                        padding: '1rem',
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px'
                    }}>
                        <p style={{
                            fontSize: '0.9rem',
                            margin: 0,
                            opacity: 0.95
                        }}>
                            <strong>Performance Level:</strong> {
                                percentage === 100 ? 'Mastery' :
                                    percentage >= 80 ? 'Excellent' :
                                        percentage >= 70 ? 'Proficient' :
                                            percentage >= 50 ? 'Developing' :
                                                'Needs Improvement'
                            }
                        </p>
                    </div>
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
