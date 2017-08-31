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
    bool paid;
    bool isCompleted;
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

  function isPaid(uint externalPaymentId) constant returns (bool) {
    Payment payment = payments[externalPaymentId];
    require(payment.price > 0);
    return payment.paid;
  }

  function checkIfPaymentExists(uint externalPaymentId) constant returns(bool) {
    Payment payment = payments[externalPaymentId];
    return payment.price > 0;
  }

  function startNewPayment(uint externalPaymentId, uint price) onlyOwner {
    require(!checkIfPaymentExists(externalPaymentId) && price > 0);
    payments[externalPaymentId] = Payment(price, false, false, 0x0);
  }

  function pay(uint externalPaymentId) payable {
    Payment payment = payments[externalPaymentId];
    require(payment.price > 0 && msg.value == payment.price);
    payment.paid = true;
    payment.buyer = msg.sender;
  }

  function complete(uint externalPaymentId) onlyOwner {
    Payment payment = payments[externalPaymentId];
    require(payment.price > 0 && !payment.isCompleted);
    billingAddress.transfer(payment.price);
    payment.isCompleted = true;
  }


  function isCompleted(uint externalPaymentId) constant returns (bool) {
    Payment payment = payments[externalPaymentId];
    require(payment.price > 0);
    return payment.isCompleted;
  }

  function refund(uint externalPaymentId) onlyOwner {
    Payment payment = payments[externalPaymentId];
    require(payment.price > 0 && !payment.isCompleted);
    payment.buyer.transfer(payment.price);
  }

  //fallback function is implemented to recieve transfers
  function() payable {}
}
