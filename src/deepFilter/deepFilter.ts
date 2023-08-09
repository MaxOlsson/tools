export const deepFilter = <T>(collection: T[], searchKey: string, searchFields: string[]): T[] => {
    if (!collection?.length || searchKey.trim().length === 0) {
        return [];
    }

    const filterResults = <T>(collection: T[], searchKey: string, searchFields: string[]): T[] => {
        const res = [];
        for (let i in collection) {
            for (let j in searchFields) {
                if (deepMatch(collection[i], searchKey, searchFields[j])) {
                    res.push(collection[i]);
                    break;
                }
            }
        }
        return res;
    };

    const deepMatch = <T>(obj: T | any, searchKey: string, field: any): T => {
        const [current, ...next] = Array.isArray(field) ? field : field.split(".");
        if (next.length > 0 || (Array.isArray(next) && next?.length > 0)) {
            return deepMatch(obj[current], searchKey, next);
        }
        return iterate(obj, current, searchKey);
    };

    const iterate = <T>(obj: T | any, searchField: string, searchKey: string) => {
        if (!Array.isArray(obj) && typeof obj[searchField] !== "object" && `${obj[searchField]}`.toLowerCase().includes(searchKey.toLowerCase())) {
            return obj;
        }

        if (!Array.isArray(obj) && typeof obj[searchField] === "object") {
            iterate(obj[searchField], searchField, searchKey);
        }

        if (Array.isArray(obj)) {
            return obj.find((entry) => `${entry[searchField]}`.toLowerCase().includes(searchKey.toLowerCase()));
        }
    };

    return filterResults(collection, searchKey, searchFields);
};
