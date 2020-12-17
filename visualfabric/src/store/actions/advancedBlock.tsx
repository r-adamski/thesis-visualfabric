import * as actionTypes from './actionTypes';
import { MapEntry } from '../../../../interfaces';

export const showAdvancedBlock = (data: MapEntry) => (
    {
        type: actionTypes.SHOW_ADVANCED_BLOCK,
        data: data
    }
);

export const hideAdvancedBlock = () => {
    return {
        type: actionTypes.HIDE_ADVANCED_BLOCK
    }
};