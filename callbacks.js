function hideString(str, done) {
  process.nextTick(() => {
    done(str.replace(/[a-zA-Z]/g, 'X'));
  });
}

hideString('Hello world', (hidden) => {
  console.log(hidden);
});

console.log('end');

function delay(seconds, callback) {
  setTimeout(callback, seconds * 1000);
}

delay(2, () => {
  console.log('2 seconds');
});
