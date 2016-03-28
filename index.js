/*eslint-env node */
var connect = require('connect');
var http2 = require('http2');
var http = require('http');
var fs = require('fs');
var registry = require('service_js')
  , articles = require('./lib/fetch_articles')
  ;

var bunyan = require('bunyan')
  , log = bunyan.createLogger({name:"blog"})
  ;
var serveStatic = require('serve-static')
  , redirect = require('connect-redirection')
  ;

var REGISTRY_HOST = process.env.REGISTRY_HOST || "registry"
  , PORT = process.env.PORT || 3020
  , SECURE_PORT = process.env.SECURE_PORT || 3021
  ;

var app = connect()
  .use(redirect())
  .use(serveStatic('app'))
  .use('/articles', (req, res) => {
      articles(registry, REGISTRY_HOST)
      .then( (articleJSON) => {
        res.end(JSON.stringify(articleJSON));
      })
      .catch( (err) => {
        log.info(err);
        res.statusCode = 509;
        res.statusMessage = 'Service article not reachable';
        res.end();
      })
      ;
  })
  ;

const options = {
  key: fs.readFileSync('./server.key'),
  cert: fs.readFileSync('./server.crt')
}

http2.createServer(options, app).listen(SECURE_PORT, () => {
  console.log('Securely listening to port https://wxxxxx:' + SECURE_PORT);
});

http.createServer(app).listen(PORT, () => {
  console.log('Not securely listening to port http://wxxxxx:' + PORT);
});
