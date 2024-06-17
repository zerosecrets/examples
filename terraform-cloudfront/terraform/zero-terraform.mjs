import { zero } from '@zerosecrets/zero';

$.verbose = true;

if (!process.env.ZERO_TOKEN) {
  throw new Error('Did you forget to set the ZERO_TOKEN environment variable?');
}

const secrets = await zero({
  token: process.env.ZERO_TOKEN,
  pick: ['aws'],
}).fetch();

process.env.AWS_ACCESS_KEY_ID = secrets.aws.aws_access_key_id;
process.env.AWS_SECRET_ACCESS_KEY = secrets.aws.aws_secret_access_key;

await $`terraform ${argv._.join(' ')}`;
