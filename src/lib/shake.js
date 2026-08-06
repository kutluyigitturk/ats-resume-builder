// Nudges an element sideways to draw the eye back to it.
//
// Uses the Web Animations API rather than a CSS class because this has to
// replay on every failed attempt. A class would have to be removed, the
// layout flushed, and the class re-added to fire a second time.
//
// Motion is never the whole message here: the error text stays on screen
// either way, so skipping the animation costs the user nothing.
export function shake(element) {
  if (!element) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  element.animate(
    [
      { translate: "0" },
      { translate: "-5px" },
      { translate: "5px" },
      { translate: "-3px" },
      { translate: "0" },
    ],
    { duration: 220, easing: "ease-out" }
  );
}
