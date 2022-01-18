// capital letter method
exports.capitalLetter = (str) => {
    return String(str).replace(/(?:^|\s)\w/, (c) => c.toUpperCase());
};
