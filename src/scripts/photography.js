import "../styles/variables.css";
import "../styles/components.css";
import "../styles/photography.css";
import "@fortawesome/fontawesome-free/css/all.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { initMobileMenu, initActiveNav } from "./nav.js";
import { initThemeToggle } from "./theme.js";

/*
 * To add a new photo:
 *   1. Drop the .webp file in assets/photography-images/
 *   2. Add one line to the array below with the filename and year
 */

const photos = [
  // ── 2025 ──
  { src: "/assets/photography-images/sun_looking_down.webp", alt: "Sun peering through the trees", year: 2025 },
  { src: "/assets/photography-images/trail_tree_framing.webp", alt: "Portal to a trail", year: 2025 },
  { src: "/assets/photography-images/trail_behind_leaves.webp", alt: "Trail in a park", year: 2025 },
  { src: "/assets/photography-images/Weird_Looking_Tree.webp", alt: "Weird looking tree", year: 2025 },
  { src: "/assets/photography-images/a_trail_sky_clipping.webp", alt: "A trail to the open", year: 2025 },
  { src: "/assets/photography-images/landscape_of_rocks.webp", alt: "Rocks surfing the water", year: 2025 },
  { src: "/assets/photography-images/wallaby_could_have_been_closer.webp", alt: "Wallaby that's camouflaging", year: 2025 },
  { src: "/assets/photography-images/greta_rocks_right_face_dark.webp", alt: "Portrait of my sister", year: 2025 },
  { src: "/assets/photography-images/greta_sus_jacket_clipping.webp", alt: "My sister in front of some mountains", year: 2025 },
  { src: "/assets/photography-images/Highway_Of_Fenceposts.webp", alt: "Highway fence posts", year: 2025 },
  { src: "/assets/photography-images/motorbike_dsc_0048.webp", alt: "Person on a motorbike", year: 2025 },
  { src: "/assets/photography-images/Bird_On_Telephone_(DSC_0043).webp", alt: "Bird on a telephone wire", year: 2025 },
  { src: "/assets/photography-images/dsc_0012-bird-phillip-island-large.webp", alt: "Bird at Phillip Island", year: 2025 },
  { src: "/assets/photography-images/dsc_0095-wilsn-prom-large.webp", alt: "Seagull flying through the sky", year: 2025 },
  { src: "/assets/photography-images/dsc_0108-flower-large.webp", alt: "Pink flowers", year: 2026 },
];

// Stable anchor id per photo, e.g. photo-sun-looking-down
function photoId(src) {
  const base = src.split("/").pop().replace(/\.webp$/i, "");
  return (
    "photo-" +
    base
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  );
}

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
      item.id = photoId(photo.src);

      const frame = document.createElement("div");
      frame.className = "gallery-item__frame";

      const img = document.createElement("img");
      img.src = photo.src;
      img.alt = photo.alt;
      img.loading = "lazy";
      img.decoding = "async";

      frame.appendChild(img);
      item.appendChild(frame);

      const caption = document.createElement("span");
      caption.className = "gallery-item__caption";
      caption.textContent = photo.alt;
      item.appendChild(caption);

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
    const item = e.target.closest(".gallery-item");
    if (!item) return;
    const img = item.querySelector("img");
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

// Scroll to a photo when landing with a #photo-... hash (front page deep links).
function scrollToPhoto() {
  const raw = decodeURIComponent(location.hash.slice(1));
  if (!raw.startsWith("photo-")) return;
  const el = document.getElementById(raw);
  if (!el) return;

  const flash = () => {
    el.classList.remove("gallery-item--highlight");
    void el.offsetWidth;
    el.classList.add("gallery-item--highlight");
    setTimeout(() => el.classList.remove("gallery-item--highlight"), 2000);
  };
  const center = () => el.scrollIntoView({ behavior: "smooth", block: "center" });

  // First pass instant (starts lazy image loads), then re-center as the
  // gallery layout settles so the target lands truly centered.
  el.scrollIntoView({ behavior: "auto", block: "center" });
  flash();
  [300, 650, 1100].forEach((ms) => setTimeout(center, ms));
}

window.addEventListener("hashchange", scrollToPhoto);
scrollToPhoto();

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
