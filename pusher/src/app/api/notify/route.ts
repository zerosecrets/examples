import { getPusher } from '@/util/getPusher';

export async function POST(request: Request) {
  const content = await request.json();

  const pusher = await getPusher();
  pusher.trigger('notifications', 'notification', content);

  return Response.json(null);
}
