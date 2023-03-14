export {}

declare global {
    // eslint-disable-next-line  @typescript-eslint/no-unused-vars
    interface Array<T> {
        sortEnumValuesByFrequency<T>(): T[];
        sortEnumValuesByFrequencyWithExclusion<T>(excludedValue: T): T[];
    }
}

Array.prototype.sortEnumValuesByFrequency = function<T>(this: T[]): T[] {
    const frequencyMap: Map<T, number> = new Map();

    this.forEach(value => {
        frequencyMap.set(value, (frequencyMap.get(value) || 0) + 1);
    });

    return this.sort((a, b) => {
        const aFrequency = frequencyMap.get(a) || 0;
        const bFrequency = frequencyMap.get(b) || 0;
        return bFrequency - aFrequency;
    });
};

Array.prototype.sortEnumValuesByFrequencyWithExclusion = function<T>(this: T[], excludedValue: T): T[] {
    const frequencyMap: Map<T, number> = new Map();

    this.forEach(value => {
        frequencyMap.set(value, (frequencyMap.get(value) || 0) + 1);
    });

    return this.sort((a, b) => {
        const aFrequency = frequencyMap.get(a) || 0;
        const bFrequency = frequencyMap.get(b) || 0;

        // If one of the values being compared is the excluded value, it should always come last.
        if (a === excludedValue) {
            return 1;
        } else if (b === excludedValue) {
            return -1;
        }

        // Sort by frequency, with higher frequencies coming first.
        return bFrequency - aFrequency;
    });
};
