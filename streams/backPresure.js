const fs = require('fs');

const readStream = fs.createReadStream('./intro.mp4');
const writeStream = fs.createWriteStream('./copy-intro.mp4', {
  highWaterMark: 1628920
});

readStream.on('data', (chunk) => {
  const result = writeStream.write(chunk);
  if (!result) {
    console.log(result);
    console.log('back pressure');
    readStream.pause();
  }
});

writeStream.on('drain', () => {
  console.log('drained');
  readStream.resume();
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
