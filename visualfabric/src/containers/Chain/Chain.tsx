import React, {useEffect, Fragment, useState, useMemo} from 'react';
import {connect, useDispatch} from 'react-redux';
import {io, Socket} from 'socket.io-client';
import * as actions from '../../store/actions/index';
import Block from '../../components/Block/block';
import Search from '../../components/Search/search';

import {MapEntry, BlockData, Action, RWSet, Write} from '../../../../interfaces';
import classes from './chain.module.scss';

const Chain = (props: any) => {

  const [nrSearch, setNrSearch] = useState(-1);
  const [writesSearch, setWritesSearch] = useState('');
  const [data, setData] = useState();

  const dispatch = useDispatch();

  useEffect(() => {
    console.log('connection');

    //socket connection
    const socket: Socket = io('http://127.0.0.1:8000', {
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
  }, [dispatch]);


  const initLoad = useMemo(() => {
    console.log('initLoad');
    let temp = props.chain.map((el: MapEntry) => (
      <Block key={el.id} data={el} showAdvanced={() => props.showAdvancedBlock(el)}/>
    ))
    setData(temp);
  }, [props]);

  useEffect(() => {
    console.log('NR');

    let newData = props.chain;
    if(nrSearch !== -1) {
      newData = props.chain.filter((el: MapEntry) => el.id === nrSearch.toString());
    }

    let temp = newData.map((el: MapEntry) => (
      <Block key={el.id} data={el} showAdvanced={() => props.showAdvancedBlock(el)}/>
    ))
    setData(temp);

  }, [nrSearch])

  useEffect(() => {
    console.log('WRITE');


    let newData = props.chain;
    if(writesSearch !== '') {
      newData = props.chain.filter((el: MapEntry) => {
        let writes: string = '';

        //parse writes
        el.data.data.forEach((el: BlockData) => {
            el.actions.forEach((act: Action) => {

                const rwset: RWSet[] = act.proposal_response_payload.results.ns_rwset;
                rwset.forEach((set: RWSet) => {
                    //writes
                    set.rwset.writes.forEach((write: Write) => (
                        writes += write.value + ', '
                    ));

                });

            });

        });

        return writes.includes(writesSearch);

      });
    }

    let temp = newData.map((el: MapEntry) => (
      <Block key={el.id} data={el} showAdvanced={() => props.showAdvancedBlock(el)}/>
    ))
    setData(temp);

  }, [writesSearch])

  console.log('obok');


  return (
    <Fragment>
        <Search setNr={(nr: number) => setNrSearch(nr)} setWrite={(write: string) => setWritesSearch(write)} />
      <div className={classes.chain}>
        {data}
      </div>
    </Fragment>
  );
}


const mapStateToProps = (state: any) => {
  return {
    chain: state.chain.chain
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    loadChain: (socket: Socket) => dispatch(actions.loadChain(socket)),
    showAdvancedBlock: (data: MapEntry) => dispatch(actions.showAdvancedBlock(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chain);
