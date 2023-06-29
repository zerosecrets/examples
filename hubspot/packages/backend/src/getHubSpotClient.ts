import hubspot from '@hubspot/api-client';
import { zero } from '@zerosecrets/zero';

let hubSpot: hubspot.Client | undefined;

export async function getHubSpotClient(): Promise<hubspot.Client> {
  // Reuse the same HubSpot client if one has already been created, so that we
  // don't call Zero on every request
  if (hubSpot) {
    return hubSpot;
  }

  if (!process.env.ZERO_TOKEN) {
    throw new Error(
      'Did you forget to set the ZERO_TOKEN environment variable?'
    );
  }

  const secrets = await zero({
    token: process.env.ZERO_TOKEN,
    pick: ['hubspot'],
  }).fetch();

  if (!secrets.hubspot) {
    throw new Error('Did not receive an API key for HubSpot.');
  }

  return new hubspot.Client({ accessToken: secrets.hubspot.token });
}
