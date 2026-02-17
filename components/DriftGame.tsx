import React, { useRef, useEffect, useState } from 'react';

const DriftGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);

  // Game state refs
  const gameState = useRef({
    x: 400,
    y: 300,
    angle: 0,
    speed: 0,
    drift: 0,
    keys: { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false } as Record<string, boolean>,
    dustParticles: [] as { x: number; y: number; life: number; vx: number; vy: number }[],
    checkpoints: [] as { x: number; y: number; collected: boolean }[],
    // New environmental elements
    huts: [] as { x: number; y: number; size: number }[],
    bushes: [] as { x: number; y: number; size: number }[],
    currentScore: 0,
    legPhase: 0 // Animation phase for legs
  });

  useEffect(() => {
    // Initialize Game World
    const initWorld = () => {
        // Clear existing
        gameState.current.checkpoints = [];
        gameState.current.huts = [];
        gameState.current.bushes = [];
        
        // Generate random checkpoints
        for (let i = 0; i < 5; i++) {
            gameState.current.checkpoints.push({
                x: Math.random() * 700 + 50,
                y: Math.random() * 500 + 50,
                collected: false
            });
        }

        // Generate Thari Huts (Chaunra - round mud huts)
        for (let i = 0; i < 6; i++) {
            gameState.current.huts.push({
                x: Math.random() * 700 + 50,
                y: Math.random() * 500 + 50,
                size: 25 + Math.random() * 10
            });
        }

        // Generate Desert Bushes
        for (let i = 0; i < 20; i++) {
            gameState.current.bushes.push({
                x: Math.random() * 800,
                y: Math.random() * 600,
                size: 5 + Math.random() * 5
            });
        }
    };

    initWorld();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.current.keys.hasOwnProperty(e.code)) {
        gameState.current.keys[e.code] = true;
        // Prevent scrolling with arrow keys
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
            e.preventDefault();
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (gameState.current.keys.hasOwnProperty(e.code)) {
        gameState.current.keys[e.code] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let animationFrameId: number;

    const render = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const state = gameState.current;

      // Physics
      if (state.keys.ArrowUp) state.speed += 0.15; // Slightly slower acceleration for camel
      if (state.keys.ArrowDown) state.speed -= 0.1;
      
      // Friction for sand (higher than asphalt)
      state.speed *= 0.96; // Slightly more friction

      // Steering
      const turnSpeed = 0.05 * (state.speed / 2);
      if (state.keys.ArrowLeft) state.angle -= turnSpeed;
      if (state.keys.ArrowRight) state.angle += turnSpeed;

      // Animate legs based on speed
      if (Math.abs(state.speed) > 0.1) {
        state.legPhase += Math.abs(state.speed) * 0.5;
      }

      // Velocity
      const vx = Math.cos(state.angle) * state.speed;
      const vy = Math.sin(state.angle) * state.speed;

      state.x += vx;
      state.y += vy;

      // Screen wrap
      if (state.x > canvas.width) state.x = 0;
      if (state.x < 0) state.x = canvas.width;
      if (state.y > canvas.height) state.y = 0;
      if (state.y < 0) state.y = canvas.height;

      // Particle system (Sand/Dust)
      if (Math.abs(state.speed) > 1.5) {
        state.dustParticles.push({
          x: state.x - Math.cos(state.angle) * 20 + (Math.random() - 0.5) * 5,
          y: state.y - Math.sin(state.angle) * 20 + (Math.random() - 0.5) * 5,
          life: 1.0,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1
        });
      }

      // --- DRAWING ---

      // 1. Ground (Warm Desert Sand)
      ctx.fillStyle = '#e6a65c'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Texture/Dunes (Simple shapes)
      ctx.fillStyle = '#d19045';
      ctx.beginPath();
      ctx.ellipse(200, 200, 150, 80, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(600, 450, 200, 100, -Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();
      
      // 3. Draw Bushes
      ctx.fillStyle = '#4a5d23'; // Olive green
      state.bushes.forEach(bush => {
          ctx.beginPath();
          ctx.arc(bush.x, bush.y, bush.size, 0, Math.PI * 2);
          ctx.fill();
          // Add some scatter
          ctx.beginPath();
          ctx.arc(bush.x + 3, bush.y + 2, bush.size * 0.6, 0, Math.PI * 2);
          ctx.fill();
      });

      // 4. Draw Thari Huts (Chaunra)
      state.huts.forEach(hut => {
          // Shadow
          ctx.fillStyle = 'rgba(0,0,0,0.2)';
          ctx.beginPath();
          ctx.arc(hut.x + 5, hut.y + 5, hut.size, 0, Math.PI * 2);
          ctx.fill();

          // Mud Wall (Round)
          ctx.fillStyle = '#bfa58a'; // Mud color
          ctx.beginPath();
          ctx.arc(hut.x, hut.y, hut.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#8c735a';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Thatched Roof (Conical - represented as a smaller textured circle/cone from top)
          ctx.fillStyle = '#8c735a'; // Darker thatch
          ctx.beginPath();
          ctx.arc(hut.x, hut.y, hut.size * 0.85, 0, Math.PI * 2);
          ctx.fill();
          
          // Roof detail (lines to center)
          ctx.strokeStyle = '#5c4a3a';
          ctx.beginPath();
          for(let i=0; i<8; i++) {
              ctx.moveTo(hut.x, hut.y);
              ctx.lineTo(
                  hut.x + Math.cos(i * Math.PI/4) * (hut.size * 0.85),
                  hut.y + Math.sin(i * Math.PI/4) * (hut.size * 0.85)
              );
          }
          ctx.stroke();

          // Collision Check with Huts (Simple bounce)
          const dist = Math.sqrt((state.x - hut.x) ** 2 + (state.y - hut.y) ** 2);
          if (dist < hut.size + 15) { 
             state.speed *= -0.5; // Bounce back
          }
      });

      // 5. Checkpoints
      state.checkpoints.forEach((cp) => {
          if (!cp.collected) {
              // Glow
              const glow = Math.sin(Date.now() / 200) * 5;
              ctx.beginPath();
              ctx.arc(cp.x, cp.y, 20 + glow, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(255, 165, 0, 0.3)';
              ctx.fill();

              // Ring
              ctx.beginPath();
              ctx.arc(cp.x, cp.y, 15, 0, Math.PI * 2);
              ctx.strokeStyle = '#ff4500';
              ctx.lineWidth = 3;
              ctx.stroke();

              // Flag stick
              ctx.beginPath();
              ctx.moveTo(cp.x, cp.y);
              ctx.lineTo(cp.x, cp.y - 30); // 3D fake perspective
              ctx.strokeStyle = 'white';
              ctx.stroke();

              // Check collision
              const dx = state.x - cp.x;
              const dy = state.y - cp.y;
              if (Math.sqrt(dx * dx + dy * dy) < 30) {
                  cp.collected = true;
                  state.currentScore += 100;
                  setScore(state.currentScore);
                  setTimeout(() => {
                      cp.x = Math.random() * (canvas.width - 50);
                      cp.y = Math.random() * (canvas.height - 50);
                      cp.collected = false;
                  }, 2000);
              }
          }
      });

      // 6. Dust Particles
      state.dustParticles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.03;
        if (p.life > 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4 * p.life, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(210, 180, 140, ${p.life})`; // Sand dust color
          ctx.fill();
        } else {
          state.dustParticles.splice(i, 1);
        }
      });

      // 7. Draw Camel
      ctx.save();
      ctx.translate(state.x, state.y);
      ctx.rotate(state.angle);
      
      // Shadow (Oval)
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath();
      ctx.ellipse(0, 5, 22, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Legs (Simple animation)
      const legOffset = Math.sin(state.legPhase) * 5;
      ctx.fillStyle = '#b09b70'; // Darker camel
      
      // Back Legs
      ctx.fillRect(-15 + legOffset, 6, 6, 8);
      ctx.fillRect(-15 - legOffset, -14, 6, 8);
      // Front Legs
      ctx.fillRect(10 - legOffset, 6, 6, 8);
      ctx.fillRect(10 + legOffset, -14, 6, 8);

      // Body
      ctx.fillStyle = '#c2b280'; // Camel color
      ctx.beginPath();
      ctx.ellipse(-5, 0, 18, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Decorative Rug (Ralli/Ajrak style) on back
      ctx.fillStyle = '#8b0000'; // Dark red
      ctx.fillRect(-12, -6, 14, 12);
      
      // Rug Details (Ajrak blue/white)
      ctx.fillStyle = '#1a237e'; // Blue
      ctx.beginPath();
      ctx.arc(-5, 0, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(-5, 0, 1, 0, Math.PI * 2);
      ctx.fill();
      
      // Rug pattern dots
      ctx.fillStyle = 'white';
      ctx.fillRect(-11, -5, 2, 2);
      ctx.fillRect(-11, 3, 2, 2);
      ctx.fillRect(0, -5, 2, 2);
      ctx.fillRect(0, 3, 2, 2);


      // Neck
      ctx.fillStyle = '#c2b280';
      ctx.beginPath();
      ctx.ellipse(15, 0, 12, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Head
      ctx.fillStyle = '#c2b280';
      ctx.beginPath();
      ctx.arc(24, 0, 6, 0, Math.PI * 2);
      ctx.fill();

      // Ears
      ctx.fillStyle = '#a89f70';
      ctx.beginPath();
      ctx.arc(22, -4, 2, 0, Math.PI * 2);
      ctx.arc(22, 4, 2, 0, Math.PI * 2);
      ctx.fill();

      // Nose/Muzzle
      ctx.fillStyle = '#b09b70';
      ctx.beginPath();
      ctx.arc(28, 0, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-black/60 rounded-xl border border-orange-700/50 backdrop-blur-md">
      <div className="flex flex-col md:flex-row justify-between w-full max-w-[800px] mb-4 text-orange-400 font-cinzel items-center gap-4">
        <div>
           <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-200">Camel Run Prototype</h2>
           <p className="text-xs text-orange-200/60 font-rajdhani">Ride the Ship of the Desert!</p>
        </div>
        
        <div className="text-4xl font-bold bg-black/40 px-6 py-2 rounded-lg border border-orange-900 shadow-inner text-orange-100">
           {score} <span className="text-sm text-orange-500">XP</span>
        </div>
      </div>
      
      <div className="relative">
        <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="rounded-lg shadow-[0_0_50px_rgba(234,88,12,0.2)] border-4 border-[#5c4a3a] bg-[#e6a65c] max-w-full cursor-none"
        />
        {/* Overlay Vignette */}
        <div className="absolute inset-0 pointer-events-none rounded-lg shadow-[inset_0_0_100px_rgba(0,0,0,0.3)]"></div>
      </div>
      
      <div className="mt-6 flex gap-8 text-orange-200/70 text-sm font-rajdhani uppercase tracking-widest bg-black/40 px-6 py-2 rounded-full border border-orange-900/30">
        <span><span className="text-white font-bold">↑</span> Gallop</span>
        <span><span className="text-white font-bold">← →</span> Turn</span>
        <span><span className="text-white font-bold">↓</span> Slow Down</span>
      </div>
    </div>
  );
};

export default DriftGame;