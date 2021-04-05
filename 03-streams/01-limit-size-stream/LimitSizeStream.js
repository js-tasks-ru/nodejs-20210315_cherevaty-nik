const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit;
    this.streamSize = 0;
  }

  _transform(chunk, encoding, callback) {
    this.streamSize += Buffer.byteLength(chunk, 'utf-8');
    if (this.streamSize > this.limit) {
      callback(new LimitExceededError());
      return null;
    }
    callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
