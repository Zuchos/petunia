'use strict';
module.exports = function (app, web3) {
  var petuniaController = require('../controllers/petuniaController')(web3);

  // todoList Routes
  app.route('/payment/:id/exists')
    .get(petuniaController.checkIfPaymentExists);
  app.route('/payment/:id/status')
    .get(petuniaController.isPaid);
  app.route('/payment')
    .post(petuniaController.initPayment);
  app.route('/payment/:id/refund')
    .post(petuniaController.refund);
  app.route('/payment/:id/complete')
    .post(petuniaController.complete);
};
