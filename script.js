// --- 1. OCULTAR SPLASH SCREEN ---
window.addEventListener('load', () => {
    setTimeout(() => {
        const intro = document.getElementById('intro-screen');
        if (intro) intro.classList.add('hidden');
    }, 1800);
});

// --- 2. MENÚ MÓVIL Y SPOTLIGHT ---
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');
const spotlight = document.getElementById('spotlight');

if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

window.addEventListener('mousemove', (e) => {
    if (spotlight) {
        spotlight.style.left = `${e.clientX}px`;
        spotlight.style.top = `${e.clientY}px`;
    }
});

// --- 3. CONFIGURACIÓN DE CONTACTO ---
const LINK_TELEGRAM = "https://t.me/dev_tamayo";

// --- 4. TRADUCCIONES MULTI-IDIOMA ---
const translations = {
    es: {
        navHome: "Inicio",
        navServices: "Servicios",
        navContact: "Contacto",
        btnHireNav: "Contactar",
        heroTitle: "Creación y Configuración Profesional de Servidores de Discord",
        heroDesc: "Estructuras personalizadas, permisos avanzados, bots de moderación, diseño de roles e integración para comunidades de streaming, gaming y Roleplay.",
        btnServices: "Ver Servicios y Precios",
        titleServices: "Servicios y Paquetes",
        titleContact: "¿Quieres unirte al equipo o necesitas atención personal?",
        descContact: "Atendemos consultas, contrataciones y postulaciones para el equipo exclusivamente a través de nuestro grupo y canal oficial de Telegram."
    },
    en: {
        navHome: "Home",
        navServices: "Services",
        navContact: "Contact",
        btnHireNav: "Contact Us",
        heroTitle: "Professional Discord Server Creation & Setup",
        heroDesc: "Custom structures, advanced permissions, moderation bots, role design, and integrations for streaming, gaming, and Roleplay communities.",
        btnServices: "View Services & Pricing",
        titleServices: "Services & Packages",
        titleContact: "Want to join our team or need custom support?",
        descContact: "We handle inquiries, hiring, and team applications exclusively through our official Telegram channel and group."
    },
    pt: {
        navHome: "Início",
        navServices: "Serviços",
        navContact: "Contato",
        btnHireNav: "Contatar",
        heroTitle: "Criação e Configuração Profissional de Servidores do Discord",
        heroDesc: "Estruturas personalizadas, permissões avançadas, bots de moderação, design de cargos e integração para comunidades de streaming, gaming e Roleplay.",
        btnServices: "Ver Serviços e Preços",
        titleServices: "Serviços e Pacotes",
        titleContact: "Quer se juntar à equipe ou precisa de atendimento personalizado?",
        descContact: "Atendemos dúvidas, contratações e candidaturas para a equipe exclusivamente através do nosso canal e grupo oficial do Telegram."
    }
};

document.getElementById('lang-select').addEventListener('change', function(e) {
    const lang = e.target.value;
    const t = translations[lang];

    document.getElementById('navHome').innerText = t.navHome;
    document.getElementById('navServices').innerText = t.navServices;
    document.getElementById('navContact').innerText = t.navContact;
    document.getElementById('btn-hire-nav').innerHTML = `<i class="fa-brands fa-telegram"></i> ${t.btnHireNav}`;
    document.getElementById('hero-title').innerText = t.heroTitle;
    document.getElementById('hero-desc').innerText = t.heroDesc;
    document.getElementById('btn-services-hero').innerHTML = `${t.btnServices} <i class="fa-solid fa-arrow-right"></i>`;
    document.getElementById('title-services').innerText = t.titleServices;
    document.getElementById('title-contact').innerText = t.titleContact;
    document.getElementById('desc-contact').innerText = t.descContact;
});

// --- 5. CONVERSIÓN DE DIVISAS INTERNACIONALES ---
let divisaLocal = "COP";       
let tasaCambioActual = 1;      
let formatoLocales = "es-CO"; 

async function inicializarPreciosInternacionales() {
    try {
        const geoResponse = await fetch('https://ipapi.co/json/');
        const geoData = await geoResponse.json();
        if (geoData && geoData.currency) {
            divisaLocal = geoData.currency;
            formatoLocales = navigator.language || 'es-CO';
        }
    } catch (e) {
        console.log("Error leyendo IP, usando COP por defecto.");
    }

    if (divisaLocal === "USD") {
        document.querySelectorAll('.price-converted').forEach(el => el.innerText = "");
        return;
    }

    try {
        const rateResponse = await fetch(`https://open.er-api.com/v6/latest/USD`);
        const rateData = await rateResponse.json();
        if (rateData && rateData.rates && rateData.rates[divisaLocal]) {
            tasaCambioActual = rateData.rates[divisaLocal];
            actualizarPreciosEnPantalla();
        }
    } catch (error) {
        console.log("Error al consultar divisas:", error);
    }
}

function actualizarPreciosEnPantalla() {
    const elementosPrecio = document.querySelectorAll('.price[data-usd]');
    elementosPrecio.forEach(elem => {
        const precioUSD = parseFloat(elem.getAttribute('data-usd'));
        const precioConvertido = precioUSD * tasaCambioActual;
        const precioFormateado = new Intl.NumberFormat(formatoLocales, {
            style: 'currency',
            currency: divisaLocal,
            maximumFractionDigits: 0
        }).format(precioConvertido);

        const spanConvertido = elem.querySelector('.price-converted');
        if (spanConvertido) {
            spanConvertido.innerText = `/ ~${precioFormateado}`;
        }
    });
}

// --- 6. REDIRECCIÓN A TELEGRAM ---
function irATelegram(servicio, precioUSD) {
    window.open(LINK_TELEGRAM, '_blank');
}

document.addEventListener('DOMContentLoaded', inicializarPreciosInternacionales);
