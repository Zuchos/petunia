export const contractAddress = '0xd426290396f25967b7f9b60e757e65cb8c0e22b1';

export const contractABI = [
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
    "name": "isCompleted",
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
    "constant": true,
    "inputs": [
      {
        "name": "externalPaymentId",
        "type": "uint256"
      }
    ],
    "name": "isPaid",
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
