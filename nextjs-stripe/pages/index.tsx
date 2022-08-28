/* eslint-disable @next/next/no-img-element */
import React from 'react';

import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';

const ProductDisplay: React.FC = () => (
  <section>
    <div className="product">
      <img
        src="https://i.imgur.com/EHyR2nP.png"
        alt="The cover of Stubborn Attachments"
      />
      <div className="description">
        <h3>Stubborn Attachments</h3>
        <h5>$20.00</h5>
      </div>
    </div>
    <form action="/api/createCheckoutSession" method="POST">
      <button type="submit">Checkout</button>
    </form>
  </section>
);

interface HomeProps {
  message: string | null;
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async (
  context
) => {
  let message: string | null = null;

  // Check to see if this is a redirect back from Checkout
  if (context.query['success']) {
    message = 'Order placed! You will receive an email confirmation.';
  }

  if (context.query['canceled']) {
    message =
      "Order canceled -- continue to shop around and checkout when you're ready.";
  }

  return { props: { message } };
};

const Home: NextPage<HomeProps> = ({ message }) => {
  return (
    <div>
      <Head>
        <title>Next.js + Stripe + Zero</title>
      </Head>

      <h1>Next.js + Stripe + Zero</h1>

      {message ? <p>{message}</p> : <ProductDisplay />}
    </div>
  );
};

export default Home;
