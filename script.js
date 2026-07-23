document.addEventListener("DOMContentLoaded", function () {
  // === EMAILJS ===
  emailjs.init("QmeDwbnnX-cd0FPQr");

  // === BOOT SCREEN ===
  const bootScreen = document.getElementById("boot-screen");
  const bootLinesEl = document.getElementById("boot-lines");
  const bootLines = [
    "$ ssh luiz@infra",
    "conectando... ok",
    "carregando perfil...",
    "sobre.service       [ OK ]",
    "skills.service      [ OK ]",
    "projetos.service    [ OK ]",
    "contato.service     [ OK ]",
    "",
    "bem-vindo(a)."
  ];

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !bootScreen) {
    if (bootScreen) bootScreen.classList.add("hidden");
  } else {
    let i = 0;
    const interval = setInterval(() => {
      if (i < bootLines.length) {
        bootLinesEl.textContent += bootLines[i] + "\n";
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => bootScreen.classList.add("hidden"), 350);
      }
    }, 140);
  }

  // === TYPED HERO LINE (no external lib, simple loop) ===
  const typedEl = document.getElementById("typed-line");
  const typedStrings = [
    "estudante de  Análise e Desenvolvimento de Sistemas",
    "aprendendo redes",
    "praticando banco de dados"
  ];
  if (typedEl) {
    let strIndex = 0, charIndex = 0, deleting = false;
    function tick() {
      const current = typedStrings[strIndex];
      if (!deleting) {
        charIndex++;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, 1300);
          return;
        }
      } else {
        charIndex--;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          strIndex = (strIndex + 1) % typedStrings.length;
        }
      }
      setTimeout(tick, deleting ? 45 : 85);
    }
    tick();
  }

  // === SESSION UPTIME COUNTER ===
  const uptimeEl = document.getElementById("session-uptime");
  if (uptimeEl) {
    const start = Date.now();
    setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const h = String(Math.floor(elapsed / 3600)).padStart(2, "0");
      const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
      const s = String(elapsed % 60).padStart(2, "0");
      uptimeEl.textContent = `${h}:${m}:${s}`;
    }, 1000);
  }

  // === TRACEROUTE NAV: scroll spy + fake ping ms + click to scroll ===
  const traceItems = document.querySelectorAll("#tracenav-list li");
  const mobileLinks = document.querySelectorAll(".mobile-menu a");
  const sections = ["sobre", "skills", "projetos", "contato"]
    .map(id => document.getElementById(id))
    .filter(Boolean);

  function setActive(id) {
    traceItems.forEach(li => li.classList.toggle("is-active", li.dataset.target === id));
  }

  traceItems.forEach(li => {
    const msEl = li.querySelector(".ms");
    if (msEl) msEl.textContent = (8 + Math.floor(Math.random() * 30)) + "ms";
    li.addEventListener("click", () => {
      const target = document.getElementById(li.dataset.target);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });

  if ("IntersectionObserver" in window && sections.length) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    sections.forEach(sec => observer.observe(sec));
  }

  // === MOBILE MENU ===
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
    });
    mobileLinks.forEach(link => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // === ANO ATUAL ===
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // === BOTÃO VOLTAR AO TOPO ===
  const backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      backToTop.classList.toggle("hidden", window.scrollY < 300);
    });
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // === FORMULÁRIO DE CONTATO ===
  const form = document.getElementById("contact-form");
  const message = document.querySelector(".form-message");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      let valid = true;
      const inputs = form.querySelectorAll("input, textarea");
      inputs.forEach(input => {
        const error = input.parentElement.querySelector(".error");
        if (!input.value.trim()) {
          error.textContent = "Campo obrigatório.";
          valid = false;
        } else if (input.type === "email" && !/\S+@\S+\.\S+/.test(input.value)) {
          error.textContent = "E-mail inválido.";
          valid = false;
        } else {
          error.textContent = "";
        }
      });

      if (valid) {
        const templateParams = {
          from_name: document.getElementById("nome").value,
          from_email: document.getElementById("email").value,
          message: document.getElementById("mensagem").value,
        };

        emailjs.send("service_cp6b9op", "template_wzm1n3q", templateParams)
          .then(() => {
            message.textContent = "Enviado com sucesso! Cheque seu e-mail.";
            message.style.color = "#57c785";
            form.reset();
            setTimeout(() => message.textContent = "", 5000);
          }, (error) => {
            message.textContent = "Erro ao enviar. Tente novamente.";
            message.style.color = "#e8697a";
            console.error("Erro EmailJS:", error);
          });
      }
    });
  }
});
