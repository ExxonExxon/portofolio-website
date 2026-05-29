import "../styles/wikipedia.css";

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const menuOpen = document.getElementById("menu-open");
  const menuClose = document.getElementById("menu-close");
  const overlay = document.getElementById("sidebar-overlay");
  const navLinks = document.querySelectorAll(".nav-link-mobile");

  function toggleSidebar() {
    const isOpen = body.classList.toggle("sidebar-open");
    menuOpen.setAttribute("aria-expanded", isOpen);
  }

  menuOpen.addEventListener("click", toggleSidebar);
  menuClose.addEventListener("click", toggleSidebar);
  overlay.addEventListener("click", toggleSidebar);

  navLinks.forEach((link) => {
    link.addEventListener("click", () => body.classList.remove("sidebar-open"));
  });
});
