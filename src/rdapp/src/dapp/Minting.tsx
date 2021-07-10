import React, { useState } from 'react';
import Container from '@material-ui/core/Container';

import { useDispatch, useSelector } from 'react-redux';
import { ACTIONS, ReduxState } from '../redux';
import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { addressFormatter } from './utis';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import bd from './config/blockchainData.json';
import './styles.css';

export default function Minting() {
  const mmStatus = useSelector((state: ReduxState) => state.mmStatus);
  const myErc721Mintable = useSelector((state: ReduxState) => state.myErc721Mintable);
  const dispatch = useDispatch();

  const [messages, setMessages] = useState<any[]>([]);

  const [mintTokenId, setToken] = useState('');
  const [addressTo, setAddressTo] = useState('');

  const dropdownAddresses = [
    bd.addresses[0],
    bd.addresses[1],
    bd.addresses[2],
    bd.addresses[3],
    bd.addresses[4],
    '0x29c7560d5C0593AEE0d42Ab18018D5a208901F60'
  ];

  return (
    <Container>
      <h2>Minting & Transfer by {addressFormatter(mmStatus.account0)}</h2>
      <div className={'inputs'}>
        <div>
          <TextField label="Mint Token Id" value={mintTokenId} onChange={(e: any) => setToken(e.target.value)} />
        </div>
        <div>
          <InputLabel htmlFor={'toAddresses'}>To Address</InputLabel>
          <Select id="toAddresses" value={addressTo} onChange={(e: any) => setAddressTo(e.target.value)}>
            {dropdownAddresses.map((add, index) => (
              <MenuItem value={add}>
                {index}:{addressFormatter(add)}
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>

      <div className={'buttons'}>
        <Button variant="contained" color="primary" onClick={() => mint(mintTokenId, addressTo)}>
          Mint
        </Button>
        &nbsp;
        <Button variant="contained" color="primary" onClick={() => transferByOwner(mintTokenId, addressTo)}>
          Transfer by Owner (Metamask)
        </Button>
      </div>

      <hr />
      <h2>Messages</h2>
      <div className={'messages'}>
        <pre>{messages.map((m) => m + '\n')}</pre>
      </div>
    </Container>
  );

  async function mint(mintTokenId: any, addressTo: any) {
    try {
      dispatch({ type: ACTIONS.TX_ON });
      const result = await myErc721Mintable.mint(addressTo, mintTokenId, { from: mmStatus.account0 });
      console.log(`Mint tokenid ${mintTokenId} to ${addressTo}`);
    } catch (err) {
      console.log(err.message);
    } finally {
      dispatch({ type: ACTIONS.TX_OFF });
    }
  }

  async function transferByOwner(mintTokenId: any, addressTo: any) {
    try {
      dispatch({ type: ACTIONS.TX_ON });
      const result = await myErc721Mintable.transferFrom(mmStatus.account0, addressTo, mintTokenId, {
        from: mmStatus.account0
      });
      console.log(`transferByOwner tokenid ${mintTokenId} to ${addressTo}`);
    } catch (err) {
      console.log(err.message);
    } finally {
      dispatch({ type: ACTIONS.TX_OFF });
    }
  }
}
