/**
 * These puzzles belong to the orignal author of Return True To Win.
 * https://alf.nu/ReturnTrue
 */

 module.exports = [
    {
        name: 'id',
        source:
`function id(x) {
    return x;
}`
    },
    {
        name: 'reflexive',
        source:
`function reflexive(x) {
    return x != x;
}`
    },
    {
        name: 'infinity',
        source:
`// submitted by 'dat boi'
function infinity(x, y) {
    return x === y && 1/x < 1/y 
}`
    },
    {
        name: 'transitive',
        source:
`function transitive(x,y,z) {
    return x && x == y && y == z && x != z;
}`
    },
    {
        name: 'counter',
        source:
`function counter(f) {
    var a = f(), b = f();
    return a() == 1 && a() == 2 && a() == 3
        && b() == 1 && b() == 2;
}`
    },
    {
        name: 'peano',
        source:
`function peano(x) {
    return (x++ !== x) && (x++ === x);
}`
    },
    {
        name: 'array',
        source:
`function array(x,y) {
    return Array.isArray(x) && !(x instanceof Array) &&
          !Array.isArray(y) &&  (y instanceof Array);
}`
    },
    {
        name: 'instance',
        source:
`function instance(x,y) {
  return x instanceof y && y instanceof x && x !== y;
}`
    },
    {
        name: 'instance2',
        source:
`function instance2(a,b,c) {
  return a !== b && b !== c && a !== c
      && a instanceof b
      && b instanceof c 
      && c instanceof a;
}`
    },
    {
        name: 'proto1',
        source:
`function proto1(x) {
    return x && !("__proto__" in x);
}`
    },
    {
        name: 'undef',
        source:
`function undef(x) {
    return !{ undefined: { undefined: 1 } }[typeof x][x];
}`
    },
    {
        name: 'symmetric',
        source:
`function symmetric(x,y) {
    return x == y && y != x;
}`
    },
    {
        name: 'ouroborobj',
        source:
`function ouroborobj(x) {
    return x in x;
}`
    },
    {
        name: 'truth',
        source:
`function truth(x) {
    return x.valueOf() && !x;
}`
    },
    {
        name: 'wat',
        source:
`function wat(x) {
    return x('hello') == 'world:)' && !x;
}`
    },
    {
        name: 'evil1',
        source:
`var eval = window.eval;
function evil1(x) {
    return eval(x+'(x)') && !eval(x)(x);
}`
    },
    {
        name: 'evil2',
        source:
`var eval = window.eval;
function evil2(x) {
    return eval('('+x+')(x)') && !eval(x)(x);
}`
    },
    {
        name: 'evil3',
        source:
`var eval = window.eval;
function evil3(parameter) {
    return eval('('+parameter+')(parameter)') && 
          !eval(parameter)(parameter);
}`
    },
    {
        name: 'random1',
        source:
`function random1(x) {
    return Math.random() in x;
}`
    },
    {
        name: 'random2',
        source:
`var rand = Math.random();
function random2(x) {
  return rand in x;
}`
    },
    {
        name: 'random3',
        source:
`var key = crypto.getRandomValues(new Uint32Array(4));
function random3(x) {
    var d = 0;
    for (var i=0; i<key.length; i++) {
        d |= key[i] ^ x[i];
    }
    return d === 0;
}`
    },
    {
        name: 'random4',
        source:
`var rand = Math.random();
function random4(x) {
    return rand === x;
}`
    },
    {
        name: 'total',
        source:
`function total(x) {
  return (x < x) && (x == x) && (x > x);
}`
    },
    {
        name: 'json',
        source:
`// submitted by azzola 
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


