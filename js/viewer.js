/**
 * card4u Card Viewer Controller
 * Handles the recipient unsealing sequence, audio choreography,
 * scratch card initialization, countdown clock, and live RSVP wishes wall.
 */

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();

  // Retrieve Card Data
  let card = window.cardStorage.getCardFromUrl();

  // Fallback to Royal Wedding if none provided
  if (!card) {
    const defaultTpl = window.CARD_TEMPLATES['royal-wedding'];
    card = {
      id: 'default_card',
      templateId: defaultTpl.id,
      ...defaultTpl.defaults,
      theme: defaultTpl.theme
    };
  }

  // Populate Envelope Screen
  setupEnvelopeScreen(card);

  // Populate Main Card Content
  setupCardContent(card);

  // Bind Music Toggle
  setupMusicControls(card);

  // Bind Floating Reaction Hearts Button
  setupFloatingReactions();

  // Bind RSVP Form
  setupRsvpAndWishes(card);
});

function setupEnvelopeScreen(card) {
  const unsealScreen = document.getElementById('unseal-screen');
  const envWrapper = document.getElementById('recipient-envelope');
  const waxSeal = document.getElementById('recipient-wax-seal');
  const toName = document.getElementById('envelope-to-name');
  const previewOccasion = document.getElementById('env-preview-occasion');
  const previewTitle = document.getElementById('env-preview-title');
  const envBody = document.getElementById('envelope-body-el');
  const envFlap = document.getElementById('envelope-flap-el');

  if (toName) toName.textContent = `For ${card.recipientName || 'Our Special Friend'}`;
  if (previewOccasion) previewOccasion.textContent = (card.occasion || 'INVITATION').toUpperCase();
  if (previewTitle) previewTitle.textContent = card.title || 'A special surprise for you';

  // Apply Theme Colors to Envelope
  if (card.theme) {
    if (envBody && card.theme.envelopeColor) envBody.style.background = card.theme.envelopeColor;
    if (envFlap && card.theme.envelopeFlap) envFlap.style.borderTopColor = card.theme.envelopeFlap;
  }

  // Wax Seal Tap Event
  let isOpening = false;
  const triggerOpen = () => {
    if (isOpening) return;
    isOpening = true;

    // 1. Crack wax seal sound
    if (window.cardAudio) {
      window.cardAudio.playSealBreak();
    }

    // 2. Open Flap
    envWrapper.classList.add('is-opened');

    // 3. Confetti Explosion
    if (window.cardConfetti) {
      const rect = envWrapper.getBoundingClientRect();
      window.cardConfetti.boom(rect.left + rect.width / 2, rect.top + rect.height / 2, 90, 'gold');
    }

    // 4. Start Ambient Music
    setTimeout(() => {
      if (window.cardAudio) {
        window.cardAudio.startAmbient(card.music || 'romantic', card.customAudioUrl || null);
      }
    }, 700);

    // 5. Fade out envelope screen and fade in full card
    setTimeout(() => {
      unsealScreen.style.opacity = '0';
      unsealScreen.style.pointerEvents = 'none';

      const mainContent = document.getElementById('card-main-content');
      mainContent.classList.remove('opacity-0', 'pointer-events-none');
      mainContent.classList.add('opacity-100');

      // Initialize scratch card after card becomes visible
      initScratchCard(card);
    }, 1200);
  };

  if (waxSeal) {
    waxSeal.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerOpen();
    });
  }

  if (envWrapper) {
    envWrapper.addEventListener('click', () => {
      triggerOpen();
    });
  }
}

function setupCardContent(card) {
  // Badges & Names
  const badgeEl = document.getElementById('card-badge');
  const nameEl = document.getElementById('card-recipient-name');
  const headlineEl = document.getElementById('card-headline');
  const letterEl = document.getElementById('card-letter-message');
  const senderEl = document.getElementById('card-sender-name');
  const secretEl = document.getElementById('card-secret-revealed');
  const venueEl = document.getElementById('card-venue-name');
  const dateFormattedEl = document.getElementById('card-date-formatted');
  const mapsBtn = document.getElementById('card-maps-btn');

  if (badgeEl) badgeEl.textContent = (card.occasion || 'CELEBRATION') + ' SPECIAL';
  if (nameEl) nameEl.textContent = card.recipientName || 'Our Dearest';
  if (headlineEl) headlineEl.textContent = card.title || 'Celebrating together';
  if (letterEl) letterEl.textContent = `"${card.message || ''}"`;
  if (senderEl) senderEl.textContent = card.senderName || 'Your Loved Ones';
  if (secretEl) secretEl.textContent = card.secretMessage || '🎁 Thank you for being in our lives!';
  if (venueEl) venueEl.textContent = card.venue || 'Private Celebration Venue';

  if (dateFormattedEl && card.date) {
    try {
      const d = new Date(card.date);
      dateFormattedEl.textContent = d.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      dateFormattedEl.textContent = card.date;
    }
  }

  if (mapsBtn && card.mapsUrl) {
    mapsBtn.href = card.mapsUrl;
  }

  // Live Countdown Clock
  setupCountdownClock(card.date);

  // Photo Slideshow
  setupPhotoGallery(card.photos);
}

function setupCountdownClock(targetDateStr) {
  const target = targetDateStr ? new Date(targetDateStr).getTime() : Date.now() + (5 * 86400000);

  const tick = () => {
    const now = Date.now();
    const diff = Math.max(0, target - now);

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / 1000 / 60) % 60);
    const s = Math.floor((diff / 1000) % 60);

    const setEl = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = String(val).padStart(2, '0');
    };

    setEl('clock-days', d);
    setEl('clock-hours', h);
    setEl('clock-mins', m);
    setEl('clock-secs', s);
  };

  tick();
  setInterval(tick, 1000);
}

function initScratchCard(card) {
  const canvas = document.getElementById('card-scratch-canvas');
  if (!canvas) return;

  new window.CardScratchCard(canvas, {
    brushRadius: 24,
    revealThreshold: 45,
    onReveal: () => {
      if (window.cardConfetti) {
        window.cardConfetti.boom(window.innerWidth / 2, window.innerHeight * 0.6, 60, 'romantic');
      }
    }
  });
}

function setupPhotoGallery(photos) {
  const section = document.getElementById('photos-section');
  if (!photos || photos.length === 0) {
    if (section) section.style.display = 'none';
    return;
  }

  let currentIndex = 0;
  const mainImg = document.getElementById('gallery-main-img');
  const counter = document.getElementById('gallery-counter');
  const prevBtn = document.getElementById('gallery-prev-btn');
  const nextBtn = document.getElementById('gallery-next-btn');
  const dotsContainer = document.getElementById('gallery-dots');

  const updateGallery = (idx) => {
    currentIndex = (idx + photos.length) % photos.length;
    mainImg.src = photos[currentIndex];
    counter.textContent = `${currentIndex + 1} of ${photos.length}`;

    // Render Dots
    if (dotsContainer) {
      dotsContainer.innerHTML = photos.map((_, i) => `
        <span class="w-2 h-2 rounded-full transition-all ${
          i === currentIndex ? 'bg-amber-400 w-4' : 'bg-white/30'
        }"></span>
      `).join('');
    }
  };

  updateGallery(0);

  if (prevBtn) prevBtn.addEventListener('click', () => updateGallery(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => updateGallery(currentIndex + 1));
}

function setupMusicControls(card) {
  const toggleBtn = document.getElementById('card-music-toggle');
  const statusText = document.getElementById('music-status-text');
  const eqBars = document.getElementById('equalizer-bars');

  if (toggleBtn && window.cardAudio) {
    window.cardAudio.onStateChange = (isPlaying) => {
      if (isPlaying) {
        statusText.textContent = 'Music On';
        toggleBtn.classList.add('text-amber-300');
        eqBars.style.opacity = '1';
      } else {
        statusText.textContent = 'Music Off';
        toggleBtn.classList.remove('text-amber-300');
        eqBars.style.opacity = '0.3';
      }
    };

    toggleBtn.addEventListener('click', () => {
      window.cardAudio.toggle(card.music || 'romantic', card.customAudioUrl || null);
    });
  }
}

function setupFloatingReactions() {
  const btn = document.getElementById('floating-reaction-btn');
  if (btn && window.cardConfetti) {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      window.cardConfetti.floatingHearts(rect.left + rect.width / 2, rect.top, 8);
      if (window.cardAudio) window.cardAudio.playConfettiPop();
    });
  }
}

function setupRsvpAndWishes(card) {
  const form = document.getElementById('rsvp-form');
  const wishesContainer = document.getElementById('wishes-wall-container');

  const renderWishes = () => {
    const list = window.cardStorage.getWishes(card.id);
    if (!wishesContainer) return;

    wishesContainer.innerHTML = list.map(item => `
      <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-amber-300">${item.name}</span>
          <span class="text-[10px] text-gray-500">${item.timestamp || 'Recently'}</span>
        </div>
        <p class="text-xs text-gray-300 leading-relaxed">${item.message}</p>
      </div>
    `).join('');
  };

  renderWishes();

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('rsvp-name').value.trim();
      const status = document.getElementById('rsvp-status').value;
      const wishText = document.getElementById('rsvp-wish').value.trim();

      if (!name || !wishText) return;

      // Save RSVP
      window.cardStorage.saveRsvp(card.id, { name, status });

      // Save Wish
      window.cardStorage.saveWish(card.id, {
        name: name,
        message: wishText,
        timestamp: 'Just now'
      });

      // Show Feedback
      renderWishes();
      form.reset();

      // Celebration
      if (window.cardConfetti) {
        window.cardConfetti.boom(window.innerWidth / 2, window.innerHeight * 0.7, 70, 'romantic');
      }
      if (window.cardAudio) {
        window.cardAudio.playConfettiPop();
      }

      alert("Thank you! Your RSVP and heartfelt wish have been posted to the celebration wall! 🎉");
    });
  }
}
