import { zero } from '@zerosecrets/zero';

let slackWebhookUrl: string | undefined;

export async function getSlackWebhookUrl(): Promise<string> {
  // Don't call Zero on every request
  if (slackWebhookUrl) {
    return slackWebhookUrl;
  }

  if (!process.env.ZERO_TOKEN) {
    throw new Error(
      'Did you forget to set the ZERO_TOKEN environment variable?'
    );
  }

  const secrets = await zero({
    token: process.env.ZERO_TOKEN,
    pick: ['slack'],
  }).fetch();

  // slackWebhookUrl = secrets.slack?.['ALERTS_WEBHOOK_URL'];
  slackWebhookUrl = secrets.slack?.['alerts_webhook_url'];

  if (!slackWebhookUrl) {
    throw new Error('Did not receive the Slack webhook URL.');
  }

  return slackWebhookUrl;
}
