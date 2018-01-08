'use strict';
var errors = require('request-promise-core/errors');

function PaymentError(error) {
  Error.call(this, error);
  this.name = 'PaymentError';
  this.message = error.description;
  this.id = error.id;
  this.code = error.code;
  this.parameter = error.parameter;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, PaymentError);
  }
  else {
    this.stack = (new Error()).stack;
  }

}

PaymentError.prototype = Object.create(Error.prototype);

module.exports = {
  PaymentError: PaymentError,
  RequestError: errors.RequestError,
  StatusCodeError: errors.StatusCodeError,
  TransformError: errors.TransformError
};