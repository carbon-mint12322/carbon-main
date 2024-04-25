"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.EvidenceRecords__factory = void 0;
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
var ethers_1 = require("ethers");
var _abi = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "sender",
                type: "address"
            },
            {
                indexed: false,
                internalType: "string",
                name: "evidence",
                type: "string"
            },
        ],
        name: "LogLocked",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "sender",
                type: "address"
            },
            {
                indexed: false,
                internalType: "string",
                name: "evidence",
                type: "string"
            },
            {
                indexed: false,
                internalType: "address",
                name: "recipient",
                type: "address"
            },
        ],
        name: "LogNewRecord",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "sender",
                type: "address"
            },
            {
                indexed: false,
                internalType: "string",
                name: "evidence",
                type: "string"
            },
            {
                indexed: false,
                internalType: "address",
                name: "recipient",
                type: "address"
            },
        ],
        name: "LogRecordUpdate",
        type: "event"
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "string",
                        name: "uri",
                        type: "string"
                    },
                    {
                        internalType: "string",
                        name: "hash",
                        type: "string"
                    },
                    {
                        internalType: "string",
                        name: "userId",
                        type: "string"
                    },
                    {
                        internalType: "string",
                        name: "userName",
                        type: "string"
                    },
                    {
                        internalType: "int32",
                        name: "latitude",
                        type: "int32"
                    },
                    {
                        internalType: "int32",
                        name: "longitude",
                        type: "int32"
                    },
                    {
                        internalType: "int32",
                        name: "ts",
                        type: "int32"
                    },
                    {
                        internalType: "address",
                        name: "recipient",
                        type: "address"
                    },
                    {
                        internalType: "bool",
                        name: "locked",
                        type: "bool"
                    },
                ],
                internalType: "struct EvidenceRecords.Record",
                name: "evidence",
                type: "tuple"
            },
            {
                internalType: "address",
                name: "recipient",
                type: "address"
            },
        ],
        name: "createRecord",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "",
                type: "string"
            },
        ],
        name: "evidenceLookup",
        outputs: [
            {
                internalType: "string",
                name: "uri",
                type: "string"
            },
            {
                internalType: "string",
                name: "hash",
                type: "string"
            },
            {
                internalType: "string",
                name: "userId",
                type: "string"
            },
            {
                internalType: "string",
                name: "userName",
                type: "string"
            },
            {
                internalType: "int32",
                name: "latitude",
                type: "int32"
            },
            {
                internalType: "int32",
                name: "longitude",
                type: "int32"
            },
            {
                internalType: "int32",
                name: "ts",
                type: "int32"
            },
            {
                internalType: "address",
                name: "recipient",
                type: "address"
            },
            {
                internalType: "bool",
                name: "locked",
                type: "bool"
            },
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "uri",
                type: "string"
            },
        ],
        name: "isExists",
        outputs: [
            {
                internalType: "bool",
                name: "isIndeed",
                type: "bool"
            },
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "uri",
                type: "string"
            },
        ],
        name: "isLocked",
        outputs: [
            {
                internalType: "bool",
                name: "isIndeed",
                type: "bool"
            },
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "uri",
                type: "string"
            },
            {
                internalType: "address",
                name: "user",
                type: "address"
            },
        ],
        name: "isUserRecord",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool"
            },
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "uri",
                type: "string"
            },
        ],
        name: "lockRecord",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "uri",
                type: "string"
            },
        ],
        name: "lookup",
        outputs: [
            {
                components: [
                    {
                        internalType: "string",
                        name: "uri",
                        type: "string"
                    },
                    {
                        internalType: "string",
                        name: "hash",
                        type: "string"
                    },
                    {
                        internalType: "string",
                        name: "userId",
                        type: "string"
                    },
                    {
                        internalType: "string",
                        name: "userName",
                        type: "string"
                    },
                    {
                        internalType: "int32",
                        name: "latitude",
                        type: "int32"
                    },
                    {
                        internalType: "int32",
                        name: "longitude",
                        type: "int32"
                    },
                    {
                        internalType: "int32",
                        name: "ts",
                        type: "int32"
                    },
                    {
                        internalType: "address",
                        name: "recipient",
                        type: "address"
                    },
                    {
                        internalType: "bool",
                        name: "locked",
                        type: "bool"
                    },
                ],
                internalType: "struct EvidenceRecords.Record",
                name: "",
                type: "tuple"
            },
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "string",
                        name: "uri",
                        type: "string"
                    },
                    {
                        internalType: "string",
                        name: "hash",
                        type: "string"
                    },
                    {
                        internalType: "string",
                        name: "userId",
                        type: "string"
                    },
                    {
                        internalType: "string",
                        name: "userName",
                        type: "string"
                    },
                    {
                        internalType: "int32",
                        name: "latitude",
                        type: "int32"
                    },
                    {
                        internalType: "int32",
                        name: "longitude",
                        type: "int32"
                    },
                    {
                        internalType: "int32",
                        name: "ts",
                        type: "int32"
                    },
                    {
                        internalType: "address",
                        name: "recipient",
                        type: "address"
                    },
                    {
                        internalType: "bool",
                        name: "locked",
                        type: "bool"
                    },
                ],
                internalType: "struct EvidenceRecords.Record",
                name: "evidence",
                type: "tuple"
            },
            {
                internalType: "address",
                name: "recipient",
                type: "address"
            },
        ],
        name: "updateRecord",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            },
        ],
        name: "uriList",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string"
            },
        ],
        stateMutability: "view",
        type: "function"
    },
];
var _bytecode = "0x608060405234801561001057600080fd5b50612265806100206000396000f3fe608060405234801561001057600080fd5b50600436106100935760003560e01c80638032eccb116100665780638032eccb1461013057806398184bde14610160578063b52d0a9214610198578063cf985549146101b4578063f67187ac146101e457610093565b80630d85d839146100985780630f11b186146100c857806321061542146100e4578063369b95f714610100575b600080fd5b6100b260048036038101906100ad91906118c2565b610214565b6040516100bf9190611926565b60405180910390f35b6100e260048036038101906100dd91906118c2565b61028e565b005b6100fe60048036038101906100f99190611b5e565b6103bc565b005b61011a60048036038101906101159190611bf0565b610746565b6040516101279190611ca5565b60405180910390f35b61014a600480360381019061014591906118c2565b6107f2565b6040516101579190611926565b60405180910390f35b61017a600480360381019061017591906118c2565b610b87565b60405161018f99989796959493929190611ce5565b60405180910390f35b6101b260048036038101906101ad9190611b5e565b610e5f565b005b6101ce60048036038101906101c99190611d8e565b6111f5565b6040516101db9190611926565b60405180910390f35b6101fe60048036038101906101f991906118c2565b6112c2565b60405161020b9190611f3b565b60405180910390f35b60008073ffffffffffffffffffffffffffffffffffffffff1660008360405161023d9190611f99565b9081526020016040518091039020600401600c9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614159050919050565b3373ffffffffffffffffffffffffffffffffffffffff166000826040516102b59190611f99565b9081526020016040518091039020600401600c9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161461030757600080fd5b6000151560008260405161031b9190611f99565b908152602001604051809103902060050160009054906101000a900460ff1615151461034657600080fd5b60016000826040516103589190611f99565b908152602001604051809103902060050160006101000a81548160ff0219169083151502179055507f23306221fdc2599739f388e9337fd47e4e26c4aa70f11aadff6d5879a5c698d433826040516103b1929190611fb0565b60405180910390a150565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16141561042c576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104239061202c565b60405180910390fd5b6104398260000151610214565b15610479576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161047090612098565b60405180910390fd5b60405180610120016040528083600001518152602001836020015181526020018360400151815260200183606001518152602001836080015160030b81526020018360a0015160030b81526020018360c0015160030b81526020018273ffffffffffffffffffffffffffffffffffffffff16815260200183610100015115158152506000836000015160405161050f9190611f99565b90815260200160405180910390206000820151816000019080519060200190610539929190611658565b506020820151816001019080519060200190610556929190611658565b506040820151816002019080519060200190610573929190611658565b506060820151816003019080519060200190610590929190611658565b5060808201518160040160006101000a81548163ffffffff021916908360030b63ffffffff16021790555060a08201518160040160046101000a81548163ffffffff021916908360030b63ffffffff16021790555060c08201518160040160086101000a81548163ffffffff021916908360030b63ffffffff16021790555060e082015181600401600c6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506101008201518160050160006101000a81548160ff021916908315150217905550905050600182600001519080600181540180825580915050600190039060005260206000200160009091909190915090805190602001906106b9929190611658565b507f27a7e34b917b8fbbe04a6443dd9063ef90a8ee4b540595e0f5f59f83b0957cac338360000151836040516106f1939291906120b8565b60405180910390a181610100015115610742577f23306221fdc2599739f388e9337fd47e4e26c4aa70f11aadff6d5879a5c698d4338360000151604051610739929190611fb0565b60405180910390a15b5050565b6001818154811061075657600080fd5b90600052602060002001600091509050805461077190612125565b80601f016020809104026020016040519081016040528092919081815260200182805461079d90612125565b80156107ea5780601f106107bf576101008083540402835291602001916107ea565b820191906000526020600020905b8154815290600101906020018083116107cd57829003601f168201915b505050505081565b60006107fd82610214565b61083c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610833906121a3565b60405180910390fd5b6000808360405161084d9190611f99565b90815260200160405180910390206040518061012001604052908160008201805461087790612125565b80601f01602080910402602001604051908101604052809291908181526020018280546108a390612125565b80156108f05780601f106108c5576101008083540402835291602001916108f0565b820191906000526020600020905b8154815290600101906020018083116108d357829003601f168201915b5050505050815260200160018201805461090990612125565b80601f016020809104026020016040519081016040528092919081815260200182805461093590612125565b80156109825780601f1061095757610100808354040283529160200191610982565b820191906000526020600020905b81548152906001019060200180831161096557829003601f168201915b5050505050815260200160028201805461099b90612125565b80601f01602080910402602001604051908101604052809291908181526020018280546109c790612125565b8015610a145780601f106109e957610100808354040283529160200191610a14565b820191906000526020600020905b8154815290600101906020018083116109f757829003601f168201915b50505050508152602001600382018054610a2d90612125565b80601f0160208091040260200160405190810160405280929190818152602001828054610a5990612125565b8015610aa65780601f10610a7b57610100808354040283529160200191610aa6565b820191906000526020600020905b815481529060010190602001808311610a8957829003601f168201915b505050505081526020016004820160009054906101000a900460030b60030b60030b81526020016004820160049054906101000a900460030b60030b60030b81526020016004820160089054906101000a900460030b60030b60030b815260200160048201600c9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020016005820160009054906101000a900460ff1615151515815250509050806101000151915050919050565b600081805160208101820180518482526020830160208501208183528095505050505050600091509050806000018054610bc090612125565b80601f0160208091040260200160405190810160405280929190818152602001828054610bec90612125565b8015610c395780601f10610c0e57610100808354040283529160200191610c39565b820191906000526020600020905b815481529060010190602001808311610c1c57829003601f168201915b505050505090806001018054610c4e90612125565b80601f0160208091040260200160405190810160405280929190818152602001828054610c7a90612125565b8015610cc75780601f10610c9c57610100808354040283529160200191610cc7565b820191906000526020600020905b815481529060010190602001808311610caa57829003601f168201915b505050505090806002018054610cdc90612125565b80601f0160208091040260200160405190810160405280929190818152602001828054610d0890612125565b8015610d555780601f10610d2a57610100808354040283529160200191610d55565b820191906000526020600020905b815481529060010190602001808311610d3857829003601f168201915b505050505090806003018054610d6a90612125565b80601f0160208091040260200160405190810160405280929190818152602001828054610d9690612125565b8015610de35780601f10610db857610100808354040283529160200191610de3565b820191906000526020600020905b815481529060010190602001808311610dc657829003601f168201915b5050505050908060040160009054906101000a900460030b908060040160049054906101000a900460030b908060040160089054906101000a900460030b9080600401600c9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060050160009054906101000a900460ff16905089565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610ecf576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ec69061202c565b60405180910390fd5b610edc8260000151610214565b610f1b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f12906121a3565b60405180910390fd5b610f2882600001516107f2565b15610f68576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f5f9061220f565b60405180910390fd5b60405180610120016040528083600001518152602001836020015181526020018360400151815260200183606001518152602001836080015160030b81526020018360a0015160030b81526020018360c0015160030b81526020018273ffffffffffffffffffffffffffffffffffffffff168152602001836101000151151581525060008360000151604051610ffe9190611f99565b90815260200160405180910390206000820151816000019080519060200190611028929190611658565b506020820151816001019080519060200190611045929190611658565b506040820151816002019080519060200190611062929190611658565b50606082015181600301908051906020019061107f929190611658565b5060808201518160040160006101000a81548163ffffffff021916908360030b63ffffffff16021790555060a08201518160040160046101000a81548163ffffffff021916908360030b63ffffffff16021790555060c08201518160040160086101000a81548163ffffffff021916908360030b63ffffffff16021790555060e082015181600401600c6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506101008201518160050160006101000a81548160ff0219169083151502179055509050507fef90300437ac9e22cdbd7f49fa198ecfcd7b23a9f281b162741be31d2b1928e0338360000151836040516111a0939291906120b8565b60405180910390a1816101000151156111f1577f23306221fdc2599739f388e9337fd47e4e26c4aa70f11aadff6d5879a5c698d43383600001516040516111e8929190611fb0565b60405180910390a15b5050565b600061120083610214565b61120d57600090506112bc565b8173ffffffffffffffffffffffffffffffffffffffff166000846040516112349190611f99565b9081526020016040518091039020600401600c9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161461128a57600090506112bc565b60008360405161129a9190611f99565b908152602001604051809103902060050160009054906101000a900460ff1690505b92915050565b6112ca6116de565b6112d382610214565b611312576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611309906121a3565b60405180910390fd5b600080836040516113239190611f99565b90815260200160405180910390206040518061012001604052908160008201805461134d90612125565b80601f016020809104026020016040519081016040528092919081815260200182805461137990612125565b80156113c65780601f1061139b576101008083540402835291602001916113c6565b820191906000526020600020905b8154815290600101906020018083116113a957829003601f168201915b505050505081526020016001820180546113df90612125565b80601f016020809104026020016040519081016040528092919081815260200182805461140b90612125565b80156114585780601f1061142d57610100808354040283529160200191611458565b820191906000526020600020905b81548152906001019060200180831161143b57829003601f168201915b5050505050815260200160028201805461147190612125565b80601f016020809104026020016040519081016040528092919081815260200182805461149d90612125565b80156114ea5780601f106114bf576101008083540402835291602001916114ea565b820191906000526020600020905b8154815290600101906020018083116114cd57829003601f168201915b5050505050815260200160038201805461150390612125565b80601f016020809104026020016040519081016040528092919081815260200182805461152f90612125565b801561157c5780601f106115515761010080835404028352916020019161157c565b820191906000526020600020905b81548152906001019060200180831161155f57829003601f168201915b505050505081526020016004820160009054906101000a900460030b60030b60030b81526020016004820160049054906101000a900460030b60030b60030b81526020016004820160089054906101000a900460030b60030b60030b815260200160048201600c9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020016005820160009054906101000a900460ff161515151581525050905080915050919050565b82805461166490612125565b90600052602060002090601f01602090048101928261168657600085556116cd565b82601f1061169f57805160ff19168380011785556116cd565b828001600101855582156116cd579182015b828111156116cc5782518255916020019190600101906116b1565b5b5090506116da919061174b565b5090565b60405180610120016040528060608152602001606081526020016060815260200160608152602001600060030b8152602001600060030b8152602001600060030b8152602001600073ffffffffffffffffffffffffffffffffffffffff1681526020016000151581525090565b5b8082111561176457600081600090555060010161174c565b5090565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6117cf82611786565b810181811067ffffffffffffffff821117156117ee576117ed611797565b5b80604052505050565b6000611801611768565b905061180d82826117c6565b919050565b600067ffffffffffffffff82111561182d5761182c611797565b5b61183682611786565b9050602081019050919050565b82818337600083830152505050565b600061186561186084611812565b6117f7565b90508281526020810184848401111561188157611880611781565b5b61188c848285611843565b509392505050565b600082601f8301126118a9576118a861177c565b5b81356118b9848260208601611852565b91505092915050565b6000602082840312156118d8576118d7611772565b5b600082013567ffffffffffffffff8111156118f6576118f5611777565b5b61190284828501611894565b91505092915050565b60008115159050919050565b6119208161190b565b82525050565b600060208201905061193b6000830184611917565b92915050565b600080fd5b600080fd5b60008160030b9050919050565b6119618161194b565b811461196c57600080fd5b50565b60008135905061197e81611958565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006119af82611984565b9050919050565b6119bf816119a4565b81146119ca57600080fd5b50565b6000813590506119dc816119b6565b92915050565b6119eb8161190b565b81146119f657600080fd5b50565b600081359050611a08816119e2565b92915050565b60006101208284031215611a2557611a24611941565b5b611a306101206117f7565b9050600082013567ffffffffffffffff811115611a5057611a4f611946565b5b611a5c84828501611894565b600083015250602082013567ffffffffffffffff811115611a8057611a7f611946565b5b611a8c84828501611894565b602083015250604082013567ffffffffffffffff811115611ab057611aaf611946565b5b611abc84828501611894565b604083015250606082013567ffffffffffffffff811115611ae057611adf611946565b5b611aec84828501611894565b6060830152506080611b008482850161196f565b60808301525060a0611b148482850161196f565b60a08301525060c0611b288482850161196f565b60c08301525060e0611b3c848285016119cd565b60e083015250610100611b51848285016119f9565b6101008301525092915050565b60008060408385031215611b7557611b74611772565b5b600083013567ffffffffffffffff811115611b9357611b92611777565b5b611b9f85828601611a0e565b9250506020611bb0858286016119cd565b9150509250929050565b6000819050919050565b611bcd81611bba565b8114611bd857600080fd5b50565b600081359050611bea81611bc4565b92915050565b600060208284031215611c0657611c05611772565b5b6000611c1484828501611bdb565b91505092915050565b600081519050919050565b600082825260208201905092915050565b60005b83811015611c57578082015181840152602081019050611c3c565b83811115611c66576000848401525b50505050565b6000611c7782611c1d565b611c818185611c28565b9350611c91818560208601611c39565b611c9a81611786565b840191505092915050565b60006020820190508181036000830152611cbf8184611c6c565b905092915050565b611cd08161194b565b82525050565b611cdf816119a4565b82525050565b6000610120820190508181036000830152611d00818c611c6c565b90508181036020830152611d14818b611c6c565b90508181036040830152611d28818a611c6c565b90508181036060830152611d3c8189611c6c565b9050611d4b6080830188611cc7565b611d5860a0830187611cc7565b611d6560c0830186611cc7565b611d7260e0830185611cd6565b611d80610100830184611917565b9a9950505050505050505050565b60008060408385031215611da557611da4611772565b5b600083013567ffffffffffffffff811115611dc357611dc2611777565b5b611dcf85828601611894565b9250506020611de0858286016119cd565b9150509250929050565b600082825260208201905092915050565b6000611e0682611c1d565b611e108185611dea565b9350611e20818560208601611c39565b611e2981611786565b840191505092915050565b611e3d8161194b565b82525050565b611e4c816119a4565b82525050565b611e5b8161190b565b82525050565b6000610120830160008301518482036000860152611e7f8282611dfb565b91505060208301518482036020860152611e998282611dfb565b91505060408301518482036040860152611eb38282611dfb565b91505060608301518482036060860152611ecd8282611dfb565b9150506080830151611ee26080860182611e34565b5060a0830151611ef560a0860182611e34565b5060c0830151611f0860c0860182611e34565b5060e0830151611f1b60e0860182611e43565b50610100830151611f30610100860182611e52565b508091505092915050565b60006020820190508181036000830152611f558184611e61565b905092915050565b600081905092915050565b6000611f7382611c1d565b611f7d8185611f5d565b9350611f8d818560208601611c39565b80840191505092915050565b6000611fa58284611f68565b915081905092915050565b6000604082019050611fc56000830185611cd6565b8181036020830152611fd78184611c6c565b90509392505050565b7f496e76616c696420726563697069656e74000000000000000000000000000000600082015250565b6000612016601183611c28565b915061202182611fe0565b602082019050919050565b6000602082019050818103600083015261204581612009565b9050919050565b7f4558495354530000000000000000000000000000000000000000000000000000600082015250565b6000612082600683611c28565b915061208d8261204c565b602082019050919050565b600060208201905081810360008301526120b181612075565b9050919050565b60006060820190506120cd6000830186611cd6565b81810360208301526120df8185611c6c565b90506120ee6040830184611cd6565b949350505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061213d57607f821691505b60208210811415612151576121506120f6565b5b50919050565b7f444f45535f4e4f545f4558495354000000000000000000000000000000000000600082015250565b600061218d600e83611c28565b915061219882612157565b602082019050919050565b600060208201905081810360008301526121bc81612180565b9050919050565b7f4c4f434b45440000000000000000000000000000000000000000000000000000600082015250565b60006121f9600683611c28565b9150612204826121c3565b602082019050919050565b60006020820190508181036000830152612228816121ec565b905091905056fea26469706673582212201d8fb3169b398203758fcc53d2aca8d72f0eb3e77a7f29f918f40f545807cb2964736f6c63430008090033";
var isSuperArgs = function (xs) { return xs.length > 1; };
var EvidenceRecords__factory = /** @class */ (function (_super) {
    __extends(EvidenceRecords__factory, _super);
    function EvidenceRecords__factory() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _this = this;
        if (isSuperArgs(args)) {
            _this = _super.apply(this, args) || this;
        }
        else {
            _this = _super.call(this, _abi, _bytecode, args[0]) || this;
        }
        return _this;
    }
    EvidenceRecords__factory.prototype.deploy = function (overrides) {
        return _super.prototype.deploy.call(this, overrides || {});
    };
    EvidenceRecords__factory.prototype.getDeployTransaction = function (overrides) {
        return _super.prototype.getDeployTransaction.call(this, overrides || {});
    };
    EvidenceRecords__factory.prototype.attach = function (address) {
        return _super.prototype.attach.call(this, address);
    };
    EvidenceRecords__factory.prototype.connect = function (signer) {
        return _super.prototype.connect.call(this, signer);
    };
    EvidenceRecords__factory.createInterface = function () {
        return new ethers_1.utils.Interface(_abi);
    };
    EvidenceRecords__factory.connect = function (address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    };
    EvidenceRecords__factory.bytecode = _bytecode;
    EvidenceRecords__factory.abi = _abi;
    return EvidenceRecords__factory;
}(ethers_1.ContractFactory));
exports.EvidenceRecords__factory = EvidenceRecords__factory;