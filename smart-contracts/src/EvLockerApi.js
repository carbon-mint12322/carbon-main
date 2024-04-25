"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.__esModule = true;
exports.createRecord = exports.contractReceiptDetails = void 0;
var ethers_1 = require("ethers");
var EvidenceRecords__factory_1 = require("../typechain-types/factories/contracts/EvidenceRecords__factory");
var getBcConfig = function () {
    var appWalletPrivKey = process.env.APP_WALLET_PRIV_KEY;
    if (!appWalletPrivKey) {
        throw new Error("APP_WALLET_PRIV_KEY not set in environment");
    }
    //"0xf467e74c8e026F2A1a397eC66B42b0f35dFB4916"; // mumbai-specific
    var contractAddress = process.env.RECORD_CONTRACT_ADDRESS;
    if (!contractAddress) {
        throw new Error("RECORD_CONTRACT_ADDRESS not set in environment");
    }
    // e.g. https://polygon-mumbai.g.alchemy.com/v2/...
    var providerUrl = process.env.BLOCKCHAIN_URL;
    if (!providerUrl) {
        throw new Error("BLOCKCHAIN_URL not set in environment");
    }
    // e.g. "mumbai"
    var providerName = process.env.BLOCKCHAIN_NAME;
    if (!providerName) {
        throw new Error("BLOCKCHAIN_NAME not set in environment");
    }
    return { providerUrl: providerUrl, providerName: providerName, appWalletPrivKey: appWalletPrivKey, contractAddress: contractAddress };
};
var getAppWallet = function (config) {
    if (config === void 0) { config = getBcConfig(); }
    var privKey = config.appWalletPrivKey; //process.env.APP_WALLET_PRIV_KEY;
    var provider = new ethers_1.providers.JsonRpcProvider(config.providerUrl
    //, config.providerName
    );
    var wallet = new ethers_1.Wallet(privKey, provider);
    return wallet;
};
var _createRecord = function (evidence, contractAddress, wallet) { return __awaiter(void 0, void 0, void 0, function () {
    var contract, evidence2, tx, receipt;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                contract = EvidenceRecords__factory_1.EvidenceRecords__factory.connect(contractAddress, wallet);
                evidence2 = (evidence.recipient === "")
                    ? __assign(__assign({}, evidence), { recipient: wallet.address }) : evidence;
                return [4 /*yield*/, contract.createRecord(evidence2, wallet.address)];
            case 1:
                tx = _a.sent();
                return [4 /*yield*/, tx.wait(2)];
            case 2:
                receipt = _a.sent();
                return [2 /*return*/, receipt];
        }
    });
}); };
var contractReceiptDetails = function (receipt) { return ({
    hash: receipt.transactionHash,
    link: "https://mumbai.polygonscan.com/tx/".concat(receipt.transactionHash),
    blockchainReceipt: receipt
}); };
exports.contractReceiptDetails = contractReceiptDetails;
var createRecord = function (input, config) {
    if (config === void 0) { config = getBcConfig(); }
    return _createRecord(input, config.contractAddress, getAppWallet(config));
};
exports.createRecord = createRecord;
/*
export const verify = (uri, currentHash) => {

}

export const lookup = (uri) => {

}
*/ 
