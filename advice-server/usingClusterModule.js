const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  masterProcess();
} else {
  childProcess();
}

function masterProcess() {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    console.log(`Forking process number ${i}...`);
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker process ${process.pid}  had died`);
    console.log('Starting a new worker');
    cluster.fork();
  });
}

function childProcess() {
  console.log(`Started a worker at ${process.pid}`);
  http
    .createServer((req, res) => {
      res.end(`process: ${process.pid}`);

      if (req.url == '/kill') {
        process.exit(0);
      } else {
        console.log(`Serving from ${process.pid}...`);
      }
    })
    .listen(4000);
}
