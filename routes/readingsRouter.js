import { Router } from "express";
import {
  getAllByEquipmentId,
  insertSensorReadingsData,
  getAvgValuesForWindowDuration,
  insertReadingsFromCSVFile,
  getAllEquipmentIds,
} from "../services/readingsService.js";
import fileUpload from "express-fileupload";
import { fileURLToPath } from "url";
import { dirname } from "path";
import {
  validateSensorDataInsertionObj,
  validateWindowDurationProvided,
} from "./inputValidation.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = Router();

router.get("/:equipmentId", async (req, res) => {
  try {
    const { equipmentId } = req.params;
    const readings = await getAllByEquipmentId(equipmentId);
    res.status(200).send(readings);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/", async (req, res) => {
  try {
    const equipmentIds = await getAllEquipmentIds();
    res.status(200).send(equipmentIds);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/average-values/:windowDurationInDays", async (req, res) => {
  try {
    const { windowDurationInDays } = req.params;
    const { error } = validateWindowDurationProvided(windowDurationInDays);
    if (error) {
      res.status(400).send(error.details[0]);
    }
    const readings = await getAvgValuesForWindowDuration(windowDurationInDays);
    res.status(200).send(readings);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const sensorReadingObj = req.body;
    const { error } = validateSensorDataInsertionObj(sensorReadingObj);
    if (error) {
      res.status(400).send(error.details[0]);
      return;
    }
    const id = await insertSensorReadingsData(sensorReadingObj);
    res.status(200).json(id);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.use(fileUpload());

router.post("/batch-insert", async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send("No files were uploaded.");
    return;
  }
  //Os arquivos viriam de um elemento input com o atributo name='uploadedFile'
  try {
    const uploadedFile = req.files.uploadedFile;
    const uploadPath = __dirname + (process.env.UPLOADED_FILES_PATH || "..\\");

    uploadedFile.mv(uploadPath + uploadedFile.name, async (err) => {
      if (err) {
        throw err;
      }
      await insertReadingsFromCSVFile(uploadPath, uploadedFile.name);
      res.status(200).send("File Uploaded");
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;
