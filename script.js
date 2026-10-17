function animarLetras(elementId, atrasoEntreLetras = 80) {
  const elemento = document.getElementById(elementId);
  if (!elemento) return;

  const texto = elemento.textContent;
  elemento.textContent = "";

  texto.split("").forEach((letra, index) => {
    const span = document.createElement("span");
    span.className = "letter";
    span.textContent = letra;
    span.style.animationDelay = `${index * atrasoEntreLetras}ms`;
    elemento.appendChild(span);
  });
}

function initBackground3D() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 400;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


  const count = 500;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 1200;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  // cria uma textura circular suave (em vez do quadrado padrão) para cada partícula
  function criarTexturaCircular() {
    const tamanho = 64;
    const canvasTex = document.createElement("canvas");
    canvasTex.width = tamanho;
    canvasTex.height = tamanho;
    const ctx = canvasTex.getContext("2d");

    const gradiente = ctx.createRadialGradient(
      tamanho / 2, tamanho / 2, 0,
      tamanho / 2, tamanho / 2, tamanho / 2
    );
    gradiente.addColorStop(0, "rgba(255,255,255,1)");
    gradiente.addColorStop(0.5, "rgba(255,255,255,0.9)");
    gradiente.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = gradiente;
    ctx.fillRect(0, 0, tamanho, tamanho);

    return new THREE.CanvasTexture(canvasTex);
  }

  const material = new THREE.PointsMaterial({
    color: 0xb829f7,
    size: 3.5,
    map: criarTexturaCircular(),
    sizeAttenuation: false,
    transparent: true,
    opacity: 1,
    blending: THREE.AdditiveBlending
  });

  window.__particulasMaterial = material;
  if (window.__aplicarTemaParticulas) window.__aplicarTemaParticulas();
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);


  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
  });


  function animate() {
    requestAnimationFrame(animate);

    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    camera.position.x = targetX * 0.5;
    camera.position.y = -targetY * 0.5;
    camera.lookAt(scene.position);

    particles.rotation.y += 0.001;
    particles.rotation.x += 0.0005;

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function dividirLetrasLaterais(elemento, atrasoEntreLetras = 60) {
  const texto = elemento.textContent;
  elemento.textContent = "";

  texto.split("").forEach((letra, index) => {
    const span = document.createElement("span");
    span.className = "side-letter";
    span.textContent = letra === " " ? " " : letra;
    span.style.animationDelay = `${index * atrasoEntreLetras}ms`;
    elemento.appendChild(span);
  });
}

function prepararLetrasLaterais(className = "side-text", atrasoEntreLetras = 60) {
  const elementos = document.querySelectorAll("." + className);
  elementos.forEach((elemento) => dividirLetrasLaterais(elemento, atrasoEntreLetras));
}

function observarEntradaLateral() {
  const labels = document.querySelectorAll(".side-label");
  if (!labels.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  labels.forEach((label) => observer.observe(label));
}

function observarEntradaSecao(sectionId) {
  const secao = document.getElementById(sectionId);
  if (!secao) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        secao.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(secao);
}

function observarProjetos() {
  const grid = document.querySelector(".projects-grid");
  if (!grid) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        grid.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(grid);
}

function observarBarrasSkills() {
  const lista = document.querySelector(".skills-list");
  if (!lista) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        lista.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(lista);
}

function iniciarFundoComRetentativa(tentativasRestantes = 20, intervaloMs = 250) {
  if (typeof THREE !== "undefined") {
    try {
      initBackground3D();
    } catch (erro) {
      console.warn("Fundo com partículas não pôde ser iniciado:", erro);
    }
    return;
  }

  if (tentativasRestantes <= 0) {
    console.warn("Three.js não carregou a tempo; fundo com partículas desativado.");
    return;
  }

  setTimeout(() => iniciarFundoComRetentativa(tentativasRestantes - 1, intervaloMs), intervaloMs);
}


/* ===== TRADUÇÃO PT <-> EN ===== */
const traducoesEN = {
  status: "AVAILABLE",
  cv: "RESUME",
  nav_sobre: "01 ABOUT ME",
  nav_skills: "02 SKILLS",
  nav_projetos: "03 PROJECTS",
  nav_contato: "04 CONTACT",
  role: "DEVELOPER",
  scroll: "SCROLL DOWN",
  side_sobre: "PERSONAL PORTFOLIO",
  title_sobre: "ABOUT ME",
  big_sobre_1: "ABOUT",
  big_sobre_2: "ME",
  bio1: 'I am 17 years old and a second-year technical student in Computer Science at COTEMIG, focused on building modern interfaces with HTML5 and CSS, object-oriented programming with Java and C#, and database management with MySQL, always trying to understand not only the "how" but also the "why" behind every solution.',
  bio2: "I also have hands-on experience in maintaining, diagnosing and assembling computers and cell phones, combining a software and hardware point of view. This combination gives me a more complete perspective on how systems work from end to end.",
  bio3: "My experience in customer service gave me assertive communication, emotional intelligence under pressure and a strong aptitude for teamwork, always looking to solve problems quickly and keep a good relationship with the person on the other side.",
  bio4: "I spent a month immersed in the United States, which improved my English fluency and my view of different ways of working and communicating. I am motivated, proactive and always looking to grow in the IT market, seeking new challenges and learning, eager to get my hands dirty on real projects.",
  side_skills: "SKILLS",
  title_skills: "SKILLS",
  big_skills_1: "MY",
  big_skills_2: "SKILLS",
  skill_manut: "Computer maintenance",
  soft_title: "SOFT SKILLS",
  soft1: "ENGLISH - INTERMEDIATE",
  soft2: "FAST LEARNER",
  soft3: "VERBAL & WRITTEN COMMUNICATION",
  soft4: "PROACTIVITY",
  soft5: "LOGICAL REASONING",
  side_projetos: "PROJECTS",
  title_projetos: "PROJECTS",
  big_proj_1: "MY",
  big_proj_2: "PROJECTS",
  title_contato: "CONTACT",
  big_cont_1: "GET IN",
  big_cont_2: "TOUCH",
  ph_nome: "Name:",
  ph_email: "Email:",
  ph_msg: "Type your message...",
  enviar: "SEND",
  fale: "// TALK TO ME",
  fale_txt: "Let's talk about projects, opportunities<br>or any idea you have in mind.<br>I'm always open to new connections.",
  redes: "MY SOCIALS:",
  f_tag: "PERSONAL PORTFOLIO // 2026",
  f_nav: "// NAVIGATION",
  f_sobre: "ABOUT ME",
  f_skills: "SKILLS",
  f_proj: "PROJECTS",
  f_cont: "CONTACT",
  f_contato: "// CONTACT",
  f_bottom: "© 2026 ISAQUE CARDOSO — ALL RIGHTS RESERVED"
};

let idiomaAtual = "pt";

function guardarTextosOriginais() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.dataset.pt = el.classList.contains("side-text") ? el.textContent : el.innerHTML;
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.dataset.ptPlaceholder = el.getAttribute("placeholder");
  });
}

function aplicarIdioma(idioma) {
  idiomaAtual = idioma;
  const ingles = idioma === "en";

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const texto = ingles ? traducoesEN[el.dataset.i18n] : el.dataset.pt;
    if (texto === undefined) return;
    if (el.classList.contains("side-text")) {
      el.textContent = texto;
      dividirLetrasLaterais(el, 60);
    } else {
      el.innerHTML = texto;
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.setAttribute("placeholder", ingles ? traducoesEN[el.dataset.i18nPlaceholder] : el.dataset.ptPlaceholder);
  });

  document.documentElement.lang = ingles ? "en" : "pt-br";
  document.title = ingles ? "My Portfolio" : "Meu Portfólio";

  const botao = document.getElementById("btnLang");
  if (botao) {
    const rotulo = botao.querySelector(".lang-label");
    if (rotulo) rotulo.textContent = ingles ? "EN" : "PT";
    const dica = ingles ? "Traduzir para português" : "Translate to English";
    botao.setAttribute("title", dica);
    botao.setAttribute("aria-label", dica);
  }

  try { localStorage.setItem("idioma", idioma); } catch (e) {}
}

function iniciarTraducao() {
  guardarTextosOriginais();

  const botao = document.getElementById("btnLang");
  if (botao) {
    botao.addEventListener("click", () => {
      aplicarIdioma(idiomaAtual === "pt" ? "en" : "pt");
    });
  }

  let salvo = null;
  try { salvo = localStorage.getItem("idioma"); } catch (e) {}
  if (salvo === "en") aplicarIdioma("en");
}

document.addEventListener("DOMContentLoaded", () => {
  animarLetras("nameIsaque", 80);
  prepararLetrasLaterais("side-text", 60);
  observarEntradaLateral();
  observarEntradaSecao("sobre");
  observarEntradaSecao("skills");
  observarEntradaSecao("projetos");
  observarEntradaSecao("contato");
  observarBarrasSkills();
  observarProjetos();
  iniciarTraducao();

  iniciarFundoComRetentativa();
});


/* ===== MODO CLARO ===== */
function iniciarTema() {
  const raiz = document.documentElement;
  const botao = document.getElementById("btnTema");

  window.__aplicarTemaParticulas = function () {
    const m = window.__particulasMaterial;
    if (!m || typeof THREE === "undefined") return;
    const claro = raiz.getAttribute("data-theme") === "light";
    m.blending = claro ? THREE.NormalBlending : THREE.AdditiveBlending;
    m.opacity = 1;
    m.size = claro ? 4.5 : 3.5;
    m.color.set(claro ? 0x7a0fd0 : 0xb829f7);
    m.needsUpdate = true;
  };

  function atualizarBotao() {
    const claro = raiz.getAttribute("data-theme") === "light";
    if (!botao) return;
    const rotulo = claro ? "Modo escuro" : "Modo claro";
    botao.title = rotulo;
    botao.setAttribute("aria-label", rotulo);
  }

  if (botao) {
    botao.addEventListener("click", function () {
      const claro = raiz.getAttribute("data-theme") === "light";
      if (claro) raiz.removeAttribute("data-theme");
      else raiz.setAttribute("data-theme", "light");
      try { localStorage.setItem("tema", claro ? "escuro" : "claro"); } catch (e) {}
      atualizarBotao();
      window.__aplicarTemaParticulas();
    });
  }
  atualizarBotao();
  window.__aplicarTemaParticulas();
}
document.addEventListener("DOMContentLoaded", iniciarTema);


/* ===== FORMULÁRIO DE CONTATO (Web3Forms) ===== */
// Cole aqui a chave (access key) que o Web3Forms mandou para o seu e-mail:
const WEB3FORMS_KEY = "26a26bee-ec43-494c-b953-bdf0f8c17ee9";

function iniciarFormulario() {
  const form = document.getElementById("formContato");
  const status = document.getElementById("statusContato");
  if (!form || !status) return;
  const botao = form.querySelector(".contact-submit");

  const msgs = {
    pt: { vazio: "Preencha todos os campos.", email: "Digite um e-mail válido.", enviando: "Enviando...", ok: "Mensagem enviada! Obrigado pelo contato.", erro: "Não foi possível enviar. Tente novamente.", config: "Formulário ainda não configurado (falta a chave)." },
    en: { vazio: "Please fill in all fields.", email: "Enter a valid email.", enviando: "Sending...", ok: "Message sent! Thanks for reaching out.", erro: "Could not send. Please try again.", config: "Form not configured yet (missing key)." }
  };
  const t = () => (document.documentElement.lang || "").toLowerCase().startsWith("en") ? msgs.en : msgs.pt;
  const mostrar = (texto, erro) => { status.textContent = texto; status.classList.toggle("erro", !!erro); };

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const dados = new FormData(form);
    if (dados.get("botcheck")) return;
    const nome = (dados.get("name") || "").toString().trim();
    const email = (dados.get("email") || "").toString().trim();
    const msg = (dados.get("message") || "").toString().trim();

    form.querySelectorAll(".contact-input, .contact-textarea").forEach(el => el.classList.remove("invalido"));
    if (!nome || !email || !msg) {
      form.querySelectorAll(".contact-input, .contact-textarea").forEach(el => { if (!el.value.trim()) el.classList.add("invalido"); });
      return mostrar(t().vazio, true);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      form.querySelector('input[name="email"]').classList.add("invalido");
      return mostrar(t().email, true);
    }
    if (WEB3FORMS_KEY === "COLE_SUA_CHAVE_AQUI") return mostrar(t().config, true);

    botao.disabled = true;
    mostrar(t().enviando, false);
    try {
      const resp = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: "Nova mensagem do portfólio - " + nome,
          from_name: "Portfólio Isaque Cardoso",
          name: nome, email: email, message: msg
        })
      });
      const json = await resp.json();
      if (resp.ok && json.success) { mostrar(t().ok, false); form.reset(); }
      else mostrar(t().erro, true);
    } catch (err) {
      mostrar(t().erro, true);
    } finally {
      botao.disabled = false;
    }
  });
}
document.addEventListener("DOMContentLoaded", iniciarFormulario);