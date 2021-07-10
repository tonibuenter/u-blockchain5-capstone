import { createStore } from 'redux';
import { MetaMask } from './types';

export const ACTIONS = {
  TX_ON: 'TX_ON',
  TX_OFF: 'TX_OFF',
  SET_MY_ERC_721_MINTABLE: 'SET_MY_ERC_721_MINTABLE',
  SET_SOLN_SQUARE_VERIFIER: 'SET_SOLN_SQUARE_VERIFIER',
  SET_VERIFIER: 'SET_VERIFIER'
};

export type ReduxState = {
  mmStatus: any;
  tx: boolean;
  myErc721Mintable: any;
  solnSquareVerifier: any;
  verifier: any;
  airlineMap: any;
};

const initialState = (): ReduxState => ({
  mmStatus: {},
  tx: false,
  myErc721Mintable: null,
  solnSquareVerifier: null,
  verifier: null,
  airlineMap: {}
});

let store: any;

export function createReduxStore() {
  store = createStore(reducer0);
  return store;
}

function reducer0(state = initialState(), action: any) {
  switch (action.type) {
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
  }
  return state;
}
