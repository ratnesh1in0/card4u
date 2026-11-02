/**
 * card4u Scratch-to-Reveal Engine
 * Interactive metallic foil scratch card with touch/mouse support,
 * realistic coin brush, scratch sound effects, and auto-completion.
 */

class CardScratchCard {
  constructor(canvasElement, options = {}) {
    this.canvas = canvasElement;
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.options = Object.assign({
      foilColor: '#D4AF37', // Gold
      brushRadius: 22,
      revealThreshold: 45, // Percentage to auto-reveal
      onReveal: null,
      onProgress: null
    }, options);

    this.isDrawing = false;
    this.isRevealed = false;
    this.lastPoint = null;
    this.totalPixels = 0;
    this.scratchedPixels = 0;

    this.init();
  }

  init() {
    this.resize();
    this.paintFoil();
    this.bindEvents();
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.width = rect.width || 320;
    this.height = rect.height || 140;

    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;
    this.canvas.style.width = this.width + 'px';
    this.canvas.style.height = this.height + 'px';

    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    this.totalPixels = this.width * this.height;
  }

  paintFoil() {
    const w = this.width;
    const h = this.height;

    // Metallic golden gradient
    const grad = this.ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#BF953F');
    grad.addColorStop(0.25, '#FCF6BA');
    grad.addColorStop(0.5, '#B38728');
    grad.addColorStop(0.75, '#FBF5B7');
    grad.addColorStop(1, '#AA771C');

    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, w, h);

    // Subtle speckle/texture
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    for (let i = 0; i < 40; i++) {
      const rx = Math.random() * w;
      const ry = Math.random() * h;
      this.ctx.beginPath();
      this.ctx.arc(rx, ry, Math.random() * 2 + 1, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Elegant text banner on foil
    this.ctx.fillStyle = '#6D4C0D';
    this.ctx.font = '600 13px system-ui, -apple-system, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('✨ Scratch with finger or mouse to reveal ✨', w / 2, h / 2 - 8);

    this.ctx.font = '11px system-ui, -apple-system, sans-serif';
    this.ctx.fillStyle = '#8B6514';
    this.ctx.fillText('🪙 Tap & drag coin here', w / 2, h / 2 + 14);
  }

  bindEvents() {
    const handleStart = (e) => {
      if (this.isRevealed) return;
      this.isDrawing = true;
      this.lastPoint = this.getPos(e);
      this.scratchAt(this.lastPoint.x, this.lastPoint.y);
      if (window.cardAudio) window.cardAudio.playScratchSound();
    };

    const handleMove = (e) => {
      if (!this.isDrawing || this.isRevealed) return;
      e.preventDefault();
      const currentPoint = this.getPos(e);
      this.scratchLine(this.lastPoint, currentPoint);
      this.lastPoint = currentPoint;

      if (Math.random() > 0.4 && window.cardAudio) {
        window.cardAudio.playScratchSound();
      }

      this.checkCompletion();
    };

    const handleEnd = () => {
      this.isDrawing = false;
      this.lastPoint = null;
    };

    this.canvas.addEventListener('mousedown', handleStart);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);

    this.canvas.addEventListener('touchstart', handleStart, { passive: false });
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);
  }

  getPos(e) {
    const rect = this.canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  scratchAt(x, y) {
    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.options.brushRadius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  scratchLine(p1, p2) {
    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.lineWidth = this.options.brushRadius * 2;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.beginPath();
    this.ctx.moveTo(p1.x, p1.y);
    this.ctx.lineTo(p2.x, p2.y);
    this.ctx.stroke();
  }

  checkCompletion() {
    if (this.isRevealed) return;
    
    // Throttle check
    if (this._checkTimer) return;
    this._checkTimer = setTimeout(() => {
      this._checkTimer = null;
      try {
        const imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imgData.data;
        let transparentCount = 0;
        const total = data.length / 4;

        // Sample every 16th pixel for speed
        const step = 16;
        for (let i = 3; i < data.length; i += 4 * step) {
          if (data[i] === 0) {
            transparentCount++;
          }
        }

        const percent = Math.round((transparentCount / (total / step)) * 100);
        if (this.options.onProgress) {
          this.options.onProgress(percent);
        }

        if (percent >= this.options.revealThreshold) {
          this.revealAll();
        }
      } catch (e) {
        console.warn("Scratch check err", e);
      }
    }, 120);
  }

  revealAll() {
    if (this.isRevealed) return;
    this.isRevealed = true;

    // Fade out canvas
    this.canvas.style.transition = 'opacity 0.6s ease-out';
    this.canvas.style.opacity = '0';

    setTimeout(() => {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.canvas.style.display = 'none';
      if (window.cardConfetti) {
        const rect = this.canvas.getBoundingClientRect();
        window.cardConfetti.boom(rect.left + rect.width / 2, rect.top + rect.height / 2, 45, 'gold');
      }
      if (window.cardAudio) {
        window.cardAudio.playConfettiPop();
      }
      if (this.options.onReveal) {
        this.options.onReveal();
      }
    }, 600);
  }
}

window.CardScratchCard = CardScratchCard;
