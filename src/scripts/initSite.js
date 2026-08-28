import AOS from "aos";
import { initActiveNav, initMobileMenu } from "./nav.js";

/**
 * Shared page bootstrap: active nav link, AOS scroll animations and the
 * mobile menu. Every page entry calls this so the boilerplate lives once.
 *
 * @param {{ disableAosOnMobile?: boolean }} options - AOS is skipped on small
 *   screens by default; pass `disableAosOnMobile: false` to keep it on
 *   (the home page relies on it).
 */
export function initSite({ disableAosOnMobile = true } = {}) {
  initActiveNav();
  AOS.init({
    once: true,
    offset: 80,
    duration: 600,
    easing: "ease-out-cubic",
    ...(disableAosOnMobile ? { disable: "mobile" } : {}),
  });
  initMobileMenu();
}
