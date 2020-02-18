#!/usr/bin/env node

// Simply runs yarn in the target directory in a cross-platform way.

// eslint-disable-next-line
const { resolve, isAbsolute } = require('path');

const [dir, ...args] = process.argv.slice(2);
if (!dir || typeof dir !== 'string') {
  console.error(new Error('Expected: dir ...args'));
}

const cwd = isAbsolute(dir) ? dir : resolve(process.cwd(), dir);
require('child_process').spawn('yarn', args, { stdio: 'inherit', cwd, shell: true });
