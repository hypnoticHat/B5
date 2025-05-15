"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskStorage = void 0;
const json_storage_1 = require("./json.storage");
class TaskStorage extends json_storage_1.JsonStorage {
    constructor() {
        super('tasks.json');
    }
}
exports.TaskStorage = TaskStorage;
