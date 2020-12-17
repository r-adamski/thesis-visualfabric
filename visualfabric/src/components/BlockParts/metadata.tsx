import React from 'react';
import {Signature} from '../../../../interfaces';
import Group from '../UI/group/group';
import Param from '../UI/param/param';

const metadata = (props: any) => {

    const data = props.data;
    //parse data
    let signatures = null;
    signatures = data.signatures.map((sign: Signature, id: number) => (
        <Group name='Signature' key={id}>
            <Param title='creator_msp_id' val={sign.creator_msp_id}/>
            <Param title='signature' val={sign.signature}/>
        </Group>
    ));

    return (
        <Group name='Metadata' className={props.className}>
            <Param title='value' val={data.value}/>

            {signatures}

        </Group>
    );
}

export default metadata;