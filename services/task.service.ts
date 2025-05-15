import { Task, Priority, Status } from '../interfaces/task.interface';
import { TaskStorage } from '../storage/task.storage';
import { UserStorage } from '../storage/user.storage';
import { User } from '../interfaces/user.interface';

export class TaskService {
  private storage = new TaskStorage();
  private userStorage = new UserStorage();

  list(): Task[] {
    return this.storage.list();
  }

  get(id: number): Task | undefined {
    return this.storage.getById(id);
  }

  create(data: {
    title: string;
    description?: string;
    startDate?: string;
    dueDate?: string;
    priority?: Priority;
  }): Task {
    const now = new Date().toISOString();
    // Tạo id tự động
    const id = (this.storage.list().pop()?.id || 0) + 1;
    const task: Task = {
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

  update(id: number, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Task | undefined {
    const task = this.get(id);
    if (!task) return;
    const updated = { ...task, ...updates };
    this.storage.update(updated);
    return updated;
  }

  delete(id: number): boolean {
    const exists = !!this.get(id);
    if (!exists) return false;
    this.storage.remove(id);
    return true;
  }

  assign(taskId: number, userId: number): boolean {
    const task = this.get(taskId);
    const user = this.userStorage.getById(userId);
    if (!task || !user) return false;
    if (!task.assignedUserIds.includes(userId)) {
      task.assignedUserIds.push(userId);
      this.storage.update(task);
    }
    return true;
  }

  unassign(taskId: number, userId: number): boolean {
    const task = this.get(taskId);
    if (!task) return false;
    task.assignedUserIds = task.assignedUserIds.filter(u => u !== userId);
    this.storage.update(task);
    return true;
  }

  filterByStatus(status: Status): Task[] {
    return this.list().filter(t => t.status === status);
  }

  filterByPriority(priority: Priority): Task[] {
    return this.list().filter(t => t.priority === priority);
  }

  search(keyword: string): Task[] {
    const kw = keyword.toLowerCase();
    return this.list().filter(t =>
      t.title.toLowerCase().includes(kw) ||
      (t.description?.toLowerCase().includes(kw) ?? false)
    );
  }
}
