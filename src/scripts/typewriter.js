export function initTypewriter(elementId = 'typewriter', phrases = ['a Web Developer.', 'a Photographer.', 'a Creator.']) {
  const el = document.getElementById(elementId);
  if (!el) return;

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const current = phrases[phraseIndex];
    el.textContent = isDeleting ? current.substring(0, charIndex - 1) : current.substring(0, charIndex + 1);
    charIndex += isDeleting ? -1 : 1;

    let speed = isDeleting ? 50 : 100;
    if (!isDeleting && charIndex === current.length) { isDeleting = true; speed = 2000; }
    else if (isDeleting && charIndex === 0) { isDeleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; speed = 500; }

    setTimeout(type, speed);
  }

  type();
}
