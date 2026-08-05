import "../styles/variables.css";
import "../styles/components.css";
import "../styles/contact.css";
import "@fortawesome/fontawesome-free/css/all.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { initMobileMenu, initActiveNav } from "./nav.js";
import { initThemeToggle } from "./theme.js";

initActiveNav();
AOS.init({ once: true, offset: 80, duration: 600, easing: "ease-out-cubic", disable: "mobile" });
initMobileMenu();
initThemeToggle();
