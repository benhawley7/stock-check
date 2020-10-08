"use strict";
/**
 * @file Testing transactions functions
 * @package stock-check
 * @author Ben Hawley
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Testing Libraries
const tape_1 = __importDefault(require("tape"));
const sinon_1 = __importDefault(require("sinon"));
// Internal Libraries
const types_1 = require("../src/common/types");
const tools = __importStar(require("../src/common/tools"));
const transactions = __importStar(require("../src/transactions"));
/**
 * Testing listTransactions()
 */
tape_1.default("transactions: testing listTransactions success", (assert) => __awaiter(void 0, void 0, void 0, function* () {
    assert.plan(1);
    const transactionRecords = [
        {
            sku: "CLQ274846/07/46",
            qty: 100,
            type: types_1.TransactionType.order
        },
        {
            sku: "CLQ274846/07/46",
            qty: 40,
            type: types_1.TransactionType.order
        },
        {
            sku: "SXB930757/87/87",
            qty: 3552,
            type: types_1.TransactionType.refund
        }
    ];
    const readJSONStub = sinon_1.default.stub(tools, "readJSONFile");
    readJSONStub.withArgs(transactions.transactionsPath).resolves(transactionRecords);
    const result = yield transactions.listTransactions();
    assert.deepEquals(transactionRecords, result, "listTransactions returns all transactions from file");
    readJSONStub.restore();
    assert.end();
}));
tape_1.default("transactions: test listTransactions failure (fails to read JSON)", (assert) => __awaiter(void 0, void 0, void 0, function* () {
    assert.plan(1);
    const readJSONStub = sinon_1.default.stub(tools, "readJSONFile");
    readJSONStub.withArgs(transactions.transactionsPath).rejects(new Error("File not found"));
    try {
        yield transactions.listTransactions();
        assert.fail("listTransactions should throw if readJSONFile fails");
    }
    catch (e) {
        assert.equals(e.message, "Failed to read transactions file. Reason: File not found", "correct error message is thrown");
    }
    readJSONStub.restore();
    assert.end();
}));
/**
 * Testing listTransactionsForSKU()
 */
tape_1.default("transactions: test listTransactionsForSKU success", (assert) => __awaiter(void 0, void 0, void 0, function* () {
    assert.plan(2);
    const transactionRecords = [
        {
            sku: "SKU-TO-FIND",
            qty: 100,
            type: types_1.TransactionType.order
        },
        {
            sku: "CLQ274846/07/46",
            qty: 40,
            type: types_1.TransactionType.order
        },
        {
            sku: "SXB930757/87/87",
            qty: 3552,
            type: types_1.TransactionType.refund
        },
        {
            sku: "SKU-TO-FIND",
            qty: 13,
            type: types_1.TransactionType.order
        },
        {
            sku: "SKU-TO-FIND",
            qty: 20,
            type: types_1.TransactionType.refund
        },
    ];
    const readJSONStub = sinon_1.default.stub(tools, "readJSONFile");
    readJSONStub.withArgs(transactions.transactionsPath).resolves(transactionRecords);
    const skuToFind = "SKU-TO-FIND";
    const result = yield transactions.listTransactionsForSKU(skuToFind);
    assert.equals(result.length, 3, "should find 3 matching transactions");
    const allSkusCorrect = result.every(record => record.sku === skuToFind);
    assert.true(allSkusCorrect, "only tranasactions for the supplied sku are returned");
    readJSONStub.restore();
    assert.end();
}));
//# sourceMappingURL=transactions.js.map