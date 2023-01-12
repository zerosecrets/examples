import type { NextApiRequest, NextApiResponse } from 'next';

import { SendMessageCommand } from '@aws-sdk/client-sqs';
import { getSqsClient } from 'src/util';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  console.log('The API received an order:');
  console.log(req.body);
  console.log();

  const sqsClient = await getSqsClient();

  // In a real app you should validate the payload before sending it to the
  // message queue
  const command = new SendMessageCommand({
    QueueUrl: process.env.ORDER_QUEUE_URL,
    MessageBody: JSON.stringify(req.body),
  });

  await sqsClient.send(command);

  console.log('Sent message to SQS.');
  console.log();

  res.status(200).send('');
}
