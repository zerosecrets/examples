import express from 'express';
import { fetchSecrets } from './fetchSecrets.js';
import { authorizeGmail, queryNewMessages, watchInbox } from './gmail.js';
import { summarize } from './claude.js';
import { sendSlackMessage } from './slack.js';
import { testMessage } from './testMessage.js';

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
  console.log(`Received ${result.messages.length} email(s).`);

  for (const message of result.messages) {
    const summary = await summarize(message, secrets.claude.api_key);
    console.log('Summarized email with Claude.');

    await sendSlackMessage(
      message.from,
      summary,
      secrets.slack.access_token,
      secrets.slack.signing_secret
    );
    console.log('Sent summary on Slack.');
  }

  res.send(undefined);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});

// Uncomment the following code to test the Claude and Slack integration without
// the Gmail integration:

// const summary = await summarize(testMessage, secrets.claude.api_key);

// await sendSlackMessage(
//   testMessage.from,
//   summary,
//   secrets.slack.access_token,
//   secrets.slack.signing_secret
// );
