module.exports = { _proof_uint };

module.exports.tokenName = 'TB_ERC721_MToken';
module.exports.tokenSymbol = 'TB721';
module.exports.baseTokenURI = 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/';

function _proof_uint(proofFromFile) {
  return {
    proof: {
      A: [BN(proofFromFile.proof.A[0]).toString(), BN(proofFromFile.proof.A[1]).toString()],
      A_p: [BN(proofFromFile.proof.A_p[0]).toString(), BN(proofFromFile.proof.A_p[1]).toString()],
      B: [
        [BN(proofFromFile.proof.B[0][0]).toString(), BN(proofFromFile.proof.B[0][1]).toString()],
        [BN(proofFromFile.proof.B[1][0]).toString(), BN(proofFromFile.proof.B[1][1]).toString()]
      ],
      B_p: [BN(proofFromFile.proof.B_p[0]).toString(), BN(proofFromFile.proof.B_p[1]).toString()],
      C: [BN(proofFromFile.proof.C[0]).toString(), BN(proofFromFile.proof.C[1]).toString()],
      C_p: [BN(proofFromFile.proof.C_p[0]).toString(), BN(proofFromFile.proof.C_p[1]).toString()],
      H: [BN(proofFromFile.proof.H[0]).toString(), BN(proofFromFile.proof.H[1]).toString()],
      K: [BN(proofFromFile.proof.K[0]).toString(), BN(proofFromFile.proof.K[1]).toString()]
    },
    input: proofFromFile.input
  };
}

function BN(a) {
  return web3.utils.toBN(a);
}
