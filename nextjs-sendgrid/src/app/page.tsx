'use client';
import styles from './page.module.css';
import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  async function submit() {
    const response = await fetch('/api/purchase', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: { 'Content-Type': 'application/json' },
    });

    setIsSuccess(response.ok);
  }

  return (
    <main className={styles.main}>
      <h4 className={styles.heading}>
        Enter your email address to confirm your purchase:
      </h4>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        noValidate
        className={styles.form}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />

        <button type="submit">Submit</button>
      </form>

      {isSuccess && <p>Success!</p>}
    </main>
  );
}
