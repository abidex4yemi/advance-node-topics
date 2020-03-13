const delay = (seconds) => {
  return new Promise((resolves, reject) => {
    if (seconds > 2) {
      reject(new Error(`${seconds} seconds is too long`));
    }

    setTimeout(() => {
      resolves('the long delay has ended');
    }, seconds * 1000);
  });
};

delay(2)
  .then((message) => {
    console.log(message);
  })
  .catch((err) => console.log(err.message));

console.log('end first tick');
