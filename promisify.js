const { promisify } = require('util');

const delay = (seconds, callback) => {
  if (seconds > 3) {
    callback(new Error(`${seconds} is too long`));
  } else {
    setTimeout(() => {
      callback(null, `the ${seconds} seconds delay is over.`);
    }, seconds * 1000);
  }
};

const promiseDelay = promisify(delay);

promiseDelay(4)
  .then((message) => console.log(message))
  .catch((err) => console.log(err.message));
