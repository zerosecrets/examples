'use client';
import Pusher from 'pusher-js';
import { useEffect, useState } from 'react';

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
});

export function NotificationDisplay() {
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    const channel = pusher.subscribe('notifications');

    channel.bind('notification', (data: string) => {
      setNotifications((n) => [...n, data]);
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe('notifications');
    };
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Received Notifications</h2>
      <ul>
        {notifications.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </div>
  );
}
