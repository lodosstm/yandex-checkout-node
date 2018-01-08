var YandexCheckout = require('../../lib/index')({ shopId: 'your_shop_id', secretKey: 'your_secret_key' });
var paymentId = 'your_payment_id';
var idempotenceKey = 'your_idempotence_key'; // it is not required

YandexCheckout.capturePayment(paymentId,
  {
    'value': '2.00',
    'currency': 'RUB'
  }, idempotenceKey)
  .then(function(result) {
    console.log({ payment: result });
  })
  .catch(function(err) {
    console.error(err);
  });
