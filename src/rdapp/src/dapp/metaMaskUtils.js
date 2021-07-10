import { errorLog, successLog } from './utis';

import detectEthereumProvider from '@metamask/detect-provider';

export async function initWeb3(callback) {
  // Modern dapp browsers...
  let mmStatus = {};
  const provider = await detectEthereumProvider();

  if (!provider) {
    alert('Please install MetaMask!');
    mmStatus = 'MetaMask not installed on this Browser!';
    callback({ mmStatus, provider: null });
  }

  // according to https://docs.metamask.io/guide/ethereum-provider.html#table-of-contents
  // From now on, this should always be true:
  // provider === window.ethereum

  // META MASK
  if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
    mmStatus.isMetaMask = window.ethereum.isMetaMask;
    mmStatus.isConnected = window.ethereum.isConnected();

    try {
      // Request account access
      //await window.ethereum.enable();
      mmStatus.accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      mmStatus.account0 = mmStatus.accounts[0];
    } catch (error) {
      errorLog('User denied account access');
    }
  }

  window.ethereum.on('accountsChanged', (accounts) =>
    callback({ mmStatus: { ...mmStatus, accounts, account0: accounts[0] } })
  );

  callback({ provider: window.ethereum, mmStatus });
}

function mmListener() {
  console.log('ethereum.networkVersion', window.ethereum.selectedAddress);
  console.log('ethereum.selectedAddress', window.ethereum.selectedAddress);
}
