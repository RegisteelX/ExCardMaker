export abstract class AbstractSingleton {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    private static instanceMap = new Map<new () => any, any>();

    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    public static getInstance(ctor: new () => any): any {
        let instance = this.instanceMap.get(ctor);
        if (!instance) {
            instance = new ctor();
            this.instanceMap.set(ctor, instance);
        }
        return instance;
    }
}
