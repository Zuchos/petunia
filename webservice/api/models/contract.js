exports.contractAddress = '0x9bd0a645da0fb37d1c667c2105bc0256bc191d89';

exports.contractABI = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "externalPaymentId",
        "type": "uint256"
      }
    ],
    "name": "checkIfPaymentExists",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "externalPaymentId",
        "type": "uint256"
      }
    ],
    "name": "refund",
    "outputs": [],
    "payable": false,
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "externalPaymentId",
        "type": "uint256"
      }
    ],
    "name": "getStatus",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "externalPaymentId",
        "type": "uint256"
      }
    ],
    "name": "complete",
    "outputs": [],
    "payable": false,
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getBillingAddress",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "externalPaymentId",
        "type": "uint256"
      }
    ],
    "name": "pay",
    "outputs": [],
    "payable": true,
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "externalPaymentId",
        "type": "uint256"
      },
      {
        "name": "price",
        "type": "uint256"
      }
    ],
    "name": "startNewPayment",
    "outputs": [],
    "payable": false,
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "externalPaymentId",
        "type": "uint256"
      }
    ],
    "name": "getPrice",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "_billingAddress",
        "type": "address"
      }
    ],
    "payable": false,
    "type": "constructor"
  },
  {
    "payable": true,
    "type": "fallback"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "externalPaymentId",
        "type": "uint256"
      }
    ],
    "name": "PaymentPaid",
    "type": "event"
  }
];
