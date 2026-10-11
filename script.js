// --- ESTADO GLOBAL Y LOBBY CONTROLLER ---
let isAuthenticated = false;
const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('musicToggle');
const musicIcon = document.getElementById('musicIcon');

// 1. SECUENCIA INICIAL DE CARGA -> LOBBY
window.addEventListener('load', () => {
    setTimeout(() => {
        const intro = document.getElementById('intro-screen');
        const lobby = document.getElementById('lobby-screen');
        if (intro) intro.classList.add('hidden');
        if (lobby) lobby.classList.remove('hidden');
    }, 1500);
});

// 2. ACCIONES DEL LOBBY DE ENTRADA
document.getElementById('btn-enter-sound')?.addEventListener('click', () => {
    if (bgMusic) {
        bgMusic.play().then(() => {
            musicToggle?.classList.add('playing');
            if (musicIcon) {
                musicIcon.classList.remove('fa-play');
                musicIcon.classList.add('fa-pause');
            }
        }).catch(e => console.log("Audio block:", e));
    }
    cerrarLobby();
});

document.getElementById('btn-enter-mute')?.addEventListener('click', () => {
    cerrarLobby();
});

function cerrarLobby() {
    document.getElementById('lobby-screen')?.classList.add('hidden');
}

// 3. AUTENTICACIÓN SIMULADA DE DISCORD
function iniciarSesionDiscord() {
    isAuthenticated = true;
    const mockUser = "Tamayo_Dev";
    
    // Actualizamos interfaz
    const navUserLabel = document.getElementById('nav-user-label');
    if (navUserLabel) navUserLabel.innerText = mockUser;
    
    document.getElementById('guest-warning')?.classList.add('hidden');
    
    alert("¡Sesión iniciada con éxito mediante Discord! Acceso total concedido.");
    cerrarLobby();
}

document.getElementById('btn-lobby-login')?.addEventListener('click', iniciarSesionDiscord);
document.getElementById('btn-discord-login-nav')?.addEventListener('click', iniciarSesionDiscord);

document.getElementById('btn-lobby-guest')?.addEventListener('click', () => {
    document.getElementById('guest-warning')?.classList.remove('hidden');
    cerrarLobby();
});

// 4. BLOQUEO DE BOTONES PARA INVITADOS SIN DISCORD
function interactuarServicio(nombreServicio) {
    if (!isAuthenticated) {
        alert("🔒 Debes iniciar sesión con tu cuenta de Discord para solicitar o contratar " + nombreServicio);
        document.getElementById('lobby-screen')?.classList.remove('hidden');
    } else {
        window.open('https://discord.gg/f5CVXqsHnb', '_blank');
    }
}

// 5. MOTOR DE PARTÍCULAS DE CHISPAS DE FUEGO
const canvas = document.getElementById('fire-particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 50;
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() * -3) - 1;
        this.size = Math.random() * 2.5 + 0.5;
        this.alpha = Math.random() * 0.8 + 0.2;
        this.fadeRate = Math.random() * 0.01 + 0.003;
        const colors = ['#5865F2', '#FF4500', '#FFD700', '#FF3300'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.fadeRate;
        if (this.alpha <= 0 || this.y < -10) this.reset();
    }
    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
}

function initParticles() {
    for (let i = 0; i < 120; i++) particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
}
initParticles();
animateParticles();

// 6. CONTROL DEL REPRODUCTOR DE MÚSICA
if (musicToggle && bgMusic) {
    musicToggle.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            musicToggle.classList.add('playing');
            musicIcon.classList.remove('fa-play');
            musicIcon.classList.add('fa-pause');
        } else {
            bgMusic.pause();
            musicToggle.classList.remove('playing');
            musicIcon.classList.remove('fa-pause');
            musicIcon.classList.add('fa-play');
        }
    });
}

// 7. EFECTO DE SONIDO SFX AL HACER CLIC
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playClickSound() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(350, audioCtx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.04);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.04);
}
document.querySelectorAll('button, a, select').forEach(el => el.addEventListener('click', playClickSound));

// 8. SPOTLIGHT DE CURSOR
const spotlight = document.getElementById('spotlight');
window.addEventListener('mousemove', (e) => {
    if (spotlight) {
        spotlight.style.left = `${e.clientX}px`;
        spotlight.style.top = `${e.clientY}px`;
    }
});

// 9. DETECCIÓN DE MONEDA LOCAL E IP
let divisaLocal = "COP"; let tasaCambioActual = 1;
async function inicializarPreciosInternacionales() {
    try {
        const geo = await (await fetch('https://ipapi.co/json/')).json();
        if (geo && geo.currency) divisaLocal = geo.currency;
    } catch (e) {}
    if (divisaLocal === "USD") return;
    try {
        const rates = await (await fetch('https://open.er-api.com/v6/latest/USD')).json();
        if (rates && rates.rates && rates.rates[divisaLocal]) {
            tasaCambioActual = rates.rates[divisaLocal];
            document.querySelectorAll('.price[data-usd]').forEach(elem => {
                const usd = parseFloat(elem.getAttribute('data-usd'));
                const localVal = new Intl.NumberFormat('es-CO', { style: 'currency', currency: divisaLocal, maximumFractionDigits: 0 }).format(usd * tasaCambioActual);
                const span = elem.querySelector('.price-converted');
                if (span) span.innerText = `/ ~${localVal}`;
            });
        }
    } catch (e) {}
}
document.addEventListener('DOMContentLoaded', inicializarPreciosInternacionales);if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.log("Service Worker registrado con éxito."))
      .catch((err) => console.log("Error en Service Worker:", err));
  });
}
