import { createStore } from 'redux';
import { MetaMask } from './types';

export const ACTIONS = {
  SET_MM: 'SET_MM',
  TX_ON: 'TX_ON',
  TX_OFF: 'TX_OFF',
  SET_MY_ERC_721_MINTABLE: 'SET_MY_ERC_721_MINTABLE',
  SET_SOLN_SQUARE_VERIFIER: 'SET_SOLN_SQUARE_VERIFIER',
  SET_VERIFIER: 'SET_VERIFIER'
};

export type ReduxState = {
  metaMask: MetaMask;
  tx: boolean;
  myErc721Mintable: any;
  solnSquareVerifier: any;
  verifier: any;
  airlineMap: any;
};

const initialState = (): ReduxState => ({
  metaMask: { network: 'not-connected', address: '' },
  tx: false,
  myErc721Mintable: null,
  solnSquareVerifier: null,
  verifier: null,
  airlineMap: {}
});

export let store: any;

export function createReduxStore() {
  store = createStore(reducer0);
  return store;
}

function reducer0(state = initialState(), action: any) {
  switch (action.type) {
    case ACTIONS.SET_MM: {
      const { network, address } = action.payload;
      const metaMask = { network, address };
      return {
        ...state,
        metaMask
      };
    }
    case ACTIONS.TX_ON: {
      return {
        ...state,
        tx: true
      };
    }
    case ACTIONS.TX_OFF: {
      return {
        ...state,
        tx: false
      };
    }
    case ACTIONS.SET_MY_ERC_721_MINTABLE: {
      return {
        ...state,
        myErc721Mintable: action.payload
      };
    }
    case ACTIONS.SET_SOLN_SQUARE_VERIFIER: {
      return {
        ...state,
        solnSquareVerifier: action.payload
      };
    }
    case ACTIONS.SET_VERIFIER: {
      return {
        ...state,
        verfier: action.payload
      };
    }
    case 'set': {
      return {
        ...state,
        ...action.payload
      };
    }
    default:
      return state;
  }
}
