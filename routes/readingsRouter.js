import { Router } from "express";
import {
  getAllByEquipmentId,
  insertSensorReadingsData,
  getAvgValuesForWindowDuration,
  insertReadingsFromCSVFile,
} from "../services/readingsService.js";
import fileUpload from "express-fileupload";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = Router();

router.get("/:equipmentId", async (req, res) => {
  const { equipmentId } = req.params;
  const readings = await getAllByEquipmentId(equipmentId);
  res.status(200).send(readings);
});

router.get("/average-values/:windowDurationInDays", async (req, res) => {
  const { windowDurationInDays } = req.params;
  console.log("window duration in days: ", windowDurationInDays);
  const readings = await getAvgValuesForWindowDuration(windowDurationInDays);
  res.status(200).send(readings);
});

router.post("/", async (req, res) => {
  const sensorReadingObj = req.body;
  console.log(sensorReadingObj);
  const id = await insertSensorReadingsData(sensorReadingObj);
  res.status(200).json(id);
});

router.use(fileUpload());

router.post("/batch-insert", async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }
  //Os arquivos viriam de um elemento input com o atributo name='uploadedFile'
  try {
    const uploadedFile = req.files.uploadedFile;
    console.log(uploadedFile.name);
    const uploadPath = __dirname + (process.env.UPLOADED_FILES_PATH || "..\\");

    uploadedFile.mv(uploadPath + uploadedFile.name, async (err) => {
      if (err) {
        throw err;
      }
      await insertReadingsFromCSVFile(uploadPath, uploadedFile.name);
      res.status(200).send("File Uploaded");
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

export default router;
