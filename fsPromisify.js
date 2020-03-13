const { promisify } = require('util');
const fs = require('fs');

const writeFile = promisify(fs.writeFile);

writeFile('sample.txt', 'This is a sample')
  .then(() => console.log('File successfully created'))
  .catch((err) => console.log(`Error: ${err.message}`));
