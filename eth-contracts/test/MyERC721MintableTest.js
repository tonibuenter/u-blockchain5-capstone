const truffleAssert = require('truffle-assertions');
const expect = require('chai').expect;
const { tokenName, tokenSymbol, baseTokenURI } = require('./utils');

const contractDefinition = artifacts.require('MyERC721Mintable');

contract('MyERC721Mintable', (accounts) => {
  const account0 = accounts[0];
  const account1 = accounts[1];
  const account7 = accounts[7];
  const tokensIds = [11, 22, 33, 44, 55, 66, 77, 88, 99, 101];
  const additionalToken = 777;

  const tokenIndexOffset = 8;
  const doubleTokenAccount = accounts[tokenIndexOffset + 3];

  const address00 = '0x0000000000000000000000000000000000000000';
  let contract;
  let tokenId = 17;

  describe('Test-Suite-01: Ownership, Pausable', function () {
    before(async () => {
      contract = await contractDefinition.new(tokenName, tokenSymbol, { from: account0 });
    });

    it('Test 01 :: check contract owner', async () => {
      let _owner = await contract.owner({ from: account1 });
      expect(_owner).to.equal(account0);
    });

    it('Test 02 :: try unauthorized transfer', async () => {
      await truffleAssert.reverts(contract.transferOwnership(account1, { from: account1 }), 'NOT_CONTRACT_OWNER');
    });

    it('Test 03 :: transfer ownership', async () => {
      let res = await contract.transferOwnership(account1, { from: account0 });
      truffleAssert.eventEmitted(res, 'OwnershipIsTransferred', (ev) => {
        return expect(ev.previousOwner).to.deep.equal(account0) && expect(ev.newOwner).to.equal(account1);
      });
      let _owner = await contract.owner({ from: account1 });
      expect(_owner).to.equal(account1);
      //
    });

    it('Test 04 :: try to mint with account0', async () => {
      await truffleAssert.reverts(contract.mint(account1, tokenId, { from: account0 }), 'NOT_CONTRACT_OWNER');
    });

    it('Test 05 :: transfer ownership back', async () => {
      let res = await contract.transferOwnership(account0, { from: account1 });
      truffleAssert.eventEmitted(res, 'OwnershipIsTransferred', (ev) => {
        return expect(ev.previousOwner).to.deep.equal(account1) && expect(ev.newOwner).to.equal(account0);
      });
      let _owner = await contract.owner({ from: account0 });
      expect(account0).to.equal(account0);
    });

    it('Test 06 :: pause', async () => {
      let res = await contract.pause({ from: account0 });
      truffleAssert.eventEmitted(res, 'Paused', (ev) => {
        return expect(ev.account).to.deep.equal(account0);
      });
    });

    it('Test 07 :: try double pause', async () => {
      await truffleAssert.reverts(contract.pause({ from: account0 }), 'CONTRACT_IS_PAUSED');
    });

    it('Test 08 :: try minting when paused', async () => {
      await truffleAssert.reverts(contract.mint(account1, tokenId, { from: account0 }), 'CONTRACT_IS_PAUSED');
    });

    it('Test 09 :: unpause by owner', async () => {
      let res = await contract.unpause({ from: account0 });
      truffleAssert.eventEmitted(res, 'Unpaused', (ev) => {
        return expect(ev.account).to.deep.equal(account0);
      });
    });

    it('Test 10 :: try double unpause by owner', async () => {
      await truffleAssert.reverts(contract.unpause({ from: account0 }), 'CONTRACT_IS_NOT_PAUSED');
    });

    it('Test 11 :: try pause by account1', async () => {
      await truffleAssert.reverts(contract.pause({ from: account1 }), 'NOT_CONTRACT_OWNER');
    });

    it('Test 12 :: try unpause by account1', async () => {
      await truffleAssert.reverts(contract.unpause({ from: account1 }), 'NOT_CONTRACT_OWNER');
    });

    it('Test 13 :: check token name', async () => {
      let _name = await contract.name({ from: account7 });
      expect(_name).to.equal(tokenName);
    });

    it('Test 14 :: check symbol', async () => {
      let _symbol = await contract.symbol({ from: account7 });
      expect(_symbol).to.equal(tokenSymbol);
    });

    it('Test 15 :: check token baseTokenURI', async () => {
      let _uri = await contract.baseTokenURI({ from: account7 });
      expect(_uri).to.equal(baseTokenURI);
    });

    it('Test 16 :: minting 10 tokens', async () => {
      for (let i = 0; i < tokensIds.length; i++) {
        let _tokenId = tokensIds[i];
        let _account = accounts[i + tokenIndexOffset];
        let res = await contract.mint(_account, _tokenId, { from: account0 });
        truffleAssert.eventEmitted(res, 'Transfer', (ev) => {
          return expect(Number(ev.tokenId)).to.deep.equal(_tokenId);
        });
      }
    });

    it('Test 17 :: try minting the same token', async () => {
      await truffleAssert.reverts(contract.mint(accounts[12], tokensIds[7]), 'TOKEN_ALREADY_EXISTS');
    });

    it('Test 18 :: try minting with 0 to address', async () => {
      await truffleAssert.reverts(contract.mint(address00, 300), 'TO_IS_INVALID');
    });

    it('Test 19 :: get total supply', async () => {
      const _supply = await contract.totalSupply.call({ from: accounts[12] });
      expect(Number(_supply)).to.equal(tokensIds.length);
    });

    it('Test 20 :: check balances, token uri and token owner', async () => {
      for (let i = tokenIndexOffset; i < tokensIds.length; i++) {
        let balance = await contract.balanceOf(accounts[i]);
        expect(Number(balance)).to.equal(1);

        let _tokenId = tokensIds[i - tokenIndexOffset];
        const token3Uri = await contract.tokenURI(_tokenId);
        expect(token3Uri).to.deep.equal(`${baseTokenURI}${_tokenId}`);

        let _owner = await contract.ownerOf(_tokenId);
        expect(accounts[i]).to.equal(_owner);
      }
    });

    it('Test 21 :: minting a second token and check balance', async () => {
      let res = await contract.mint(doubleTokenAccount, additionalToken, { from: account0 });
      truffleAssert.eventEmitted(res, 'Transfer', (ev) => {
        return (
          expect(Number(ev.tokenId)).to.deep.equal(additionalToken) && expect(ev.to).to.deep.equal(doubleTokenAccount)
        );
      });
      let balance = await contract.balanceOf(doubleTokenAccount);
      expect(Number(balance)).to.equal(2);
    });

    it('Test 22 :: try transform to invalid address', async () => {
      let _fromAddress = accounts[7 + tokenIndexOffset];
      let _tokenId = tokensIds[7];
      await truffleAssert.reverts(
        contract.transferFrom(_fromAddress, address00, _tokenId, {
          from: _fromAddress
        }),
        'TO_IS_INVALID'
      );
    });

    it('Test 23 :: approve token', async () => {
      let _fromAddress = accounts[tokenIndexOffset + 3];
      let _tokenId = tokensIds[3];
      let _toAddress = accounts[tokenIndexOffset + 6];

      let res = await contract.approve(_toAddress, _tokenId, { from: _fromAddress });
      truffleAssert.eventEmitted(res, 'Approval', (ev) => {
        return (
          expect(ev.owner, 'owner').to.deep.equal(_fromAddress) &&
          expect(ev.approved, 'approved to').to.equal(_toAddress) &&
          expect(Number(ev.tokenId), 'the approved token').to.equal(_tokenId)
        );
      });

      let _newApproved = await contract.getApproved(_tokenId);
      expect(_newApproved).to.equal(_toAddress);
    });

    it('Test 24 :: transfer token away and back', async () => {
      let _fromAddress = doubleTokenAccount;
      let _tokenId = tokensIds[3];
      let _toAddress = accounts[tokenIndexOffset + 6];

      let res = await contract.transferFrom(_fromAddress, _toAddress, _tokenId, { from: _toAddress });
      truffleAssert.eventEmitted(res, 'Transfer', (ev) => {
        return (
          expect(ev.from).to.deep.equal(_fromAddress) &&
          expect(ev.to).to.equal(_toAddress) &&
          expect(Number(ev.tokenId)).to.equal(_tokenId)
        );
      });

      expect(await contract.ownerOf(_tokenId)).to.equal(_toAddress);
      expect(await contract.getApproved(_tokenId)).to.equal(address00);
      expect(Number(await contract.balanceOf(_toAddress))).to.equal(2);
      expect(Number(await contract.balanceOf(_fromAddress))).to.equal(1);

      res = await contract.transferFrom(_toAddress, _fromAddress, _tokenId, { from: _toAddress });
      truffleAssert.eventEmitted(res, 'Transfer', (ev) => {
        return (
          expect(ev.from, 'returned from address').to.deep.equal(_toAddress) &&
          expect(ev.to, 'original owner (to)').to.equal(_fromAddress) &&
          expect(Number(ev.tokenId, 'token 3')).to.equal(_tokenId)
        );
      });

      expect(await contract.ownerOf(_tokenId)).to.equal(_fromAddress);
      expect(Number(await contract.balanceOf(_toAddress))).to.equal(1);
      expect(Number(await contract.balanceOf(_fromAddress))).to.equal(2);
      expect(await contract.getApproved(_tokenId)).to.equal(address00);
    });
  });
});
