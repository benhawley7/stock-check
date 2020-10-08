"use strict";
/**
 * @file Testing product functions
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
const products = __importStar(require("../src/products"));
const transactions = __importStar(require("../src/transactions"));
/**
 * Testing listProducts()
 */
tape_1.default("products: test listProducts success", (assert) => __awaiter(void 0, void 0, void 0, function* () {
    assert.plan(1);
    const stock = [
        {
            sku: "CLQ274846/07/46",
            stock: 8525
        },
        {
            sku: "CLQ274846/07/46",
            stock: 8414
        },
        {
            sku: "SXB930757/87/87",
            stock: 3552
        }
    ];
    const readJSONStub = sinon_1.default.stub(tools, "readJSONFile");
    readJSONStub.withArgs(products.stockPath).resolves(stock);
    const skus = yield products.listProducts();
    assert.deepEquals(stock, skus, "listProducts returns all products from file");
    readJSONStub.restore();
    assert.end();
}));
tape_1.default("products: test listProducts failure (fails to read JSON)", (assert) => __awaiter(void 0, void 0, void 0, function* () {
    assert.plan(1);
    const readJSONStub = sinon_1.default.stub(tools, "readJSONFile");
    readJSONStub.withArgs(products.stockPath).rejects(new Error("File not found"));
    try {
        yield products.listProducts();
        assert.fail("listProducts should throw if readJSONFile fails");
    }
    catch (e) {
        assert.equals(e.message, "Failed to read stock file. Reason: File not found", "correct error message is thrown");
    }
    readJSONStub.restore();
    assert.end();
}));
/**
 * Testing getProduct()
 */
tape_1.default("products: test getProduct success (sku exists)", (assert) => __awaiter(void 0, void 0, void 0, function* () {
    assert.plan(2);
    const stock = [
        {
            sku: "CLQ274846/07/46",
            stock: 8414
        },
        {
            sku: "SKU-TO-FIND",
            stock: 8525
        },
        {
            sku: "SXB930757/87/87",
            stock: 3552
        }
    ];
    const readJSONStub = sinon_1.default.stub(tools, "readJSONFile");
    readJSONStub.withArgs(products.stockPath).resolves(stock);
    const skuToFind = "SKU-TO-FIND";
    const matchingProduct = yield products.getProduct(skuToFind);
    assert.equals(matchingProduct.sku, skuToFind, "getProduct returns correct product for sku");
    assert.equals(matchingProduct.stock, 8525, "getProduct returns correct product stock for sku");
    readJSONStub.restore();
    assert.end();
}));
tape_1.default("products: test getProduct success (sku does not exist)", (assert) => __awaiter(void 0, void 0, void 0, function* () {
    assert.plan(2);
    const stock = [
        {
            sku: "CLQ274846/07/42",
            stock: 8525
        },
        {
            sku: "CLQ274846/07/46",
            stock: 8414
        },
        {
            sku: "SXB930757/87/87",
            stock: 3552
        }
    ];
    const readJSONStub = sinon_1.default.stub(tools, "readJSONFile");
    readJSONStub.withArgs(products.stockPath).resolves(stock);
    const skuToFind = "THIS-SCU-DOES-NOT-EXIST";
    const matchingProduct = yield products.getProduct(skuToFind);
    assert.equals(matchingProduct.sku, skuToFind, "getProduct returns a default product with supplied sku");
    assert.equals(matchingProduct.stock, 0, "getProduct defaults product stock to 0 for unknown SKU");
    readJSONStub.restore();
    assert.end();
}));
/**
 * Testing calculateCurrentStockLevel()
 */
tape_1.default("products: test calculateStockLevel success (no transactions)", (assert) => __awaiter(void 0, void 0, void 0, function* () {
    assert.plan(2);
    const stock = [
        {
            sku: "CLQ274846/07/46",
            stock: 8414
        },
        {
            sku: "SKU-TO-CALCULATE",
            stock: 1000
        },
        {
            sku: "SXB930757/87/87",
            stock: 3552
        }
    ];
    const readJSONStub = sinon_1.default.stub(tools, "readJSONFile");
    readJSONStub.withArgs(products.stockPath).resolves(stock);
    readJSONStub.withArgs(transactions.transactionsPath).resolves([]);
    const skuToCalculate = "SKU-TO-CALCULATE";
    const result = yield products.calculateCurrentStockLevel(skuToCalculate);
    assert.equals(result.sku, skuToCalculate, "calculate current stock returns correct sku");
    assert.equals(result.qty, 1000, "with no transactions calculate current stock assumes stock hasn't changed");
    readJSONStub.restore();
    assert.end();
}));
tape_1.default("products: test calculateStockLevel success (has order / refund transactions)", (assert) => __awaiter(void 0, void 0, void 0, function* () {
    assert.plan(2);
    const stock = [
        {
            sku: "CLQ274846/07/46",
            stock: 8414
        },
        {
            sku: "SKU-TO-CALCULATE",
            stock: 1000
        },
        {
            sku: "SXB930757/87/87",
            stock: 3552
        }
    ];
    const transactionsRecords = [
        {
            sku: "SXB930757/87/87",
            qty: 10,
            type: types_1.TransactionType.order
        },
        {
            sku: "SKU-TO-CALCULATE",
            qty: 10,
            type: types_1.TransactionType.order
        },
        {
            sku: "SXB930757/87/65",
            qty: 10,
            type: types_1.TransactionType.refund
        },
        {
            sku: "SKU-TO-CALCULATE",
            qty: 10,
            type: types_1.TransactionType.refund
        },
        {
            sku: "SKU-TO-CALCULATE",
            qty: 15,
            type: types_1.TransactionType.order
        },
        {
            sku: "SKU-TO-CALCULATE",
            qty: 10,
            type: types_1.TransactionType.refund
        },
    ];
    const readJSONStub = sinon_1.default.stub(tools, "readJSONFile");
    readJSONStub.withArgs(products.stockPath).resolves(stock);
    readJSONStub.withArgs(transactions.transactionsPath).resolves(transactionsRecords);
    const skuToCalculate = "SKU-TO-CALCULATE";
    const result = yield products.calculateCurrentStockLevel(skuToCalculate);
    assert.equals(result.sku, skuToCalculate, "calculate current stock returns correct sku");
    // 1000 (starting stock) - 10 (order) + 10 (refund) - 15 (order) + 10 (refund)
    assert.equals(result.qty, 995, "calculates transactions correctly");
    readJSONStub.restore();
    assert.end();
}));
//# sourceMappingURL=products.js.map