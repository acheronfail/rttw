// Cycles through an array looping around from the end to the start (mathematical mod)
export const cycleArray = (arr, i) => (i % arr.length + arr.length) % arr.length;

// Resets the CSS animation of elements with the given class
export const resetCSSAnimation = (cls) => {
  [...document.querySelectorAll(`.${cls}`)].forEach((element) => {
    element.classList.remove(cls);
    void element.offsetWidth;
    element.classList.add(cls);
  });
};

// CodeMirror helpers
export const firstPos = () => ({ line: 0, ch: 0 });
export const lastPos = (cm) => {
  let line = cm.lastLine();
  let ch = cm.getLine(line).length;
  return { line, ch };
};
