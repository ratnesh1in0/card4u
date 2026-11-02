/**
 * card4u Storage & URL Codec Engine
 * Enables zero-backend, portable card generation and persistence.
 * Cards are safely serialized into URL fragments for instant sharing via WhatsApp/Email.
 */

class CardStorage {
  constructor() {
    this.STORAGE_KEY = 'card4u_saved_cards';
    this.RSVP_KEY_PREFIX = 'card4u_rsvp_';
    this.WISHES_KEY_PREFIX = 'card4u_wishes_';
  }

  // Encode card object into URL safe base64 string
  encodeCard(cardData) {
    try {
      const jsonStr = JSON.stringify(cardData);
      // UTF-8 friendly base64 encoding
      const utf8Bytes = new TextEncoder().encode(jsonStr);
      let binary = '';
      for (let i = 0; i < utf8Bytes.byteLength; i++) {
        binary += String.fromCharCode(utf8Bytes[i]);
      }
      return encodeURIComponent(btoa(binary));
    } catch (e) {
      console.error("Card encoding error", e);
      return '';
    }
  }

  // Decode card object from URL string
  decodeCard(encodedStr) {
    try {
      if (!encodedStr) return null;
      const binary = atob(decodeURIComponent(encodedStr));
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const jsonStr = new TextDecoder().decode(bytes);
      return JSON.parse(jsonStr);
    } catch (e) {
      console.warn("Card decoding error, fallback null", e);
      return null;
    }
  }

  // Get active card data from current URL query or hash
  getCardFromUrl() {
    const hash = window.location.hash;
    const search = window.location.search;

    // Check #data=...
    if (hash && hash.includes('data=')) {
      const match = hash.match(/data=([^&]+)/);
      if (match && match[1]) {
        return this.decodeCard(match[1]);
      }
    }

    // Check ?data=...
    if (search && search.includes('data=')) {
      const urlParams = new URLSearchParams(search);
      const dataParam = urlParams.get('data');
      if (dataParam) {
        return this.decodeCard(dataParam);
      }
    }

    // Check template id ?template=... or #template=...
    const urlParams = new URLSearchParams(search);
    const templateId = urlParams.get('template') || (hash.match(/template=([^&]+)/) ? hash.match(/template=([^&]+)/)[1] : null);
    if (templateId && window.CARD_TEMPLATES && window.CARD_TEMPLATES[templateId]) {
      const t = window.CARD_TEMPLATES[templateId];
      return {
        id: 'tpl_' + t.id,
        templateId: t.id,
        ...t.defaults,
        theme: t.theme
      };
    }

    return null;
  }

  // Save card locally in browser
  saveLocalCard(cardData) {
    try {
      const existing = this.getLocalCards();
      const id = cardData.id || ('card_' + Date.now());
      cardData.id = id;
      cardData.updatedAt = new Date().toISOString();

      const index = existing.findIndex(c => c.id === id);
      if (index >= 0) {
        existing[index] = cardData;
      } else {
        existing.unshift(cardData);
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existing));
      return cardData;
    } catch (e) {
      console.warn("LocalStorage save error", e);
      return cardData;
    }
  }

  getLocalCards() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  // RSVPs
  saveRsvp(cardId, rsvpData) {
    try {
      const key = this.RSVP_KEY_PREFIX + (cardId || 'default');
      const list = this.getRsvps(cardId);
      list.push({
        ...rsvpData,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem(key, JSON.stringify(list));
      return list;
    } catch (e) {
      return [];
    }
  }

  getRsvps(cardId) {
    try {
      const key = this.RSVP_KEY_PREFIX + (cardId || 'default');
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  // Guestbook Wishes
  saveWish(cardId, wishData) {
    try {
      const key = this.WISHES_KEY_PREFIX + (cardId || 'default');
      const list = this.getWishes(cardId);
      list.unshift({
        ...wishData,
        id: 'wish_' + Date.now(),
        timestamp: new Date().toISOString()
      });
      localStorage.setItem(key, JSON.stringify(list));
      return list;
    } catch (e) {
      return [];
    }
  }

  getWishes(cardId) {
    try {
      const key = this.WISHES_KEY_PREFIX + (cardId || 'default');
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
      // Prepopulate friendly sample wishes
      return [
        {
          name: 'Pooja & Sameer',
          message: 'Wishing you both a lifetime of happiness, laughter, and endless love! Cannot wait to celebrate! 🎉💖',
          timestamp: 'Just now'
        },
        {
          name: 'Vikram Mehta',
          message: 'So incredibly happy for you! Sending all the love and biggest congratulations! ✨🥂',
          timestamp: '2 hours ago'
        }
      ];
    } catch (e) {
      return [];
    }
  }

  // Generate shareable link
  getShareableUrl(cardData, baseUrl = null) {
    const encoded = this.encodeCard(cardData);
    const origin = baseUrl || window.location.href.split(/[?#]/)[0].replace(/studio\.html|index\.html/, 'card.html');
    return `${origin}#data=${encoded}`;
  }
}

window.cardStorage = new CardStorage();
