// invoked in master

const process = require('process');
process.on('SIGINT', () => {
  process.exit(0);
});
