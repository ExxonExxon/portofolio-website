// AOS Init
window.addEventListener('load', () => {
    AOS.init({ duration: 800, once: true, disable: 'mobile' });
    
    // Lazy load iframes only when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const iframe = entry.target;
                iframe.src = iframe.dataset.src;
                observer.unobserve(iframe);
            }
        });
    });
    document.querySelectorAll('.lazy-iframe').forEach(i => observer.observe(i));
});

// Typewriter - Memory Leak Protection
const textArr = ["Tomas Gorjux.", "a Developer.", "a Photographer.", "Tomas Gorjux."];
let i = 0, j = 0, isDeleting = false;
const target = document.getElementById("typewriter");

function type() {
    const current = textArr[i % textArr.length];
    target.textContent = isDeleting ? current.substring(0, j--) : current.substring(0, j++);
    let speed = isDeleting ? 40 : 100;
    if (!isDeleting && j > current.length) { isDeleting = true; speed = 2000; } 
    else if (isDeleting && j < 0) { isDeleting = false; i++; speed = 500; }
    setTimeout(type, speed);
}
type();

// Modal Control
const modal = document.getElementById('universalModal');
const modalContent = document.getElementById('modalContent');

function openModal(data) {
    document.getElementById('modalImg').src = data.img;
    document.getElementById('modalTitle').innerText = data.title;
    document.getElementById('modalSub').innerText = data.sub;
    document.getElementById('modalDescription').innerText = data.desc;
    modal.classList.replace('hidden', 'flex');
    requestAnimationFrame(() => modalContent.classList.remove('scale-95', 'opacity-0'));
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modalContent.classList.add('scale-95', 'opacity-0');
    setTimeout(() => { modal.classList.replace('flex', 'hidden'); document.body.style.overflow = ''; }, 300);
}

document.querySelectorAll('.photo-card').forEach(card => {
    card.addEventListener('click', () => openModal({
        img: card.querySelector('img').src,
        title: card.dataset.name,
        sub: card.dataset.settings,
        desc: card.dataset.desc
    }));
});

// Menu Control
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
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
menuBtn.onclick = (e) => { e.stopPropagation(); toggleMenu(); };
document.onclick = (e) => { if (isOpen && !mobileMenu.contains(e.target)) toggleMenu(); };




