
export interface JSONable<T> {
    dejson(input: Object) : T;
    rejson() : Object;
}


/**
 * Checks an item for a property.
 * 
 * @param item The item to check.
 * @param name The name of the key to check.
 * @param default_value The default value to return if the key @c param is not found.
 * @returns The value found at @c name or the default value if the key did not exist.
 */
export function getProperty(item : Object, name : string, default_value : string | number | boolean) {
    if (! item.hasOwnProperty(name)) {
        return default_value;
    }
    return item[name as keyof typeof item]
}
