import { DocumentPuzzle } from '../src/types';

/**
 * These puzzles belong to the orignal author of Return True To Win.
 * https://alf.nu/ReturnTrue
 */

export const season1: DocumentPuzzle[] = [
  {
    index: 0,
    name: 'id',
    source: `function id(x) {
  return x;
}`,
  },
  {
    index: 1,
    name: 'reflexive',
    source: `function reflexive(x) {
  return x != x;
}`,
  },
  {
    index: 2,
    name: 'infinity',
    source: `// submitted by 'dat boi'
function infinity(x, y) {
  return x === y && 1/x < 1/y
}`,
  },
  {
    index: 3,
    name: 'transitive',
    source: `function transitive(x,y,z) {
  return x && x == y && y == z && x != z;
}`,
  },
  {
    index: 4,
    name: 'tryCatch',
    source: `function tryCatch(fn) {
  try {
    fn();
    return false;
  } catch (error) {
    return false;
  } finally {
    return fn();
  }
}`,
  },
  {
    index: 5,
    name: 'counter',
    source: `function counter(f) {
  var a = f(), b = f();
  return a() == 1 && a() == 2 && a() == 3
      && b() == 1 && b() == 2;
}`,
  },
  {
    index: 6,
    name: 'peano',
    source: `function peano(x) {
  return (x++ !== x) && (x++ === x);
}`,
  },
  {
    index: 7,
    name: 'array',
    source: `function array(x,y) {
  return Array.isArray(x) && !(x instanceof Array) &&
        !Array.isArray(y) &&  (y instanceof Array);
}`,
  },
  {
    index: 8,
    name: 'instance',
    source: `function instance(x,y) {
  return x instanceof y && y instanceof x && x !== y;
}`,
  },
  {
    index: 9,
    name: 'instance2',
    source: `function instance2(a,b,c) {
  return a !== b && b !== c && a !== c
      && a instanceof b
      && b instanceof c
      && c instanceof a;
}`,
  },
  {
    index: 10,
    name: 'proto1',
    source: `function proto1(x) {
  return x && !("__proto__" in x);
}`,
  },
  {
    index: 11,
    name: 'undef',
    source: `function undef(x) {
  return !{ undefined: { undefined: 1 } }[typeof x][x];
}`,
  },
  {
    index: 12,
    name: 'symmetric',
    source: `function symmetric(x,y) {
  return x == y && y != x;
}`,
  },
  {
    index: 13,
    name: 'ouroborobj',
    source: `function ouroborobj(x) {
  return x in x;
}`,
  },
  {
    index: 14,
    name: 'truth',
    source: `function truth(x) {
  return x.valueOf() && !x;
}`,
  },
  {
    index: 15,
    name: 'wat',
    source: `function wat(x) {
  return x('hello') == 'world:)' && !x;
}`,
  },
  {
    index: 16,
    name: 'evil1',
    source: `var eval = window.eval;
function evil1(x) {
  return eval(x+'(x)') && !eval(x)(x);
}`,
  },
  {
    index: 17,
    name: 'evil2',
    source: `var eval = window.eval;
function evil2(x) {
  return eval('('+x+')(x)') && !eval(x)(x);
}`,
  },
  {
    index: 18,
    name: 'evil3',
    source: `var eval = window.eval;
function evil3(parameter) {
  return eval('('+parameter+')(parameter)') &&
        !eval(parameter)(parameter);
}`,
  },
  {
    index: 19,
    name: 'random1',
    source: `function random1(x) {
  return Math.random() in x;
}`,
  },
  {
    index: 20,
    name: 'random2',
    source: `var rand = Math.random();
function random2(x) {
  return rand in x;
}`,
  },
  {
    index: 21,
    name: 'random3',
    source: `var key = crypto.getRandomValues(new Uint32Array(4));
function random3(x) {
  var d = 0;
  for (var i=0; i<key.length; i++) {
    d |= key[i] ^ x[i];
  }
  return d === 0;
}`,
  },
  {
    index: 22,
    name: 'random4',
    source: `var rand = Math.random();
function random4(x) {
  return rand === x;
}`,
  },
  {
    index: 23,
    name: 'total',
    source: `function total(x) {
  return (x < x) && (x == x) && (x > x);
}`,
  },
  {
    index: 24,
    name: 'json',
    source: `// submitted by azzola
const secrets = new Uint32Array(2);
crypto.getRandomValues(secrets);
const [key, value] = secrets;
const vault = {
  [key]: value
};

function json(x, y) {
  Object.defineProperty(vault, x, { value: y });
  const secure = JSON.stringify(Object.freeze(vault));
  let copy;
  try {
    copy = eval(\`(\${secure})\`);
  } catch (e) {
    // Try again...
    copy = JSON.parse(secure);
    return key in copy && copy[key] !== vault[key];
  }
  return void vault;
}`,
  },
];
