import { JsonStorage } from './json.storage';
import { User } from '../interfaces/user.interface';

export class UserStorage extends JsonStorage<User> {
  constructor() {
    super('users.json');
  }
}
