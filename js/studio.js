/**
 * card4u Studio Controller
 * Powers the real-time card customizer, live iPhone mockup synchronization,
 * scratch card preview, and zero-backend link/QR generation.
 */

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();

  // Current Card State
  let currentTemplateId = 'royal-wedding';
  let activeCardData = {};
  let previewScratchInstance = null;
  let countdownInterval = null;

  // Initialize Template from URL or Default
  const urlParams = new URLSearchParams(window.location.search);
  const initialTpl = urlParams.get('template');
  if (initialTpl && window.CARD_TEMPLATES && window.CARD_TEMPLATES[initialTpl]) {
    currentTemplateId = initialTpl;
  }

  loadTemplate(currentTemplateId);
  renderTemplateSelector();
  bindStudioEvents();
  updateLivePreview();

  // Functions
  function loadTemplate(tplId) {
    currentTemplateId = tplId;
    const tpl = window.CARD_TEMPLATES[tplId];
    if (!tpl) return;

    activeCardData = {
      templateId: tpl.id,
      recipientName: tpl.defaults.recipientName,
      senderName: tpl.defaults.senderName,
      occasion: tpl.defaults.occasion,
      title: tpl.defaults.title,
      message: tpl.defaults.message,
      secretMessage: tpl.defaults.secretMessage,
      date: tpl.defaults.date,
      venue: tpl.defaults.venue,
      mapsUrl: tpl.defaults.mapsUrl || 'https://maps.google.com',
      photos: [...tpl.defaults.photos],
      music: tpl.theme.music || 'romantic',
      customAudioUrl: '',
      theme: { ...tpl.theme }
    };

    // Populate Input Fields
    document.getElementById('input-recipient').value = activeCardData.recipientName;
    document.getElementById('input-sender').value = activeCardData.senderName;
    document.getElementById('input-title').value = activeCardData.title;
    document.getElementById('input-message').value = activeCardData.message;
    document.getElementById('input-secret').value = activeCardData.secretMessage;
    document.getElementById('input-date').value = activeCardData.date || '';
    document.getElementById('input-venue').value = activeCardData.venue || '';
    document.getElementById('current-template-name').textContent = tpl.name;

    // Update Music Selection Pill
    updateMusicCards(activeCardData.music);

    // Update Photos
    renderPhotoThumbnails();

    // Re-sync preview
    updateLivePreview();
  }

  function renderTemplateSelector() {
    const container = document.getElementById('template-options');
    if (!container || !window.CARD_TEMPLATES) return;

    container.innerHTML = Object.values(window.CARD_TEMPLATES).map(t => {
      const isSelected = t.id === currentTemplateId;
      return `
        <button type="button" class="tpl-select-btn p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
          isSelected ? 'border-amber-400 bg-amber-400/10' : 'border-white/10 bg-white/5 hover:bg-white/10'
        }" data-id="${t.id}">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-bold text-white truncate">${t.name}</span>
            ${isSelected ? '<span class="w-2 h-2 rounded-full bg-amber-400"></span>' : ''}
          </div>
          <span class="text-[10px] text-gray-400">${t.badge}</span>
        </button>
      `;
    }).join('');

    container.querySelectorAll('.tpl-select-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        loadTemplate(id);
        renderTemplateSelector();
      });
    });
  }

  function renderPhotoThumbnails() {
    const container = document.getElementById('photo-thumbnails');
    if (!container) return;

    container.innerHTML = activeCardData.photos.map((src, idx) => `
      <div class="relative group rounded-xl overflow-hidden aspect-video bg-gray-900 border border-white/10">
        <img src="${src}" class="w-full h-full object-cover">
        <button type="button" class="remove-photo-btn absolute top-1 right-1 p-1 rounded-full bg-black/70 hover:bg-red-600 text-white transition" data-idx="${idx}">
          <i data-lucide="trash-2" class="w-3 h-3"></i>
        </button>
      </div>
    `).join('');

    container.querySelectorAll('.remove-photo-btn').forEach(b => {
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(b.getAttribute('data-idx'));
        if (activeCardData.photos.length > 1) {
          activeCardData.photos.splice(idx, 1);
          renderPhotoThumbnails();
          updateLivePreview();
        } else {
          alert("Please keep at least one photo.");
        }
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  function updateMusicCards(trackName) {
    document.querySelectorAll('.music-card').forEach(btn => {
      const isSel = btn.getAttribute('data-track') === trackName;
      if (isSel) {
        btn.classList.add('border-amber-400', 'bg-amber-400/10');
        btn.classList.remove('border-white/10', 'bg-white/5');
      } else {
        btn.classList.remove('border-amber-400', 'bg-amber-400/10');
        btn.classList.add('border-white/10', 'bg-white/5');
      }
    });
  }

  function bindStudioEvents() {
    // Input syncs
    const bindInput = (id, key) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => {
          activeCardData[key] = el.value;
          updateLivePreview();
        });
      }
    };

    bindInput('input-recipient', 'recipientName');
    bindInput('input-sender', 'senderName');
    bindInput('input-title', 'title');
    bindInput('input-message', 'message');
    bindInput('input-secret', 'secretMessage');
    bindInput('input-date', 'date');
    bindInput('input-venue', 'venue');

    // Preset chips
    document.querySelectorAll('.preset-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const type = chip.getAttribute('data-preset');
        applyPresetMessage(type);
      });
    });

    // Music selection
    document.querySelectorAll('.music-card').forEach(btn => {
      btn.addEventListener('click', () => {
        const track = btn.getAttribute('data-track');
        activeCardData.music = track;
        updateMusicCards(track);
        if (window.cardAudio && window.cardAudio.isPlaying) {
          window.cardAudio.startAmbient(track);
        }
      });
    });

    // Custom audio url
    const customAudioInput = document.getElementById('input-custom-audio');
    if (customAudioInput) {
      customAudioInput.addEventListener('change', () => {
        activeCardData.customAudioUrl = customAudioInput.value.trim();
        if (activeCardData.customAudioUrl && window.cardAudio && window.cardAudio.isPlaying) {
          window.cardAudio.startAmbient(activeCardData.music, activeCardData.customAudioUrl);
        }
      });
    }

    // Photo upload input
    const photoUpload = document.getElementById('photo-upload-input');
    if (photoUpload) {
      photoUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            activeCardData.photos.unshift(event.target.result);
            if (activeCardData.photos.length > 3) activeCardData.photos.pop();
            renderPhotoThumbnails();
            updateLivePreview();
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Audio Preview Toggle Button
    const audioToggleBtn = document.getElementById('toggle-audio-btn');
    if (audioToggleBtn) {
      audioToggleBtn.addEventListener('click', () => {
        if (!window.cardAudio) return;
        const isNowPlaying = window.cardAudio.toggle(activeCardData.music, activeCardData.customAudioUrl);
        if (isNowPlaying) {
          audioToggleBtn.classList.add('bg-amber-400', 'text-black');
          audioToggleBtn.classList.remove('glass-panel', 'text-gray-300');
        } else {
          audioToggleBtn.classList.remove('bg-amber-400', 'text-black');
          audioToggleBtn.classList.add('glass-panel', 'text-gray-300');
        }
      });
    }

    // Phone envelope wax seal interaction
    const phoneWaxSeal = document.getElementById('phone-wax-seal');
    const phoneEnvelope = document.getElementById('phone-envelope');
    const phoneFoldedWrap = document.getElementById('phone-envelope-container');
    const phoneUnfoldedWrap = document.getElementById('phone-card-unfolded');
    const phoneResetFoldBtn = document.getElementById('phone-reset-fold');

    if (phoneWaxSeal && phoneEnvelope) {
      phoneWaxSeal.addEventListener('click', (e) => {
        e.stopPropagation();
        openPhoneCard();
      });
      phoneEnvelope.addEventListener('click', () => {
        openPhoneCard();
      });
    }

    if (phoneResetFoldBtn) {
      phoneResetFoldBtn.addEventListener('click', () => {
        phoneEnvelope.classList.remove('is-opened');
        phoneFoldedWrap.classList.remove('hidden');
        phoneUnfoldedWrap.classList.add('hidden');
      });
    }

    function openPhoneCard() {
      phoneEnvelope.classList.add('is-opened');
      if (window.cardAudio) window.cardAudio.playSealBreak();

      setTimeout(() => {
        phoneFoldedWrap.classList.add('hidden');
        phoneUnfoldedWrap.classList.remove('hidden');
        initPreviewScratchCard();
      }, 700);
    }

    // Full screen preview button
    document.getElementById('preview-full-btn').addEventListener('click', () => {
      const shareUrl = window.cardStorage.getShareableUrl(activeCardData);
      window.open(shareUrl, '_blank');
    });

    // Share & Get Link Modal Handlers
    const shareModal = document.getElementById('share-modal');
    const openShareBtn = document.getElementById('open-share-btn');
    const closeShareBtn = document.getElementById('close-share-modal');
    const shareUrlInput = document.getElementById('share-url-input');
    const copyLinkBtn = document.getElementById('copy-link-btn');
    const copyBtnText = document.getElementById('copy-btn-text');
    const whatsappBtn = document.getElementById('whatsapp-share-btn');
    const openDirectCard = document.getElementById('open-card-direct');
    const qrcodeContainer = document.getElementById('qrcode-container');

    openShareBtn.addEventListener('click', () => {
      // Save local card
      window.cardStorage.saveLocalCard(activeCardData);

      const shareUrl = window.cardStorage.getShareableUrl(activeCardData);
      shareUrlInput.value = shareUrl;
      openDirectCard.href = shareUrl;

      // WhatsApp pre-filled text
      const waMsg = encodeURIComponent(
        `✨ A special celebration card for you: ${activeCardData.recipientName}! 💌 Open your envelope here:\n${shareUrl}`
      );
      whatsappBtn.href = `https://api.whatsapp.com/send?text=${waMsg}`;

      // Generate QR Code
      qrcodeContainer.innerHTML = '';
      if (window.QRCode) {
        new QRCode(qrcodeContainer, {
          text: shareUrl,
          width: 140,
          height: 140,
          colorDark: '#0A0A0D',
          colorLight: '#FFFFFF',
          correctLevel: QRCode.CorrectLevel.M
        });
      }

      shareModal.classList.remove('hidden');
      if (window.cardConfetti) {
        window.cardConfetti.boom(window.innerWidth / 2, window.innerHeight / 2, 50, 'gold');
      }
    });

    closeShareBtn.addEventListener('click', () => {
      shareModal.classList.add('hidden');
    });

    copyLinkBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(shareUrlInput.value).then(() => {
        copyBtnText.textContent = 'Copied!';
        copyLinkBtn.classList.replace('bg-amber-400', 'bg-emerald-400');
        setTimeout(() => {
          copyBtnText.textContent = 'Copy';
          copyLinkBtn.classList.replace('bg-emerald-400', 'bg-amber-400');
        }, 2000);
      });
    });
  }

  function applyPresetMessage(type) {
    const messages = {
      romantic: "In all the world, there is no heart for me like yours. From our late night conversations to our quiet mornings, every moment with you is my greatest blessing. I love you endlessly! ❤️",
      birthday: "Happy Birthday to my all-time favorite partner in crime! May this year bring you mountains of laughter, unstoppable adventures, and everything your heart desires. Let's party! 🎉🎂",
      wedding: "Two lives, two hearts, joined together in friendship and united forever in love. We warmly invite you to celebrate our wedding and shower your blessings upon us! 💍✨",
      anniversary: "Happy 10th Anniversary! Through every peak and valley, your love and grace have illuminated our journey. Here's to celebrating decades more of laughter, growth, and joy! 🥂"
    };

    if (messages[type]) {
      activeCardData.message = messages[type];
      document.getElementById('input-message').value = messages[type];
      updateLivePreview();
    }
  }

  function updateLivePreview() {
    // Envelope Styling
    const envBody = document.getElementById('preview-env-body');
    const envFlap = document.getElementById('preview-env-flap');
    const envOccasion = document.getElementById('preview-env-occasion');
    const envTitle = document.getElementById('preview-env-title');

    if (activeCardData.theme) {
      if (envBody) envBody.style.background = activeCardData.theme.envelopeColor || '#5C0612';
      if (envFlap) envFlap.style.borderTopColor = activeCardData.theme.envelopeFlap || '#780B1B';
    }

    if (envOccasion) envOccasion.textContent = activeCardData.occasion ? activeCardData.occasion.toUpperCase() : 'SPECIAL CELEBRATION';
    if (envTitle) envTitle.textContent = activeCardData.title || 'A special invitation for you';

    // Unfolded elements
    const pRecipient = document.getElementById('preview-recipient-name');
    const pHeadline = document.getElementById('preview-headline');
    const pMessage = document.getElementById('preview-body-message');
    const pSecret = document.getElementById('preview-secret-text');
    const pVenue = document.getElementById('preview-venue-name');
    const pPhoto = document.getElementById('preview-single-photo');

    if (pRecipient) pRecipient.textContent = activeCardData.recipientName || 'Dear Recipient';
    if (pHeadline) pHeadline.textContent = activeCardData.title || '';
    if (pMessage) pMessage.textContent = activeCardData.message || '';
    if (pSecret) pSecret.textContent = activeCardData.secretMessage || '🎁 Scratch to reveal secret!';
    if (pVenue) pVenue.textContent = activeCardData.venue || 'Private Venue';
    if (pPhoto && activeCardData.photos && activeCardData.photos[0]) {
      pPhoto.src = activeCardData.photos[0];
    }

    // Countdown
    startCountdown(activeCardData.date);
  }

  function startCountdown(dateStr) {
    if (countdownInterval) clearInterval(countdownInterval);
    const target = dateStr ? new Date(dateStr).getTime() : Date.now() + (4 * 86400000);

    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);

      const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = String(val).padStart(2, '0');
      };

      setVal('prev-d', d);
      setVal('prev-h', h);
      setVal('prev-m', m);
      setVal('prev-s', s);
    };

    tick();
    countdownInterval = setInterval(tick, 1000);
  }

  function initPreviewScratchCard() {
    const canvas = document.getElementById('preview-scratch-canvas');
    if (!canvas) return;

    if (previewScratchInstance) {
      canvas.style.display = 'block';
      canvas.style.opacity = '1';
    }

    previewScratchInstance = new window.CardScratchCard(canvas, {
      brushRadius: 18,
      revealThreshold: 40,
      onReveal: () => {
        // Confetti inside mockup
      }
    });
  }
});
