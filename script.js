// Dropdown controller: single file that toggles dropdowns and closes on outside click/ESC
document.addEventListener('DOMContentLoaded', () => {
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  const dropdownMenu = document.querySelector('.dropdown-content');
  const dropdownButtonContainer = document.querySelector('.dropdown');

  if (!dropdownToggle || !dropdownMenu) return;

  // helper to set open/closed state
  function setOpen(isOpen) {
    if (isOpen) {
      dropdownMenu.classList.add('open');
      dropdownToggle.setAttribute('aria-expanded', 'true');
      dropdownMenu.setAttribute('aria-hidden', 'false');
    } else {
      dropdownMenu.classList.remove('open');
      dropdownToggle.setAttribute('aria-expanded', 'false');
      dropdownMenu.setAttribute('aria-hidden', 'true');
    }
  }

  // start closed
  setOpen(false);

  // toggle on click
  dropdownToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdownMenu.classList.contains('open');
    setOpen(!isOpen);
  });

  // keyboard support on toggle button (Enter or Space)
  dropdownToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const isOpen = dropdownMenu.classList.contains('open');
      setOpen(!isOpen);
    } else if (e.key === 'Escape') {
      setOpen(false);
      dropdownToggle.focus();
    }
  });

  // close when pressing Escape while focus is inside the menu
  dropdownMenu.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      setOpen(false);
      dropdownToggle.focus();
    }
  });

  // close when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdownButtonContainer.contains(e.target)) {
      setOpen(false);
    }
  });

  // optional: close on window resize to avoid stuck states
  window.addEventListener('resize', () => setOpen(false));
});
// ===== SEARCH + DROPDOWN FILTER FUNCTIONALITY =====
document.addEventListener("DOMContentLoaded", function () {
  const searchBar = document.getElementById("searchBar");
  const songItems = document.querySelectorAll(".song-item");
  const noResults = document.getElementById("noResults");
  const clearBtn = document.getElementById("clearSearch");
  const decadeDropdown = document.getElementById("decadeDropdown");

  if (!searchBar) return; // only run on songs.html

  function removeHighlights() {
    songItems.forEach(item => {
      item.innerHTML = item.innerHTML.replace(/<mark>|<\/mark>/g, "");
    });
  }

  function performSearch() {
    const query = searchBar.value.toLowerCase().trim();
    const decadeFilter = decadeDropdown ? decadeDropdown.value.toLowerCase() : "";
    let anyVisible = false;

    removeHighlights();

    songItems.forEach(item => {
      const keywords = item.dataset.keywords.toLowerCase();
      const text = item.textContent.toLowerCase();
      const matchesQuery = query === "" || keywords.includes(query) || text.includes(query);
      const matchesDecade = decadeFilter === "" || keywords.includes(decadeFilter);

      if (matchesQuery && matchesDecade) {
        item.style.display = "block";
        anyVisible = true;

        // highlight search text
        if (query !== "") {
          const regex = new RegExp(`(${query})`, "gi");
          item.innerHTML = item.innerHTML.replace(regex, "<mark>$1</mark>");
        }
      } else {
        item.style.display = "none";
      }
    });

    noResults.hidden = anyVisible || (query === "" && decadeFilter === "");
  }

  // events
  searchBar.addEventListener("input", performSearch);
  if (decadeDropdown) decadeDropdown.addEventListener("change", performSearch);
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      searchBar.value = "";
      if (decadeDropdown) decadeDropdown.value = "";
      songItems.forEach(item => (item.style.display = "block"));
      removeHighlights();
      noResults.hidden = true;
    });
  }
});
// ===== TOP NAVBAR SEARCH (HOME PAGE) =====
document.addEventListener("DOMContentLoaded", () => {
  const navSearch = document.getElementById("navSearch");
  if (!navSearch) return; // stops running on other pages

  const searchableSections = document.querySelectorAll("main, header, footer, aside");

  function clearHighlights() {
    searchableSections.forEach(section => {
      section.innerHTML = section.innerHTML.replace(/<mark>|<\/mark>/g, "");
    });
  }

  function performNavSearch() {
    const query = navSearch.value.trim().toLowerCase();
    clearHighlights();

    if (query === "") return;

    let firstMatch = null;

    searchableSections.forEach(section => {
      const regex = new RegExp(`(${query})`, "gi");
      const hasMatch = section.textContent.toLowerCase().includes(query);

      if (hasMatch) {
        section.innerHTML = section.innerHTML.replace(regex, "<mark>$1</mark>");
        if (!firstMatch) firstMatch = section; // remember the first result
      }
    });

    // smooth-scroll to the first highlighted match
    if (firstMatch) {
      firstMatch.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  // run search when user presses Enter
  navSearch.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      performNavSearch();
    }
  });

  // clear highlights when the field is cleared
  navSearch.addEventListener("input", () => {
    if (navSearch.value === "") clearHighlights();
  });
});
// ===== GLOBAL NAVBAR SEARCH (Works Across All Pages) =====
document.addEventListener("DOMContentLoaded", () => {
  const navSearch = document.getElementById("navSearch");
  if (!navSearch) return;

  const searchableSections = document.querySelectorAll("main, header, footer, aside");

  // Clear old highlights
  function clearHighlights() {
    searchableSections.forEach(section => {
      section.innerHTML = section.innerHTML.replace(/<mark>|<\/mark>/g, "");
    });
  }

  // Highlight + scroll on current page
  function performHighlight(query) {
    let firstMatch = null;
    const regex = new RegExp(`(${query})`, "gi");

    searchableSections.forEach(section => {
      if (section.textContent.toLowerCase().includes(query)) {
        section.innerHTML = section.innerHTML.replace(regex, "<mark>$1</mark>");
        if (!firstMatch) firstMatch = section;
      }
    });

    if (firstMatch) {
      firstMatch.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  // Handle search logic
  function handleSearch() {
    const query = navSearch.value.trim().toLowerCase();
    clearHighlights();

    if (query === "") return;

    // ======== Cross-page keywords ========
    const redirects = {
      "song": "songs.html",
      "songs": "songs.html",
      "band": "bands.html",
      "bands": "bands.html",
      "Michael Jackson": "songs.html#1950s",
      "Madonna": "songs.html",
      "Bob Marley": "songs.html",
      "The Beatles": "songs.html",
      "Elvis Presley": "songs.html",
      "The Rolling Stones": "songs.html",
      "Elton John": "songs.html",
      "David Bowie": "songs.html",
      "Prince": "songs.html",
      "contact": "bands.html",
      "form": "index.html#message"
    };

    // Check for redirect match
    for (const key in redirects) {
      if (query.includes(key)) {
        window.location.href = redirects[key];
        return;
      }
    }

    // Otherwise, just highlight matches on this page
    performHighlight(query);
  }

  // Press Enter to search
  navSearch.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  });

  // Remove highlights when input cleared
  navSearch.addEventListener("input", () => {
    if (navSearch.value === "") clearHighlights();
  });
});
// ===== ACCESSIBILITY FEATURES =====
document.addEventListener("DOMContentLoaded", () => {
  const contrastBtn = document.getElementById("toggleContrast");
  const increaseBtn = document.getElementById("increaseText");
  const decreaseBtn = document.getElementById("decreaseText");

  // Safety check: only run on pages with these buttons
  if (!contrastBtn) return;

  // 1️⃣ High-contrast mode
  contrastBtn.addEventListener("click", () => {
    document.body.classList.toggle("high-contrast");
  });

  // 2️⃣ Text size controls
  let currentScale = 1;

  function updateTextSize() {
    document.body.style.fontSize = `${currentScale}em`;
  }

  increaseBtn.addEventListener("click", () => {
    if (currentScale < 1.6) {
      currentScale += 0.1;
      updateTextSize();
    }
  });

  decreaseBtn.addEventListener("click", () => {
    if (currentScale > 0.8) {
      currentScale -= 0.1;
      updateTextSize();
    }
  });
});

// ===== BACK TO TOP BUTTON FUNCTIONALITY =====
document.addEventListener("DOMContentLoaded", () => {
  const backToTopBtn = document.getElementById("backToTop");
  if (!backToTopBtn) return;

  // Show button after scrolling down 300px
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  });

  // Scroll smoothly to top when clicked
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
// Accordion toggle
const headers = document.querySelectorAll(".accordion-header");

headers.forEach(header => {
  header.addEventListener("click", () => {
    const content = header.nextElementSibling;

    // Close others when opening one (optional)
    document.querySelectorAll(".accordion-content").forEach(item => {
      if (item != content) item.classList.remove("open");
    });

    // Toggle current section
    content.classList.toggle("open");
  });
});

const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImg");
const caption = document.getElementById("caption");
const closeBtn = document.querySelector(".close");
const galleryItems = document.querySelectorAll(".gallery-item");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentIndex = 0;

// open modal
galleryItems.forEach((img, index) => {
  img.addEventListener("click", () => {
    modal.style.display = "block";
    modalImg.src = img.src;
    caption.textContent = img.alt;
    currentIndex = index;
  });
});

// close modal
closeBtn.addEventListener("click", () => modal.style.display = "none");

// navigation
prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
  modalImg.src = galleryItems[currentIndex].src;
  caption.textContent = galleryItems[currentIndex].alt;
});

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % galleryItems.length;
  modalImg.src = galleryItems[currentIndex].src;
  caption.textContent = galleryItems[currentIndex].alt;
});

// click outside to close
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

// ESC to close
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") modal.style.display = "none";
});
