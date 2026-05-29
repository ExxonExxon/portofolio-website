import { DOM } from "./constants.js";

/**
 * Initialises the mobile navigation menu with hamburger animation
 * and click-outside-to-close behaviour.
 * @param {string} menuBtnId - ID of the menu toggle button
 * @param {string} mobileMenuId - ID of the mobile menu container
 */
export function initMobileMenu(
  menuBtnId = DOM.MENU_BTN,
  mobileMenuId = DOM.MOBILE_MENU,
) {
  const menuBtn = document.getElementById(menuBtnId);
  const mobileMenu = document.getElementById(mobileMenuId);
  if (!menuBtn || !mobileMenu) return;

  const line1 = document.getElementById(DOM.LINE_1);
  const line2 = document.getElementById(DOM.LINE_2);
  const line3 = document.getElementById(DOM.LINE_3);

  let isOpen = false;

  function toggleMenu(forceState) {
    isOpen = forceState !== undefined ? forceState : !isOpen;
    mobileMenu.classList.toggle("active", isOpen);
    menuBtn.setAttribute("aria-expanded", String(isOpen));

    if (line1 && line3) {
      line1.setAttribute("d", isOpen ? "M6 18L18 6" : "M4 6h16");
      line2.style.opacity = isOpen ? "0" : "1";
      line3.setAttribute("d", isOpen ? "M6 6l12 12" : "M4 18h16");
    }
  }

  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  document.querySelectorAll(".mobile-link").forEach((link) => {
    link.addEventListener("click", () => toggleMenu(false));
  });

  document.addEventListener("click", (e) => {
    if (isOpen && !mobileMenu.contains(e.target) && e.target !== menuBtn) {
      toggleMenu(false);
    }
  });
}
