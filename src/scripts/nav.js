const MENU_BTN_ID = "menuBtn";
const MOBILE_MENU_ID = "mobileMenu";
const LINE_1_ID = "line1";
const LINE_2_ID = "line2";
const LINE_3_ID = "line3";

export function initActiveNav() {
  const current = window.location.pathname;
  const scope = document.querySelectorAll(
    ".nav-bar .nav-link, .mobile-menu .mobile-link",
  );
  scope.forEach((link) => {
    if (link.getAttribute("href") === current) {
      link.classList.add("nav-link--active");
    }
  });
}

/**
 * Initialises the mobile navigation menu with hamburger animation
 * and click-outside-to-close behaviour.
 * @param {string} menuBtnId - ID of the menu toggle button
 * @param {string} mobileMenuId - ID of the mobile menu container
 */
export function initMobileMenu(
  menuBtnId = MENU_BTN_ID,
  mobileMenuId = MOBILE_MENU_ID,
) {
  const menuBtn = document.getElementById(menuBtnId);
  const mobileMenu = document.getElementById(mobileMenuId);
  if (!menuBtn || !mobileMenu) return;

  const line1 = document.getElementById(LINE_1_ID);
  const line2 = document.getElementById(LINE_2_ID);
  const line3 = document.getElementById(LINE_3_ID);

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
