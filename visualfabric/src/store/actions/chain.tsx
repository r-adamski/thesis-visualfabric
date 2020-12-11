import * as actionTypes from './actionTypes';


const loadChainAction = (res: any) => (
    {
        type: actionTypes.INIT_CHAIN,
        loadedChain: res
    }
)

export const loadChain = (socket: any) => {
    return (dispatch: any) => {
        socket.on('loadChain', (res: any) => {
            console.log('loading chain response' + res);
            //dispatch(loadChainAction(res));
        });
    }
}

//updating chain - set block