import { Twilio } from 'twilio';

import { zero } from '@zerosecrets/zero';

let twilio: Twilio | undefined;

export async function getTwilioClient(): Promise<Twilio> {
  // Reuse the same Twilio client if one has already been created, so that we
  // don't call Zero on every request
  if (twilio) {
    return twilio;
  }

  if (!process.env.ZERO_TOKEN) {
    throw new Error(
      'Did you forget to set the ZERO_TOKEN environment variable?'
    );
  }

  const secrets = await zero({
    token: process.env.ZERO_TOKEN,
    pick: ['twilio'],
  }).fetch();

  if (!secrets.twilio) {
    throw new Error('Did not receive any secrets for Twilio.');
  }

  twilio = new Twilio(secrets.twilio.account_sid, secrets.twilio.auth_token);

  return twilio;
}
