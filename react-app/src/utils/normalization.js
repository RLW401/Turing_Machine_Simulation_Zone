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
export const normalizeAll = (obj, { includeSubObj = false } = {}) => {
    obj = { ...obj };
    const normalized = { byId: {} };

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
                    normalized.subObjects = {};
                    const normSubObj = {};
                    normSubObj[key] = subObjArr;
                    normalized.subObjects[key] = normalizeAll(normSubObj, { includeSubObj: includeSubObj });
                }
            }
        });
        normalized.byId[obj.id] = {...obj};
    });
    normalized.allIds = idList;

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
