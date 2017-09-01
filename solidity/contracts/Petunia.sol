pragma solidity ^0.4.10;

contract owned {
    function owned() { owner = msg.sender; }
    address owner;

    modifier onlyOwner {
      require(msg.sender == owner);
      _;
    }
}

/**
 * Payment platform for small business
 */
contract Petunia is owned {

  address billingAddress;

  struct Payment {
    uint price;
    uint8 status;
    address buyer;
  }

  mapping (uint => Payment) payments;

  event PaymentPaid(uint externalPaymentId);

  function Petunia(address _billingAddress){
    billingAddress = _billingAddress;
  }

  function getBillingAddress() constant returns (address) {
    return billingAddress;
  }

  function getStatus(uint externalPaymentId) constant returns (string) {
    Payment payment = payments[externalPaymentId];
    if(payment.status == 0) {
      return 'NotExists';
    }
    if(payment.status == 1) {
      return 'New';
    }
    if(payment.status == 2) {
      return 'Paid';
    }
    if(payment.status == 3) {
      return 'Completed';
    }
    if(payment.status == 4) {
      return 'Refunded';
    }
    throw;
  }

  function checkIfPaymentExists(uint externalPaymentId) constant returns(bool) {
    Payment payment = payments[externalPaymentId];
    return payment.status > 0;
  }

  function getPrice(uint externalPaymentId) constant returns(uint) {
    Payment payment = payments[externalPaymentId];
    require(payment.status > 0);
    return payment.price;
  }

  function startNewPayment(uint externalPaymentId, uint price) onlyOwner {
    require(!checkIfPaymentExists(externalPaymentId) && price > 0);
    payments[externalPaymentId] = Payment(price, 1, 0x0);
  }

  function pay(uint externalPaymentId) payable {
    Payment payment = payments[externalPaymentId];
    require(payment.status == 1 && msg.value == payment.price);
    payment.status = 2;
    payment.buyer = msg.sender;
  }

  function complete(uint externalPaymentId) onlyOwner {
    Payment payment = payments[externalPaymentId];
    require(payment.price > 0 && payment.status == 2);
    billingAddress.transfer(payment.price);
    payment.status = 3;
  }

  function refund(uint externalPaymentId) onlyOwner {
    Payment payment = payments[externalPaymentId];
    require(payment.price > 0 && payment.status == 2);
    payment.buyer.transfer(payment.price);
    payment.status = 4;
  }

  //fallback function is implemented to recieve transfers
  function() payable {}
}
