import React from 'react';
import Group from '../UI/group/group';
import Param from '../UI/param/param';

const header = (props: any) => {


    return (
        <Group name='Header' className={props.className}>
            <Param title='number' val={props.data.number}/>
            <Param title='data_hash' val={props.data.data_hash}/>
            <Param title='previous_hash' val={props.data.previous_hash}/>
        </Group>
    );
}

export default header;