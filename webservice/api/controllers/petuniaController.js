'use strict';

module.exports = function(web3) {
  var petunia = null;
  petunia = require('../models/petunia')(web3);

  const initPayment = function(req, res) {
    console.log(req.body);
    const input = req.body;
    const price = web3.toBigNumber(web3.toWei(input.price, 'ether'));
    petunia.startNewPayment(input.id, price, {
      from: petunia.account
    }, (e, r) => {
      if (e) {
        res.status(500, e).end();
      } else {
        res.json({
          status: 'OK',
          txId: r
        });
      }
    });
  };

  const checkIfPaymentExists = function(req, res) {
    petunia.checkIfPaymentExists.call(req.params.id, (e, r) => {
      if (e) {
        res.status(500, e).end();
      } else {
        res.json({
          status: 'OK',
          exists: r
        });
      }
    });
  };

  const isPaid = function(req, res) {
    petunia.isPaid.call(req.params.id, (e, r) => {
      console.log(e+r);
      if (e) {
        res.status(500, e).end();
      } else {
        res.json({
          status: 'OK',
          paid: r
        });
      }
    });
  };

  return {
    initPayment: initPayment,
    checkIfPaymentExists: checkIfPaymentExists,
    isPaid: isPaid
  };
};
