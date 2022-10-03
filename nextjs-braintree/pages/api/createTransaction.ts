// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import {
  BRAINTREE_VERSION,
  BRAINTREE_GRAPHQL_ENDPOINT,
  TransactionInput,
  ChargePaymentMethodInput,
  CHARGE_PAYMENT_METHOD_MUTATION,
  ChargePaymentMethodResponse,
} from '../../braintreeApi';
import { fetchBraintreeApiKey } from '../../braintreeApi/fetchBraintreeApiKey';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== 'POST') {
      throw new Error('Method must be POST.');
    }

    const paymentMethodId = req.body.paymentMethodId;

    if (typeof paymentMethodId !== 'string' || paymentMethodId.length === 0) {
      throw new Error('paymentMethodId was not provided.');
    }

    const apiKey = await fetchBraintreeApiKey();

    const transaction: TransactionInput = {
      amount: 10,
    };

    const chargePaymentMethodInput: ChargePaymentMethodInput = {
      paymentMethodId,
      transaction: transaction,
    };

    const body = {
      query: CHARGE_PAYMENT_METHOD_MUTATION,
      variables: {
        input: chargePaymentMethodInput,
      },
    };

    const response = await fetch(BRAINTREE_GRAPHQL_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${apiKey}`,
        'Braintree-Version': BRAINTREE_VERSION,
      },
    });

    const { data } = (await response.json()) as ChargePaymentMethodResponse;
    const transactionResponse = data.chargePaymentMethod.transaction;

    res
      .status(200)
      .json(
        `Transaction ${transactionResponse.id} created successfully. ` +
          `Status = ${transactionResponse.status}`
      );
  } catch (e) {
    res
      .status(500)
      .json(
        e instanceof Error ? `${e.message}\n\n${e.stack}` : 'Unknown error.'
      );
  }
}
