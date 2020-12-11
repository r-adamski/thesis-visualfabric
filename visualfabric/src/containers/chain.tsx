import React, {useEffect} from 'react';
import {connect, useDispatch} from 'react-redux';
import io from 'socket.io-client';
import * as actions from '../store/actions/index';


const chain = (props: any) => {

  useEffect(() => {

    const dispatch = useDispatch();

    //socket connection
    const socket = io.connect('http://localhost:8000');

    dispatch(actions.loadChain(socket));

    return () => {
      console.log('chain cleanup');
      socket.disconecct();
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

export default connect(mapStateToProps, mapDispatchToProps)(chain);
