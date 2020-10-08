"use strict";
/**
 * @file Transaction functions
 * @package stock-check
 * @author Ben Hawley
 */
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
exports.listTransactionsForSKU = exports.listTransactions = exports.transactionsPath = void 0;
const path_1 = __importDefault(require("path"));
const tools_1 = require("./common/tools");
/**
 * Path to the transactions.json file
 */
exports.transactionsPath = path_1.default.join(__dirname, "../../../", "data", "transactions.json");
/**
 * List all transactions
 */
function listTransactions() {
    return __awaiter(this, void 0, void 0, function* () {
        const transactions = yield tools_1.readJSONFile(exports.transactionsPath).catch(e => {
            throw new Error(`Failed to read transactions file. Reason: ${e.message}`);
        });
        return transactions;
    });
}
exports.listTransactions = listTransactions;
/**
 * List all transactions for a supplied SKU code
 */
function listTransactionsForSKU(sku) {
    return __awaiter(this, void 0, void 0, function* () {
        const transactions = yield listTransactions();
        return transactions.filter(transaction => transaction.sku === sku);
    });
}
exports.listTransactionsForSKU = listTransactionsForSKU;
//# sourceMappingURL=transactions.js.map