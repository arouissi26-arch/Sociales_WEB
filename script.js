// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// 1. Badge Rotation (Constant + Scroll Velocity)
const badge = document.querySelector('.badge-container svg');
if (badge) {
    // Base rotation
    gsap.to(badge, { rotation: 360, duration: 20, repeat: -1, ease: "linear" });

    // Add extra rotation on scroll
    let scrollVelocity = 0;
    ScrollTrigger.create({
        onUpdate: (self) => {
            scrollVelocity = self.getVelocity();
            // Add velocity to rotation (adjust multiplier as needed)
            gsap.to(badge, { rotation: `+=${scrollVelocity * 0.05}`, duration: 0.5, overwrite: 'auto' });
        }
    });
}

// 2. Text Reveal & Initial Load
// 2. Text Reveal & Initial Load
window.addEventListener("load", () => {
    // Language-aware Preloader
    const preloaderText = document.getElementById('preloader-text');
    const lang = document.documentElement.lang || 'ca';

    const phrasesMap = {
        'ca': [
            'Preparant la teva taula...',
            'Escalfant el forn...',
            'Cuinant amb amor...',
            'Gairebé a punt...'
        ],
        'es': [
            'Preparando tu mesa...',
            'Calentando el horno...',
            'Cocinando con amor...',
            'Casi listo...'
        ],
        'en': [
            'Preparing your table...',
            'Warming up the oven...',
            'Cooking with love...',
            'Almost ready...'
        ],
        'it': [
            'Preparando il tuo tavolo...',
            'Scaldando il forno...',
            'Cucinando con amore...',
            'Quasi pronto...'
        ]
    };

    const phrases = phrasesMap[lang] || phrasesMap['ca'];
    let phraseIndex = 0;

    // Set initial text
    if (preloaderText && phrases.length > 0) preloaderText.textContent = phrases[0];

    const phraseInterval = setInterval(() => {
        phraseIndex++;
        if (phraseIndex < phrases.length && preloaderText) {
            preloaderText.textContent = phrases[phraseIndex];
        }
    }, 600);

    const preloaderTl = gsap.timeline();
    preloaderTl.to(".preloader-text", { y: -100, opacity: 0, duration: 1, delay: 2.5, ease: "power4.in" })
        .to(".preloader", { yPercent: -100, duration: 0.8, ease: "power4.inOut" }, "-=0.5")
        .add(() => clearInterval(phraseInterval));

    // SplitType for Text Reveals
    // Ensure SplitType is loaded
    if (typeof SplitType !== 'undefined') {
        const typeSplit = new SplitType('h1, h2, p', { types: 'lines, words' });

        gsap.utils.toArray('.line').forEach(line => {
            const wrapper = document.createElement('div');
            wrapper.style.overflow = 'hidden';
            line.parentNode.insertBefore(wrapper, line);
            wrapper.appendChild(line);

            gsap.from(line, {
                scrollTrigger: {
                    trigger: line,
                    start: "top 90%",
                    toggleActions: "play none none reverse"
                },
                yPercent: 100,
                duration: 0.8,
                ease: "power4.out"
            });
        });
    }

    // Staggered Fade In (GS Reveal)
    gsap.utils.toArray('.gs-reveal').forEach((el) => {
        gsap.fromTo(el,
            { opacity: 0, y: 50 },
            {
                scrollTrigger: { trigger: el, start: "top 85%" },
                opacity: 1, y: 0, duration: 1, ease: "power3.out"
            }
        );
    });

    // Footer Parallax
    const footer = document.querySelector('.footer-reveal');
    const main = document.querySelector('main');
    if (footer && main) {
        const setFooterHeight = () => { main.style.marginBottom = `${footer.offsetHeight}px`; };
        setFooterHeight();
        window.addEventListener('resize', setFooterHeight);
    }
});

// 3. Smooth Parallax Images
gsap.utils.toArray('.img-fluid, .origin-image').forEach(img => {
    gsap.to(img, {
        scrollTrigger: { trigger: img, start: "top bottom", scrub: true },
        yPercent: -20, ease: "none"
    });
});

// 4. Reading Progress
gsap.to('.reading-progress', {
    width: '100%', ease: 'none',
    scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 0 }
});

// 5. Scramble Text
const scrambleTexts = document.querySelectorAll('.scramble-text');
const chars = '!<>-_\\/[]{}—=+*^?#________';
scrambleTexts.forEach(text => {
    const original = text.innerText;
    text.addEventListener('mouseenter', () => {
        let iterations = 0;
        // clear any existing interval
        if (text.interval) clearInterval(text.interval);

        text.interval = setInterval(() => {
            text.innerText = original.split('')
                .map((letter, index) => {
                    if (index < iterations) return original[index];
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');

            if (iterations >= original.length) {
                clearInterval(text.interval);
                text.innerText = original;
            }
            iterations += 1 / 2; // Slow down slightly for cleaner effect
        }, 30);
    });
});

// 6. Spotlight
const spotlight = document.querySelector('.spotlight');
document.addEventListener('mousemove', (e) => {
    if (spotlight) spotlight.style.background = `radial-gradient(circle at ${e.clientX}px ${e.clientY}px, transparent 100px, rgba(0,0,0,0.8) 100%)`;
});

// 7. Rome Time
const timeDisplay = document.getElementById('time-display');
function updateRomeTime() {
    if (timeDisplay) {
        timeDisplay.innerText = new Date().toLocaleTimeString('it-IT', { timeZone: 'Europe/Rome' });
    }
}
updateRomeTime(); // Immediate update
setInterval(updateRomeTime, 1000); // Update every second

// 8. Horizontal Gallery
const gallerySection = document.querySelector('.gallery-section');
const galleryWrapper = document.querySelector('.gallery-wrapper');
if (gallerySection && galleryWrapper) {
    gsap.to(galleryWrapper, {
        x: () => -(galleryWrapper.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
            trigger: gallerySection,
            pin: true,
            scrub: 1,
            end: () => "+=" + galleryWrapper.scrollWidth
        }
    });
}

// 9. Scroll Percentage & Back To Top & Sticky Sidebar
const pctDisplay = document.querySelector('.scroll-percentage');
const bttBtn = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    // Scroll %
    const s = document.documentElement.scrollTop;
    const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const p = Math.round((s / h) * 100);
    if (pctDisplay) pctDisplay.innerText = `${p}%`;

    // Back To Top Visibility
    if (bttBtn) {
        if (s > 500) bttBtn.classList.add('visible');
        else bttBtn.classList.remove('visible');
    }

    // Sticky Sidebar Active State
    document.querySelectorAll('section').forEach((sec) => {
        const top = window.scrollY;
        const offset = sec.offsetTop - 150;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            document.querySelectorAll('.dot').forEach(dot => {
                dot.classList.remove('active');
                if (dot.getAttribute('href') === '#' + id) dot.classList.add('active');
            });
        }
    });
});

// Back To Top Click
if (bttBtn) bttBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// 10. Hamburger Menu & Settings Overlay
const menuToggle = document.querySelector('.menu-toggle');
const menuOverlay = document.querySelector('.menu-overlay');
const menuCloseBtn = document.querySelector('.menu-close-btn');

function openMenu() {
    menuOverlay.classList.add('active');
    // Animate settings if needed, handled by CSS animation normally
}

function closeMenu() {
    menuOverlay.classList.remove('active');
}

if (menuToggle && menuOverlay) {
    menuToggle.addEventListener('click', openMenu);
}

if (menuCloseBtn) {
    menuCloseBtn.addEventListener('click', closeMenu);
}

if (menuOverlay) {
    menuOverlay.addEventListener('click', (e) => {
        if (e.target === menuOverlay) closeMenu();
    });
}

// 11. Audio System & Music Selection
const audioToggle = document.querySelector('.audio-toggle');
const audio = document.getElementById('bg-audio');
const musicBtns = document.querySelectorAll('.music-btn');

// Default Track (Vivaldi)
const tracks = {
    'classical': 'Vivaldi - La Primavera - Spring - Printemps -Las cuatro estaciones-Salzburger Kammerorchester (1).mp3',
    'jazz': null, // No file provided yet
    'none': null
};

if (musicBtns) {
    musicBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // UI Update
            musicBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const type = btn.dataset.music;

            if (type === 'none') {
                audio.pause();
                updateAudioUI(false);
            } else if (type === 'jazz') {
                // Placeholder behavior
                showToast('🎵 Jazz coming soon! Playing Vivaldi for now.');
                playTrack(tracks['classical']);
            } else {
                playTrack(tracks[type]);
            }
        });
    });
}

function playTrack(src) {
    if (!src || !audio) return;
    if (!audio.src.includes(src)) {
        audio.src = src;
    }
    audio.play().catch(e => console.log("Audio autoplay blocked", e));
    updateAudioUI(true);
}

function updateAudioUI(isPlaying) {
    if (audioToggle) {
        audioToggle.querySelector('span').innerText = isPlaying ? "SOUND ON" : "SOUND OFF";
    }
}

if (audioToggle && audio) {
    audioToggle.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            updateAudioUI(true);
        } else {
            audio.pause();
            updateAudioUI(false);
        }
    });
}

// 18. Translation System (Static File Redirection)
const langBtns = document.querySelectorAll('.lang-btn');
const langUrls = {
    'ca': 'index.html',
    'es': 'index_es.html',
    'en': 'index_en.html',
    'it': 'index_it.html'
};

if (langBtns) {
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            const targetUrl = langUrls[lang];

            if (targetUrl) {
                // Determine if we are already on the target page to avoid reload loop or unnecessary load
                // Simple check via pathname ending
                const path = window.location.pathname;
                if (!path.endsWith(targetUrl) && !(targetUrl === 'index.html' && path.endsWith('/'))) {
                    window.location.href = targetUrl;
                }
            }
        });
    });
}

// 12. Click Ripple
document.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.classList.add('ripple');
    ripple.style.left = `${e.clientX - 10}px`;
    ripple.style.top = `${e.clientY - 10}px`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
});

// 13. Scroll Filters (B/W to Color)
gsap.utils.toArray('img').forEach(img => {
    gsap.to(img, {
        filter: 'grayscale(0)',
        scrollTrigger: {
            trigger: img,
            start: "top center",
            end: "bottom center",
            toggleActions: "play reverse play reverse"
        }
    });
});

// 14. 3D Tilt
document.querySelectorAll('.team-card, .img-fluid').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * 10;
        const rotateY = ((x - centerX) / centerX) * -10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0) rotateY(0)`;
    });
});

// 15. Custom Cursor & Magnetic Buttons
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
if (cursor && follower) {
    let posX = 0, posY = 0;
    let mouseX = 0, mouseY = 0;

    gsap.to({}, 0.016, {
        repeat: -1,
        onRepeat: function () {
            posX += (mouseX - posX) / 9;
            posY += (mouseY - posY) / 9;

            gsap.set(follower, {
                css: {
                    left: mouseX - 4,
                    top: mouseY - 4
                }
            });

            gsap.set(cursor, {
                css: {
                    left: posX - 10,
                    top: posY - 10
                }
            });
        }
    });

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const magneticLinks = document.querySelectorAll('.magnetic');
    magneticLinks.forEach((link) => {
        link.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
            gsap.to(cursor, { scale: 3, opacity: 0.3 });

            // Hover Reveal logic
            const imgPath = link.dataset.image;
            const revealContainer = document.querySelector('.hover-reveal-img');
            if (imgPath && revealContainer) {
                revealContainer.style.backgroundImage = `url(${imgPath})`; // Assuming images exist or placeholder
                revealContainer.style.backgroundColor = '#D72323'; // Fallback
                revealContainer.style.opacity = 0.5;
            }
        });

        link.addEventListener('mousemove', (e) => {
            const revealContainer = document.querySelector('.hover-reveal-img');
            if (revealContainer) {
                gsap.to(revealContainer, {
                    left: e.clientX,
                    top: e.clientY,
                    duration: 0.5
                });
            }
        });

        link.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            gsap.to(cursor, { scale: 1, opacity: 1 });
            const revealContainer = document.querySelector('.hover-reveal-img');
            if (revealContainer) revealContainer.style.opacity = 0;
        });
    });
}

// Hero Text Reveal (Deduped)
const heroTl = gsap.timeline({ defaults: { duration: 1.5, ease: "power3.out" } });
heroTl.to("#hero h1", { opacity: 1, y: 0, delay: 0.5 })
    .to("#hero p", { opacity: 1, y: 0 }, "-=1");

// 16. Liquid Text Interaction
const liquidFilter = document.querySelector('#liquid feDisplacementMap');
if (liquidFilter) {
    const liquidTargets = document.querySelectorAll('.liquid');
    liquidTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            gsap.to(liquidFilter, { scale: 100, duration: 1, ease: "power2.out" });
        });
        target.addEventListener('mouseleave', () => {
            gsap.to(liquidFilter, { scale: 0, duration: 1, ease: "power2.out" });
        });
    });
}

// ============================================
// PHASE 2: SCROLL EFFECTS (Mechanics 26-35)
// ============================================

// 26. Parallax Background Layers
gsap.utils.toArray('.parallax-slow').forEach(el => {
    gsap.to(el, {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', scrub: true }
    });
});
gsap.utils.toArray('.parallax-fast').forEach(el => {
    gsap.to(el, {
        yPercent: -60,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', scrub: true }
    });
});

// 29. Counter Animation (Years since 1962)
const counters = document.querySelectorAll('.counter');
counters.forEach(counter => {
    const target = parseInt(counter.dataset.target) || 0;
    ScrollTrigger.create({
        trigger: counter,
        start: 'top 80%',
        once: true,
        onEnter: () => {
            gsap.to(counter, {
                innerText: target,
                duration: 2,
                snap: { innerText: 1 },
                ease: 'power2.out'
            });
        }
    });
});

// 30. Staggered List Reveal
gsap.utils.toArray('.team-card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 85%' },
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay: i * 0.1
    });
});

// 32. Horizontal Gallery Progress Bar
const galleryProgress = document.querySelector('.gallery-progress');
if (galleryProgress && galleryWrapper) {
    ScrollTrigger.create({
        trigger: gallerySection,
        start: 'top top',
        end: () => '+=' + galleryWrapper.scrollWidth,
        onUpdate: self => {
            galleryProgress.style.width = `${self.progress * 100}%`;
        }
    });
}

// 35. Scroll Velocity Blur
let lastScrollTop = 0;
let scrollTimeout;
window.addEventListener('scroll', () => {
    const st = window.pageYOffset;
    const velocity = Math.abs(st - lastScrollTop);

    if (velocity > 50) {
        document.body.classList.add('velocity-blur');
        document.querySelectorAll('img').forEach(img => img.classList.add('blurring'));
    }

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        document.body.classList.remove('velocity-blur');
        document.querySelectorAll('img').forEach(img => img.classList.remove('blurring'));
    }, 100);

    lastScrollTop = st;
});

// ============================================
// PHASE 3: ANIMATIONS (Mechanics 36-45)
// ============================================

// 37. Text Split Animation (Enhanced SplitType)
if (typeof SplitType !== 'undefined') {
    const splitChars = new SplitType('.split-chars', { types: 'chars' });
    gsap.utils.toArray('.split-chars').forEach(el => {
        gsap.from(el.querySelectorAll('.char'), {
            scrollTrigger: { trigger: el, start: 'top 80%' },
            opacity: 0,
            y: 50,
            rotateZ: 10,
            stagger: 0.02,
            duration: 0.6,
            ease: 'back.out(1.7)'
        });
    });
}

// 40. Water Ripple on Image Click
document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', (e) => {
        const rect = img.getBoundingClientRect();
        const ripple = document.createElement('div');
        ripple.className = 'water-ripple';
        ripple.style.left = `${e.clientX - rect.left}px`;
        ripple.style.top = `${e.clientY - rect.top}px`;
        ripple.style.width = ripple.style.height = '100px';
        img.parentElement.style.position = 'relative';
        img.parentElement.appendChild(ripple);
        setTimeout(() => ripple.remove(), 800);
    });
});

// 44. Typewriter Effect
const typewriters = document.querySelectorAll('.typewriter');
typewriters.forEach(el => {
    const text = el.dataset.text || el.innerText;
    el.innerText = '';
    el.classList.add('typewriter-cursor');
    let i = 0;
    const type = () => {
        if (i < text.length) {
            el.innerText += text.charAt(i);
            i++;
            setTimeout(type, 80);
        } else {
            el.classList.remove('typewriter-cursor');
        }
    };
    ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        once: true,
        onEnter: type
    });
});

// 45. Accordion
document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
        const accordion = header.parentElement;
        accordion.classList.toggle('open');
    });
});

// ============================================
// PHASE 4: VISUAL FX (Mechanics 46-55)
// ============================================

// 46. Floating Particles
const particlesContainer = document.querySelector('.particles-container');
if (particlesContainer) {
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 10}s`;
        particle.style.animationDuration = `${10 + Math.random() * 10}s`;
        particlesContainer.appendChild(particle);
    }
}

// 47. Cursor Trail
const trailCount = 10;
const trails = [];
for (let i = 0; i < trailCount; i++) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.opacity = (1 - i / trailCount) * 0.5;
    trail.style.transform = `scale(${1 - i / trailCount})`;
    document.body.appendChild(trail);
    trails.push({ el: trail, x: 0, y: 0 });
}
document.addEventListener('mousemove', (e) => {
    trails.forEach((trail, index) => {
        setTimeout(() => {
            trail.el.style.left = `${e.clientX - 5}px`;
            trail.el.style.top = `${e.clientY - 5}px`;
        }, index * 30);
    });
});

// 49. Dark Mode Toggle
const darkModeToggle = document.querySelector('.dark-mode-toggle');
if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark);
        darkModeToggle.innerHTML = isDark ? '☀️ LIGHT' : '🌙 DARK';
    });

    // Start in LIGHT mode always (reset) unless user explicitly clicked before
    // REMOVED auto-enable from localStorage to fix "stuck in dark" issue
    // User must click to enable dark mode
    darkModeToggle.innerHTML = '🌙 DARK';
}

// 51. Image Reveal Masks on Scroll
gsap.utils.toArray('.reveal-mask').forEach(el => {
    ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        onEnter: () => el.classList.add('revealed')
    });
});

// 53. Color Shift on Scroll (Hue Rotation)
ScrollTrigger.create({
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: self => {
        const hue = self.progress * 30; // Subtle hue shift
        document.querySelectorAll('.color-shift').forEach(el => {
            el.style.filter = `hue-rotate(${hue}deg)`;
        });
    }
});

// ============================================
// PHASE 5: COMPONENTS (Mechanics 56-65)
// ============================================

// 56. Lightbox
const lightbox = document.querySelector('.lightbox');
const lightboxImg = lightbox?.querySelector('img');
const lightboxClose = lightbox?.querySelector('.lightbox-close');

document.querySelectorAll('.gallery-item img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
        if (lightbox && lightboxImg) {
            lightboxImg.src = img.src;
            lightbox.classList.add('active');
        }
    });
});
if (lightboxClose) {
    lightboxClose.addEventListener('click', () => lightbox.classList.remove('active'));
}
if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) lightbox.classList.remove('active');
    });
}

// 60. Toast Notification Helper
window.showToast = (message, duration = 3000) => {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, duration);
};

// 61. Tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        const tabContainer = btn.closest('.tabs');

        tabContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        tabContainer.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        tabContainer.querySelector(`#${tabId}`).classList.add('active');
    });
});

// 65. Cookie Banner
const cookieBanner = document.querySelector('.cookie-banner');
const cookieAccept = cookieBanner?.querySelector('button');
if (cookieBanner && !localStorage.getItem('cookiesAccepted')) {
    setTimeout(() => cookieBanner.classList.add('visible'), 2000);
}
if (cookieAccept) {
    cookieAccept.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieBanner.classList.remove('visible');
        showToast('Cookies accepted! 🍪');
    });
}

// ============================================
// FINAL: Code Audit & Polish
// ============================================

// Ensure all images have loading="lazy"
document.querySelectorAll('img:not([loading])').forEach(img => {
    img.setAttribute('loading', 'lazy');
});

// Add card-lift to team cards
document.querySelectorAll('.team-card').forEach(card => card.classList.add('card-lift'));

// Add underline-anim to nav links
document.querySelectorAll('.menu-link').forEach(link => link.classList.add('underline-anim'));

// Add img-zoom-container to gallery items
document.querySelectorAll('.gallery-item').forEach(item => item.classList.add('img-zoom-container'));

// Add lens-flare to origin image
document.querySelectorAll('.origin-image').forEach(img => img.classList.add('lens-flare'));

// ============================================
// BONUS: 10 MORE 2025 MECHANICS (66-75)
// ============================================

// 72. Blur to Focus on Scroll
gsap.utils.toArray('.blur-focus').forEach(el => {
    ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        onEnter: () => el.classList.add('in-view'),
        onLeaveBack: () => el.classList.remove('in-view')
    });
});

// 73. Stagger Grid Visibility
gsap.utils.toArray('.stagger-grid').forEach(grid => {
    ScrollTrigger.create({
        trigger: grid,
        start: 'top 80%',
        onEnter: () => grid.classList.add('visible')
    });
});

// 74. Scroll Linked Rotation (Disabled - was causing badge issues)
// ScrollTrigger.create({...});

// Apply new classes dynamically
document.querySelectorAll('h2').forEach(h => h.classList.add('reveal-line'));
document.querySelectorAll('.team-grid').forEach(g => g.classList.add('stagger-grid'));
// Removed: scroll-rotate from badge (was breaking original rotation)
// Removed: pulse-glow from back-to-top (user preferred original)

// 17. Sticky Scrollytelling (Origin Section)
const scrollySteps = document.querySelectorAll('.scrolly-step');
const scrollyImages = document.querySelectorAll('.visual-img');

if (scrollySteps.length > 0 && scrollyImages.length > 0) {
    scrollySteps.forEach((step, index) => {
        ScrollTrigger.create({
            trigger: step,
            start: 'top 60%', // Trigger earlier for better feel
            end: 'bottom 60%',
            onEnter: () => updateScrolly(index),
            onEnterBack: () => updateScrolly(index)
        });
    });

    function updateScrolly(index) {
        // Update Steps
        scrollySteps.forEach((s, i) => {
            s.classList.toggle('active', i === index);
        });
        // Update Images
        scrollyImages.forEach((img, i) => {
            img.classList.toggle('active', i === index);
        });
    }
}

console.log('🚀 La Cucina di Mamma - 75 Mechanics Loaded!');

// ============================================
// PHASE 6: INTERACTIVE MENU (Re-integrated)
// ============================================

const menuData = [
    // ANTIPASTI
    { category: 'classic', name: 'Bruschetta al Pomodoro', price: '12€', desc: 'Pa torrat amb tomàquets frescos, alfàbrega i oli d\'oliva verge extra.', image: 'assets/bruschetta_pomodoro_1767211926577.png' },
    { category: 'classic', name: 'Carpaccio di Manzo', price: '18€', desc: 'Làmines fines de vedella crua, parmesà, rúcula i un toc de llimona.', image: 'assets/carpaccio_manzo_1767211939552.png' },
    { category: 'classic', name: 'Caprese Clàssica', price: '14€', desc: 'Mozzarella di bufala, tomàquets de la Toscana i alfàbrega fresca.', image: 'assets/caprese_classica_1767211954139.png' },
    { category: 'classic', name: 'Prosciutto e Melone', price: '16€', desc: 'Pernil de Parma envellit 24 mesos amb meló cantalup dolç.', image: 'assets/prosciutto_melone_1767211968253.png' },
    { category: 'classic', name: 'Focaccia al Romaní', price: '8€', desc: 'Focaccia casolana amb romaní fresc i sal marina.', image: 'assets/focaccia_romani_1767211982175.png' },
    { category: 'classic', name: 'Olive all’Ascolana', price: '10€', desc: 'Olives verdes gegants farcides de carn i arrebossades.', image: 'assets/olive_ascolana_1767211997378.png' },
    { category: 'classic', name: 'Antipasto di Mare', price: '20€', desc: 'Selecció de fruits del mar marinats amb cítrics i herbes.', image: 'assets/antipasto_mare_1767212011417.png' },
    { category: 'classic', name: 'Crostini Toscani', price: '12€', desc: 'Torrades amb paté de fetge de pollastre tradicional.', image: 'assets/crostini_toscani_1767212026350.png' },
    { category: 'classic', name: 'Arancini Siciliani', price: '10€', desc: 'Boles d\'arròs fregides farcides de ragú i pèsols.', image: 'assets/arancini_siciliani_1767212040774.png' },
    { category: 'classic', name: 'Burrata amb Tomàquets', price: '16€', desc: 'Burrata cremosa amb tomàquets cherry confitats.', image: 'assets/burrata_1767212055999.png' },

    // PRIMI
    { category: 'classic', name: 'Spaghetti Carbonara', price: '18€', desc: 'Autèntica recepta romana amb guanciale, ou, pecorino i pebre negre.', image: 'assets/spaghetti_carbonara_1767212093654.png' },
    { category: 'vegan', name: 'Penne all\'Arrabbiata', price: '15€', desc: 'Salsa de tomàquet picant amb all i julivert fresc.', image: 'assets/penne_arrabbiata_1767212107053.png' },
    { category: 'classic', name: 'Lasanya Bolonyesa', price: '20€', desc: 'Capes de pasta fresca, ragú de carn i beixamel gratinada.', image: 'assets/lasanya_bolonyesa_1767212121373.png' },
    { category: 'vegan', name: 'Risotto de Bolets', price: '22€', desc: 'Arròs Carnaroli cremós amb bolets porcini i tòfona negra.', image: 'assets/risotto_bolets_1767219328704.png' },
    { category: 'vegan', name: 'Gnocchi al Pesto', price: '16€', desc: 'Gnocchi de patata amb pesto genovès casolà.', image: 'assets/gnocchi_pesto_1767219342535.png' },
    { category: 'classic', name: 'Tagliatelle al Ragú', price: '19€', desc: 'Cintes de pasta a l\'ou amb salsa bolonyesa de cocció lenta.', image: 'assets/tagliatelle_ragu_1767219356880.png' },
    { category: 'classic', name: 'Ravioli de Ricotta', price: '18€', desc: 'Pasta farcida d\'espinacs i ricotta amb mantega i sàlvia.', image: 'assets/ravioli_ricotta_1767219369318.png' },
    { category: 'vegan', name: 'Trofie al Pesto', price: '17€', desc: 'Pasta típica de Ligúria amb patata i mongeta tendra.', image: 'assets/trofie_pesto.jpg' },
    { category: 'classic', name: 'Spaghetti alle Vongole', price: '24€', desc: 'Spaghetti amb cloïsses fresques, vi blanc i all.', image: 'assets/spaghetti_vongole.jpg' },
    { category: 'classic', name: 'Risotto al Safrà', price: '22€', desc: 'Risotto a la milanesa amb safrà i moll de l\'os.', image: 'assets/risotto_safra.jpg' },

    // SECONDI
    { category: 'classic', name: 'Pollastre Cacciatora', price: '22€', desc: 'Pollastre guisat amb tomàquet, olives i vi negre.', image: 'assets/pollastre_cacciatora.jpg' },
    { category: 'classic', name: 'Saltimbocca', price: '26€', desc: 'Vedella amb pernil i sàlvia, saltada amb vi blanc.', image: 'assets/saltimbocca.jpg' },
    { category: 'classic', name: 'Fiorentina', price: '65€', desc: 'Mitjana de vedella a la brasa (1kg) per compartir.', image: 'assets/fiorentina.jpg' },
    { category: 'vegan', name: 'Albergínia Parmigiana', price: '18€', desc: 'Pastís d\'albergínia amb tomàquet i mozzarella (opció vegana disponible).', image: 'assets/parmigiana.jpg' },
    { category: 'classic', name: 'Ossobuco', price: '28€', desc: 'Garró de vedella estofat amb gremolata tradicional.', image: 'assets/ossobuco.jpg' },
    { category: 'classic', name: 'Mandonguilles', price: '18€', desc: 'Mandonguilles de la Mamma en salsa de tomàquet.', image: 'assets/mandonguilles.jpg' },
    { category: 'classic', name: 'Graellada de Peix', price: '32€', desc: 'Selecció de peix i marisc fresc del dia a la planxa.', image: 'assets/graellada_peix.jpg' },
    { category: 'classic', name: 'Calamars Farcits', price: '24€', desc: 'Calamars farcits de pa i herbes amb salsa de tomàquet.', image: 'assets/calamars_farcits.jpg' },
    { category: 'classic', name: 'Escalopines a la Llimona', price: '20€', desc: 'Filets fins de vedella amb salsa cremosa de llimona.', image: 'assets/escalopines_llimo.jpg' },
    { category: 'classic', name: 'Fritto Misto', price: '25€', desc: 'Fregit variat de calamars i gambes cruixents.', image: 'assets/fritto_misto.jpg' },

    // DOLCI (POSTRES)
    { category: 'postres', name: 'Tiramisú', price: '8€', desc: 'El clàssic postre de cafè, mascarpone i cacau.', image: 'assets/tiramisu.jpg' },
    { category: 'postres', name: 'Panna Cotta', price: '8€', desc: 'Flam de nata amb coulis de fruits vermells.', image: 'assets/panna_cotta.png' },
    { category: 'postres', name: 'Cannoli Siciliani', price: '9€', desc: 'Neules farcides de ricotta dolça i festucs.', image: 'assets/cannoli.jpg' },
    { category: 'postres', name: 'Gelat Artesà', price: '7€', desc: 'Selecció de gelats italians fets a casa.', image: 'assets/gelat.png' },
    { category: 'postres', name: 'Torta della Nonna', price: '9€', desc: 'Pastís de crema pastissera i pinyons.', image: 'assets/torta_della_nonna.jpg' },
    { category: 'postres', name: 'Profiteroles', price: '9€', desc: 'Boles de pasta choux farcides de nata i cobertes de xocolata.', image: 'assets/profiteroles.jpg' },
    { category: 'postres', name: 'Sfogliatella', price: '5€', desc: 'Pasta de full típica de Nàpols farcida de ricotta.', image: 'assets/sfogliatella.jpg' },
    { category: 'postres', name: 'Affogato al Caffe', price: '7€', desc: 'Gelat de vainilla "ofegat" en cafè espresso calent.', image: 'assets/affogato.jpg' },
    { category: 'postres', name: 'Cassata Siciliana', price: '10€', desc: 'Pastís tradicional amb ricotta, massapà i fruita confitada.', image: 'assets/cassata.png' },

    // VINS
    { category: 'wines', name: 'Vega Sicilia Unico', price: '350€', desc: 'Ribera del Duero. Elegància i complexitat suprema.', image: 'assets/vega_sicilia.jpg' },
    { category: 'wines', name: 'Chateau Margaux', price: '900€', desc: 'Bordeaux Premier Grand Cru. Llegendari i sedós.', image: 'assets/chateau_margaux.png' },
    { category: 'wines', name: 'Clos Mogador', price: '95€', desc: 'Priorat. Potència mineral i caràcter únic.', image: 'assets/clos_mogador.jpg' },
    { category: 'wines', name: 'Flor de Pingus', price: '180€', desc: 'Ribera del Duero. Intensitat i fruita concentrada.', image: 'assets/flor_de_pingus.png' },
    { category: 'wines', name: 'Gramona Imperial', price: '35€', desc: 'Cava Gran Reserva. Frescor i bombolla fina.', image: 'assets/cava_gramona.jpg' },

    // MENÚ INFANTIL
    { category: 'infantil', name: '🍝 Mini Spaghetti Bolognese', price: '8€', desc: 'Pasta amb salsa de tomàquet i carn. Porció adaptada per als més petits.', image: 'assets/spaghetti_kids.jpg' },
    { category: 'infantil', name: '🍕 Pizza Margherita Petita', price: '7€', desc: 'Tomàquet, mozzarella i alfàbrega. Mida infantil perfecta.', image: 'assets/pizza_kids.jpg' },
    { category: 'infantil', name: '🍗 Nuggets de Pollastre', price: '9€', desc: 'Amb patates fregides i ketchup. El favorit dels nens!', image: 'assets/nuggets_kids.png' },
    { category: 'infantil', name: '🍨 Gelat de 3 Boles', price: '5€', desc: 'Xocolata, vainilla i maduixa. Amb salsa de xocolata.', image: 'assets/gelat_kids.jpg' },
];

const menuList = document.getElementById('menu-items');
const revealContainer = document.getElementById('hover-reveal');

function initMenu() {
    if (!menuList) return;

    // Render all initially
    renderMenu('classic');

    // Filter Buttons
    document.querySelectorAll('.menu-filter').forEach(btn => {
        btn.addEventListener('click', () => {
            // Update Active State
            document.querySelectorAll('.menu-filter').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter
            const filter = btn.dataset.filter;
            renderMenu(filter);
        });
    });
}

function renderMenu(filter) {
    if (!menuList) return;
    menuList.innerHTML = '';

    // GSAP Out
    // gsap.to(menuList.children, {opacity: 0, x: -20, stagger: 0.05, onComplete: () => {

    const filteredData = menuData.filter(item => {
        if (filter === 'all') return true;
        // Classic shows antipasti, secondi, dolci (except vegan ones if any)
        // But category data is simplified. Let's just match category = filter for now, 
        // except "classic" might want to show everything that isn't wine?
        // The user had simple filters: Classic, Vegan, Wines. 
        // My data has 'classic', 'vegan', 'wines'.
        return item.category === filter;
    });

    // Loop and Create
    filteredData.forEach(item => {
        const li = document.createElement('li');
        li.className = 'menu-item';
        li.innerHTML = `
                <div class="menu-item-info">
                    <span class="menu-item-name">${item.name}</span>
                    <span class="menu-item-desc">${item.desc}</span>
                </div>
                <span class="menu-item-price">${item.price}</span>
            `;

        // Hover Reveal Logic
        li.addEventListener('mouseenter', () => {
            if (revealContainer && item.image) {
                revealContainer.innerHTML = `<div class="reveal-inner" style="background-image: url('${item.image}')"></div>`;
                revealContainer.classList.add('active');
            }
        });

        li.addEventListener('mousemove', (e) => {
            if (revealContainer) {
                // Position calculations for magnet effect
                // We need to account for scrollPosition if fixed? 
                // Css for hover-reveal is fixed usually.
                const x = e.clientX;
                const y = e.clientY;
                gsap.to(revealContainer, {
                    left: x,
                    top: y,
                    duration: 0.2, // fast follow
                    ease: "power2.out"
                });
            }
        });

        li.addEventListener('mouseleave', () => {
            if (revealContainer) {
                revealContainer.classList.remove('active');
            }
        });

        menuList.appendChild(li);
    });

    // GSAP In
    gsap.fromTo('.menu-item',
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, stagger: 0.05, duration: 0.4, clearProps: "all" }
    );
    // }});
}

// Init when DOM loaded
window.addEventListener('DOMContentLoaded', initMenu);

// Newsletter Popup Logic
(function () {
    const popup = document.getElementById('newsletter-popup');
    const closeBtn = document.querySelector('.newsletter-close');
    const form = document.getElementById('newsletter-form');

    // Check if user already subscribed (only block if subscribed)
    const isSubscribed = localStorage.getItem('newsletter_subscribed');

    if (!isSubscribed) {
        // Show popup after 10 seconds (non-invasive)
        setTimeout(() => {
            if (popup) {
                popup.classList.add('show');
            }
        }, 10000);
    }

    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            popup.classList.remove('show');
        });
    }

    // Click outside to close
    if (popup) {
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.classList.remove('show');
            }
        });
    }

    // Form submission
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('newsletter-name').value;
            const email = document.getElementById('newsletter-email').value;
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            // Disable button and show loading
            submitBtn.disabled = true;
            submitBtn.textContent = '📨 Enviant...';

            try {
                // Send to n8n webhook
                const response = await fetch('https://aissa2026.app.n8n.cloud/webhook/restaurant-subscription', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email })
                });

                if (response.ok) {
                    alert('✅ Gràcies per subscriure\'t! \n\nComprova el teu correu electrònic per obtenir el teu codi de descompte del 20%. 📧');
                    localStorage.setItem('newsletter_subscribed', 'true');
                    popup.classList.remove('show');
                } else {
                    const errorData = await response.json();
                    console.error('Error response:', errorData);
                    alert('❌ Error al processar la subscripció. Torna-ho a intentar.');
                }
            } catch (error) {
                console.error('Network error:', error);
                alert('❌ Error de connexió. Comprova la teva connexió a internet.');
            } finally {
                // Re-enable button
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
})();

// Manual Newsletter Popup Opener
document.addEventListener('DOMContentLoaded', () => {
    const openNewsletterBtn = document.getElementById('open-newsletter-btn');
    const newsletterPopup = document.getElementById('newsletter-popup');

    if (openNewsletterBtn && newsletterPopup) {
        openNewsletterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            newsletterPopup.classList.add('show');
        });
    }
});


// ============================================
// FAQ ACCORDION
// ============================================
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');

        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });

        // Toggle current item
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// ============================================
// LIVE PLATES COUNTER (starts at 1000, +1 every 10 seconds)
// ============================================
let platosServidos = 1000;
const platosCounter = document.getElementById('platos-counter');

if (platosCounter) {
    // Initial value
    platosCounter.textContent = platosServidos.toLocaleString('es-ES');

    // Increment every 10 seconds
    setInterval(() => {
        platosServidos++;
        platosCounter.textContent = platosServidos.toLocaleString('es-ES');

        // Add pulsing animation on update
        platosCounter.style.transform = 'scale(1.1)';
        setTimeout(() => {
            platosCounter.style.transform = 'scale(1)';
        }, 200);
    }, 10000); // 10 seconds = 10000ms
}

// ============================================
// STATS COUNTER ANIMATION (on scroll)
// ============================================
const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-number[data-count]');

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        // Start animation when element is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.5 });

        observer.observe(counter);
    });
};

// Initialize counter animations
animateCounters();

// ============================================
// AOS (Animate On Scroll) INITIALIZATION
// ============================================
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100
    });
}

// ============================================
// ACCESSIBILITY FEATURES
// ============================================
let textSize = 100; // percentage

document.getElementById('increase-text')?.addEventListener('click', () => {
    textSize += 10;
    document.documentElement.style.fontSize = textSize + '%';
});

document.getElementById('decrease-text')?.addEventListener('click', () => {
    textSize -= 10;
    if (textSize < 80) textSize = 80;
    document.documentElement.style.fontSize = textSize + '%';
});

document.getElementById('high-contrast')?.addEventListener('click', () => {
    document.body.classList.toggle('high-contrast');
});

document.getElementById('reset-accessibility')?.addEventListener('click', () => {
    textSize = 100;
    document.documentElement.style.fontSize = '100%';
    document.body.classList.remove('high-contrast');
});

// ============================================
// LANGUAGE SELECTOR
// ============================================
const translations = {
    es: { flag: '🇪🇸', code: 'ES', name: 'Español' },
    en: { flag: '🇬🇧', code: 'EN', name: 'English' },
    it: { flag: '🇮🇹', code: 'IT', name: 'Italiano' },
    fr: { flag: '🇫🇷', code: 'FR', name: 'Français' }
};

document.querySelectorAll('.lang-option').forEach(option => {
    option.addEventListener('click', () => {
        const lang = option.dataset.lang;
        const langData = translations[lang];

        // Update current lang display
        const currentLang = document.querySelector('.current-lang');
        if (currentLang) {
            currentLang.innerHTML = `<span class="flag">${langData.flag}</span> ${langData.code}`;
        }

        // Update active state
        document.querySelectorAll('.lang-option').forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');

        // Save preference
        localStorage.setItem('language', lang);

        // Show notification
        alert(`Idioma cambiado a ${langData.name}`);
    });
});

// Load saved language
const savedLang = localStorage.getItem('language');
if (savedLang && translations[savedLang]) {
    const langData = translations[savedLang];
    const currentLang = document.querySelector('.current-lang');
    if (currentLang) {
        currentLang.innerHTML = `<span class="flag">${langData.flag}</span> ${langData.code}`;
    }
}

// ============================================
// MUSIC PLAYER
// ============================================
const musicPlayer = document.getElementById('bg-music');
const musicSource = document.getElementById('music-source');

const playlists = {
    jazz: 'Vivaldi - La Primavera - Spring - Printemps -Las cuatro estaciones-Salzburger Kammerorchester (1).mp3',
    classical: 'Vivaldi - La Primavera - Spring - Printemps -Las cuatro estaciones-Salzburger Kammerorchester (1).mp3',
    modern: 'Vivaldi - La Primavera - Spring - Printemps -Las cuatro estaciones-Salzburger Kammerorchester (1).mp3',
    none: ''
};

document.querySelectorAll('.playlist-option').forEach(option => {
    option.addEventListener('click', () => {
        const playlist = option.dataset.playlist;

        // Update active state
        document.querySelectorAll('.playlist-option').forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');

        // Change music
        if (playlist === 'none' && musicPlayer) {
            musicPlayer.pause();
        } else if (musicPlayer && musicSource) {
            musicSource.src = playlists[playlist];
            musicPlayer.load();
            musicPlayer.play().catch(e => console.log('Audio play prevented:', e));
        }
    });
});

// ============================================
// BEFORE/AFTER SLIDER
// ============================================
const slider = document.querySelector('.slider-handle');
const afterImage = document.querySelector('.after-image');

if (slider && afterImage) {
    let isDragging = false;

    const updateSlider = (e) => {
        const container = document.querySelector('.slider-container');
        const rect = container.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const percentage = (x / rect.width) * 100;

        if (percentage >= 0 && percentage <= 100) {
            slider.style.left = percentage + '%';
            afterImage.style.width = percentage + '%';
        }
    };

    slider.addEventListener('mousedown', () => isDragging = true);
    slider.addEventListener('touchstart', () => isDragging = true);

    document.addEventListener('mousemove', (e) => {
        if (isDragging) updateSlider(e);
    });

    document.addEventListener('touchmove', (e) => {
        if (isDragging) updateSlider(e);
    });

    document.addEventListener('mouseup', () => isDragging = false);
    document.addEventListener('touchend', () => isDragging = false);
}

// ============================================
// PDF MENU DOWNLOAD (for menu page)
// ============================================
function downloadMenuPDF() {
    // Simple implementation - opens print dialog
    // In a real app, you'd generate a PDF or link to a pre-made one
    window.print();
    alert('💡 Tip: Guarda como PDF en las opciones de impresión');
}

// ============================================
// CALORIE CALCULATOR (for menu items)
// ============================================
const menuNutrition = {
    'Carbonara': { calories: 580, protein: 25, carbs: 45, fat: 35 },
    'Margherita': { calories: 450, protein: 18, carbs: 52, fat: 18 },
    'Lasagna': { calories: 620, protein: 30, carbs: 48, fat: 32 },
    'Tiramisù': { calories: 380, protein: 8, carbs: 42, fat: 20 }
};

function showNutrition(dishName) {
    const nutrition = menuNutrition[dishName];
    if (nutrition) {
        const info = `
📊 ${dishName}:
🔥 ${nutrition.calories} kcal
💪 Proteínas: ${nutrition.protein}g
🍞 Carbohidratos: ${nutrition.carbs}g
🥑 Grasas: ${nutrition.fat}g
        `;
        alert(info);
    }
}

// ============================================
// ============================================
// ALLERGEN FILTERS (Fixed Logic)
// ============================================

// Mapa de alérgenos por plato (Simplificado)
// En una app real, esto vendría de una base de datos o del objeto menuData
const dishAllergensMap = {
    'Bruschetta al Pomodoro': ['gluten'],
    'Spaghetti Carbonara': ['gluten', 'egg', 'dairy'],
    'Lasanya Bolonyesa': ['gluten', 'dairy', 'egg'],
    'Caprese Clàssica': ['dairy'],
    'Risotto de Bolets': ['dairy'],
    'Gnocchi al Pesto': ['gluten', 'dairy', 'nuts'],
    'Ravioli de Ricotta': ['gluten', 'dairy', 'egg'],
    'Tiramisù': ['gluten', 'dairy', 'egg'],
    'Panna Cotta': ['dairy'],
    'Cannoli Siciliani': ['gluten', 'dairy'],
    'Antipasto di Mare': ['seafood'],
    'Spaghetti alle Vongole': ['gluten', 'seafood'],
    'Mini Spaghetti Bolognese': ['gluten'],
    'Pizza Margherita Petita': ['gluten', 'dairy'],
    'Focaccia al Romaní': ['gluten'],
    'Arancini Siciliani': ['gluten', 'egg'],
    'Crostini Toscani': ['gluten'],
    'Burrata amb Tomàquets': ['dairy'],
    'Tagliatelle al Ragú': ['gluten', 'egg'],
    'Risotto al Safrà': ['dairy'],
    'Nuggets de Pollastre': ['gluten'],
    'Gelat de 3 Boles': ['dairy']
};

// Toggle del dropdown de filtros
const allergenToggle = document.getElementById('allergen-toggle');
const allergenDropdown = document.getElementById('allergen-dropdown');

if (allergenToggle && allergenDropdown) {
    allergenToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        allergenDropdown.classList.toggle('show');
    });

    // Cerrar al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!allergenDropdown.contains(e.target) && e.target !== allergenToggle) {
            allergenDropdown.classList.remove('show');
        }
    });
}

// Logic para los checkboxes
document.querySelectorAll('.filter-dropdown-content input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        applyAllergenFilters();
    });
});

function applyAllergenFilters() {
    // 1. Obtener alérgenos seleccionados (que se quieren EVITAR)
    const selectedAllergens = Array.from(document.querySelectorAll('.filter-dropdown-content input[type="checkbox"]:checked'))
        .map(cb => cb.dataset.allergen);

    // 2. Filtrar cada plato
    const menuItems = document.querySelectorAll('.menu-item');
    let hiddenCount = 0;

    menuItems.forEach(item => {
        const dishNameElement = item.querySelector('h3');
        if (!dishNameElement) return;

        const dishName = dishNameElement.textContent.trim();
        const dishAllergens = dishAllergensMap[dishName] || [];

        // Si el plato tiene ALGUNO de los alérgenos seleccionados -> OCULTAR
        const shouldHide = selectedAllergens.some(allergen => dishAllergens.includes(allergen));

        if (shouldHide) {
            item.style.display = 'none';
            hiddenCount++;
        } else {
            item.style.display = 'block'; // O 'flex' si usas flexbox, pero block es seguro para list items
            // Asegurarse de que animaciones AOS no interfieran
            item.style.opacity = '1';
            item.style.visibility = 'visible';
        }
    });

    // 3. Feedback visual en el botón
    if (allergenToggle) {
        if (selectedAllergens.length > 0) {
            allergenToggle.innerHTML = `⚠️ FILTRES (${selectedAllergens.length}) <span style="font-size:0.8em; opacity:0.8">(${hiddenCount} ocultos)</span>`;
            allergenToggle.style.backgroundColor = '#ff4444';
        } else {
            allergenToggle.textContent = '⚠️ FILTRES';
            allergenToggle.style.backgroundColor = ''; // Volver al color original (CSS)
        }
    }

    console.log(`Filtros aplicados: ${selectedAllergens.join(', ')}. Platos ocultos: ${hiddenCount}`);
}

console.log('✅ Allergen Logic Updated (Hides dishes)');

// ============================================
// MENU SETTINGS - Language, Accessibility, Music
// ============================================

// Language buttons in menu
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const lang = btn.dataset.lang;
        localStorage.setItem('site_language', lang);
        console.log('Idioma canviat a:', lang);
    });
});

// Load saved language
const savedLang2 = localStorage.getItem('site_language');
if (savedLang2) {
    document.querySelectorAll('.lang-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.lang === savedLang2);
    });
}

// Accessibility buttons in menu
let menuTextSize = 100;

document.getElementById('menu-increase-text')?.addEventListener('click', () => {
    menuTextSize += 10;
    if (menuTextSize > 150) menuTextSize = 150;
    document.documentElement.style.fontSize = menuTextSize + '%';
    console.log('Text size:', menuTextSize + '%');
});

document.getElementById('menu-decrease-text')?.addEventListener('click', () => {
    menuTextSize -= 10;
    if (menuTextSize < 80) menuTextSize = 80;
    document.documentElement.style.fontSize = menuTextSize + '%';
    console.log('Text size:', menuTextSize + '%');
});

document.getElementById('menu-high-contrast')?.addEventListener('click', function () {
    document.body.classList.toggle('high-contrast');
    this.classList.toggle('active');
    console.log('High contrast:', document.body.classList.contains('high-contrast'));
});

// Music buttons in menu
document.querySelectorAll('.music-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.music-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const music = btn.dataset.music;
        const audio = document.getElementById('bg-audio');

        if (music === 'none') {
            if (audio) audio.pause();
        } else {
            if (audio) {
                audio.play().catch(e => console.log('Audio bloqueado por navegador'));
            }
        }
        console.log('Música:', music);
    });
});

console.log('✅ Menu settings loaded');
