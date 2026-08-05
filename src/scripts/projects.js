import "../styles/variables.css";
import "../styles/components.css";
import "../styles/projects.css";
import "@fortawesome/fontawesome-free/css/all.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { initMobileMenu, initActiveNav } from "./nav.js";
import { initThemeToggle } from "./theme.js";

/*
 * To add a project:
 *   1. Add one line to the array below with the project's name, description,
 *      url, and year. The page renders year-grouped cards, newest first.
 */

const projects = [
  { name: "Tradsiee", description: "Video lead generation for Tradies\nEngineered for speed and efficiency over fancy features", url: "https://tradsiee.com", year: 2026, image: "/assets/tradsiee.webp" },
  {
    name: "Adam Beaumont Tiling",
    description: "Melbourne tiler running his business on Tradsiee\nBathroom renovations across the eastern suburbs since 1993",
    url: "https://adambeaumonttiling.com.au",
    year: 2026,
    image: "/assets/adam-beaumont-tiling.webp",
    testimonial: {
      quote: "Tomas created a fantastic and modern website for my small business. His communication and attention to detail made this a seamless process. I highly recommend him.",
      author: "Adam Beaumont",
      business: "Adam Beaumont Tiling",
    },
  },
];

function initProjects() {
  const container = document.getElementById("projects");
  if (!container) return;

  const groups = {};
  for (const project of projects) {
    if (!groups[project.year]) groups[project.year] = [];
    groups[project.year].push(project);
  }

  const years = Object.keys(groups).sort((a, b) => Number(b) - Number(a));

  for (const year of years) {
    const section = document.createElement("section");
    section.className = "projects-section";

    const heading = document.createElement("h2");
    heading.className = "projects-year";
    heading.textContent = year;
    section.appendChild(heading);

    const stack = document.createElement("div");
    stack.className = "projects-stack";

    for (const project of groups[year]) {
      const card = document.createElement("a");
      card.className = "project-feature";
      card.href = project.url;
      card.target = "_blank";
      card.rel = "noopener noreferrer";

      if (project.image) {
        const media = document.createElement("div");
        media.className = "project-feature__media";
        const img = document.createElement("img");
        img.src = project.image;
        img.alt = project.name;
        img.loading = "lazy";
        img.decoding = "async";
        media.appendChild(img);
        card.appendChild(media);
      }

      const top = document.createElement("div");
      top.className = "project-feature__top";

      const text = document.createElement("div");
      const title = document.createElement("h2");
      title.className = "project-feature__title";
      title.textContent = project.name;
      text.appendChild(title);

      const desc = document.createElement("p");
      desc.className = "project-feature__desc";
      // Split description on \n into text nodes + <br>
      const lines = project.description.split("\n");
      lines.forEach((line, i) => {
        if (i > 0) desc.appendChild(document.createElement("br"));
        desc.appendChild(document.createTextNode(line));
      });
      text.appendChild(desc);

      top.appendChild(text);

      const arrow = document.createElement("span");
      arrow.className = "project-feature__arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "→";
      top.appendChild(arrow);

      card.appendChild(top);

      if (project.testimonial) {
        const figure = document.createElement("figure");
        figure.className = "project-feature__testimonial";

        const blockquote = document.createElement("blockquote");
        const quote = document.createElement("p");
        quote.textContent = project.testimonial.quote;
        blockquote.appendChild(quote);
        figure.appendChild(blockquote);

        const figcaption = document.createElement("figcaption");
        const author = document.createElement("strong");
        author.textContent = project.testimonial.author;
        figcaption.appendChild(author);
        if (project.testimonial.business) {
          const business = document.createElement("span");
          business.textContent = project.testimonial.business;
          figcaption.appendChild(business);
        }
        figure.appendChild(figcaption);

        card.appendChild(figure);
      }

      stack.appendChild(card);
    }

    section.appendChild(stack);
    container.appendChild(section);
  }
}

initProjects();

initActiveNav();

AOS.init({
  once: true,
  offset: 80,
  duration: 600,
  easing: "ease-out-cubic",
  disable: "mobile",
});

initMobileMenu();
initThemeToggle();
