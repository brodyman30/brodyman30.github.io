// ---------------------------------------------------------------------------
// Media card 3D parallax + hover enlarge
// ---------------------------------------------------------------------------
// Pointer position over each .uxui-card is mapped to:
//   - rotateX / rotateY on the card  (tilt)
//   - translate + scale on the inner <img>  (parallax + enlarge)
// Values are written to CSS custom properties so the actual transform lives
// in CSS, keeping the easing / reduced-motion fallback declarative.
(() => {
    const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    );

    const MAX_TILT = 10;       // degrees
    const MAX_PARALLAX = 12;   // px image offset
    const HOVER_SCALE = 1.08;  // image enlarge on hover
    const HOVER_LIFT = -6;     // px card lift on hover

    const cards = document.querySelectorAll('.uxui-card');

    cards.forEach(card => {
        const img = card.querySelector('img');
        if (!img) return;

        // Make the card keyboard-focusable and announce it as a button so
        // the gallery is reachable without a pointer. The image already has
        // the onclick handler that opens the modal — Enter/Space forward to it.
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        const label = card.querySelector('.uxui-card-title')?.textContent?.trim()
            || img.alt || 'Open image';
        card.setAttribute('aria-label', label);

        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                img.click();
            }
        });

        let rafId = null;
        let pendingEvent = null;

        const applyTilt = () => {
            rafId = null;
            if (!pendingEvent || prefersReducedMotion.matches) return;
            const rect = card.getBoundingClientRect();
            const px = (pendingEvent.clientX - rect.left) / rect.width;
            const py = (pendingEvent.clientY - rect.top) / rect.height;
            // Map [0,1] → [-1,1]
            const nx = px * 2 - 1;
            const ny = py * 2 - 1;
            // rotateX is inverted: pointer near top should tilt card toward viewer.
            card.style.setProperty('--tilt-y', (nx * MAX_TILT).toFixed(2) + 'deg');
            card.style.setProperty('--tilt-x', (-ny * MAX_TILT).toFixed(2) + 'deg');
            card.style.setProperty('--img-x', (nx * MAX_PARALLAX).toFixed(2) + 'px');
            card.style.setProperty('--img-y', (ny * MAX_PARALLAX).toFixed(2) + 'px');
        };

        const onPointerEnter = () => {
            card.classList.add('is-hover');
            if (!prefersReducedMotion.matches) {
                card.style.setProperty('--lift', HOVER_LIFT + 'px');
                card.style.setProperty('--img-scale', HOVER_SCALE);
            }
        };

        const onPointerMove = e => {
            // Touch / coarse pointers shouldn't drive tilt — feels jittery and
            // the card stays "stuck" tilted after the tap ends.
            if (e.pointerType !== 'mouse') return;
            pendingEvent = e;
            if (rafId === null) rafId = requestAnimationFrame(applyTilt);
        };

        const onPointerLeave = () => {
            card.classList.remove('is-hover');
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
            pendingEvent = null;
            // Clear inline vars so the card eases back via CSS transition.
            card.style.removeProperty('--tilt-x');
            card.style.removeProperty('--tilt-y');
            card.style.removeProperty('--img-x');
            card.style.removeProperty('--img-y');
            card.style.removeProperty('--lift');
            card.style.removeProperty('--img-scale');
        };

        card.addEventListener('pointerenter', onPointerEnter);
        card.addEventListener('pointermove', onPointerMove);
        card.addEventListener('pointerleave', onPointerLeave);
        // Cancel covers the case where a touch is interrupted mid-gesture.
        card.addEventListener('pointercancel', onPointerLeave);
    });
})();

document.querySelectorAll('.audio-player').forEach(player => {
    const audio = player.querySelector('audio');
    const playBtn = player.querySelector('.play-btn');
    const progress = player.querySelector('.progress');
    const container = player.querySelector('.progress-container');

    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playBtn.textContent = '⏸';
        } else {
            audio.pause();
            playBtn.textContent = '▶';
        }
    });

    audio.addEventListener('timeupdate', () => {
        const percent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = percent + '%';
    });

    container.addEventListener('click', (e) => {
        const width = container.clientWidth;
        const clickX = e.offsetX;
        audio.currentTime = (clickX / width) * audio.duration;
    });
});
document.querySelectorAll('.video-player').forEach(player => {
    const video = player.querySelector('video');
    const playBtn = player.querySelector('.play-btn');
    const muteBtn = player.querySelector('.mute-btn');
    const progress = player.querySelector('.progress');
    const container = player.querySelector('.progress-container');

    // Play / pause button
    playBtn.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            playBtn.textContent = '⏸';
        } else {
            video.pause();
            playBtn.textContent = '▶';
        }
    });

    // Mute button
    muteBtn.addEventListener('click', () => {
        video.muted = !video.muted;
        muteBtn.textContent = video.muted ? '🔊' : '🔇';
    });

    // Progress bar update
    video.addEventListener('timeupdate', () => {
        const percent = (video.currentTime / video.duration) * 100;
        progress.style.width = percent + '%';
    });

    // Seek on click
    container.addEventListener('click', (e) => {
        const width = container.clientWidth;
        const clickX = e.offsetX;
        video.currentTime = (clickX / width) * video.duration;
    });

    // Click the video to toggle play/pause. Fullscreen-on-click was removed
    // because the deploy preview iframe forbids the Fullscreen API; users can
    // still use a browser's native fullscreen via the OS-level controls.
    video.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            playBtn.textContent = '⏸';
        } else {
            video.pause();
            playBtn.textContent = '▶';
        }
    });
});
