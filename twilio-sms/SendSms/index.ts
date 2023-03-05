import { AzureFunction, Context, HttpRequest } from '@azure/functions';

import { getTwilioClient } from '../util/getTwilioClient';

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const twilioNumber = process.env.TwilioNumber;
  const myNumber = process.env.MyNumber;

  if (!twilioNumber) {
    throw new Error('TwilioNumber environment variable not set.');
  }
  if (!myNumber) {
    throw new Error('MyNumber environment variable not set.');
  }

  const twilio = await getTwilioClient();

  const message = await twilio.messages.create({
    from: twilioNumber,
    to: myNumber,
    body: 'Hello from Twilio & Zero',
  });

  context.res = {
    body: `Message SID: ${message.sid}\nMessage status: ${message.status}`,
  };
};

export default httpTrigger;
