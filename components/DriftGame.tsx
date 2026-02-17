import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Trophy, Zap, MapPin, Gauge, Play, RotateCcw, AlertOctagon, Flame, Wind, Crosshair, Radio } from 'lucide-react';

const DriftGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  
  // UI State (Separated from Game Logic for performance)
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [hudState, setHudState] = useState({
    score: 0,
    speed: 0,
    boost: 100,
    combo: 1,
    comboTimer: 0,
    health: 100
  });

  // Mutable Game Engine State (No re-renders)
  const engine = useRef({
    // Physics
    x: 2000, y: 2000, 
    velocity: { x: 0, y: 0 },
    speed: 0,
    angle: -Math.PI / 2,
    driftFactor: 0,
    grip: 1.0,
    boost: 100,
    health: 100,
    
    // Visuals
    z: 0, // Jump height
    tilt: 0, // Roll
    pitch: 0, // Front/Back
    cam: { x: 0, y: 0, zoom: 1, shake: 0 },
    
    // Inputs
    keys: { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false, Space: false } as Record<string, boolean>,
    
    // World Entities
    roads: [] as any[],
    buildings: [] as any[],
    traffic: [] as any[],
    pickups: [] as any[],
    decorations: [] as any[],
    particles: [] as any[],
    skidMarks: [] as any[],
    
    // System
    frameCount: 0,
    score: 0,
    combo: 1,
    comboTimer: 0,
    currentDriftScore: 0
  });

  // --- ENGINE INITIALIZATION ---
  const initGame = useCallback(() => {
    const s = engine.current;
    
    // Reset Stats
    s.score = 0; s.combo = 1; s.comboTimer = 0; s.health = 100; s.boost = 100;
    s.x = 2000; s.y = 2000; s.velocity = {x:0,y:0}; s.speed = 0; s.angle = -Math.PI/2;
    
    // Clear Arrays
    s.roads = []; s.buildings = []; s.traffic = []; s.pickups = []; s.decorations = []; s.skidMarks = []; s.particles = [];

    // --- GENERATE WORLD ---
    const CENTER = 2000;
    
    // 1. Roads (Loop)
    const roadW = 240;
    const size = 1800;
    
    // Inner Cross
    s.roads.push({ x: CENTER, y: CENTER, w: size * 2.5, h: roadW, type: 'h' });
    s.roads.push({ x: CENTER, y: CENTER, w: roadW, h: size * 2.5, type: 'v' });
    
    // Outer Ring
    s.roads.push({ x: CENTER, y: CENTER - size, w: size * 2 + roadW, h: roadW, type: 'h' });
    s.roads.push({ x: CENTER, y: CENTER + size, w: size * 2 + roadW, h: roadW, type: 'h' });
    s.roads.push({ x: CENTER - size, y: CENTER, w: roadW, h: size * 2 + roadW, type: 'v' });
    s.roads.push({ x: CENTER + size, y: CENTER, w: roadW, h: size * 2 + roadW, type: 'v' });

    // 2. Environment
    for(let i=0; i<350; i++) {
        const x = Math.random() * 5000;
        const y = Math.random() * 5000;
        
        // Safety Check
        let safe = true;
        for(const r of s.roads) {
            if(Math.abs(x - r.x) < r.w/2 + 120 && Math.abs(y - r.y) < r.h/2 + 120) safe = false;
        }
        if(!safe) continue;

        if (Math.random() > 0.6) {
            // Building
            s.buildings.push({
                x, y, 
                w: 80 + Math.random()*100, 
                l: 80 + Math.random()*100, 
                h: 50 + Math.random()*120,
                color: ['#c2410c', '#b45309', '#a16207'][Math.floor(Math.random()*3)]
            });
        } else {
            // Palm Tree / Rock
            s.decorations.push({ x, y, type: Math.random() > 0.7 ? 'rock' : 'palm', scale: 0.8 + Math.random() });
        }
    }

    // 3. Traffic
    s.roads.forEach((r: any) => {
        const count = 4;
        for(let i=0; i<count; i++) {
             const isH = r.type === 'h';
             const lane = Math.random() > 0.5 ? 1 : -1;
             const offset = (Math.random()-0.5) * (isH ? r.w : r.h) * 0.8;
             s.traffic.push({
                 x: isH ? r.x + offset : r.x + lane * (roadW/4),
                 y: isH ? r.y + lane * (roadW/4) : r.y + offset,
                 vx: isH ? (lane === 1 ? 4 : -4) : 0,
                 vy: isH ? 0 : (lane === 1 ? 4 : -4),
                 angle: isH ? (lane === 1 ? 0 : Math.PI) : (lane === 1 ? Math.PI/2 : -Math.PI/2),
                 color: ['#fff', '#333', '#881313'][Math.floor(Math.random()*3)],
                 w: 38, l: 70
             });
        }
    });

    // 4. Fuel & Coins
    for(let i=0; i<40; i++) {
        const x = Math.random() * 4500;
        const y = Math.random() * 4500;
        s.pickups.push({ x, y, type: Math.random() > 0.6 ? 'fuel' : 'coin', active: true, offset: Math.random()*10 });
    }

  }, []);

  // --- INPUT HANDLERS ---
  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => {
        if (engine.current.keys.hasOwnProperty(e.code)) {
            engine.current.keys[e.code] = true;
            e.preventDefault(); // Stop scrolling
        }
    };
    const handleUp = (e: KeyboardEvent) => {
        if (engine.current.keys.hasOwnProperty(e.code)) {
            engine.current.keys[e.code] = false;
        }
    };
    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    return () => {
        window.removeEventListener('keydown', handleDown);
        window.removeEventListener('keyup', handleUp);
    };
  }, []);

  // --- GAME LOOP ---
  useEffect(() => {
    if (!isPlaying) return;
    
    // Ensure world is ready
    if (engine.current.roads.length === 0) initGame();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Ground Pattern
    const pCan = document.createElement('canvas');
    pCan.width = 64; pCan.height = 64;
    const pCtx = pCan.getContext('2d');
    if (pCtx) {
        pCtx.fillStyle = '#C19A6B'; pCtx.fillRect(0,0,64,64); // Sand Base
        pCtx.fillStyle = '#b08d55'; pCtx.fillRect(0,0,32,32); pCtx.fillRect(32,32,32,32); // Checker noise
        pCtx.fillStyle = 'rgba(255,255,255,0.05)';
        for(let i=0; i<20; i++) pCtx.fillRect(Math.random()*64, Math.random()*64, 2, 2);
    }
    const pattern = ctx.createPattern(pCan, 'repeat');

    let lastTime = performance.now();

    const loop = (time: number) => {
        const dt = Math.min((time - lastTime) / 1000, 0.1);
        lastTime = time;

        update(dt);
        draw(ctx, pattern);

        if (engine.current.health <= 0) {
            setGameOver(true);
            setIsPlaying(false);
        } else {
            requestRef.current = requestAnimationFrame(loop);
        }
    };
    requestRef.current = requestAnimationFrame(loop);

    return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, initGame]);

  // --- PHYSICS ENGINE ---
  const update = (dt: number) => {
      const s = engine.current;
      s.frameCount++;

      // 1. Controls
      const ACCEL = 600;
      const BRAKE = 1000;
      const TURN = 3.0;
      
      let onRoad = false;
      for(const r of s.roads) {
          if (Math.abs(s.x - r.x) < r.w/2 && Math.abs(s.y - r.y) < r.h/2) { onRoad = true; break; }
      }
      
      // Grip Physics
      const drag = onRoad ? 0.8 : 2.5; // Sand is slow
      s.grip = onRoad ? 1.0 : 0.4;
      
      if (s.keys.ArrowUp) s.speed += ACCEL * s.grip * dt;
      if (s.keys.ArrowDown) s.speed -= BRAKE * s.grip * dt;
      
      // Friction
      s.speed -= s.speed * drag * dt;
      
      // Turning
      if (Math.abs(s.speed) > 20) {
          const dir = Math.sign(s.speed);
          const isDrifting = s.keys.Space;
          
          if (isDrifting && Math.abs(s.speed) > 150) {
              s.driftFactor = Math.min(s.driftFactor + dt * 2, 1.0);
              s.score += Math.floor(Math.abs(s.speed) * 0.05); // Drift points
          } else {
              s.driftFactor = Math.max(s.driftFactor - dt * 4, 0);
          }
          
          const turnAmount = TURN * dt * dir * (isDrifting ? 1.5 : 1.0);
          if (s.keys.ArrowLeft) s.angle -= turnAmount;
          if (s.keys.ArrowRight) s.angle += turnAmount;
      }

      // 2. Velocity (Drift Vector Math)
      const headX = Math.cos(s.angle);
      const headY = Math.sin(s.angle);
      
      // Slide calculation
      const slide = s.driftFactor * 0.9 + (1-s.grip) * 0.5;
      const momentumMix = 1 - Math.min(slide, 0.95);
      
      const targetVX = headX * s.speed;
      const targetVY = headY * s.speed;
      
      s.velocity.x += (targetVX - s.velocity.x) * momentumMix * 10 * dt;
      s.velocity.y += (targetVY - s.velocity.y) * momentumMix * 10 * dt;
      
      s.x += s.velocity.x * dt;
      s.y += s.velocity.y * dt;

      // 3. Collisions
      // Buildings
      s.buildings.forEach(b => {
          if (Math.abs(s.x - b.x) < b.w/2 + 20 && Math.abs(s.y - b.y) < b.l/2 + 20) {
              s.speed *= -0.5;
              s.x -= s.velocity.x * dt * 2;
              s.y -= s.velocity.y * dt * 2;
              s.health -= 5;
              s.cam.shake = 10;
              spawnParticles(s.x, s.y, 10, '#fff');
          }
      });
      
      // Traffic
      s.traffic.forEach(t => {
          t.x += t.vx; t.y += t.vy;
          // Loop traffic
          if (Math.abs(t.x - s.x) > 2000) t.x = s.x - Math.sign(t.x - s.x) * 1800;
          if (Math.abs(t.y - s.y) > 2000) t.y = s.y - Math.sign(t.y - s.y) * 1800;

          // Hit?
          if (Math.hypot(s.x - t.x, s.y - t.y) < 50) {
              s.speed *= -0.5;
              s.x -= s.velocity.x * dt * 3;
              s.y -= s.velocity.y * dt * 3;
              s.health -= 10;
              s.cam.shake = 15;
              spawnParticles(s.x, s.y, 15, '#ef4444');
          }
      });

      // Pickups
      s.pickups.forEach(p => {
          if (!p.active) return;
          if (Math.hypot(s.x - p.x, s.y - p.y) < 50) {
              p.active = false;
              if (p.type === 'fuel') {
                  s.boost = Math.min(100, s.boost + 30);
                  s.score += 100;
              } else {
                  s.score += 500;
              }
              spawnParticles(p.x, p.y, 8, '#facc15');
          }
      });

      // 4. Visuals (Camera & Particles)
      // Camera Follow
      const targetZoom = 1 - Math.min(Math.abs(s.speed)/2500, 0.5);
      s.cam.zoom += (targetZoom - s.cam.zoom) * 0.05;
      
      const targetCamX = s.x - (800 / s.cam.zoom)/2 + s.velocity.x * 0.5;
      const targetCamY = s.y - (450 / s.cam.zoom)/2 + s.velocity.y * 0.5;
      
      s.cam.x += (targetCamX - s.cam.x) * 0.1;
      s.cam.y += (targetCamY - s.cam.y) * 0.1;
      
      // Camera Shake decay
      s.cam.shake *= 0.9;
      
      // Particles
      if (Math.abs(s.speed) > 100 && (s.driftFactor > 0.5 || !onRoad)) {
          s.particles.push({
              x: s.x, y: s.y,
              vx: (Math.random()-0.5)*10, vy: (Math.random()-0.5)*10,
              life: 1.0, size: 5+Math.random()*10,
              color: onRoad ? 'rgba(200,200,200,0.3)' : 'rgba(194,168,126,0.6)'
          });
          // Skidmarks
          if (s.frameCount % 3 === 0) {
              s.skidMarks.push({ x: s.x, y: s.y, angle: s.angle, life: 1.0 });
          }
      }
      
      s.particles.forEach((p, i) => {
          p.life -= 0.03; p.x += p.vx; p.y += p.vy; p.size += 0.5;
          if(p.life <= 0) s.particles.splice(i, 1);
      });
      s.skidMarks.forEach((sk, i) => {
          sk.life -= 0.002; // Long lasting
          if(sk.life <= 0) s.skidMarks.splice(i, 1);
      });

      // 5. Update UI State (Throttled)
      if (s.frameCount % 10 === 0) {
          setHudState({
              score: s.score,
              speed: Math.abs(s.speed),
              boost: s.boost,
              combo: s.combo,
              comboTimer: s.comboTimer,
              health: s.health
          });
      }
  };

  const spawnParticles = (x: number, y: number, count: number, color: string) => {
      for(let i=0; i<count; i++) {
          engine.current.particles.push({
              x, y,
              vx: (Math.random()-0.5)*50, vy: (Math.random()-0.5)*50,
              life: 1.0, size: 2+Math.random()*6,
              color
          });
      }
  };

  const draw = (ctx: CanvasRenderingContext2D, bg: CanvasPattern | null) => {
      const s = engine.current;
      const { width, height } = ctx.canvas;
      
      // Clear
      ctx.fillStyle = '#1a0f05';
      ctx.fillRect(0,0,width,height);

      ctx.save();
      
      // Camera Transform
      const shakeX = (Math.random()-0.5) * s.cam.shake;
      const shakeY = (Math.random()-0.5) * s.cam.shake;
      
      ctx.scale(s.cam.zoom, s.cam.zoom);
      ctx.translate(-s.cam.x + shakeX, -s.cam.y + shakeY);

      // Viewport culling box
      const vx = s.cam.x; const vy = s.cam.y; 
      const vw = width/s.cam.zoom; const vh = height/s.cam.zoom;

      // 1. Ground
      if (bg) {
          ctx.fillStyle = bg;
          ctx.fillRect(vx, vy, vw, vh); // Draw everywhere
      }

      // 2. Skids
      s.skidMarks.forEach(sk => {
          if (Math.abs(sk.x - s.x) > 1000) return;
          ctx.save();
          ctx.translate(sk.x, sk.y);
          ctx.rotate(sk.angle);
          ctx.fillStyle = `rgba(30,30,30,${sk.life * 0.4})`;
          ctx.fillRect(-10, -5, 20, 10);
          ctx.restore();
      });

      // 3. Roads
      ctx.fillStyle = '#27272a';
      s.roads.forEach(r => {
           if (Math.abs(r.x - s.x) > 1500) return;
           ctx.fillRect(r.x - r.w/2, r.y - r.h/2, r.w, r.h);
           // Lines
           ctx.fillStyle = '#eab308';
           if (r.type === 'h') ctx.fillRect(r.x - r.w/2, r.y - 2, r.w, 4);
           else ctx.fillRect(r.x - 2, r.y - r.h/2, 4, r.h);
           ctx.fillStyle = '#27272a';
      });

      // 4. Objects (Sorted)
      const renderQueue = [
          { t: 'p', y: s.y, obj: null },
          ...s.traffic.map(t => ({ t: 'car', y: t.y, obj: t })),
          ...s.buildings.map(b => ({ t: 'b', y: b.y + b.l/2, obj: b })),
          ...s.decorations.map(d => ({ t: 'd', y: d.y, obj: d })),
          ...s.pickups.map(p => ({ t: 'pick', y: p.y, obj: p }))
      ].sort((a,b) => a.y - b.y);

      renderQueue.forEach(item => {
          // Cull
          if (item.t !== 'p' && Math.abs((item.obj as any).x - s.x) > 1000) return;

          if (item.t === 'b') {
               const b = item.obj as any;
               // Shadow
               ctx.fillStyle = 'rgba(0,0,0,0.4)';
               ctx.beginPath();
               ctx.moveTo(b.x - b.w/2, b.y + b.l/2);
               ctx.lineTo(b.x + b.w/2, b.y + b.l/2);
               ctx.lineTo(b.x + b.w/2 + 40, b.y + b.l/2 + 40);
               ctx.lineTo(b.x - b.w/2 + 40, b.y + b.l/2 + 40);
               ctx.fill();
               
               // Building Body
               const top = b.y - b.h;
               ctx.fillStyle = '#78350f'; // Side
               ctx.fillRect(b.x + b.w/2, top - b.l/2, 20, b.l);
               ctx.fillStyle = b.color; // Front
               ctx.fillRect(b.x - b.w/2, top + b.l/2, b.w, b.h);
               ctx.fillStyle = '#fcd34d'; // Roof
               ctx.fillRect(b.x - b.w/2, top - b.l/2, b.w, b.l);
               // Outline
               ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = 2;
               ctx.strokeRect(b.x - b.w/2, top - b.l/2, b.w, b.l);
          }
          else if (item.t === 'd') {
               const d = item.obj as any;
               if (d.type === 'rock') {
                   ctx.fillStyle = '#57534e';
                   ctx.beginPath(); ctx.arc(d.x, d.y, 15*d.scale, 0, Math.PI*2); ctx.fill();
                   ctx.fillStyle = 'rgba(0,0,0,0.3)';
                   ctx.beginPath(); ctx.arc(d.x-4, d.y-4, 10*d.scale, 0, Math.PI*2); ctx.fill();
               } else {
                   // Palm
                   ctx.fillStyle = '#713f12';
                   ctx.fillRect(d.x-4, d.y-40, 8, 40);
                   ctx.fillStyle = '#15803d';
                   for(let k=0; k<5; k++) {
                       ctx.beginPath();
                       ctx.ellipse(d.x, d.y-45, 20, 6, k, 0, Math.PI*2);
                       ctx.fill();
                   }
               }
          }
          else if (item.t === 'pick') {
               const p = item.obj as any;
               if (!p.active) return;
               const float = Math.sin(s.frameCount * 0.1) * 5;
               ctx.translate(0, float);
               if (p.type === 'fuel') {
                   ctx.fillStyle = '#facc15';
                   ctx.fillRect(p.x-10, p.y-25, 20, 25);
                   ctx.fillStyle = '#fff'; ctx.fillText('F', p.x-4, p.y-10);
               } else {
                   ctx.fillStyle = '#fbbf24';
                   ctx.beginPath(); ctx.arc(p.x, p.y-15, 12, 0, Math.PI*2); ctx.fill();
                   ctx.fillStyle = '#fff'; ctx.fillText('$', p.x-4, p.y-12);
               }
               ctx.translate(0, -float);
          }
          else if (item.t === 'car') {
               const c = item.obj as any;
               drawCar(ctx, c.x, c.y, c.angle, c.color, false);
          }
          else if (item.t === 'p') {
               drawCar(ctx, s.x, s.y, s.angle, '#ef4444', true);
          }
      });

      // 5. Particles
      s.particles.forEach(p => {
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
      });
      ctx.globalAlpha = 1;

      // 6. Sunset Gradient Overlay (Cinematic Vignette)
      ctx.restore(); 
      const grad = ctx.createRadialGradient(width/2, height/2, height*0.4, width/2, height/2, height);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(0,0,0,0.6)');
      ctx.fillStyle = grad;
      ctx.fillRect(0,0,width,height);
  };

  const drawCar = (ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, color: string, isPlayer: boolean) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      
      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(-20, -12, 40, 24);

      // Wheels
      ctx.fillStyle = '#111';
      ctx.fillRect(-18, -14, 10, 4); ctx.fillRect(10, -14, 10, 4);
      ctx.fillRect(-18, 10, 10, 4); ctx.fillRect(10, 10, 10, 4);

      // Body
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.roundRect(-22, -10, 44, 20, 4); ctx.fill();

      // Roof
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(-8, -8, 20, 16);

      // Lights
      if (isPlayer) {
         ctx.fillStyle = '#fef08a'; // Headlights
         ctx.fillRect(20, -8, 2, 4); ctx.fillRect(20, 4, 2, 4);
         
         // Headlight Beams
         ctx.globalCompositeOperation = 'screen';
         const grad = ctx.createLinearGradient(20, 0, 150, 0);
         grad.addColorStop(0, 'rgba(255, 255, 200, 0.4)');
         grad.addColorStop(1, 'rgba(255, 255, 200, 0)');
         ctx.fillStyle = grad;
         ctx.beginPath(); ctx.moveTo(22, -8); ctx.lineTo(150, -30); ctx.lineTo(150, 30); ctx.lineTo(22, 8); ctx.fill();
         ctx.globalCompositeOperation = 'source-over';

         if (engine.current.keys.ArrowDown) {
             ctx.fillStyle = '#ff0000'; // Brakes
             ctx.shadowColor = 'red'; ctx.shadowBlur = 10;
             ctx.fillRect(-22, -8, 2, 4); ctx.fillRect(-22, 4, 2, 4);
             ctx.shadowBlur = 0;
         }
      }

      ctx.restore();
  };

  return (
    <div className="flex flex-col items-center justify-center p-2 lg:p-6 w-full max-w-7xl mx-auto">
      
      {/* Game Dashboard Container */}
      <div className="relative w-full aspect-video bg-[#0a0a0a] rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border-4 border-[#333] group outline outline-4 outline-[#1a1a1a]">
          
          {/* Top Bezel HUD */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/90 to-transparent z-10 p-4 flex justify-between items-start pointer-events-none">
             <div className="flex gap-4">
                 <div className="bg-orange-600/90 text-black px-3 py-1 font-bold font-teko text-2xl skew-x-[-12deg] shadow-lg flex items-center gap-2 border border-white/20">
                     <Radio className="animate-pulse" size={16}/> LIVE FEED
                 </div>
                 <div className="hidden md:flex flex-col text-xs font-mono text-orange-400/80">
                     <span>COORDS: {Math.round(engine.current.x)} , {Math.round(engine.current.y)}</span>
                     <span>TEMP: 42°C</span>
                 </div>
             </div>
             
             <div className="flex flex-col items-end">
                <div className="text-6xl font-teko font-bold text-white leading-none drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                   {hudState.score.toString().padStart(6, '0')}
                </div>
                <div className="text-[10px] uppercase tracking-[0.5em] text-orange-500 font-bold bg-black/50 px-2 rounded">
                   Drift Points
                </div>
             </div>
          </div>

          <canvas ref={canvasRef} width={800} height={450} className="w-full h-full object-cover" />

          {/* CRT Scanline Overlay specifically for game */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none z-0"></div>

          {/* Start Screen */}
          {!isPlaying && !gameOver && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 animate-fadeIn">
                   <div 
                      onClick={() => { setIsPlaying(true); initGame(); }}
                      className="cursor-pointer group/btn flex flex-col items-center relative"
                   >
                       {/* Pulsing rings */}
                       <div className="absolute inset-0 rounded-full border-2 border-orange-500/30 animate-ping"></div>
                       <div className="absolute inset-[-20px] rounded-full border border-orange-500/20 animate-pulse"></div>

                       <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-600 to-red-700 flex items-center justify-center shadow-[0_0_60px_rgba(234,88,12,0.6)] group-hover/btn:scale-110 transition-transform mb-8 border-4 border-white/10">
                           <Play size={64} className="text-white ml-2" fill="white" />
                       </div>
                       <h1 className="text-6xl font-teko font-black text-white mb-2 tracking-widest uppercase">Initiate Race</h1>
                       <div className="flex gap-4 text-orange-200 font-rajdhani text-sm bg-white/5 px-6 py-3 rounded border border-white/10 backdrop-blur-md">
                           <span className="flex items-center gap-2"><div className="w-4 h-4 border border-white/50 rounded flex items-center justify-center">↑</div> Drive</span>
                           <span className="w-[1px] bg-white/20"></span>
                           <span className="flex items-center gap-2"><div className="w-12 h-4 border border-white/50 rounded flex items-center justify-center text-[8px]">SPACE</div> Drift</span>
                       </div>
                   </div>
              </div>
          )}

          {/* Game Over */}
          {gameOver && (
              <div className="absolute inset-0 bg-red-950/90 backdrop-blur-md flex flex-col items-center justify-center z-30 animate-fadeIn">
                   <AlertOctagon size={100} className="text-red-500 mb-6 animate-bounce drop-shadow-[0_0_20px_rgba(255,0,0,0.5)]" />
                   <h2 className="text-8xl font-teko uppercase text-white mb-2 tracking-widest leading-none">CRITICAL DAMAGE</h2>
                   <div className="h-[1px] w-64 bg-red-500/50 mb-6"></div>
                   <p className="text-2xl text-red-200 font-mono mb-10 bg-black/40 px-6 py-2 rounded">
                      SESSION SCORE: <span className="text-white font-bold">{hudState.score}</span>
                   </p>
                   <button 
                       onClick={() => { setGameOver(false); setIsPlaying(true); initGame(); }}
                       className="bg-white hover:bg-red-100 text-red-900 px-10 py-4 skew-x-[-12deg] font-black font-teko text-2xl hover:scale-105 transition-transform flex items-center gap-3 shadow-xl"
                   >
                       <RotateCcw size={24} /> <span className="skew-x-[12deg]">REBOOT SYSTEM</span>
                   </button>
              </div>
          )}

          {/* Bottom HUD */}
          {isPlaying && (
              <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-end pointer-events-none z-10 bg-gradient-to-t from-black/90 via-black/50 to-transparent h-48">
                  {/* Left: Map & Health */}
                  <div className="flex flex-col gap-4">
                      {/* Health Bar */}
                      <div className="flex items-center gap-2">
                          <div className="text-xs text-orange-500 font-bold uppercase w-12 text-right">Armor</div>
                          <div className="w-48 h-3 bg-gray-800 skew-x-[-12deg] border border-gray-600 overflow-hidden">
                              <div 
                                className={`h-full ${hudState.health > 40 ? 'bg-green-500' : 'bg-red-600 animate-pulse'}`} 
                                style={{width: `${hudState.health}%`}}
                              ></div>
                          </div>
                      </div>
                      
                      {/* Fake Radar */}
                      <div className="w-24 h-24 rounded-full border-2 border-orange-500/30 bg-black/60 backdrop-blur relative overflow-hidden group">
                           <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,#000_100%)]"></div>
                           <div className="absolute inset-0 border border-orange-500/20 rounded-full opacity-50 scale-50"></div>
                           <div className="absolute inset-0 border border-orange-500/20 rounded-full opacity-30 scale-75"></div>
                           <div className="absolute w-full h-[1px] bg-orange-500/30 top-1/2 left-0"></div>
                           <div className="absolute h-full w-[1px] bg-orange-500/30 left-1/2 top-0"></div>
                           {/* Sweeper */}
                           <div className="absolute top-1/2 left-1/2 w-[50%] h-[50%] bg-gradient-to-r from-transparent to-orange-500/20 origin-top-left animate-spin rounded-tr-full"></div>
                           <MapPin className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-orange-500 drop-shadow-[0_0_5px_orange]" size={16} />
                      </div>
                  </div>

                  {/* Right: Speed & Nitro */}
                  <div className="flex items-end gap-6">
                       {/* Nitro Vertical */}
                       <div className="flex flex-col items-center gap-1">
                            <div className="w-4 h-32 bg-gray-900 border border-gray-600 relative overflow-hidden rounded-full">
                                <div 
                                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-600 to-cyan-300 shadow-[0_0_15px_cyan] transition-all duration-200"
                                    style={{ height: `${hudState.boost}%` }}
                                ></div>
                            </div>
                            <Zap size={16} className="text-cyan-400" fill="currentColor" />
                       </div>

                       {/* Digital Speedo */}
                       <div className="flex flex-col items-end">
                            <div className="flex items-baseline gap-1">
                                <span className="text-8xl font-teko font-black text-white italic tracking-tighter leading-none drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                                    {Math.round(hudState.speed / 10)}
                                </span>
                                <span className="text-xl text-orange-500 font-bold uppercase mb-2">KM/H</span>
                            </div>
                            <div className="w-full h-1 bg-white/20 mt-1">
                                <div className="h-full bg-orange-500" style={{width: `${Math.min(hudState.speed/20, 100)}%`}}></div>
                            </div>
                       </div>
                  </div>
              </div>
          )}
      </div>
      
      {/* Footer Controls */}
      <div className="flex justify-between w-full mt-4 opacity-50 text-[10px] uppercase tracking-widest font-rajdhani px-4">
          <div className="flex gap-4">
             <span className="flex items-center gap-1"><Crosshair size={12}/> SYSTEM_READY</span>
             <span className="flex items-center gap-1"><Wind size={12}/> WIND_SPEED: 12KT</span>
          </div>
          <div>PROTOTYPE_BUILD_v0.9.2</div>
      </div>
    </div>
  );
};

export default DriftGame;