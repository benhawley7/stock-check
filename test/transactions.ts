/**
 * @file Testing transactions functions
 * @package stock-check
 * @author Ben Hawley
 */

// Testing Libraries
import test from "tape";
import sinon from "sinon";

// Internal Libraries
import {Transaction, TransactionType} from "../src/common/types";
import * as tools from "../src/common/tools";
import * as transactions from "../src/transactions";

/**
 * Testing listTransactions()
 */
test("transactions: testing listTransactions success", async assert => {
    assert.plan(1);

    const transactionRecords: Transaction[] = [
        {
            sku: "CLQ274846/07/46",
            qty: 100,
            type: TransactionType.order
        },
        {
            sku: "CLQ274846/07/46",
            qty: 40,
            type: TransactionType.order
        },
        {
            sku: "SXB930757/87/87",
            qty: 3552,
            type: TransactionType.refund

        }
    ];

    const readJSONStub = sinon.stub(tools, "readJSONFile");
    readJSONStub.withArgs(transactions.transactionsPath).resolves(transactionRecords);

    const result = await transactions.listTransactions();

    assert.deepEquals(transactionRecords, result, "listTransactions returns all transactions from file");

    readJSONStub.restore();
    assert.end();
});

test("transactions: test listTransactions failure (fails to read JSON)", async assert => {
    assert.plan(1);

    const readJSONStub = sinon.stub(tools, "readJSONFile");
    readJSONStub.withArgs(transactions.transactionsPath).rejects(new Error("File not found"));

    try {
        await transactions.listTransactions();
        assert.fail("listTransactions should throw if readJSONFile fails");
    } catch(e) {
        // Ensure that the error is handled and the message is formatted correctly
        assert.equals(
            e.message,
            "Failed to read transactions file. Reason: File not found",
            "correct error message is thrown"
        );
    }

    readJSONStub.restore();
    assert.end();
});

/**
 * Testing listTransactionsForSKU()
 */
test("transactions: test listTransactionsForSKU success", async assert => {
    assert.plan(2);

    const transactionRecords: Transaction[] = [
        {
            sku: "SKU-TO-FIND",
            qty: 100,
            type: TransactionType.order
        },
        {
            sku: "CLQ274846/07/46",
            qty: 40,
            type: TransactionType.order
        },
        {
            sku: "SXB930757/87/87",
            qty: 3552,
            type: TransactionType.refund
        },
        {
            sku: "SKU-TO-FIND",
            qty: 13,
            type: TransactionType.order
        },
        {
            sku: "SKU-TO-FIND",
            qty: 20,
            type: TransactionType.refund
        },
    ];

    const readJSONStub = sinon.stub(tools, "readJSONFile");
    readJSONStub.withArgs(transactions.transactionsPath).resolves(transactionRecords);

    const skuToFind = "SKU-TO-FIND";
    const result = await transactions.listTransactionsForSKU(skuToFind);

    assert.equals(result.length, 3, "should find 3 matching transactions");
    const allSkusCorrect = result.every(record => record.sku === skuToFind);
    assert.true(allSkusCorrect, "only transactions for the supplied sku are returned");

    readJSONStub.restore();
    assert.end();
});

test("transactions: test listTransactionsForSKU success (no transactions for sku)", async assert => {
    assert.plan(1);

    const transactionRecords: Transaction[] = [
        {
            sku: "CLQ274846/07/46",
            qty: 100,
            type: TransactionType.order
        },
        {
            sku: "CLQ274846/07/46",
            qty: 40,
            type: TransactionType.order
        },
        {
            sku: "SXB930757/87/87",
            qty: 3552,
            type: TransactionType.refund
        },
        {
            sku: "CLQ274846/07/46",
            qty: 13,
            type: TransactionType.order
        },
        {
            sku: "CLQ274846/07/46",
            qty: 20,
            type: TransactionType.refund
        },
    ];

    const readJSONStub = sinon.stub(tools, "readJSONFile");
    readJSONStub.withArgs(transactions.transactionsPath).resolves(transactionRecords);

    const skuToFind = "SKU-TO-FIND";
    const result = await transactions.listTransactionsForSKU(skuToFind);

    assert.equals(result.length, 0, "should return no matching transactions");

    readJSONStub.restore();
    assert.end();
});