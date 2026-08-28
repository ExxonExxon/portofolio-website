import "../styles/photo-card.css";

/**
 * createPhotoCard — build one "mounted print" photo card (shared).
 *
 * Returns an <a> styled as `.photo-card`. Two modes:
 *   cover   → fixed 4/5 printed box, image fills it (homepage strip row)
 *   natural → full composition preserved, masonry (photography gallery)
 *
 * The <img> gets `aspect-ratio` reserved from photo.ratio until it decodes,
 * so the card never reflows or "jumps" once a lazy photo paints.
 *
 * photo: { src, alt, ratio? }
 * opts:  { mode: "cover"|"natural", href? }
 */
export function createPhotoCard(photo, opts = {}) {
  const { mode = "natural", href } = opts;

  const card = document.createElement("a");
  // 50/50 tilt direction so the gallery reads as hand-turned prints.
  const tilt =
    Math.random() < 0.5 ? "photo-card--tilt-left" : "photo-card--tilt-right";
  card.className = `photo-card photo-card--${mode} ${tilt}`;
  card.href = href || "#";
  card.setAttribute("aria-label", photo.alt);

  const frame = document.createElement("div");
  frame.className = "photo-card__frame";

  const img = document.createElement("img");
  img.src = photo.src;
  img.alt = photo.alt;
  img.loading = "lazy";
  img.decoding = "async";
  if (photo.ratio) {
    // Reserve the box before decode so there is no reflow / jump on paint.
    img.style.aspectRatio = photo.ratio;
    img.onload = () => {
      img.style.aspectRatio = "";
    };
  }

  frame.appendChild(img);

  const caption = document.createElement("span");
  caption.className = "photo-card__caption";
  caption.textContent = photo.alt;

  card.appendChild(frame);
  card.appendChild(caption);

  return card;
}
