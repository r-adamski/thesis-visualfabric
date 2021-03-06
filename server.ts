'use strict';

const { Wallets, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
import {
    Signature, Write, HashInfo, CollectionHashedRWSet,
    RWSet, Action, BlockData, Block, MapEntry
} from './interfaces';
const ioserver = require('socket.io');
import {Socket} from 'socket.io';

// interface Signature{
//     creator_msp_id: string,
//     signature: string
// }

// interface Write{
//     key: string,
//     is_delete: boolean,
//     value: string
// }

// interface HashInfo{
//     key_hash: string,
//     block_num?: string, //long up to 64bit
//     tx_num?: string, //long up to 64bit
//     is_delete?: boolean,
//     value_hash?: string
// }

// interface CollectionHashedRWSet{
//     collection_name: string,
//     hashed_reads: HashInfo[],
//     hashed_writes: HashInfo[] ,
//     pvt_rwset_hash: string
// }

// //if namespace === lscc ignore
// interface RWSet{
//     namespace: string,
//     rwset: {
//         reads: string[],
//         range_queries_info: string[],
//         writes: Write[]
//     },
//     collection_hashed_rwset: CollectionHashedRWSet[]
// }

// interface Action{
//     header: {
//         creator_msp_id: string,
//         creador_id_bytes: string
//     },
//     chaincode_proposal_payload: {
//         type: number,
//         typeString: string,
//         input: {
//             args: string[],
//             decorations?: string,
//             is_init: boolean
//         },
//         chaincode_id_name: string
//     },
//     proposal_response_payload: {
//         proposal_hash: string,
//         results:  {
//             data_model: number,
//             ns_rwset: RWSet[]
//         },
//         events: {
//             chaincode_id: string,
//             tx_id: string,
//             event_name: string
//             payload: string
//         },
//         response: {
//             status: number,
//             message: string
//             payload: string
//         },
//         chaincode_id: {
//             path: string,
//             name: string,
//             version: string
//         }
//     },
//     endorsements: Signature[]
// }

// interface BlockData{
//     signature: string,
//     channel_header: {
//         type: number,
//         version: number,
//         timestamp: string,
//         channel_id: string,
//         tx_id: string,
//         extension: string,
//         typeString: string
//     },
//     signature_header: {
//         creator_msp_id: string,
//         creator_id_bytes: string
//     },
//     actions: Action[]
// }

// interface Block{
//     header: {
//         number: string, //long up to 64bit
//         previous_hash: string,
//         data_hash: string
//     },
//     data: BlockData[],
//     metadata: {
//         value: string,
//         signatures: Signature[]
//     }
// }

// interface MapEntry{
//     id: string,
//     data: Block
// }

//parse long from object like Long {low: 34, high: 1}
function parseLongIntoString(data: any): string{

    let parsed: string = '';

    if(data?.high === 0){
        parsed = data?.low.toString();
    }
    else{
        parsed = `Low: ${data?.low.toString()} High: ${data?.high.toString()}`;
    }

    return parsed;
}


//only normal blocks with data - config blocks are blank for now
function parseFabricBlock(block: any): Block{


    //const test = block.data.data[0].payload.data?.config.channel_group.groups;
    //console.log(JSON.stringify(block));
    //console.log('\n\n\n\n');

    //parse signatures from metadata
    let parsed_signatures: Signature[] = [];
    block.metadata.metadata[0].signatures.forEach(element => {

        const signature: Signature = {
            creator_msp_id: element.signature_header.creator.mspid,
            signature: element.signature.toString('hex')
        }

        parsed_signatures.push(signature);
    });

    //parse BlockData
    let parsed_data: BlockData[] = [];

    block.data.data.forEach(element => {
        if(!element.payload.data.actions) return;

        //parse actions
        let parsed_actions: Action[] = [];
        element.payload.data.actions.forEach(action => {


            //parse input args
            let parsed_input_args: string[] = [];
            action.payload.chaincode_proposal_payload.input.chaincode_spec.input.args.forEach(arg => {
                parsed_input_args.push(arg.toString('hex'));
            });

            //parse endorsements signatures
            let parsed_endorsements_signatures: Signature[] = [];
            action.payload.action.endorsements.forEach(endorsm => {

                let single_endorsm: Signature = {
                    creator_msp_id: endorsm.endorser.mspid,
                    signature: endorsm.signature.toString('hex')
                }

                parsed_endorsements_signatures.push(single_endorsm);
            });

            //parse RWsets --- ignore
            let parsed_rwsets: RWSet[] = [];
            action.payload.action.proposal_response_payload.extension.results.ns_rwset.forEach(rw => {

                //check if lscc
                if(rw.namespace === 'lscc') return;

                //parse reads
                let parsed_reads: string[] = [];
                rw.rwset.reads.forEach(read => {
                    parsed_reads.push(read.key);
                });

                //parse range queries
                let parsed_range_queries: string[] = [];
                rw.rwset.range_queries_info.forEach(query => {
                    //parsed_range_queries.push(query.key);  idk whats inside
                });

                //parse writes
                let parsed_writes: Write[] = [];
                rw.rwset.writes.forEach(write => {

                    let single_write: Write = {
                        key: write.key,
                        is_delete: write.is_delete,
                        value: write.value.toString('utf8')
                    }

                    parsed_writes.push(single_write);
                });

                //parse range queries
                let parsed_collection_hashed_rw: CollectionHashedRWSet[] = [];
                rw.collection_hashed_rwset.forEach(collection => {


                    //parse hashed reads
                    let parsed_hashed_reads: HashInfo[] = [];
                    collection.hashed_rwset.hashed_reads.forEach(hashed_read => {

                        let single_hashed_read: HashInfo = {
                            key_hash: hashed_read.key_hash.toString('hex'),
                            block_num: parseLongIntoString(hashed_read?.version?.block_num), //long up to 64bit
                            tx_num: parseLongIntoString(hashed_read?.version?.tx_num), //long up to 64bit
                        }

                        parsed_hashed_reads.push(single_hashed_read);

                    });

                    //parse hashed writes
                    let parsed_hashed_writes: HashInfo[] = [];
                    collection.hashed_rwset.hashed_writes.forEach(hashed_write => {

                        let single_hashed_write: HashInfo = {
                            key_hash: hashed_write.key_hash.toString('hex'),
                            is_delete: hashed_write?.is_delete,
                            value_hash: hashed_write?.value_hash.toString('hex')
                        }

                        parsed_hashed_writes.push(single_hashed_write);

                    });


                    let single_collection: CollectionHashedRWSet = {
                        collection_name: collection.collection_name,
                        hashed_reads: parsed_hashed_reads,
                        hashed_writes: parsed_hashed_writes,
                        pvt_rwset_hash: collection.pvt_rwset_hash.toString('hex')
                    }

                    parsed_collection_hashed_rw.push(single_collection);
                });


                let single_rwset: RWSet = {
                    namespace: rw.namespace,
                    rwset: {
                        reads: parsed_reads,
                        range_queries_info: parsed_range_queries,
                        writes: parsed_writes
                    },
                    collection_hashed_rwset: parsed_collection_hashed_rw
                }

                parsed_rwsets.push(single_rwset);

            });

            let single_action: Action = {
                header: {
                    creator_msp_id: action.header.creator.mspid,
                    creator_id_bytes: action.header.creator.id_bytes.toString()
                },
                chaincode_proposal_payload: {
                    type: action.payload.chaincode_proposal_payload.input.chaincode_spec.type,
                    typeString: action.payload.chaincode_proposal_payload.input.chaincode_spec.type,
                    input: {
                        args: parsed_input_args,
                        is_init: action.payload.chaincode_proposal_payload.input.chaincode_spec.input.is_init
                    },
                    chaincode_id_name: action.payload.chaincode_proposal_payload.input.chaincode_spec.chaincode_id.name
                },
                proposal_response_payload: {
                    proposal_hash: action.payload.action.proposal_response_payload.proposal_hash.toString('hex'),
                    results:  {
                        data_model: action.payload.action.proposal_response_payload.extension.results.data_model,
                        ns_rwset: parsed_rwsets
                    },
                    events: {
                        chaincode_id: action.payload.action.proposal_response_payload.extension.events.chaincode_id,
                        tx_id: action.payload.action.proposal_response_payload.extension.events.tx_id,
                        event_name: action.payload.action.proposal_response_payload.extension.events.event_name,
                        payload: action.payload.action.proposal_response_payload.extension.events.payload.toString()
                    },
                    response: {
                        status: action.payload.action.proposal_response_payload.extension.response.status,
                        message: action.payload.action.proposal_response_payload.extension.response.message,
                        payload: action.payload.action.proposal_response_payload.extension.response.payload.toString()
                    },
                    chaincode_id: {
                        path: action.payload.action.proposal_response_payload.extension.chaincode_id.path,
                        name: action.payload.action.proposal_response_payload.extension.chaincode_id.name,
                        version: action.payload.action.proposal_response_payload.extension.chaincode_id.version
                    }
                },
                endorsements: parsed_endorsements_signatures
            }
            parsed_actions.push(single_action);
        });


        let single_data = {
            signature: element.signature.toString('hex'),
            channel_header: {
                type: element.payload.header.channel_header.type,
                version: element.payload.header.channel_header.version,
                timestamp: element.payload.header.channel_header.timestamp,
                channel_id: element.payload.header.channel_header.channel_id,
                tx_id: element.payload.header.channel_header.tx_id,
                extension: element.payload.header.channel_header.extension.toString('hex'),
                typeString: element.payload.header.channel_header.typeString
            },
            signature_header: {
                creator_msp_id: element.payload.header.signature_header.creator.mspid,
                creator_id_bytes: element.payload.header.signature_header.creator.id_bytes.toString()
            },
            actions: parsed_actions
        }

        parsed_data.push(single_data);
    });

    let parsed: Block = {
        header: {
            number: parseLongIntoString(block.header.number),
            previous_hash: block.header.previous_hash.toString('hex'),
            data_hash: block.header.data_hash.toString('hex')
        },
        data: parsed_data,
        metadata: {
            value: block.metadata.metadata[0].value.toString('hex'),
            signatures: parsed_signatures
        }
    };

    return parsed;
}


//simple map to hold blocks for processingg
class BlockMap {
    list: MapEntry[];

    constructor() {
        this.list = []
    }
    get(key: string) {
        return this.list.find(el => el.id === key);
    }

    set(key: string, data: Block) {

        //remove old if exist
        this.list = this.list.filter(el => el.id !== key);
        //push new
        this.list.push({
            id: key,
            data: data
        })
    }
}

let processing_map = new BlockMap();
let connections: Socket[] = []; //socket connections
let io: any = null;

async function main() {

    try {
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.get('appUser');
        if (!userExists) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the enrollUser.js application before retrying');
            return;
        }

        // Parse the connection profile. This would be the path to the file downloaded
        // from the IBM Blockchain Platform operational console.
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network','organizations','peerOrganizations','org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');



        const listener = await network.addBlockListener(
            async (block) => {

                //parse block
                const parsed_block: Block = parseFabricBlock(block.blockData);

                //add to processing map
                processing_map.set(parsed_block.header.number, parsed_block);

                console.log(`Added block ${parsed_block.header.number} to ProcessingMap`);

                //sending sockets newBlock
                connections.forEach((conn: Socket) => {
                    console.log('Sending addBlock socket: blockNR:' + parsed_block.header.number);
                    conn.emit('addBlock', {id: parsed_block.header.number, data: parsed_block});
                });

            },
            // set the starting block for the listener
            { filtered: false, startBlock: 0 }
        );

        console.log(`Listening for block events...`);


    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }

    //start express server and sockets
    app.use(express.static(path.join(__dirname, "visualfabric", "build")));

    const server = app.listen(5000, () => {
        console.log('Visualfabric App started on port 5000');
    });

    //sockets
    io = ioserver(server);

    io.on('connection', (client: Socket) => {
        console.log('Connected: ' + client.id);
        connections.push(client);

        console.log('Sending chain data to: ' + client.id);
        client.emit('loadChain', processing_map.list);

        //disconnect
        client.on('disconnect', () => {
            console.log('Disconnected - '+ client.id);
            connections = connections.filter((conn) => conn.id !== client.id);
        });
    });

    io.listen(8000);
    console.log('IO: listening on port 8000');

}

main();