'use strict';

module.exports = function (web3) {
  var petunia = null;
  petunia = require('../models/petunia')(web3);

  const initPayment = function (req, res) {
    const input = req.body;
    console.log(input);
    const price = web3.toBigNumber(web3.toWei(input.price, 'szabo'));
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

  const checkIfPaymentExists = function (req, res) {
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

  const getStatus = function (req, res) {
    petunia.getStatus.call(req.params.id, (e, r) => {
      if (e) {
        res.status(500, e).end();
      } else {
        res.json({
          status: r
        });
      }
    });
  };

  const refund = function (req, res) {
    petunia.refund(req.params.id, {
      from: petunia.account
    }, (e, r) => {
      if (e) {
        res.status(500, e).end();
      } else {
        res.json({
          txId: r
        });
      }
    });
  };

  const complete = function (req, res) {
    petunia.complete(req.params.id, {
      from: petunia.account
    }, (e, r) => {
      if (e) {
        res.status(500, e).end();
      } else {
        res.json({
          txId: r
        });
      }
    });
  };

  return {
    initPayment: initPayment,
    checkIfPaymentExists: checkIfPaymentExists,
    getStatus: getStatus,
    refund: refund,
    complete: complete
  };
};
