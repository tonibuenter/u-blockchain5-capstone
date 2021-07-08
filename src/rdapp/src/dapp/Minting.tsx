import React, { useState } from 'react';
import Container from '@material-ui/core/Container';

import { useDispatch, useSelector } from 'react-redux';
import { ACTIONS, ReduxState } from '../redux';
import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import bd from './config/blockchainData.json';
import './styles.css';

export default function Minting() {
  const metaMask = useSelector((state: ReduxState) => state.metaMask);
  const myErc721Mintable = useSelector((state: ReduxState) => state.myErc721Mintable);
  const dispatch = useDispatch();

  const [messages, setMessages] = useState<any[]>([]);

  const tokens = [1, 2, 3];

  const [mintTokenId, setToken] = useState('');
  const [addressTo, setAddressTo] = useState('');

  return (
    <Container>
      <h2>Minting</h2>
      <div className={'inputs'}>
        <div>
          <TextField label="Mint Token Id" value={mintTokenId} onChange={(e: any) => setToken(e.target.value)} />
        </div>
        <div>
          <InputLabel htmlFor={'toAddresses'}>To Address</InputLabel>
          <Select id="toAddresses" value={addressTo} onChange={(e: any) => setAddressTo(e.target.value)}>
            {bd.addresses.map((add, index) =>
              index < 5 ? (
                <MenuItem value={add}>
                  {index}:{add}
                </MenuItem>
              ) : (
                ''
              )
            )}
          </Select>
        </div>
      </div>

      <div className={'buttons'}>
        <Button variant="contained" color="primary" onClick={() => mint(mintTokenId, addressTo)}>
          Mint
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
      debugger;
      const result = await myErc721Mintable.mint(addressTo, mintTokenId, { from: metaMask.address });
      console.log(`Mint tokenid ${mintTokenId} to ${addressTo}`);
    } catch (err) {
      console.log(err.message);
    } finally {
      dispatch({ type: ACTIONS.TX_OFF });
    }
  }
}
