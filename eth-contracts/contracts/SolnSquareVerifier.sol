pragma solidity >0.4.24;

import "./ERC721Mintable.sol";

import "../../zokrates/Verifier.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
// TODO define a solutions struct that can hold an index & an address
// TODO define an array of the above struct
// TODO define a mapping to store unique solutions submitted
// TODO Create an event to emit when a solution is added
// TODO Create a function to add the solutions to the array and emit the event
// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly


contract SolnSquareVerifier is MyERC721Mintable {
    Verifier private verifierContract;

    struct Solution {
        uint256 solutionIndex;
        address solutionAddress;
        bool isMinted; //flag to indicate if this solution has been used in token minting
    }

    uint256 numberOfSolutions = 0;
    mapping (bytes32 => Solution) solutions;

    event SolutionAdded(uint256 solutionIndex, address indexed solutionAddress);

    constructor(address verifierAddress, string memory name, string memory symbol)
        MyERC721Mintable(name, symbol)
        public
    {
        verifierContract = Verifier(verifierAddress);
    }

    function addSolution(
        uint[2] memory A,
        uint[2] memory A_p,
        uint[2][2] memory B,
        uint[2] memory B_p,
        uint[2] memory C,
        uint[2] memory C_p,
        uint[2] memory H,
        uint[2] memory K,
        uint[2] memory input
    )
        public
    {
        bytes32 solutionHash = keccak256(abi.encodePacked(input[0], input[1]));
        require(solutions[solutionHash].solutionAddress == address(0), "SOLUTION_ALREADY_EXISTS");

        bool verified = verifierContract.verifyTx(A, A_p, B, B_p, C, C_p, H, K, input);
        require(verified, "SOLUTION_NOT_VERIFIED");

        solutions[solutionHash] = Solution(numberOfSolutions, msg.sender, false);
        emit SolutionAdded(numberOfSolutions, msg.sender);
        numberOfSolutions++;
    }

    function mintNewNFT(uint a, uint b, address to) public
    {
        bytes32 solutionHash = keccak256(abi.encodePacked(a, b));
        require(solutions[solutionHash].solutionAddress != address(0), "SOLUTION_NOT_EXIST");
        require(solutions[solutionHash].isMinted == false, "TOKEN_ALREADY_MINTED");
        require(solutions[solutionHash].solutionAddress == msg.sender, "NOT_SOLUTION_ADDRESS");
        super.mint(to, solutions[solutionHash].solutionIndex);
        solutions[solutionHash].isMinted = true;
    }
}


























