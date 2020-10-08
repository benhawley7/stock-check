/**
 * @file Transaction functions
 * @package stock-check
 * @author Ben Hawley
 */

import path from "path";
import {Transaction} from "./common/types";
import {readJSONFile} from "./common/tools";

/**
 * Path to the transactions.json file
 * In a final project, I would have this path defined in a config file
 */
export const transactionsPath: string = path.join(__dirname, "../../", "data", "transactions.json");

/**
 * List all transactions
 */
export async function listTransactions(): Promise<Transaction[]> {
    const transactions = await readJSONFile(transactionsPath).catch(e => {
        throw new Error(`Failed to read transactions file. Reason: ${e.message}`);
    });
    return transactions;
}

/**
 * List all transactions for a supplied SKU code
 */
export async function listTransactionsForSKU(sku: string): Promise<Transaction[]> {
    const transactions = await listTransactions();
    return transactions.filter(transaction => transaction.sku === sku);
}
