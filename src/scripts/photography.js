import "../styles/variables.css";
import "../styles/components.css";
import "../styles/photography.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "aos/dist/aos.css";
import { initSite } from "./initSite.js";
import { createPhotoCard } from "./photo-card.js";
import photosData from "../data/photos.json";

/*
 * To add a new photo:
 *   1. Drop the .webp file in assets/photography-images/
 *   2. Add one line to src/data/photos.json with the filename and year
 *
 * `photos` is the full gallery (src/alt/year). `featured` photos are the ones
 * shown in the homepage photo strip (max 4), injected at build/dev time.
 */

const photos = photosData.photos;

// Stable anchor id per photo, e.g. photo-sun-looking-down
function photoId(src) {
  const base = src
    .split("/")
    .pop()
    .replace(/\.webp$/i, "");
  return (
    "photo-" +
    base
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  );
}

// Approximate relative height of one card from its photo ratio (width/height).
// Taller photos have a smaller ratio → bigger card. Used only to balance the
// columns roughly; the final sizes come from the browser once images load.
function cardHeight(photo, cardWidth) {
  const ratio = Number(photo.ratio);
  if (ratio > 0) return cardWidth / ratio;
  return cardWidth * 1.5; // fallback for a missing ratio
}

function columnCount() {
  if (window.matchMedia("(min-width: 1024px)").matches) return 3;
  if (window.matchMedia("(min-width: 640px)").matches) return 2;
  return 1;
}

// Greedy-balance a list of photos into `n` columns by cumulative height.
function splitIntoColumns(photos, n) {
  const columns = Array.from({ length: n }, () => ({
    photos: [],
    height: 0,
  }));
  for (const photo of photos) {
    const shortest = columns.reduce((a, b) => (a.height <= b.height ? a : b));
    shortest.photos.push(photo);
    shortest.height += cardHeight(photo, 333);
  }
  return columns.map((c) => c.photos);
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

    const colCount = Math.min(columnCount(), groups[year].length);
    const columns = splitIntoColumns(groups[year], colCount);

    for (const colPhotos of columns) {
      const column = document.createElement("div");
      column.className = "gallery-column";
      for (const photo of colPhotos) {
        const item = createPhotoCard(photo, {
          mode: "natural",
          href: `#${photoId(photo.src)}`,
        });
        item.id = photoId(photo.src);
        column.appendChild(item);
      }
      masonry.appendChild(column);
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
  const modalCaption = modal.querySelector(".photo-modal__caption");
  const closeBtn = modal.querySelector(".photo-modal__close");
  const backdrop = modal.querySelector(".photo-modal__backdrop");
  const prevBtn = modal.querySelector(".photo-modal__prev");
  const nextBtn = modal.querySelector(".photo-modal__next");

  let currentIndex = -1;

  function getImages() {
    return document.querySelectorAll("#gallery .photo-card img");
  }

  function open(index) {
    const images = getImages();
    if (index < 0 || index >= images.length) return;
    currentIndex = index;
    const img = images[index];
    modalImg.src = img.src;
    modalImg.alt = img.alt;
    modalCaption.textContent = img.alt;
    modal.classList.add("photo-modal--open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    modal.classList.remove("photo-modal--open");
    document.body.style.overflow = "";
    currentIndex = -1;
  }

  document.getElementById("gallery").addEventListener("click", (e) => {
    const item = e.target.closest(".photo-card");
    if (!item) return;
    e.preventDefault();
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
    el.classList.remove("photo-card--highlight");
    void el.offsetWidth;
    el.classList.add("photo-card--highlight");
    setTimeout(() => el.classList.remove("photo-card--highlight"), 2000);
  };
  const center = () =>
    el.scrollIntoView({ behavior: "smooth", block: "center" });

  // First pass instant (starts lazy image loads), then re-center as the
  // gallery layout settles so the target lands truly centered.
  el.scrollIntoView({ behavior: "auto", block: "center" });
  flash();
  [300, 650, 1100].forEach((ms) => setTimeout(center, ms));
}

window.addEventListener("hashchange", scrollToPhoto);
scrollToPhoto();

initSite();
