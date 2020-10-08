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
    // Prompt the user to input a SKU code and attempt to calculate the its stock level
    const sku = await readUserInput("Please enter a SKU ID: ");
    const currentStock = await calculateCurrentStockLevel(sku);

    // In a live application, I would use a logging library such as `winston` rather than `console`
    console.log(`SKU: ${currentStock.sku} current stock level: ${currentStock.qty}`);
}

getCurrentStockLevel();