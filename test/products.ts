/**
 * @file Testing product functions
 * @package stock-check
 * @author Ben Hawley
 */

// Testing Libraries
import test from "tape";
import sinon from "sinon";

// Internal Libraries
import {Transaction, TransactionType, Product} from "../src/common/types";
import * as tools from "../src/common/tools";
import * as products from "../src/products";
import * as transactions from "../src/transactions";

/**
 * Testing listProducts()
 */
test("products: test listProducts success", async assert => {
    assert.plan(1);

    const stock: Product[] = [
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

    const readJSONStub = sinon.stub(tools, "readJSONFile");
    readJSONStub.withArgs(products.stockPath).resolves(stock);

    const skus = await products.listProducts();

    assert.deepEquals(stock, skus, "listProducts returns all products from file")

    readJSONStub.restore();
    assert.end();
});

test("products: test listProducts failure (fails to read JSON)", async assert => {
    assert.plan(1);

    const readJSONStub = sinon.stub(tools, "readJSONFile");
    readJSONStub.withArgs(products.stockPath).rejects(new Error("File not found"));

    try {
        await products.listProducts();
        assert.fail("listProducts should throw if readJSONFile fails");
    } catch(e) {
        assert.equals(
            e.message,
            "Failed to read stock file. Reason: File not found",
            "correct error message is thrown"
        );
    }

    readJSONStub.restore();
    assert.end();
});

/**
 * Testing getProduct()
 */
test("products: test getProduct success (sku exists)", async assert => {
    assert.plan(2);
    const stock: Product[] = [
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

    const readJSONStub = sinon.stub(tools, "readJSONFile");
    readJSONStub.withArgs(products.stockPath).resolves(stock);

    const skuToFind = "SKU-TO-FIND";
    const matchingProduct = await products.getProduct(skuToFind);

    assert.equals(matchingProduct.sku, skuToFind, "getProduct returns correct product for sku");
    assert.equals(matchingProduct.stock, 8525, "getProduct returns correct product stock for sku");

    readJSONStub.restore();
    assert.end();
});

test("products: test getProduct success (sku does not exist)", async assert => {
    assert.plan(2);
    const stock: Product[] = [
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

    const readJSONStub = sinon.stub(tools, "readJSONFile");
    readJSONStub.withArgs(products.stockPath).resolves(stock);

    const skuToFind = "THIS-SCU-DOES-NOT-EXIST";
    const matchingProduct = await products.getProduct(skuToFind);

    assert.equals(matchingProduct.sku, skuToFind, "getProduct returns a default product with supplied sku");
    assert.equals(matchingProduct.stock, 0, "getProduct defaults product stock to 0 for unknown SKU");

    readJSONStub.restore();
    assert.end();
});

/**
 * Testing calculateCurrentStockLevel()
 */
test("products: test calculateStockLevel success (no transactions)", async assert => {
    assert.plan(2);
    const stock: Product[] = [
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

    const readJSONStub = sinon.stub(tools, "readJSONFile");
    readJSONStub.withArgs(products.stockPath).resolves(stock);
    readJSONStub.withArgs(transactions.transactionsPath).resolves([]);

    const skuToCalculate = "SKU-TO-CALCULATE";
    const result = await products.calculateCurrentStockLevel(skuToCalculate);

    assert.equals(result.sku, skuToCalculate, "calculate current stock returns correct sku");
    assert.equals(result.qty, 1000, "with no transactions calculate current stock assumes stock hasn't changed");

    readJSONStub.restore();
    assert.end();
});

test("products: test calculateStockLevel success (has order / refund transactions)", async assert => {
    assert.plan(2);
    const stock: Product[] = [
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

    const transactionsRecords: Transaction[] = [
        {
            sku: "SXB930757/87/87",
            qty: 10,
            type: TransactionType.order
        },
        {
            sku: "SKU-TO-CALCULATE",
            qty: 10,
            type: TransactionType.order
        },
        {
            sku: "SXB930757/87/65",
            qty: 10,
            type: TransactionType.refund
        },
        {
            sku: "SKU-TO-CALCULATE",
            qty: 10,
            type: TransactionType.refund
        },
        {
            sku: "SKU-TO-CALCULATE",
            qty: 15,
            type: TransactionType.order
        },
        {
            sku: "SKU-TO-CALCULATE",
            qty: 10,
            type: TransactionType.refund
        },
    ];

    const readJSONStub = sinon.stub(tools, "readJSONFile");
    readJSONStub.withArgs(products.stockPath).resolves(stock);
    readJSONStub.withArgs(transactions.transactionsPath).resolves(transactionsRecords);

    const skuToCalculate = "SKU-TO-CALCULATE";
    const result = await products.calculateCurrentStockLevel(skuToCalculate);

    assert.equals(result.sku, skuToCalculate, "calculate current stock returns correct sku");

    // 1000 (starting stock) - 10 (order) + 10 (refund) - 15 (order) + 10 (refund)
    assert.equals(result.qty, 995, "calculates transactions correctly");

    readJSONStub.restore();
    assert.end();
});