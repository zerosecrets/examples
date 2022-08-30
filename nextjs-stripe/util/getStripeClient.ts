import Stripe from 'stripe';

import { zero } from '@zerosecrets/zero';

let stripe: Stripe | undefined;

export async function getStripeClient(): Promise<Stripe> {
  // Reuse the same Stripe client if one has already been created, so that we
  // don't call Zero on every request
  if (stripe) {
    return stripe;
  }

  if (!process.env.ZERO_TOKEN) {
    throw new Error(
      'Did you forget to set the ZERO_TOKEN environment variable?'
    );
  }

  const secrets = await zero({
    token: process.env.ZERO_TOKEN,
    pick: ['stripe'],
  }).fetch();

  if (!secrets.stripe) {
    throw new Error(
      'Did not receive an API key for Stripe. ' +
        'Did you remember to add a Stripe secret to your Zero token?'
    );
  }

  stripe = new Stripe(secrets.stripe.secret_api_key, {
    apiVersion: '2022-08-01',
  });

  return stripe;
}
