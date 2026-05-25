window.addEventListener('load', () => {
    AOS.init({ duration: 800, once: true, disable: 'mobile' });
});

const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const navbar = document.getElementById('navbar');
const lines = [document.getElementById('line1'), document.getElementById('line2'), document.getElementById('line3')];

let isOpen = false;

function toggleMenu() {
    isOpen = !isOpen;
    mobileMenu.classList.toggle('active');
    menuBtn.setAttribute('aria-expanded', isOpen);
    lines[0].style.transform = isOpen ? "rotate(45deg) translate(5px, 5px)" : "none";
    lines[1].style.opacity = isOpen ? "0" : "1";
    lines[2].style.transform = isOpen ? "rotate(-45deg) translate(5px, -5px)" : "none";
}

menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
});

document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        if(isOpen) toggleMenu();
    });
});

document.addEventListener('click', (e) => {
    if (isOpen && !navbar.contains(e.target)) {
        toggleMenu();
    }
});