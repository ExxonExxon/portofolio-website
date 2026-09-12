const DURATION = 300;
const EASING = "cubic-bezier(0, 0, 0.2, 1)";

/**
 * FAQ accordion shared by /web-design/ and /web-design/pricing/. Native
 * <details> snaps open, so the answer height is animated by hand.
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

    let expanded = item.open;
    let animation = null;

    summary.addEventListener("click", (event) => {
      event.preventDefault();

      if (reduceMotion) {
        expanded = !expanded;
        item.open = expanded;
        return;
      }

      const startHeight = answer.getBoundingClientRect().height;
      const startOpacity = item.open
        ? Number(getComputedStyle(answer).opacity)
        : 0;
      animation?.cancel();
      animation = null;

      expanded = !expanded;
      if (expanded) item.open = true;

      const endHeight = expanded ? answer.scrollHeight : 0;

      item.classList.add("faq__item--animating");
      animation = answer.animate(
        [
          { height: `${startHeight}px`, opacity: startOpacity },
          { height: `${endHeight}px`, opacity: expanded ? 1 : 0 },
        ],
        { duration: DURATION, easing: EASING },
      );
      animation.onfinish = () => {
        if (!expanded) item.open = false;
        item.classList.remove("faq__item--animating");
        animation = null;
      };
    });
  });
}
