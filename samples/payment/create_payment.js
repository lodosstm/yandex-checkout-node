var YandexCheckout = require('../../lib/index')({ shopId: 'your_shop_id', secretKey: 'your_secret_key' });
var idempotenceKey = 'your_idempotence_key'; // it is not required

YandexCheckout.createPayment({
  'amount': {
    'value': '2.00',
    'currency': 'RUB'
  },
  'payment_method_data': {
    'type': 'bank_card'
  },
  'confirmation': {
    'type': 'redirect',
    'return_url': 'https://www.merchant-website.com/return_url'
  }
}, idempotenceKey)
  .then(function(result) {
    console.log({ payment: result });
  })
  .catch(function(err) {
    console.error(err);
  });
