import express from 'express';
import { getPaymentCategory } from './getPaymentCategory.js';

const PORT = 3000;

const app = express();

app.use(express.json());

app.post('/api/payment/category', async (req, res) => {
  const serviceDescription = req.body?.serviceDescription;

  if (typeof serviceDescription !== 'string') {
    res.status(400).send();
    return;
  }

  const category = await getPaymentCategory(serviceDescription);

  res.send(JSON.stringify(category));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
