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