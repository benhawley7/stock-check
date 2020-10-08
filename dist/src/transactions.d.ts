/**
 * @file Transaction functions
 * @package stock-check
 * @author Ben Hawley
 */
import { Transaction } from "./common/types";
/**
 * Path to the transactions.json file
 */
export declare const transactionsPath: string;
/**
 * List all transactions
 */
export declare function listTransactions(): Promise<Transaction[]>;
/**
 * List all transactions for a supplied SKU code
 */
export declare function listTransactionsForSKU(sku: string): Promise<Transaction[]>;
