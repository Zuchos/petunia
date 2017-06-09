var Petunia = artifacts.require('./Petunia.sol');

const getBalance = (account) => {
  return new Promise((resolve, reject) => {
    web3.eth.getBalance(account, (error, balance) => {
      if (error) {
        console.error('Error when checking balance:' + error);
        return reject();
      } else {
        console.log('Balance:' + web3.fromWei(balance, 'ether') + ' of ' + account);
        return resolve(balance);
      }
    });
  });
};

const getGasPrice = () => {
  return new Promise((resolve, reject) => {
    web3.eth.getGasPrice((error, result) => {
      if (error) reject();
      else resolve(result);
    });
  });
};
const assertBalance = (account, expectedBalance) => {
  return getBalance(account).then(balance => assert.equals(balance, expectedBalance));
};

const price = web3.toBigNumber(web3.toWei(20, 'ether'));

contract('Petunia', (accounts) => {

  // it('should start new payment', () => {
  //   const paymentId = 'test1';
  //   const watcher = petunia.NewPayment();
  //   return petunia.startNewPayment(paymentId, price, {
  //     from: accounts[0]
  //   }).then(() => {
  //     return watcher.get();
  //   }).then((events) => {
  //     assert.equal(events.length, 1);
  //     actualPaymentId = events[0].args.externalPaymentId;
  //     actualPrice = events[0].args.price;
  //     assert.equal(actualPrice, price);
  //     assert.equal(actualPaymentId, paymentId);
  //   });
  // });
  //

  it('should check if payument exist', () => {
    const paymentId = 'test2';
    Petunia.deployed().then((instance) => {
      petunia = instance;
      console.log("here we start test!!!!");
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
  });
  //
  // it('payment creation should fail', () => {
  //   const paymentId = 'test3';
  //   return petunia.startNewPayment(paymentId, price, {
  //     from: accounts[0]
  //   }).then(() => {
  //     return petunia.startNewPayment(paymentId, price, {
  //       from: accounts[0]
  //     });
  //   }).then((events) => {
  //     assert.equal(false, true);
  //   }).catch((error) => {
  //     assert.equal(true, true);
  //   });
  // });

  it('should print the gas price', () => {
    return getGasPrice().then((gasPrice) => {
      if (gasPrice) {
        console.log("Gas price:" + web3.fromWei(gasPrice, 'ether').toString(10));
      }
    });
  });

  it('should follow the payment process to the successful end', () => {
    var petunia;
    const paymentId = 'test4';
    var initalSellerBalance, finalSellerBalance, initalBuyerBalance, finalBuyerBalance;
    const sellerAccount = accounts[0];
    const buyerAccount = accounts[2];
    return Petunia.deployed().then((instance) => {
      petunia = instance;
      console.log("here we start test!!!!");
      return getBalance(sellerAccount);
    }).then(balance => {
      initalSellerBalance = balance;
      return getBalance(buyerAccount);
    }).then(balance => {
      initalBuyerBalance = balance;
      return petunia.startNewPayment(paymentId, price, {
        from: sellerAccount
      });
    }).then(() => {
      return petunia.isPaid.call(paymentId);
    }).then((isPaid) => {
      assert.equal(isPaid,  false, 'Payment should be not paid yet');
    }).then(() => {
      return petunia.pay(paymentId, {
        from: buyerAccount,
        value: price
      });
    }).then(() => {
      return petunia.isPaid.call(paymentId);
    }).then((isPaid) => {
      assert.equal(isPaid, true, 'Payment should be paid.');
    }).then(() => {
      return petunia.complete(paymentId, {
        from: sellerAccount
      });
    }).then(() => {
      return getBalance(sellerAccount);
    }).then((balance) => {
      finalSellerBalance = balance;
      return getBalance(buyerAccount);
    }).then((balance) => {
      finalBuyerBalance = balance;
      const sellerDelta = finalSellerBalance.minus(initalSellerBalance);
      const sellerGas = price.minus(sellerDelta);
      console.log('seller delta:' + web3.fromWei(sellerDelta, 'ether'));
      console.log('seller gas  :' + web3.fromWei(sellerGas, 'ether'));
      const buyerDelta = finalBuyerBalance.minus(initalBuyerBalance);
      const buyerGas = price.plus(buyerDelta);
      console.log('buyer delta:' + web3.fromWei(buyerDelta, 'ether'));
      console.log('buyer gas  :' + web3.fromWei(buyerGas, 'ether'));
    }).catch((error) => {
      console.log("error:" + error);
      assert.equal(true, false);
    });
  });
});
