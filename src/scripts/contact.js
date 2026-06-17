import "../styles/variables.css";
import "../styles/components.css";
import "../styles/contact.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { initMobileMenu } from "./nav.js";
import { initThemeToggle } from "./theme.js";

AOS.init({ once: true, offset: 80, duration: 600, easing: "ease-out-cubic", disable: "mobile" });
initMobileMenu();
initThemeToggle();
