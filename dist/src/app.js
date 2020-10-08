"use strict";
/**
 * @file Application entry point to input SKU number to check stock
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
Object.defineProperty(exports, "__esModule", { value: true });
const tools_1 = require("./common/tools");
const products_1 = require("./products");
/**
 * Read SKU ID and calculate stock level for the corresponding product
 */
function getCurrentStockLevel() {
    return __awaiter(this, void 0, void 0, function* () {
        // Prompt the user to input a SKU code
        const sku = yield tools_1.readUserInput("Please enter a SKU ID: ");
        // In a live application, I would use a logging library such as `winston` rather than `console`
        console.log(`Calculating current stock for SKU: ${sku}`);
        const currentStock = yield products_1.calculateCurrentStockLevel(sku);
        console.log(`${currentStock.sku} current stock level: ${currentStock.qty}`);
    });
}
exports.default = getCurrentStockLevel;
getCurrentStockLevel();
//# sourceMappingURL=app.js.map