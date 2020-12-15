import React from 'react';
import {Signature, BlockData, Action, RWSet, Write} from '../../../../interfaces';
import classes from './block.module.scss'
import Param from '../UI/param/param';
import Group from '../UI/group/group';

const block = (props: any) => {

    const header = props.data.data.header;
    const data = props.data.data.data;
    const metadata = props.data.data.metadata;

    //signatures
    let signatures: string = '';
    signatures = metadata.signatures.map((sign: Signature) => (
        sign.creator_msp_id + ', '
    ));

    //data
    let dataSimplified: any[] = [];
    data.forEach((el: BlockData) => {
        const channel_id: string = el.channel_header.channel_id;
        const timestamp: string = el.channel_header.timestamp;
        const creator_msp_id: string = el.signature_header.creator_msp_id;

        el.actions.forEach((act: Action) => {

            const rwset: RWSet[] = act.proposal_response_payload.results.ns_rwset;

            let reads: string = '';
            let writes: string = '';

            rwset.forEach((set: RWSet) => {

                //reads
                set.rwset.reads.forEach((read: string) => (
                    reads += read + ', '
                ));

                //writes
                set.rwset.writes.forEach((write: Write) => (
                    writes += write.value + ', '
                ));

            });

            dataSimplified.push({
                channel_id: channel_id,
                timestamp: timestamp,
                creator_msp_id: creator_msp_id,
                reads: reads,
                writes: writes
            });

        });

    });

    let dataSimplifiedJSX: any = null;
    dataSimplifiedJSX = dataSimplified.map((el: any, id: number) => (
        <Group name='Transaction' className={classes.transaction} key={id}>
            <Param title='channel_id' val={el.channel_id} />
            <Param title='creator_msp_id' val={el.creator_msp_id} />
            <Param title='timestamp' val={el.timestamp} />
            <Param title='reads' val={el.reads} />
            <Param title='writes' val={el.writes} />
        </Group>
    ));

    //console.log(JSON.stringify(dataSimplified));

    return (
        <div className={classes.block} onClick={props.showAdvanced}>
            <h2>Block <span className={classes.number}>#{header.number}</span></h2>

            <Group name='Header' className={classes.header}>
                <Param title='data_hash' val={header.data_hash}/>
                <Param title='previous_hash' val={header.previous_hash}/>
            </Group>

            {dataSimplifiedJSX}

            <Group name='Metadata' className={classes.metadata}>
                <Param title='signatures' val={signatures} />
                <Param title='value' val={metadata.value} />
            </Group>

        </div>
    );
}

export default block;