import * as actionTypes from '../actions/actionTypes';
import { MapEntry } from '../../../../interfaces';

interface State {
    blockData: MapEntry | null,
    visible: boolean
}

const initState: State = {
    blockData: null,
    visible: false
}

const reducer = (state = initState, action: any) => {
    switch (action.type) {
        case actionTypes.SHOW_ADVANCED_BLOCK: {
            const newData = {...action.data};
            return {
                blockData: newData,
                visible: true
            }
        }
        case actionTypes.HIDE_ADVANCED_BLOCK: {
            return {
                ...state,
                visible: false
            }

        }
        default:
            return state;
    }
}

export default reducer;