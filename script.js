// Oculta la intro al terminar de cargar la página
window.addEventListener('load', () => {
  setTimeout(() => {
    const intro = document.getElementById('intro-screen');
    if (intro) {
      intro.classList.add('hidden');
    }
  }, 1800); // 1.8 segundos de intro (puedes ajustar el tiempo aquí)
});// CONFIGURA AQUÍ TU NÚMERO DE TELEFONO CON CÓDIGO DE PAÍS (sin el signo +)
const NUMERO_WHATSAPP = "573218747258"; // Reemplaza por tu número real

// DICCIONARIO DE TRADUCCIONES MULTI-IDIOMA
const translations = {
    es: {
        heroTitle: "Creación y Configuración Profesional de Servidores de Discord",
        heroDesc: "Estructuras personalizadas, permisos avanzados, bots de moderación, diseño de roles e integración para comunidades de streaming, gaming y Roleplay.",
        btnServices: "Ver Servicios y Precios",
        btnApply: "Postularse al Equipo",
        titleServices: "Servicios y Paquetes",
        titleContact: "¿Quieres trabajar con nosotros o necesitas atención personal?",
        descContact: "Si deseas formar parte de nuestro equipo de desarrolladores/staff o solicitar una cotización especial, contáctanos directamente a nuestro canal de atención en WhatsApp."
    },
    en: {
        heroTitle: "Professional Discord Server Creation & Setup",
        heroDesc: "Custom structures, advanced permissions, moderation bots, role design, and integrations for streaming, gaming, and Roleplay communities.",
        btnServices: "View Services & Pricing",
        btnApply: "Join Our Team",
        titleServices: "Services & Packages",
        titleContact: "Want to work with us or need custom support?",
        descContact: "If you want to join our developer/staff team or request a special quote, contact us directly via our WhatsApp support channel."
    },
    pt: {
        heroTitle: "Criação e Configuração Profissional de Servidores do Discord",
        heroDesc: "Estruturas personalizadas, permissões avançadas, bots de moderação, design de cargos e integração para comunidades de streaming, gaming e Roleplay.",
        btnServices: "Ver Serviços e Preços",
        btnApply: "Junte-se à Equipe",
        titleServices: "Serviços e Pacotes",
        titleContact: "Quer trabalhar conosco ou precisa de atendimento personalizado?",
        descContact: "Se você deseja fazer parte da nossa equipe de desenvolvedores/staff ou solicitar um orçamento especial, entre em contato diretamente pelo nosso WhatsApp."
    }
};

// CAMBIO DE IDIOMA EN TIEMPO REAL
document.getElementById('lang-select').addEventListener('change', function(e) {
    const lang = e.target.value;
    document.getElementById('hero-title').innerText = translations[lang].heroTitle;
    document.getElementById('hero-desc').innerText = translations[lang].heroDesc;
    document.getElementById('btn-services-hero').innerText = translations[lang].btnServices;
    document.getElementById('btn-apply-hero').innerText = translations[lang].btnApply;
    document.getElementById('title-services').innerText = translations[lang].titleServices;
    document.getElementById('title-contact').innerText = translations[lang].titleContact;
    document.getElementById('desc-contact').innerText = translations[lang].descContact;
});

// VARIABLES GLOBALES PARA CONVERSIÓN DE DIVISAS INTERNACIONALES
let divisaLocal = "COP";       // Moneda por defecto
let tasaCambioActual = 1;     // Tasa respecto al USD
let formatoLocales = "es-CO"; // Formato regional

// FUNCIÓN: DETECTAR UBICACIÓN Y OBTENER TASA DE CAMBIO EN VIVO
async function inicializarPreciosInternacionales() {
    try {
        // 1. Detectar moneda del usuario por IP
        const geoResponse = await fetch('https://ipapi.co/json/');
        const geoData = await geoResponse.json();

        if (geoData && geoData.currency) {
            divisaLocal = geoData.currency;
            formatoLocales = navigator.language || 'es-CO';
        }
    } catch (e) {
        console.log("No se pudo obtener la IP del usuario, usando divisa por defecto (COP)");
    }

    // Si el usuario está en un país con USD, no requiere conversión
    if (divisaLocal === "USD") {
        document.querySelectorAll('.price-converted').forEach(el => el.innerText = "");
        return;
    }

    try {
        // 2. Consultar tasa de cambio internacional desde USD
        const rateResponse = await fetch(`https://open.er-api.com/v6/latest/USD`);
        const rateData = await rateResponse.json();

        if (rateData && rateData.rates && rateData.rates[divisaLocal]) {
            tasaCambioActual = rateData.rates[divisaLocal];
            actualizarPreciosEnPantalla();
        } else {
            divisaLocal = "COP";
            tasaCambioActual = rateData.rates["COP"] || 4000;
            actualizarPreciosEnPantalla();
        }
    } catch (error) {
        console.log("Error al consultar la API de divisas:", error);
    }
}

// MOSTRAR PRECIOS CALCULADOS EN PANTALLA
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

// REDIRECCIÓN DIRECTA A WHATSAPP PARA CONTRATAR UN PLAN
function pagarServicio(servicio, precioUSD) {
    let mensaje = "";

    if (precioUSD > 0) {
        if (divisaLocal !== "USD" && tasaCambioActual !== 1) {
            const precioConvertido = precioUSD * tasaCambioActual;
            const precioFormateado = new Intl.NumberFormat(formatoLocales, {
                style: 'currency',
                currency: divisaLocal,
                maximumFractionDigits: 0
            }).format(precioConvertido);

            mensaje = encodeURIComponent(`¡Hola Marlon! 👋 Estoy interesado en contratar el servicio de: *${servicio}* ($${precioUSD} USD / ~${precioFormateado}). ¿Cómo podemos iniciar?`);
        } else {
            mensaje = encodeURIComponent(`¡Hola Marlon! 👋 Estoy interesado en contratar el servicio de: *${servicio}* ($${precioUSD} USD). ¿Cómo podemos iniciar?`);
        }
    } else {
        mensaje = encodeURIComponent(`¡Hola Marlon! 👋 Quisiera solicitar una consulta o cotización especial para un proyecto.`);
    }

    window.open(`https://wa.me/${573218747258}?text=${mensaje}`, '_blank');
}

// REDIRECCIÓN DIRECTA A WHATSAPP PARA POSTULARSE COMO STAFF / EQUIPO
function postularseWhatsApp() {
    const mensaje = encodeURIComponent(`¡Hola Marlon! 👋 Me gustaría postularme para trabajar con ustedes en TamayoDev (Configurador, Programador o Staff). ¿Cuáles son los requisitos?`);
    window.open(`https://wa.me/${573218747258}?text=${mensaje}`, '_blank');
}

// Cargar la conversión de divisas al abrir la página
document.addEventListener('DOMContentLoaded', inicializarPreciosInternacionales);