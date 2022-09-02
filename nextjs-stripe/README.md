This example is inspired by [a tutorial in the Stripe docs](https://stripe.com/docs/checkout/quickstart?lang=node&client=react).

## Useful commands

- `ZERO_TOKEN='...' npm run dev` - run the site in development mode
- `npm run build` - build the site for production
- `ZERO_TOKEN='...' npm run start` - run the production build created by `npm run build`

## TODO

If you want to run this example, you need to...

1. Create a Zero token and add a Stripe secret to it, using the Stripe publishable and secret keys.
1. Create a product in Stripe and copy its price ID into `createCheckoutSession.ts`.
