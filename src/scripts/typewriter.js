import { DOM, DURATION } from "./constants.js";

/**
 * Cycles through an array of phrases with a typing/deleting animation.
 * @param {string} elementId - ID of the element to type into
 * @param {string[]} phrases - Array of phrases to cycle through
 * @returns {() => void} Cleanup function to cancel the animation
 */
export function initTypewriter(
  elementId = DOM.TYPEWRITER,
  phrases = ["a Web Developer.", "a Photographer.", "a Creator."],
) {
  const el = document.getElementById(elementId);
  if (!el) return () => {};

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let timer;

  function type() {
    const current = phrases[phraseIndex];
    el.textContent = isDeleting
      ? current.substring(0, charIndex - 1)
      : current.substring(0, charIndex + 1);
    charIndex += isDeleting ? -1 : 1;

    let speed = isDeleting
      ? DURATION.TYPEWRITER_DELETING
      : DURATION.TYPEWRITER_TYPING;
    if (!isDeleting && charIndex === current.length) {
      isDeleting = true;
      speed = DURATION.TYPEWRITER_PAUSE;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      speed = DURATION.TYPEWRITER_PAUSE_BEFORE;
    }

    timer = setTimeout(type, speed);
  }

  type();

  return () => clearTimeout(timer);
}
