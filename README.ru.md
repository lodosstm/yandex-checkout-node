# SDK для Yandex.Checkout API (неофициальная)

## Deprecated! Пакет не поддерживается, рекомендуется использовать https://github.com/a2seven/yoocheckout

[![Version](https://img.shields.io/npm/v/yandex-checkout.svg)](https://www.npmjs.org/package/yandex-checkout)
[![Build Status](https://travis-ci.org/lodosstm/yandex-checkout-node.svg?branch=master)](https://travis-ci.org/lodosstm/yandex-checkout-node)
[![Downloads](https://img.shields.io/npm/dm/yandex-checkout.svg)](https://www.npmjs.com/package/yandex-checkout)
[![Try on RunKit](https://badge.runkitcdn.com/yandex-checkout.svg)](https://runkit.com/npm/yandex-checkout)
[![Dependencies](https://david-dm.org/lodosstm/yandex-checkout-node.png)](https://david-dm.org/lodosstm/yandex-checkout-node)

[README](README.md) in English

Неофициальное SDK для Yandex.Checkout

[Yandex.Checkout](https://kassa.yandex.ru/) - универсальное решение для работы с онлайн-платежами. API Яндекс.Кассы
 построено на REST-принципах, работает с реальными объектами и обладает предсказуемым поведением. С помощью этого API
 вы можете отправлять запросы на оплату, сохранять платежную информацию для повторных списаний, совершать возвраты и
 многое другое.

API в качестве основного протокола использует HTTP, а значит, подходит для разработки на любом языке программирования,
который умеет работать с HTTP-библиотеками (cURL и другими). Для аутентификации используется Basic Auth, поэтому вы
можете сделать свой первый запрос прямо из браузера.

API поддерживает POST и GET-запросы. POST-запросы используют параметры в формате JSON,
GET-запросы работают со строками.
API всегда возвращает ответ в формате JSON, независимо от типа запроса.

## Аутентификация

Для аутентификации запросов в заголовках запросов необходимо передавать:
- имя пользователя - идентификатор вашего магазина в Яндекс.Кассе;
- пароль — ваш секретный ключ.

Выпустить секретный ключ (а также перевыпустить и удалить неактуальный) можно в личном кабинете Яндекс.Кассы, в разделе
[Настройки](https://money.yandex.ru/my/tunes)

Пример запроса с аутентификацией
```
$ curl https://payment.yandex.net/api/v3/payments/{payment_id} \
-u <Идентификатор магазина>: <Секретный ключ>
```
## Идемпотентность

В контексте API [идемпотентность](https://tools.ietf.org/html/rfc7231#section-4.2.2) означает, что многократные запросы
обрабатываются так же, как однократные.

Это значит, что получив повторный запрос с теми же параметрами, Yandex.Checkout выдаст в ответе результат исходного запроса
(если запрос выполнен) или статус в обработке (если запрос еще выполняется).

Такое поведение помогает избежать нежелательного повторения транзакций. Например, если при проведении платежа возникли
проблемы с сетью и соединение прервалось, вы сможете безопасно повторить нужный запрос неограниченное количество раз.

GET-запросы являются по умолчанию идемпотентными, так как не имеют нежелательных последствий

Для обеспечения идемпотентности POST-запросов используется заголовок Idempotence-Key (или ключ идемпотентности).

Как это работает: если вы повторяете запрос с теми же данными и тем же ключом, API обрабатывает его как повторный;
если данные в запросе те же, а ключ идемпотентности отличается, запрос выполняется как новый.

Пример запроса с ключом идемпотентности:
```
$ curl https://payment.yandex.net/api/v3/refunds \
  -X POST \
  -u : <Идентификатор магазина>:<Секретный ключ>\
  -H 'Idempotence-Key: <Ключ идемпотентности>' \
  -H 'Content-Type: application / json' \
  -d '{
        "amount": {
          "value": "2.00",
          "currency": "RUB"
        },
        "payment_id": "215d8da0-000f-50be-b000-0003308c89be"
      } '
```

В заголовке Idempotence-Key можно передавать любое значение, уникальное для этой операции на вашей стороне.
Мы рекомендуем использовать V4 UUID.

Yandex.Checkout обеспечивает идемпотентность в течение 24 часов после первого запроса, потом повторный запрос будет
обработан как новый.

## Асинхронность

Каждый платеж — это сложный процесс, в котором задействованы несколько участников. Обработка транзакций может занимать
до нескольких секунд, поэтому Yandex.Checkout обрабатывает запросы асинхронно. Это позволяет сделать API по-настоящему
производительным и не держать соединение открытым в течение нескольких секунд.

Если Yandex.Checkout по каким-то причинам не успевает обработать запрос за отведенное время, в ответ приходит HTTP-код 202
и объект с типом processing. Чтобы получить результат, отправьте запрос еще раз с теми же данными и тем же
Idempotence-Key. В поле retry_after API возвращает количество миллисекунд, через которое рекомендуется повторить запрос.

Пример тела ответа, после которого требуется повторить запрос
```
  {
    "type": "processing",
    "description": "Request accepted, but not processed yet. Retry again with the same Idempotence-Key",
    retry_after: 1800
  }
```
## Ссылки
[Yandex.Checkout API](https://kassa.yandex.ru/docs/checkout-api/#api-yandex-kassy)

## Сборка
```bash
npm install yandex-checkout
```
## Начало работы
Для использования вы должны иметь идентификатор магазина и секретный ключ, получить которые
(а также перевыпустить и удалить неактуальные) можно в личном кабинете Яндекс.Кассы в разделе
[Настройки](https://money.yandex.ru/my/tunes). Также
[Описание того, как выпустить секретный ключ](https://yandex.ru/support/checkout/payments/keys.html)
После того, как вы получили идентификатор магазина и секретный ключ
- Добавить 'yandex-checkout' в ваш package.json файл.
- Импортировать 'yandex-checkout' в ваше приложения с идентификатором магазина и секретным ключом.

Вы можете сделать это 2 способами:

##### Первый:
```javascript
var yandexCheckout = require('yandex-checkout')('Ваш идентификатор магазина', 'Ваш секретный ключ');
```

##### Второй:
```javascript
var yandexCheckout = require('yandex-checkout')({ shopId: 'Ваш идентификатор магазина', secretKey: 'Ваш секретный ключ' });
```

##### Также вы можете использовать данные параметры для настройки:
- timeout( значение по умолчанию = 120000 )
- debug( значение по умолчанию = false )
- host( значение по умолчанию = 'https://payment.yandex.net' )
- path( значение по умолчанию = '/api/v3/' )

##### Например:
```javascript
var yandexCheckout = require('yandex-checkout')({ shopId: 'Ваш идентификатор магазина', secretKey: 'Ваш секретный ключ', timeout: 20000 });
```
### Примеры

##### Создание платежа
```javascript
var idempotenceKey = '02347fc4-a1f0-49db-807e-f0d67c2ed5a5';
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
    console.log({payment: result});
  })
  .catch(function(err) {
    console.error(err);
  })
```

##### Получение информации о платеже
```javascript
var paymentId  = '21966b95-000f-50bf-b000-0d78983bb5bc';
YandexCheckout.getPayment(paymentId)
  .then(function(result) {
    console.log({payment: result});
  })
  .catch(function(err) {
    console.error(err);
  })
```



## Запуск тестов

Установите зависимости:
```bash
$ npm install
```

Запустите тесты:
```bash
$ npm test
```