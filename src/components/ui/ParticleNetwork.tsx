import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  label: string;
  color: string;
  size: number;
  pulse: number;
  pulseDir: number;
}

const nodes = [
  { label: "Donor", color: "#16a34a", emoji: "🏢" },
  { label: "Food", color: "#22c55e", emoji: "🥗" },
  { label: "Match", color: "#0ea5e9", emoji: "⚡" },
  { label: "Volunteer", color: "#f59e0b", emoji: "🚚" },
  { label: "NGO", color: "#8b5cf6", emoji: "🤝" },
  { label: "Impact", color: "#4ade80", emoji: "📊" },
];

export default function ParticleNetwork({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setSize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    setSize();

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    // Main nodes in a flowing arrangement
    const particles: Particle[] = nodes.map((n, i) => ({
      x: (W() / (nodes.length + 1)) * (i + 1),
      y: H() / 2 + Math.sin((i / nodes.length) * Math.PI * 2) * H() * 0.22,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      label: n.label,
      color: n.color,
      size: 20,
      pulse: 0,
      pulseDir: 1,
    }));

    // Floating micro-particles
    const microParticles = Array.from({ length: 30 }, () => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.4 + 0.1,
    }));

    let frame = 0;
    let animId: number;

    const draw = () => {
      ctx.clearRect(0, 0, W(), H());
      frame++;

      const w = W();
      const h = H();

      // Update micro particles
      microParticles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 197, 94, ${p.alpha})`;
        ctx.fill();
      });

      // Draw connections between all main nodes
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 280) {
            const alpha = (1 - dist / 280) * 0.25;
            // Animated data packet along line
            const progress = ((frame * 0.005 + i * 0.3) % 1);
            const px = a.x + (b.x - a.x) * progress;
            const py = a.y + (b.y - a.y) * progress;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(34, 197, 94, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Data packet dot
            ctx.beginPath();
            ctx.arc(px, py, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(74, 222, 128, ${alpha * 3})`;
            ctx.fill();
          }
        }
      }

      // Update and draw main nodes
      particles.forEach((p, i) => {
        // Gentle float
        p.x += p.vx + Math.sin(frame * 0.008 + i) * 0.15;
        p.y += p.vy + Math.cos(frame * 0.006 + i * 0.8) * 0.12;

        // Boundary bounce
        if (p.x < 60) { p.vx += 0.05; }
        if (p.x > w - 60) { p.vx -= 0.05; }
        if (p.y < 40) { p.vy += 0.05; }
        if (p.y > h - 40) { p.vy -= 0.05; }

        // Friction
        p.vx *= 0.99;
        p.vy *= 0.99;

        // Pulse
        p.pulse += 0.04 * p.pulseDir;
        if (p.pulse > 1) p.pulseDir = -1;
        if (p.pulse < 0) p.pulseDir = 1;

        const pulseR = p.size + p.pulse * 6;

        // Outer glow ring
        const grad = ctx.createRadialGradient(p.x, p.y, pulseR * 0.5, p.x, p.y, pulseR * 2.5);
        grad.addColorStop(0, p.color.replace(")", ", 0.18)").replace("rgb", "rgba").replace("#", "rgba(").replace(/rgba\(([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/, (_, r, g, b) =>
          `rgba(${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)}`));
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath();
        ctx.arc(p.x, p.y, pulseR * 2.5, 0, Math.PI * 2);

        // Simple glow using shadow
        ctx.shadowBlur = 20;
        ctx.shadowColor = p.color;

        // Node circle
        ctx.beginPath();
        ctx.arc(p.x, p.y, pulseR, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}22`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        ctx.shadowBlur = 0;

        // Label
        ctx.font = "bold 11px 'Outfit', sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.fillText(p.label, p.x, p.y + p.size + 16);
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      setSize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ display: "block" }}
    />
  );
}
