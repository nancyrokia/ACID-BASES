import React, { useState, useEffect } from 'react';
import SectionHeader from './common/section-headers';

export default function RealWorldApplications({ markComplete, navigationButtons }) {
  const [selectedExample, setSelectedExample] = useState(null);

  useEffect(() => {
    markComplete();
  }, []);

  const sectionTitle = "🌍 Real World Applications of Acids and Bases";
  const sectionDescription = "Acids and bases aren't just lab concepts—they're everywhere in our daily lives!  Click on each example to learn more.";

  const examples = [
  {
    id: 'stomach',
    icon: '🍋',
    title: 'Stomach Acid and Digestion',
    description: 'The stomach contains a strong acid',
    detail:
      'The human stomach contains hydrochloric acid (HCl), which helps break down food and kill harmful bacteria. Indicators like litmus would turn red in stomach acid, confirming its acidic nature.',
    realLife: 'Digestion, acid reflux, antacids'
  },
  {
    id: 'cleaning',
    icon: '🧼',
    title: 'Soaps and Detergents',
    description: 'Cleaning agents are usually basic',
    detail:
      'Most soaps and detergents are basic in nature. They turn red litmus paper blue and help remove grease by reacting with fats. This basic property makes them effective cleaning agents.',
    realLife: 'Laundry detergents, dishwashing liquids'
  },
  {
    id: 'antacid',
    icon: '💊',
    title: 'Antacids Neutralize Acids',
    description: 'Antacids reduce stomach acidity',
    detail:
      'Antacids such as magnesium hydroxide are bases that neutralize excess stomach acid. Indicators show this neutralization as the solution shifts toward neutral pH.',
    realLife: 'Treatment of heartburn and indigestion'
  },
  {
    id: 'soil',
    icon: '🌱',
    title: 'Soil pH and Crop Growth',
    description: 'Soil acidity affects plant health',
    detail:
      'Some crops grow better in acidic soil, while others prefer neutral or basic soil. Farmers use indicators to test soil pH and adjust it using lime (a base) or organic matter.',
    realLife: 'Agriculture, gardening, crop yield improvement'
  },
  {
    id: 'water',
    icon: '🚰',
    title: 'Testing Drinking Water',
    description: 'Safe water must have balanced pH',
    detail:
      'Drinking water should be close to neutral pH. Indicators help detect whether water is too acidic or basic, which could corrode pipes or affect human health.',
    realLife: 'Water treatment plants, home water testing'
  },
  {
    id: 'industry',
    icon: '🏭',
    title: 'Industries and pH Control',
    description: 'Factories monitor acids and bases carefully',
    detail:
      'Industries use indicators to monitor chemical reactions and waste disposal. Improper pH levels can damage equipment and harm the environment.',
    realLife: 'Chemical manufacturing, environmental safety'
  }
];


  useEffect(() => {
    markComplete();
  }, []);

  return (
    <div className="fade-in" style={{
      paddingTop: '2rem',
      paddingLeft: '2rem',
      paddingRight: '2rem',
    }}>
      <SectionHeader title={sectionTitle} description={sectionDescription} />

      {/* Examples Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {examples.map((example) => (
          <div
            key={example.id}
            onClick={() => setSelectedExample(example)}
            style={{
              background: selectedExample?.id === example.id
                ? 'linear-gradient(135deg, #0077B6 0%, #005A8C 100%)'
                : 'white',
              color: selectedExample?.id === example.id ? 'white' : '#2d3748',
              border: `3px solid ${selectedExample?.id === example.id ? '#0077B6' : '#e2e8f0'}`,
              borderRadius: '12px',
              padding: '1.5rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: selectedExample?.id === example.id
                ? '0 8px 20px rgba(102, 126, 234, 0.4)'
                : '0 2px 8px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              if (selectedExample?.id !== example.id) {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedExample?.id !== example.id) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem', textAlign: 'center' }}>
              {example.icon}
            </div>
            <h3 style={{
              fontSize: '1.25rem',
              marginTop: 0,
              marginBottom: '0.5rem',
              textAlign: 'center'
            }}>
              {example.title}
            </h3>
            <p style={{
              fontSize: '0.95rem',
              margin: 0,
              textAlign: 'center',
              opacity: selectedExample?.id === example.id ? 1 : 0.8
            }}>
              {example.description}
            </p>
          </div>
        ))}
      </div>

      {/* Detailed Explanation */}
      {selectedExample && (
        <div style={{
          background: 'white',
          border: '3px solid #0077B6',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <span style={{ fontSize: '4rem' }}>{selectedExample.icon}</span>
            <h2 style={{
              fontSize: '2rem',
              color: '#667eea',
              margin: 0
            }}>
              {selectedExample.title}
            </h2>
          </div>

          <div style={{
            background: '#f7fafc',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            borderLeft: '4px solid #667eea'
          }}>
            <h4 style={{
              marginTop: 0,
              color: '#2d3748',
              fontSize: '1.1rem'
            }}>
              🔬 How Osmosis Works Here:
            </h4>
            <p style={{
              fontSize: '1.05rem',
              lineHeight: '1.8',
              color: '#4a5568',
              margin: 0
            }}>
              {selectedExample.detail}
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
            color: 'white',
            padding: '1.5rem',
            borderRadius: '8px'
          }}>
            <h4 style={{
              marginTop: 0,
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              🌍 Real-Life Application:
            </h4>
            <p style={{
              fontSize: '1.05rem',
              lineHeight: '1.8',
              margin: 0,
              opacity: 0.95
            }}>
              {selectedExample.realLife}
            </p>
          </div>
        </div>
      )}

      {/* Summary Section */}
      <div style={{
        background: 'linear-gradient(135deg, #0077B6 0%, #005A8C 100%)',
        color: 'white',
        borderRadius: '12px',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <h3 style={{ marginTop: 0, fontSize: '1.5rem' }}>
          ✨ Acids and Bases Are Everywhere!
        </h3>
        <p style={{
          fontSize: '1.05rem',
          lineHeight: '1.8',
          margin: 0,
          opacity: 0.95
        }}>
          From the food we eat to the products we use every day, acids and bases play a vital role in our lives.
          Understanding how indicators work helps us identify substances, stay safe, and make informed decisions
          in health, cleaning, agriculture, and industry.
        </p>
      </div>

      {navigationButtons}
    </div>
  );
}