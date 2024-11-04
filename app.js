import express from "express";
import readingsRoutes from "./routes/readingsRouter.js";
import ReadingsRepository from "./repositories/ReadingsRepository.js";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("tiny"));

app.use("/readings", readingsRoutes);

const port = process.env.port || 3000;
app.listen(port, () => console.log(`Server running at port ${port}`));
