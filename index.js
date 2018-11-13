'use strict';

var init = require('./lib/index');
module.exports = init;
// expose constructor as a named property to enable mocking with Sinon.JS
module.exports.YandexCheckout = init.YandexCheckout;
