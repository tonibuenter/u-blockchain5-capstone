###Zokrates

ERC721 ...


####openzeppelin version vs solidity version

OracleIz

####Version

solidity version 0.5.2

##Zokrates zkSnarks

Using Docker to install and instantiate a Zokrates zkSnarks development environment

### Start zokrates
```
docker run -v /Users/tonibuenter/_proj/misc/udacity/u-blockchain5-capstone/zokrates/code:/home/zokrates/code -ti zokrates/zokrates /bin/bash
```

```
cd code/square
```

zokrates compile -i square.code

```
zokrates setup
```

Performing setup...
WARNING: You are using the G16 scheme which is subject to malleability. See zokrates.github.io/toolbox/proving_schemes.html#g16-malleability for implications.
Has generated 10 points
Verification key written to 'verification.key'
Proving key written to 'proving.key'
Setup completed
```
zokrates compute-witness -a 3 9
```
Computing witness...
Witness file written to 'witness'

```
zokrates generate-proof
```

WARNING: You are using the G16 scheme which is subject to malleability. See zokrates.github.io/toolbox/proving_schemes.html#g16-malleability for implications.
Proof written to 'proof.json'
`
zokrates export-verifier
`

###Tutorial 

https://zokrates.github.io/rng_tutorial.html
