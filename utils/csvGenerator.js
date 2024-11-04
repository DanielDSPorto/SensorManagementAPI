import fs from "fs";
import { format } from "date-fns";

const equipments = [
  "EQ-12495",
  "EQ-12496",
  "EQ-12497",
  "EQ-12498",
  "EQ-12499",
  "EQ-12500",
  "EQ-12501",
  "EQ-12502",
  "EQ-12503",
  "EQ-12504",
  "EQ-12505",
];
const startDate = new Date();
const fileName = "equipamentos_500_linhas.csv";

function generateRandomValue(min, max) {
  return (Math.random() * (max - min) + min).toFixed(2);
}

function generateTimestamp(baseDate, intervalMinutes, index) {
  const date = new Date(baseDate);
  date.setMinutes(date.getMinutes() - intervalMinutes * index);
  return format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
}

const rows = [];
for (let i = 500; i > 0; i--) {
  const equipment = equipments[Math.floor(Math.random() * equipments.length)];
  const timestamp = generateTimestamp(startDate, 30, i);
  const value = generateRandomValue(60.0, 90.0);
  rows.push([equipment, timestamp, value]);
}

const csvHeader = "equipmentId;timestamp;value\n";
const csvContent = rows.map((row) => row.join(";")).join("\n");

fs.writeFile(fileName, csvHeader + csvContent, (err) => {
  if (err) {
    console.error("Erro ao criar o arquivo CSV:", err);
  } else {
    console.log(`CSV '${fileName}' criado com sucesso!`);
  }
});
