import { keyframes } from 'styled-components';

// Cycles through an array looping around from the end to the start (mathematical mod)
export const cycleArray = (length, i) => (i % length + length) % length;

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

export const noop = () => {};

// Perform a simple GET request
export const performGetRequest = (url) => {
  return fetch(url).then((response) => {
    if (response.ok) return response.json();
    throw new Error(response.statusText);
  });
};

// Perform a POST request
export const performPostRequest = (url, data) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };

  return fetch(url, options).then((response) => {
    if (response.ok) return response.json();
    throw new Error(response.statusText);
  });
};

// Simple bounce in animation
export const bounceIn = keyframes`
  from, 20%, 40%, 60%, 80%, to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  0% {
    opacity: 0;
  }
  10% {
    transform: scale3d(0.3, 0.3, 0.3);
  }
  20% {
    transform: scale3d(1.1, 1.1, 1.1);
  }
  40% {
    transform: scale3d(0.9, 0.9, 0.9);
  }
  60% {
    opacity: 1;
    transform: scale3d(1.03, 1.03, 1.03);
  }
  80% {
    transform: scale3d(0.97, 0.97, 0.97);
  }
  to {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }
`;
