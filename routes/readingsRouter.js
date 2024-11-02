import { Router } from "express";
import {
  getAllByEquipmentId,
  insertSensorReadingsData,
} from "../services/readingsService.js";

const router = Router();

router.get("/:equipmentId", async (req, res) => {
  const { equipmentId } = req.params;
  const readings = await getAllByEquipmentId(equipmentId);
  res.status(200).send(readings);
});

router.post("/", async (req, res) => {
  const sensorReadingObj = req.body;
  const id = await insertSensorReadingsData(sensorReadingObj);
  res.status(200).json(id);
});

router.put("/batch-update", (req, res) => {
  res.status(200).send("CSV recebido");
});

export default router;
