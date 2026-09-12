const OPEN_DURATION = 320;
const OPEN_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";
const CLOSE_DURATION = 240;
const CLOSE_EASING = "cubic-bezier(0.4, 0, 0.2, 1)";

/**
 * FAQ accordion for /web-design/. Native
 * <details> snaps, so the answer height is animated by hand.
 *
 * A closed <details> keeps a remembered content height (content-visibility),
 * so the measured height can't be trusted as a start value — the open
 * animation always grows from 0 instead. Logical open state is tracked
 * separately from `item.open` so a click mid-animation still behaves.
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
    let open = item.open;

    summary.addEventListener("click", (event) => {
      event.preventDefault();

      if (reduceMotion) {
        open = !open;
        item.open = open;
        return;
      }

      const wasOpen = open;
      open = !open;

      animation?.cancel();
      animation = null;

      if (wasOpen) {
        const startHeight = answer.getBoundingClientRect().height;

        animation = answer.animate(
          [
            { height: `${startHeight}px`, opacity: 1 },
            { height: "0px", opacity: 0 },
          ],
          { duration: CLOSE_DURATION, easing: CLOSE_EASING, fill: "both" },
        );

        animation.onfinish = () => {
          animation?.cancel();
          animation = null;
          item.open = false;
        };
        return;
      }

      item.open = true;
      const endHeight = answer.scrollHeight;

      animation = answer.animate(
        [
          { height: "0px", opacity: 0 },
          { height: `${endHeight}px`, opacity: 1 },
        ],
        { duration: OPEN_DURATION, easing: OPEN_EASING, fill: "both" },
      );

      animation.onfinish = () => {
        animation?.cancel();
        animation = null;
      };
    });
  });
}
