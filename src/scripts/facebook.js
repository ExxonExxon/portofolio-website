import "../styles/facebook.css";
import "@fortawesome/fontawesome-free/css/all.css";
import AOS from "aos";
import "aos/dist/aos.css";

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const createPostBtn = document.getElementById("create-post-btn");
  const createPostModal = document.getElementById("createPostModal");
  const closeModalBtn = document.getElementById("closeModalBtn");

  let lastFocusedElement, firstFocusableElement, lastFocusableElement;

  const toggleModal = (show) => {
    if (!createPostModal) return;
    if (show) {
      createPostModal.classList.remove("hidden");
      body.classList.add("no-scroll");
      createPostModal.setAttribute("aria-hidden", "false");
      lastFocusedElement = document.activeElement;
      setTimeout(() => {
        const focusable = createPostModal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        firstFocusableElement = focusable[0];
        lastFocusableElement = focusable[focusable.length - 1];
        if (firstFocusableElement) firstFocusableElement.focus();
      }, 100);
    } else {
      createPostModal.classList.add("hidden");
      body.classList.remove("no-scroll");
      createPostModal.setAttribute("aria-hidden", "true");
      if (lastFocusedElement) {
        lastFocusedElement.focus();
        lastFocusedElement = null;
      }
    }
  };

  createPostModal.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    if (e.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        lastFocusableElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusableElement) {
        firstFocusableElement.focus();
        e.preventDefault();
      }
    }
  });

  if (createPostBtn)
    createPostBtn.addEventListener("click", () => toggleModal(true));
  if (closeModalBtn)
    closeModalBtn.addEventListener("click", () => toggleModal(false));
  if (createPostModal) {
    createPostModal.addEventListener("click", (e) => {
      if (e.target === createPostModal) toggleModal(false);
    });
  }

  document.querySelectorAll(".like-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const icon = btn.querySelector("i");
      btn.classList.toggle("liked");
      icon.classList.toggle("far");
      icon.classList.toggle("fas");
    });
  });

  document.querySelectorAll(".friend-request-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".friend-request-card");
      if (card) {
        card.style.transition =
          "opacity 0.3s ease, transform 0.3s ease, margin 0.3s ease";
        card.style.opacity = "0";
        card.style.transform = "scale(0.95)";
        card.style.marginBottom = `-${card.offsetHeight}px`;
        setTimeout(() => card.remove(), 300);
      }
    });
  });

  AOS.init({ duration: 800, once: true });
});
