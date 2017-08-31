var Petunia = artifacts.require('./Petunia.sol');

module.exports = function (deployer, network, accounts) {
  deployer.deploy(Petunia, accounts[4]);
};
