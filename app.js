import express from 'express';
import readingsRoutes from './routes/readingsRouter.js';
import ReadingsRepository from './repositories/ReadingsRepository.js';

const app = express();

app.use(express.json());

app.use('/readings', readingsRoutes);

app.get('/sensor/', async (req, res) => {
  const readings = await ReadingsRepository.getAll();
  res.status(200).send(readings);
});

const port = process.env.port || 3000;
app.listen(port, () => console.log(`Server running at port ${port}`));
