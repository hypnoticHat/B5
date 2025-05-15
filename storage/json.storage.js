"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonStorage = void 0;
// src/storage/json.storage.ts
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class JsonStorage {
    constructor(fileName) {
        this.items = [];
        // Thư mục data
        const dataDir = path.resolve(__dirname, '..', 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        // File JSON
        this.fullPath = path.resolve(dataDir, fileName);
        if (!fs.existsSync(this.fullPath)) {
            fs.writeFileSync(this.fullPath, '[]', 'utf-8');
        }
        // Đọc dữ liệu
        const raw = fs.readFileSync(this.fullPath, 'utf-8');
        try {
            this.items = JSON.parse(raw);
        }
        catch (_a) {
            this.items = [];
        }
    }
    list() {
        return this.items;
    }
    getById(id) {
        return this.items.find(i => i.id === id);
    }
    add(item) {
        this.items.push(item);
        this.save();
    }
    update(item) {
        this.items = this.items.map(i => i.id === item.id ? item : i);
        this.save();
    }
    remove(id) {
        this.items = this.items.filter(i => i.id !== id);
        this.save();
    }
    save() {
        fs.writeFileSync(this.fullPath, JSON.stringify(this.items, null, 2), 'utf-8');
    }
}
exports.JsonStorage = JsonStorage;
