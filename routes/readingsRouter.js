import { Router } from 'express';
import { getAllByEquipmentId } from '../services/readingsService.js';

const router = Router();

router.get('/:equipmentId', async (req, res) => {
  const { equipmentId } = req.params;
  const readings = await getAllByEquipmentId(equipmentId);
  res.status(200).send(readings);
});

router.post('/', (req, res) => {
  res.status(200).send('Dados enviados');
});

router.put('/batch-update', (req, res) => {
  res.status(200).send('CSV recebido');
});

export default router;
