export default function deepClone(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    const clonedObj = Array.isArray(obj) ? [] : {};
    for (const key in obj) {
        const value = obj[key];
        clonedObj[key] = deepClone(value);
    }
    return clonedObj;
}