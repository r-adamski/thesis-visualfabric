'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a = require('fabric-network'), Wallets = _a.Wallets, Gateway = _a.Gateway;
var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();
var socket = require('socket.io');
//parse long from object like Long {low: 34, high: 1}
function parseLongIntoString(data) {
    var parsed = '';
    if ((data === null || data === void 0 ? void 0 : data.high) === 0) {
        parsed = data === null || data === void 0 ? void 0 : data.low.toString();
    }
    else {
        parsed = "Low: " + (data === null || data === void 0 ? void 0 : data.low.toString()) + " High: " + (data === null || data === void 0 ? void 0 : data.high.toString());
    }
    return parsed;
}
//only normal blocks with data - config blocks are blank for now
function parseFabricBlock(block) {
    //const test = block.data.data[0].payload.data?.config.channel_group.groups;
    //console.log(JSON.stringify(block));
    //console.log('\n\n\n\n');
    //parse signatures from metadata
    var parsed_signatures = [];
    block.metadata.metadata[0].signatures.forEach(function (element) {
        var signature = {
            creator_msp_id: element.signature_header.creator.mspid,
            signature: element.signature.toString('base64')
        };
        parsed_signatures.push(signature);
    });
    //parse BlockData
    var parsed_data = [];
    block.data.data.forEach(function (element) {
        if (element.payload.data.actions.length === 0)
            return;
        //parse actions
        var parsed_actions = [];
        element.payload.data.actions.forEach(function (action) {
            console.log('parsing action');
            //parse input args
            var parsed_input_args = [];
            action.payload.chaincode_proposal_payload.input.chaincode_spec.input.args.forEach(function (arg) {
                parsed_input_args.push(arg.toString('base64'));
            });
            //parse endorsements signatures
            var parsed_endorsements_signatures = [];
            action.payload.action.endorsements.forEach(function (endorsm) {
                var single_endorsm = {
                    creator_msp_id: endorsm.endorser.mspid,
                    signature: endorsm.signature.toString('base64')
                };
                parsed_endorsements_signatures.push(single_endorsm);
            });
            //parse RWsets --- ignore
            var parsed_rwsets = [];
            action.payload.action.proposal_response_payload.extension.results.ns_rwset.forEach(function (rw) {
                //check if lscc
                if (rw.namespace === 'lscc')
                    return;
                //parse reads
                var parsed_reads = [];
                rw.rwset.reads.forEach(function (read) {
                    parsed_reads.push(read.key);
                });
                //parse range queries
                var parsed_range_queries = [];
                rw.rwset.range_queries_info.forEach(function (query) {
                    //parsed_range_queries.push(query.key);  idk whats inside
                });
                //parse writes
                var parsed_writes = [];
                rw.rwset.writes.forEach(function (write) {
                    var single_write = {
                        key: write.key,
                        is_delete: write.is_delete,
                        value: write.value.toString('base64')
                    };
                    parsed_writes.push(single_write);
                });
                //parse range queries
                var parsed_collection_hashed_rw = [];
                rw.collection_hashed_rwset.forEach(function (collection) {
                    //parse hashed reads
                    var parsed_hashed_reads = [];
                    collection.hashed_rwset.hashed_reads.forEach(function (hashed_read) {
                        var _a, _b;
                        var single_hashed_read = {
                            key_hash: hashed_read.key_hash.toString('base64'),
                            block_num: parseLongIntoString((_a = hashed_read === null || hashed_read === void 0 ? void 0 : hashed_read.version) === null || _a === void 0 ? void 0 : _a.block_num),
                            tx_num: parseLongIntoString((_b = hashed_read === null || hashed_read === void 0 ? void 0 : hashed_read.version) === null || _b === void 0 ? void 0 : _b.tx_num)
                        };
                        parsed_hashed_reads.push(single_hashed_read);
                    });
                    //parse hashed writes
                    var parsed_hashed_writes = [];
                    collection.hashed_rwset.hashed_writes.forEach(function (hashed_write) {
                        var single_hashed_write = {
                            key_hash: hashed_write.key_hash.toString('base64'),
                            is_delete: hashed_write === null || hashed_write === void 0 ? void 0 : hashed_write.is_delete,
                            value_hash: hashed_write === null || hashed_write === void 0 ? void 0 : hashed_write.value_hash.toString('base64')
                        };
                        parsed_hashed_writes.push(single_hashed_write);
                    });
                    var single_collection = {
                        collection_name: collection.collection_name,
                        hashed_reads: parsed_hashed_reads,
                        hashed_writes: parsed_hashed_writes,
                        pvt_rwset_hash: collection.pvt_rwset_hash.toString('base64')
                    };
                    parsed_collection_hashed_rw.push(single_collection);
                });
                var single_rwset = {
                    namespace: rw.namespace,
                    rwset: {
                        reads: parsed_reads,
                        range_queries_info: parsed_range_queries,
                        writes: parsed_writes
                    },
                    collection_hashed_rwset: parsed_collection_hashed_rw
                };
                parsed_rwsets.push(single_rwset);
            });
            var single_action = {
                header: {
                    creator_msp_id: action.header.creator.mspid,
                    creador_id_bytes: action.header.creator.id_bytes.toString('base64')
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
                    proposal_hash: action.payload.action.proposal_response_payload.proposal_hash.toString('base64'),
                    results: {
                        data_model: action.payload.action.proposal_response_payload.extension.results.data_model,
                        ns_rwset: parsed_rwsets
                    },
                    events: {
                        chaincode_id: action.payload.action.proposal_response_payload.extension.events.chaincode_id,
                        tx_id: action.payload.action.proposal_response_payload.extension.events.tx_id,
                        event_name: action.payload.action.proposal_response_payload.extension.events.event_name,
                        payload: action.payload.action.proposal_response_payload.extension.events.payload.toString('base64')
                    },
                    response: {
                        status: action.payload.action.proposal_response_payload.extension.response.status,
                        message: action.payload.action.proposal_response_payload.extension.response.message,
                        payload: action.payload.action.proposal_response_payload.extension.response.payload.toString('base64')
                    },
                    chaincode_id: {
                        path: action.payload.action.proposal_response_payload.extension.chaincode_id.path,
                        name: action.payload.action.proposal_response_payload.extension.chaincode_id.name,
                        version: action.payload.action.proposal_response_payload.extension.chaincode_id.version
                    }
                },
                endorsements: parsed_endorsements_signatures
            };
            parsed_actions.push(single_action);
        });
        var single_data = {
            signature: element.signature.toString('base64'),
            channel_header: {
                type: element.payload.header.channel_header.type,
                version: element.payload.header.channel_header.version,
                timestamp: element.payload.header.channel_header.timestamp,
                channel_id: element.payload.header.channel_header.channel_id,
                tx_id: element.payload.header.channel_header.tx_id,
                extension: element.payload.header.channel_header.extension.toString('base64'),
                typeString: element.payload.header.channel_header.typeString
            },
            signature_header: {
                creator_msp_id: element.payload.header.signature_header.creator.mspid,
                creator_id_bytes: element.payload.header.signature_header.creator.id_bytes.toString('base64')
            },
            actions: parsed_actions
        };
        parsed_data.push(single_data);
    });
    var parsed = {
        header: {
            number: parseLongIntoString(block.header.number),
            previous_hash: block.header.previous_hash.toString('base64'),
            data_hash: block.header.data_hash.toString('base64')
        },
        data: parsed_data,
        metadata: {
            value: block.metadata.metadata[0].value.toString('base64'),
            signatures: parsed_signatures
        }
    };
    return parsed;
}
//simple map to hold blocks for processingg
var BlockMap = /** @class */ (function () {
    function BlockMap() {
        this.list = [];
    }
    BlockMap.prototype.get = function (key) {
        return this.list.find(function (el) { return el.id === key; });
    };
    BlockMap.prototype.set = function (key, data) {
        //remove old if exist
        this.list.filter(function (el) { return el.id === key; });
        //push new
        this.list.push({
            id: key,
            data: data
        });
    };
    return BlockMap;
}());
var processing_map = new BlockMap();
var connections = []; //socket connections
var io = null;
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var walletPath, wallet, userExists, ccpPath, ccp, gateway, network, listener, error_1, server;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    walletPath = path.join(process.cwd(), 'wallet');
                    return [4 /*yield*/, Wallets.newFileSystemWallet(walletPath)];
                case 1:
                    wallet = _a.sent();
                    console.log("Wallet path: " + walletPath);
                    return [4 /*yield*/, wallet.get('appUser')];
                case 2:
                    userExists = _a.sent();
                    if (!userExists) {
                        console.log('An identity for the user "appUser" does not exist in the wallet');
                        console.log('Run the enrollUser.js application before retrying');
                        return [2 /*return*/];
                    }
                    ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
                    ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
                    gateway = new Gateway();
                    return [4 /*yield*/, gateway.connect(ccp, { wallet: wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, gateway.getNetwork('mychannel')];
                case 4:
                    network = _a.sent();
                    return [4 /*yield*/, network.addBlockListener(function (block) { return __awaiter(_this, void 0, void 0, function () {
                            var parsed_block;
                            return __generator(this, function (_a) {
                                parsed_block = parseFabricBlock(block.blockData);
                                //add to processing map
                                processing_map.set(parsed_block.header.number, parsed_block);
                                console.log("Added block " + parsed_block.header.number + " to ProcessingMap");
                                return [2 /*return*/];
                            });
                        }); }, 
                        // set the starting block for the listener
                        { filtered: false, startBlock: 0 })];
                case 5:
                    listener = _a.sent();
                    console.log("Listening for block events...");
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _a.sent();
                    console.error("Failed to evaluate transaction: " + error_1);
                    process.exit(1);
                    return [3 /*break*/, 7];
                case 7:
                    //start express server and sockets
                    app.use(express.static(path.join(__dirname, "visualfabric", "build")));
                    server = app.listen(5000, function () {
                        console.log('Visualfabric App started on port 5000');
                    });
                    //sockets
                    io = socket(server);
                    io.on('connection', function (client) {
                        console.log('Connected: ' + client.id);
                        connections.push(client);
                        console.log('Sending chain data to: ' + client.id);
                        client.emit('loadChain', processing_map.list);
                        //disconnect
                        client.on('disconnect', function () {
                            console.log('Disconnected - ' + client.id);
                            connections.filter(function (conn) { return conn.id === client.id; });
                        });
                    });
                    io.listen(8000);
                    console.log('IO: listening on port 8000');
                    return [2 /*return*/];
            }
        });
    });
}
main();
