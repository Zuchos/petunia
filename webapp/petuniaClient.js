var contractAddress = '0xd426290396f25967b7f9b60e757e65cb8c0e22b1';

var contractABI = [
  {
    'constant': true,
    'inputs': [{
      'name': 'externalPaymentId',
      'type': 'uint256'
    }],
    'name': 'checkIfPaymentExists',
    'outputs': [{
      'name': '',
      'type': 'bool'
    }],
    'payable': false,
    'type': 'function'
  },
  {
    'constant': false,
    'inputs': [{
      'name': 'externalPaymentId',
      'type': 'uint256'
    }],
    'name': 'refund',
    'outputs': [],
    'payable': false,
    'type': 'function'
  },
  {
    'constant': true,
    'inputs': [{
      'name': 'externalPaymentId',
      'type': 'uint256'
    }],
    'name': 'isCompleted',
    'outputs': [{
      'name': '',
      'type': 'bool'
    }],
    'payable': false,
    'type': 'function'
  },
  {
    'constant': false,
    'inputs': [{
      'name': 'externalPaymentId',
      'type': 'uint256'
    }],
    'name': 'complete',
    'outputs': [],
    'payable': false,
    'type': 'function'
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'getBillingAddress',
    'outputs': [{
      'name': '',
      'type': 'address'
    }],
    'payable': false,
    'type': 'function'
  },
  {
    'constant': false,
    'inputs': [{
      'name': 'externalPaymentId',
      'type': 'uint256'
    }],
    'name': 'pay',
    'outputs': [],
    'payable': true,
    'type': 'function'
  },
  {
    'constant': true,
    'inputs': [{
      'name': 'externalPaymentId',
      'type': 'uint256'
    }],
    'name': 'isPaid',
    'outputs': [{
      'name': '',
      'type': 'bool'
    }],
    'payable': false,
    'type': 'function'
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': 'externalPaymentId',
        'type': 'uint256'
      },
      {
        'name': 'price',
        'type': 'uint256'
      }
    ],
    'name': 'startNewPayment',
    'outputs': [],
    'payable': false,
    'type': 'function'
  },
  {
    'inputs': [{
      'name': '_billingAddress',
      'type': 'address'
    }],
    'payable': false,
    'type': 'constructor'
  },
  {
    'payable': true,
    'type': 'fallback'
  },
  {
    'anonymous': false,
    'inputs': [{
      'indexed': false,
      'name': 'externalPaymentId',
      'type': 'uint256'
    }],
    'name': 'PaymentPaid',
    'type': 'event'
  }
];

const loadContract = (web3) => {
  const petunia = web3.eth.contract(contractABI).at(contractAddress);

  var account = null;

  web3.eth.getAccounts(function (e, r) {
    if (e) {
      console.log(e);
    } else {
      account = r[0];
    }
  });

  const isPaid = (paymentId) => new Promise((resolve, reject) => {
    petunia.isPaid.call(paymentId, (e, r) => {
      if (e) {
        console.log(e);
      } else {
        resolve(r);
      }
    });
  });

  const pay = (paymentId, price) => new Promise((resolve, reject) => {
    petunia.pay(paymentId, {
      from: account[0],
      value: price
    }, (e, r) => {
      if (e) {
        console.log(e);
      } else {
        resolve(r);
      }
    });
  });

  return {
    isPaid: isPaid,
    pay: pay,
    account: account
  };
};
