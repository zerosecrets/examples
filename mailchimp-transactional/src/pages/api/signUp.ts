import type { NextApiRequest, NextApiResponse } from 'next';

import { getMailchimpClient } from '@/util';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    throw new Error('Only POST is allowed.');
  }

  const { email } = req.body;

  if (!email) {
    throw new Error('Failed to get the email address from the request.');
  }

  const mailchimpClient = await getMailchimpClient();

  // You can use this to test that communication with Mailchimp is working:

  // const response = await mailchimpClient.users.ping();

  const response = await mailchimpClient.messages.send({
    message: {
      from_email: 'demo@YOUR-DOMAIN.com', // TODO Replace YOUR-DOMAIN.com with your verified sending domain
      subject: '[Demo] Please verify your email address',
      text: 'If this was a real app, there would be a link right here ;)',
      to: [
        {
          email,
          type: 'to',
        },
      ],
    },
  });

  console.log('Mailchimp responded with:');
  console.log(response);

  res.status(200).send('');
}
