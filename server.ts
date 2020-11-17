'use strict';

const { Wallets, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');


// simple map to hold blocks for processingg
// class BlockMap {
//     constructor() {
//         this.list = []
//     }
//     get(key) {
//         key = parseInt(key, 10).toString();
//         return this.list[`block${key}`];
//     }
//     set(key, blockData) {

//     	console.log(`------------------------------------------------`);
//         console.log(`Converting block number: ${key}`);
//     	let blockDataJSON = this.convertBlockToJSON(blockData);
//     	console.log(`------------------------------------------------`);

//         this.list[`block${key}`] = blockData;
//     }
//     remove(key) {
//         key = parseInt(key, 10).toString();
//         delete this.list[`block${key}`];
//     }
//     convertBlockToJSON(blockData) {
//     	console.log(blockData);
//     }
// }



// let ProcessingMap = new BlockMap();

interface Signature{
    creator_msp_id: string,
    creator_id_bytes: string,
    nonce: string
    signature: string
}

interface Block{
    header: {
        number: string, //long up to 64bit
        previous_hash: string,
        data_hash: string
    },
    metadata: {
        value: string,
        signatures: Signature[],
        something: any, //array at pos 1
        something2: number[] //array at pos 2,
        something3: any, //array at pos 3,
        end_value: string //some encoded buffer at the end
    }
}

//parse long from object like Long {low: 34, high: 1}
function parseLongIntoString(data: any): string{

    let parsed: string = '';

    if(data.high === 0){
        parsed = data.low.toString();
    }
    else{
        parsed = `Low: ${data.low.toString()} High: ${data.high.toString()}`;
    }

    return parsed;
}


function parseFabricBlock(block: any): Block{


    const test = block.data.data[0];
    console.log(test);



    let parsed_signatures = [];

    block.metadata.metadata[0].signatures.forEach(element => {

        const signature = {
            creator_msp_id: element.signature_header.creator.mspid,
            creator_id_bytes: element.signature_header.creator.id_bytes.toString('base64'),
            nonce: element.signature_header.nonce.toString('base64'),
            signature: element.signature.toString('base64')
        }

        parsed_signatures.push(signature);
    });

    let parsed: Block = {
        header: {
            number: parseLongIntoString(block.header.number),
            previous_hash: block.header.previous_hash.toString('base64'),
            data_hash: block.header.data_hash.toString('base64')
        },
        metadata: {
            value: block.metadata.metadata[0].value.toString('base64'),
            signatures: parsed_signatures,
            something: block.metadata.metadata[1],
            something2: block.metadata.metadata[2],
            something3: block.metadata.metadata[3],
            end_value: block.metadata.metadata[4].toString('base64')
        }
    };

    return parsed;
}


async function main() {


//start express server and sockets


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


                // Add the block to the processing map by block numberrrr
                //await ProcessingMap.set(block.blockData.header.number, block.blockData);

                parseFabricBlock(block.blockData);

                console.log(`Added block ${block.blockData.header.number} to ProcessingMap`);

            },
            // set the starting block for the listener
            { filtered: false, startBlock: 0 }
        );

        console.log(`Listening for block events...`);


    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

main();