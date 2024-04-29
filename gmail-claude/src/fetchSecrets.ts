import { zero } from '@zerosecrets/zero';

interface Secrets {
  'google-cloud-platform': {
    credentials: string;
  };
}

export async function fetchSecrets(): Promise<Secrets> {
  if (!process.env.ZERO_TOKEN) {
    throw new Error(
      'Did you forget to set the ZERO_TOKEN environment variable?'
    );
  }

  const secrets = await zero({
    token: process.env.ZERO_TOKEN,
    pick: ['google-cloud-platform'],
  }).fetch();

  return secrets as unknown as Secrets;
}
