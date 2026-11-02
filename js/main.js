/**
 * card4u Landing Page Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Render Templates
  renderTemplates('all');

  // Bind Category Filters
  const catButtons = document.querySelectorAll('.cat-tab');
  catButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      catButtons.forEach(b => {
        b.classList.remove('bg-amber-400', 'text-black', 'shadow-md');
        b.classList.add('bg-white/5', 'text-gray-300', 'hover:bg-white/10');
      });
      btn.classList.add('bg-amber-400', 'text-black', 'shadow-md');
      btn.classList.remove('bg-white/5', 'text-gray-300', 'hover:bg-white/10');

      const cat = btn.getAttribute('data-cat');
      renderTemplates(cat);
    });
  });

  // Hero Live Envelope Interactivity
  const heroEnvelope = document.getElementById('hero-envelope');
  const heroWaxSeal = document.getElementById('hero-wax-seal');
  const heroResetBtn = document.getElementById('hero-reset-btn');

  if (heroWaxSeal && heroEnvelope) {
    heroWaxSeal.addEventListener('click', (e) => {
      e.stopPropagation();
      openHeroEnvelope();
    });

    heroEnvelope.addEventListener('click', () => {
      if (heroEnvelope.classList.contains('is-opened')) {
        // Redirect to full card experience
        window.location.href = 'card.html?template=midnight-birthday';
      } else {
        openHeroEnvelope();
      }
    });

    if (heroResetBtn) {
      heroResetBtn.addEventListener('click', () => {
        heroEnvelope.classList.remove('is-opened');
        heroResetBtn.classList.add('hidden');
        if (window.cardAudio) window.cardAudio.stopAmbient();
      });
    }
  }

  function openHeroEnvelope() {
    if (heroEnvelope.classList.contains('is-opened')) return;

    heroEnvelope.classList.add('is-opened');
    if (heroResetBtn) heroResetBtn.classList.remove('hidden');

    // SFX & Confetti
    if (window.cardAudio) {
      window.cardAudio.playSealBreak();
      setTimeout(() => {
        window.cardAudio.startAmbient('birthday');
      }, 700);
    }

    if (window.cardConfetti) {
      const rect = heroEnvelope.getBoundingClientRect();
      window.cardConfetti.boom(rect.left + rect.width / 2, rect.top + rect.height / 2, 70, 'gold');
    }
  }
});

function renderTemplates(category = 'all') {
  const container = document.getElementById('template-grid');
  if (!container || !window.CARD_TEMPLATES) return;

  const templates = Object.values(window.CARD_TEMPLATES);
  const filtered = category === 'all' 
    ? templates 
    : templates.filter(t => t.category === category);

  container.innerHTML = filtered.map(t => {
    const previewImg = t.defaults.photos[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80';
    return `
      <div class="glass-panel rounded-2xl border border-white/10 overflow-hidden hover:border-amber-400/50 hover:shadow-2xl hover:shadow-amber-500/10 transition flex flex-col group">
        <!-- Thumbnail / Cover -->
        <div class="relative h-64 overflow-hidden bg-gray-950">
          <img src="${previewImg}" alt="${t.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
          <div class="absolute inset-0 bg-gradient-to-t from-[#0A0A0E] via-black/40 to-transparent"></div>
          
          <!-- Badge -->
          <div class="absolute top-4 left-4 flex gap-2">
            <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-400 text-black shadow-md">
              ${t.badge || '100% Free'}
            </span>
            <span class="px-2.5 py-1 rounded-full text-[11px] font-medium bg-black/60 text-white backdrop-blur border border-white/20">
              ${t.tag}
            </span>
          </div>

          <!-- Quick Preview Button -->
          <div class="absolute bottom-4 right-4">
            <a href="card.html?template=${t.id}" target="_blank" class="px-3 py-1.5 rounded-full bg-black/80 hover:bg-black text-white text-xs font-semibold backdrop-blur border border-white/20 flex items-center gap-1.5 transition">
              <i data-lucide="eye" class="w-3.5 h-3.5 text-amber-400"></i>
              <span>Live Demo</span>
            </a>
          </div>
        </div>

        <!-- Details -->
        <div class="p-6 flex-1 flex flex-col justify-between">
          <div>
            <h3 class="text-xl font-bold text-white mb-1.5 group-hover:text-amber-400 transition">${t.name}</h3>
            <p class="text-gray-400 text-xs leading-relaxed line-clamp-2">${t.description}</p>
          </div>

          <div class="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <div class="flex items-center gap-2 text-xs text-gray-400">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Music & Scratch-off</span>
            </div>

            <a href="studio.html?template=${t.id}" class="px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-black font-semibold text-xs shadow-md shadow-amber-500/20 hover:scale-105 transition flex items-center gap-1.5">
              <span>Customize</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) {
    window.lucide.createIcons();
  }
}
