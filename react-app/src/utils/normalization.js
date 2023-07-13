// root/react-app/src/utils/normalization.js

// Takes in an object with exactly one key whose value is
// an array of objects with id properties. Returns a normalized
// object with keys "allIds", "byId", and, optionally,
// "subObjects". The value of allIds is an array of
// integers extracted from the id properties of the
// top-level objects. The value of byId is an object whose
// keys are the integers from allIds and whose values are
// the corresponding objects. If some of those objects have
// keys whose values are arrays containing more objects
// with their own ids, these array are replaced with
// arrays of integers containing only the ids of the
// objects. If the optional "includeSubObj" parameter is
// true, then the returned object will have a "subObjects"
// key with arrays of normalized subObjects.
export const normalizeAll = (obj, { includeSubObj = true } = {}) => {
    obj = { ...obj };
    const normalized = { byId: {}, subObjects: {} };

    if (Object.keys(obj).length !== 1) {
        console.log(obj);
        throw new Error("Cannot normalize object that doesn't have exactly one key");
    }

    const objType = Object.keys(obj)[0];
    // extract array from object
    const objArr = [...obj[objType]];
    const idList = makeIdList(objArr);

    objArr.forEach((obj) => {
        // loop through the keys of each object
        Object.keys(obj).forEach((key) => {
            // if one of the values of the current object is an array
            if (Array.isArray(obj[key])) {
                const subObjArr = [ ...obj[key] ];
                const subIdList = makeIdList(subObjArr);

                // replace array of sub-objects with their ids
                obj[key] = subIdList;

                // normalize sub-objects and add to result
                if (includeSubObj && subObjArr.length) {
                    const normSubObj = normalizeAll({ [key]: subObjArr }, { includeSubObj: true });

                    // check to see if sub-objects of the current type have
                    // already been added
                    if (!normalized.subObjects[key]) {
                        normalized.subObjects[key] = { allIds: [], byId: {} };
                    }

                    // add objects by id
                    normalized.subObjects[key].byId = {
                        ...normalized.subObjects[key].byId,
                        ...normSubObj.byId
                    };

                    // combine ids while omitting duplicates
                    const combinedIds = mergeWithoutDuplicates(
                        normalized.subObjects[key].allIds,
                        normSubObj.allIds
                    );

                    normalized.subObjects[key].allIds = combinedIds;

                    // check to see if there are sub-sub-objects
                    if (normSubObj.subObjects) {
                        // check to see if subObject key already exists
                        if (!normalized.subObjects[key].subObjects) normalized.subObjects[key].subObjects = {};
                        // add sub-sub-objects
                        normalized.subObjects[key].subObjects = {
                            ...normalized.subObjects[key].subObjects,
                            ...normSubObj.subObjects
                        };
                    }

                }
            }
        });
        normalized.byId[obj.id] = {...obj};
    });
    normalized.allIds = idList;

    if (!Object.keys(normalized.subObjects).length) {
        delete normalized.subObjects;
    }

    return normalized;
};

// Takes in an array of objects assumed to have an id property
// and returns an array of ids sorted in ascending order
const makeIdList = (objArr) => {
    objArr.sort((objX, objY) => {
        if (objX.id && objY.id) {
            return (objX.id - objY.id);
        } else {
            throw new Error("Cannot make id list from objects without id property");
        }
    });
    const idList = objArr.map((obj) => obj.id);
    return idList;
};

// Merges two arrays of integers and sorts them in ascending
// order while omitting duplicate values. The arrays are
// assumed to contain no duplicates and be sorted in
// ascending order themselves.
const mergeWithoutDuplicates = (left, right) => {
    const merged = [];
    let leftIndex = 0;
    let rightIndex = 0;

    if (!left.length) return right;
    if (!right.length) return left;

    // ensure that the highest value is in the left array
    if (left[left.length - 1] < right[right.length - 1]) {
        [left, right] = [right, left];
    }

    // while there are still unchecked values in the right array
    while (rightIndex < right.length) {

        const lVal = left[leftIndex];
        const rVal = right[rightIndex];

        if (lVal < rVal) {
            merged.push(lVal);
            leftIndex++;
        } else if (lVal > rVal) {
            merged.push(rVal);
            rightIndex++;
        } else {
            merged.push(lVal);
            leftIndex++;
            rightIndex++;
        }
    }

    // add the remaining numbers, if any
    for (let i = leftIndex; i < left.length; i++) {
        merged.push(left[i]);
    }

    return merged;
};
