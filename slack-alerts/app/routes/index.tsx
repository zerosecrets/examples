import styles from 'app/styles/global.css';
import { createAlert } from '~/models/alert.server';

import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';

export const links = () => [{ rel: 'stylesheet', href: styles }];

type ActionData =
  | {
      success: boolean;

      errors?: {
        name: null | string;
        text: null | string;
      };
    }
  | undefined;

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const name = formData.get('name') as string | null;
  const text = formData.get('text') as string | null;

  const errors = {
    name: name ? null : 'Name is required.',
    text: text ? null : 'Alert text is required.',
  };
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json<ActionData>({ success: false, errors });
  }

  await createAlert({ name: name!, text: text! });

  return json<ActionData>({ success: true });
};

export default function Index() {
  const actionData = useActionData<ActionData>();
  const errors = actionData?.errors;

  return (
    <div>
      <h1>Create an Alert in Slack</h1>

      <Form method="post">
        <div className="form-group">
          <label htmlFor="nameInput">Your name</label>
          <input id="nameInput" name="name" />
          {errors?.name && <p className="validation-error">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="textInput">Alert text</label>
          <textarea id="textInput" name="text" rows={6} />
          {errors?.text && <p className="validation-error">{errors.text}</p>}
        </div>

        <button type="submit">Create alert</button>
      </Form>

      {actionData?.success && <p className="success">Created alert!</p>}
    </div>
  );
}
