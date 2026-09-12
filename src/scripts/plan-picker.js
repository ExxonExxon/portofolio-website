import { trackEvent } from "./analytics.js";

/**
 * Plan picker shared by /web-design/ and /web-design/pricing/. Clicking a
 * card highlights it; the CTA links carry the chosen plan into the contact
 * form. Deep links like #webcare preselect.
 */
export function initPlanPicker() {
  const picker = document.querySelector("[data-plan-picker]");
  if (!picker) return;

  const cards = Array.from(picker.querySelectorAll("[data-plan]"));

  function select(plan, { fireEvent = true } = {}) {
    const card = cards.find((candidate) => candidate.dataset.plan === plan);
    if (!card) return;

    cards.forEach((candidate) => {
      candidate.classList.toggle("plan-card--selected", candidate === card);
    });

    const radio = card.querySelector(".plan-card__radio");
    if (radio) radio.checked = true;

    if (fireEvent) {
      trackEvent("plan_select", { plan, page: window.location.pathname });
    }
  }

  cards.forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("a")) return;
      select(card.dataset.plan);
    });

    card.querySelector(".plan-card__radio")?.addEventListener("change", () => {
      select(card.dataset.plan);
    });

    const cta = card.querySelector("[data-plan-cta]");
    cta?.addEventListener("click", () => {
      trackEvent("plan_cta_click", {
        plan: card.dataset.plan,
        page: window.location.pathname,
      });
    });
  });

  const hash = window.location.hash.replace("#", "");
  if (cards.some((card) => card.dataset.plan === hash)) {
    select(hash, { fireEvent: false });
  }
}
