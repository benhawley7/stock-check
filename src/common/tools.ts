/**
 * @file Exports common tools used across the project
 * @package stock-check
 * @author Ben Hawley
 */

import fs from "fs";
import util from "util";
import readline from "readline";

// Create an Async version of readfile
const readFile = util.promisify(fs.readFile);

/**
 * Asynchronously reads and parses a JSON file from an absolute path
 * @param path absolute path to json file
 * @returns json
 */
export async function readJSONFile(path: string): Promise<any> {
    const fileBuf: Buffer = await readFile(path);
    const fileStr: string = fileBuf.toString();
    return JSON.parse(fileStr);
}

/**
 * Use readline to take terminal input and then close the session
 * @param prompt prompt text for user
 * @returns input
 */
export function readUserInput(prompt: string): Promise<string> {
    return new Promise(resolve => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question(prompt, (input) => {
            rl.close();
            resolve(input);
        });
    });
}
