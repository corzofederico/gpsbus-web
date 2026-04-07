
export function notNull<T>(item: T | null | undefined): item is T {
    return item != null
}

declare global {
    interface Array<T> {
        distinct<U>(callbackfn: (value: T, index: number) => U): T[];
        filterNotNull<U extends T>(): U[];
        mapNotNull<U>(callbackfn: (value: T|null|undefined, index: number) => U|null|undefined): U[];
    }
}

Array.prototype.distinct = function <T, U>(this: T[], callbackfn: (value: T, index: number) => U): T[] {
    return this.reduce<T[]>((acc, item, i) => {
        if (!acc.some((accItem) => callbackfn(accItem,i ) === callbackfn(item, i))) {
            acc.push(item);
        }
        return acc;
    }, []);
};

Array.prototype.mapNotNull = function <T,U>(this: (T|null|undefined)[], callbackfn: (value: T|null|undefined, index: number) => U|null|undefined): U[] {
    return this.map(callbackfn).filterNotNull();
};
Array.prototype.filterNotNull = function <T>(this: (T|null|undefined)[]): T[] {
    return this.filter(notNull);
};

export function asArrayOrNull(value: unknown): any[] | null {
    if (value == null || value == undefined || !Array.isArray(value)) return null
    return value
}