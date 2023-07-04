import cors from 'cors';
import express from 'express';

import { getHubSpotClient } from './getHubSpotClient.js';

const PORT = 3000;

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/lead', async (req, res) => {
  const email = req.body?.email;

  if (typeof email !== 'string' || email.length === 0) {
    res.status(400).send();
    return;
  }

  const hubSpot = await getHubSpotClient();

  hubSpot.crm.contacts.basicApi.create({
    properties: {
      email,
    },
    associations: [],
  });

  console.log(`Created lead: ${email}`);

  res.status(200).send();
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
