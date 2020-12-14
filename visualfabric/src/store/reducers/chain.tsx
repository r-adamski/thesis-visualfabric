import { act } from 'react-dom/test-utils';
import * as actionTypes from '../actions/actionTypes';
import { MapEntry } from '../../../../interfaces';

interface State {
    chain: MapEntry[]
}

const initState: State = {
    chain: []
}

const reducer = (state = initState, action: any) => {
    switch (action.type) {
        case actionTypes.INIT_CHAIN: {
            return {
                chain: [...action.loadedChain]
            }
        }
        case actionTypes.ADD_BLOCK: {
            return {
                chain: [...state.chain, action.newBlock]
                //nested objects - should be immutable
            }

        }
        default:
            return state;
    }
}

export default reducer;