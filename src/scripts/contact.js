import "../styles/variables.css";
import "../styles/components.css";
import "../styles/contact.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "aos/dist/aos.css";
import { initSite } from "./initSite.js";

/*
 * /web-design/ CTAs link here with ?plan=standard or ?plan=webcare. Carry
 * that choice into the message so the enquiry arrives with context.
 */
function initPlanPrefill() {
  const plan = new URLSearchParams(window.location.search).get("plan");
  if (!plan) return;

  const labels = {
    standard: "Standard (free)",
    webcare: "WebCare+ ($49/month)",
  };

  const hidden = document.getElementById("plan");
  if (hidden) hidden.value = plan;

  const message = document.getElementById("message");
  if (message) {
    const label = labels[plan] ?? plan;
    message.value = `Hi Tomas, I'm interested in the ${label} option for my website. `;
  }
}

initPlanPrefill();
initSite();
