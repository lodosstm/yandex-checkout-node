'use strict';

var utils = require('./utils');
var Payment = require('./models/payment');
var Refund = require('./models/refund');

YandexCheckout.PACKAGE_VERSION = require('../package.json').version;
YandexCheckout.DEFAULT_BASE_HOST = 'https://payment.yandex.net';
YandexCheckout.DEFAULT_BASE_PATH = '/api/v3/';
YandexCheckout.DEFAULT_DEBUG = false;

// Use node's default timeout:
YandexCheckout.DEFAULT_TIMEOUT = require('http').createServer().timeout;

function YandexCheckout(shopId, secretKey) {
  var options = {};
  if ( typeof shopId === 'object') {
    options = shopId;
  } else {
    options = {
      shopId: shopId,
      secretKey: secretKey
    }
  }
  this.shopId = options.shopId;
  this.secretKey = options.secretKey;
  this.root = (options.base_host || YandexCheckout.DEFAULT_BASE_HOST)
    + (options.base_path || YandexCheckout.DEFAULT_BASE_PATH);
  this.debug = options.debug || YandexCheckout.DEFAULT_DEBUG;
  this.timeout = options.timeout || YandexCheckout.DEFAULT_TIMEOUT;
}

YandexCheckout.prototype = {
  /**
   * Create new payment
   * @see https://kassa.yandex.ru/docs/checkout-api/#sozdanie-platezha
   * @param {Object} payload
   * @paramExample
   * {
   *   amount': {
   *     'value': '2.00',
   *     'currency': 'RUB'
   *   },
   *   'payment_method_data': {
   *     'type': 'bank_card'
   *   },
   *   'confirmation': {
   *     'type': 'redirect',
   *     'return_url': 'https://www.merchant-website.com/return_url'
   *   }
   * }
   * @param {string} idempotenceKey
   * @paramExample '6daac9fa-342d-4264-91c5-b5eafd1a0010'
   * @returns {Promise<Object>}
   * @exampleObject
   * {
   *   id: '215d8da0-000f-50be-b000-0003308c89be',
   *   status: 'waiting_for_capture',
   *   paid: true,
   *   amount:
   *   {
   *     value: '2.00',
   *     currency: 'RUB'
   *   },
   *   confirmation:
   *   {
   *     type: 'redirect',
   *     return_url: 'https://www.merchant-website.com/return_url',
   *     confirmation_url: 'https://money.yandex.ru/payments/kassa/confirmation?orderId=219752e2-000f-50bf-b000-03f3dda898c8'
    *  },
   *   created_at: '2017-11-10T05:54:42.563Z',
   *   metadata: {},
   *   payment_method:
   *   {
   *     type: 'bank_card',
   *     id: '215d8da0-000f-50be-b000-0003308c89be',
   *     saved: false
    *  },
   *   recipient:
   *   {
   *     account_id: 'your_shop_id',
   *     gateway_id: 'gateaway_id'
   *   }
   * }
   */
  _createPayment: function(payload, idempotenceKey) {
    return utils.request.call(this, 'POST', 'payments', payload, idempotenceKey);
  },

  /**
   *
   * @see _createPayment()
   * @param {Object} payload
   * @paramExample
   * {
   *   amount':
   *   {
   *     'value': '2.00',
   *     'currency': 'RUB'
   *   },
   *   'payment_method_data': {
   *     'type': 'bank_card'
   *   },
   *   'confirmation': {
   *     'type': 'redirect',
   *     'return_url': 'https://www.merchant-website.com/return_url'
   *   }
   * }
   * @param {string} idempotenceKey
   * @paramExample '6daac9fa-342d-4264-91c5-b5eafd1a0010'
   * @returns {Promise<Payment>}
   */
  createPayment: function(payload, idempotenceKey) {
    var _self = this;
    return this._createPayment(payload, idempotenceKey).then(function(data) {
      return new Payment(_self, data);
    });
  },

  /**
   * @see https://kassa.yandex.ru/docs/checkout-api/#informaciq-o-platezhe
   * @param {string} paymentId
   * @paramExample '215d8da0-000f-50be-b000-0003308c89be'
   * @param {string} idempotenceKey
   * @paramExample '6daac9fa-342d-4264-91c5-b5eafd1a0010'
   * @returns {Promise<Object>}
   * @returnExample
   * {
   *   id: '215d8da0-000f-50be-b000-0003308c89be',
   *   status: 'waiting_for_capture',
   *   paid: false,
   *   amount:
   *   {
   *     value: '2.00',
   *     currency: 'RUB'
   *   },
   *   created_at: '2017-11-10T05:54:42.563Z',
   *   metadata: {},
   *   payment_method:
   *   {
   *     type: 'bank_card',
   *     id: '215d8da0-000f-50be-b000-0003308c89be',
   *     saved: false
   *   },
   *   recipient:
   *   {
   *     account_id: 'your_shop_id',
   *    gateway_id: 'gateaway_id'
   *   }
   * }
   */
  _getPaymentInfo: function(paymentId, idempotenceKey) {
    return utils.request.call(this, 'GET', 'payments/' + paymentId, {}, idempotenceKey);
  },

  /**
   * Get info about payment by id
   * @see _getPaymentInfo()
   * @param {string} paymentId
   * @paramExample '215d8da0-000f-50be-b000-0003308c89be'
   * @param {string} idempotenceKey
   * @paramExample '6daac9fa-342d-4264-91c5-b5eafd1a0010'
   * @returns {Promise<Payment>}
   */
  getPaymentInfo: function(paymentId, idempotenceKey) {
    var _self = this;
    return this._getPaymentInfo(paymentId, idempotenceKey).then(function(data) {
      return new Payment(_self, data);
    });
  },

  /**
   * Capture payment with status 'waiting_for_capture'. status change to 'succeeded'
   * @see https://kassa.yandex.ru/docs/checkout-api/#podtwerzhdenie-platezha
   * @param {string} paymentId
   * @paramExample '215d8da0-000f-50be-b000-0003308c89be'
   * @param {Object} amount
   * @paramExample
   * {
   *   "amount": {
   *     "value": "2.00",
   *     "currency": "RUB"
   *   }
   * }
   * @param {string} idempotenceKey
   * @paramExample '6daac9fa-342d-4264-91c5-b5eafd1a0010'
   * @returns {Promise<Object>}
   * @returnExample
   * {
   *   "id": "215d8da0-000f-50be-b000-0003308c89be",
   *   "status": "succeeded",
   *   "paid": true,
   *   "amount":
   *   {
   *     "value": "2.00",
   *     "currency": "RUB"
   *   },
   *   "created_at": "2017-11-10T05:58:42.563Z",
   *   "metadata": {},
   *   payment_method:
   *   {
   *     type: 'bank_card',
   *     id: '215d8da0-000f-50be-b000-0003308c89be',
   *     saved: false
   *   },
   *   recipient:
   *   {
   *     account_id: 'your_shop_id',
   *     gateway_id: 'gateaway_id'
   *   }
   * }
   */
  _capturePayment: function(paymentId, amount, idempotenceKey) {
    return utils.request.call(this, 'POST', 'payments/' + paymentId + '/capture',
      { amount: amount },
      idempotenceKey);
  },

  /**
   * @see _capturePayment()
   * @param {string} paymentId
   * @paramExample '215d8da0-000f-50be-b000-0003308c89be'
   * @param {Object} amount
   * @paramExample
   * {
   *   "amount": {
   *     "value": "2.00",
   *     "currency": "RUB"
   *   }
   * }
   * @param {string} idempotenceKey
   * @paramExample '6daac9fa-342d-4264-91c5-b5eafd1a0010'
   * @returns {Promise<Payment>}
   */
  capturePayment: function(paymentId, amount, idempotenceKey) {
    var _self = this;
    return this._capturePayment(paymentId, amount, idempotenceKey).then(function(data) {
      return new Payment(_self, data);
    });
  },

  /**
   * Cancel payment with status 'waiting_for_capture'. status change to 'canceled'
   * @see https://kassa.yandex.ru/docs/checkout-api/#otmena-platezha
   * @param {string} paymentId
   * @paramExample '215d8da0-000f-50be-b000-0003308c89be'
   * @param {string} idempotenceKey
   * @paramExample '6daac9fa-342d-4264-91c5-b5eafd1a0010'
   * @returns {Promise<Object>}
   * @returnExample
   * {
   *   "id": "215d8da0-000f-50be-b000-0003308c89be",
   *   "status": "canceled",
   *   "paid": true,
   *   "amount":
    *  {
   *     "value": "2.00",
   *     "currency": "RUB"
   *   },
   *   "created_at": "2017-11-10T05:58:42.563Z",
   *   "metadata": {},
   *   payment_method:
   *   {
   *     type: 'bank_card',
   *     id: '215d8da0-000f-50be-b000-0003308c89be',
   *     saved: false
   *   },
   *   recipient:
   *   {
   *     account_id: 'your_shop_id',
   *     gateway_id: 'gateaway_id'
   *   }
   * }
   */
  _cancelPayment: function(paymentId, idempotenceKey) {
    return utils.request.call(this, 'POST', 'payments/' + paymentId + '/cancel', {},
      idempotenceKey);
  },

  /**
   * @see _cancelPayment()
   * @param {string} paymentId
   * @paramExample '215d8da0-000f-50be-b000-0003308c89be'
   * @param {string} idempotenceKey
   * @paramExample '6daac9fa-342d-4264-91c5-b5eafd1a0010'
   * @returns {Promise<Payment>}
   */
  cancelPayment: function(paymentId, idempotenceKey) {
    var _self = this;
    return this._cancelPayment(paymentId, idempotenceKey).then(function(data) {
      return new Payment(_self, data);
    });
  },
  /**
   * Create new refund
   * @see https://kassa.yandex.ru/docs/checkout-api/#sozdanie-wozwrata
   * @param {string} paymentId
   * @paramExample '215d8da0-000f-50be-b000-0003308c89be'
   * @param {Object} amount
   * @paramExample
   * {
   *   "amount": {
   *     "value": "2.00",
   *     "currency": "RUB"
   *   }
   * }
   * @param {string} idempotenceKey
   * @paramExample '6daac9fa-342d-4264-91c5-b5eafd1a0010'
   * @returns {Promise<Object>}
   */
  _createRefund: function(paymentId, amount, idempotenceKey) {
    return utils.request.call(this, 'POST', 'refunds',
      {
        amount: amount,
        payment_id: paymentId,
      },
      idempotenceKey);
  },

  /**
   * @see _createRefund()
   * @param {string} paymentId
   * @paramExample '215d8da0-000f-50be-b000-0003308c89be'
   * @param {Object} amount
   * @paramExample
   * {
   *   "amount": {
   *     "value": "2.00",
   *     "currency": "RUB"
   *   }
   * }
   * @param {string} idempotenceKey
   * @paramExample '6daac9fa-342d-4264-91c5-b5eafd1a0010'
   * @returns {Promise<Refund>}
   * @returnExample
   * {
   *   "id": "216749f7-0016-50be-b000-078d43a63ae4",
   *   "status": "succeeded",
   *   "amount":
   *   {
   *     "value": "1",
   *     "currency": "RUB"
   *   },
   *   "authorized_at": "2017-11-10T19:27:51.609Z",
   *   "created_at": "2017-10-04T19:27:51.407Z",
   *   "payment_id": "215d8da0-000f-50be-b000-0003308c89be"
   * }
   */
  createRefund: function(paymentId, amount, idempotenceKey) {
    var _self = this;
    return this._createRefund(paymentId, amount, idempotenceKey).then(function(data) {
      return new Refund(_self, data);
    });
  },

  /**
   * Get info about refund by id
   * @see https://kassa.yandex.ru/docs/checkout-api/#informaciq-o-wozwrate
   * @param {string} refundId
   * @paramExample '216749f7-0016-50be-b000-078d43a63ae4'
   * @param {string} idempotenceKey
   * @paramExample '6daac9fa-342d-4264-91c5-b5eafd1a0010'
   * @returns {Promise<Object>}
   * @returnExample
   * {
   *   "id": "216749f7-0016-50be-b000-078d43a63ae4",
   *   "status": "succeeded",
   *   "amount":
   *   {
   *     "value": "1",
   *     "currency": "RUB"
   *   },
   *   "authorized_at": "2017-11-10T19:27:51.609Z",
   *   "created_at": "2017-10-04T19:27:51.407Z",
   *   "payment_id": "219752e2-000f-50bf-b000-03f3dda898c8"
   * }
   */
  _getRefundInfo: function(refundId, idempotenceKey) {
    return utils.request.call(this, 'GET', 'refunds/' + refundId, {}, idempotenceKey);
  },

  /**
   * @see _getRefundInfo
   * @param {string} refundId
   * @paramExample '216749f7-0016-50be-b000-078d43a63ae4'
   * @param {string} idempotenceKey
   * @paramExample '6daac9fa-342d-4264-91c5-b5eafd1a0010'
   * @returns {Promise<Refund>}
   */
  getRefund: function(refundId, idempotenceKey) {
    var _self = this;
    return this._getRefundInfo(refundId, idempotenceKey).then(function(data) {
      return new Refund(_self, data);
    });
  }
};

/**
 * @param {string} shopId
 * @param {string} secretKey
 * @returns {YandexCheckout}
 */
function init(shopId, secretKey) {
  return new YandexCheckout(shopId, secretKey);
}

module.exports = init;
module.exports.YandexCheckout = YandexCheckout;
