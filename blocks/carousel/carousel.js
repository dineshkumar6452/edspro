// blocks/carousel/carousel.js
import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  try {

    // Build ul/li structure (same approach as card.js)
    const ul = document.createElement('ul');
    ul.className = 'carousel-list';

    [...block.children].forEach((row) => {
      const li = document.createElement('li');
      li.className = 'carousel-item';
      // move children of row into li
      while (row.firstElementChild) li.append(row.firstElementChild);
      // classify inner divs (keeps parity with card.js)
      [...li.children].forEach((div) => {
        if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
        else div.className = 'cards-card-body';
      });
      ul.append(li);
    });

    // replace images with optimized pictures (if any)
    ul.querySelectorAll('picture > img').forEach((img) => {
      const picture = img.closest('picture');
      if (picture && img.src) {
        picture.replaceWith(createOptimizedPicture(img.src, img.alt || '', false, [{ width: '750' }]));
      }
    });

    // Clear block and append new ul
    block.replaceChildren(ul);

    // Style container for horizontal scroll (inline defensive styles)
    ul.style.display = 'flex';
    ul.style.gap = '16px';
    ul.style.overflowX = 'auto';
    ul.style.scrollBehavior = 'smooth';
    ul.style.padding = '8px 0';
    ul.style.listStyle = 'none';
    ul.style.margin = '0';

    // Make each item a non-wrapping flex child
    const items = Array.from(ul.children);
    items.forEach((item) => {
      item.style.flex = '0 0 auto';
      item.style.minWidth = item.style.minWidth || '280px';
    });

    // Add prev/next buttons (if not already present)
    if (!block.querySelector('.carousel-prev')) {
      const prev = document.createElement('button');
      prev.className = 'carousel-prev';
      prev.setAttribute('aria-label', 'Previous');
      prev.innerHTML = '◀';
      prev.addEventListener('click', () => {
        ul.scrollBy({ left: -Math.round(block.clientWidth * 0.8), behavior: 'smooth' });
      });
      block.appendChild(prev);
    }

    if (!block.querySelector('.carousel-next')) {
      const next = document.createElement('button');
      next.className = 'carousel-next';
      next.setAttribute('aria-label', 'Next');
      next.innerHTML = '▶';
      next.addEventListener('click', () => {
        ul.scrollBy({ left: Math.round(block.clientWidth * 0.8), behavior: 'smooth' });
      });
      block.appendChild(next);
    }

    // Accessibility: keyboard support for arrows when focus is within carousel
    block.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') ul.scrollBy({ left: 300, behavior: 'smooth' });
      if (e.key === 'ArrowLeft') ul.scrollBy({ left: -300, behavior: 'smooth' });
    });

    
  } catch (err) {
  }
}
