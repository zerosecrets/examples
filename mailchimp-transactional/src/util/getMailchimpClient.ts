import Mailchimp from '@mailchimp/mailchimp_transactional';
import { zero } from '@zerosecrets/zero';

let mailchimpClient: Mailchimp.ApiClient | undefined;

export async function getMailchimpClient(): Promise<Mailchimp.ApiClient> {
  // Reuse the same Mailchimp client if one has already been created, so that we
  // don't call Zero on every request
  if (mailchimpClient) {
    return mailchimpClient;
  }

  if (!process.env.ZERO_TOKEN) {
    throw new Error(
      'Did you forget to set the ZERO_TOKEN environment variable?'
    );
  }

  const secrets = await zero({
    token: process.env.ZERO_TOKEN,
    pick: ['mailchimp'],
  }).fetch();

  if (!secrets.mailchimp) {
    throw new Error('Did not receive an API key for Mailchimp.');
  }

  mailchimpClient = Mailchimp(secrets.mailchimp.transactional_api_key);

  return mailchimpClient;
}
