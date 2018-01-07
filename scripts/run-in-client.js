// Simply runs a command in the client directory in a cross-platform way
const args = process.argv.slice(2);
const opts = { stdio: 'inherit', cwd: 'client', shell: true };
require('child_process').spawn('yarn', args, opts);