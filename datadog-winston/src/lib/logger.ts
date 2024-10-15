import winston from 'winston';
import DatadogWinston from 'datadog-winston';
import { zero } from '@zerosecrets/zero';

async function getSecrets() {
  if (!process.env.ZERO_TOKEN) {
    throw new Error(
      'Did you forget to set the ZERO_TOKEN environment variable?'
    );
  }

  try {
    const result = await zero({
      token: process.env.ZERO_TOKEN,
      pick: ['datadog'],
      callerName: 'production',
    }).fetch();

    return result?.datadog; // { api_key: "your-datadog-api-key" }
  } catch (error) {
    console.error('Error fetching secrets from Zero:', error);
    throw error;
  }
}

const secrets = await getSecrets();

if (!secrets || !secrets.api_key) {
  throw new Error('Datadog API key not found in secrets.');
}

export const logger = winston.createLogger({
  level: 'info',
  transports: [
    new DatadogWinston({
      apiKey: secrets.api_key,
      service: 'svelte-app',
      ddsource: 'nodejs',
      ddtags: 'env:staging,version:1.0.0',
    }),
    // new winston.transports.Console(),
  ],
});
