import { getSlackWebhookUrl } from 'app/util';

interface CreateAlertOptions {
  name: string;
  text: string;
}

export async function createAlert({
  name,
  text,
}: CreateAlertOptions): Promise<void> {
  const slackWebhookUrl = await getSlackWebhookUrl();

  const body = JSON.stringify({ text: `${name} created a new alert: ${text}` });

  // Node 18+ is required to use the built-in `fetch` function
  const response = await fetch(slackWebhookUrl, {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    let responseText = '';

    try {
      responseText = await response.text();
    } catch {}

    throw new Error(
      `Posting to Slack returned a ${response.status} status code. ` +
        `The response was:\n\n${responseText}`
    );
  }
}
