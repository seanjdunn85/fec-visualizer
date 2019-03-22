const NodeCache = require('node-cache');

const nodeCacheService = new NodeCache();
const requestPromise = require('request-promise');


/**
 * Hit the cache or dispatch an API call
 * @param {object} httpOptions The request-promise options sent to request-promise
 */
const cacheOrCall = (httpOptions) => {
//   console.log('retrieving from cache or call');
  const cacheOrCallPromise = new Promise((resolve, reject) => {
    nodeCacheService.get(JSON.stringify(httpOptions), (cacheError, cacheResult) => {
      if (!cacheError && cacheResult !== undefined) {
        // We hit the cache, send it.
        // console.log('Cache hit');
        resolve(cacheResult);
      } else {
        // Error or missed. Call the API
        const apiRequestPromise = requestPromise(httpOptions);
        apiRequestPromise.then((result) => {
        resolve(result);
        nodeCacheService.set(JSON.stringify(httpOptions), result);
        }).catch((err) => {
          reject(err);
        }
        );
      }
    });
  });
  return cacheOrCallPromise;
};

module.exports = cacheOrCall;
