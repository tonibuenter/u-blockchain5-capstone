# Capstone: Readme

## How to test

First got to the project direcory

###Start ganache-cli

`chmod +x ./run-ganache-cli-test.sh`

`./run-ganache-cli-test.sh` 


###Run all tests

`cd eth-contracts`

`truffle deploy --reset`
`truffle test`


## Open sea

Mint tokenid 17 to 0x9d41eb1c1eb9e8bc3724d46668d2aa073051b0cd (1)

### Opensea.io Deployment

#### Site
https://testnets.opensea.io/collection/tb-capstone

#### Opensea Problem 
I tried to deploy the tokenid 17 on the opensea.io. Unfortunately, the user interface 
for adding a ERC 721 contract on the rinkeby network seems not to be 
available anymore. So, when clicking on the test network panel the interface for ERC 721 disappears and the regular
upload item screen opens. I tried it several times without success.

### React Client (Typescript/Material)

Prepar, build and start:

`./prepare-dapp.sh `

`cd src/rdapp/`

`npm install`

`npm start`



## Survival commands

### Deploy on 

truffle deploy --network rinkeby


### create `rdapp` with npm and typescript

npx create-react-app rdapp --use-npm --template typescript

