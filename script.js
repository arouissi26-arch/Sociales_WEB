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

    // Sticky Sidebar Active State (Refactored for Performance)
    const updateActiveDot = () => {
        const top = window.scrollY;

        document.querySelectorAll('section').forEach((sec) => {
            if (!sec) return;
            const offset = sec.offsetTop - 150;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');

            if (id && top >= offset && top < offset + height) {
                document.querySelectorAll('.dot').forEach(dot => {
                    dot.classList.remove('active');
                    const dotHref = dot.getAttribute('href');
                    if (dotHref === '#' + id) dot.classList.add('active');
                });
            }
        });
        scrollTicking = false;
    };

    if (!window.scrollTicking) {
        window.requestAnimationFrame(updateActiveDot);
        window.scrollTicking = true;
    }
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
// PHASE 6: INTERACTIVE MENU WITH MODAL (2026)
// ============================================

const menuData = [
    // --- ANTIPASTI (ENTRANTS) ---
    { id: 'bruschetta', category: 'classic', name: 'Bruschetta al Pomodoro', price: '12€', desc: 'Un clàssic fresc i cruixent per començar.', ingredients: 'pa torrat, tomàquet, all, alfàbrega, oli d’oliva', image: 'https://images.unsplash.com/photo-1572695157369-a29f427324c1?w=500&h=500&fit=crop', nutrition: { calorias: 180, azucar: 4, sal: 0.8, proteinas: 4 }, alergenos: ['gluten'] },
    { id: 'carpaccio', category: 'classic', name: 'Carpaccio di Manzo', price: '18€', desc: 'Lleuger i elegant, amb un toc cítric.', ingredients: 'vedella laminada, ruca, parmesà, llimona', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=500&fit=crop', nutrition: { calorias: 220, azucar: 1, sal: 1.2, proteinas: 28 }, alergenos: ['lactosa'] },
    { id: 'caprese', category: 'classic', name: 'Caprese Clàssica', price: '14€', desc: 'Un plat senzill i colorit originari de Capri.', ingredients: 'tomàquet, mozzarella, alfàbrega, oli d’oliva', image: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500&h=500&fit=crop', nutrition: { calorias: 280, azucar: 3, sal: 0.9, proteinas: 18 }, alergenos: ['lactosa'] },
    { id: 'prosciutto', category: 'classic', name: 'Prosciutto e Melone', price: '16€', desc: 'Contrapunt perfecte entre dolç i salat.', ingredients: 'pernil curat, meló', image: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=500&h=500&fit=crop', nutrition: { calorias: 190, azucar: 12, sal: 2.1, proteinas: 15 }, alergenos: [] },
    { id: 'focaccia', category: 'classic', name: 'Focaccia al Romaní', price: '8€', desc: 'Pa esponjós i aromàtic, típic de Ligúria.', ingredients: 'massa de pa, oli d’oliva, romaní', image: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?w=500&h=500&fit=crop', nutrition: { calorias: 320, azucar: 2, sal: 1.5, proteinas: 8 }, alergenos: ['gluten'] },
    { id: 'olive', category: 'classic', name: 'Olive all’Ascolana', price: '10€', desc: 'Olives farcides i arrebossades, cruixents per fora.', ingredients: 'olives grans, carn picada, pa ratllat', image: 'https://images.unsplash.com/photo-1623227866882-c005c207758f?w=500&h=500&fit=crop', nutrition: { calorias: 290, azucar: 1, sal: 1.8, proteinas: 12 }, alergenos: ['gluten', 'huevo'] },
    { id: 'antipasto-mare', category: 'classic', name: 'Antipasto di Mare', price: '20€', desc: 'Amanida marinera fresca i lleugera.', ingredients: 'pop, musclos, calamars, llimona', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&h=500&fit=crop', nutrition: { calorias: 180, azucar: 2, sal: 1.4, proteinas: 22 }, alergenos: ['marisco'] },
    { id: 'crostini', category: 'classic', name: 'Crostini Toscani', price: '12€', desc: 'Intens i rústic, típic de la Toscana.', ingredients: 'pa torrat, paté de fetge, ceba', image: 'https://images.unsplash.com/photo-1608039829572-78524f79c2c7?w=500&h=500&fit=crop', nutrition: { calorias: 240, azucar: 1, sal: 1.1, proteinas: 14 }, alergenos: ['gluten'] },
    { id: 'arancini', category: 'classic', name: 'Arancini Siciliani', price: '10€', desc: 'Boletes d’arròs fregides, cruixents i cremoses.', ingredients: 'arròs, ragú, pèsols, mozzarella, pa ratllat', image: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=500&h=500&fit=crop', nutrition: { calorias: 380, azucar: 3, sal: 1.6, proteinas: 10 }, alergenos: ['gluten', 'huevo', 'lactosa'] },
    { id: 'burrata', category: 'classic', name: 'Burrata amb Tomàquets Cherry', price: '16€', desc: 'Molt cremosa i amb perfum d’alfàbrega.', ingredients: 'burrata, tomàquets cherry, pesto', image: 'https://images.unsplash.com/photo-1579631542720-3a87824fff86?w=500&h=500&fit=crop', nutrition: { calorias: 340, azucar: 4, sal: 0.7, proteinas: 16 }, alergenos: ['lactosa', 'frutos_secos'] },

    // --- PRIMI PIATTI ---
    { id: 'carbonara', category: 'classic', name: 'Spaghetti alla Carbonara', price: '18€', desc: 'El clàssic romà, cremós sense nata.', ingredients: 'ou, pecorino, guanciale, pebre negre', image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500&h=500&fit=crop', nutrition: { calorias: 520, azucar: 2, sal: 1.8, proteinas: 22 }, alergenos: ['gluten', 'huevo', 'lactosa'] },
    { id: 'arrabbiata', category: 'classic', name: 'Penne all’Arrabbiata', price: '15€', desc: 'Picant i saborós.', ingredients: 'tomàquet, all, bitxo, oli d’oliva', image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=500&h=500&fit=crop', nutrition: { calorias: 380, azucar: 6, sal: 0.9, proteinas: 12 }, alergenos: ['gluten'] },
    { id: 'lasanya', category: 'classic', name: 'Lasanya a la Bolonyesa', price: '20€', desc: 'Capes de pasta tendra amb salsa de carn.', ingredients: 'pasta, ragú, beixamel, parmesà', image: 'https://images.unsplash.com/photo-1574868468732-92194e7a28e3?w=500&h=500&fit=crop', nutrition: { calorias: 580, azucar: 5, sal: 2.1, proteinas: 28 }, alergenos: ['gluten', 'lactosa', 'huevo'] },
    { id: 'risotto-bolets', category: 'classic', name: 'Risotto als Bolets', price: '22€', desc: 'Cremós i aromàtic.', ingredients: 'arròs arborio, bolets, parmesà', image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=500&h=500&fit=crop', nutrition: { calorias: 420, azucar: 2, sal: 1.2, proteinas: 10 }, alergenos: ['lactosa'] },
    { id: 'gnocchi', category: 'classic', name: 'Gnocchi al Pesto', price: '16€', desc: 'Suau i molt fragant.', ingredients: 'patata, alfàbrega, pinyons, parmesà', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&h=500&fit=crop', nutrition: { calorias: 460, azucar: 3, sal: 1.4, proteinas: 14 }, alergenos: ['gluten', 'lactosa', 'frutos_secos'] },
    { id: 'tagliatelle', category: 'classic', name: 'Tagliatelle al Ragù Bolonyès', price: '19€', desc: 'Recepta tradicional de Bolonya.', ingredients: 'pasta fresca, ragú, tomàquet', image: 'https://images.unsplash.com/photo-1598866594230-a269ba3aca29?w=500&h=500&fit=crop', nutrition: { calorias: 540, azucar: 4, sal: 1.6, proteinas: 24 }, alergenos: ['gluten', 'huevo'] },
    { id: 'ravioli', category: 'classic', name: 'Ravioli de Ricotta i Espinacs', price: '18€', desc: 'Delicat i suau.', ingredients: 'pasta farcida, ricotta, espinacs, mantega i sàlvia', image: 'https://images.unsplash.com/photo-1587740986335-9917fe796397?w=500&h=500&fit=crop', nutrition: { calorias: 420, azucar: 3, sal: 1.1, proteinas: 18 }, alergenos: ['gluten', 'huevo', 'lactosa'] },
    { id: 'trofie', category: 'classic', name: 'Trofie al Pesto Genovès', price: '17€', desc: 'Especialitat típica de Ligúria.', ingredients: 'pasta trofie, pesto, patates, mongetes tendres', image: 'https://images.unsplash.com/photo-1626844131082-256783844137?w=500&h=500&fit=crop', nutrition: { calorias: 440, azucar: 4, sal: 1.0, proteinas: 12 }, alergenos: ['gluten', 'frutos_secos'] },
    { id: 'vongole', category: 'classic', name: 'Spaghetti alle Vongole', price: '24€', desc: 'Lleuger i mariner.', ingredients: 'cloïsses, all, vi blanc, julivert', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&h=500&fit=crop', nutrition: { calorias: 380, azucar: 2, sal: 1.9, proteinas: 20 }, alergenos: ['gluten', 'marisco'] },
    { id: 'risotto-safra', category: 'classic', name: 'Risotto a l’A safrà (Milanès)', price: '22€', desc: 'Daurat i d’aroma subtil.', ingredients: 'arròs, safrà, mantega, parmesà', image: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=500&h=500&fit=crop', nutrition: { calorias: 480, azucar: 1, sal: 1.5, proteinas: 16 }, alergenos: ['lactosa'] },

    // --- SECONDI PIATTI ---
    { id: 'cacciatora', category: 'classic', name: 'Pollastre a la Cacciatora', price: '22€', desc: 'Guisat rústic i saborós.', ingredients: 'pollastre, tomàquet, olives, vi negre', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&h=500&fit=crop', nutrition: { calorias: 420, azucar: 5, sal: 1.8, proteinas: 38 }, alergenos: [] },
    { id: 'saltimbocca', category: 'classic', name: 'Saltimbocca a la Romana', price: '26€', desc: 'Tendra i molt aromàtica.', ingredients: 'vedella, pernil, sàlvia', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&h=500&fit=crop', nutrition: { calorias: 380, azucar: 1, sal: 2.2, proteinas: 42 }, alergenos: [] },
    { id: 'fiorentina', category: 'classic', name: 'Bistecca alla Fiorentina (1kg)', price: '65€', desc: 'Carn a la graella, sucosa i tradicional.', ingredients: 'entrecot gruixut de vedella, sal, oli', image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500&h=500&fit=crop', nutrition: { calorias: 850, azucar: 0, sal: 2.5, proteinas: 95 }, alergenos: [] },
    { id: 'parmigiana', category: 'classic', name: 'Parmigiana d’Albergínia', price: '18€', desc: 'Capa sobre capa, al forn, molt saborosa.', ingredients: 'albergínia, tomàquet, mozzarella, parmesà', image: 'https://images.unsplash.com/photo-1625938146369-adc83368bda7?w=500&h=500&fit=crop', nutrition: { calorias: 320, azucar: 8, sal: 1.4, proteinas: 14 }, alergenos: ['lactosa'] },
    { id: 'ossobuco', category: 'classic', name: 'Ossobuco a la Milanesa', price: '28€', desc: 'Melós i ric en sabor.', ingredients: 'galta de vedella, vi blanc, verdures', image: 'https://images.unsplash.com/photo-1544025162-d76690b67f61?w=500&h=500&fit=crop', nutrition: { calorias: 480, azucar: 3, sal: 1.9, proteinas: 45 }, alergenos: ['gluten'] },
    { id: 'mandonguilles', category: 'classic', name: 'Mandonguilles en Salsa', price: '18€', desc: 'Un clàssic reconfortant.', ingredients: 'carn picada, pa, tomàquet, espècies', image: 'https://images.unsplash.com/photo-1529042410759-befb72002fef?w=500&h=500&fit=crop', nutrition: { calorias: 420, azucar: 6, sal: 1.7, proteinas: 28 }, alergenos: ['gluten', 'huevo'] },
    { id: 'graellada', category: 'classic', name: 'Graellada de Peix', price: '32€', desc: 'Lliure i mediterrània.', ingredients: 'gambes, calamar, peix variat', image: 'https://images.unsplash.com/photo-1534939561126-855f86654015?w=500&h=500&fit=crop', nutrition: { calorias: 280, azucar: 0, sal: 1.2, proteinas: 42 }, alergenos: ['marisco'] },
    { id: 'calamars', category: 'classic', name: 'Calamars Farcits', price: '24€', desc: 'Tendres i aromàtics.', ingredients: 'calamars, pa ratllat, all, julivert', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&h=500&fit=crop', nutrition: { calorias: 340, azucar: 4, sal: 1.6, proteinas: 26 }, alergenos: ['gluten', 'marisco'] },
    { id: 'escalopines', category: 'classic', name: 'Escalopines al Llimó', price: '20€', desc: 'Fines, lleugeres i cítriques.', ingredients: 'vedella, llimona, mantega', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&h=500&fit=crop', nutrition: { calorias: 360, azucar: 2, sal: 1.3, proteinas: 32 }, alergenos: ['lactosa'] },
    { id: 'fritto-misto', category: 'classic', name: 'Fritto Misto', price: '25€', desc: 'Cruixent i molt mediterrani.', ingredients: 'peix i marisc fregit', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&h=500&fit=crop', nutrition: { calorias: 480, azucar: 1, sal: 1.8, proteinas: 28 }, alergenos: ['gluten', 'marisco'] },

    // --- DOLCI ---
    { id: 'tiramisu', category: 'postres', name: 'Tiramisù', price: '8€', desc: 'Clàssic italià, cremós i intens.', ingredients: 'mascarpone, cafè, cacau, ous', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&h=500&fit=crop', nutrition: { calorias: 420, azucar: 28, sal: 0.3, proteinas: 8 }, alergenos: ['lactosa', 'huevo', 'gluten'] },
    { id: 'panna-cotta', category: 'postres', name: 'Panna Cotta amb Fruits Vermells', price: '8€', desc: 'Suau, sedosa i refrescant.', ingredients: 'nata, vainilla, gelatina', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&h=500&fit=crop', nutrition: { calorias: 340, azucar: 24, sal: 0.2, proteinas: 5 }, alergenos: ['lactosa'] },
    { id: 'cannoli', category: 'postres', name: 'Cannoli Sicilians', price: '9€', desc: 'Cruixents i cremosos alhora.', ingredients: 'ricotta, sucre, taronja confitada', image: 'https://images.unsplash.com/photo-1551024601-569d6f7e1278?w=500&h=500&fit=crop', nutrition: { calorias: 380, azucar: 22, sal: 0.4, proteinas: 10 }, alergenos: ['gluten', 'lactosa', 'frutos_secos'] },
    { id: 'gelat', category: 'postres', name: 'Gelat Artesà Italià', price: '7€', desc: 'Cremós i sabor intens.', ingredients: 'llet, sucre, ingredients naturals', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&h=500&fit=crop', nutrition: { calorias: 220, azucar: 18, sal: 0.1, proteinas: 4 }, alergenos: ['lactosa'] },
    { id: 'zabaione', category: 'postres', name: 'Zabaione', price: '8€', desc: 'Crema tèbia i esponjosa.', ingredients: 'rovell, sucre, vi Marsala', image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&h=500&fit=crop', nutrition: { calorias: 300, azucar: 20, sal: 0.1, proteinas: 4 }, alergenos: ['huevo'] },
    { id: 'torta-nonna', category: 'postres', name: 'Torta della Nonna', price: '9€', desc: 'Tradicional i molt aromàtica.', ingredients: 'crema pastissera, pinyons, pasta brisa', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476d?w=500&h=500&fit=crop', nutrition: { calorias: 360, azucar: 20, sal: 0.3, proteinas: 7 }, alergenos: ['gluten', 'huevo', 'lactosa', 'frutos_secos'] },
    { id: 'profiteroles', category: 'postres', name: 'Profiteroles amb Xocolata', price: '9€', desc: 'Boles farcides banyades en xocolata.', ingredients: 'pasta choux, crema, xocolata', image: 'https://images.unsplash.com/photo-1550950158-d0d960dff51b?w=500&h=500&fit=crop', nutrition: { calorias: 440, azucar: 32, sal: 0.4, proteinas: 6 }, alergenos: ['gluten', 'huevo', 'lactosa'] },
    { id: 'sfogliatella', category: 'postres', name: 'Sfogliatella Napolitana', price: '5€', desc: 'Cruixent per fora, suau per dins.', ingredients: 'pasta de full, ricotta, sèmola', image: 'https://images.unsplash.com/photo-1509456578033-066ab12d09ce?w=500&h=500&fit=crop', nutrition: { calorias: 280, azucar: 16, sal: 0.5, proteinas: 6 }, alergenos: ['gluten', 'lactosa'] },
    { id: 'affogato', category: 'postres', name: 'Affogato al Caffè', price: '7€', desc: 'Senzill i deliciós.', ingredients: 'gelat de vainilla, cafè espresso', image: 'https://images.unsplash.com/photo-1599320641322-95f727c6225a?w=500&h=500&fit=crop', nutrition: { calorias: 180, azucar: 14, sal: 0.1, proteinas: 3 }, alergenos: ['lactosa'] },
    { id: 'cassata', category: 'postres', name: 'Cassata Siciliana', price: '10€', desc: 'Colorida i dolça, molt festiva.', ingredients: 'pa de pessic, ricotta dolça, fruita confitada', image: 'https://images.unsplash.com/photo-1582239634288-51f71f114002?w=500&h=500&fit=crop', nutrition: { calorias: 480, azucar: 38, sal: 0.3, proteinas: 8 }, alergenos: ['gluten', 'lactosa', 'frutos_secos'] },

    // --- MENÚ VEGÀ ---
    // Antipasti
    { id: 'bruschetta-v', category: 'vegan', name: 'Bruschetta al Pomodoro (Vegà)', price: '12€', desc: 'Entrada fresca i cruixent.', ingredients: 'pa torrat, tomàquet, all, alfàbrega, oli d’oliva', image: 'https://images.unsplash.com/photo-1572695157369-a29f427324c1?w=500&h=500&fit=crop', nutrition: { calorias: 180 }, alergenos: ['gluten'] },
    { id: 'caprese-v', category: 'vegan', name: 'Caprese Vegana', price: '14€', desc: 'La clàssica caprese sense productes animals.', ingredients: 'tomàquet, mozzarella vegana, alfàbrega', image: 'https://images.unsplash.com/photo-1529312266912-b33cf6227e2f?w=500&h=500&fit=crop', nutrition: { calorias: 200 }, alergenos: [] },
    { id: 'carpaccio-v', category: 'vegan', name: 'Carpaccio de Remolatxa', price: '14€', desc: 'Cruixent i fresc.', ingredients: 'remolatxa cuita, ruca, nous, llimona', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&h=500&fit=crop', nutrition: { calorias: 150 }, alergenos: ['frutos_secos'] },
    { id: 'focaccia-v', category: 'vegan', name: 'Focaccia al Romaní (Vegà)', price: '8€', desc: 'Esponjosa i aromàtica.', ingredients: 'massa de pa, oli d’oliva, romaní', image: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?w=500&h=500&fit=crop', nutrition: { calorias: 320 }, alergenos: ['gluten'] },
    { id: 'olives-v', category: 'vegan', name: 'Olives Farcides Veganes', price: '9€', desc: 'Cruixents i plenes de sabor.', ingredients: 'olives, pèsols, ametlles', image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=500&h=500&fit=crop', nutrition: { calorias: 220 }, alergenos: ['frutos_secos'] },
    { id: 'caponata-v', category: 'vegan', name: 'Caponata Siciliana', price: '12€', desc: 'Estofat de verdures sicilià.', ingredients: 'albergínia, tomàquet, api, olives', image: 'https://images.unsplash.com/photo-1529312266912-b33cf6227e2f?w=500&h=500&fit=crop', nutrition: { calorias: 240 }, alergenos: [] },
    { id: 'hummus-v', category: 'vegan', name: 'Hummus Italià', price: '10€', desc: 'Suau i cremós amb pinyons.', ingredients: 'cigrons, llimona, pinyons', image: 'https://images.unsplash.com/photo-1637949385162-e416fb15b2ce?w=500&h=500&fit=crop', nutrition: { calorias: 300 }, alergenos: ['frutos_secos'] },
    { id: 'arancini-v', category: 'vegan', name: 'Arancini Vegans', price: '11€', desc: 'Boletes d’arròs farcides de verdures.', ingredients: 'arròs, verdures, pa ratllat', image: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=500&h=500&fit=crop', nutrition: { calorias: 350 }, alergenos: ['gluten'] },
    { id: 'burrata-v', category: 'vegan', name: 'Burrata Vegana', price: '15€', desc: 'Cremosa amb pesto vegà.', ingredients: 'tofu, tomàquets cherry, pesto vegà', image: 'https://images.unsplash.com/photo-1579631542720-3a87824fff86?w=500&h=500&fit=crop', nutrition: { calorias: 280 }, alergenos: ['frutos_secos', 'soja'] },
    { id: 'ensalada-v', category: 'vegan', name: 'Ensalada Mediterrània', price: '12€', desc: 'Nutritiva i fresca.', ingredients: 'cigrons, mongetes, tomàquet, pebrot', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&h=500&fit=crop', nutrition: { calorias: 250 }, alergenos: [] },

    // Primi Vegans
    { id: 'spaghetti-pesto-v', category: 'vegan', name: 'Spaghetti al Pesto Vegà', price: '16€', desc: 'Cremós i aromàtic.', ingredients: 'alfàbrega, all, nous/pinyons', image: 'https://images.unsplash.com/photo-1516100882582-96c3a05fe590?w=500&h=500&fit=crop', nutrition: { calorias: 450 }, alergenos: ['gluten', 'frutos_secos'] },
    { id: 'arrabbiata-v', category: 'vegan', name: 'Penne all’Arrabbiata (Vegà)', price: '15€', desc: 'Picant i saborós.', ingredients: 'tomàquet, all, bitxo', image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=500&h=500&fit=crop', nutrition: { calorias: 380 }, alergenos: ['gluten'] },
    { id: 'risotto-setas-v', category: 'vegan', name: 'Risotto de Bolets Vegà', price: '22€', desc: 'Cremós sense lactis.', ingredients: 'arròs, bolets, brou vegetal', image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=500&h=500&fit=crop', nutrition: { calorias: 400 }, alergenos: [] },
    { id: 'lasanya-v', category: 'vegan', name: 'Lasanya Vegana', price: '19€', desc: 'Capes saboroses, 100% vegetal.', ingredients: 'pasta, llenties, beixamel vegana', image: 'https://images.unsplash.com/photo-1574868468732-92194e7a28e3?w=500&h=500&fit=crop', nutrition: { calorias: 450 }, alergenos: ['gluten'] },
    { id: 'gnocchi-v', category: 'vegan', name: 'Gnocchi amb Salsa de Tomàquet', price: '16€', desc: 'Suau i reconfortant.', ingredients: 'patata, farina, tomàquet', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&h=500&fit=crop', nutrition: { calorias: 410 }, alergenos: ['gluten'] },
    { id: 'ravioli-v', category: 'vegan', name: 'Ravioli Vegans Tofu/Espinacs', price: '18€', desc: 'Delicats i aromàtics.', ingredients: 'tofu, espinacs, oli d’oliva', image: 'https://images.unsplash.com/photo-1587740986335-9917fe796397?w=500&h=500&fit=crop', nutrition: { calorias: 400 }, alergenos: ['gluten', 'soja'] },
    { id: 'trofie-v', category: 'vegan', name: 'Trofie al Pesto Vegà', price: '17€', desc: 'Tradicional de Ligúria.', ingredients: 'pesto vegà, patates, mongetes', image: 'https://images.unsplash.com/photo-1626844131082-256783844137?w=500&h=500&fit=crop', nutrition: { calorias: 430 }, alergenos: ['gluten', 'frutos_secos'] },
    { id: 'vongole-v', category: 'vegan', name: 'Spaghetti "Vongole" Vegà', price: '18€', desc: 'Sabors marins amb alga wakame.', ingredients: 'alga wakame, all, oli', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&h=500&fit=crop', nutrition: { calorias: 390 }, alergenos: ['gluten'] },
    { id: 'risotto-allioli-v', category: 'vegan', name: 'Risotto All i Oli Vegà', price: '18€', desc: 'Molt aromàtic.', ingredients: 'arròs, oli, all, brou', image: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=500&h=500&fit=crop', nutrition: { calorias: 410 }, alergenos: [] },
    { id: 'pasta-verdure-v', category: 'vegan', name: 'Pasta al Sugo di Verdure', price: '15€', desc: 'Sabor intens casolà.', ingredients: 'verdures variades, tomàquet', image: 'https://images.unsplash.com/photo-1643661100639-de696cc791c1?w=500&h=500&fit=crop', nutrition: { calorias: 380 }, alergenos: ['gluten'] },

    // Secondi Vegans
    { id: 'pollastre-v', category: 'vegan', name: 'Pollastre Vegà Cacciatora', price: '20€', desc: 'Seitán/Tofu guisat rústic.', ingredients: 'seitan/tofu, tomàquet, olives', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&h=500&fit=crop', nutrition: { calorias: 350 }, alergenos: ['gluten', 'soja'] },
    { id: 'seitan-llimo-v', category: 'vegan', name: 'Escalopines de Seitan', price: '19€', desc: 'Fines i cítriques.', ingredients: 'seitan, llimona, oli', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&h=500&fit=crop', nutrition: { calorias: 320 }, alergenos: ['gluten'] },
    { id: 'parmigiana-v', category: 'vegan', name: 'Parmigiana Vegana', price: '18€', desc: 'Gratinada i saborosa.', ingredients: 'albergínia, tomàquet, formatge vegà', image: 'https://images.unsplash.com/photo-1625938146369-adc83368bda7?w=500&h=500&fit=crop', nutrition: { calorias: 310 }, alergenos: [] },
    { id: 'ossobuco-v', category: 'vegan', name: 'Ossobuco Vegà', price: '20€', desc: 'Estofat de llegums.', ingredients: 'llenties, pastanaga, tomàquet', image: 'https://images.unsplash.com/photo-1544025162-d76690b67f61?w=500&h=500&fit=crop', nutrition: { calorias: 380 }, alergenos: [] },
    { id: 'mandonguilles-v', category: 'vegan', name: 'Mandonguilles Veganes', price: '17€', desc: 'Cruixents i tendres.', ingredients: 'llenties/cigrons, tomàquet', image: 'https://images.unsplash.com/photo-1529042410759-befb72002fef?w=500&h=500&fit=crop', nutrition: { calorias: 340 }, alergenos: [] },
    { id: 'graellada-v', category: 'vegan', name: 'Graellada de Verdures', price: '16€', desc: 'Senzill i colorit.', ingredients: 'carbassó, albergínia, pebrot', image: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500&h=500&fit=crop', nutrition: { calorias: 200 }, alergenos: [] },
    { id: 'calamars-v', category: 'vegan', name: 'Calamars Vegans Farcits', price: '19€', desc: 'Inspirat en el tradicional.', ingredients: 'xampinyons/tofu, herbes', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&h=500&fit=crop', nutrition: { calorias: 300 }, alergenos: ['soja'] },
    { id: 'brou-v', category: 'vegan', name: 'Brou Mediterrani', price: '14€', desc: 'Reconfortant.', ingredients: 'llegums, verdures', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=500&fit=crop', nutrition: { calorias: 280 }, alergenos: [] },
    { id: 'caponata-tofu-v', category: 'vegan', name: 'Caponata amb Tofu', price: '16€', desc: 'Estofat amb proteïna.', ingredients: 'albergínia, tofu, olives', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=500&fit=crop', nutrition: { calorias: 320 }, alergenos: ['soja'] },
    { id: 'fritto-v', category: 'vegan', name: 'Fritto Misto Vegà', price: '18€', desc: 'Cruixent i lleuger.', ingredients: 'verdures fregides', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&h=500&fit=crop', nutrition: { calorias: 360 }, alergenos: [] },

    // Dolci Vegans
    { id: 'tiramisu-v', category: 'vegan', name: 'Tiramisú Vegà', price: '8€', desc: 'Cremós sense animals.', ingredients: 'tofu/anacards, cafè', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&h=500&fit=crop', nutrition: { calorias: 350 }, alergenos: ['frutos_secos', 'soja'] },
    { id: 'pannacotta-v', category: 'vegan', name: 'Panna Cotta Vegana', price: '8€', desc: 'Suau i delicada.', ingredients: 'llet coco, agar-agar', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&h=500&fit=crop', nutrition: { calorias: 300 }, alergenos: [] },
    { id: 'cannoli-v', category: 'vegan', name: 'Cannoli Vegans', price: '9€', desc: 'Cruixent i dolç.', ingredients: 'ricotta tofu, fruita', image: 'https://images.unsplash.com/photo-1551024601-569d6f7e1278?w=500&h=500&fit=crop', nutrition: { calorias: 360 }, alergenos: ['soja'] },
    { id: 'gelat-v', category: 'vegan', name: 'Gelat Vegà', price: '7€', desc: 'Molt saborós.', ingredients: 'llet vegetal, fruita', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&h=500&fit=crop', nutrition: { calorias: 220 }, alergenos: [] },
    { id: 'zabaione-v', category: 'vegan', name: 'Zabaione Vegà', price: '8€', desc: 'Espumós.', ingredients: 'tofu suau, Marsala', image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&h=500&fit=crop', nutrition: { calorias: 280 }, alergenos: ['soja'] },
    { id: 'torta-nonna-v', category: 'vegan', name: 'Torta Nonna Vegana', price: '9€', desc: 'Deliciosa.', ingredients: 'crema vegana, pinyons', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476d?w=500&h=500&fit=crop', nutrition: { calorias: 350 }, alergenos: ['gluten', 'frutos_secos'] },
    { id: 'profiteroles-v', category: 'vegan', name: 'Profiteroles Vegans', price: '9€', desc: 'Cruixents i cremosos.', ingredients: 'xocolata, crema vegana', image: 'https://images.unsplash.com/photo-1550950158-d0d960dff51b?w=500&h=500&fit=crop', nutrition: { calorias: 380 }, alergenos: ['gluten'] },
    { id: 'sfogliatella-v', category: 'vegan', name: 'Sfogliatella Vegana', price: '6€', desc: 'Cruixent.', ingredients: 'pasta full vegana, tofu', image: 'https://images.unsplash.com/photo-1509456578033-066ab12d09ce?w=500&h=500&fit=crop', nutrition: { calorias: 300 }, alergenos: ['gluten', 'soja'] },
    { id: 'affogato-v', category: 'vegan', name: 'Affogato Vegà', price: '7€', desc: 'Intens.', ingredients: 'gelat vegà, cafè', image: 'https://images.unsplash.com/photo-1599320641322-95f727c6225a?w=500&h=500&fit=crop', nutrition: { calorias: 180 }, alergenos: [] },
    { id: 'cassata-v', category: 'vegan', name: 'Cassata Vegana', price: '10€', desc: 'Festiva.', ingredients: 'ricotta tofu, fruita confitada', image: 'https://images.unsplash.com/photo-1582239634288-51f71f114002?w=500&h=500&fit=crop', nutrition: { calorias: 400 }, alergenos: ['soja'] },


    // --- VINS (CELLER) ---
    { id: 'vega-sicilia', category: 'wines', name: 'Vega Sicilia Único Reserva', price: '450€', desc: 'Ribera del Duero. Clàssic absolut, complexitat i elegància.', image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=500&h=500&fit=crop', nutrition: {}, alergenos: [] },
    { id: 'margaux', category: 'wines', name: 'Château Margaux 2016', price: '600€', desc: 'Bordeaux (França). Finor i equilibri llegendari.', image: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=500&h=500&fit=crop', nutrition: {}, alergenos: [] },
    { id: 'pingus', category: 'wines', name: 'Flor de Pingus', price: '200€', desc: 'Ribera del Duero. Intens i estructurat.', image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=500&h=500&fit=crop', nutrition: {}, alergenos: [] },
    { id: 'clos-mogador', category: 'wines', name: 'Priorat Clos Mogador', price: '90€', desc: 'Priorat. Potència mineral.', image: 'https://images.unsplash.com/photo-1569919659476-f0852f6834f7?w=500&h=500&fit=crop', nutrition: {}, alergenos: [] },
    { id: 'murrieta', category: 'wines', name: 'Marqués de Murrieta Reserva', price: '48€', desc: 'Rioja clàssic. Estructura i suavitat.', image: 'https://images.unsplash.com/photo-1606758683526-724d2fa8214a?w=500&h=500&fit=crop', nutrition: {}, alergenos: [] },
    { id: 'sangre-toro', category: 'wines', name: 'Torres Sangre de Toro', price: '20€', desc: 'Catalunya. Assequible amb caràcter.', image: 'https://images.unsplash.com/photo-1606758683526-724d2fa8214a?w=500&h=500&fit=crop', nutrition: {}, alergenos: [] },
    { id: 'gramona', category: 'wines', name: 'Caves Gramona Imperial Brut', price: '30€', desc: 'Penedès. Frescor i bombolla fina.', image: 'https://images.unsplash.com/photo-1598155523122-3842334d6c10?w=500&h=500&fit=crop', nutrition: {}, alergenos: [] },
    { id: 'vinas-vero', category: 'wines', name: 'Viñas del Vero Macabeo', price: '15€', desc: 'Somontano. Fresc i lleuger.', image: 'https://images.unsplash.com/photo-1563968743333-06336d396974?w=500&h=500&fit=crop', nutrition: {}, alergenos: [] },
    { id: 'castillo-liria', category: 'wines', name: 'Castillo de Liria Garnatxa', price: '12€', desc: 'Catalunya. Jove i afruitat.', image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=500&h=500&fit=crop', nutrition: {}, alergenos: [] },

    // --- INFANTIL ---
    { id: 'spaghetti-kids', category: 'infantil', name: 'Mini Spaghetti Bolognese', price: '8€', desc: 'Pasta amb salsa de tomàquet i carn. Porció adaptada.', image: 'https://images.unsplash.com/photo-1598866594230-a269ba3aca29?w=500&h=500&fit=crop', nutrition: { calorias: 320 }, alergenos: ['gluten'] },
    { id: 'pizza-kids', category: 'infantil', name: 'Pizza Margherita Petita', price: '7€', desc: 'Tomàquet, mozzarella i alfàbrega.', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=500&fit=crop', nutrition: { calorias: 280 }, alergenos: ['gluten', 'lactosa'] },
    { id: 'nuggets-kids', category: 'infantil', name: 'Nuggets de Pollastre', price: '9€', desc: 'Amb patates fregides i ketchup.', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&h=500&fit=crop', nutrition: { calorias: 380 }, alergenos: ['gluten', 'huevo'] },
    { id: 'gelat-kids', category: 'infantil', name: 'Gelat de 3 Boles', price: '5€', desc: 'Xocolata, vainilla i maduixa.', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&h=500&fit=crop', nutrition: { calorias: 240 }, alergenos: ['lactosa'] },
];

const menuList = document.getElementById('menu-items');
const revealContainer = document.getElementById('hover-reveal');

// Modal Elements
let dishModal = null;

// Allergen filter state
let activeAllergenFilters = new Set();
let currentCategoryFilter = 'classic';

// Allergen definitions
const allergenConfig = [
    { id: 'gluten', label: '🌾 Gluten', icon: '🌾' },
    { id: 'lactosa', label: '🥛 Lactosa', icon: '🥛' },
    { id: 'frutos_secos', label: '🥜 Fruits Secs', icon: '🥜' },
    { id: 'marisco', label: '🦐 Marisc', icon: '🦐' },
    { id: 'huevo', label: '🥚 Ou', icon: '🥚' }
];

function initMenu() {
    if (!menuList) return;

    // Create allergen filter bar
    createAllergenFilters();

    // Create modal if on menu page
    createDishModal();

    // Render all initially
    renderMenu('classic');

    // Filter Buttons
    document.querySelectorAll('.menu-filter').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.menu-filter').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategoryFilter = btn.dataset.filter;
            renderMenu(currentCategoryFilter);
        });
    });
}

function createAllergenFilters() {
    // Find the menu header to insert after filters
    const menuHeader = document.querySelector('.menu-header');
    if (!menuHeader) return;

    // Check if already exists
    if (document.querySelector('.allergen-filter-bar')) return;

    // Create filter bar HTML
    const filterBarHTML = `
        <div class="allergen-filter-bar">
            <span class="allergen-filter-label">⚠️ Evitar al·lèrgens:</span>
            <div class="allergen-pills">
                ${allergenConfig.map(a => `
                    <label class="allergen-pill" data-allergen="${a.id}">
                        <input type="checkbox" value="${a.id}" />
                        <span class="pill-content">${a.label}</span>
                    </label>
                `).join('')}
            </div>
            <button class="allergen-clear-btn" style="display: none;">✕ Netejar filtres</button>
        </div>
    `;

    // Insert after menu header
    menuHeader.insertAdjacentHTML('afterend', filterBarHTML);

    // Add event listeners
    document.querySelectorAll('.allergen-pill input').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const allergen = e.target.value;
            const pill = e.target.closest('.allergen-pill');

            if (e.target.checked) {
                activeAllergenFilters.add(allergen);
                pill.classList.add('active');
            } else {
                activeAllergenFilters.delete(allergen);
                pill.classList.remove('active');
            }

            // Show/hide clear button
            updateClearButton();

            // Re-render menu with filters
            renderMenu(currentCategoryFilter);
        });
    });

    // Clear button
    const clearBtn = document.querySelector('.allergen-clear-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            activeAllergenFilters.clear();
            document.querySelectorAll('.allergen-pill').forEach(pill => {
                pill.classList.remove('active');
                pill.querySelector('input').checked = false;
            });
            updateClearButton();
            renderMenu(currentCategoryFilter);
        });
    }
}

function updateClearButton() {
    const clearBtn = document.querySelector('.allergen-clear-btn');
    if (clearBtn) {
        clearBtn.style.display = activeAllergenFilters.size > 0 ? 'inline-flex' : 'none';
    }
}

function createDishModal() {
    // Check if already exists
    if (document.getElementById('dish-modal')) {
        dishModal = document.getElementById('dish-modal');
        return;
    }

    // Create modal HTML with new hierarchy: Image > Title > Desc > Sommelier > Nutrition (collapsible)
    const modalHTML = `
        <div id="dish-modal" class="dish-modal">
            <div class="dish-modal-backdrop"></div>
            <div class="dish-modal-content">
                <button class="dish-modal-close" aria-label="Tancar">&times;</button>
                <div class="dish-modal-body">
                    <div class="dish-modal-image"></div>
                    <div class="dish-modal-info">
                        <h2 class="dish-modal-title"></h2>
                        <p class="dish-modal-price"></p>
                        <p class="dish-modal-desc"></p>
                        
                        <!-- Sommelier Wine Pairing Section (Premium Upselling) -->
                        <div class="sommelier-section" style="display: none;">
                            <div class="sommelier-header">
                                <span class="sommelier-icon">🍷</span>
                                <span class="sommelier-title">Suggeriment del Sommelier</span>
                            </div>
                            <div class="sommelier-card">
                                <div class="sommelier-wine-img"></div>
                                <div class="sommelier-wine-info">
                                    <span class="sommelier-wine-name"></span>
                                    <p class="sommelier-wine-text"></p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Collapsible Nutrition Info (Discrete) -->
                        <details class="dish-modal-nutrition-accordion">
                            <summary>📊 Informació Nutricional</summary>
                            <div class="dish-modal-nutrition">
                                <table>
                                    <tr><td>Calories</td><td class="nut-cal"></td></tr>
                                    <tr><td>Sucre</td><td class="nut-sugar"></td></tr>
                                    <tr><td>Sal</td><td class="nut-salt"></td></tr>
                                    <tr><td>Proteïnes</td><td class="nut-protein"></td></tr>
                                </table>
                            </div>
                        </details>
                        
                        <!-- Cross-Selling Section -->
                        <div class="cross-sell-section" style="display: none;">
                            <div class="cross-sell-title">👥 Clients també van demanar...</div>
                            <div class="cross-sell-items"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    dishModal = document.getElementById('dish-modal');

    // Close button
    dishModal.querySelector('.dish-modal-close').addEventListener('click', closeDishModal);

    // Click backdrop to close
    dishModal.querySelector('.dish-modal-backdrop').addEventListener('click', closeDishModal);

    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && dishModal.classList.contains('active')) {
            closeDishModal();
        }
    });
}

function openDishModal(id) {
    const dish = menuData.find(d => d.id === id);
    if (!dish || !dishModal) return;

    // Populate basic modal info
    dishModal.querySelector('.dish-modal-image').style.backgroundImage = `url('${dish.image}')`;
    dishModal.querySelector('.dish-modal-title').textContent = dish.name;
    dishModal.querySelector('.dish-modal-price').textContent = dish.price;
    dishModal.querySelector('.dish-modal-desc').textContent = dish.desc;

    // Populate nutrition (now in collapsible)
    dishModal.querySelector('.nut-cal').textContent = `${dish.nutrition.calorias} kcal`;
    dishModal.querySelector('.nut-sugar').textContent = `${dish.nutrition.azucar} g`;
    dishModal.querySelector('.nut-salt').textContent = `${dish.nutrition.sal} g`;
    dishModal.querySelector('.nut-protein').textContent = `${dish.nutrition.proteinas} g`;

    // Sommelier Wine Pairing Section
    const sommelierSection = dishModal.querySelector('.sommelier-section');
    if (dish.maridaje) {
        sommelierSection.style.display = 'block';
        dishModal.querySelector('.sommelier-wine-img').style.backgroundImage = `url('${dish.maridaje.imagen}')`;
        dishModal.querySelector('.sommelier-wine-name').textContent = dish.maridaje.nombre;
        dishModal.querySelector('.sommelier-wine-text').textContent = dish.maridaje.texto;
    } else {
        sommelierSection.style.display = 'none';
    }

    // CROSS-SELLING SECTION
    const crossSellContainer = dishModal.querySelector('.cross-sell-section');
    if (crossSellContainer) {
        // Get recommendations (same category or complementary)
        const recommendations = getRecommendations(dish.id, dish.category);

        if (recommendations.length > 0) {
            crossSellContainer.style.display = 'block';
            const itemsContainer = crossSellContainer.querySelector('.cross-sell-items');
            itemsContainer.innerHTML = '';

            recommendations.forEach(rec => {
                const item = document.createElement('div');
                item.className = 'cross-sell-item';
                item.onclick = () => openDishModal(rec.id);
                item.innerHTML = `
                    <img src="${rec.image}" alt="${rec.name}" onerror="this.style.display='none'">
                    <div class="cross-sell-item-name">${rec.name}</div>
                    <div class="cross-sell-item-price">${rec.price}</div>
                `;
                itemsContainer.appendChild(item);
            });
        } else {
            crossSellContainer.style.display = 'none';
        }
    }

    // Close nutrition accordion by default
    const nutritionAccordion = dishModal.querySelector('.dish-modal-nutrition-accordion');
    if (nutritionAccordion) {
        nutritionAccordion.removeAttribute('open');
    }

    // Show modal with animation
    dishModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scroll

    // GSAP animation
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(dishModal.querySelector('.dish-modal-content'),
            { opacity: 0, scale: 0.9, y: 30 },
            { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power3.out' }
        );
    }
}

// Cross-selling recommendations
function getRecommendations(currentId, currentCategory) {
    // Define complementary pairings (excluding wines - they appear in maridaje)
    const pairings = {
        'classic': ['postres', 'vegan'],
        'vegan': ['postres', 'classic'],
        'postres': ['classic', 'vegan'],
        'wines': ['classic', 'postres'],
        'infantil': ['postres', 'classic']
    };

    // Get items from same category (excluding current) and complementary categories
    const sameCategory = menuData.filter(d => d.category === currentCategory && d.id !== currentId);
    const complementaryCategories = pairings[currentCategory] || [];
    const complementary = menuData.filter(d => complementaryCategories.includes(d.category));

    // Mix and get 4 random recommendations
    const all = [...sameCategory, ...complementary];
    const shuffled = all.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
}

function closeDishModal() {
    if (!dishModal) return;

    if (typeof gsap !== 'undefined') {
        gsap.to(dishModal.querySelector('.dish-modal-content'), {
            opacity: 0, scale: 0.95, y: 20, duration: 0.25, ease: 'power2.in',
            onComplete: () => {
                dishModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    } else {
        dishModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function renderMenu(filter) {
    if (!menuList) return;
    menuList.innerHTML = '';

    // Filter by category first
    let filteredData = menuData.filter(item => {
        if (filter === 'all') return true;
        return item.category === filter;
    });

    // Then filter by allergens (exclude items with any selected allergen)
    if (activeAllergenFilters.size > 0) {
        filteredData = filteredData.filter(item => {
            // Check if item has any of the excluded allergens
            const itemAllergens = item.alergenos || [];
            for (const allergen of activeAllergenFilters) {
                if (itemAllergens.includes(allergen)) {
                    return false; // Exclude this item
                }
            }
            return true; // Keep this item
        });
    }

    filteredData.forEach(item => {
        const li = document.createElement('li');
        li.className = 'menu-item';
        li.dataset.id = item.id; // Add data-id for modal

        // Wine pairing icon (if dish has maridaje)
        const wineIcon = item.maridaje
            ? `<span class="maridaje-icon" data-tooltip="Maridatge suggerit: ${item.maridaje.nombre}">🍷</span>`
            : '';

        li.innerHTML = `
            <div class="menu-item-info">
                <span class="menu-item-name">${item.name}${wineIcon}</span>
                <span class="menu-item-desc">${item.desc}</span>
            </div>
            <span class="menu-item-price">${item.price}</span>
        `;

        // CLICK to open modal
        li.addEventListener('click', () => {
            openDishModal(item.id);
        });

        // Hover Reveal Logic (keep existing)
        li.addEventListener('mouseenter', () => {
            if (revealContainer && item.image) {
                revealContainer.innerHTML = `<div class="reveal-inner" style="background-image: url('${item.image}')"></div>`;
                revealContainer.classList.add('active');
            }
        });

        li.addEventListener('mousemove', (e) => {
            if (revealContainer) {
                const x = e.clientX;
                const y = e.clientY;
                gsap.to(revealContainer, {
                    left: x,
                    top: y,
                    duration: 0.2,
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
                // Send to n8n webhook (PRODUCTION)
                const response = await fetch('https://aissa2026.app.n8n.cloud/webhook/restaurant-subscription', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email })
                });

                if (response.ok) {
                    alert('✅ Gràcies per subscriure\'t! \n\nComprova el teu correu electrònic per obtenir el teu codi de descompte de 10€. 📧');
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

// ============================================
// GIFT CARD MODAL SYSTEM
// ============================================
let giftModal = null;
let selectedGiftAmount = 0;

function createGiftModal() {
    // Check if already exists
    if (document.getElementById('gift-modal')) {
        giftModal = document.getElementById('gift-modal');
        return;
    }

    const modalHTML = `
        <div id="gift-modal" class="gift-modal">
            <div class="gift-modal-backdrop"></div>
            <div class="gift-modal-content">
                <button class="gift-modal-close" aria-label="Tancar">&times;</button>
                
                <div class="gift-modal-header">
                    <span class="gift-icon">🎁</span>
                    <h2>Regala La Cucina di Mamma</h2>
                    <p class="gift-subtitle">Una experiència gastronòmica inoblidable</p>
                </div>

                <div class="gift-modal-body">
                    <!-- Amount Selection -->
                    <div class="gift-section">
                        <label class="gift-label">Selecciona l'import</label>
                        <div class="gift-amounts">
                            <button class="gift-amount-btn" data-amount="50">50€</button>
                            <button class="gift-amount-btn" data-amount="100">100€</button>
                            <button class="gift-amount-btn" data-amount="150">150€</button>
                            <button class="gift-amount-btn custom-amount-btn">Altre</button>
                        </div>
                        <input type="number" class="gift-custom-input" placeholder="Import personalitzat (€)" style="display: none;" min="10" max="500">
                    </div>

                    <!-- Recipient Info -->
                    <div class="gift-section">
                        <label class="gift-label">Dades del destinatari</label>
                        <input type="text" class="gift-input" id="gift-recipient-name" placeholder="Nom del destinatari" required>
                        <input type="email" class="gift-input" id="gift-recipient-email" placeholder="Email del destinatari" required>
                    </div>

                    <!-- Sender Info -->
                    <div class="gift-section">
                        <label class="gift-label">Les teves dades</label>
                        <input type="text" class="gift-input" id="gift-sender-name" placeholder="El teu nom" required>
                        <input type="email" class="gift-input" id="gift-sender-email" placeholder="El teu email" required>
                    </div>

                    <!-- Personal Message -->
                    <div class="gift-section">
                        <label class="gift-label">Missatge personalitzat <span class="optional">(opcional)</span></label>
                        <textarea class="gift-textarea" id="gift-message" placeholder="Escriu un missatge especial..." maxlength="200"></textarea>
                    </div>

                    <!-- Submit -->
                    <button class="gift-submit-btn" disabled>
                        <span class="btn-text">Comprar i Enviar</span>
                        <span class="btn-price"></span>
                    </button>

                    <p class="gift-disclaimer">💳 Pagament segur. La targeta s'enviarà immediatament per email.</p>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    giftModal = document.getElementById('gift-modal');

    // Event Listeners
    giftModal.querySelector('.gift-modal-close').addEventListener('click', closeGiftModal);
    giftModal.querySelector('.gift-modal-backdrop').addEventListener('click', closeGiftModal);

    // Amount buttons
    giftModal.querySelectorAll('.gift-amount-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            giftModal.querySelectorAll('.gift-amount-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const customInput = giftModal.querySelector('.gift-custom-input');

            if (btn.classList.contains('custom-amount-btn')) {
                customInput.style.display = 'block';
                customInput.focus();
                selectedGiftAmount = 0;
            } else {
                customInput.style.display = 'none';
                selectedGiftAmount = parseInt(btn.dataset.amount);
            }
            updateGiftSubmitButton();
        });
    });

    // Custom amount input
    giftModal.querySelector('.gift-custom-input').addEventListener('input', (e) => {
        selectedGiftAmount = parseInt(e.target.value) || 0;
        updateGiftSubmitButton();
    });

    // Form validation
    const inputs = giftModal.querySelectorAll('.gift-input');
    inputs.forEach(input => {
        input.addEventListener('input', updateGiftSubmitButton);
    });

    // Submit button
    giftModal.querySelector('.gift-submit-btn').addEventListener('click', submitGiftCard);

    // ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && giftModal.classList.contains('active')) {
            closeGiftModal();
        }
    });
}

function updateGiftSubmitButton() {
    const btn = giftModal.querySelector('.gift-submit-btn');
    const priceSpan = btn.querySelector('.btn-price');

    const recipientName = giftModal.querySelector('#gift-recipient-name').value.trim();
    const recipientEmail = giftModal.querySelector('#gift-recipient-email').value.trim();
    const senderName = giftModal.querySelector('#gift-sender-name').value.trim();
    const senderEmail = giftModal.querySelector('#gift-sender-email').value.trim();

    const isValid = selectedGiftAmount >= 10 && recipientName && recipientEmail && senderName && senderEmail;

    btn.disabled = !isValid;
    priceSpan.textContent = selectedGiftAmount > 0 ? `— ${selectedGiftAmount}€` : '';
}

function openGiftModal() {
    createGiftModal();

    // Reset form
    selectedGiftAmount = 0;
    giftModal.querySelectorAll('.gift-amount-btn').forEach(b => b.classList.remove('active'));
    giftModal.querySelectorAll('.gift-input, .gift-textarea').forEach(i => i.value = '');
    giftModal.querySelector('.gift-custom-input').style.display = 'none';
    giftModal.querySelector('.gift-custom-input').value = '';
    updateGiftSubmitButton();

    giftModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (typeof gsap !== 'undefined') {
        gsap.fromTo(giftModal.querySelector('.gift-modal-content'),
            { opacity: 0, scale: 0.9, y: 40 },
            { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power3.out' }
        );
    }
}

function closeGiftModal() {
    if (!giftModal) return;

    if (typeof gsap !== 'undefined') {
        gsap.to(giftModal.querySelector('.gift-modal-content'), {
            opacity: 0, scale: 0.95, y: 30, duration: 0.3, ease: 'power2.in',
            onComplete: () => {
                giftModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    } else {
        giftModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function submitGiftCard() {
    const data = {
        amount: selectedGiftAmount,
        recipientName: giftModal.querySelector('#gift-recipient-name').value.trim(),
        recipientEmail: giftModal.querySelector('#gift-recipient-email').value.trim(),
        senderName: giftModal.querySelector('#gift-sender-name').value.trim(),
        senderEmail: giftModal.querySelector('#gift-sender-email').value.trim(),
        message: giftModal.querySelector('#gift-message').value.trim(),
        timestamp: new Date().toISOString()
    };

    console.log('🎁 Gift Card Purchase:', data);

    const btn = giftModal.querySelector('.gift-submit-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '⏳ Enviant...';
    btn.disabled = true;

    // POST to n8n webhook (PRODUCTION)
    fetch('https://aissa2026.app.n8n.cloud/webhook/webhook/comprar-regalo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                btn.innerHTML = '✅ Enviat!';
                btn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';

                setTimeout(() => {
                    closeGiftModal();
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.background = '';
                        btn.disabled = false;
                    }, 500);
                }, 1500);
            } else {
                throw new Error('Error del servidor');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            btn.innerHTML = '❌ Error - Torna-ho a provar';
            btn.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
            btn.disabled = false;

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, 3000);
        });
}

// Initialize gift button listener
document.addEventListener('DOMContentLoaded', () => {
    // Add click listener for gift buttons
    document.querySelectorAll('.gift-btn, [data-action="gift"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openGiftModal();
        });
    });
});

console.log('✅ Gift Card system loaded');

// ============================================
// AI CONCIERGE CHAT WIDGET
// ============================================

const AIConcierge = (() => {
    // DOM Elements
    const widget = document.getElementById('ai-chat-widget');
    const trigger = document.getElementById('ai-chat-trigger');
    const chatWindow = document.getElementById('ai-chat-window');
    const closeBtn = document.getElementById('ai-chat-close');
    const messagesContainer = document.getElementById('ai-chat-messages');
    const typingIndicator = document.getElementById('ai-chat-typing');
    const inputField = document.getElementById('ai-chat-input');
    const sendBtn = document.getElementById('ai-chat-send');
    const badge = document.querySelector('.ai-chat-badge');

    if (!widget || !trigger) return null;

    // Configuration
    const CONFIG = {
        // IMPORTANT: Replace with your actual n8n webhook URL
        webhookUrl: 'https://aissa2026.app.n8n.cloud/webhook/webhook/chat-concierge',
        sessionId: generateSessionId(),
        welcomeMessage: getWelcomeMessage()
    };

    let isOpen = false;
    let isFirstOpen = true;

    // Generate unique session ID
    function generateSessionId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // Get welcome message based on language
    function getWelcomeMessage() {
        const lang = document.documentElement.lang || 'ca';
        const messages = {
            'ca': 'Hola! Sóc Antonieta, la teva concierge virtual 👩‍🍳 Em pots preguntar sobre el menú, fer una reserva o qualsevol altra cosa. Com et puc ajudar avui?',
            'es': '¡Hola! Soy Antonieta, tu concierge virtual 👩‍🍳 Puedes preguntarme sobre el menú, hacer una reserva o cualquier otra cosa. ¿Cómo puedo ayudarte hoy?',
            'en': 'Hello! I\'m Antonieta, your virtual concierge 👩‍🍳 You can ask me about the menu, make a reservation, or anything else. How can I help you today?',
            'it': 'Ciao! Sono Antonieta, la tua concierge virtuale 👩‍🍳 Puoi chiedermi del menù, fare una prenotazione o qualsiasi altra cosa. Come posso aiutarti oggi?'
        };
        return messages[lang] || messages['ca'];
    }

    // Initialize with GSAP animation
    function init() {
        // Show trigger button after scroll
        gsap.set(trigger, { opacity: 0, scale: 0.8, y: 20 });

        ScrollTrigger.create({
            start: 'top -200',
            onEnter: () => {
                trigger.classList.add('visible');
                gsap.to(trigger, {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.6,
                    ease: 'back.out(1.7)'
                });
            },
            onLeaveBack: () => {
                if (!isOpen) {
                    trigger.classList.remove('visible');
                    gsap.to(trigger, {
                        opacity: 0,
                        scale: 0.8,
                        y: 20,
                        duration: 0.4,
                        ease: 'power2.in'
                    });
                }
            }
        });

        // Event listeners
        trigger.addEventListener('click', toggleChat);
        closeBtn.addEventListener('click', closeChat);
        sendBtn.addEventListener('click', sendMessage);
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Magnetic effect for cursor
        if (typeof cursor !== 'undefined' && cursor) {
            trigger.addEventListener('mouseenter', () => {
                gsap.to(cursor, { scale: 2.5, opacity: 0.4 });
            });
            trigger.addEventListener('mouseleave', () => {
                gsap.to(cursor, { scale: 1, opacity: 1 });
            });
        }
    }

    // Toggle chat window
    function toggleChat() {
        isOpen ? closeChat() : openChat();
    }

    // Open chat
    function openChat() {
        isOpen = true;
        chatWindow.classList.add('open');
        inputField.focus();
        hideBadge();

        // Show welcome message on first open
        if (isFirstOpen) {
            isFirstOpen = false;
            setTimeout(() => {
                addMessage(CONFIG.welcomeMessage, 'bot');
            }, 500);
        }
    }

    // Close chat
    function closeChat() {
        isOpen = false;
        chatWindow.classList.remove('open');
    }

    // Hide notification badge
    function hideBadge() {
        if (badge) {
            badge.style.display = 'none';
        }
    }

    // Add message to chat
    function addMessage(text, sender) {
        const messageEl = document.createElement('div');
        messageEl.className = `ai-message ${sender}`;
        messageEl.textContent = text;
        messagesContainer.appendChild(messageEl);
        scrollToBottom();
    }

    // Scroll to bottom of messages
    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Show typing indicator
    function showTyping() {
        typingIndicator.classList.add('visible');
        scrollToBottom();
    }

    // Hide typing indicator
    function hideTyping() {
        typingIndicator.classList.remove('visible');
    }

    // Send message
    async function sendMessage() {
        const text = inputField.value.trim();
        if (!text) return;

        // User message
        addMessage(text, 'user');
        inputField.value = '';
        showTyping();

        try {
            // Send to n8n webhook
            const response = await fetch(CONFIG.webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: CONFIG.sessionId,
                    message: text,
                    language: document.documentElement.lang || 'ca'
                })
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            const botMessage = data.output || "Em sap greu, estic tenint problemes de connexió. Si us plau, truca'ns directament.";

            hideTyping();
            addMessage(botMessage, 'bot');

        } catch (error) {
            addMessage(errorMessages[lang] || errorMessages['ca'], 'bot');
        }

        sendBtn.disabled = false;
        inputField.focus();
    }

    // Initialize
    init();

    // Public API
    return {
        open: openChat,
        close: closeChat,
        toggle: toggleChat,
        addMessage: addMessage
    };
})();

console.log('✅ AI Concierge Chat loaded');

// ============================================
// PROMO COUNTDOWN BANNER
// ============================================

const PromoBanner = (() => {
    const banner = document.getElementById('promo-banner');
    const countdown = document.getElementById('promo-countdown');
    const closeBtn = document.getElementById('promo-close');

    if (!banner || !countdown) return null;

    const STORAGE_KEY = 'promo_banner_closed';
    const PROMO_DURATION_HOURS = 24; // Promo duration

    // Check if user closed the banner today
    function wasClosedToday() {
        const closedDate = localStorage.getItem(STORAGE_KEY);
        if (!closedDate) return false;

        const closedTime = new Date(closedDate);
        const now = new Date();
        const hoursDiff = (now - closedTime) / (1000 * 60 * 60);

        return hoursDiff < 24; // Show again after 24h
    }

    // Get end time (end of today or custom)
    function getEndTime() {
        const stored = localStorage.getItem('promo_end_time');
        if (stored) {
            const endTime = new Date(stored);
            if (endTime > new Date()) return endTime;
        }

        // Set new end time (end of today at 23:59:59)
        const endTime = new Date();
        endTime.setHours(23, 59, 59, 999);
        localStorage.setItem('promo_end_time', endTime.toISOString());
        return endTime;
    }

    // Update countdown
    function updateCountdown() {
        const endTime = getEndTime();
        const now = new Date();
        const diff = endTime - now;

        if (diff <= 0) {
            countdown.textContent = '00:00:00';
            // Reset for next day
            localStorage.removeItem('promo_end_time');
            return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        countdown.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    // Show banner
    function show() {
        if (wasClosedToday()) return;

        setTimeout(() => {
            banner.classList.add('visible');
            document.body.classList.add('promo-active');
        }, 1500); // Delay after page load

        // Start countdown
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // Close banner
    function close() {
        banner.classList.remove('visible');
        document.body.classList.remove('promo-active');
        localStorage.setItem(STORAGE_KEY, new Date().toISOString());

        setTimeout(() => {
            banner.classList.add('hidden');
        }, 500);
    }

    // Event listeners
    if (closeBtn) {
        closeBtn.addEventListener('click', close);
    }

    // Initialize
    show();

    return { show, close };
})();

console.log('✅ Promo Banner loaded');
