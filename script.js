/* =========================================================
   FINCA GUAYACANES
   SCRIPT.JS
   ========================================================= */


/* =========================================================
   1. ESPERAR A QUE CARGUE LA PÁGINA
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* -----------------------------------------------------
       Verificar GSAP
    ----------------------------------------------------- */

    if (typeof gsap === "undefined") {
        console.error("GSAP no está cargado.");
        return;
    }

    if (typeof ScrollTrigger === "undefined") {
        console.error("ScrollTrigger no está cargado.");
        return;
    }


    /* -----------------------------------------------------
       Registrar plugin
    ----------------------------------------------------- */

    gsap.registerPlugin(ScrollTrigger);


    /* =====================================================
       2. ELEMENTOS PRINCIPALES
       ===================================================== */

    const progressBar =
        document.getElementById("progressBar");

    const sceneVideo =
        document.getElementById("sceneVideo");

    const sceneVideoSource =
        document.getElementById("sceneVideoSource");

    const sceneImg =
        document.getElementById("sceneImg");

    const sceneLabel =
        document.getElementById("sceneLabel");

    const storyEyebrow =
        document.getElementById("eyebrow");

    const storyTitle =
        document.getElementById("storyTitle");

    const storyText =
        document.getElementById("storyText");

    const fact1 =
        document.getElementById("fact1");

    const fact2 =
        document.getElementById("fact2");

    const fact3 =
        document.getElementById("fact3");

    const dots =
        document.getElementById("dots");


    /* =====================================================
       3. DATOS DEL RECORRIDO
       =====================================================

       Aquí podremos cambiar posteriormente:

       - videos
       - títulos
       - textos
       - datos
       - etiquetas

    ===================================================== */

    const scenes = [

        {
            label: "01 · TERRITORIO",

            eyebrow: "EL TERRITORIO",

            title: `
                Todo comienza<br>
                en este lugar.
            `,

            text: `
                Jardín, Antioquia:
                un territorio de montañas,
                agua y cultura cafetera.
            `,

            fact1: "Jardín",
            fact2: "Antioquia",
            fact3: "Colombia",

            video: "finca_completa.mp4",

            poster: "cafetal.svg"
        },


        {
            label: "02 · CAFETAL",

            eyebrow: "EL CAFETAL",

            title: `
                Entre montañas<br>
                crece el café.
            `,

            text: `
                Cada planta hace parte de un paisaje
                construido con tiempo, cuidado y
                conocimiento del territorio.
            `,

            fact1: "Café",
            fact2: "Montañoso",
            fact3: "Cultivo",

            video: "cosecha.mp4",

            poster: "cafetal.svg"
        },


        {
            label: "03 · EL FRUTO",

            eyebrow: "EL FRUTO",

            title: `
                Todo el cuidado<br>
                termina en un fruto.
            `,

            text: `
                Detrás de cada cereza hay un proceso
                que comienza mucho antes de la cosecha.
            `,

            fact1: "Cereza",
            fact2: "Cosecha",
            fact3: "Calidad",

            video: "VID_20260806_152429.mp4",

            poster: "fruto.svg"
        },


        {
            label: "04 · EL PROCESO",

            eyebrow: "EL PROCESO",

            title: `
                El café continúa<br>
                su recorrido.
            `,

            text: `
                Cosecha, selección y transformación:
                cada etapa ayuda a construir el carácter
                de un café nacido en Guayacanes.
            `,

            fact1: "Origen",
            fact2: "Proceso",
            fact3: "Café",

            video: "coffee_bean.mp4",

            poster: "proceso.svg"
        }

    ];


    /* =====================================================
       4. CREAR INDICADORES
       ===================================================== */

    if (dots) {

        dots.innerHTML = "";

        scenes.forEach((scene, index) => {

            const dot =
                document.createElement("span");

            if (index === 0) {
                dot.classList.add("active");
            }

            dots.appendChild(dot);

        });

    }


    /* =====================================================
       5. FUNCIÓN PARA CAMBIAR ESCENA
       ===================================================== */

    let currentScene = 0;


    function changeScene(index) {

        if (!scenes[index]) {
            return;
        }


        if (index === currentScene && currentScene !== 0) {
            return;
        }


        currentScene = index;

        const scene = scenes[index];


        /* -------------------------------------------------
           Animación de salida del contenido
        ------------------------------------------------- */

        const elements = [
            storyEyebrow,
            storyTitle,
            storyText,
            fact1,
            fact2,
            fact3,
            sceneLabel
        ];


        gsap.to(elements, {

            opacity: 0,

            y: 18,

            duration: 0.22,

            stagger: 0.02,

            ease: "power2.in",

            onComplete: () => {

                /* -----------------------------------------
                   Cambiar textos
                ----------------------------------------- */

                storyEyebrow.innerHTML =
                    scene.eyebrow;

                storyTitle.innerHTML =
                    scene.title;

                storyText.innerHTML =
                    scene.text;

                fact1.innerHTML =
                    scene.fact1;

                fact2.innerHTML =
                    scene.fact2;

                fact3.innerHTML =
                    scene.fact3;

                sceneLabel.innerHTML =
                    scene.label;


                /* -----------------------------------------
                   Cambiar video
                ----------------------------------------- */

                changeVideo(
                    scene.video,
                    scene.poster
                );


                /* -----------------------------------------
                   Animación de entrada
                ----------------------------------------- */

                gsap.fromTo(

                    elements,

                    {
                        opacity: 0,
                        y: 18
                    },

                    {
                        opacity: 1,
                        y: 0,

                        duration: 0.65,

                        stagger: 0.06,

                        ease:
                            "power3.out"
                    }

                );

            }

        });


        /* -------------------------------------------------
           Actualizar indicadores
        ------------------------------------------------- */

        if (dots) {

            const allDots =
                dots.querySelectorAll("span");

            allDots.forEach((dot, dotIndex) => {

                dot.classList.toggle(
                    "active",
                    dotIndex === index
                );

            });

        }

    }


    /* =====================================================
       6. CAMBIO DE VIDEO
       ===================================================== */

    function changeVideo(videoPath, posterPath) {

        if (!sceneVideo || !sceneVideoSource) {
            return;
        }


        /* -------------------------------------------------
           Evitar recargar el mismo video
        ------------------------------------------------- */

        const currentPath =
            sceneVideoSource.getAttribute("src");


        if (currentPath === videoPath) {

            if (sceneVideo.paused) {

                sceneVideo
                    .play()
                    .catch(() => {});

            }

            return;
        }


        /* -------------------------------------------------
           Preparar cambio
        ------------------------------------------------- */

        sceneVideo.style.opacity = "0";


        sceneVideoSource.src =
            videoPath;


        if (sceneImg && posterPath) {

            sceneImg.src =
                posterPath;

        }


        sceneVideo.load();


        /* -------------------------------------------------
           Cuando el nuevo video esté listo
        ------------------------------------------------- */

        sceneVideo.oncanplay = () => {

            sceneVideo
                .play()
                .catch(() => {});


            gsap.to(sceneVideo, {

                opacity: 1,

                duration: 0.8,

                ease: "power2.out"

            });

        };

    }


    /* =====================================================
       7. ANIMACIÓN DEL RECORRIDO
       ===================================================== */

    const story =
        document.querySelector(".story");


    if (story) {

        ScrollTrigger.create({

            trigger: story,

            start: "top top",

            end: "bottom bottom",

            onUpdate: self => {

                const progress =
                    self.progress;


                /*
                 * Convertimos el progreso del scroll
                 * en una escena.
                 */

                const sceneIndex =
                    Math.min(

                        scenes.length - 1,

                        Math.floor(
                            progress *
                            scenes.length
                        )

                    );


                if (
                    sceneIndex !== currentScene
                ) {

                    changeScene(
                        sceneIndex
                    );

                }

            }

        });

    }


    /* =====================================================
       8. ANIMACIÓN HERO
       ===================================================== */

    const heroCopy =
        document.querySelector(".hero-copy");

    const heroNote =
        document.querySelector(".hero-note");


    if (heroCopy) {

        gsap.fromTo(

            heroCopy.children,

            {
                opacity: 0,
                y: 35
            },

            {
                opacity: 1,
                y: 0,

                duration: 1.2,

                stagger: 0.12,

                delay: 0.25,

                ease:
                    "power3.out"
            }

        );

    }


    if (heroNote) {

        gsap.fromTo(

            heroNote,

            {
                opacity: 0
            },

            {
                opacity: 1,

                duration: 1.5,

                delay: 1,

                ease:
                    "power2.out"
            }

        );

    }


    /* =====================================================
       9. ANIMACIÓN DE INTRO
       ===================================================== */

    const intro =
        document.querySelector(".intro");


    if (intro) {

        gsap.fromTo(

            intro.querySelector(".intro-inner"),

            {
                opacity: 0,
                y: 60
            },

            {
                opacity: 1,
                y: 0,

                duration: 1,

                ease: "power3.out",

                scrollTrigger: {

                    trigger: intro,

                    start: "top 75%",

                    once: true
                }

            }

        );

    }


    /* =====================================================
       10. ANIMACIÓN MAPA
       ===================================================== */

    const mapCard =
        document.querySelector(".map-card");


    if (mapCard) {

        gsap.fromTo(

            mapCard,

            {
                opacity: 0,
                y: 60
            },

            {
                opacity: 1,
                y: 0,

                duration: 1,

                ease: "power3.out",

                scrollTrigger: {

                    trigger:
                        ".map-section",

                    start: "top 75%",

                    once: true
                }

            }

        );

    }


    /* =====================================================
       11. ANIMACIÓN TRANSICIÓN
       ===================================================== */

    const transition =
        document.querySelector(".transition");


    if (transition) {

        const transitionContent =
            transition.querySelector(
                "div:last-child"
            );


        if (transitionContent) {

            gsap.fromTo(

                transitionContent,

                {
                    opacity: 0,
                    y: 50
                },

                {
                    opacity: 1,
                    y: 0,

                    duration: 1,

                    ease: "power3.out",

                    scrollTrigger: {

                        trigger: transition,

                        start: "top 70%",

                        end: "center center",

                        scrub: 1

                    }

                }

            );

        }

    }


    /* =====================================================
       12. GALERÍA
       ===================================================== */

    const galleryFigures =
        document.querySelectorAll(
            ".gallery figure"
        );


    galleryFigures.forEach(
        (figure, index) => {

            gsap.fromTo(

                figure,

                {
                    opacity: 0,
                    y: 60
                },

                {
                    opacity: 1,
                    y: 0,

                    duration: 0.9,

                    delay:
                        index * 0.08,

                    ease:
                        "power3.out",

                    scrollTrigger: {

                        trigger: figure,

                        start: "top 85%",

                        once: true
                    }

                }

            );

        }
    );


    /* =====================================================
       13. CIERRE
       ===================================================== */

    const closingCopy =
        document.querySelector(
            ".closing-copy"
        );


    if (closingCopy) {

        gsap.fromTo(

            closingCopy.children,

            {
                opacity: 0,
                y: 40
            },

            {
                opacity: 1,
                y: 0,

                duration: 1,

                stagger: 0.1,

                ease: "power3.out",

                scrollTrigger: {

                    trigger: ".closing",

                    start: "top 70%",

                    once: true
                }

            }

        );

    }


    /* =====================================================
       14. BARRA DE PROGRESO GENERAL
       ===================================================== */

    function updateProgress() {

        const scrollTop =
            window.scrollY;

        const documentHeight =
            document.documentElement
                .scrollHeight -
            window.innerHeight;


        const progress =
            documentHeight > 0
                ? scrollTop / documentHeight
                : 0;


        if (progressBar) {

            progressBar.style.width =
                `${progress * 100}%`;

        }

    }


    window.addEventListener(
        "scroll",
        updateProgress,
        {
            passive: true
        }
    );


    updateProgress();


    /* =====================================================
       15. VIDEO AUTOPLAY
       ===================================================== */

    const videos =
        document.querySelectorAll(
            "video"
        );


    videos.forEach(video => {

        video.muted = true;

        video.playsInline = true;


        const playVideo =
            () => {

                const promise =
                    video.play();

                if (
                    promise &&
                    typeof promise.catch ===
                    "function"
                ) {

                    promise.catch(() => {});

                }

            };


        playVideo();


        /*
         * Algunos navegadores móviles
         * bloquean autoplay hasta que
         * el elemento entre en pantalla.
         */

        const observer =
            new IntersectionObserver(

                entries => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            playVideo();

                        } else if (
                            video !== sceneVideo
                        ) {

                            video.pause();

                        }

                    });

                },

                {
                    threshold: 0.15
                }

            );


        observer.observe(video);

    });


    /* =====================================================
       16. SMOOTH RESIZE
       ===================================================== */

    let resizeTimer;


    window.addEventListener(
        "resize",
        () => {

            clearTimeout(
                resizeTimer
            );


            resizeTimer =
                setTimeout(() => {

                    ScrollTrigger.refresh();

                }, 250);

        }
    );


    /* =====================================================
       17. REFRESCAR SCROLLTRIGGER
       ===================================================== */

    window.addEventListener(
        "load",
        () => {

            ScrollTrigger.refresh();

            updateProgress();

        }
    );


    /* =====================================================
       18. LOG DE CONFIRMACIÓN
       ===================================================== */

    console.log(
        "Finca Guayacanes — experiencia cargada correctamente."
    );

});