var ConvertLib = artifacts.require("./ConvertLib.sol");
var MetaCoin = artifacts.require("./MetaCoin.sol");
var Petunia = artifacts.require("./Petunia.sol");
var EtherVote = artifacts.require("./EtherVote.sol");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(MetaCoin);
  deployer.deploy(Petunia);
  deployer.deploy(EtherVote);
};
