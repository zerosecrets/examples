// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getAnalytics } from '../../util';

export default async function sendEvent(req, res) {
  const analytics = await getAnalytics();

  // In a real app, you would only call `identify` when the user is first
  // created, or when their traits change.
  analytics.identify({
    userId: '012345',
    traits: {
      name: 'Joe Bloggs',
      email: 'jbloggs@example.com',
    },
  });

  analytics.track({
    userId: '012345',
    event: 'Purchased Product',
    properties: {
      productName: 'AMD Ryzen 5 2600',
    },
  });

  res.status(200).send('Event sent.');
}
