const fs = require('fs');
// migrating the appropriate contracts
const Verifier = artifacts.require('./Verifier.sol');
const MyERC721Mintable = artifacts.require('./MyERC721Mintable.sol');
const SolnSquareVerifier = artifacts.require('./SolnSquareVerifier.sol');
const deployment8548 = require('../config/deployment8548.json');

const rootConfig = require('../config/rootConfig85.json');

module.exports = async (deployer) => {
  addresses = Object.keys(deployment8548.addresses);
  rootConfig.addresses = addresses;
  rootConfig.defaultAccount = addresses[0];

  await deployer.deploy(Verifier);
  await deployer.deploy(MyERC721Mintable, 'TB_ERC721_MToken', 'TB721');
  await deployer.deploy(SolnSquareVerifier, Verifier.address, 'TB_ERC721_MToken', 'TB721');

  let json = {
    ...rootConfig,
    Verifier_address: Verifier.address,
    SolnSquareVerifier_address: SolnSquareVerifier.address,
    MyERC721Mintable_address: MyERC721Mintable.address,
    migratedTimestamp: new Date().toString()
  };
  let blockchainData = JSON.stringify(json, null, '\t');
  fs.writeFileSync(__dirname + '/../config/blockchainData.json', blockchainData, 'utf-8');
  fs.writeFileSync(__dirname + '/../../src/rdapp/src/dapp/config/blockchainData.json', blockchainData, 'utf-8');
};
