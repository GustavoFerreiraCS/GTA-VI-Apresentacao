const menu = document.getElementById("menu");
const blocos = document.querySelectorAll(".aparecer");
const video = document.querySelector(".video-capa");
const capa = document.querySelector(".capa");
const capaConteudo = document.querySelector(".capa-conteudo");
const capaBarra = document.querySelector(".capa-barra");

if (menu) {
    window.addEventListener("scroll", function () {
        if (window.scrollY > 50) {
            menu.classList.add("menu-rolado");
        } else {
            menu.classList.remove("menu-rolado");
        }
    });
}

if (blocos.length) {
    const observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
            if (entrada.isIntersecting) {
                entrada.target.classList.add("visivel");
            }
        });
    });

    blocos.forEach(function (bloco) {
        observador.observe(bloco);
    });
}

if (window.gsap && window.ScrollTrigger && video && capa) {
    gsap.registerPlugin(ScrollTrigger);

    const DISTANCIA_PIN = 2200;
    const MARGEM_FINAL = 0.05;

    video.muted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "true");
    video.removeAttribute("autoplay");
    video.removeAttribute("loop");
    video.loop = false;
    video.pause();
    video.currentTime = 0;
    video.style.opacity = "1";

    const estado = { tempo: 0 };
    let duracao = 0;
    let liberado = false;

    const ativarFallback = function () {
        capa.style.background = "linear-gradient(180deg, rgba(13, 13, 26, 0.15), rgba(13, 13, 26, 0.7)), url('assets/gta-box-art.jpeg') center / cover no-repeat, #0d0d1a";
        video.style.display = "none";
    };

    video.addEventListener("error", ativarFallback);
    video.addEventListener("loadeddata", function () {
        video.style.opacity = "1";
    });

    const aplicarTempo = function () {
        if (!duracao || video.readyState < 1) {
            return;
        }

        if (Math.abs(video.currentTime - estado.tempo) > 0.02) {
            video.currentTime = estado.tempo;
        }
    };

    video.addEventListener("play", function () {
        if (!liberado) {
            video.pause();
            aplicarTempo();
        }
    });

    const guardarDuracao = function () {
        if (video.duration && Number.isFinite(video.duration)) {
            duracao = video.duration;
            ScrollTrigger.refresh();
        }
    };

    if (video.readyState >= 1) {
        guardarDuracao();
    } else {
        video.addEventListener("loadedmetadata", guardarDuracao, { once: true });
    }

    const prepararVideo = function () {
        liberado = true;
        const playPromise = video.play();

        const parar = function () {
            liberado = false;
            video.pause();
            aplicarTempo();
        };

        if (playPromise && typeof playPromise.then === "function") {
            playPromise.then(parar).catch(function () {
                liberado = false;
            });
        } else {
            parar();
        }
    };

    window.addEventListener("pointerdown", prepararVideo, { once: true });
    window.addEventListener("touchstart", prepararVideo, { once: true });

    const elementosCapa = [capaConteudo, capaBarra].filter(Boolean);

    gsap.timeline({
        scrollTrigger: {
            trigger: capa,
            start: "top top",
            end: "+=" + DISTANCIA_PIN,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
            onUpdate: function () {
                if (!duracao || video.readyState < 1) {
                    return;
                }
                if (video.currentTime !== estado.tempo) {
                    aplicarTempo();
                }
            }
        }
    })
        .set(video, { autoAlpha: 1, display: "block", opacity: 1 })
        .to(elementosCapa, {
            autoAlpha: 0,
            y: -24,
            scale: 0.96,
            duration: 0.3,
            ease: "power2.out"
        }, 0)
        .to(video, {
            scale: 1.08,
            duration: 1,
            ease: "none"
        }, 0)
        .fromTo(estado, { tempo: 0 }, {
            tempo: function () {
                return Math.max(duracao - MARGEM_FINAL, 0);
            },
            duration: 1,
            ease: "none",
            onUpdate: aplicarTempo,
        }, 0);
}
