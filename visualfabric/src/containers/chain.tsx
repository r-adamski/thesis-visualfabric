import React, {useEffect} from 'react';
import {connect, useDispatch} from 'react-redux';
import {io, Socket} from 'socket.io-client';
import * as actions from '../store/actions/index';

import {MapEntry} from '../../../interfaces';

const Chain = (props: any) => {

  const dispatch = useDispatch();
  let socket: Socket;

  useEffect(() => {

    //socket connection
    socket = io('http://192.168.0.17:8000', {
      transports: ['websocket']
    });

    //loading chain
    dispatch(actions.loadChain(socket));

    socket.on('addBlock', (res: MapEntry) => {
      dispatch(actions.addBlock(res));
    });

    return () => {
      console.log('chain cleanup');
    }
  }, []);

  const data = JSON.stringify(props.chain);

  return (
    <div>{data}</div>
  );
}


const mapStateToProps = (state: any) => {
  return {
    chain: state.chain
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    loadChain: (socket: any) => dispatch(actions.loadChain(socket))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chain);
