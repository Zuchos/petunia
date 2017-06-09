pragma solidity ^0.4.4;

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

  mapping (string => PaymentContract) payments;

  function isPaid(string externalPaymentId) constant returns (bool) {
    PaymentContract payment = payments[externalPaymentId];
    if(payment.isDefined()) {
      return payment.isPaid();
    } else {
      throw;
    }
  }

  function checkIfPaymentExists(string externalPaymentId) constant returns(bool) {
    PaymentContract payment = payments[externalPaymentId];
    address addr = payment;
    return addr != 0x0;
  }

  function startNewPayment(string externalPaymentId, uint price) onlyOwner {
    if(checkIfPaymentExists(externalPaymentId)) {
      throw;
    } else {
      PaymentContract paymentContract = new PaymentContract(price);
      payments[externalPaymentId] = paymentContract;
    }
  }

  function pay(string externalPaymentId) payable {
    PaymentContract payment = payments[externalPaymentId];
    if(payment.isDefined() == false) {
      throw;
    } else {
      uint payedPrice = msg.value;
      uint price = payment.price();
      if(payedPrice == price) {
        payment.pay.value(payedPrice)(msg.sender);
      } else {
        throw;
      }
    }
  }

  function complete(string externalPaymentId) onlyOwner {
    PaymentContract payment = payments[externalPaymentId];
    if(payment.isDefined()) {
      if(!payment.completed()) {
        payment.complete();
        owner.transfer(payment.price());
      } else {
        throw;
      }
    }
  }

  function isCompleted(string externalPaymentId) constant returns (bool) {
    PaymentContract payment = payments[externalPaymentId];
    if(payment.isDefined()) {
      return payment.completed();
    } else {
      throw;
    }
  }

  function refund(string externalPaymentId) onlyOwner {
    PaymentContract payment = payments[externalPaymentId];
    if(payment.isDefined()) {
      payment.refund();
    } else {
      throw;
    }
  }

  //fallback function is implemented to recieve transfers
  function() payable {}
}

contract PaymentContract is owned {
    uint public price;
    bool public completed;
    address buyerAddress;

    function pay(address _buyerAddress) payable onlyOwner {
      buyerAddress = _buyerAddress;
    }

    function isDefined() constant returns(bool) {
      address my = this;
      return my != 0x0;
    }

    function PaymentContract(uint _price) {
      price = _price;
    }

    function isPaid() onlyOwner constant returns (bool) {
      return this.balance >= price;
    }

    function complete() onlyOwner payable {
      owner.transfer(this.balance);
      completed = true;
    }

    function refund() onlyOwner payable {
      buyerAddress.transfer(this.balance);
    }
}
