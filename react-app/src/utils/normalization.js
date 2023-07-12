// root/react-app/src/utils/normalization.js

export const normalizeAll = (obj) => {
    obj = { ...obj };
    const normalized = { byId: {} };

    if (Object.keys(obj).length !== 1) {
        throw new Error("Cannot normalize object that doesn't have exactly one key");
    }

    const objType = Object.keys(obj)[0];
    // extract array from object
    const objArr = [...obj[objType]];
    const idList = makeIdList(objArr);

    objArr.forEach((obj) => {
        normalized.byId[obj.id] = {...obj};
    });
    normalized.allIds = idList;

    return normalized;
};

const makeIdList = (objArr) => {
    objArr.sort((objX, objY) => {
        return (objX.id - objY.id);
    });
    const idList = objArr.map((obj) => obj.id);
    return idList;
};
