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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("readline"));
const task_service_1 = require("./services/task.service");
const user_service_1 = require("./services/user.service");
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const taskSvc = new task_service_1.TaskService();
const userSvc = new user_service_1.UserService();
function question(q) {
    return new Promise(res => rl.question(q, ans => res(ans.trim())));
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('=== Task Manager CLI ===');
        console.log('Commands:');
        console.log('  list-tasks');
        console.log('  list-users');
        console.log('  add-task');
        console.log('  add-user');
        console.log('  update-task');
        console.log('  delete-task <id>');
        console.log('  delete-user <id>');
        console.log('  assign <taskId> <userId>');
        console.log('  unassign <taskId> <userId>');
        console.log('  filter-status <status>');
        console.log('  filter-priority <priority>');
        console.log('  search <keyword>');
        console.log('  exit');
        console.log('');
        while (true) {
            const line = yield question('> ');
            const [cmd, ...args] = line.split(' ');
            switch (cmd) {
                case 'list-tasks':
                    taskSvc.list().forEach(t => console.log(`[${t.id}] ${t.title} | ${t.status} | due:${t.dueDate || '–'} | prio:${t.priority} | assigned:${t.assignedUserIds.join(',') || 'none'}`));
                    break;
                case 'list-users':
                    userSvc.list().forEach(u => console.log(`[${u.id}] ${u.name} ${u.email ? `(${u.email})` : ''}`));
                    break;
                case 'add-task':
                    {
                        const title = yield question('Title: ');
                        const desc = yield question('Description: ');
                        const sd = yield question('Start date (YYYY-MM-DD): ');
                        const dd = yield question('Due date   (YYYY-MM-DD): ');
                        const prio = (yield question('Priority (low|medium|high): '));
                        const task = taskSvc.create({ title, description: desc || undefined, startDate: sd || undefined, dueDate: dd || undefined, priority: prio });
                        console.log('Created task:', task.id);
                    }
                    break;
                case 'add-user':
                    {
                        const name = yield question('Name: ');
                        const email = yield question('Email: ');
                        const user = userSvc.create(name, email || undefined);
                        console.log('Created user:', user.id);
                    }
                    break;
                case 'update-task':
                    {
                        const id = Number(args[0] || (yield question('Task ID: ')));
                        const field = yield question('Field to update (title|desc|status|dueDate|priority): ');
                        const val = yield question('New value: ');
                        const upd = {};
                        if (field === 'title')
                            upd.title = val;
                        if (field === 'desc')
                            upd.description = val;
                        if (field === 'status')
                            upd.status = val;
                        if (field === 'dueDate')
                            upd.dueDate = val;
                        if (field === 'priority')
                            upd.priority = val;
                        const updated = taskSvc.update(id, upd);
                        console.log(updated ? 'Updated.' : 'Not found.');
                    }
                    break;
                case 'delete-task':
                    if (taskSvc.delete(Number(args[0])))
                        console.log('Deleted task.');
                    else
                        console.log('Task not found.');
                    break;
                case 'delete-user':
                    if (userSvc.delete(Number(args[0])))
                        console.log('Deleted user.');
                    else
                        console.log('User not found.');
                    break;
                case 'assign':
                    if (taskSvc.assign(Number(args[0]), Number(args[1])))
                        console.log('Assigned.');
                    else
                        console.log('Failed to assign.');
                    break;
                case 'unassign':
                    if (taskSvc.unassign(Number(args[0]), Number(args[1])))
                        console.log('Unassigned.');
                    else
                        console.log('Failed to unassign.');
                    break;
                case 'filter-status':
                    taskSvc.filterByStatus(args[0]).forEach(t => console.log(`[${t.id}] ${t.title}`));
                    break;
                case 'filter-priority':
                    taskSvc.filterByPriority(args[0]).forEach(t => console.log(`[${t.id}] ${t.title}`));
                    break;
                case 'search':
                    taskSvc.search(args.join(' ')).forEach(t => console.log(`[${t.id}] ${t.title}`));
                    break;
                case 'exit':
                    rl.close();
                    return;
                default:
                    console.log('Unknown command.');
            }
        }
    });
}
main();
