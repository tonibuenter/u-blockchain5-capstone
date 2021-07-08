import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ACTIONS, ReduxState } from '../redux';
import { getMetaskAccountID, initWeb3 } from './metaMaskUtils';
import myErc721MintableJson from './contracts/MyERC721Mintable.json';
import solnSquareVerifierJson from './contracts/SolnSquareVerifier.json';
import verifierJson from './contracts/Verifier.json';
import { errorLog, addressFormatter } from './utis';
import {
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core';
import bd from './config/blockchainData.json';
import './Dapp.css';

const contract = require('@truffle/contract');

type Address = { address: string; name: string; eth: string };

export default function Blockchain() {
  const metaMask = useSelector((state: ReduxState) => state.metaMask);
  const myErc721Mintable = useSelector((state: ReduxState) => state.myErc721Mintable);
  const solnSquareVerifier = useSelector((state: ReduxState) => state.solnSquareVerifier);
  const verifier = useSelector((state: ReduxState) => state.verifier);
  const dispatch = useDispatch();
  const web3 = useSelector((state: any) => state.web3);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const _run = async () => {
      if (!metaMask.address) {
        let { web3Provider, web3 } = await initWeb3();

        dispatch({ type: 'set', payload: { web3 } });

        let metamaskAccountID = await getMetaskAccountID();

        let _myErc721Mintable = contract(myErc721MintableJson);
        _myErc721Mintable.setProvider(web3Provider);

        let _solnSquareVerifier = contract(solnSquareVerifierJson);
        _solnSquareVerifier.setProvider(web3Provider);

        let _verifier = contract(verifierJson);
        _verifier.setProvider(web3Provider);

        try {
          let myErc721Mintable = await _myErc721Mintable.deployed();
          dispatch({ type: ACTIONS.SET_MY_ERC_721_MINTABLE, payload: myErc721Mintable });
        } catch (e) {
          errorLog('myErc721Mintable: ' + e.message);
        }

        try {
          let solnSquareVerifier = await _solnSquareVerifier.deployed();
          dispatch({ type: ACTIONS.SET_SOLN_SQUARE_VERIFIER, payload: solnSquareVerifier });
        } catch (e) {
          errorLog('solnSquareVerifier: ' + e.message);
        }

        try {
          let verifier = await _verifier.deployed();
          dispatch({ type: ACTIONS.SET_VERIFIER, payload: verifier });
        } catch (e) {
          errorLog('verifier: ' + e.message);
        }

        dispatch({ type: ACTIONS.SET_MM, payload: { address: metamaskAccountID, network: '...' } });
      }
    };

    _run();
  }, [dispatch, metaMask]);

  useEffect(() => {
    const _run = async () => {
      let _addresses: Address[] = [];
      _addresses.push({ name: 'metamask', address: metaMask ? metaMask.address : '', eth: '0' });

      _addresses.push({
        name: 'myErc721Mintable',
        address: myErc721Mintable ? myErc721Mintable.address : '',
        eth: '0'
      });
      _addresses.push({
        name: 'solnSquareVerifier',
        address: solnSquareVerifier ? solnSquareVerifier.address : '',
        eth: '0'
      });
      _addresses.push({
        name: 'verifier',
        address: verifier ? verifier.address : '',
        eth: '0'
      });
      bd.addresses.map((address, i) => {
        _addresses.push({ name: 'a-' + i, address, eth: '0' });
      });
      try {
        dispatch({ type: ACTIONS.TX_ON });
        for (let entry of _addresses) {
          entry.eth = entry.address ? web3.utils.fromWei(await web3.eth.getBalance(entry.address), 'ether') : '-';
        }
      } catch (e) {
        console.error(e);
      } finally {
        dispatch({ type: ACTIONS.TX_OFF });
      }
      setAddresses(_addresses);
    };
    if (web3) {
      _run();
    }
  }, [web3, refresh, dispatch, metaMask.address, metaMask]);

  return (
    <Container>
      <h2>
        Addresses{' '}
        <Button variant="contained" color="primary" onClick={() => setRefresh((i) => i + 1)}>
          refresh
        </Button>
      </h2>

      <TableContainer component={Paper}>
        <Table className={'flights'} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>type</TableCell>
              <TableCell align="right">Balance (ETH)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {addresses.map((entry, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {entry.name}
                </TableCell>
                <TableCell>{addressFormatter(entry.address)}</TableCell>
                <TableCell align="center">{'---'}</TableCell>
                <TableCell align="right">{entry.eth}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
