/**
 * @file Product functions
 * @package stock-check
 * @author Ben Hawley
 */
import { Product } from "./common/types";
/**
 * Path to the stocks.json file
 * In a final project, I would have this path defined in a config file
 */
export declare const stockPath: string;
/**
 * List all sku products
 * @returns stock
 */
export declare function listProducts(): Promise<Product[]>;
/**
 * Get product by sku code
 * @param sku
 * @returns product
 */
export declare function getProduct(sku: string): Promise<Product>;
/**
 * Use our current stock and transactions list to find the current stock of a product
 * @param sku
 * @returns object containing the sku code and quantity
 */
export declare function calculateCurrentStockLevel(sku: string): Promise<{
    sku: string;
    qty: number;
}>;
