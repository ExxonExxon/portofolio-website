import "../styles/variables.css";
import "../styles/components.css";
import "../styles/plan-picker.css";
import "../styles/web-design.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "aos/dist/aos.css";
import { initSite } from "./initSite.js";
import { initPlanPicker } from "./plan-picker.js";
import { initFaq } from "./faq.js";

/*
 * The plans block lives in src/partials/pricing.html and is driven by
 * plan-picker.js.
 */

initSite();
initPlanPicker();
initFaq();
