import fs from 'node:fs/promises';
import path from 'node:path';
import { authenticate } from '@google-cloud/local-auth';
import { gmail_v1, google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

async function loadSavedCredentialsIfExist(): Promise<OAuth2Client | null> {
  try {
    const content = await fs.readFile(TOKEN_PATH, { encoding: 'utf-8' });
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials) as OAuth2Client;
  } catch (err) {
    return null;
  }
}

async function saveCredentials(client: OAuth2Client) {
  const content = await fs.readFile(CREDENTIALS_PATH, { encoding: 'utf-8' });
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

export async function authorizeGmail(credentialsSecret: string) {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }

  await fs.writeFile(CREDENTIALS_PATH, credentialsSecret, {
    encoding: 'utf-8',
  });

  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

export async function watchInbox(client: OAuth2Client): Promise<string> {
  const gmail = google.gmail({ version: 'v1', auth: client });
  const res = await gmail.users.watch({
    userId: 'me',
    requestBody: {
      // TODO Put your project name here:
      topicName: 'projects/YOUR_PROJECT_NAME/topics/gmail',
      labelIds: ['INBOX'],
      labelFilterBehavior: 'INCLUDE',
    },
  });

  if (res.status >= 400) {
    console.log(res);
    throw new Error('Watching inbox failed.');
  }

  const historyId = res.data.historyId;

  if (!historyId) {
    throw new Error('Got null historyId.');
  }

  return historyId;
}

export interface GmailMessage {
  subject: string;
  body: string;
}

async function getMessage(
  gmail: gmail_v1.Gmail,
  messageId: string
): Promise<GmailMessage> {
  const res = await gmail.users.messages.get({
    userId: 'me',
    id: messageId,
    format: 'full',
  });

  if (res.status >= 400) {
    console.log(res);
    throw new Error('Getting message failed.');
  }

  const subject =
    res.data.payload?.headers?.find((h) => h.name === 'Subject')?.value ?? '';

  // We assume that the email has a plaintext part. This is probably not a safe
  // assumption. Production applications should also handle HTML parts.
  const plainTextPart = res.data.payload?.parts?.find(
    (p) => p.mimeType === 'text/plain'
  );

  const body = atob(plainTextPart?.body?.data ?? '');

  return { subject, body };
}

interface QueryNewMessagesReturn {
  historyId: string;
  messages: GmailMessage[];
}

export async function queryNewMessages(
  client: OAuth2Client,
  lastHistoryId: string
): Promise<QueryNewMessagesReturn> {
  const gmail = google.gmail({ version: 'v1', auth: client });

  // This will return only the first 100 emails. Iterating over multiple pages
  // is required if you need to retrieve more than that many emails.
  const res = await gmail.users.history.list(
    {
      userId: 'me',
      startHistoryId: lastHistoryId,
      labelId: 'INBOX',
    },
    {}
  );

  if (res.status >= 400) {
    console.log(res);
    throw new Error('Querying history failed.');
  }

  const historyId = res.data.historyId;

  if (!historyId) {
    throw new Error('Got null historyId.');
  }

  const messagePromises: Promise<GmailMessage>[] = [];

  for (const h of res.data.history ?? []) {
    for (const message of h.messages ?? []) {
      if (message.id) {
        messagePromises.push(getMessage(gmail, message.id));
      }
    }
  }

  return { historyId, messages: await Promise.all(messagePromises) };
}
