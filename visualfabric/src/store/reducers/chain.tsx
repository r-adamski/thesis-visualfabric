import { act } from 'react-dom/test-utils';
import * as actionTypes from '../actions/actionTypes';

const initState = {
    chain: []
}

const reducer = (state = initState, action: any) => {
    switch (action.type) {
        case actionTypes.INIT_CHAIN: {

            return {
                chain: action.loadedChain
            }
        }
        case actionTypes.SET_BLOCK: {
            return state;
        }
        default:
            return state;
    }
}

export default reducer;