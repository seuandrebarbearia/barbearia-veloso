const config = window.barbeariaConfig || {};
let closeLightbox = () => {};

const openWhatsApp = (serviceName) => {
  const baseMessage = "Olá! Vim pelo site da Barbearia Velos e gostaria de consultar um horário";
  const normalizedName = serviceName && serviceName !== "general" ? serviceName : "";
  const message = normalizedName
    ? `${baseMessage} para ${normalizedName}.`
    : `${baseMessage}.`;

  return `${config.whatsappBaseUrl || "https://wa.me/5549999521602?text="}${encodeURIComponent(message)}`;
};

const renderServices = () => {
  const serviceCards = document.querySelectorAll("[data-service-card]");
  const info = config.services || [];

  serviceCards.forEach((card, index) => {
    const service = info[index] || {
      name: "Serviço",
      description: "Atendimento personalizado.",
      price: 0,
      note: "serviço"
    };

    const title = card.querySelector("h3");
    const description = card.querySelector("p");
    const price = card.querySelector("strong");
    const action = card.querySelector(".whatsapp-link");

    if (title) title.textContent = service.name;
    if (description) description.textContent = service.description;
    if (price) price.textContent = `R$ ${Number(service.price).toFixed(2).replace(".", ",")}`;
    if (action) action.dataset.messageType = service.note;
    if (action) action.href = openWhatsApp(service.note);
  });

  const pricingNote = document.getElementById("pricingNote");
  if (pricingNote) {
    pricingNote.textContent = config.demoMode
      ? "Preços ilustrativos para demonstração. Confirme os valores com a barbearia."
      : "Preços confirmados pela barbearia. Consulte o atendimento antes de agendar.";
  }
};

const updateWhatsAppLinks = () => {
  document.querySelectorAll(".whatsapp-link").forEach((button) => {
    const serviceName = button.dataset.messageType || "";
    button.href = openWhatsApp(serviceName);
  });
};

const setupNavigation = () => {
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.getElementById("mobileMenu");

  if (!menuToggle || !mobileMenu) return;

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    mobileMenu.hidden = isOpen;
  });

  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    mobileMenu.hidden = true;
  };

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      closeLightbox();
    }
  });

  if (header) {
    const navLinks = document.querySelectorAll('.main-nav a, .mobile-menu a[href^="#"]');
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        closeMenu();
      });
    });
  }
};

const setupGallery = () => {
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const closeButton = document.querySelector(".lightbox-close");

  if (!lightbox || !lightboxImage || !lightboxTitle) return;

  const openLightbox = (src, caption) => {
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    lightboxImage.src = src;
    lightboxImage.alt = caption;
    lightboxTitle.textContent = caption;
    const firstFocusable = closeButton;
    if (firstFocusable) firstFocusable.focus();
  };

  closeLightbox = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
    lightboxImage.alt = "";
  };

  document.querySelectorAll(".gallery-item").forEach((item) => {
    item.addEventListener("click", () => {
      openLightbox(item.dataset.image, item.dataset.caption || "Imagem ilustrativa");
    });
  });

  closeButton.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target.dataset.close === "true") {
      closeLightbox();
    }
  });

  window.closeLightbox = closeLightbox;
};

const setupHours = () => {
  const statusElement = document.getElementById("hoursStatus");
  if (!statusElement) return;

  const localeDate = new Date();
  const brazillianDate = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(localeDate);

  const dayMap = new Map(
    brazillianDate.filter((part) => part.type === "weekday").map((part) => ["weekday", part.value])
  );

  const weekDayName = brazillianDate.find((part) => part.type === "weekday")?.value;
  const todayIndex = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"].indexOf(weekDayName?.toLowerCase().slice(0, 3) || "dom");

  document.querySelectorAll("[data-day]").forEach((row) => {
    const rowDay = Number(row.dataset.day);
    if (todayIndex === rowDay) row.classList.add("is-today");
  });

  const nowMinutes = (() => {
    const now = new Date();
    const brazilTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
    return brazilTime.getHours() * 60 + brazilTime.getMinutes();
  })();

  const schedule = config.hours || [];
  const businessDay = schedule[todayIndex] || schedule[0];

  if (!businessDay || businessDay.open === null) {
    statusElement.textContent = "Fora do horário informado";
    statusElement.classList.add("closed");
    return;
  }

  const [openHour, openMinute] = businessDay.open.split(":" ).map(Number);
  const [closeHour, closeMinute] = businessDay.close.split(":").map(Number);
  const openMinutes = openHour * 60 + openMinute;
  const closeMinutes = closeHour * 60 + closeMinute;

  const isOpen = nowMinutes >= openMinutes && nowMinutes < closeMinutes;

  statusElement.textContent = isOpen ? "Dentro do horário informado" : "Fora do horário informado";
  if (!isOpen) statusElement.classList.add("closed");
};

const setupRevealAnimations = () => {
  const revealItems = document.querySelectorAll(".reveal");
  if (!revealItems.length) return;

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    revealItems.forEach((item) => observer.observe(item));
    return;
  }

  revealItems.forEach((item) => item.classList.add("is-visible"));
};

const setupFooter = () => {
  const yearLabel = document.getElementById("year");
  if (yearLabel) yearLabel.textContent = new Date().getFullYear();
};

document.addEventListener("DOMContentLoaded", () => {
  renderServices();
  updateWhatsAppLinks();
  setupNavigation();
  setupGallery();
  setupHours();
  setupRevealAnimations();
  setupFooter();
});
