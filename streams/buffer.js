const fs = require('fs');
const http = require('http');
const file = './intro.mp4';

http
  .createServer((req, res) => {
    fs.readFile(file, (error, data) => {
      if (error) {
        console.log(`Error: ${error}`);
      }

      res.writeHead(200, { 'Content-Type': 'video/mp4' });
      res.end(data);
    });
  })
  .listen(4000, console.log('Buffer: on http://localhost:4000'));
