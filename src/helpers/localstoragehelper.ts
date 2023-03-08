export class LocalStorageHelper<T> {
    private readonly key: string;

    constructor(key: string) {
        this.key = key;
    }

    public set(obj: T): void {
        const serialized = JSON.stringify(obj);
        localStorage.setItem(this.key, serialized);
    }

    public get(): T | null {
        const serialized = localStorage.getItem(this.key);
        if (serialized === null) {
            return null;
        }
        return JSON.parse(serialized) as T;
    }
}
