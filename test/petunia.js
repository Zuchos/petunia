var Petunia = artifacts.require('./Petunia.sol');

function getBalance(account) {
  return web3.eth.getBalance(account, (e, r) => {
    if (e)
      console.log('Error when checking balance:' + e);
    else
      console.log('Balance:' + r.toNumber());
  });
}

var price = 1000000000;

contract('Petunia', (accounts) => {
  var petunia;
  Petunia.deployed().then((instance) => {
    petunia = instance;
  });

  it('should start new payment', () => {
    const paymentId = 'test1';
    const watcher = petunia.NewPayment();
    return petunia.startNewPayment(paymentId, price, {
      from: accounts[0]
    }).then(() => {
      return watcher.get();
    }).then((events) => {
      assert.equal(events.length, 1);
      actualPaymentId = events[0].args.externalPaymentId;
      actualPrice = events[0].args.price;
      assert.equal(actualPrice, price);
      assert.equal(actualPaymentId, paymentId);
    });
  });

  it('should check if payument exist', () => {
    const paymentId = 'test2';
    return petunia.checkIfPaymentExists.call(paymentId).then((result) => {
      assert.equal(result, false);
    }).then(() => {
      return petunia.startNewPayment(paymentId, price, {
        from: accounts[0]
      });
    }).then(() => {
      return petunia.checkIfPaymentExists.call(paymentId).then((result) => {
        assert.equal(result, true);
      });
    });
  });

  it('payment creation should fail', () => {
    const paymentId = 'test3';
    return petunia.startNewPayment(paymentId, price, {
      from: accounts[0]
    }).then(() => {
      return petunia.startNewPayment(paymentId, price, {
        from: accounts[0]
      });
    }).then((events) => {
      assert.equal(false,  true);
    }).catch((error) => {
      assert.equal(true,  true);
    });
  });

  it('should follow the payment process to the successful end', function() {
    const paymentId = 'test4';
    var watcher = petunia.NewPayment();
    return petunia.startNewPayment(paymentId, price, {
      from: accounts[0]
    }).then(() => {
      return watcher.get();
    }).then((events) => {
      assert.equal(events[0].args.externalPaymentId, paymentId);
      return petunia.isPaid.call(paymentId);
    }).then((bool) => {
      assert.equal(bool, false, 'Payment should be not paid yet');
    }).then(() => {
      watcher = petunia.PaymentSuccess();
      return petunia.pay(paymentId, {
        from: accounts[0],
        value: price
      });
    }).then(() => {
      return watcher.get();
    }).then((events) => {
      const paymentAccountBalance = events[0].args.paymentAccountBalance;
      assert.equal(paymentAccountBalance, price, 'Payment account balance should be ' + price);
      return petunia.isPaid.call(paymentId);
    }).then((paid) => {
      assert.equal(paid, true, 'Payment should be paid.');
    }).then(() => {
      watcher = petunia.PaymentCompleted();
      return petunia.complete(paymentId, {
        from: accounts[0]
      });
    }).then(() => {
      return watcher.get();
    }).then((events) => {
      assert.equal(events.length, 1);
      const actualPaymentId = events[0].args.externalPaymentId;
      assert.equal(actualPaymentId, paymentId);
    });
  });
});
