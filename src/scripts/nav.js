export function initMobileMenu(menuBtnId = 'menuBtn', mobileMenuId = 'mobileMenu') {
  const menuBtn = document.getElementById(menuBtnId);
  const mobileMenu = document.getElementById(mobileMenuId);
  if (!menuBtn || !mobileMenu) return;

  const line1 = document.getElementById('line1');
  const line2 = document.getElementById('line2');
  const line3 = document.getElementById('line3');

  let isOpen = false;

  function toggleMenu(forceState) {
    isOpen = forceState !== undefined ? forceState : !isOpen;
    mobileMenu.classList.toggle('active', isOpen);
    menuBtn.setAttribute('aria-expanded', String(isOpen));

    if (line1 && line3) {
      line1.setAttribute('d', isOpen ? 'M6 18L18 6' : 'M4 6h16');
      line2.style.opacity = isOpen ? '0' : '1';
      line3.setAttribute('d', isOpen ? 'M6 6l12 12' : 'M4 18h16');
    }
  }

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  document.addEventListener('click', (e) => {
    if (isOpen && !mobileMenu.contains(e.target) && e.target !== menuBtn) {
      toggleMenu(false);
    }
  });
}
