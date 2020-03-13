const fs = require('fs');

const readStream = fs.createReadStream('./intro.mp4');

// Explicit flowing mode
readStream.on('data', (chunk) => {
  console.log('Size:\n', chunk.length);
});

readStream.on('end', () => {
  console.log('Read stream finished');
});

readStream.on('error', (error) => {
  console.log(`Error: ${error}`);
});

// Note: this is in none flowing mode
process.stdin.on('data', (chunk) => {
  const text = chunk.toString().trim();
  console.log('echo:', text);
});
