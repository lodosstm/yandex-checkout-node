module.exports.responseForCreate = {
  id: '219752e2-000f-50bf-b000-03f3dda898c8',
  status: 'waiting_for_capture',
  paid: true,
  amount: { value: '2.00', currency: 'RUB' },
  confirmation:
    { type: 'redirect',
      return_url: 'https://www.merchant-website.com/return_url',
      confirmation_url: 'https://money.yandex.ru/payments/kassa/confirmation?orderId=219752e2-000f-50bf-b000-03f3dda898c8' },
  created_at: '2017-11-10T05:54:42.563Z',
  metadata: {},
  payment_method:
    { type: 'bank_card',
      id: '219752e2-000f-50bf-b000-03f3dda898c8',
      saved: false },
  recipient: { account_id: 'your_shop_id', gateway_id: 'gateaway_id' }
};

module.exports.responseForGetInfo = {
  id: '219752e2-000f-50bf-b000-03f3dda898c8',
  status: 'waiting_for_capture',
  paid: false,
  amount: { value: '2.00', currency: 'RUB' },
  created_at: '2017-11-10T05:54:42.563Z',
  metadata: {},
  payment_method:
    { type: 'bank_card',
      id: '219752e2-000f-50bf-b000-03f3dda898c8',
      saved: false },
  recipient: { account_id: 'your_shop_id', gateway_id: 'gateaway_id' }
};

module.exports.responseForConfirmPayment = {
  "id": "219752e2-000f-50bf-b000-03f3dda898c8",
  "status": "succeeded",
  "paid": true,
  "amount": {
    "value": "2.00",
    "currency": "RUB"
  },
  "created_at": "2017-11-10T05:58:42.563Z",
  "metadata": {},
  payment_method:
    { type: 'bank_card',
      id: '219752e2-000f-50bf-b000-03f3dda898c8',
      saved: false },
  recipient: { account_id: 'your_shop_id', gateway_id: 'gateaway_id' }
};

module.exports.responseForCancelPayment = {
  "id": "219752e2-000f-50bf-b000-03f3dda898c8",
  "status": "canceled",
  "paid": true,
  "amount": {
    "value": "2.00",
    "currency": "RUB"
  },
  "created_at": "2017-11-10T05:58:42.563Z",
  "metadata": {},
  payment_method:
    { type: 'bank_card',
      id: '219752e2-000f-50bf-b000-03f3dda898c8',
      saved: false },
  recipient: { account_id: 'your_shop_id', gateway_id: 'gateaway_id' }
};

module.exports.responseForRefundCreateAndGet = {
  "id": "219752f7-0016-50be-b000-078d43a63ae4",
  "status": "succeeded",
  "amount": {
    "value": "1",
    "currency": "RUB"
  },
  "authorized_at": "2017-11-10T19:27:51.609Z",
  "created_at": "2017-10-04T19:27:51.407Z",
  "payment_id": "219752e2-000f-50bf-b000-03f3dda898c8"
};
