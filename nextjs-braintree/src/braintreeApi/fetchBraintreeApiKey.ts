import { zero } from '@zerosecrets/zero';

let apiKey: string | undefined;

export async function fetchBraintreeApiKey(): Promise<string> {
  // Don't call Zero if we already fetched the API key
  if (apiKey) {
    return apiKey;
  }

  if (!process.env.ZERO_TOKEN) {
    throw new Error(
      'Did you forget to set the ZERO_TOKEN environment variable?'
    );
  }

  const secrets = await zero({
    token: process.env.ZERO_TOKEN,
    pick: ['braintree'],
  }).fetch();

  if (!secrets.braintree) {
    throw new Error('Did not receive an API key for Braintree.');
  }

  apiKey = secrets.braintree.API_KEY;

  return apiKey;
}
