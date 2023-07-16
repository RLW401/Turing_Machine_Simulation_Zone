const renderTape = ({tapeStr}) => {
    const centralSquareIndex = Math.floor(tapeStr.length / 2);
    const squares = [];
    if (((tapeStr.length % 2) === 0) || tapeStr.length < 5) {
        throw new Error("Error: tapeStr.length must be an odd integer 5 or greater.");
    }

    for (let i = 0; i < tapeStr.length; i++) {
        const isCentral = (i === centralSquareIndex);
        squares.push(
        <div key={i} className={`${isCentral ? "central " : ""}square`}>
            <p>{tapeStr[i]}</p>
        </div>
        );
    }
    return (
        <div className="tape">
            {squares}
        </div>
    );
};

export const genTapeStr = (numSquares, headPos, blankSymbol, currentTape) => {
    let tapeStr = "";
    let relIndex = (headPos - Math.floor(numSquares / 2));
    if (((numSquares % 2) === 0) || numSquares < 5) {
        throw new Error("Error: numSquares must be an odd integer 5 or greater.");
    }
    if (!currentTape) currentTape = blankSymbol;
    if ((headPos >= currentTape.length) || (headPos < 0)) {
        throw new Error("Error: Head position must be non-negative integer less than the length of the tape.")
    }
    for (let i = 0; i < numSquares; i++) {
        let currentSymbol = blankSymbol;
        // if the square of tape to be displayed is covered by a symbol of currentTape
        if ((relIndex >= 0) && (relIndex < currentTape.length)) {
            // display that symbol instead of the blank
            currentSymbol = currentTape[relIndex]
        }
        tapeStr += currentSymbol
        relIndex++;
    }
    return tapeStr;
};

export default renderTape;
