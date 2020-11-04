
function printData(block){

// reject the block if the block number is not defined
        if (block.header.number == undefined) {
            reject(new Error('Undefined block number'));
        }

        const blockNumber = block.header.number

        console.log(`------------------------------------------------`);
        console.log(`Block Number: ${blockNumber}`);

        // reject if the data is not set
        if (block.data.data == undefined) {
            reject(new Error('Data block is not defined'));
        }

        const dataArray = block.data.data;

        // transaction filter for each transaction in dataArray
        const txSuccess = block.metadata.metadata[2];

        for (var dataItem in dataArray) {

            // reject if a timestamp is not set
            if (dataArray[dataItem].payload.header.channel_header.timestamp == undefined) {
                reject(new Error('Transaction timestamp is not defined'));
            }

            // tx may be rejected at commit stage by peers
            // only valid transactions (code=0) update the word state and off-chain db
            // filter through valid tx, refer below for list of error codes
            // https://github.com/hyperledger/fabric-sdk-node/blob/release-1.4/fabric-client/lib/protos/peer/transaction.proto
            if (txSuccess[dataItem] !== 0) {
              continue;
            }

            const timestamp = dataArray[dataItem].payload.header.channel_header.timestamp;

            // continue to next tx if no actions are set
            if (dataArray[dataItem].payload.data.actions == undefined) {
                continue;
            }

            // actions are stored as an array. In Fabric 1.4.3 only one
            // action exists per tx so we may simply use actions[0]
            // in case Fabric adds support for multiple actions
            // a for loop is used for demonstration
            const actions = dataArray[dataItem].payload.data.actions;

            // iterate through all actions
            for (var actionItem in actions) {

                // reject if a chaincode id is not defined
                if (actions[actionItem].payload.chaincode_proposal_payload.input.chaincode_spec.chaincode_id.name == undefined) {
                    reject(new Error('Chaincode name is not defined'));
                }

                const chaincodeID = actions[actionItem].payload.chaincode_proposal_payload.input.chaincode_spec.chaincode_id.name

                // reject if there is no readwrite set
                if (actions[actionItem].payload.action.proposal_response_payload.extension.results.ns_rwset == undefined) {
                    reject(new Error('No readwrite set is defined'));
                }

                const rwSet = actions[actionItem].payload.action.proposal_response_payload.extension.results.ns_rwset

                for (let record in rwSet) {

                    // ignore lscc events
                    if (rwSet[record].namespace != 'lscc') {
                        // create object to store properties
                        const writeObject = new Object();
                        writeObject.blocknumber = blockNumber;
                        writeObject.chaincodeid = chaincodeID;
                        writeObject.timestamp = timestamp;
                        writeObject.values = rwSet[record].rwset.writes;

                      
                        const val = rwSet[record].rwset.writes;


			Object.keys(val).forEach((id) => {

				let buf = val[id].value;

				console.log(buf.toString());					
			})
			
			sfsfsdfsdfsdfsdfdupaa
			lol
			lol234343434
			555
			huj kurwa
			kurwaqa

japierdole
kurwamac no
sdfkjhnsdjdsfj
gowno jebane

                        console.log(`Transaction Timestamp: ${writeObject.timestamp}`);
                        console.log(`ChaincodeID: ${writeObject.chaincodeid}`);
                        console.log(writeObject.values);

                    }
                };
            };
        };
}