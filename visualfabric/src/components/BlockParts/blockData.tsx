import React, {Fragment} from 'react';
import {BlockData} from '../../../../interfaces';
import Group from '../UI/group/group';
import Param from '../UI/param/param';
import Actions from './actions';

const Data = (props: any) => {

    const data = props.data;
    //parse data
    let ret = null;
    ret = data.map((el: BlockData, id: number) => (
        <Group name='Block Data' key={id} className={props.className}>

            <Param title='signature' val={el.signature}/>

            <Group type='object' name='channel_header'>
                <Param title='type' val={el.channel_header.type} />
                <Param title='version' val={el.channel_header.version} />
                <Param title='timestamp' val={el.channel_header.timestamp} />
                <Param title='chennel_id' val={el.channel_header.channel_id} />
                <Param title='tx_id' val={el.channel_header.tx_id} />
                <Param title='extension' val={el.channel_header.extension} />
                <Param title='typeString' val={el.channel_header.typeString} />
            </Group>

            <Group type='object' name='signature_header'>
                <Param title='creator_msp_id' val={el.signature_header.creator_msp_id} />
                <Param title='creator_id_bytes' val={el.signature_header.creator_id_bytes} />
            </Group>

            <Actions data={el.actions} />

        </Group>
    ));

    return (
        <Fragment>
            {ret}
        </Fragment>
    );
}

export default Data;