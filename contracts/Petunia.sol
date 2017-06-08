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

  struct Payment {
    uint price;
    address paymentContract;
    bool isDefined;
  }

  event NewPayment(string externalPaymentId, uint price);
  event PaymentRefunded(string externalPaymentId);
  event PaymentCompleted(string externalPaymentId, uint petuniaBalance, uint paymentAccountBalance);
  event PaymentSuccess(string externalPaymentId, uint petuniaBalance, uint paymentAccountBalance);

  mapping (string => Payment) payments;

  function isPaid(string externalPaymentId) constant returns (bool) {
    Payment payment = payments[externalPaymentId];
    if(payment.isDefined) {
      return PaymentContract(payment.paymentContract).isPaid();
    } else {
      throw;
    }
  }

  function checkIfPaymentExists(string externalPaymentId) constant returns(bool) {
    Payment payment = payments[externalPaymentId];
    return payment.isDefined;
  }

  function startNewPayment(string externalPaymentId, uint price) onlyOwner {
    Payment payment = payments[externalPaymentId];
    if(payment.isDefined) {
      throw;
    } else {
      PaymentContract paymentContract = new PaymentContract(price);
      payments[externalPaymentId] = Payment(price, paymentContract, true);
      NewPayment(externalPaymentId, price);
    }
  }

  function pay(string externalPaymentId) payable {
    Payment payment = payments[externalPaymentId];
    if(payment.isDefined == false) {
      throw;
    } else {
      PaymentContract paymentContract = PaymentContract(payment.paymentContract);
      uint payedPrice = msg.value;
      if(payedPrice == payment.price) {
        paymentContract.pay.value(payedPrice)(msg.sender);
        PaymentSuccess(externalPaymentId, this.balance, paymentContract.balance);
      } else {
        throw;
      }
    }
  }

  function complete(string externalPaymentId) onlyOwner {
    Payment payment = payments[externalPaymentId];
    if(payment.isDefined) {
      PaymentContract paymentContract = PaymentContract(payment.paymentContract);
      if(!paymentContract.isCompleted()) {
        paymentContract.complete();
        owner.transfer(payment.price);
        PaymentCompleted(externalPaymentId, this.balance, paymentContract.balance);
      } else {
        throw;
      }
    }
  }

  function isCompleted(string externalPaymentId) constant returns (bool) {
    Payment payment = payments[externalPaymentId];
    if(payment.isDefined) {
      return PaymentContract(payment.paymentContract).isCompleted();
    } else {
      throw;
    }
  }

  function refund(string externalPaymentId) onlyOwner {
    Payment payment = payments[externalPaymentId];
    if(payment.isDefined) {
      PaymentContract(payment.paymentContract).refund();
      PaymentRefunded(externalPaymentId);
    } else {
      throw;
    }
  }

  //fallback function is implemented to recieve transfers
  function() payable {}
}

contract PaymentContract is owned {
    uint price;
    bool completed;
    address buyerAddress;

    function pay(address _buyerAddress) payable onlyOwner {
      buyerAddress = _buyerAddress;
    }

    function PaymentContract(uint _price) {
      price = _price;
    }

    function isPaid() onlyOwner constant returns (bool) {
      address myAddress = this;
      return myAddress.balance >= price;
    }

    function complete() onlyOwner payable {
      owner.transfer(this.balance);
      completed = true;
    }

    function refund() onlyOwner payable {
      buyerAddress.transfer(this.balance);
    }

    function isCompleted() onlyOwner returns (bool) {
      return completed;
    }
}
