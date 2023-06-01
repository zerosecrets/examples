import { zero } from '@zerosecrets/zero';
import { OpenAIApi, Configuration } from 'openai';

let openai: OpenAIApi | undefined;

export async function getOpenAIClient(): Promise<OpenAIApi> {
  // Reuse the same OpenAI client if one has already been created, so that we
  // don't call Zero on every request
  if (openai) {
    return openai;
  }

  if (!process.env.ZERO_TOKEN) {
    throw new Error(
      'Did you forget to set the ZERO_TOKEN environment variable?'
    );
  }

  const secrets = await zero({
    token: process.env.ZERO_TOKEN,
    pick: ['openai'],
  }).fetch();

  if (!secrets.openai) {
    throw new Error('Did not receive an API key for OpenAI.');
  }

  const configuration = new Configuration({
    apiKey: secrets.openai.api_key,
  });
  return new OpenAIApi(configuration);
}
