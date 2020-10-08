/**
 * @file Exports common types, interfaces and constants used across the project
 * @package stock-check
 * @author Ben Hawley
 */
/**
 * Defines the types of transactions
 * @enum
 */
export declare enum TransactionType {
    order = "order",
    refund = "refund"
}
/**
 * Defines structure for a transaction on a SKU product for an order or refund
 * @interface
 */
export interface Transaction {
    sku: string;
    type: TransactionType;
    qty: number;
}
/**
 * Defines structure for a SKU product
 * @interface
 */
export interface Product {
    sku: string;
    stock: number;
}
