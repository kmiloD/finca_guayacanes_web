document.addEventListener("DOMContentLoaded", () => {
  if (!window.gsap || !window.ScrollTrigger) return console.error("GSAP no cargó.");
  gsap.registerPlugin(ScrollTrigger);

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) gsap.globalTimeline.timeScale(100);

  /* Videos: cargan al acercarse y se pausan al salir */
  const play = v => {
    if (!v.getAttribute("src") && v.dataset.src) v.src = v.dataset.src;
    v.play()?.catch(() => {});
  };
  const io = new IntersectionObserver(es => es.forEach(e => {
    const v = e.target;
    if (e.isIntersecting) play(v); else if (!v.closest(".layers")) v.pause();
  }), { rootMargin: "300px" });
  $$("video[data-src]:not(.layers video)").forEach(v => io.observe(v));

  /* Barra de progreso y encabezado */
  gsap.to("#progress", { scaleX: 1, ease: "none",
    scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });

  const bar = $("#bar"), menu = $("#menu"), burger = $("#burger");
  ScrollTrigger.create({ start: 0, end: "max", onUpdate: s => {
    bar.classList.toggle("solid", s.scroll() > 40);
    bar.classList.toggle("hide", s.direction === 1 && s.scroll() > 240 && !menu.classList.contains("open"));
  }});

  const setMenu = open => {
    menu.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
    burger.textContent = open ? "Cerrar" : "Menú";
  };
  burger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));

  /* Hero: una sola entrada orquestada + parallax */
  gsap.from(".hero .ln > span", { yPercent: 110, duration: 1.3, stagger: 0.14, ease: "power4.out", delay: 0.2 });
  gsap.from(".hero .fade", { autoAlpha: 0, y: 20, duration: 1, stagger: 0.12, delay: 1, ease: "power3.out" });
  gsap.to(".hero-video", { scale: 1.18, yPercent: 10, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

  /* Intro: las palabras se encienden al leer */
  const m = $("#manifesto");
  m.innerHTML = m.textContent.trim().split(/\s+/).map(w => `<span>${w}</span>`).join(" ");
  gsap.fromTo("#manifesto span", { opacity: 0.16 }, { opacity: 1, stagger: 0.1, ease: "none",
    scrollTrigger: { trigger: m, start: "top 80%", end: "bottom 50%", scrub: true } });

  /* Recorrido por capítulos */
  const scenes = [
    { name: "Territorio", kick: "El territorio", title: "Todo comienza<br>en este lugar.",
      text: "Jardín, Antioquia: un territorio de montañas, agua y cultura cafetera." },
    { name: "Cafetal", kick: "El cafetal", title: "Entre montañas<br>crece el café.",
      text: "Cada planta hace parte de un paisaje construido con tiempo, cuidado y conocimiento del territorio." },
    { name: "Fruto", kick: "El fruto", title: "Todo el cuidado<br>termina en un fruto.",
      text: "Detrás de cada cereza hay un proceso que comienza mucho antes de la cosecha." },
    { name: "Proceso", kick: "El proceso", title: "El café continúa<br>su recorrido.",
      text: "Cosecha, selección y transformación: cada etapa construye el carácter de un café nacido en Guayacanes." }
  ];
  const n = scenes.length, layers = $$(".layers video"), rail = $("#rail");
  let cur = -1, tl;

  const buttons = scenes.map((s, i) => {
    const b = document.createElement("button");
    b.type = "button"; b.textContent = s.name;
    b.addEventListener("click", () => goTo(i));
    rail.appendChild(b);
    return b;
  });

  function show(i) {
    if (i === cur) return;
    cur = i;
    const s = scenes[i];
    layers.forEach((v, k) => {
      v.classList.toggle("on", k === i);
      if (k === i || k === i + 1) play(v); else v.pause();
    });
    buttons.forEach((b, k) => b.setAttribute("aria-current", k === i));
    tl?.kill();
    tl = gsap.timeline()
      .to(".copy > *", { autoAlpha: 0, y: -14, duration: 0.2, stagger: 0.03 })
      .add(() => {
        $("#sKick").textContent = s.kick;
        $("#sTitle").innerHTML = s.title;
        $("#sText").textContent = s.text;
        $("#sNum").textContent = "0" + (i + 1);
      })
      .fromTo(".copy > *", { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" });
  }

  const st = ScrollTrigger.create({
    trigger: ".story", start: "top top", end: "+=350%", pin: ".stage",
    snap: { snapTo: 1 / (n - 1), duration: { min: 0.2, max: 0.6 }, delay: 0.08 },
    onUpdate: s => show(Math.round(s.progress * (n - 1)))
  });
  show(0);

  function goTo(i) {
    const y = st.start + (i / (n - 1)) * (st.end - st.start);
    scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
  }
  addEventListener("keydown", e => {
    if (!st.isActive) return;
    if (e.key === "ArrowRight" && cur < n - 1) goTo(cur + 1);
    if (e.key === "ArrowLeft" && cur > 0) goTo(cur - 1);
  });

  /* Mapa: se abre como una ventana al hacer scroll */
  gsap.to("#mapFrame", { clipPath: "inset(0% 0% 0% 0%)", ease: "none",
    scrollTrigger: { trigger: "#mapFrame", start: "top 85%", end: "top 25%", scrub: true } });

  /* Galería: scroll horizontal solo en pantallas grandes */
  gsap.matchMedia().add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
    const track = $(".track");
    gsap.to(track, { x: () => -(track.scrollWidth - innerWidth), ease: "none",
      scrollTrigger: { trigger: ".gallery", start: "top top", pin: true, scrub: 1,
        end: () => "+=" + (track.scrollWidth - innerWidth), invalidateOnRefresh: true } });
  });

  /* Entrada del cierre */
  gsap.from(".closing-copy > *", { autoAlpha: 0, y: 40, duration: 1, stagger: 0.1, ease: "power3.out",
    scrollTrigger: { trigger: ".closing", start: "top 60%", once: true } });

  /* Navegación: enlace activo según la sección visible */
  const links = $$(".menu a");
  links.forEach(a => {
    const id = a.getAttribute("href").slice(1);
    const el = document.getElementById(id);
    ScrollTrigger.create({ trigger: el, start: "top 55%", end: "bottom 55%",
      onToggle: s => s.isActive && links.forEach(l => l.classList.toggle("on", l === a)) });
    a.addEventListener("click", e => {
      e.preventDefault();
      setMenu(false);
      const y = id === "recorrido" ? st.start : el.getBoundingClientRect().top + scrollY;
      scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
    });
  });
  $$('a[href="#inicio"]:not(.menu a)').forEach(a => a.addEventListener("click", e => {
    e.preventDefault(); scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }));

  addEventListener("load", () => ScrollTrigger.refresh());
});
