import sgMail from '@sendgrid/mail';
import { zero } from '@zerosecrets/zero';

let initialized = false;

export async function initializeSendGrid() {
  if (initialized) {
    return true;
  }

  if (!process.env.ZERO_TOKEN) {
    throw new Error(
      'Did you forget to set the ZERO_TOKEN environment variable?'
    );
  }

  const secrets = await zero({
    token: process.env.ZERO_TOKEN,
    pick: ['sendgrid'],
  }).fetch();

  if (!secrets.sendgrid) {
    throw new Error('Did not receive an API key for SendGrid.');
  }

  sgMail.setApiKey(secrets.sendgrid.api_key);
  initialized = true;
}
