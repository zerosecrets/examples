import express from 'express';
import { fetchSecrets } from './fetchSecrets.js';
import { authorizeGmail, queryNewMessages, watchInbox } from './gmail.js';

const secrets = await fetchSecrets();
console.log('Fetched secrets.');

const googleClient = await authorizeGmail(
  secrets['google-cloud-platform'].credentials
);
console.log('Authorized with Google.');

let historyId = await watchInbox(googleClient);
console.log('Watched inbox.');

const app = express();
const PORT = 3000;

app.post('/api/summarize', async (req, res) => {
  const result = await queryNewMessages(googleClient, historyId);

  historyId = result.historyId;
  console.log(result.messages);

  res.send(undefined);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});
