interface SearchItem {
  title: string;
  description: string;
  url: string;
  keywords: string;
  tags: string[];
}

interface SearchWidgetConfig {
  maxVisible: number;
  showOnFocus: boolean;
  closeOnOutsideClick: boolean;
  closeOnEscape: boolean;
}

const searchCache = new Map<string, Promise<SearchItem[]>>();

function parseConfig(root: HTMLElement): SearchWidgetConfig {
  const maxFromAttr = Number(root.dataset.searchMax ?? "8");
  const maxVisible = Number.isFinite(maxFromAttr) && maxFromAttr > 0 ? Math.floor(maxFromAttr) : 8;

  return {
    maxVisible,
    showOnFocus: root.dataset.searchFocus === "true",
    closeOnOutsideClick: root.dataset.searchOutsideClose === "true",
    closeOnEscape: root.dataset.searchEscapeClose === "true",
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

function highlightText(text: string, query: string) {
  if (!query) {
    return escapeHtml(text);
  }

  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matcher = new RegExp(`(${escapedQuery})`, "ig");
  return escapeHtml(text).replace(matcher, "<mark>$1</mark>");
}

function getSearchItems(source: string) {
  if (!searchCache.has(source)) {
    searchCache.set(
      source,
      fetch(source)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to load search data from ${source}`);
          }
          return response.json() as Promise<SearchItem[]>;
        })
        .catch(() => [])
    );
  }

  return searchCache.get(source)!;
}

export function initSearchWidgets() {
  const roots = document.querySelectorAll<HTMLElement>("[data-search-widget]");

  roots.forEach((root) => {
    if (root.dataset.searchReady === "true") {
      return;
    }
    root.dataset.searchReady = "true";

    const input = root.querySelector<HTMLInputElement>("[data-search-input]");
    const results = root.querySelector<HTMLElement>("[data-search-results]");
    const hint = root.querySelector<HTMLElement>("[data-search-hint]");
    const empty = root.querySelector<HTMLElement>("[data-search-empty]");

    if (!input || !results || !empty) {
      return;
    }

    const config = parseConfig(root);
    const source = root.dataset.searchSource;
    if (!source) {
      return;
    }

    let activeIndex = -1;
    let latestRun = 0;
    let visibleItems: SearchItem[] = [];

    const render = (query: string) => {
      results.innerHTML = "";

      visibleItems.forEach((item, index) => {
        const entry = document.createElement("li");
        entry.dataset.searchItem = "true";
        entry.role = "option";
        entry.setAttribute("aria-selected", index === activeIndex ? "true" : "false");
        entry.classList.toggle("active", index === activeIndex);

        const link = document.createElement("a");
        link.href = item.url;
        link.innerHTML = `
          <strong>${highlightText(item.title, query)}</strong>
          <span>${highlightText(item.description, query)}</span>
        `;

        entry.addEventListener("mouseenter", () => {
          activeIndex = index;
          render(query);
        });

        entry.append(link);
        results.append(entry);
      });
    };

    const update = async () => {
      const runId = latestRun + 1;
      latestRun = runId;
      const query = input.value.trim().toLowerCase();
      const hasQuery = query.length > 0;
      if (!hasQuery) {
        activeIndex = -1;
        visibleItems = [];
        results.innerHTML = "";
        results.hidden = true;
        empty.hidden = true;
        if (hint) {
          hint.hidden = false;
        }
        input.setAttribute("aria-expanded", "false");
        return;
      }

      const items = await getSearchItems(source);
      if (runId !== latestRun) {
        return;
      }

      visibleItems = items.filter((item) => item.keywords.includes(query)).slice(0, config.maxVisible);
      activeIndex = visibleItems.length > 0 ? Math.min(activeIndex, visibleItems.length - 1) : -1;
      render(query);

      results.hidden = visibleItems.length === 0;
      empty.hidden = visibleItems.length > 0;
      if (hint) {
        hint.hidden = hasQuery;
      }
      input.setAttribute("aria-expanded", visibleItems.length > 0 ? "true" : "false");
    };

    input.addEventListener("input", update);
    if (config.showOnFocus) {
      input.addEventListener("focus", update);
    }

    input.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") {
        if (!visibleItems.length) {
          return;
        }
        event.preventDefault();
        activeIndex = (activeIndex + 1 + visibleItems.length) % visibleItems.length;
        render(input.value.trim().toLowerCase());
        return;
      }

      if (event.key === "ArrowUp") {
        if (!visibleItems.length) {
          return;
        }
        event.preventDefault();
        activeIndex = (activeIndex - 1 + visibleItems.length) % visibleItems.length;
        render(input.value.trim().toLowerCase());
        return;
      }

      if (event.key === "Enter") {
        const target = visibleItems[activeIndex] ?? visibleItems[0];
        if (!target) {
          return;
        }
        event.preventDefault();
        window.location.href = target.url;
      }
    });

    if (config.closeOnOutsideClick) {
      document.addEventListener("click", (event) => {
        if (!root.contains(event.target as Node)) {
          results.hidden = true;
          empty.hidden = true;
        }
      });
    }

    if (config.closeOnEscape) {
      input.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          results.hidden = true;
          empty.hidden = true;
          input.blur();
        }
      });
    }

    update();
  });
}
