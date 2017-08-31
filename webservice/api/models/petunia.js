module.exports = function(web3) {

  const contract = require('contract');

  const petunia = web3.eth.contract(contract.contractABI).at(contract.contractAddress);
  web3.eth.getAccounts((error, result) => { petunia.account = result[0]});



  return petunia;
};
