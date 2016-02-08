var bunyan = require('bunyan')
  , log = bunyan.createLogger({name: "blog/registry"})
  ;

var zmq = require('zmq')
  , pushSocket = zmq.socket('req')
  , jsonrpc = require('jsonrpc-lite')
  , uuid = require('node-uuid')
  ;

var serviceMap = {};

module.exports = {
  whereis: (service, registryHost) => {
    if (serviceMap[service] !== undefined) {
      log.info("Get service %s from cache", service);
      return Promise.resolve(serviceMap[service]);
    } else {
      log.info("Trying to retrieve service %s", service);
      return whereis(service, registryHost)
        .then( (serviceObj) => {
          log.info({service:serviceObj}, "Found %s", service);
          serviceMap[service] = serviceObj;
          return serviceObj;
        });
    }
  },
  invalidate: (service) => {
    log.info("Invalidate service %s", service)
    serviceMap[service] = undefined;
  }
}

function whereis(service, registryHost) {
  return new Promise ( (resolve, reject) => {
    const endpoint = `tcp://${registryHost}:3002`;
    pushSocket.connect(endpoint);
    log.info("Connected to %s", endpoint);
    const whereisObj = {
      service: {
        name: service
      }
    }
    const whereisMsg = jsonrpc.request(uuid.v4(), "find", whereisObj);
    log.info({request:whereisMsg}, "sent request");
    pushSocket.send(JSON.stringify(whereisMsg));
    pushSocket.on("message", (msg) => {
      log.info({request:msg.toString()}, "reply");
      const serviceObj = JSON.parse(msg.toString());
      resolve(serviceObj);
    });
    pushSocket.on("error", (err) => {
      log.log(err);
      reject(err);
    })
  })
}
