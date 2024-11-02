import cluster from "cluster";
import os from "os";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const availableCpuCount = os.availableParallelism();

console.log(`The total number of CPUs is ${availableCpuCount}`);
console.log(`Primary pid=${process.pid}`);
cluster.setupPrimary({
  exec: __dirname + "/app.js",
});

for (let i = 0; i < availableCpuCount; i++) {
  cluster.fork();
}

cluster.on("exit", (worker, code, signal) => {
  console.log(`worker ${worker.process.pid} has been terminated`);
  console.log("Starting another worker thread");
  cluster.fork();
});
