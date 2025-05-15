// src/storage/json.storage.ts
import * as fs from 'fs';
import * as path from 'path';

export abstract class JsonStorage<T extends { id: number }> {
  protected items: T[] = [];
  private fullPath: string;

  constructor(fileName: string) {
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
    } catch {
      this.items = [];
    }
  }

  list(): T[] {
    return this.items;
  }

  getById(id: number): T | undefined {
    return this.items.find(i => i.id === id);
  }

  add(item: T): void {
    this.items.push(item);
    this.save();
  }

  update(item: T): void {
    this.items = this.items.map(i => i.id === item.id ? item : i);
    this.save();
  }

  remove(id: number): void {
    this.items = this.items.filter(i => i.id !== id);
    this.save();
  }

  private save(): void {
    fs.writeFileSync(this.fullPath, JSON.stringify(this.items, null, 2), 'utf-8');
  }
}
