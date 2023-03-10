export abstract class AbstractSingleton {
    private static instanceMap = new Map<new () => any, any>();

    public static getInstance(ctor: new () => any): any {
        let instance = this.instanceMap.get(ctor);
        if (!instance) {
            instance = new ctor();
            this.instanceMap.set(ctor, instance);
        }
        return instance;
    }
}
