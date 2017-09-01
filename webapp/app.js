(function (angular) {
  'use strict';
  var myApp = angular.module('app', ['ngRoute']);

  if (typeof web3 !== 'undefined' && typeof Web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
  } else if (typeof Web3 !== 'undefined') {
    console.log('No web3? You should consider trying MetaMask!')
    web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
  }

  myApp.config(function ($provide) {
    $provide.provider('ethClinet', function () {
      this.$get = function () {
        return web3;
      };
    });
  });

  myApp.service('EthService', ['ethClinet', '$q', function (ethClinet, $q) {
    this.fetchAccout = () => $q((resolve, reject) => {
      ethClinet.eth.getAccounts(function (e, r) {
        if (e) {
          reject(e);
        } else {
          resolve(r);
        }
      });
    });
  }]);

  myApp.service('Petunia', ['ethClinet', '$q', function (ethClinet, $q) {
    const petunia = ethClinet.eth.contract(contractABI).at(contractAddress);

    var account = null;
    $q((resolve, reject) => ethClinet.eth.getAccounts(function (e, r) {
      if (e) {
        reject(e);
      } else {
        account = r[0];
      }
    }));

    const callback = (resolve, reject) => {
      return (e, r) => {
        if (e) {
          reject(e);
        } else {
          resolve(r);
        }
      }
    };

    this.getStatus = (paymentId) => $q((resolve, reject) => {
      return petunia.getStatus.call(paymentId, callback(resolve, reject));
    });

    this.checkIfPaymentExists = (paymentId) => $q((resolve, reject) => {
      return petunia.checkIfPaymentExists.call(paymentId, callback(resolve, reject));
    });

    this.getPrice = (paymentId) => $q((resolve, reject) => {
      return petunia.getPrice.call(paymentId, callback(resolve, reject));
    });

    this.pay = (paymentId, price) => $q((resolve, reject) => {
      petunia.pay(paymentId, {
        from: account,
        value: price
      }, callback(resolve, reject));
    });
    }]);

  myApp.controller('PaymentController', function ($scope, ethClinet, $timeout, EthService, Petunia, $routeParams, $q) {
    $scope.price = ethClinet.toWei(0, 'ether');
    $scope.paymentId = 'N/A';
    $scope.status = 'Loading...';
    $scope.pay = () => {
      if ($scope.status == 'New') {
        $scope.status = 'InProgress';
        Petunia.pay($scope.paymentId, ethClinet.toBigNumber($scope.price)).then(() => {
          return $timeout(() => $scope.getStatus(), 5000);
        });
      } else {
        return $q.reject();
      }
    };

    $scope.getStatus = () => {
      return Petunia.getStatus($scope.paymentId).then(status => {
        $scope.status = status;
        return status;
      });
    };

    $scope.$on('$routeChangeSuccess', function () {
      $scope.paymentId = $routeParams.paymentId;
      $scope.getStatus().then(status => {
        if (status !== 'NotExists')
          return Petunia.getPrice($scope.paymentId);
      }).then(price => {
        $scope.price = ethClinet.toBigNumber(price);
        $scope.priceInEth = ethClinet.fromWei($scope.price, 'ether');
      });
    });

  });

  myApp.config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/:paymentId', {
        templateUrl: 'index.html',
        controller: 'PaymentController',
      });
    $locationProvider.hashPrefix('');
  });

})(window.angular);
