import React, {useEffect} from 'react';
import {connect, useDispatch} from 'react-redux';
import {io} from 'socket.io-client';
import * as actions from '../store/actions/index';

const Chain = (props: any) => {

  const dispatch = useDispatch();

  useEffect(() => {

    //socket connection
    const socket = io('http://192.168.0.17:8000', {
      transports: ['websocket']
    });

    dispatch(actions.loadChain(socket));

    return () => {
      console.log('chain cleanup');
    }
  }, []);

  return (
    <div>this is chain</div>
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
