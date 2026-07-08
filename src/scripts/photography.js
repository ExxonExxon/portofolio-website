import "../styles/variables.css";
import "../styles/components.css";
import "../styles/photography.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { initMobileMenu, initActiveNav } from "./nav.js";
import { initThemeToggle } from "./theme.js";

/*
 * To add a new photo:
 *   1. Drop the .webp file in public/assets/photography-images/
 *   2. Add one line to the array below with the filename and year
 */

const photos = [
  // ── 2025 ──
  { src: "/assets/photography-images/Sun_Looking_Down.webp", alt: "Sun looking down through the trees", year: 2025 },
  { src: "/assets/photography-images/Trail_Tree_Framing.webp", alt: "Tree framing a trail", year: 2025 },
  { src: "/assets/photography-images/Trail_Behind_Leaves.webp", alt: "Trail seen through leaves", year: 2025 },
  { src: "/assets/photography-images/Weird_Looking_Tree.webp", alt: "Weird looking tree", year: 2025 },
  { src: "/assets/photography-images/A_Trail_(sky_clipping).webp", alt: "A trail through the bush", year: 2025 },
  { src: "/assets/photography-images/Landscape_of_rocks.webp", alt: "Rocky landscape", year: 2025 },
  { src: "/assets/photography-images/Wallaby_(Could_have_been_closer).webp", alt: "Wallaby in the wild", year: 2025 },
  { src: "/assets/photography-images/Greta_rocks_(right_face_dark).webp", alt: "Greta at the rocks", year: 2025 },
  { src: "/assets/photography-images/Greta_sus_(jacket_clipping).webp", alt: "Greta in a jacket", year: 2025 },
  { src: "/assets/photography-images/Highway_Of_Fenceposts.webp", alt: "Highway fence posts", year: 2025 },
  { src: "/assets/photography-images/Motorbike_(DSC_0048).webp", alt: "Motorbike parked", year: 2025 },
  { src: "/assets/photography-images/Bird_On_Telephone_(DSC_0043).webp", alt: "Bird on a telephone wire", year: 2025 },
  { src: "/assets/photography-images/dsc_0012 bird phillip island large.webp", alt: "Bird at Phillip Island", year: 2025 },
];

function initGallery() {
  const container = document.getElementById("gallery");
  if (!container) return;

  const groups = {};
  for (const photo of photos) {
    if (!groups[photo.year]) groups[photo.year] = [];
    groups[photo.year].push(photo);
  }

  const years = Object.keys(groups).sort((a, b) => Number(b) - Number(a));

  for (let i = 0; i < years.length; i++) {
    const year = years[i];

    const section = document.createElement("section");
    section.className = "gallery-section";

    const heading = document.createElement("h2");
    heading.className = "gallery-year";
    heading.textContent = year;
    section.appendChild(heading);

    const masonry = document.createElement("div");
    masonry.className = "gallery-masonry";

    for (const photo of groups[year]) {
      const item = document.createElement("div");
      item.className = "gallery-item";

      const img = document.createElement("img");
      img.src = photo.src;
      img.alt = photo.alt;
      img.loading = "lazy";
      img.decoding = "async";

      item.appendChild(img);
      masonry.appendChild(item);
    }

    section.appendChild(masonry);
    container.appendChild(section);
  }
}

initGallery();

function initLightbox() {
  const modal = document.getElementById("photoModal");
  if (!modal) return;

  const modalImg = modal.querySelector(".photo-modal__img");
  const closeBtn = modal.querySelector(".photo-modal__close");
  const backdrop = modal.querySelector(".photo-modal__backdrop");
  const prevBtn = modal.querySelector(".photo-modal__prev");
  const nextBtn = modal.querySelector(".photo-modal__next");

  let currentIndex = -1;

  function getImages() {
    return document.querySelectorAll("#gallery .gallery-item img");
  }

  function open(index) {
    const images = getImages();
    if (index < 0 || index >= images.length) return;
    currentIndex = index;
    const img = images[index];
    modalImg.src = img.src;
    modalImg.alt = img.alt;
    modal.classList.add("photo-modal--open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    modal.classList.remove("photo-modal--open");
    document.body.style.overflow = "";
    currentIndex = -1;
  }

  document.getElementById("gallery").addEventListener("click", (e) => {
    const img = e.target.closest(".gallery-item img");
    if (!img) return;
    const images = getImages();
    const index = Array.from(images).indexOf(img);
    if (index !== -1) open(index);
  });

  closeBtn.addEventListener("click", close);
  backdrop.addEventListener("click", close);

  prevBtn.addEventListener("click", () => open(currentIndex - 1));
  nextBtn.addEventListener("click", () => open(currentIndex + 1));

  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("photo-modal--open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") open(currentIndex - 1);
    if (e.key === "ArrowRight") open(currentIndex + 1);
  });
}

initLightbox();

initActiveNav();

AOS.init({
  once: true,
  offset: 80,
  duration: 600,
  easing: "ease-out-cubic",
  disable: "mobile",
});

initMobileMenu();
initThemeToggle();
