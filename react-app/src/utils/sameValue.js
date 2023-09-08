// Takes in an array of objects and a string.
// Returns false if the list is empty, the string
// is not a key of all of the objects, or not all
// of the objects have the same value for that key,
// otherwise returns an object with the key-value pair.
const sameValue = (objList, key) => {
    if (!(objList instanceof Array) || !objList.length) {
        return false;
    }
    const firstObj = objList[0]
    if (!firstObj.hasOwnProperty(key)) {
        return false
    }
    const value = firstObj[key]

    for (let i = 1; i < objList.length; i++) {
        const currentObj = objList[i]
        if (!currentObj.hasOwnProperty(key) || currentObj[key] !== value) {
            return false;
        }
    }
    return { [key]: value };
};

export default sameValue;
