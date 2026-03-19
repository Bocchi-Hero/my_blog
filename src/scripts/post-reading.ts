export function initPostReading() {
  const roots = document.querySelectorAll<HTMLElement>("[data-post-page]");

  roots.forEach((root) => {
    if (root.dataset.postReady === "true") {
      return;
    }
    root.dataset.postReady = "true";

    const progressBar = root.querySelector<HTMLElement>("[data-reading-progress]");
    const progressLabel = root.querySelector<HTMLElement>("[data-reading-progress-label]");
    const articleBody = root.querySelector<HTMLElement>(".article-body");
    const lightbox = root.querySelector<HTMLElement>("[data-lightbox]");
    const lightboxImage = root.querySelector<HTMLImageElement>("[data-lightbox-image]");
    const lightboxCaption = root.querySelector<HTMLElement>("[data-lightbox-caption]");
    const lightboxClose = root.querySelector<HTMLButtonElement>("[data-lightbox-close]");

    if (progressBar && progressLabel && articleBody) {
      const updateProgress = () => {
        const rect = articleBody.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const total = Math.max(rect.height - viewportHeight * 0.45, 1);
        const progressed = Math.min(Math.max(-rect.top + viewportHeight * 0.2, 0), total);
        const percent = Math.round((progressed / total) * 100);
        progressBar.style.width = `${percent}%`;
        progressLabel.textContent = `${percent}%`;
      };

      updateProgress();
      document.addEventListener("scroll", updateProgress, { passive: true });
      window.addEventListener("resize", updateProgress);
    }

    const preBlocks = Array.from(root.querySelectorAll<HTMLElement>(".article-body pre"));
    preBlocks.forEach((pre) => {
      if (pre.querySelector(".copy-code-button")) {
        return;
      }

      const code = pre.querySelector("code");
      const text = code?.textContent?.trim();
      if (!text) {
        return;
      }

      pre.classList.add("enhanced-code");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "copy-code-button";
      button.setAttribute("aria-label", "Copy code");
      button.innerHTML = `
        <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
          <rect x="5.25" y="3.25" width="7" height="9" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.3"></rect>
          <path d="M3.75 10.75h-.5a1.5 1.5 0 0 1-1.5-1.5v-6a1.5 1.5 0 0 1 1.5-1.5h5.5" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"></path>
        </svg>
      `;
      button.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(text);
          button.innerHTML = `
            <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
              <path d="M3.5 8.25 6.5 11l6-6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          `;
          button.classList.add("copied");
          window.setTimeout(() => {
            button.innerHTML = `
              <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
                <rect x="5.25" y="3.25" width="7" height="9" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.3"></rect>
                <path d="M3.75 10.75h-.5a1.5 1.5 0 0 1-1.5-1.5v-6a1.5 1.5 0 0 1 1.5-1.5h5.5" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"></path>
              </svg>
            `;
            button.classList.remove("copied");
          }, 1200);
        } catch {
          button.innerHTML = `
            <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
              <path d="M5 5 11 11M11 5l-6 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
            </svg>
          `;
          window.setTimeout(() => {
            button.innerHTML = `
              <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
                <rect x="5.25" y="3.25" width="7" height="9" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.3"></rect>
                <path d="M3.75 10.75h-.5a1.5 1.5 0 0 1-1.5-1.5v-6a1.5 1.5 0 0 1 1.5-1.5h5.5" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"></path>
              </svg>
            `;
          }, 1200);
        }
      });
      pre.append(button);
    });

    const openLightbox = (image: HTMLImageElement) => {
      if (!lightbox || !lightboxImage || !lightboxCaption) {
        return;
      }
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt;
      lightboxCaption.textContent = image.alt;
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
      if (!lightbox || !lightboxImage || !lightboxCaption) {
        return;
      }
      lightbox.hidden = true;
      lightboxImage.src = "";
      lightboxImage.alt = "";
      lightboxCaption.textContent = "";
      document.body.style.overflow = "";
    };

    const images = Array.from(
      root.querySelectorAll<HTMLImageElement>(".hero-image, .article-body img")
    );
    images.forEach((image) => {
      if (image.closest("[data-lightbox]")) {
        return;
      }
      image.classList.add("article-lightbox-target");
      image.addEventListener("click", () => openLightbox(image));
    });

    lightboxClose?.addEventListener("click", closeLightbox);
    lightbox?.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    const tocLinks = Array.from(root.querySelectorAll<HTMLAnchorElement>("[data-toc-link]"));
    if (tocLinks.length > 0) {
      const headings = tocLinks
        .map((link) => {
          const id = link.getAttribute("href")?.replace(/^#/, "");
          if (!id) {
            return undefined;
          }
          const heading = root.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
          if (!heading) {
            return undefined;
          }
          return { id, link, heading };
        })
        .filter(Boolean) as { id: string; link: HTMLAnchorElement; heading: HTMLElement }[];

      if (headings.length > 0) {
        const observer = new IntersectionObserver(
          (entries) => {
            const visible = entries
              .filter((entry) => entry.isIntersecting)
              .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

            if (!visible) {
              return;
            }

            const activeId = visible.target.id;
            headings.forEach(({ id, link }) => {
              link.classList.toggle("active", id === activeId);
            });
          },
          {
            rootMargin: "-20% 0px -65% 0px",
            threshold: [0, 1],
          }
        );

        headings.forEach(({ heading }) => observer.observe(heading));
      }
    }

    const backTop = root.querySelector<HTMLAnchorElement>("[data-back-top]");
    if (backTop) {
      backTop.addEventListener("click", (event) => {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox && !lightbox.hidden) {
        closeLightbox();
      }
    });
  });
}
