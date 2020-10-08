"use strict";
/**
 * @file Product functions
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
exports.calculateCurrentStockLevel = exports.getProduct = exports.listProducts = exports.stockPath = void 0;
const path_1 = __importDefault(require("path"));
const tools_1 = require("./common/tools");
const transactions_1 = require("./transactions");
/**
 * Path to the stocks.json file
 * In a final project, I would have this path defined in a config file
 */
exports.stockPath = path_1.default.join(__dirname, "../../../", "data", "stock.json");
/**
 * List all sku products
 * @returns stock
 */
function listProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        const stock = yield tools_1.readJSONFile(exports.stockPath).catch(e => {
            throw new Error(`Failed to read stock file. Reason: ${e.message}`);
        });
        return stock;
    });
}
exports.listProducts = listProducts;
/**
 * Get product by sku code
 * @param sku
 * @returns product
 */
function getProduct(sku) {
    return __awaiter(this, void 0, void 0, function* () {
        const stock = yield listProducts();
        // Search the stock for a product with a matching SKU
        const product = stock.find((prod) => prod.sku === sku);
        // If we cannot find a product, we assume a stock of 0 for this SKU
        return product || { sku, stock: 0 };
    });
}
exports.getProduct = getProduct;
/**
 * Use our current stock and transactions list to find the current stock of a product
 * @param sku
 * @returns object containing the sku code and quantity
 */
function calculateCurrentStockLevel(sku) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get the associated product and transactions from the sku code
        const product = yield getProduct(sku);
        const transactions = yield transactions_1.listTransactionsForSKU(sku);
        // With no transactions, we can assume the stock hasn't changed
        if (transactions.length === 0) {
            return {
                sku,
                qty: product.stock
            };
        }
        // Figure out whether each transaction quantity should add or subscract from the stock
        const quantities = transactions.map(transaction => {
            switch (transaction.type) {
                case "order":
                    return transaction.qty * -1;
                case "refund":
                    return transaction.qty;
                default:
                    return 0;
            }
        });
        // Combine the intitial product stock with the combined transaction quantities
        const currentStock = product.stock + quantities.reduce((acc, cur) => acc + cur);
        return {
            sku,
            qty: currentStock
        };
    });
}
exports.calculateCurrentStockLevel = calculateCurrentStockLevel;
//# sourceMappingURL=products.js.map