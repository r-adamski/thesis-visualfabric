import React from 'react';
import {Signature} from '../../../interfaces';
import classes from './block.module.scss'
import Param from './UI/param/param';
import Group from './UI/group/group';

const block = (props: any) => {

    const header = props.data.data.header;
    const metadata = props.data.data.metadata;


    //signatures
    let signatures = null;
    signatures = metadata.signatures.map((sign: Signature) => (
        sign.creator_msp_id + ', '
    ));

    //data
    let data = 'Configuration block.';

    return (
        <div className={classes.block}>
            <h2>Block <span className={classes.number}>#{header.number}</span></h2>

            <Group name='Header' className={classes.header}>
                <Param title='data_hash' val={header.data_hash}/>
                <Param title='previous_hash' val={header.previous_hash}/>
            </Group>

            <div className={classes.data}>

            </div>

            <Group name='Metadata' className={classes.metadata}>
                <Param title='signatures' val={signatures} />
                <Param title='value' val={metadata.value} />
            </Group>

        </div>
    );
}

export default block;