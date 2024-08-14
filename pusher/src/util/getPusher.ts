import Pusher from 'pusher';
import { zero } from '@zerosecrets/zero';

let pusher: Pusher | undefined;

export async function getPusher() {
  if (pusher) {
    return pusher;
  }

  if (!process.env.ZERO_TOKEN) {
    throw new Error(
      'Did you forget to set the ZERO_TOKEN environment variable?'
    );
  }

  const secrets = await zero({
    token: process.env.ZERO_TOKEN,
    pick: ['pusher'],
  }).fetch();

  if (!secrets.pusher) {
    throw new Error('Did not receive Pusher secret.');
  }

  pusher = new Pusher({
    appId: secrets.pusher.app_id,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
    secret: secrets.pusher.secret,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    useTLS: true,
  });

  return pusher;
}
