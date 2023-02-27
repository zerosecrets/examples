'use client';

import React, { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState<boolean>();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setSubmitted(false);

    try {
      const response = await fetch('/api/signUp', {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(
          `Received an error HTTP status code: ${response.status}.`
        );
      }

      setSubmitted(true);
    } catch (e) {
      setSubmitted(false);
      console.error(e);
    }
  }

  return (
    <main>
      <h1>Zero + Mailchimp</h1>

      <p style={{ marginBottom: '2rem' }}>
        Use this form to sign up as a new user. We will send you an email to
        verify your email address.
      </p>

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="emailInput">Email address</label>
          <input
            id="emailInput"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button type="submit">Sign up</button>
      </form>

      {submitted && (
        <p>
          Request submitted. Check the server logs to see if the email was sent
          successfully.
        </p>
      )}
    </main>
  );
}
