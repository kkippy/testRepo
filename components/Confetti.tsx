import React, { useEffect, useRef } from 'react';

export const Confetti: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    // Warm theme colors: Orange, Rose, Yellow, Teal
    const colors = ['#fb923c', '#f43f5e', '#fbbf24', '#2dd4bf', '#38bdf8'];

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        // Explosion velocity
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 15 + 5; 
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 5; // Initial upward bias
        
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.size = Math.random() * 8 + 4;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 10;
        this.opacity = 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Gravity
        this.vy += 0.5;
        
        // Air resistance
        this.vx *= 0.96;
        this.vy *= 0.96;

        this.rotation += this.rotationSpeed;
        this.opacity -= 0.015;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, this.opacity);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Create particles from bottom center/sides
      const centerX = canvas.width / 2;
      const centerY = canvas.height * 0.8;
      
      for (let i = 0; i < 150; i++) {
        particles.push(new Particle(centerX, centerY));
        // Add some from sides for "pop" effect
        if (i % 3 === 0) particles.push(new Particle(canvas.width * 0.2, centerY));
        if (i % 3 === 0) particles.push(new Particle(canvas.width * 0.8, centerY));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, index) => {
        p.update();
        p.draw(ctx);
        if (p.opacity <= 0) {
          particles.splice(index, 1);
        }
      });

      if (particles.length > 0) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    init();
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[100] pointer-events-none"
    />
  );
};