var zmq = require('zmq')
  , bunyan = require('bunyan')
  , log = bunyan.createLogger({name:'blog/fetch_articles'})
  ;
var jsonrpc = require('jsonrpc-lite')
  , uuid = require('node-uuid')
  ;
var MAX_RETRIES = 3
  , TIMEOUT = 3000;


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

    var timeout = setTimeout( () => {
      reqSocket.close();
      const err = "Timeout. No response after: " + TIMEOUT + "ms";
      reject(err);
    }, TIMEOUT);

    reqSocket.on("message", (msg) => {
      clearTimeout(timeout);
      const result = JSON.parse(msg);
      log.info("got some articles");
      reqSocket.close();
      resolve(result);
    });

    reqSocket.on("error", (err) => {
      clearTimeout(timeout);
      log.error(err);
      reqSocket.close();
      reject(err);
    });
  });
}

function articles (registry, REGISTRY_HOST) {
  return registry
  .whereis("article", REGISTRY_HOST)
  .then( (serviceObj) => {
    var attempt = 1;
    return fetch_articles(serviceObj)
      .catch( (err) => {
        log.info(err);
        if (attempt >= MAX_RETRIES) {
          const message = `Not able to contact ${serviceObj.hostname} after ${MAX_RETRIES} attempts.`;
          log.error(message);
          registry.invalidate("article", REGISTRY_HOST);
          return Promise.reject(message);
        } else {
          attempt++;
          log.info("Retry #" + attempt);
          return fetch_articles(serviceObj);
        }
      })
  })
  ;
}
