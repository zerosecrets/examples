'use client';

import React, { useState } from 'react';

const PRODUCT_ID = 123;

export default function Home() {
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const [name, setName] = useState('testName');
  const [address, setAddress] = useState('testAddress');
  const [quantity, setQuantity] = useState(1);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setSubmitted(false);

    if (!(name && address && quantity > 0)) {
      setErrorMessage('A required field is missing.');
      return;
    }

    try {
      const response = await fetch('/api/placeOrder', {
        method: 'POST',
        body: JSON.stringify({
          productId: PRODUCT_ID,
          name,
          address,
          quantity,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Placing the order failed with status code ${response.status}.`
        );
      }

      setSubmitted(true);
      setErrorMessage(undefined);
    } catch (e) {
      setErrorMessage((e as any).message);
      console.error(e);
    }
  };

  return (
    <div className="flex justify-center">
      <main className="p-6 w-[500px]">
        <h1 className="text-2xl mb-4">AWS SQS + Zero</h1>

        <p className="mb-4">
          Fill out the form below to place your order for <em>Product A</em>.
        </p>

        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label htmlFor="nameInput" className="block mb-1">
              Your name
            </label>
            <input
              id="nameInput"
              name="name"
              className="border border-neutral-300 rounded-md px-2 py-1 w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="addressInput" className="block mb-1">
              Your address
            </label>
            <textarea
              id="addressInput"
              name="address"
              className="border border-neutral-300 rounded-md px-2 py-1 w-full"
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="quantityInput" className="block mb-1">
              Quantity of <em>Product A</em> to purchase
            </label>
            <input
              id="quantityInput"
              name="quantity"
              type="number"
              className="border border-neutral-300 rounded-md px-2 py-1 w-24"
              value={quantity.toString()}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
          </div>

          <button
            type="submit"
            className="rounded-md bg-green-500 hover:bg-green-600 px-3 py-2 text-white mb-4"
          >
            Place order
          </button>

          {submitted && (
            <p className="text-green-600 font-bold">Order placed!</p>
          )}
          {errorMessage && (
            <p className="text-red-600 font-bold">{errorMessage}</p>
          )}
        </form>
      </main>
    </div>
  );
}
