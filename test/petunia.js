var Petunia = artifacts.require("./Petunia.sol");

function getBalance(account) {
  console.log("checking balance for:" + account);
  web3.eth.getBalance(account, function(e, r) {
    console.log("Balance:")
    if (e)
      console.log(e);
    else
      console.log(r.toNumber());
  });
}

var price = 1000000000;

contract('Petunia', function(accounts) {
  var petunia;
  Petunia.deployed().then(function(instance) {
    petunia = instance;
  });

  it("should start new payment", function() {
    const paymentId = "test1";
    const watcher = petunia.NewPayment();
    return petunia.startNewPayment(paymentId, price, {
      from: accounts[0]
    }).then(function() {
      return watcher.get();
    }).then(function(events) {
      assert.equal(events.length, 1);
      actualPaymentId = events[0].args.externalPaymentId;
      actualPrice = events[0].args.price;
      assert.equal(actualPrice,  price);
      assert.equal(actualPaymentId,  paymentId);
    });
  });

  it("should check if payument exist", function() {
    const paymentId = "test2";
    return petunia.checkIfPaymentExists.call(paymentId).then(function(result) {
      assert.equal(result,  false);
    }).then(function() {
      return petunia.startNewPayment(paymentId, price, {
        from: accounts[0]
      });
    }).then(function() {
      return petunia.checkIfPaymentExists.call(paymentId).then(function(result) {
        assert.equal(result,  true);
      });
    });
  });

  it("payment creation should fail", function() {
    const paymentId = "test3";
    return petunia.startNewPayment(paymentId, price, {
      from: accounts[0]
    }).then(function() {
      return petunia.startNewPayment(paymentId, price, {
        from: accounts[0]
      });
    }).then(function(events) {
      assert.equal(false,  true);
    }).catch(function(error) {
      assert.equal(true,  true);
    });
  });

  it("should follow the payment process to the successful end", function() {
    const paymentId = "test4";
    var watcher = petunia.NewPayment();
    return petunia.startNewPayment(paymentId, price, {
      from: accounts[0]
    }).then(function() {
      return watcher.get();
    }).then(function(events) {
      assert.equal(events[0].args.externalPaymentId, paymentId);
      return petunia.isPaid.call(paymentId);
    }).then(function(bool) {
      assert.equal(bool,  false, "Payment should be not paid yet");
    }).then(function() {
      watcher = petunia.PaymentSuccess();
      return petunia.pay(paymentId, {
        from: accounts[0],
        value: price
      });
    }).then(function() {
      return watcher.get();
    }).then(function(events) {
      const paymentAccountBalance = events[0].args.paymentAccountBalance;
      assert.equal(paymentAccountBalance,  price, "Payment account balance should be " + price);
      return petunia.isPaid.call(paymentId);
    }).then(function(paid) {
      assert.equal(paid,  true, "Payment should be paid.");
    }).then(function() {
      watcher = petunia.PaymentCompleted();
      return petunia.complete(paymentId, {
        from: accounts[0]
      });
    }).then(function() {
      return watcher.get();
    }).then(function(events) {
      assert.equal(events.length, 1);
      const actualPaymentId = events[0].args.externalPaymentId;
      assert.equal(actualPaymentId,  paymentId);
    });
  });
});
