/**
 * @file Application entry point to input SKU number to check stock
 * @package stock-check
 * @author Ben Hawley
 */

import {readUserInput} from "./common/tools";
import {calculateCurrentStockLevel} from "./products";

/**
 * Read SKU ID and calculate stock level for the corresponding product
 */
export default async function getCurrentStockLevel(): Promise<void> {

    // Prompt the user to input a SKU code
    const sku = await readUserInput("Please enter a SKU ID: ");

    // In a live application, I would use a logging library such as `winston` rather than `console`
    console.log(`Calculating current stock for SKU: ${sku}`);
    const currentStock = await calculateCurrentStockLevel(sku);

    console.log(`${currentStock.sku} current stock level: ${currentStock.qty}`);
}

getCurrentStockLevel();