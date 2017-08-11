
export const convertToConmaFmt = (str) => String(str).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');