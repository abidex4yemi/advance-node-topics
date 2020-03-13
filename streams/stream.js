const fs = require('fs');
const http = require('http');
const file = './intro.mp4';

http
  .createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'video/mp4' });

    fs.createReadStream(file)
      .pipe(res)
      .on('error', (error) => {
        console.log(error);
      });
  })
  .listen(4000, () => console.log('stream - http://localhost:3000'));
