import { DocumentPuzzle } from 'server/src/types';

/**
 * These puzzles belong to the orignal author of Return True To Win.
 * https://alf.nu/ReturnTrue
 */

export const season2: DocumentPuzzle[] = [
  {
    index: 24,
    name: 'countOnMe',
    source: `// submitted by James
function countOnMe(x) {
    if (!(x instanceof Array))
        throw 'x must be an array.';

    for (var i = 0; i < 20; i++) {
        if (x[i] != i) {
                throw 'x must contain the numbers 0-19 in order';
        }
    }

    return true;
}`,
  },
  {
    index: 25,
    name: 'countOnMe2',
    source: `// submitted by James
function countOnMe2(x) {
    if (!(x instanceof Array))
        throw 'x must be an array.';

    for (var i = 0; i < 1000; i++) {
        if (x[i] !== i) {
            throw 'x must contain the numbers 0-999 in order';
        }
    }

    return true;
}`,
  },
  {
    index: 26,
    name: 'countOnMe3',
    source: `// submitted by James
function countOnMe3(x) {
    var arrayElements = 1000;

    if (!(x instanceof Array))
        throw 'x must be an Array';

    for (var i = 0; i < arrayElements; i++)
        if (x[i] != i)
            throw 'x must contain the numbers 0-999 in order';

    for (element of x)
        if (element != --arrayElements)
            throw 'x must contain the numbers 999-0 in order';

    if (x.length !== 0)
        throw 'x must be empty';

    return true;
}`,
  },
  {
    index: 27,
    name: 'instance3',
    source: `// submitted by @smelukov
delete window.Symbol;

function instance3(x) {
    return x && typeof x === 'object' && !(x instanceof Object)
}`,
  },
  {
    index: 28,
    name: 'letsgo',
    source: `// submitted by MAY✪R
function letsgo(x) {
    let a = let\`abc\`;
    return \`abc\` === a;
}`,
  },
  {
    index: 29,
    name: 'associative',
    source: `// submitted by Stephen Leppik
function associative(x, y, z) {
    return typeof x === "number"
        && typeof y === "number"
        && typeof z === "number"
        && (x + y) + z !== x + (y + z);
}`,
  },
  {
    index: 30,
    name: 'base64',
    source: `// Andrew Sillers
verifyInput = input => JSON.parse('[' + input + ']');

const atob = window.atob;
const globalEval = window.eval;

function base64(x, y) {
    if (typeof x !== "string" || typeof y !== "string") { throw "string literals only"; }

    globalEval(x + y);
    if (typeof dmx == "undefined" && typeof Y2K == "undefined") { return false; }

    globalEval(atob(y) + atob(x));
    return dmx.source && Y2K === Infinity
}`,
  },
  {
    index: 31,
    name: 'base65',
    source: `// Andrew Sillers
verifyInput = input => JSON.parse('[' + input + ']');

const atob = window.atob;
const globalEval = window.eval;

function base65(x, y) {
    if (typeof x !== "string" || typeof y !== "string") { throw "string literals only"; }

    atob(x);
    atob(y);

    window.bullseye = 1;

    globalEval(x + y);
    return whoa === "undefined" && !window.bullseye;
}`,
  },
  {
    index: 32,
    name: 'base66',
    source: `// Andrew Sillers
verifyInput = input => JSON.parse('[' + input + ']');

const atob = window.atob;
const globalEval = window.eval;

function base66(x, y) {
    if (typeof x !== "string" || typeof y !== "string") { throw "string literals only"; }

    if (atob(x) !== atob(y)) { return false; }

    window.bullseye = 1;

    globalEval(x + y);
    return wow === "undefined" && !window.bullseye;
    // Andrew Sillers
}`,
  },
  {
    index: 33,
    name: 'decorator',
    source: `// AndreiSoroka
function decorator(obj) {
    delete obj.a;
    delete obj.b;
    return obj.a && Object.keys(obj).indexOf('a') == -1
        && !obj.b && Object.keys(obj).indexOf('b') != -1;
}`,
  },
  {
    index: 34,
    name: 'e_aluate',
    source: `// Andrew Sillers
Object.freeze(RegExp.prototype);

function e_aluate(v) {
    if (v == true) { throw 'input cannot be true'; }
    if (/v/.test(v)) { throw 'input cannot include "v"'; }
    eval(v);
    return v;
}`,
  },
  {
    index: 35,
    name: 'clobber',
    source: `// Andrew Sillers
var create = Object.create;
var defineProperty = Object.defineProperty;

function clobber(x, y) {
    if (x !== y) { throw "inputs must be equal"; }

    var o = create(null);
    try {
        defineProperty(o, "nonwritable_prop", { value: x, writable: false, configurable: false });
        defineProperty(o, "nonwritable_prop", { value: y, writable: false, configurable: false });
    } catch (_) {
        return true;
    }

    throw "inputs must raise an error when written in sequence to non-writable property";
}`,
  },
  {
    index: 36,
    name: 'typeyTypey',
    source: `// submitted by James
verifyInput = input => {
    if (/[;(),]/.test(input)) throw 'Cannot use the following characters: ;(),';
    JSON.parse(input);
}

const ev = window.eval;

function typeyTypey(a) {
    return ev(ev(\`typeof \${a}\`))()
}`,
  },
  {
    index: 37,
    name: 'random5',
    source: `// James/Alf
const secret = Math.random();
const abs = Math.abs;
const max = Math.max;

function absoluteError(a, b) {
    return abs(a - b);
}
function relativeError(a, b) {
    return absoluteError(a, b) / max(a, b);
}
function random5(x) {
    return absoluteError(x, secret) < 1e-9 || relativeError(x, secret) < 1e-9;
}`,
  },
  {
    index: 38,
    name: 'random6',
    source: `// James/Alf
const secret = Math.random();
const abs = Math.abs;

function absoluteError(a, b) {
    return abs(a - b);
}`,
  },
  {
    index: 39,
    name: '',
    source: `function random6(x) {
    return absoluteError(x, secret) < 1e-9;
}`,
  },
  {
    index: 40,
    name: 'random7',
    source: `// submitted by James
window.quiteRandomNumber = Math.random();

function random7() {
    const quiteRandomNumber = 4;
    return eval('quiteRandomNumber') === window.quiteRandomNumber;
}`,
  },
  {
    index: 41,
    name: 'random8',
    source: `// submitted by James
window.quiteRandomNumber = Math.random();

function random8() {
    const quiteRandomNumber = 4;
    return eval('quiteRandomNumber') === window.quiteRandomNumber;
}`,
  },
  {
    index: 42,
    name: 'myPlanetNeedsMe',
    source: `// submitted by James
const helpfulAdvice = 'This solution does not work!';
const rand = Math.random();
window.ܝ = 065432123456654321234560 * rand;

function myPlanetNeedsMe() {
    answerToLifeTheUniverseAndEverything = 42;

    func = { undefined = !function () { throw helpfulAdvice }(), toString = let\`func\` } =
        function answerToLifeTheUniverseAndEverything() { return 42; };

    return toString != 'undefined' && answerToLifeTheUniverseAndEverything == 493921719446642400000 * rand;
}`,
  },
  {
    index: 43,
    name: 'math',
    source: `function math(x) {
    return x + 0.1 == 0.3;
}`,
  },
  {
    index: 44,
    name: 'invisibleCounter',
    source: `// submitted by James
verifyInput = JSON.parse;

const Symbol = window.Symbol;
const eval = window.eval;
const every = Function.call.bind([].every);

function invisibileCounter(x) {
    const o = {};

    const symbols = new Array(5).fill(0).map(_ => Symbol());

    const counters = [
        eval(\`\${x}(symbols[0])\`),
        eval(\`\${x}(symbols[1])()\`),
        eval(\`\${x}(symbols[2])()()\`),
        eval(\`\${x}(symbols[3])()()()\`),
        eval(\`\${x}(symbols[4])()()()()\`)
    ];

    return every(counters, (e, i) => e === undefined && o[symbols[i]] === ++i);
}`,
  },
  {
    index: 45,
    name: 'notTooLong',
    source: `// submitted by James
const create = Object.create;
const keys = Object.keys;

function notTooLong(x) {
    return create(x).length === 1 &&
        keys(create(x)).length === 0;
}`,
  },
  {
    index: 46,
    name: 'confusedVar',
    source: `// submitted by James
function confusedVar(x) {
    return x == !x && x == x;
}`,
  },
  {
    index: 47,
    name: 'notANaN',
    source: `// submitted by Itay
const isNaN = window.isNaN
const eval = window.eval
const stringify = JSON.stringify

const notANaN = (x, y) => isNaN(x) && isNaN(x(y)) && !isNaN(y) &&
    new x(y) && x(y) &&
    eval(stringify(x(y))) &&
    !eval(stringify(new x(y)));
`,
  },
  {
    index: 48,
    name: 'numberFunTime',
    source: `// submitted by James
function numberFunTime(x) {
    return x * x === 0 &&
        x + 1 === 1 &&
        x - 1 === -1 &&
        x / x === 1;
}`,
  },
  {
    index: 49,
    name: 'andBeyond',
    source: `// submitted by James
verifyInput = input => {
    if (/\>/.test(input)) throw 'Use of the greater than symbol is forbidden.';
};

function andBeyond(x) {
    return x() === Number.POSITIVE_INFINITY;
}`,
  },
];
