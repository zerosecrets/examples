export const BRAINTREE_GRAPHQL_ENDPOINT =
  'https://payments.sandbox.braintree-api.com/graphql';
export const BRAINTREE_VERSION = '2022-09-29';

export const BRAINTREE_MERCHANT_ID =
  process.env.NEXT_PUBLIC_BRAINTREE_MERCHANT_ID;

if (!BRAINTREE_MERCHANT_ID) {
  console.error('BRAINTREE_MERCHANT_ID environment variable not set.');
}
