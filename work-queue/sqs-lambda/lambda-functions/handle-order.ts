import { SQSEvent } from 'aws-lambda';

export function handler(event: SQSEvent): void {
  for (const record of event.Records) {
    const payload = JSON.parse(record.body);

    console.log(payload);
  }
}
