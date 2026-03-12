interface IQueue<T> {
  push(item: T): void;
  pop(): T | undefined;
  peek(): T | undefined;
  isEmpty(): boolean;
  size(): number;
  clear(): void;
}

class Queue<T> implements IQueue<T> {
  private items: T[];
  private head: number;
  private tail: number;

  constructor(initialItems: T[] = []) {
    this.items = [...initialItems];
    this.head = 0;
    this.tail = initialItems.length;
  }

  push(item: T): void {
    this.items[this.tail] = item;
    this.tail += 1;
  }

  pop(): T | undefined {
    if (this.isEmpty()) return undefined;

    const item = this.items[this.head];
    this.head += 1;

    if (this.head > 50 && this.head * 2 > this.tail) {
      this.items = this.items.slice(this.head, this.tail);
      this.tail = this.tail - this.head;
      this.head = 0;
    }

    return item;
  }

  peek(): T | undefined {
    if (this.isEmpty()) return undefined;
    return this.items[this.head];
  }

  isEmpty(): boolean {
    return this.tail === this.head;
  }

  size(): number {
    return this.tail - this.head;
  }

  clear(): void {
    this.items = [];
    this.head = 0;
    this.tail = 0;
  }
}

export default Queue;
