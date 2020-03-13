const { Readable } = require('stream');

const peaks = [
  'Tallac',
  'Ralston',
  'Rubicon',
  'Twin peaks',
  'castle peak',
  'Rose',
  'Freel Peek'
];

class StreamFromArray extends Readable {
  constructor(array = []) {
    // Streams comes in two mode: binary | object mode
    // Binary could be read as string { encoding: 'utf-8' }
    // Object could be turned on { objectMode: true }
    // super({ encoding: 'utf-8' });
    super({ objectMode: true });
    this.array = array;
    this.index = 0;
  }

  _read() {
    if (this.index <= this.array.length) {
      // const chunk = this.array[this.index];
      const chunk = {
        data: this.array[this.index],
        index: this.index
      };
      this.push(chunk);
      this.index++;
    } else {
      this.push(null);
    }
  }
}

const peakStream = new StreamFromArray(peaks);

peakStream.on('data', (chunk) => {
  console.log(chunk);
});

peakStream.on('end', () => console.log('done!'));
