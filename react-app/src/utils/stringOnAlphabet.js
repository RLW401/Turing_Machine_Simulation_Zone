// root/react-app/src/utils/stringOnAlphabet.js
export const stringOnAlphabet = (string, alphabet) => {
    for (let i = 0; i < string.length; i++) {
        let match = false;
        for (let j = 0; j < alphabet.length; j++) {
            if (string[i] === alphabet[j]) {
                match = true;
            }
        }
        if (!match) return false;
    }
    return true;
};
