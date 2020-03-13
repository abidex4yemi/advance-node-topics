const fs = require('fs');

const readStream = fs.createReadStream('./intro.mp4');
const writeStream = fs.createWriteStream('./copy-intro.mp4');

readStream.on('data', (chunk) => {
  writeStream.write(chunk);
});

readStream.on('end', () => {
  writeStream.end();
});

readStream.on('error', (error) => {
  console.log(`Error: ${error}`);
});

writeStream.on('close', () => {
  process.stdout.write('file copied\n');
});
