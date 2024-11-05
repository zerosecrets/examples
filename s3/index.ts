import { DeleteObjectCommand, PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { zero } from '@zerosecrets/zero';

const command = process.argv[2];

if (command !== 'add' && command !== 'remove') {
  throw new Error(
    'You must specify "add" or "remove" as a command-line argument.'
  );
}

if (!process.env.ZERO_TOKEN) {
  throw new Error('Did you forget to set the ZERO_TOKEN?');
}

const secrets = await zero({
  token: process.env.ZERO_TOKEN,
  pick: ['aws'],
  callerName: 'staging',
}).fetch();

if (!secrets.aws) {
  throw new Error('AWS secret was not present.');
}

const s3 = new S3({
  region: 'us-east-2',
  credentials: {
    accessKeyId: secrets.aws.access_key_id,
    secretAccessKey: secrets.aws.secret_access_key,
  },
});

const BUCKET = 'srmagura-zero-bucket';
const OBJECT_KEY = 'test-object';

if (command === 'add') {
  const s3Command = new PutObjectCommand({
    Body: 'test',
    Bucket: BUCKET,
    Key: OBJECT_KEY,
  });

  await s3.send(s3Command);

  console.log('Object added.');
} else if (command === 'remove') {
  const s3Command = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: OBJECT_KEY,
  });

  await s3.send(s3Command);

  console.log('Object removed.');
}
