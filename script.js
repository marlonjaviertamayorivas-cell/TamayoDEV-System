// --- CONFIGURACIÓN OAUTH2 DE DISCORD ---
// Reemplaza 'TU_CLIENT_ID' con el ID de tu aplicación en Discord Developer Portal
const DISCORD_CLIENT_ID = '1510455961763188946'; 
const REDIRECT_URI = encodeURIComponent(window.location.origin + window.location.pathname);
const DISCORD_AUTH_URL = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=identify`;

let isAuthenticated = false;
const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('musicToggle');
const musicIcon = document.getElementById('musicIcon');

// 1. SECUENCIA INICIAL DE CARGA -> LOBBY
window.addEventListener('load', () => {
    // Detectar si Discord devolvió el token de acceso tras la redirección
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = fragment.get('access_token');
    
    if (accessToken) {
        isAuthenticated = true;
        fetch('https://discord.com/api/users/@me', {
            headers: { authorization: `Bearer ${accessToken}` }
        })
        .then(res => res.json())
        .then(data => {
            if (data.username) {
                const navUserLabel = document.getElementById('nav-user-label');
                if (navUserLabel) navUserLabel.innerText = data.username;
                document.getElementById('guest-warning')?.classList.add('hidden');
            }
        }).catch(err => console.log(err));
    }

    setTimeout(() => {
        const intro = document.getElementById('intro-screen');
        const lobby = document.getElementById('lobby-screen');
        if (intro) intro.classList.add('hidden');
        if (lobby && !accessToken) lobby.classList.remove('hidden'); // Si ya logueó, salta el lobby
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

// 3. REDIRECCIÓN REAL A DISCORD OAUTH2
function iniciarSesionDiscord() {
    window.location.href = DISCORD_AUTH_URL;
}

document.getElementById('btn-lobby-login')?.addEventListener('click', iniciarSesionDiscord);
document.getElementById('btn-discord-login-nav')?.addEventListener('click', iniciarSesionDiscord);

document.getElementById('btn-lobby-guest')?.addEventListener('click', () => {
    document.getElementById('guest-warning')?.classList.remove('hidden');
    cerrarLobby();
});

// 4. BLOQUEO / PERMISO DE ACCESO A SERVIDORES
function interactuarServicio(nombreServicio) {
    if (!isAuthenticated) {
        alert("🔒 Debes iniciar sesión con tu cuenta de Discord para solicitar o contratar " + nombreServicio);
        document.getElementById('lobby-screen')?.classList.remove('hidden');
    } else {
        window.open('https://discord.gg/TU_INVITACION', '_blank');
    }
}

// Bloqueo para invitados en el botón principal de comunidad
document.querySelectorAll('.btn-require-auth').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (!isAuthenticated && !btn.href.includes('discord.gg/TU_INVITACION')) {
            // Permitir abrir si es invitado pero con advertencia
        }
    });
});

// 5. TRADUCCIONES MULTI-IDIOMA COMPLETAS
const translations = {
    es: {
        lblLobbyAudio: "La experiencia suena mejor con audio.",
        lblSoundOn: "Entrar con sonido",
        lblSoundOff: "Entrar sin sonido",
        lblAccessTitle: "ACCESO A LA PLATAFORMA",
        lblLobbyLogin: "Iniciar Sesión con Discord",
        lblLobbyGuest: "Entrar como Invitado",
        navHome: "HOME",
        navServices: "SERVICIOS",
        navDiscord: "DISCORD",
        navLogin: "LOGIN",
        heroBadge: "Arquitectura de Servidores & Web Dev",
        heroTitle: "CREACIÓN DE SERVIDORES DE DISCORD & DESARROLLO WEB",
        heroDesc: "Especialistas en la configuración avanzada de servidores de Discord, jerarquía de roles estilizados, bots interactivos e interfaces web de alto rendimiento.",
        heroBtnExplore: "Explorar Servidor Oficial",
        heroBtnPlans: "Ver Servicios & Planes",
        servicesTitle: "NUESTROS SERVICIOS",
        servicesSub: "Soluciones avanzadas para comunidades exclusivas y proyectos exigentes.",
        pkg1Title: "Setup Discord Básico / Roleplay",
        pkg1i1: "Roles con tipografía cursiva/estilizada",
        pkg1i2: "Canales estructurados (`║ Emoji ・ Nombre`)",
        pkg1i3: "Permisos de seguridad y anti-raids",
        pkg1i4: "Integración de bots públicos principales",
        badgeRec: "RECOMENDADO",
        pkg2Title: "Pack VIP: Discord PRO + Web",
        pkg2i1: "Servidor de Discord full personalizado",
        pkg2i2: "Landing Page Web con chispas de fuego",
        pkg2i3: "Autenticación de usuarios vía Discord",
        pkg2i4: "Reproductor de música (TAMAYO FM) & SFX",
        pkg3Title: "Bots a Medida & Sistemas Web",
        pkg3Price: "Cotización Personalizada",
        pkg3i1: "Bots de Discord programados a medida",
        pkg3i2: "Paneles de control y bases de datos",
        pkg3i3: "Vinculación Web-Discord personalizada",
        pkg3i4: "Soporte prioritario post-entrega",
        btnHireText: "Contratar en Discord",
        btnQuoteText: "Solicitar Cotización",
        commTitle: "COMUNIDAD OFICIAL DE DISCORD",
        commDesc: "El centro principal para realizar tus pedidos, recibir soporte técnico, ver los avances de desarrollo y conectar con otros creadores.",
        btnJoinText: "Entrar al Servidor de Discord",
        warnGuestText: "Debes iniciar sesión con Discord en la web para habilitar el acceso directo.",
        footerText: "© 2026 TamayoDev. Todos los derechos reservados. Especialistas en Discord & Web Development."
    },
    en: {
        lblLobbyAudio: "The experience sounds better with audio.",
        lblSoundOn: "Enter with sound",
        lblSoundOff: "Enter muted",
        lblAccessTitle: "PLATFORM ACCESS",
        lblLobbyLogin: "Log in with Discord",
        lblLobbyGuest: "Enter as Guest",
        navHome: "HOME",
        navServices: "SERVICES",
        navDiscord: "DISCORD",
        navLogin: "LOGIN",
        heroBadge: "Server Architecture & Web Dev",
        heroTitle: "DISCORD SERVER CREATION & WEB DEVELOPMENT",
        heroDesc: "Specialists in advanced Discord server configuration, stylized role hierarchies, interactive bots, and high-performance web interfaces.",
        heroBtnExplore: "Explore Official Server",
        heroBtnPlans: "View Services & Plans",
        servicesTitle: "OUR SERVICES",
        servicesSub: "Advanced solutions for exclusive communities and demanding projects.",
        pkg1Title: "Basic Discord Setup / Roleplay",
        pkg1i1: "Roles with cursive/styled typography",
        pkg1i2: "Structured channels (`║ Emoji ・ Name`)",
        pkg1i3: "Security permissions and anti-raids",
        pkg1i4: "Integration of main public bots",
        badgeRec: "RECOMMENDED",
        pkg2Title: "VIP Pack: Discord PRO + Web",
        pkg2i1: "Fully customized Discord server",
        pkg2i2: "Web Landing Page with fire sparks",
        pkg2i3: "User authentication via Discord",
        pkg2i4: "Music player (TAMAYO FM) & SFX",
        pkg3Title: "Custom Bots & Web Systems",
        pkg3Price: "Custom Quote",
        pkg3i1: "Custom-programmed Discord bots",
        pkg3i2: "Control panels and databases",
        pkg3i3: "Custom Web-Discord linkage",
        pkg3i4: "Priority post-delivery support",
        btnHireText: "Hire on Discord",
        btnQuoteText: "Request Quote",
        commTitle: "OFFICIAL DISCORD COMMUNITY",
        commDesc: "The main hub to place your orders, get technical support, see development progress, and connect with other creators.",
        btnJoinText: "Join Discord Server",
        warnGuestText: "You must log in with Discord on the web to enable direct access.",
        footerText: "© 2026 TamayoDev. All rights reserved. Discord & Web Development Specialists."
    },
    pt: {
        lblLobbyAudio: "A experiência soa melhor com áudio.",
        lblSoundOn: "Entrar com som",
        lblSoundOff: "Entrar sem som",
        lblAccessTitle: "ACESSO À PLATAFORMA",
        lblLobbyLogin: "Entrar com o Discord",
        lblLobbyGuest: "Entrar como Convidado",
        navHome: "INÍCIO",
        navServices: "SERVIÇOS",
        navDiscord: "DISCORD",
        navLogin: "ENTRAR",
        heroBadge: "Arquitetura de Servidores & Web Dev",
        heroTitle: "CRIAÇÃO DE SERVIDORES DO DISCORD & DESENVOLVIMENTO WEB",
        heroDesc: "Especialistas em configuração avançada de servidores do Discord, hierarquia de cargos estilizados, bots interativos e interfaces web de alto desempenho.",
        heroBtnExplore: "Explorar Servidor Oficial",
        heroBtnPlans: "Ver Serviços & Planos",
        servicesTitle: "NOSSOS SERVIÇOS",
        servicesSub: "Soluções avançadas para comunidades exclusivas e projetos exigentes.",
        pkg1Title: "Setup Discord Básico / Roleplay",
        pkg1i1: "Cargos com tipografia cursiva/estilizada",
        pkg1i2: "Canais estruturados (`║ Emoji ・ Nome`)",
        pkg1i3: "Permissões de segurança e anti-raids",
        pkg1i4: "Integração dos principais bots públicos",
        badgeRec: "RECOMENDADO",
        pkg2Title: "Pack VIP: Discord PRO + Web",
        pkg2i1: "Servidor do Discord totalmente personalizado",
        pkg2i2: "Landing Page Web com faíscas de fogo",
        pkg2i3: "Autenticação de usuários via Discord",
        pkg2i4: "Reprodutor de música (TAMAYO FM) & SFX",
        pkg3Title: "Bots Sob Medida & Sistemas Web",
        pkg3Price: "Orçamento Personalizado",
        pkg3i1: "Bots do Discord programados sob medida",
        pkg3i2: "Painéis de controle e bancos de dados",
        pkg3i3: "Vinculação Web-Discord personalizada",
        pkg3i4: "Suporte prioritário pós-entrega",
        btnHireText: "Contratar no Discord",
        btnQuoteText: "Solicitar Orçamento",
        commTitle: "COMUNIDADE OFICIAL DO DISCORD",
        commDesc: "O principal hub para fazer seus pedidos, receber suporte técnico, ver o progresso do desenvolvimento e se conectar com outros criadores.",
        btnJoinText: "Entrar no Servidor do Discord",
        warnGuestText: "Você deve fazer login com o Discord na web para habilitar o acesso direto.",
        footerText: "© 2026 TamayoDev. Todos os direitos reservados. Especialistas em Discord & Web Development."
    }
};

document.getElementById('lang-select').addEventListener('change', function(e) {
    const lang = e.target.value;
    const t = translations[lang];

    document.getElementById('lbl-lobby-audio').innerText = t.lblLobbyAudio;
    document.getElementById('lbl-sound-on').innerText = t.lblSoundOn;
    document.getElementById('lbl-sound-off').innerText = t.lblSoundOff;
    document.getElementById('lbl-access-title').innerText = t.lblAccessTitle;
    document.getElementById('lbl-lobby-login').innerText = t.lblLobbyLogin;
    document.getElementById('lbl-lobby-guest').innerText = t.lblLobbyGuest;
    document.getElementById('nav-home').innerHTML = `<i class="fa-solid fa-house"></i> ${t.navHome}`;
    document.getElementById('nav-services').innerHTML = `<i class="fa-solid fa-server"></i> ${t.navServices}`;
    document.getElementById('nav-discord').innerHTML = `<i class="fa-brands fa-discord"></i> ${t.navDiscord}`;
    if(!isAuthenticated) document.getElementById('nav-user-label').innerText = t.navLogin;
    
    document.getElementById('hero-badge').innerHTML = `<i class="fa-solid fa-fire"></i> ${t.heroBadge}`;
    document.getElementById('hero-title').innerText = t.heroTitle;
    document.getElementById('hero-desc').innerText = t.heroDesc;
    document.getElementById('hero-btn-explore').innerHTML = `<i class="fa-brands fa-discord"></i> ${t.heroBtnExplore}`;
    document.getElementById('hero-btn-plans').innerHTML = `<i class="fa-solid fa-bolt"></i> ${t.heroBtnPlans}`;
    
    document.getElementById('services-title').innerText = t.servicesTitle;
    document.getElementById('services-sub').innerText = t.servicesSub;
    
    document.getElementById('pkg1-title').innerText = t.pkg1Title;
    document.getElementById('pkg1-i1').innerText = t.pkg1i1;
    document.getElementById('pkg1-i2').innerText = t.pkg1i2;
    document.getElementById('pkg1-i3').innerText = t.pkg1i3;
    document.getElementById('pkg1-i4').innerText = t.pkg1i4;
    document.getElementById('btn-hire-1').innerText = t.btnHireText;
    
    document.getElementById('badge-rec').innerText = t.badgeRec;
    document.getElementById('pkg2-title').innerText = t.pkg2Title;
    document.getElementById('pkg2-i1').innerText = t.pkg2i1;
    document.getElementById('pkg2-i2').innerText = t.pkg2i2;
    document.getElementById('pkg2-i3').innerText = t.pkg2i3;
    document.getElementById('pkg2-i4').innerText = t.pkg2i4;
    document.getElementById('btn-hire-2').innerText = t.btnHireText;
    
    document.getElementById('pkg3-title').innerText = t.pkg3Title;
    document.getElementById('pkg3-price').innerText = t.pkg3Price;
    document.getElementById('pkg3-i1').innerText = t.pkg3i1;
    document.getElementById('pkg3-i2').innerText = t.pkg3i2;
    document.getElementById('pkg3-i3').innerText = t.pkg3i3;
    document.getElementById('pkg3-i4').innerText = t.pkg3i4;
    document.getElementById('btn-hire-3').innerText = t.btnQuoteText;
    
    document.getElementById('comm-title').innerText = t.commTitle;
    document.getElementById('comm-desc').innerText = t.commDesc;
    document.getElementById('btn-join-text').innerText = t.btnJoinText;
    document.getElementById('warn-guest-text').innerText = t.warnGuestText;
    document.getElementById('footer-text').innerText = t.footerText;
});

// 6. MOTOR DE PARTÍCULAS DE CHISPAS DE FUEGO
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

// 7. CONTROL DEL REPRODUCTOR DE MÚSICA
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

// 8. EFECTO DE SONIDO SFX AL HACER CLIC
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

// 9. SPOTLIGHT DE CURSOR
const spotlight = document.getElementById('spotlight');
window.addEventListener('mousemove', (e) => {
    if (spotlight) {
        spotlight.style.left = `${e.clientX}px`;
        spotlight.style.top = `${e.clientY}px`;
    }
});

// 10. DETECCIÓN DE MONEDA LOCAL E IP
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
document.addEventListener('DOMContentLoaded', inicializarPreciosInternacionales);