import Bolt from '@slack/bolt';

export async function sendSlackMessage(
  from: string,
  summary: string,
  accessToken: string,
  signingSecret: string
): Promise<void> {
  const app = new Bolt.App({ token: accessToken, signingSecret });

  const userResponse = await app.client.users.lookupByEmail({
    // TODO Put your email address here
    email: 'YOUR_EMAIL@example.com',
  });

  if (!userResponse.ok) {
    console.error(userResponse);
    throw new Error('lookupByEmail failed.');
  }

  const userId = userResponse.user?.id;

  if (!userId) {
    throw new Error('User not found.');
  }

  const openResponse = await app.client.conversations.open({
    users: userId,
  });

  if (!openResponse.ok) {
    console.error(openResponse);
    throw new Error('conversations.open failed.');
  }

  const channelId = openResponse.channel?.id;

  if (!channelId) {
    throw new Error('channelId is null.');
  }

  const messageResponse = await app.client.chat.postMessage({
    channel: channelId,
    text: `New email from ${from}:\n\n${summary}`,
  });

  if (!messageResponse.ok) {
    console.error(messageResponse);
    throw new Error('postMessage failed.');
  }
}
