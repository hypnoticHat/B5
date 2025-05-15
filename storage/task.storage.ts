import { JsonStorage } from './json.storage';
import { Task } from '../interfaces/task.interface';

export class TaskStorage extends JsonStorage<Task> {
  constructor() {
    super('tasks.json');
  }
}
