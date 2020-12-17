import React, {Fragment} from 'react';
import {Action, CollectionHashedRWSet, HashInfo, RWSet, Signature, Write} from '../../../../interfaces';
import Group from '../UI/group/group';
import Param from '../UI/param/param';

const actions = (props: any) => {

    //parse data
    let ret = null;
    ret = props.data.map((el: Action, id: number) => {

        //parse endorsements
        let endorsements = null;
        endorsements = el.endorsements.map((endors: Signature, endors_id: number) => (
            <Group name='Endorsement' key={endors_id}>
                <Param title='creator_msp_id' val={endors.creator_msp_id}/>
                <Param title='signature' val={endors.signature}/>
            </Group>
        ));

        //parse RWset
        let rwSets = null;
        rwSets = el.proposal_response_payload.results.ns_rwset.map((set: RWSet, set_id: number) => {

            //parse Writes
            let writes = null;
            writes = set.rwset.writes.map((write: Write, write_id: number)  => (
                <Group name='Write' key={write_id}>
                    <Param title='key' val={write.key}/>
                    <Param title='is_delete' val={write.is_delete}/>
                    <Param title='value' val={write.value}/>
                </Group>
            ));

            //parse CollectionHashedRWSet
            let collectionHashed = null;
            collectionHashed = set.collection_hashed_rwset.map((hashed: CollectionHashedRWSet, hashed_id: number)  => {

                //parse hashedReads
                let hashedReads = null;
                hashedReads = hashed.hashed_reads.map((hashedRead: HashInfo, hashedRead_id: number)  => (
                    <Group name='HashedRead' key={hashedRead_id}>
                        <Param title='key_hash' val={hashedRead.key_hash}/>
                        <Param title='block_num' val={hashedRead.block_num}/>
                        <Param title='tx_num' val={hashedRead.tx_num}/>
                        <Param title='is_delete' val={hashedRead.is_delete}/>
                        <Param title='value_hash' val={hashedRead.value_hash}/>
                    </Group>
                ));

                //parse hashedWrites
                let hashedWrites = null;
                hashedWrites = hashed.hashed_writes.map((hashedWrite: HashInfo, hashedWrite_id: number)  => (
                    <Group name='HashedWrite' key={hashedWrite_id}>
                        <Param title='key_hash' val={hashedWrite.key_hash}/>
                        <Param title='block_num' val={hashedWrite.block_num}/>
                        <Param title='tx_num' val={hashedWrite.tx_num}/>
                        <Param title='is_delete' val={hashedWrite.is_delete}/>
                        <Param title='value_hash' val={hashedWrite.value_hash}/>
                    </Group>
                ));

                return (
                    <Group name='CollectionHashedRWSet' key={hashed_id}>
                        <Param title='collection_name' val={hashed.collection_name}/>
                        <Param title='pvt_rwset_hash' val={hashed.pvt_rwset_hash}/>

                        <Group type='object' name='hashed_reads'>
                            {hashedReads}
                        </Group>

                        <Group type='object' name='hashed_writes'>
                            {hashedWrites}
                        </Group>

                    </Group>
                );
            });


            return (
                <Group name='RWSet' key={set_id}>
                    <Param title='namespace' val={set.namespace}/>

                    <Group type='object' name='rwset'>
                        <Param title='reads' val={set.rwset.reads.join(', ')}/>
                        <Param title='range_queries_info' val={set.rwset.range_queries_info.join(', ')}/>

                        {writes}
                    </Group>

                    {collectionHashed}
                </Group>
            );
        });

        return (
            <Group name='Action' key={id}>

                <Group type='object' name='header'>
                    <Param title='creator_msp_id' val={el.header.creator_msp_id}/>
                    <Param title='creator_id_bytes' val={el.header.creator_id_bytes}/>
                </Group>

                <Group type='object' name='chaincode_proposal_payload'>
                    <Param title='type' val={el.chaincode_proposal_payload.type}/>
                    <Param title='typeString' val={el.chaincode_proposal_payload.typeString}/>
                    <Param title='chaincode_id_name' val={el.chaincode_proposal_payload.chaincode_id_name}/>

                    <Group type='object' name='input'>
                        <Param title='args' val={el.chaincode_proposal_payload.input.args.join(', ')}/>
                        <Param title='decorations' val={el.chaincode_proposal_payload.input.decorations}/>
                        <Param title='is_init' val={el.chaincode_proposal_payload.input.is_init}/>
                    </Group>

                </Group>


                <Group type='object' name='chaincode_response_payload'>
                    <Param title='proposal_hash' val={el.proposal_response_payload.proposal_hash}/>

                    <Group type='object' name='results'>
                        <Param title='data_model' val={el.proposal_response_payload.results.data_model}/>

                        {rwSets}
                    </Group>

                    <Group type='object' name='events'>
                        <Param title='chaincode_id' val={el.proposal_response_payload.events.chaincode_id}/>
                        <Param title='tx_id' val={el.proposal_response_payload.events.tx_id}/>
                        <Param title='event_name' val={el.proposal_response_payload.events.event_name}/>
                        <Param title='payload' val={el.proposal_response_payload.events.payload}/>
                    </Group>

                    <Group type='object' name='response'>
                        <Param title='status' val={el.proposal_response_payload.response.status}/>
                        <Param title='message' val={el.proposal_response_payload.response.message}/>
                        <Param title='payload' val={el.proposal_response_payload.response.payload}/>
                    </Group>

                    <Group type='object' name='chaincode_id'>
                        <Param title='path' val={el.proposal_response_payload.chaincode_id.path}/>
                        <Param title='name' val={el.proposal_response_payload.chaincode_id.name}/>
                        <Param title='version' val={el.proposal_response_payload.chaincode_id.version}/>
                    </Group>

                </Group>

                {endorsements}


            </Group>
        );
    });

    return (
        <Fragment>
            {ret}
        </Fragment>
    );
}

export default actions;