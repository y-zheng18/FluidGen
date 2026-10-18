const COMPARE_IDS = ['001', '008', '018', '021', '023'];
const GALLERY = [
  'supp_28', 'wild_022', 'supp_02', 'supp_34', 'wild_007', 'ink_007',
  'supp_29', 'wild_003', 'supp_03', 'supp_35', 'supp_04',
  'supp_33', 'wild_002', 'ink_015', 'supp_36', 'wild_015', 'supp_43',
  'wild_019', 'supp_32', 'ink_002', 'wild_004', 'supp_39', 'ink_004',
  'wild_009', 'supp_05', 'supp_37', 'ink_014',
  'wild_020', 'supp_01', 'supp_08',
];

// Play videos only while visible; load their source on first view.
const lazyObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const v = entry.target;
    if (entry.isIntersecting) {
      if (v.dataset.src && !v.src) {
        v.src = v.dataset.src;
      }
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  });
}, { rootMargin: '200px 0px' });

function observeLazy(root = document) {
  root.querySelectorAll('video.lazy-video').forEach((v) => lazyObserver.observe(v));
}

// Swap a video's source while keeping playback position.
function swapSource(video, src) {
  const t = video.currentTime;
  video.src = src;
  video.addEventListener('loadedmetadata', () => {
    video.currentTime = Math.min(t, video.duration - 0.05);
    video.play().catch(() => {});
  }, { once: true });
}

function setupShapes() {
  document.querySelectorAll('.shape-card').forEach((card) => {
    const video = card.querySelector('video');
    const buttons = card.querySelectorAll('.stream-tabs button');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        swapSource(video, `./static/videos/shapes/${card.dataset.name}_${btn.dataset.stream}.mp4`);
      });
    });
  });
}

function setupCompare() {
  const video = document.getElementById('compare-video');
  const strip = document.getElementById('compare-thumbs');
  COMPARE_IDS.forEach((id, i) => {
    const btn = document.createElement('button');
    btn.className = 'thumb' + (i === 0 ? ' is-active' : '');
    btn.setAttribute('aria-label', `Comparison ${id}`);
    btn.innerHTML = `<img src="./static/videos/compare/${id}.jpg" alt="" loading="lazy"><span class="thumb-id">${id}</span>`;
    btn.addEventListener('click', () => {
      strip.querySelectorAll('.thumb').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      video.src = `./static/videos/compare/${id}.mp4`;
      video.play().catch(() => {});
    });
    strip.appendChild(btn);
  });
}

function setupGallery() {
  const grid = document.getElementById('gallery-grid');
  grid.innerHTML = GALLERY.map((name) => `
    <div class="video-card">
      <video class="lazy-video" muted loop playsinline preload="none"
             data-src="./static/videos/gallery/${name}.mp4"></video>
    </div>`).join('');
}

function setupBibtex() {
  const btn = document.getElementById('copy-bib');
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(document.getElementById('bibtex').innerText);
      btn.querySelector('span:last-child').textContent = 'Copied';
      setTimeout(() => { btn.querySelector('span:last-child').textContent = 'Copy'; }, 1500);
    } catch (e) { /* clipboard unavailable */ }
  });
}

function setupMath() {
  if (window.renderMathInElement) {
    renderMathInElement(document.body, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
      ],
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setupShapes();
  setupCompare();
  setupGallery();
  setupBibtex();
  observeLazy();
});
window.addEventListener('load', setupMath);
