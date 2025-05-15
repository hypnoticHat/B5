"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_storage_1 = require("../storage/user.storage");
class UserService {
    constructor() {
        this.storage = new user_storage_1.UserStorage();
    }
    list() {
        return this.storage.list();
    }
    get(id) {
        return this.storage.getById(id);
    }
    create(name, email) {
        var _a;
        const now = new Date().toISOString();
        const id = (((_a = this.storage.list().pop()) === null || _a === void 0 ? void 0 : _a.id) || 0) + 1;
        const user = { id, name, email, createdAt: now };
        this.storage.add(user);
        return user;
    }
    delete(id) {
        const exists = !!this.get(id);
        if (!exists)
            return false;
        this.storage.remove(id);
        return true;
    }
}
exports.UserService = UserService;
