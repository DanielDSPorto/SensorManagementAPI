export const camelToSnakeCase = (str) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

export const stringIsNullOrEmpty = (str) => {
  return str === undefined || str === null || str === "";
};
