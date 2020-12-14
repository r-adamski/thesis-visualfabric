import React, {useEffect} from 'react';
import {connect, useDispatch} from 'react-redux';
import {io, Socket} from 'socket.io-client';
import * as actions from '../store/actions/index';
import Block from '../components/block';

import {MapEntry} from '../../../interfaces';
import classes from './chain.module.scss';

const Chain = (props: any) => {

  const dispatch = useDispatch();

  useEffect(() => {

    //socket connection
    const socket: Socket = io('http://192.168.0.17:8000', {
      transports: ['websocket']
    });

    //loading chain
    dispatch(actions.loadChain(socket));

    socket.on('addBlock', (res: MapEntry) => {
      console.log('AddBlock socket event');
      dispatch(actions.addBlock(res));
    });

    return () => {
      console.log('socket disconnect');
      socket.disconnect();
    }
  }, []);


  let data;
  if(Array.isArray(props.chain)){
  data = props.chain.map((el: MapEntry) => (
    <Block key={el.id} data={el} />
  ));
  }

  return (
    <div className={classes.chain}>
      {data}
    </div>
  );
}


const mapStateToProps = (state: any) => {
  return {
    chain: state.chain.chain
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    loadChain: (socket: Socket) => dispatch(actions.loadChain(socket))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chain);
