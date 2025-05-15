import { User } from '../interfaces/user.interface';
import { UserStorage } from '../storage/user.storage';

export class UserService {
  private storage = new UserStorage();

  list(): User[] {
    return this.storage.list();
  }

  get(id: number): User | undefined {
    return this.storage.getById(id);
  }

  create(name: string, email?: string): User {
    const now = new Date().toISOString();
    const id = (this.storage.list().pop()?.id || 0) + 1;
    const user: User = { id, name, email, createdAt: now };
    this.storage.add(user);
    return user;
  }

  delete(id: number): boolean {
    const exists = !!this.get(id);
    if (!exists) return false;
    this.storage.remove(id);
    return true;
  }
}
