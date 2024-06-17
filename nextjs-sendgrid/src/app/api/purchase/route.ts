import sgMail from '@sendgrid/mail';
import { initializeSendGrid } from './initializeSendGrid';

export async function POST(request: Request) {
  const { email } = await request.json();

  await initializeSendGrid();

  console.log(`Sending email to: ${email}`);

  await sgMail.send({
    to: email,
    from: 'srmagura@gmail.com',
    subject: 'Purchase confirmation',
    text: 'This is a sample email.',
  });

  return Response.json(null);
}
