import React, { useState, useEffect } from 'react';
import SectionHeader from './common/section-headers';

export default function RealWorldApplications({ markComplete, navigationButtons }) {
  const [selectedExample, setSelectedExample] = useState(null);

  useEffect(() => {
    markComplete();
  }, []);

  const sectionTitle = "🌍 Real World Applications of Osmosis";
  const sectionDescription = "Osmosis isn't just a lab concept—it happens all around us every day!  Click on each example to learn more.";

  const examples = [
    {
      id: 'pickle',
      icon: '🥒',
      title: 'Why Vegetables Wilt When Salted',
      description: 'When you put salt on vegetables, osmosis draws water out of the cells',
      detail: 'Salt creates a hypertonic solution outside the vegetable cells. Water moves out by osmosis, causing the cells to shrink and the vegetable to become limp and wilted. This is why cucumbers turn into pickles!',
      realLife: 'Making pickles, preserving food with salt'
    },
    {
      id: 'rehydrate',
      icon: '💧',
      title: 'Why Dried Fruits Plump Up in Water',
      description: 'Dried fruits absorb water and swell when soaked',
      detail: 'The dried fruit cells have a high concentration of sugars (hypertonic). When placed in water (hypotonic solution), water moves into the cells by osmosis, causing them to swell and become plump again.',
      realLife: 'Rehydrating raisins, dried apricots, or prunes'
    },
    {
      id: 'cells',
      icon: '🩸',
      title: 'IV Fluids in Hospitals',
      description: 'Doctors use isotonic solutions for IV fluids',
      detail: 'Hospital IV fluids are carefully made to be isotonic with blood cells (same concentration). This prevents cells from swelling (hypotonic) or shrinking (hypertonic), keeping them healthy and functional.',
      realLife: 'Medical saline solution (0.9% NaCl), keeping patients hydrated'
    },
    {
      id: 'plants',
      icon: '🌱',
      title: 'Plant Watering and Fertilizer',
      description: 'Too much fertilizer can harm plants',
      detail: 'Excess fertilizer creates a hypertonic solution in the soil. Water moves out of plant roots by osmosis, causing the plant to wilt even though the soil is wet. This is called "fertilizer burn."',
      realLife: 'Proper plant care, avoiding over-fertilization'
    },
    {
      id: 'marine',
      icon: '🐟',
      title: 'Fish in Freshwater vs Saltwater',
      description: 'Fish are adapted to their water environment',
      detail: 'Freshwater fish live in hypotonic environments (less salty than their cells), so they constantly absorb water by osmosis and must excrete dilute urine. Saltwater fish live in hypertonic environments and must drink water constantly to prevent dehydration.',
      realLife: 'Why you cannot put ocean fish in freshwater aquariums'
    },
    {
      id: 'slugs',
      icon: '🐌',
      title: 'Why Salt Harms Slugs',
      description: 'Salt dehydrates slugs by osmosis',
      detail: 'Slugs have permeable skin. When salt is applied, it creates a hypertonic environment. Water rapidly leaves the slug\'s body by osmosis, causing severe dehydration and eventual death.',
      realLife: 'Garden pest control (though better methods exist!)'
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
          ✨ Osmosis is Everywhere!
        </h3>
        <p style={{
          fontSize: '1.05rem',
          lineHeight: '1.8',
          margin: 0,
          opacity: 0.95
        }}>
          From the food we eat to the way our bodies function, osmosis plays a crucial role in everyday life.
          Understanding osmosis helps us make better decisions in cooking, medicine, gardening, and more!
        </p>
      </div>

      {navigationButtons}
    </div>
  );
}