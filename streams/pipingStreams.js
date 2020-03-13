const fs = require('fs');

const readStream = fs.createReadStream('./intro.mp4');
const writeStream = fs.createWriteStream('./copy-intro.mp4');

readStream.pipe(writeStream).on('error', (error) => {
  console.log(error.message);
});
