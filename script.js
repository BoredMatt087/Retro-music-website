// Dropdown controller: handles hover dropdowns with click-outside close support
document.addEventListener('DOMContentLoaded', () => {
  const dropdowns = document.querySelectorAll('.dropdown');

  if (dropdowns.length === 0) return;

  // Close all dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    dropdowns.forEach(dropdown => {
      if (!dropdown.contains(e.target)) {
        const content = dropdown.querySelector('.dropdown-content');
        if (content) {
          content.classList.remove('open');
          content.setAttribute('aria-hidden', 'true');
        }
      }
    });
  });

  // Close dropdown on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdowns.forEach(dropdown => {
        const content = dropdown.querySelector('.dropdown-content');
        if (content) {
          content.classList.remove('open');
          content.setAttribute('aria-hidden', 'true');
        }
      });
    }
  });
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

    // Check if we're on songs.html and search matches an accordion item
    const accordionItems = document.querySelectorAll(".accordion-item");
    if (accordionItems.length > 0) {
      accordionItems.forEach(item => {
        const header = item.querySelector(".accordion-header");
        const content = item.querySelector(".accordion-content");
        if (header && header.textContent.toLowerCase().includes(query)) {
          // Open the accordion
          content.classList.add("open");
          // Highlight the header
          header.innerHTML = header.innerHTML.replace(regex, "<mark>$1</mark>");
          // Scroll to it
          if (!firstMatch) {
            firstMatch = item;
          }
        }
      });
    }

    // Also search in regular sections
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
      "home": "index.html",
      "homepage": "index.html",
      "song": "songs.html",
      "songs": "songs.html",
      "band": "bands.html",
      "bands": "bands.html",
      "michael jackson": "songs.html#Michael Jackson",
      "madonna": "songs.html#Madonna",
      "bob marley": "songs.html#Bob Marley",
      "the beatles": "songs.html#The Beatles",
      "beatles": "songs.html#The Beatles",
      "elvis presley": "songs.html#Elvis Presley",
      "elvis": "songs.html#Elvis Presley",
      "rolling stones": "songs.html#The Rolling Stones",
      "elton john": "songs.html#Elton John",
      "david bowie": "songs.html#David Bowie",
      "bowie": "songs.html#David Bowie",
      "prince": "songs.html#Prince",
      "marvin gaye": "bands.html#1960s",
      "black sabbath": "bands.html#1970s",
      "sabbath": "bands.html#1970s",
      "fleetwood mac": "bands.html#1970s",
      "ac/dc": "bands.html#1980s",
      "acdc": "bands.html#1980s",
      "1960s": "bands.html#1960s",
      "1970s": "bands.html#1970s",
      "1980s": "bands.html#1980s",
      "contact": "index.html#message",
      "form": "index.html#message"
    };

    // Normalize redirect keys to lowercase so matching works regardless of input case
    const normalizedRedirects = {};
    for (const key in redirects) {
      normalizedRedirects[key.toLowerCase()] = redirects[key];
    }

    // Check for redirect match using lowercased keys
    for (const key in normalizedRedirects) {
      if (query.includes(key)) {
        window.location.href = normalizedRedirects[key];
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

// Open accordion item if URL has hash matching an accordion item ID
document.addEventListener("DOMContentLoaded", () => {
  const hash = window.location.hash.substring(1); // Remove the #
  if (hash) {
    const accordionItem = document.getElementById(hash);
    if (accordionItem && accordionItem.classList.contains("accordion-item")) {
      const content = accordionItem.querySelector(".accordion-content");
      if (content) {
        content.classList.add("open");
        setTimeout(() => {
          accordionItem.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      }
    }
  }
});

const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImg");
const caption = document.getElementById("caption");
const closeBtn = document.querySelector(".close");
const galleryItems = document.querySelectorAll(".gallery-item");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentIndex = 0;

// open modal for gallery images
galleryItems.forEach((img, index) => {
  img.addEventListener("click", () => {
    modal.style.display = "block";
    modalImg.src = img.src;
    caption.textContent = img.alt;
    currentIndex = index;
    prevBtn.style.display = "block";
    nextBtn.style.display = "block";
  });
});

// open modal for standalone Elvis image
const elvisTrigger = document.getElementById("beatlesModalTrigger");
if (elvisTrigger) {
  elvisTrigger.addEventListener("click", () => {
    modal.style.display = "block";
    modalImg.src = elvisTrigger.src;
    caption.textContent = elvisTrigger.alt;
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
  });
}

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
// Specific modal for Elvis Presley image
document.addEventListener('DOMContentLoaded', function() {
  var elvisTrigger = document.getElementById('beatlesModalTrigger');
  var modal = document.getElementById('imageModal');
  var modalImg = document.getElementById('modalImg');
  var caption = document.getElementById('caption');
  if (elvisTrigger && modal && modalImg && caption) {
    elvisTrigger.addEventListener('click', function() {
      modal.style.display = 'block';
      modalImg.src = elvisTrigger.src;
      caption.textContent = elvisTrigger.alt;
    });
  }
});