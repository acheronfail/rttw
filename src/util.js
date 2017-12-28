import React from 'react';
import Lozenge from '@atlaskit/lozenge';

export const itemCreator = (name) => (value, label, done, extra = {}) => ({
    name,
    value,
    label: (
        <span>
            <Lozenge appearance={done ? 'success' : 'default'}>
                {done ? (extra.statusText || 'solved') : 'unsolved'}
            </Lozenge>
            &nbsp;
            {label}
        </span>
    ),
    ...extra
});

// General helpers
export const cycleArray = (arr, i) => (i % arr.length + arr.length) % arr.length;

export const resetCSSAnimation = (cls) => {
    const element = document.querySelector(`.${cls}`);
    element.classList.remove(cls);
    void element.offsetWidth;
    element.classList.add(cls);
};

// CodeMirror helpers
export const firstPos = () => ({ line: 0, ch: 0 });
export const lastPos = (cm) => {
    let line = cm.lastLine();
    let ch = cm.getLine(line).length;
    return { line, ch };
}
