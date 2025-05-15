"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const task_storage_1 = require("../storage/task.storage");
const user_storage_1 = require("../storage/user.storage");
class TaskService {
    constructor() {
        this.storage = new task_storage_1.TaskStorage();
        this.userStorage = new user_storage_1.UserStorage();
    }
    list() {
        return this.storage.list();
    }
    get(id) {
        return this.storage.getById(id);
    }
    create(data) {
        var _a;
        const now = new Date().toISOString();
        // Tạo id tự động
        const id = (((_a = this.storage.list().pop()) === null || _a === void 0 ? void 0 : _a.id) || 0) + 1;
        const task = {
            id,
            title: data.title,
            description: data.description,
            startDate: data.startDate,
            dueDate: data.dueDate,
            priority: data.priority || 'medium',
            status: 'pending',
            assignedUserIds: [],
            createdAt: now,
        };
        this.storage.add(task);
        return task;
    }
    update(id, updates) {
        const task = this.get(id);
        if (!task)
            return;
        const updated = Object.assign(Object.assign({}, task), updates);
        this.storage.update(updated);
        return updated;
    }
    delete(id) {
        const exists = !!this.get(id);
        if (!exists)
            return false;
        this.storage.remove(id);
        return true;
    }
    assign(taskId, userId) {
        const task = this.get(taskId);
        const user = this.userStorage.getById(userId);
        if (!task || !user)
            return false;
        if (!task.assignedUserIds.includes(userId)) {
            task.assignedUserIds.push(userId);
            this.storage.update(task);
        }
        return true;
    }
    unassign(taskId, userId) {
        const task = this.get(taskId);
        if (!task)
            return false;
        task.assignedUserIds = task.assignedUserIds.filter(u => u !== userId);
        this.storage.update(task);
        return true;
    }
    filterByStatus(status) {
        return this.list().filter(t => t.status === status);
    }
    filterByPriority(priority) {
        return this.list().filter(t => t.priority === priority);
    }
    search(keyword) {
        const kw = keyword.toLowerCase();
        return this.list().filter(t => {
            var _a, _b;
            return t.title.toLowerCase().includes(kw) ||
                ((_b = (_a = t.description) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(kw)) !== null && _b !== void 0 ? _b : false);
        });
    }
}
exports.TaskService = TaskService;
