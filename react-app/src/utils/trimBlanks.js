export const trimBlanks = (str, headPos, blankSymbol, minLength = 1) => {
    const result = {};
    // reverse string to remove trailing blanks
    let newString = str.split('').reverse().join('');
    // determine head position in reversed string
    const reverseHeadPos = (str.length - (headPos + 1));
    const trailingGone = trimLeadingBlanks(newString, reverseHeadPos, blankSymbol, minLength);
    // store number of trailing blanks removed
    result.trailingBlanks = trailingGone[1];
    // reverse string again to remove leading blanks
    newString = trailingGone[0].split('').reverse().join('');
    const leadingGone = trimLeadingBlanks(newString, headPos, blankSymbol, minLength);
    result.leadingBlanks = leadingGone[1];
    newString = leadingGone[0];
    result.newString = newString;

    return result;
};


const trimLeadingBlanks = (str, headPos, blankSymbol, minLength = 1) => {
    let leadingBlanks = 0;
    let nonBlankFound = false;
    let index = 0;

    // while(!nonBlankFound && (leadingBlanks < (str.length - minLength))) {
    while(!nonBlankFound && (leadingBlanks < (headPos))) {
        const symbol = str[index];
        if (symbol !== blankSymbol) {
            nonBlankFound = true;
        } else {
            leadingBlanks++;
        }
        index++;
    }
    return [str.slice(leadingBlanks), leadingBlanks];
};
