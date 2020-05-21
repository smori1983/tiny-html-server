const yargs = require('yargs');
const server = require('./src/background/server');

yargs.command({
  command: ['serve <directory> <port>', '$0'],
  desc: 'Run web server',
  builder: function builder(yargs) {
    yargs.positional('directory', {
      describe: 'The directory to be served',
      type: 'string',
    });
    yargs.positional('port', {
      describe: 'The port to be listened',
      type: 'number',
    });
  },
  handler: function handler(argv) {
    server.serve(argv.directory, argv.port, function (status, data) {
      if (status === 'error') {
        console.log('Error:');
        console.log(data.message);
      }
    });
  },
});

yargs.help();
yargs.argv; // eslint-disable-line no-unused-expressions
