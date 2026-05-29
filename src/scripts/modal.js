import { DOM, DURATION } from "./constants.js";

/**
 * Wires up the photography lightbox modal with click and keyboard events.
 */
export function initPhotoModal() {
  const modal = document.getElementById(DOM.MODAL);
  const modalContent = document.getElementById(DOM.MODAL_CONTENT);
  const modalImg = document.getElementById(DOM.MODAL_IMG);
  const modalTitle = document.getElementById(DOM.MODAL_TITLE);
  const modalDesc = document.getElementById(DOM.MODAL_DESC);
  const modalSettings = document.getElementById(DOM.MODAL_SETTINGS);
  const closeBtn = document.getElementById(DOM.MODAL_CLOSE_BTN);
  const backdrop = document.getElementById(DOM.MODAL_BACKDROP);

  if (!modal) return;

  /** Store original body overflow so we can restore it on close */
  let originalOverflow;

  function openModal(element) {
    const imgSrc = element.querySelector("img")?.src;
    const title = element.dataset.name;
    const desc = element.dataset.desc;
    const settings = element.dataset.settings;

    if (!imgSrc) return;

    modalImg.src = imgSrc;
    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modalSettings.textContent = settings;

    modal.classList.remove("hidden");
    modal.classList.add("flex");
    setTimeout(() => {
      modalContent.classList.remove("scale-95", "opacity-0");
      modalContent.classList.add("scale-100", "opacity-100");
    }, DURATION.MODAL_OPEN);

    originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modalContent.classList.remove("scale-100", "opacity-100");
    modalContent.classList.add("scale-95", "opacity-0");
    setTimeout(() => {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
      document.body.style.overflow = originalOverflow || "";
    }, DURATION.MODAL_CLOSE);
  }

  /* Open modal on photo-card click */
  document.querySelectorAll(".photo-card").forEach((card) => {
    card.addEventListener("click", () => openModal(card));
  });

  /* Close on button click */
  closeBtn?.addEventListener("click", closeModal);

  /* Close on backdrop click */
  backdrop?.addEventListener("click", closeModal);

  /* Close on Escape key */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });
}
