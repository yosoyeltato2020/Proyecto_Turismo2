/* ============================================================
   RUMBORIA
   PÁGINA: VIAJES
   Archivo: viajes.js
   ============================================================ */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* ========================================================
       01. ELEMENTOS GENERALES
       ======================================================== */

    const header = document.querySelector(".site-header");
    const menuToggle = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".main-nav");

    const year = document.getElementById("year");


    /* ========================================================
       02. CABECERA DINÁMICA
       ======================================================== */

    function updateHeader() {

        if (!header) {
            return;
        }

        header.classList.toggle(
            "is-scrolled",
            window.scrollY > 40
        );

    }

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });

    updateHeader();


    /* ========================================================
       03. MENÚ MÓVIL
       ======================================================== */

    if (menuToggle && navigation) {

        function closeMenu() {

            navigation.classList.remove("open");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            menuToggle.setAttribute(
                "aria-label",
                "Abrir menú"
            );

        }

        menuToggle.addEventListener("click", () => {

            const isOpen = navigation.classList.toggle("open");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Cerrar menú" : "Abrir menú"
            );

        });

        navigation.querySelectorAll("a").forEach((link) => {

            link.addEventListener("click", closeMenu);

        });

        document.addEventListener("click", (event) => {

            if (
                navigation.classList.contains("open") &&
                header &&
                !header.contains(event.target)
            ) {
                closeMenu();
            }

        });

        document.addEventListener("keydown", (event) => {

            if (event.key === "Escape") {
                closeMenu();
            }

        });

        window.addEventListener("resize", () => {

            if (window.innerWidth > 1080) {
                closeMenu();
            }

        });

    }


    /* ========================================================
       04. ELEMENTOS DEL CARRUSEL
       ======================================================== */

    const carousel = document.querySelector(".travel-hero");

    if (carousel) {

        const track = carousel.querySelector(".hero-track");

        const slides = Array.from(
            carousel.querySelectorAll(".hero-slide")
        );

        const previousButton = carousel.querySelector(
            ".carousel-prev"
        );

        const nextButton = carousel.querySelector(
            ".carousel-next"
        );

        const pauseButton = carousel.querySelector(
            ".carousel-pause"
        );

        const dotsContainer = carousel.querySelector(
            ".carousel-dots"
        );

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

        const slideInterval = 6000;

        let currentSlide = 0;
        let autoplayTimer = null;
        let isPaused = reducedMotion.matches;
        let isPointerInside = false;
        let touchStartX = 0;


        /* ====================================================
           05. CREACIÓN DE INDICADORES
           ==================================================== */

        slides.forEach((slide, index) => {

            const dot = document.createElement("button");

            dot.type = "button";
            dot.className = "carousel-dot";

            dot.setAttribute(
                "aria-label",
                `Mostrar paisaje ${index + 1}`
            );

            dot.addEventListener("click", () => {

                showSlide(index);
                restartAutoplay();

            });

            dotsContainer.appendChild(dot);

        });

        const dots = Array.from(
            dotsContainer.querySelectorAll(".carousel-dot")
        );


        /* ====================================================
           06. MOSTRAR DIAPOSITIVA
           ==================================================== */

        function showSlide(index) {

            if (slides.length === 0) {
                return;
            }

            currentSlide = (
                index + slides.length
            ) % slides.length;

            track.style.transform = (
                `translateX(-${currentSlide * 100}%)`
            );

            slides.forEach((slide, slideIndex) => {

                const isActive = slideIndex === currentSlide;

                slide.classList.toggle(
                    "is-active",
                    isActive
                );

                slide.setAttribute(
                    "aria-hidden",
                    String(!isActive)
                );

                // Impide acceder con Tab a enlaces ocultos.
                slide.inert = !isActive;

            });

            dots.forEach((dot, dotIndex) => {

                const isActive = dotIndex === currentSlide;

                dot.classList.toggle(
                    "is-active",
                    isActive
                );

                dot.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );

            });

        }


        /* ====================================================
           07. NAVEGACIÓN ENTRE PAISAJES
           ==================================================== */

        function nextSlide() {

            showSlide(currentSlide + 1);

        }

        function previousSlide() {

            showSlide(currentSlide - 1);

        }

        nextButton.addEventListener("click", () => {

            nextSlide();
            restartAutoplay();

        });

        previousButton.addEventListener("click", () => {

            previousSlide();
            restartAutoplay();

        });


        /* ====================================================
           08. REPRODUCCIÓN AUTOMÁTICA
           ==================================================== */

        function stopAutoplay() {

            if (autoplayTimer !== null) {

                window.clearInterval(autoplayTimer);
                autoplayTimer = null;

            }

        }

        function startAutoplay() {

            stopAutoplay();

            if (
                isPaused ||
                isPointerInside ||
                document.hidden ||
                slides.length < 2
            ) {
                return;
            }

            autoplayTimer = window.setInterval(() => {

                nextSlide();

            }, slideInterval);

        }

        function restartAutoplay() {

            startAutoplay();

        }


        /* ====================================================
           09. BOTÓN PAUSAR / REANUDAR
           ==================================================== */

        function updatePauseButton() {

            pauseButton.textContent = isPaused ? "▶" : "Ⅱ";

            pauseButton.setAttribute(
                "aria-label",
                isPaused
                    ? "Reanudar carrusel"
                    : "Pausar carrusel"
            );

        }

        pauseButton.addEventListener("click", () => {

            isPaused = !isPaused;

            updatePauseButton();
            startAutoplay();

        });


        /* ====================================================
           10. PAUSA AL PASAR EL RATÓN
           ==================================================== */

        carousel.addEventListener("mouseenter", () => {

            isPointerInside = true;
            stopAutoplay();

        });

        carousel.addEventListener("mouseleave", () => {

            isPointerInside = false;
            startAutoplay();

        });


        /* ====================================================
           11. PAUSA AL UTILIZAR EL TECLADO
           ==================================================== */

        carousel.addEventListener("focusin", () => {

            stopAutoplay();

        });

        carousel.addEventListener("focusout", (event) => {

            if (!carousel.contains(event.relatedTarget)) {

                startAutoplay();

            }

        });


        /* ====================================================
           12. DESLIZAMIENTO TÁCTIL
           ==================================================== */

        carousel.addEventListener(
            "touchstart",
            (event) => {

                touchStartX = event.changedTouches[0].screenX;

            },
            {
                passive: true
            }
        );

        carousel.addEventListener(
            "touchend",
            (event) => {

                const touchEndX = (
                    event.changedTouches[0].screenX
                );

                const difference = touchStartX - touchEndX;

                const minimumDistance = 50;

                if (Math.abs(difference) < minimumDistance) {
                    return;
                }

                if (difference > 0) {

                    nextSlide();

                } else {

                    previousSlide();

                }

                restartAutoplay();

            },
            {
                passive: true
            }
        );


        /* ====================================================
           13. VISIBILIDAD DE LA PÁGINA
           ==================================================== */

        document.addEventListener(
            "visibilitychange",
            () => {

                if (document.hidden) {

                    stopAutoplay();

                } else {

                    startAutoplay();

                }

            }
        );


        /* ====================================================
           14. PREFERENCIAS DE MOVIMIENTO
           ==================================================== */

        reducedMotion.addEventListener("change", (event) => {

            if (event.matches) {

                isPaused = true;
                stopAutoplay();

            }

            updatePauseButton();

        });


        /* ====================================================
           15. INICIALIZACIÓN DEL CARRUSEL
           ==================================================== */

        showSlide(0);
        updatePauseButton();
        startAutoplay();

    }


    /* ========================================================
       16. AÑO AUTOMÁTICO DEL COPYRIGHT
       ======================================================== */

    if (year) {

        year.textContent = new Date().getFullYear();

    }

});