/**
 * @file Product functions
 * @package stock-check
 * @author Ben Hawley
 */

import path from "path";
import {Product, Transaction} from "./common/types";
import {readJSONFile} from "./common/tools";
import {listTransactionsForSKU} from "./transactions";

/**
 * Path to the stocks.json file
 * In a final project, I would have this path defined in a config file
 */
export const stockPath: string = path.join(__dirname, "../../../", "data", "stock.json");

/**
 * List all sku products
 * @returns stock
 */
export async function listProducts(): Promise<Product[]> {
    const stock = await readJSONFile(stockPath).catch(e => {
        throw new Error(`Failed to read stock file. Reason: ${e.message}`)
    });
    return stock;
}

/**
 * Get product by sku code
 * @param sku
 * @returns product
 */
export async function getProduct(sku: string): Promise<Product> {
    const stock = await listProducts();

    // Search the stock for a product with a matching SKU
    const product = stock.find((prod: Product) => prod.sku === sku);

    // If we cannot find a product, we assume a stock of 0 for this SKU
    return product || {sku, stock: 0};
}

/**
 * Use our current stock and transactions list to find the current stock of a product
 * @param sku
 * @returns object containing the sku code and quantity
 */
export async function calculateCurrentStockLevel(sku: string): Promise<{sku: string, qty: number}> {
    // Get the associated product and transactions from the sku code
    const product = await getProduct(sku);
    const transactions: Transaction[] = await listTransactionsForSKU(sku);

    // With no transactions, we can assume the stock hasn't changed
    if (transactions.length === 0) {
        return {
            sku,
            qty: product.stock
        }
    }

    // Figure out whether each transaction quantity should add or subscract from the stock
    const quantities: number[] = transactions.map(transaction => {
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
    }
}
