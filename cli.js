const yargs = require('yargs');
const server = require('./src/background/server');

yargs.command({
  command: ['serve <directory>', '$0'],
  desc: 'Run web server',
  builder: function builder(yargs) {
    yargs.positional('directory', {
      describe: 'The directory to be served',
      type: 'string',
    });
  },
  handler: function handler(argv) {
    server.serve(argv.directory);
  },
});

yargs.help();
yargs.argv; // eslint-disable-line no-unused-expressions
