const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  try {
    const pathname = url.parse(req.url).pathname.slice(1);
    const paths = req.url.split('/');
    paths.shift();
    if (paths.length > 1) {
      res.statusCode = 400;
      res.statusMessage = "Bad Request";
      res.end();
    }
    const filepath = path.join(__dirname, 'files', pathname);
    switch (req.method) {
      case 'GET':
        if (fs.existsSync(filepath)) {
          const file = fs.createReadStream(filepath);
          file.pipe(res);
        } else {
          res.statusCode = 404;
          res.statusMessage = "File does not exists";
          res.end();
        }
        break;

      default:
        res.statusCode = 501;
        res.end('Not implemented');
    }
  } catch (err) {
    console.log('ERROR: ', err);
    res.statusCode = 500;
    res.statusMessage = "Internal server error";
    res.end();
  }
});

module.exports = server;
