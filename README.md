# card4u ✨
### Cinematic, Interactive Digital Cards & Celebration Websites (100% Free)

Inspired by high-end celebration platforms like Wishlys, **card4u** elevates invitations and greeting cards into cinematic, multisensory web experiences. Unlike traditional flat paper cards or static PDFs, card4u delivers animated 3D wax-seal envelopes, real touch/mouse scratch-to-reveal surprises, soothing ambient soundtracks, live countdown clocks, and interactive guest RSVP wishbooks.

> **Note on Pricing**: In strict accordance with your instructions, **card4u contains NO pricing, subscriptions, checkout paywalls, or hidden fees**. All features, luxury templates, and unlimited sharing are completely free forever.

---

## 🌟 Key Features

1. **💌 3D Wax Seal Envelope Unveiling**:
   - Realistic 3D perspective fold with wax seal snap sound effects (`Web Audio API`).
   - Flap opens and card letter slides out with celebration confetti bursts.

2. **🪙 Interactive Scratch-to-Reveal Card**:
   - HTML5 canvas metallic gold foil overlay.
   - Recipients drag a virtual coin or their finger to scratch off and uncover secret venue tips, surprise messages, or flight tickets.
   - Triggers festive confetti and chime on completion.

3. **🎵 Integrated Ambient Soundtracks**:
   - Zero-external-dependency Web Audio synthesizers:
     - **Romantic**: Warm piano arpeggios & soft Rhodes chords.
     - **Birthday**: Joyful celebration bells & melody.
     - **Royal**: Palace acoustic sitar/shehnai harmonics.
     - **Chill**: Lo-Fi relaxed groove.
   - Support for custom MP3 URLs or audio uploads.

4. **⏱️ Real-Time Countdown Timer & Navigation**:
   - Ticking down days, hours, minutes, and seconds to the event.
   - Integrated Google Maps venue button.

5. **📸 Polaroid Memory Slideshow**:
   - Nostalgic polaroid photo frames with captions and responsive carousel controls.

6. **💬 Interactive RSVP & Wishes Wall**:
   - Guests can submit their attendance status (Attending / Maybe / Declined).
   - Post heartfelt messages directly to the celebration guestbook.

7. **📱 Instant WhatsApp & QR Code Sharing**:
   - Zero-backend client-side state serialization: Cards encode safely into portable URL parameters (`card.html#data=...`).
   - 1-click WhatsApp message generation with prefilled greeting.
   - Real-time QR code generation for physical table cards or gift boxes.

---

## 🚀 How to Run & Preview

You can open the files directly in any web browser, or launch a quick local development server:

### Option 1: Using Python (Built-in)
```bash
cd card4u
python3 -m http.server 3000
```
Then visit: `http://localhost:3000/`

### Option 2: Using Node / npx
```bash
cd card4u
npm start
```
Then open `http://localhost:3000/` in your browser.

---

## 📁 File Structure

```
card4u/
├── index.html         # Main Landing Page & Live Envelope Showcase
├── studio.html        # Card Customizer Studio with Live iPhone 16 Pro Mockup
├── card.html          # Cinematic Full-Screen Recipient Card Experience
├── package.json       # Project scripts
├── README.md          # Documentation
├── css/
│   └── style.css      # Luxury theme styles, 3D envelope, gold gradients, animations
└── js/
    ├── audio.js       # Native Web Audio API synthesizer for melodies & SFX
    ├── confetti.js    # Canvas confetti particle system (hearts, gold ribbon, stars)
    ├── scratch.js     # HTML5 canvas interactive scratch-to-reveal engine
    ├── templates.js   # 6+ curated luxury templates (Wedding, Birthday, Love, etc.)
    ├── storage.js     # Zero-backend URL codec & LocalStorage manager
    ├── main.js        # Landing page logic & template catalog
    ├── studio.js      # Studio customizer, real-time sync & QR generation
    └── viewer.js      # Recipient card viewer, unseal sequence & RSVP handler
```
