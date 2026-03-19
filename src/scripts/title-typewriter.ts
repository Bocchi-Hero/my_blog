const TITLE_SELECTOR = "main h1";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function nextDelay(lastChar: string | undefined) {
  if (!lastChar) {
    return 42;
  }

  if (/[\u3400-\u9FFF]/.test(lastChar)) {
    return 66;
  }

  if (/\s/.test(lastChar)) {
    return 72;
  }

  if (/[,.!?;:，。！？；：]/.test(lastChar)) {
    return 112;
  }

  return 42;
}

export function initTitleTypewriter() {
  if (prefersReducedMotion()) {
    return;
  }

  const headings = document.querySelectorAll<HTMLHeadingElement>(TITLE_SELECTOR);

  headings.forEach((heading) => {
    if (heading.dataset.typewriterDone === "true") {
      return;
    }

    const originalText = (heading.textContent ?? "").trim();
    if (!originalText) {
      return;
    }

    const chars = Array.from(originalText);
    heading.dataset.typewriterDone = "true";
    heading.setAttribute("aria-label", originalText);
    heading.textContent = "";

    const textNode = document.createElement("span");
    textNode.className = "typewriter-title is-typing";
    textNode.setAttribute("aria-hidden", "true");
    heading.append(textNode);

    let index = 0;

    const typeNext = () => {
      index += 1;
      textNode.textContent = chars.slice(0, index).join("");

      if (index >= chars.length) {
        textNode.classList.remove("is-typing");
        return;
      }

      window.setTimeout(typeNext, nextDelay(chars[index - 1]));
    };

    window.setTimeout(typeNext, 180);
  });
}
