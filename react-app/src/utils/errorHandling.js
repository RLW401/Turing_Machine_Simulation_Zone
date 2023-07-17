// root/react-app/src/utils/errorHandling.js

// finds and returns errors in the supplied array which match the supplied keyword string
export const findErr = (errArr, errType) => {
    let foundErr = null;
    errArr.forEach((err) => {
        if (err.includes(errType)) {
            foundErr = (<p className='validation-error'>{err}</p>);
        }
    });
    return foundErr;
};
