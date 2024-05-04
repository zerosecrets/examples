import Anthropic from '@anthropic-ai/sdk';
import { GmailMessage } from './gmail.js';

export async function summarize(
  gmailMessage: GmailMessage,
  apiKey: string
): Promise<string> {
  const anthropic = new Anthropic({
    apiKey,
  });

  const claudeMessage = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 256,
    messages: [
      {
        role: 'user',
        content: `Please generate a 3 sentence summary of the following email:
        
        Subject: ${gmailMessage.subject}
        
        ${gmailMessage.body}`,
      },
    ],
  });

  return claudeMessage.content[0].text;
}
