import * as readline from 'readline';
import { TaskService } from './services/task.service';
import { UserService } from './services/user.service';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const taskSvc = new TaskService();
const userSvc = new UserService();

function question(q: string): Promise<string> {
  return new Promise(res => rl.question(q, ans => res(ans.trim())));
}

async function main() {
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
    const line = await question('> ');
    const [cmd, ...args] = line.split(' ');

    switch (cmd) {
      case 'list-tasks':
        taskSvc.list().forEach(t =>
          console.log(`[${t.id}] ${t.title} | ${t.status} | due:${t.dueDate || '–'} | prio:${t.priority} | assigned:${t.assignedUserIds.join(',')||'none'}`)
        );
        break;

      case 'list-users':
        userSvc.list().forEach(u =>
          console.log(`[${u.id}] ${u.name} ${u.email ? `(${u.email})` : ''}`)
        );
        break;

      case 'add-task':
        {
          const title = await question('Title: ');
          const desc  = await question('Description: ');
          const sd    = await question('Start date (YYYY-MM-DD): ');
          const dd    = await question('Due date   (YYYY-MM-DD): ');
          const prio  = (await question('Priority (low|medium|high): ')) as any;
          const task = taskSvc.create({ title, description: desc || undefined, startDate: sd||undefined, dueDate: dd||undefined, priority: prio });
          console.log('Created task:', task.id);
        }
        break;

      case 'add-user':
        {
          const name = await question('Name: ');
          const email= await question('Email: ');
          const user = userSvc.create(name, email || undefined);
          console.log('Created user:', user.id);
        }
        break;

      case 'update-task':
        {
          const id    = Number(args[0] || await question('Task ID: '));
          const field = await question('Field to update (title|desc|status|dueDate|priority): ');
          const val   = await question('New value: ');
          const upd: any = {};
          if (field === 'title') upd.title = val;
          if (field === 'desc')  upd.description = val;
          if (field === 'status')upd.status = val as any;
          if (field === 'dueDate')upd.dueDate = val;
          if (field === 'priority')upd.priority = val as any;
          const updated = taskSvc.update(id, upd);
          console.log(updated ? 'Updated.' : 'Not found.');
        }
        break;

      case 'delete-task':
        if (taskSvc.delete(Number(args[0]))) console.log('Deleted task.');
        else console.log('Task not found.');
        break;

      case 'delete-user':
        if (userSvc.delete(Number(args[0]))) console.log('Deleted user.');
        else console.log('User not found.');
        break;

      case 'assign':
        if (taskSvc.assign(Number(args[0]), Number(args[1]))) console.log('Assigned.');
        else console.log('Failed to assign.');
        break;

      case 'unassign':
        if (taskSvc.unassign(Number(args[0]), Number(args[1]))) console.log('Unassigned.');
        else console.log('Failed to unassign.');
        break;

      case 'filter-status':
        taskSvc.filterByStatus(args[0] as any).forEach(t => console.log(`[${t.id}] ${t.title}`));
        break;

      case 'filter-priority':
        taskSvc.filterByPriority(args[0] as any).forEach(t => console.log(`[${t.id}] ${t.title}`));
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
}

main();
