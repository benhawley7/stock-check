/**
 * @file Exports common types, interfaces and enums used across the project
 * @package stock-check
 * @author Ben Hawley
 */

/**
 * Defines the types of transactions
 * @enum
 */
export enum TransactionType {
    order = "order",
    refund = "refund"
}

/**
 * Defines structure for a order/refund transaction on a SKU product
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
