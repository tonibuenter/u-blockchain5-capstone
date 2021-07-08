Starting migrations...
======================
> Network name:    'rinkeby'
> Network id:      4
> Block gas limit: 15029308 (0xe5543c)


1_initial_migration.js
======================

   Deploying 'Migrations'
   ----------------------
   > transaction hash:    0xddbfcf87a3f22970ddb4108ac001bf04e35d8034805a3adb0b19d665d86d74ed
   > Blocks: 1            Seconds: 4
   > contract address:    0x2Ef98d5bcBA6443830dC771df701A2804E39bF74
   > block number:        8882653
   > block timestamp:     1625477145
   > account:             0x29c7560d5C0593AEE0d42Ab18018D5a208901F60
   > balance:             4.870308712
   > gas used:            236270 (0x39aee)
   > gas price:           200 gwei
   > value sent:          0 ETH
   > total cost:          0.047254 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:            0.047254 ETH


2_deploy_contracts.js
=====================

   Deploying 'Verifier'
   --------------------
   > transaction hash:    0x1af34e253c1de86ec44cadb8867527abf801e9ebbef91bbd8c9e33068ca67406
   > Blocks: 0            Seconds: 8
   > contract address:    0x39426ea0290C7e2a9936648e39D2724aeA6434D1
   > block number:        8882655
   > block timestamp:     1625477176
   > account:             0x29c7560d5C0593AEE0d42Ab18018D5a208901F60
   > balance:             4.572168312
   > gas used:            1444934 (0x160c46)
   > gas price:           200 gwei
   > value sent:          0 ETH
   > total cost:          0.2889868 ETH


   Deploying 'MyERC721Mintable'
   ----------------------------
   > transaction hash:    0x009abd1760b015f556ecb5b1d35acdc7eb02a953dfe71ec2ad434591b081f502
   > Blocks: 1            Seconds: 8
   > contract address:    0xa42Dd4D3282D1595CF1a37e2dE09f1462E15b72a
   > block number:        8882656
   > block timestamp:     1625477191
   > account:             0x29c7560d5C0593AEE0d42Ab18018D5a208901F60
   > balance:             3.959289712
   > gas used:            3064393 (0x2ec249)
   > gas price:           200 gwei
   > value sent:          0 ETH
   > total cost:          0.6128786 ETH


   Deploying 'SolnSquareVerifier'
   ------------------------------
   > transaction hash:    0x1aa66dce1590223e4bb72f935c17016dc8fb8f34e1993c92649be1e10290fc86
   > Blocks: 0            Seconds: 8
   > contract address:    0x919E8917874CAD0788A6E29b2d3bB0917F2E6539
   > block number:        8882657
   > block timestamp:     1625477206
   > account:             0x29c7560d5C0593AEE0d42Ab18018D5a208901F60
   > balance:             3.214562312
   > gas used:            3723637 (0x38d175)
   > gas price:           200 gwei
   > value sent:          0 ETH
   > total cost:          0.7447274 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:           1.6465928 ETH


Summary
=======
> Total deployments:   4
> Final cost:          1.6938468 ETH



Mint Result
===========

Mint tokenid 17 to 0x9d41eb1c1eb9e8bc3724d46668d2aa073051b0cd (1)

Opensea.io Deployment
=====================

https://testnets.opensea.io/collection/tb-capstone

I tried to deploy the tokenid 17 on the opensea.io. Unfortunately, the user interface 
for adding a ERC 721 contract on the rinkeby network seems not to be 
available anymore. So, when clicking on the test network panel the interface for ERC 721 disappears and the regular
upload item screen opens. I tried it several times without success.
