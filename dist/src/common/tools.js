"use strict";
/**
 * @file Exports common tools used across the project
 * @package stock-check
 * @author Ben Hawley
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readUserInput = exports.readJSONFile = void 0;
const fs_1 = __importDefault(require("fs"));
const util_1 = __importDefault(require("util"));
const readline_1 = __importDefault(require("readline"));
// Create an Async version of readfile
const readFile = util_1.default.promisify(fs_1.default.readFile);
/**
 * Asynchronously reads and parses a JSON file from an absolute path
 * @param path absolute path to json file
 * @returns json
 */
function readJSONFile(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileBuf = yield readFile(path);
        const fileStr = fileBuf.toString();
        return JSON.parse(fileStr);
    });
}
exports.readJSONFile = readJSONFile;
/**
 * Use readline to take terminal input and then close the session
 * @param prompt prompt for user
 * @returns input
 */
function readUserInput(prompt) {
    return new Promise(resolve => {
        const rl = readline_1.default.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question(prompt, (input) => {
            rl.close();
            resolve(input);
        });
    });
}
exports.readUserInput = readUserInput;
//# sourceMappingURL=tools.js.map