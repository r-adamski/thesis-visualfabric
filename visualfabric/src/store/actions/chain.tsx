import * as actionTypes from './actionTypes';
import { MapEntry } from '../../../../interfaces';
import { Socket } from 'socket.io-client';

const loadChainAction = (res: MapEntry) => (
    {
        type: actionTypes.INIT_CHAIN,
        loadedChain: res
    }
)

export const loadChain = (socket: Socket) => {
    return (dispatch: any) => {
        socket.on('loadChain', (res: MapEntry) => {
            console.log('loading chain');
            //const blockData = <Block[]>res.json(); -- jakos tak
            dispatch(loadChainAction(res));
        });
    }
}

export const addBlock = (res: MapEntry) => (
    {
        type: actionTypes.ADD_BLOCK,
        newBlock: res
    }
)
