const DURATION = 260;
const EASING = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

/**
 * FAQ accordion shared by /web-design/ and /web-design/pricing/. Native
 * <details> snaps open, so the answer height is animated by hand. The
 * closing animation holds the open state until it finishes, then releases
 * it, so the panel collapses smoothly instead of snapping.
 * Respects prefers-reduced-motion.
 */
export function initFaq() {
  const items = document.querySelectorAll(".faq__item");
  if (!items.length) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  items.forEach((item) => {
    const summary = item.querySelector(".faq__q");
    const answer = item.querySelector(".faq__a");
    if (!summary || !answer) return;

    let animation = null;

    summary.addEventListener("click", (event) => {
      event.preventDefault();

      if (reduceMotion) {
        item.open = !item.open;
        return;
      }

      const wasOpen = item.open;
      const startHeight = answer.getBoundingClientRect().height;
      const startOpacity = wasOpen
        ? Number(getComputedStyle(answer).opacity)
        : 0;

      animation?.cancel();
      animation = null;

      if (!wasOpen) item.open = true;

      const endHeight = wasOpen ? 0 : answer.scrollHeight;

      animation = answer.animate(
        [
          { height: `${startHeight}px`, opacity: startOpacity },
          { height: `${endHeight}px`, opacity: wasOpen ? 0 : 1 },
        ],
        { duration: DURATION, easing: EASING, fill: "both" },
      );

      animation.onfinish = () => {
        animation?.cancel();
        animation = null;
        if (wasOpen) item.open = false;
      };
    });
  });
}
