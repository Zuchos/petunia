'use strict';

module.exports = function (http) {

  var paymentIdSeq = 1;

  const initPayment = function (request, response) {
    const input = request.body;
    var options = {
      host: 'localhost',
      port: 3000,
      path: '/payment/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    };
    var paymentId = paymentIdSeq++;

    const req = http.request(options, (res) => {
      console.log(res.statusCode)
      if (res.statusCode == 200) {
        response.json({
          status: 'OK',
          paymentId: paymentId
        });
      } else {
        response.json({
          status: 'FAIL'
        });
      }
    });

    req.on('error', (e) => {
      console.error(`problem with request: ${e.message}`);
      response.json({
        status: 'FAIL'
      });
    });

    var payload = {
      id: paymentId,
      price: input.price
    };
    req.write(JSON.stringify(payload));
    req.end();
  };

  return {
    initPayment: initPayment
  };
};
