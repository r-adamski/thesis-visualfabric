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
//parse long from object like Long {low: 34, high: 1}
function parseLongIntoString(data) {
    var parsed = '';
    if (data.high === 0) {
        parsed = data.low.toString();
    }
    else {
        parsed = "Low: " + data.low.toString() + " High: " + data.high.toString();
    }
    return parsed;
}
function parseFabricBlock(block) {
    var test = block.metadata.metadata[4].toString('base64');
    console.log(test);
    var parsed = {
        header: {
            number: parseLongIntoString(block.header.number),
            previous_hash: block.header.previous_hash.toString('base64'),
            data_hash: block.header.data_hash.toString('base64')
        }
    };
    return parsed;
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var walletPath, wallet, userExists, ccpPath, ccp, gateway, network, listener, error_1;
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
                            return __generator(this, function (_a) {
                                // Add the block to the processing map by block numberrrr
                                //await ProcessingMap.set(block.blockData.header.number, block.blockData);
                                parseFabricBlock(block.blockData);
                                console.log("Added block " + block.blockData.header.number + " to ProcessingMap");
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
                case 7: return [2 /*return*/];
            }
        });
    });
}
main();
