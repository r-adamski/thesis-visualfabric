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

interface Block{
    header: {
        number: number,
        previous_hash: string,
        data_hash: string
    }
}

function parseFabricBlock(block: any): Block{

    let parsed: Block = {header: {number: 1, previous_hash: 'asd', data_hash: 'sdf'}};

    const test = block.header.data_hash;
    console.log(test);

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


                // Add the block to the processing map by block numberr
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