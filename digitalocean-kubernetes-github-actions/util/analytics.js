import Analytics from 'analytics-node';

import { zero } from '@zerosecrets/zero';

let analytics;

export async function getAnalytics() {
  // Reuse the same Segment client if one has already been created, so that we
  // don't call Zero on every request
  if (analytics) {
    return analytics;
  }

  if (!process.env.ZERO_TOKEN) {
    throw new Error(
      'Did you forget to set the ZERO_TOKEN environment variable?'
    );
  }

  const secrets = await zero({
    token: process.env.ZERO_TOKEN,
    pick: ['segment', 'digital-ocean'],
  }).fetch();

  if (!secrets.Segment) {
    throw new Error('Did not receive an API key for Segment.');
  }

  analytics = new Analytics(secrets.Segment.WRITE_KEY);

  return analytics;
}
