// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

import { getStripeClient } from '../../util';

const MY_DOMAIN = 'http://localhost:3000';

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
        price: 'YOUR_PRICE_ID',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${MY_DOMAIN}?success=true`,
    cancel_url: `${MY_DOMAIN}?canceled=true`,
  });

  if (!session.url) {
    throw new Error('session.url is null.');
  }

  res.redirect(303, session.url);
}
