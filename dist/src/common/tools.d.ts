/**
 * @file Exports common tools used across the project
 * @package stock-check
 * @author Ben Hawley
 */
/**
 * Asynchronously reads and parses a JSON file from an absolute path
 * @param path absolute path to json file
 * @returns json
 */
export declare function readJSONFile(path: string): Promise<any>;
/**
 * Use readline to take terminal input and then close the session
 * @param prompt prompt for user
 * @returns input
 */
export declare function readUserInput(prompt: string): Promise<string>;
