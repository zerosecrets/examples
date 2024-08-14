import { zero } from '@zerosecrets/zero';
import Rollbar from 'rollbar';

let rollbar: Rollbar | undefined;

export async function getRollbar(): Promise<Rollbar> {
  // Reuse the same Rollbar client if one has already been created, so that we
  // don't call Zero on every request
  if (rollbar) {
    return rollbar;
  }

  if (!process.env.ZERO_TOKEN) {
    throw new Error(
      'Did you forget to set the ZERO_TOKEN environment variable?'
    );
  }

  const secrets = await zero({
    token: process.env.ZERO_TOKEN,
    pick: ['rollbar'],
  }).fetch();

  if (!secrets.rollbar) {
    throw new Error('Did not receive an API key for Rollbar.');
  }

  rollbar = new Rollbar({
    accessToken: secrets.rollbar.access_token,
    captureUncaught: true,
    captureUnhandledRejections: true,
  });

  return rollbar;
}
