const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

document.querySelectorAll('.faq details').forEach(details => {
  const summary = details.querySelector('summary');
  const answer = details.querySelector('p');
  let expanded = details.open;
  let panelAnimation;
  let answerAnimation;
  details.dataset.expanded = String(expanded);

  function settle() {
    panelAnimation?.cancel();
    answerAnimation?.cancel();
    panelAnimation = answerAnimation = null;
    details.open = expanded;
    details.style.removeProperty('height');
    details.style.removeProperty('overflow');
  }

  summary.addEventListener('click', event => {
    event.preventDefault();
    const startHeight = details.getBoundingClientRect().height;
    const startOpacity = details.open ? getComputedStyle(answer).opacity : '0';
    const startTransform = details.open ? getComputedStyle(answer).transform : 'translateY(8px)';
    panelAnimation?.cancel();
    answerAnimation?.cancel();
    expanded = !expanded;
    details.dataset.expanded = String(expanded);
    summary.setAttribute('aria-expanded', String(expanded));

    if (reducedMotion.matches) { settle(); return; }

    // Keep native details semantics; close only after its height animation finishes.
    details.open = true;
    details.style.height = 'auto';
    const naturalHeight = details.getBoundingClientRect().height;
    const style = getComputedStyle(details);
    const closedHeight = summary.getBoundingClientRect().height
      + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)
      + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
    details.style.height = `${startHeight}px`;
    details.style.overflow = 'hidden';
    const duration = expanded ? 420 : 320;
    const options = { duration, easing: 'cubic-bezier(.22,.65,.25,1)', fill: 'both' };
    panelAnimation = details.animate([
      { height: `${startHeight}px` },
      { height: `${expanded ? naturalHeight : closedHeight}px` },
    ], options);
    answerAnimation = answer.animate([
      { opacity: startOpacity, transform: startTransform },
      { opacity: expanded ? 1 : 0, transform: expanded ? 'translateY(0)' : 'translateY(-5px)' },
    ], options);
    panelAnimation.onfinish = settle;
  });

  window.addEventListener('resize', settle);
  reducedMotion.addEventListener('change', settle);
});
