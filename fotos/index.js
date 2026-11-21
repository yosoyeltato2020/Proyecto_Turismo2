"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  const closeMenu = () => {
    if (!nav || !toggle) return;
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menú");
  };
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    });
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));
    document.addEventListener("click", e => {
      if (nav.classList.contains("open") && !header.contains(e.target)) closeMenu();
    });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") closeMenu();
    });
  }
  if (header) {
    const update = () => header.classList.toggle("is-scrolled", window.scrollY > 80);
    update();
    window.addEventListener("scroll", update, { passive: true });
  }
  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();
});
