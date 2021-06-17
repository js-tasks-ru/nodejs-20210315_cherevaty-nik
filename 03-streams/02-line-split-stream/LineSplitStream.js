const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  #line= '';
  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, callback) {
    const splittedChunk = chunk.toString().split(os.EOL);
    const buffer = splittedChunk.pop();

    if (splittedChunk.length) {
      splittedChunk.forEach((item) => {
        this.push(`${this.#line}${item}`);
        if (this.#line.length > 0) {
          this.#line = '';
        }
      });
    }
    this.#line = `${this.#line}${buffer ?? ''}`
    callback();
  }

  _flush(callback) {
    this.push(this.#line);
    callback();
  }
}

module.exports = LineSplitStream;
