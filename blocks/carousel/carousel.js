import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  try {
    const nodes = Array.from(block.children)
      .filter((n) => (n.nodeType === 1)
        && (n.textContent.trim().length > 0 || n.querySelector('img')));

    const slides = [];

    // Pair label+image rows → slides
    for (let i = 0; i < nodes.length; i += 1) {
      const curr = nodes[i];
      const next = nodes[i + 1];

      if (
        next
        && next.querySelector
        && next.querySelector('img')
        && /image\s*\d+/i.test(curr.textContent)
      ) {
        slides.push({ labelNode: curr, pictureNode: next });
        i += 1;
      } else if (curr.querySelector && curr.querySelector('img')) {
        slides.push({ labelNode: null, pictureNode: curr });
      } else {
        slides.push({ labelNode: null, pictureNode: curr });
      }
    }

    const ul = document.createElement('ul');
    ul.className = 'carousel-list';
    ul.setAttribute('role', 'list');

    slides.forEach((s) => {
      const li = document.createElement('li');
      li.className = 'carousel-item';
      li.setAttribute('role', 'listitem');

      if (s.labelNode) li.appendChild(s.labelNode.cloneNode(true));

      if (s.pictureNode) {
        const img = s.pictureNode.querySelector('img');
        if (img && img.src && typeof createOptimizedPicture === 'function') {
          const pic = createOptimizedPicture(img.src, img.alt || '', false, [
            { width: '1200' },
          ]);
          li.appendChild(pic);
        } else {
          li.appendChild(s.pictureNode.cloneNode(true));
        }
      }

      ul.appendChild(li);
    });

    block.replaceChildren(ul);

    // Prev button
    const prev = document.createElement('button');
    prev.className = 'carousel-prev';
    prev.type = 'button';
    prev.setAttribute('aria-label', 'Previous slide');
    prev.textContent = '◀';
    prev.addEventListener('click', () => {
      ul.scrollBy({ left: -Math.round(block.clientWidth * 0.8), behavior: 'smooth' });
    });
    block.appendChild(prev);

    // Next button
    const next = document.createElement('button');
    next.className = 'carousel-next';
    next.type = 'button';
    next.setAttribute('aria-label', 'Next slide');
    next.textContent = '▶';
    next.addEventListener('click', () => {
      ul.scrollBy({ left: Math.round(block.clientWidth * 0.8), behavior: 'smooth' });
    });
    block.appendChild(next);

    // Keyboard navigation
    block.tabIndex = 0;
    block.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        ul.scrollBy({ left: 300, behavior: 'smooth' });
      }
      if (e.key === 'ArrowLeft') {
        ul.scrollBy({ left: -300, behavior: 'smooth' });
      }
    });

    // Touch swipe
    let startX = 0;
    let isDown = false;

    ul.addEventListener(
      'touchstart',
      (ev) => {
        isDown = true;
        startX = ev.touches[0].clientX;
      },
      { passive: true },
    );

    ul.addEventListener(
      'touchmove',
      (ev) => {
        if (!isDown) return;
        const x = ev.touches[0].clientX;
        const dx = startX - x;
        ul.scrollLeft += dx;
        startX = x;
      },
      { passive: true },
    );

    ul.addEventListener('touchend', () => {
      isDown = false;
    });
  } catch (err) {
    /* eslint-disable-next-line no-console */
    console.error('[carousel] decorate error', err);
  }
}
