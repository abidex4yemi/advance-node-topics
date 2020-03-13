const multiparty = require('multiparty');
const http = require('http');
const { stat, createReadStream, createWriteStream } = require('fs');
const { promisify } = require('util');

const fileName = './intro.mp4';
const fileInfo = promisify(stat);

const respondWithVideo = async (req, res) => {
  const { range } = req.headers;
  const { size } = await fileInfo(fileName);

  if (range) {
    let [start, end] = range.replace(/bytes=/, '').split('-');

    start = parseInt(start, 10);

    end = end ? parseInt(end, 10) : size - 1;

    res.writeHead(206, {
      'Content-Range': `bytes ${start} - ${end} / ${size}`,
      'Accept-Range': 'bytes',
      'Content-Length': end - start + 1,
      'Content-Type': 'video/mp4'
    });

    createReadStream(fileName, { start, end }).pipe(res);
  } else {
    res.writeHead(200, {
      'Content-Length': size,
      'Content-Type': 'video/mp4'
    });

    createReadStream(fileName).pipe(res);
  }
};

http
  .createServer((req, res) => {
    if (req.method === 'POST') {
      const form = new multiparty.Form();

      form.on('part', (part) => {
        part.pipe(createWriteStream(`./${part.filename}`)).on('close', () => {
          res.writeHead(200, { 'Content-Type': 'text' });
          res.end(`<h1>File uploaded: ${part.filename}</h1>`);
        });
      });

      form.parse(req);

      // req.pipe(res);
      // req.pipe(process.stdout);
      req.pipe(createWriteStream('./upload'));
    } else if (req.url === '/video') {
      return respondWithVideo(req, res);
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });

      res.end(`
        <form enctype="multipart/form-data" method="POST" action="/" >
          <input type="file" name="upload-file" />
          <br>
          <br>
          <button>Upload file</button>
        </form>
      `);
    }
  })
  .listen(4000, () => {
    console.log('Server running on port 4000');
  });
