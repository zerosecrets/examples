import { initAuth0 } from '@auth0/nextjs-auth0';
import { zero } from '@zerosecrets/zero';

export async function getAuth0() {
  if (!process.env.ZERO_TOKEN) {
    throw new Error(
      'Did you forget to set the ZERO_TOKEN environment variable?'
    );
  }

  const secrets = await zero({
    token: process.env.ZERO_TOKEN,
    pick: ['auth0'],
  }).fetch();

  if (!secrets.auth0) {
    throw new Error('Did not receive Auth0 secrets.');
  }

  return initAuth0({
    secret: secrets.auth0.secret,
    baseURL: 'http://localhost:3000',
    issuerBaseURL: `https://${secrets.auth0.domain}`,
    clientID: secrets.auth0.client_id,
    clientSecret: secrets.auth0.client_secret,
  });
}
