"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStorage = void 0;
const json_storage_1 = require("./json.storage");
class UserStorage extends json_storage_1.JsonStorage {
    constructor() {
        super('users.json');
    }
}
exports.UserStorage = UserStorage;
