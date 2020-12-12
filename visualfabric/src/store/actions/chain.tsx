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
            console.log('loading chain');
            //const blockData = <Block[]>res.json(); -- jakos tak
            dispatch(loadChainAction(res));
        });
    }
}

//updating chain - set block