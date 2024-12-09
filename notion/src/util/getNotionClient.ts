import { Client } from '@notionhq/client';
import { zero } from '@zerosecrets/zero';

let client: Client | undefined;

export async function getNotionClient() {
  if (client) {
    return client;
  }

  if (!process.env.ZERO_TOKEN) {
    throw new Error(
      'Did you forget to set the ZERO_TOKEN environment variable?'
    );
  }

  const secrets = await zero({
    token: process.env.ZERO_TOKEN,
    pick: ['notion'],
  }).fetch();

  if (!secrets.notion) {
    throw new Error('Did not receive Notion secret.');
  }

  client = new Client({ auth: secrets.notion.api_key });

  return client;
}
