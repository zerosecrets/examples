'use client';

import { useState } from 'react';

export default function Home() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [isSuccess, setIsSuccess] = useState(false);

  async function submit() {
    setIsSuccess(false);

    try {
      const response = await fetch('/api/createLead', {
        method: 'POST',
        body: JSON.stringify({ name, email }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Response got error status code: ${response.status}.`);
      }

      setIsSuccess(true);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="p-12 flex justify-center">
      <form
        className="max-w-2xl"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <h2 className="text-2xl font-bold mb-6">
          Leave your email address and we'll get back to you
        </h2>

        <label className="block mb-5">
          <div className="mb-1">Name</div>
          <input
            name="name"
            className="border-gray-400 border p-1 bg-white"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label className="block mb-5">
          <div className="mb-1">Email</div>
          <input
            name="email"
            type="email"
            className="border-gray-400 border p-1 bg-white"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <button
          type="submit"
          className="bg-blue-500 text-white px-3 py-2 block"
        >
          Submit
        </button>

        {isSuccess && (
          <p className="mt-6 text-green-600 font-bold">
            Form submitted successfully.
          </p>
        )}
      </form>
    </div>
  );
}
