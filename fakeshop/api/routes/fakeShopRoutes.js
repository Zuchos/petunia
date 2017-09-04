'use strict';
module.exports = function (app, http) {
  var fakeShopController = require('../controllers/fakeShopController')(http);

  // todoList Routes
  app.route('/payment')
    .post(fakeShopController.initPayment);
};
