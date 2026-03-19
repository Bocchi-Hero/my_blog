export function initArchiveFilters() {
  const roots = document.querySelectorAll<HTMLElement>("[data-archive-page]");

  roots.forEach((root) => {
    if (root.dataset.archiveReady === "true") {
      return;
    }
    root.dataset.archiveReady = "true";

    const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-year-filter]"));
    const archiveSection = root.nextElementSibling;
    const groups = archiveSection
      ? Array.from(archiveSection.querySelectorAll<HTMLElement>("[data-year-group]"))
      : [];

    if (!buttons.length || !groups.length) {
      return;
    }

    const applyYear = (year: string) => {
      buttons.forEach((button) => {
        button.classList.toggle("active", button.dataset.yearFilter === year);
      });

      groups.forEach((group) => {
        const visible = year === "all" || group.dataset.yearGroup === year;
        group.hidden = !visible;
      });
    };

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        applyYear(button.dataset.yearFilter ?? "all");
      });
    });
  });
}
