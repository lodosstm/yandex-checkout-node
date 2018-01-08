'use strict';

var uuidv4 = require('uuid/v4');
var rp = require('request-promise');
var Promise = require('bluebird');
var errors = require('./errors');

function processError(error) {
  if (error instanceof errors.StatusCodeError && error.statusCode !== 404) {
    return new errors.PaymentError(error.error);
  }
  return error;
}

function request(method, func, payload, idempotenceKey) {
  var _self = this;
  /**
   * Generate idempotence key if not present
   * @see https://kassa.yandex.ru/docs/checkout-api/#idempotentnost
   */
  if (!idempotenceKey) {
    idempotenceKey = uuidv4();
  }
  var uri = this.root + func;
  if (this.debug) {
    // eslint-disable-next-line no-console
    console.log(method + ': ' + uri);
  }
  return rp({
    method: method,
    json: true,
    uri: uri,
    body: payload,
    timeout: this.timeout,
    /**
     * @see https://kassa.yandex.ru/docs/checkout-api/#autentifikaciq
     */
    auth: {
      user: this.shopId,
      pass: this.secretKey
    },
    resolveWithFullResponse: true,
    headers: {
      /**
       * @see https://kassa.yandex.ru/docs/checkout-api/#idempotentnost
       */
      'Idempotence-Key': idempotenceKey
    }
  }).then(function(response) {
    switch (response.statusCode) {
      /**
       * Implementation of async actions with retries
       * @see https://kassa.yandex.ru/docs/checkout-api/#asinhronnost
       */
      case 202:
        return Promise.delay(response.body.retry_after).
          then(request.bind(_self, method, func, payload, idempotenceKey));

      /**
       * Normal response
       */
      default:
        return response.body;
    }
  }).catch(function(error) {
    /**
     * @see https://kassa.yandex.ru/docs/checkout-api/#oshibki
     */
    return Promise.reject(processError(error));
  });
}

module.exports = { request: request };