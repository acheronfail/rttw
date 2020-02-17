export const keyMaps = [
  'default', // CodeMirror's default keymap.
  'sublime',
  'emacs',
  'vim',
];

for (let i = 0; i < keyMaps.length; ++i) {
  const keyMap = keyMaps[i];
  if (keyMap !== 'default') {
    require(`codemirror/keymap/${keyMap}`);
  }
}
