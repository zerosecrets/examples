import { Context, APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { zero } from '@zerosecrets/zero';
import * as sendgridMail from '@sendgrid/mail';

export async function handler(
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  try {
    if (!(event.httpMethod === 'POST' && event.path === '/')) {
      return {
        statusCode: 400,
        body: 'Only POST / is supported.',
      };
    }

    const secrets = await zero({
      token: process.env.ZERO_TOKEN!,
      pick: ['sendgrid'],
    }).fetch();

    if (!secrets.sendgrid) {
      throw new Error('Did not receive an API key for SendGrid.');
    }

    sendgridMail.setApiKey(secrets.sendgrid.api_key);

    await sendgridMail.send({
      to: 'srmagura@gmail.com',
      from: 'srmagura@gmail.com',
      subject: 'Hello from Lambda & Zero!',
      text: 'It works!',
    });

    return {
      statusCode: 200,
      body: 'Email sent successfully!',
    };
  } catch (error) {
    const body =
      (error as { stack?: string }).stack || JSON.stringify(error, null, 2);

    return {
      statusCode: 500,
      body: JSON.stringify(body),
    };
  }
}
