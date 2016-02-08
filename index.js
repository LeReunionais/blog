/*eslint-env node */
var connect = require('connect');
var http2 = require('http2');
var http = require('http');
var fs = require('fs');
var registry = require('./lib/registry_utils/registry.js')
  , articles = require('./lib/fetch_articles')
  ;

var serveStatic = require('serve-static')
  , redirect = require('connect-redirection')
  ;

var REGISTRY_HOST = process.env.REGISTRY_HOST || "registry";

var app = connect()
  .use(redirect())
  .use(serveStatic('app'))
  .use('/articles', (req, res) => {
      articles(registry, REGISTRY_HOST)
      .then( (articleJSON) => {
        res.end(JSON.stringify(articleJSON));
      });
  })
  ;

const options = {
  key: fs.readFileSync('./server.key'),
  cert: fs.readFileSync('./server.crt')
}

http2.createServer(options, app).listen(3020, () => {
  console.log('Securely listening to port https://wxxxxx:3020');
});

http.createServer(app).listen(3021, () => {
  console.log('Not securely listening to port http://wxxxxx:3021');
});
