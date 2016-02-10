var zmq = require('zmq')
  , bunyan = require('bunyan')
  , log = bunyan.createLogger({name:'blog/fetch_articles'})
  ;
var jsonrpc = require('jsonrpc-lite')
  , uuid = require('node-uuid')
  ;

module.exports = articles;

function fetch_articles(serviceObj) {
  return new Promise( (resolve, reject) => {
    var reqSocket = zmq.socket('req');
    const endpoint = `tcp://${serviceObj.hostname}:${serviceObj.port}`;
    reqSocket.connect(endpoint);
    log.info(endpoint, "connected to article");
    const id = uuid.v4();
    const articleMsg = jsonrpc.request(id, "fetch_articles");
    log.info({message:articleMsg}, "sent");
    reqSocket.send(JSON.stringify(articleMsg));
    reqSocket.on("message", (msg) => {
      const result = JSON.parse(msg);
      log.info("got some articles");
      reqSocket.close();
      resolve(result);
    });
    reqSocket.on("error", (err) => {
      log.error(err);
      reqSocket.close();
      reject(err);
    })
  });
}

function articles (registry, REGISTRY_HOST) {
  return registry
  .whereis("article", REGISTRY_HOST)
  .then( (serviceObj) => {
    return fetch_articles(serviceObj)
  })
  .catch( (err) => {
    log.error(err);
    registry.invalidate("article");
  })
  ;
}
