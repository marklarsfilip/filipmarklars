/**
 * Svelte action that adds scroll-triggered entrance animations.
 * Uses Intersection Observer to add 'is-visible' class when element enters viewport.
 * Supports stagger delay via parameter.
 *
 * Usage: <div use:animateOnScroll> or <div use:animateOnScroll={{ delay: 200 }}>
 */
export function animateOnScroll(
  node: HTMLElement,
  params?: { delay?: number }
) {
  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) {
    // Skip animation entirely — element is already visible via CSS
    node.classList.add('animate-on-scroll', 'is-visible');
    return { destroy() {} };
  }

  node.classList.add('animate-on-scroll');

  if (params?.delay) {
    node.style.transitionDelay = `${params.delay}ms`;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.1 }
  );

  observer.observe(node);

  return {
    destroy() {
      observer.disconnect();
    },
  };
}
