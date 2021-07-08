// Test if a new solution can be added for contract - SolnSquareVerifier
// Test if an ERC721 token can be minted for contract - SolnSquareVerifier
const expect = require('chai').expect;
const truffleAssert = require('truffle-assertions');

const { _proof_uint, tokenName, tokenSymbol, baseTokenURI } = require('./utils');

const verifierContractDefinition = artifacts.require('Verifier');
const solnSquareContractDefinition = artifacts.require('SolnSquareVerifier');

const proofFromFile_9 = require('../../zokrates/code/attempt1/proof.json');
const proofFromFile_16 = require('../../zokrates/code/attempt2/proof.json');

contract('SolnSquareVerifier', (accounts) => {
  let solnSquareInstance;
  const zeroAddress = '0x0000000000000000000000000000000000000000';

  const proofAsUint_9 = _proof_uint(proofFromFile_9);
  const proofAsUint_16 = _proof_uint(proofFromFile_16);
  describe('Test suite: addSolution', () => {
    before(async () => {
      const verifier = await verifierContractDefinition.new({ from: accounts[0] });
      solnSquareInstance = await solnSquareContractDefinition.new(verifier.address, tokenName, tokenSymbol, {
        from: accounts[0]
      });
    });

    it('should NOT allow to addSolution with invalid values or unverifyable solution', async () => {
      await truffleAssert.reverts(
        solnSquareInstance.addSolution(
          proofAsUint_9.proof.A,
          proofAsUint_9.proof.A_p,
          proofAsUint_9.proof.B,
          proofAsUint_9.proof.B_p,
          proofAsUint_9.proof.C,
          proofAsUint_9.proof.C_p,
          proofAsUint_9.proof.H,
          proofAsUint_9.proof.K,
          [16, 1]
        ),
        'SOLUTION_NOT_VERIFIED'
      );
    });

    it('should allow to add a solution with correct values and emit event', async () => {
      let tx = await solnSquareInstance.addSolution(
        proofAsUint_9.proof.A,
        proofAsUint_9.proof.A_p,
        proofAsUint_9.proof.B,
        proofAsUint_9.proof.B_p,
        proofAsUint_9.proof.C,
        proofAsUint_9.proof.C_p,
        proofAsUint_9.proof.H,
        proofAsUint_9.proof.K,
        proofAsUint_9.input,
        { from: accounts[0] }
      );

      truffleAssert.eventEmitted(tx, 'SolutionAdded', (ev) => {
        return expect(Number(ev.solutionIndex)).to.equal(0) && expect(ev.solutionAddress).to.equal(accounts[0]);
      });
    });

    it('should NOT allow to add a solution if the same SOLUTION_ALREADY_EXISTS', async () => {
      await truffleAssert.reverts(
        solnSquareInstance.addSolution(
          proofAsUint_9.proof.A,
          proofAsUint_9.proof.A_p,
          proofAsUint_9.proof.B,
          proofAsUint_9.proof.B_p,
          proofAsUint_9.proof.C,
          proofAsUint_9.proof.C_p,
          proofAsUint_9.proof.H,
          proofAsUint_9.proof.K,
          proofAsUint_9.input,
          { from: accounts[0] }
        ),
        'SOLUTION_ALREADY_EXISTS'
      );
    });

    it('should allow to add more new solutions with correct values and emit event', async () => {
      let tx = await solnSquareInstance.addSolution(
        proofAsUint_16.proof.A,
        proofAsUint_16.proof.A_p,
        proofAsUint_16.proof.B,
        proofAsUint_16.proof.B_p,
        proofAsUint_16.proof.C,
        proofAsUint_16.proof.C_p,
        proofAsUint_16.proof.H,
        proofAsUint_16.proof.K,
        proofAsUint_16.input,
        { from: accounts[0] }
      );

      truffleAssert.eventEmitted(tx, 'SolutionAdded', (ev) => {
        return expect(Number(ev.solutionIndex)).to.equal(1) && expect(ev.solutionAddress).to.equal(accounts[0]);
      });
    });
  });

  describe('Test suite: mintNewNFT', () => {
    before(async () => {
      const verifier = await verifierContractDefinition.new({ from: accounts[0] });
      solnSquareInstance = await solnSquareContractDefinition.new(verifier.address, tokenName, tokenSymbol, {
        from: accounts[0]
      });
    });

    it('should NOT mint a token via mintNewNFT if solution has not been verified', async () => {
      await truffleAssert.reverts(
        solnSquareInstance.mintNewNFT(16, 1, accounts[1], { from: accounts[0] }),
        'SOLUTION_NOT_EXIST'
      );
    });

    it('should NOT mint a token if solution has been verified on a different account', async () => {
      await solnSquareInstance.addSolution(
        proofAsUint_9.proof.A,
        proofAsUint_9.proof.A_p,
        proofAsUint_9.proof.B,
        proofAsUint_9.proof.B_p,
        proofAsUint_9.proof.C,
        proofAsUint_9.proof.C_p,
        proofAsUint_9.proof.H,
        proofAsUint_9.proof.K,
        proofAsUint_9.input,
        { from: accounts[0] }
      );
      await truffleAssert.reverts(
        solnSquareInstance.mintNewNFT(9, 1, accounts[1], { from: accounts[1] }),
        'NOT_SOLUTION_ADDRESS'
      );
    });

    it('should mint a token if solution is valid, emit events and verify owner and token balance', async () => {
      let tx = await solnSquareInstance.mintNewNFT(9, 1, accounts[2], { from: accounts[0] });
      truffleAssert.eventEmitted(tx, 'Transfer', (ev) => {
        return (
          expect(ev.from).to.deep.equal(zeroAddress) &&
          expect(ev.to).to.equal(accounts[2]) &&
          expect(Number(ev.tokenId)).to.equal(0)
        );
      });

      expect(await solnSquareInstance.ownerOf(0)).to.equal(accounts[2]);
      expect(Number(await solnSquareInstance.balanceOf(accounts[2]))).to.equal(1);
      expect(await solnSquareInstance.tokenURI(0)).to.deep.equal(`${baseTokenURI}0`);
    });

    it('should NOT mint another token if a token for the same solution exists already', async () => {
      await truffleAssert.reverts(
        solnSquareInstance.mintNewNFT(9, 1, accounts[1], { from: accounts[0] }),
        'TOKEN_ALREADY_MINTED'
      );
    });

    it('should mint a NEW token for a NEW valid solution, emit events and verify owner and token balance', async () => {
      await solnSquareInstance.addSolution(
        proofAsUint_16.proof.A,
        proofAsUint_16.proof.A_p,
        proofAsUint_16.proof.B,
        proofAsUint_16.proof.B_p,
        proofAsUint_16.proof.C,
        proofAsUint_16.proof.C_p,
        proofAsUint_16.proof.H,
        proofAsUint_16.proof.K,
        proofAsUint_16.input,
        { from: accounts[0] }
      );

      let tx = await solnSquareInstance.mintNewNFT(16, 1, accounts[2], { from: accounts[0] });
      truffleAssert.eventEmitted(tx, 'Transfer', (ev) => {
        return (
          expect(ev.from).to.deep.equal(zeroAddress) &&
          expect(ev.to).to.equal(accounts[2]) &&
          expect(Number(ev.tokenId)).to.equal(1)
        );
      });

      expect(await solnSquareInstance.ownerOf(1)).to.equal(accounts[2]);
      expect(Number(await solnSquareInstance.balanceOf(accounts[2]))).to.equal(2);
      expect(await solnSquareInstance.tokenURI(1)).to.deep.equal(`${baseTokenURI}1`);
    });
  });
});
