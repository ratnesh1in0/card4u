/**
 * card4u Confetti Engine
 * Lightweight, high-fps celebratory particles with hearts, stars and golden ribbons.
 */

class CardConfetti {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.animId = null;
    this.isActive = false;
  }

  ensureCanvas() {
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'card4u-confetti-canvas';
      this.canvas.style.position = 'fixed';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      this.canvas.style.width = '100vw';
      this.canvas.style.height = '100vh';
      this.canvas.style.pointerEvents = 'none';
      this.canvas.style.zIndex = '99999';
      document.body.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }
  }

  resize() {
    if (this.canvas) {
      this.canvas.width = window.innerWidth * window.devicePixelRatio;
      this.canvas.height = window.innerHeight * window.devicePixelRatio;
      if (this.ctx) {
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    }
  }

  boom(x = window.innerWidth / 2, y = window.innerHeight / 2, count = 80, theme = 'gold') {
    this.ensureCanvas();
    const colors = {
      gold: ['#D4AF37', '#F3E5AB', '#FFD700', '#AA771C', '#FFF275', '#E6C280'],
      romantic: ['#FF4B72', '#FF85A2', '#FFD1DC', '#D4AF37', '#9333EA', '#F43F5E'],
      party: ['#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#06B6D4'],
      wedding: ['#C5A059', '#E5D3B3', '#D4AF37', '#FDFBF7', '#B38B4D', '#E25858']
    }[theme] || ['#D4AF37', '#FF4B72', '#3B82F6', '#10B981', '#F59E0B'];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 6;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 4,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 15,
        type: Math.random() > 0.4 ? 'rect' : (Math.random() > 0.5 ? 'heart' : 'circle'),
        alpha: 1,
        gravity: 0.28,
        drag: 0.95,
        decay: Math.random() * 0.008 + 0.006
      });
    }

    if (!this.isActive) {
      this.isActive = true;
      this.render();
    }
  }

  floatingHearts(x = window.innerWidth - 60, y = window.innerHeight - 80, count = 6) {
    this.ensureCanvas();
    const colors = ['#FF2E63', '#FF7597', '#FFAAA7', '#FF0055'];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x + (Math.random() * 40 - 20),
        y: y,
        vx: (Math.random() - 0.5) * 2,
        vy: -(Math.random() * 4 + 4),
        size: Math.random() * 12 + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: (Math.random() - 0.5) * 30,
        rSpeed: (Math.random() - 0.5) * 4,
        type: 'heart',
        alpha: 1,
        gravity: -0.05,
        drag: 0.98,
        decay: 0.012
      });
    }
    if (!this.isActive) {
      this.isActive = true;
      this.render();
    }
  }

  drawHeart(ctx, x, y, size, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = color;
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(0, topCurveHeight);
    ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
    ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size, 0, size * 1.3);
    ctx.bezierCurveTo(0, size, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
    ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  render() {
    if (!this.isActive || !this.ctx) return;
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.vy += p.gravity;
      p.rotation += p.rSpeed;
      p.alpha -= p.decay;

      if (p.alpha <= 0 || p.y > window.innerHeight + 50) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.alpha);

      if (p.type === 'heart') {
        this.ctx.rotate(p.rotation * Math.PI / 180);
        this.drawHeart(this.ctx, p.x, p.y, p.size, p.color);
      } else if (p.type === 'circle') {
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        // Rectangle ribbon
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation * Math.PI / 180);
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.6);
      }

      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animId = requestAnimationFrame(() => this.render());
    } else {
      this.isActive = false;
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }
}

window.cardConfetti = new CardConfetti();
