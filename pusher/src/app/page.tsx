'use client';
import { useState } from 'react';
import { NotificationDisplay } from './NotificationDisplay';

export default function Home() {
  const [inputValue, setInputValue] = useState('');

  async function submit() {
    await fetch('/api/notify', {
      method: 'POST',
      body: JSON.stringify(inputValue),
    });
  }

  return (
    <main className="p-24">
      <h2 className="text-2xl font-bold mb-4">Send a Notification</h2>

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="mb-10"
      >
        <input
          className="input input-bordered mr-2"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button className="btn btn-primary">Send notification</button>
      </form>

      <NotificationDisplay />
    </main>
  );
}
