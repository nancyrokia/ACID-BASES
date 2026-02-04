import React, { useRef, useEffect } from 'react';

export default function WaterMovementAnimation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Animation state
    let waterMolecules = [];
    let animationFrame;

    // Initialize water molecules
    for (let i = 0; i < 30; i++) {
      waterMolecules.push({
        x: Math.random() * (width * 0.4),
        y: Math.random() * height,
        vx: 0.5 + Math.random() * 0.5,
        vy: (Math.random() - 0.5) * 0.3,
        size: 4 + Math.random() * 3
      });
    }

    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw background sections
      // Left side (hypotonic - low concentration)
      ctx.fillStyle = '#e3f2fd';
      ctx.fillRect(0, 0, width * 0.4, height);

      // Membrane
      ctx.fillStyle = '#90a4ae';
      ctx.fillRect(width * 0.4, 0, width * 0.05, height);

      // Draw membrane pores
      for (let i = 0; i < 8; i++) {
        const poreY = (height / 9) * (i + 0.5);
        ctx.fillStyle = '#546e7a';
        ctx.beginPath();
        ctx.arc(width * 0.425, poreY, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Right side (hypertonic - high concentration)
      ctx.fillStyle = '#fff3e0';
      ctx.fillRect(width * 0.45, 0, width * 0.55, height);

      // Draw solute particles on right side (salt)
      ctx.fillStyle = '#ff9800';
      for (let i = 0; i < 40; i++) {
        const x = width * 0.45 + Math.random() * (width * 0.55);
        const y = Math.random() * height;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw labels
      ctx.fillStyle = '#1976d2';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Hypotonic', width * 0.2, 25);
      ctx.fillText('(Low solute)', width * 0.2, 45);

      ctx.fillStyle = '#424242';
      ctx.fillText('Semi-permeable', width * 0.425, 25);
      ctx.fillText('Membrane', width * 0.425, 45);

      ctx.fillStyle = '#f57c00';
      ctx.fillText('Hypertonic', width * 0.725, 25);
      ctx.fillText('(High solute)', width * 0.725, 45);

      // Draw and update water molecules
      waterMolecules.forEach((molecule) => {
        // Draw molecule
        ctx.fillStyle = '#2196f3';
        ctx.beginPath();
        ctx.arc(molecule.x, molecule.y, molecule.size, 0, Math.PI * 2);
        ctx.fill();

        // Add white highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(molecule.x - molecule.size * 0.3, molecule.y - molecule.size * 0.3, molecule.size * 0.4, 0, Math.PI * 2);
        ctx.fill();

        // Update position
        molecule.x += molecule.vx;
        molecule.y += molecule.vy;

        // Reset if molecule goes off screen or crosses completely
        if (molecule.x > width) {
          molecule.x = 0;
          molecule.y = Math.random() * height;
        }

        // Keep molecules within vertical bounds
        if (molecule.y < 0) molecule.y = 0;
        if (molecule.y > height) molecule.y = height;
        
        // Add slight vertical oscillation
        molecule.vy += (Math.random() - 0.5) * 0.05;
        molecule.vy *= 0.95; // Damping
      });

      // Draw arrow indicating water flow
      const arrowY = height / 2;
      const arrowX = width * 0.3;
      ctx.strokeStyle = '#1976d2';
      ctx.fillStyle = '#1976d2';
      ctx.lineWidth = 3;

      // Arrow shaft
      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(arrowX + 60, arrowY);
      ctx.stroke();

      // Arrow head
      ctx.beginPath();
      ctx.moveTo(arrowX + 60, arrowY);
      ctx.lineTo(arrowX + 50, arrowY - 8);
      ctx.lineTo(arrowX + 50, arrowY + 8);
      ctx.closePath();
      ctx.fill();

      // Arrow label
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Water Flow', arrowX + 30, arrowY - 15);

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <canvas
        ref={canvasRef}
        width={700}
        height={300}
        style={{
          border: '3px solid #667eea',
          borderRadius: '8px',
          background: 'white',
          maxWidth: '100%',
          height: 'auto'
        }}
      />
      <p style={{
        marginTop: '1rem',
        textAlign: 'center',
        color: '#4a5568',
        fontSize: '0.95rem',
        maxWidth: '600px'
      }}>
        <strong>Watch:</strong> Water molecules (blue circles) move from the hypotonic solution
        (left - fewer solutes) through the semi-permeable membrane to the hypertonic solution
        (right - more orange solute particles). This is osmosis!
      </p>
    </div>
  );
}