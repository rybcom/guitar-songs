window.addEventListener('DOMContentLoaded', (event) => {
  const stickyToggle = document.querySelector('.stickyToggle');
  const stickyHeaders = document.querySelectorAll('.sticky-header');
  const contents = document.querySelectorAll('.content');

  stickyToggle.addEventListener('change', function() {
    if (this.checked) {
      stickyHeaders.forEach(header => header.classList.add('sticky-header-active'));
    } else {
      stickyHeaders.forEach(header => header.classList.remove('sticky-header-active'));
    }
  });
});

class StickyHeaderToggleController extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <label>
        <input type="checkbox" class="stickyToggle" /> Sticky header 
      </label>
    `;
  }
}

customElements.define("sticky-header-toggle-controller", StickyHeaderToggleController);
