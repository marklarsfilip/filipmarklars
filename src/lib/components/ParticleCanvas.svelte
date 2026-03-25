<script lang="ts">
  import { onMount } from 'svelte';

  let canvasRef = $state<HTMLCanvasElement | null>(null);
  let reducedMotion = $state(false);

  onMount(() => {
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || !canvasRef) return;

    const canvas = canvasRef;
    const ctx = canvas.getContext('2d')!;
    let animationFrameId: number;
    let particles: Particle[] = [];
    const mouse = { x: null as number | null, y: null as number | null, radius: 180 };

    // Warm ember palette
    const particleColors = [
      'rgba(252, 107, 63, 0.7)',   // orange
      'rgba(252, 107, 63, 0.5)',   // orange dim
      'rgba(255, 246, 218, 0.4)',  // cream
      'rgba(132, 242, 214, 0.3)',  // mint
    ];
    const lineColorDefault = 'rgba(252, 107, 63,';  // orange connections
    const lineColorHover = 'rgba(255, 246, 218,';    // cream near mouse

    class Particle {
      x: number;
      y: number;
      directionX: number;
      directionY: number;
      size: number;
      color: string;

      constructor(x: number, y: number, dx: number, dy: number, size: number, color: string) {
        this.x = x;
        this.y = y;
        this.directionX = dx;
        this.directionY = dy;
        this.size = size;
        this.color = color;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius + this.size) {
            const forceX = dx / distance;
            const forceY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;
            this.x -= forceX * force * 4;
            this.y -= forceY * force * 4;
          }
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    function init() {
      particles = [];
      // Fewer particles for elegance — ~1 per 12000px
      const count = Math.min((canvas.height * canvas.width) / 12000, 120);
      for (let i = 0; i < count; i++) {
        const size = Math.random() * 1.5 + 0.5;
        const x = Math.random() * (canvas.width - size * 4) + size * 2;
        const y = Math.random() * (canvas.height - size * 4) + size * 2;
        const dx = (Math.random() * 0.3) - 0.15;
        const dy = (Math.random() * 0.3) - 0.15;
        const color = particleColors[Math.floor(Math.random() * particleColors.length)];
        particles.push(new Particle(x, y, dx, dy, size, color));
      }
    }

    function connect() {
      const maxDist = (canvas.width / 8) * (canvas.height / 8);
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = dx * dx + dy * dy;

          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.4;

            // Brighter connections near mouse
            let lineColor = lineColorDefault;
            if (mouse.x !== null && mouse.y !== null) {
              const mx = particles[a].x - mouse.x;
              const my = particles[a].y - mouse.y;
              if (Math.sqrt(mx * mx + my * my) < mouse.radius) {
                lineColor = lineColorHover;
              }
            }

            ctx.strokeStyle = `${lineColor} ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      // Clear with base color
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.update();
      }
      connect();
    }

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      init();
    }

    function handleMouseMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }

    function handleMouseOut() {
      mouse.x = null;
      mouse.y = null;
    }

    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseout', handleMouseOut);

    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  });
</script>

{#if reducedMotion}
  <!-- Static fallback: just the base background -->
  <div class="absolute inset-0 bg-base" aria-hidden="true"></div>
{:else}
  <canvas
    bind:this={canvasRef}
    class="absolute inset-0 w-full h-full"
    aria-hidden="true"
  ></canvas>
{/if}
