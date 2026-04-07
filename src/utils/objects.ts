export function mapObject<T,U>(object: Record<string,T>, callback = (item: T, _: string): U|T => item):(U|T)[]{
    return Object.keys(object).map(key=> callback(object[key],key))
}