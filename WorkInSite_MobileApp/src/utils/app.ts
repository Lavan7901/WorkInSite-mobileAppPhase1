// const displayWithSegments = (string: string, segmentLength: number, separator: string = " "): string => {
//   const regex = new RegExp(`.{1,${segmentLength}}`, "g");
//   return string.match(regex)?.join(separator) || string;
// };

// export { displayWithSegments };

//2

const displayWithSegments = (
  values: any,
  segmentLength: number,
  separator: string = ' ',
): string => {
  if (typeof values === 'object' && values !== null) {
    const key = Object.keys(values)[0];
    values = values[key];
  }
  if (typeof values !== 'string') {
    values = String(values);
  }
  const regex = new RegExp(`.{1,${segmentLength}}`, 'g');
  return values.match(regex)?.join(separator) || values;
};

export { displayWithSegments };
