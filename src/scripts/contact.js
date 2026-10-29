import "../styles/variables.css";
import "../styles/components.css";
import "../styles/contact.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "aos/dist/aos.css";
import { initSite } from "./initSite.js";

import { buildWebsiteRequestUrl } from "./website-referral.js";

const legacyPlan = new URLSearchParams(window.location.search).get("plan");
const websiteReferral = document.getElementById("website-referral");
if (websiteReferral && ["standard", "webcare"].includes(legacyPlan)) {
  websiteReferral.href = buildWebsiteRequestUrl({ plan: legacyPlan });
  websiteReferral.textContent = "Continue your website request on Tradsiee";
}

/*
 * Netlify Forms wants an url-encoded body that repeats the form-name. We post
 * with fetch so the visitor stays on the page and gets an inline confirmation.
 */
function encodeFormData(data) {
  return Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join("&");
}

function initWithContactForm() {
  const form = document.getElementById("contact-form");
  const success = document.getElementById("form-success");
  if (!form || !success) return;

  const button = form.querySelector(".btn--submit");
  const errorNote = document.getElementById("form-error");
  const successText = document.getElementById("form-success-text");
  const resetButton = document.getElementById("form-reset");

  function stopLoading() {
    button.disabled = false;
    button.classList.remove("is-loading");
    button.removeAttribute("aria-busy");
  }

  function showError(message) {
    stopLoading();
    if (!errorNote) return;
    errorNote.textContent = message;
    errorNote.hidden = false;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (button.disabled) return;

    button.disabled = true;
    button.classList.add("is-loading");
    button.setAttribute("aria-busy", "true");
    if (errorNote) errorNote.hidden = true;

    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeFormData({
          "form-name": form.getAttribute("name"),
          ...data,
        }),
      });

      if (!response.ok) throw new Error(`Request failed: ${response.status}`);

      const name = (data.name ?? "").trim();
      const email = (data.email ?? "").trim();
      if (successText) {
        const greeting = name ? `, ${name}` : "";
        successText.textContent = `Thanks${greeting}. I'll reply to ${
          email || "your email"
        } within a day.`;
      }

      form.classList.add("is-leaving");
      window.setTimeout(() => {
        form.hidden = true;
        success.hidden = false;
      }, 260);
    } catch (error) {
      console.error(error);
      showError(
        "Something went wrong sending your message. Please try again, or email tomas@gorjux.net.",
      );
    }
  });

  resetButton?.addEventListener("click", () => {
    success.hidden = true;
    form.hidden = false;
    form.classList.remove("is-leaving");
    form.reset();
    stopLoading();
    document.getElementById("name")?.focus();
  });
}

initWithContactForm();
initSite();
