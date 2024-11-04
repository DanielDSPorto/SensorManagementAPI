import { parse } from "csv-parse";
import { open } from "node:fs/promises";
import { stringIsNullOrEmpty } from "./utilFunctions.js";

const parseCSV = async (pathToFile, filename) => {
  if (stringIsNullOrEmpty(pathToFile) || stringIsNullOrEmpty(filename)) {
    throw new Error("Both file name and file path must be provided");
  }
  const csvLines = [];
  console.log("bati aqui");
  const fs = await open(pathToFile + filename);

  return new Promise((resolve, reject) => {
    fs.createReadStream(pathToFile + filename)
      .pipe(parse({ delimiter: ";" }))
      .on("data", (dataLine) => csvLines.push(dataLine))
      .on("end", () => {
        resolve(csvLines);
      })
      .on("error", (error) => reject(error));
  });
};

export default parseCSV;
