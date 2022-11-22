import Head from 'next/head';
import { useState } from 'react';

import styles from '../styles/Home.module.css';

export default function Home() {
  const [eventSentAt, setEventSentAt] = useState();
  const [error, setError] = useState();

  async function sendEvent() {
    setEventSentAt(undefined);
    const response = await fetch('/api/sendEvent', { method: 'POST' });

    if (response.ok) {
      setEventSentAt(new Date());
      setError(undefined);
    } else {
      setError(`Server responded with status code ${response.status}.`);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Zero + Segment</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js</a> on Docker! 2
        </h1>

        <p>
          <button className={styles.button} onClick={sendEvent}>
            Send an event to Segment
          </button>
        </p>

        {eventSentAt && (
          <p className={styles.success}>
            Event sent at {eventSentAt.toLocaleString()}!
          </p>
        )}
        {error && <p className={styles.danger}>{error}</p>}
      </main>
    </div>
  );
}
