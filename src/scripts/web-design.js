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
 * The plans block is the same partial on /web-design/ and
 * /web-design/pricing/, so both entries share plan-picker.js.
 */

initSite();
initPlanPicker();
initFaq();
