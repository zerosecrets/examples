import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import {
  AddressInput,
  BRAINTREE_GRAPHQL_ENDPOINT,
  BRAINTREE_MERCHANT_ID,
  BRAINTREE_VERSION,
  CreateClientTokenResponse,
  CREATE_CLIENT_TOKEN_MUTATION,
  CreditCardInput,
  TokenizeCreditCardInput,
  TokenizeCreditCardResponse,
  TOKENIZE_CREDIT_CARD_MUTATION,
} from 'src/braintreeApi';

// This is a separate import because importing the Zero SDK in the browser will fail
import { fetchBraintreeApiKey } from '../braintreeApi/fetchBraintreeApiKey';

interface Props {
  clientToken: string;
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const apiKey = await fetchBraintreeApiKey();

  const body = {
    query: CREATE_CLIENT_TOKEN_MUTATION,
    variables: {
      input: {
        clientToken: {
          merchantAccountId: BRAINTREE_MERCHANT_ID,
        },
      },
    },
  };

  // Node 18+ required for built-in fetch support. Use the node-fetch package if
  // on an older Node version
  const response = await fetch(BRAINTREE_GRAPHQL_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${apiKey}`,
      'Braintree-Version': BRAINTREE_VERSION,
    },
  });
  const { data } = (await response.json()) as CreateClientTokenResponse;
  const clientToken = data.createClientToken.clientToken;

  return { props: { clientToken } };
};

// If doing this for real, `billingAddress` and `creditCard` would come from a
// from that the user fills out.
const billingAddress: AddressInput = {
  addressLine1: '2435 Lynn Rd',
  addressLine2: 'Suite 206',
  locality: 'Raleigh',
  region: 'NC',
  postalCode: '27612',
  countryCode: 'US',
};

const creditCard: CreditCardInput = {
  number: '4242424242424242',
  expirationYear: '25',
  expirationMonth: '12',
  cvv: '001',
  cardholderName: 'Samuel Magura',
  billingAddress: billingAddress,
};

const Home: NextPage<Props> = ({ clientToken }) => {
  const [serverResponse, setServerResponse] = useState<string>();

  const submit: React.FormEventHandler = async (e) => {
    e.preventDefault();

    const { authorizationFingerprint } = JSON.parse(atob(clientToken));

    const input: TokenizeCreditCardInput = { creditCard };

    const body = {
      query: TOKENIZE_CREDIT_CARD_MUTATION,
      variables: { input },
    };

    const tokenizeCreditCardResponse = await fetch(BRAINTREE_GRAPHQL_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authorizationFingerprint}`,
        'Braintree-Version': BRAINTREE_VERSION,
      },
    });
    const { data } =
      (await tokenizeCreditCardResponse.json()) as TokenizeCreditCardResponse;
    const paymentMethodId = data.tokenizeCreditCard.paymentMethod.id;

    const createTransactionResponse = await fetch('/api/createTransaction', {
      method: 'POST',
      body: JSON.stringify({ paymentMethodId }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    setServerResponse((await createTransactionResponse.json()) as string);
  };

  return (
    <div style={{ padding: '1rem 2rem' }}>
      <Head>
        <title>Braintree + Zero</title>
      </Head>

      <h1>Braintree + Zero</h1>

      <form onSubmit={submit}>
        <h4>Input:</h4>
        <pre>{JSON.stringify(creditCard, undefined, 2)}</pre>
        <br />
        <button type="submit" style={{ fontSize: '1.25rem' }}>
          Submit fake payment
        </button>
      </form>

      <br />

      <h4>Server response:</h4>
      {!serverResponse && <i>None yet</i>}
      {serverResponse && <p>{serverResponse}</p>}
    </div>
  );
};

export default Home;
