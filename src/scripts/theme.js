import { DOM } from "./constants.js";

/**
 * Wires up the dark/light theme toggle buttons.
 * The initial theme class is applied inline in <head> to prevent flash.
 */
export function initThemeToggle() {
  const html = document.documentElement;

  function toggleTheme() {
    html.classList.toggle("dark");
    localStorage.setItem(
      "theme",
      html.classList.contains("dark") ? "dark" : "light",
    );
  }

  document
    .getElementById(DOM.THEME_TOGGLE)
    ?.addEventListener("click", toggleTheme);
  document
    .getElementById(DOM.THEME_TOGGLE_MOBILE)
    ?.addEventListener("click", toggleTheme);
}
