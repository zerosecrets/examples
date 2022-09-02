// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

import { getStripeClient } from '../../util';

const DOMAIN = process.env.DOMAIN;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const stripe = await getStripeClient();

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // This is a price ID copied from the Stripe Dashboard
        //
        // TODO Paste the price ID of the product you created here.
        price: 'price_1LYuqlBzNL28s33DQYwQxFx7',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${DOMAIN}?success=true`,
    cancel_url: `${DOMAIN}?canceled=true`,
  });

  if (!session.url) {
    throw new Error('session.url is null.');
  }

  res.redirect(303, session.url);
}
