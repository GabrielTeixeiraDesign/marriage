// Smooth desktop wheel movement without transforming the page or breaking sticky sections.
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const desktopPointer = matchMedia('(hover: hover) and (pointer: fine)');
let frame = 0;
let target = window.scrollY;
let lastTime = 0;

function stop() {
  cancelAnimationFrame(frame);
  frame = 0;
  lastTime = 0;
  target = window.scrollY;
  document.documentElement.classList.remove('wheel-smoothing');
}

function maximumScroll() {
  return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
}

function animate(time) {
  const dt = Math.min(50, lastTime ? time - lastTime : 16.67);
  lastTime = time;
  target = Math.max(0, Math.min(target, maximumScroll()));
  const current = window.scrollY;
  const next = current + (target - current) * (1 - Math.exp(-dt / 90));
  window.scrollTo({ top: next, behavior: 'instant' });
  if (Math.abs(target - window.scrollY) < 3) {
    window.scrollTo({ top: target, behavior: 'instant' });
    stop();
    return;
  }
  frame = requestAnimationFrame(animate);
}

function hasScrollableParent(node, delta) {
  let element = node instanceof Element ? node : node?.parentElement;
  while (element && element !== document.body && element !== document.documentElement) {
    const { overflowY } = getComputedStyle(element);
    if (/(auto|scroll)/.test(overflowY) && element.scrollHeight > element.clientHeight + 1) {
      if (delta < 0 ? element.scrollTop > 0 : element.scrollTop + element.clientHeight < element.scrollHeight - 1) return true;
    }
    element = element.parentElement;
  }
  return false;
}

window.addEventListener('wheel', event => {
  if (motion.matches || !desktopPointer.matches || event.ctrlKey || event.metaKey || event.shiftKey || !event.deltaY || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
  if (document.body.classList.contains('menu-open') || document.querySelector('dialog[open]') || hasScrollableParent(event.target, event.deltaY)) {
    stop();
    return;
  }
  const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
  const delta = event.deltaY * unit;
  if (!frame) target = window.scrollY;
  const nextTarget = Math.max(0, Math.min(target + delta, maximumScroll()));
  if (nextTarget === target) {
    if (frame) event.preventDefault();
    return;
  }
  event.preventDefault();
  target = nextTarget;
  if (!frame) {
    document.documentElement.classList.add('wheel-smoothing');
    frame = requestAnimationFrame(animate);
  }
}, { passive: false });

// Let native anchor scrolling, keyboard navigation, touch and the scrollbar take over immediately.
window.addEventListener('pointerdown', stop, { passive: true });
window.addEventListener('touchstart', stop, { passive: true });
window.addEventListener('keydown', stop);
window.addEventListener('resize', stop);
window.addEventListener('hashchange', stop);
document.addEventListener('click', stop, { capture: true });
motion.addEventListener('change', stop);
desktopPointer.addEventListener('change', stop);
