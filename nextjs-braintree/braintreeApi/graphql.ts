// createClientToken

export const CREATE_CLIENT_TOKEN_MUTATION = `
mutation createClientToken($input: CreateClientTokenInput) {
  createClientToken(input: $input) {
    clientToken
  }
}`.trim();

export interface CreateClientTokenResponse {
  data: { createClientToken: { clientToken: string } };
}

// tokenizeCreditCard

export const TOKENIZE_CREDIT_CARD_MUTATION = `
mutation tokenizeCreditCard($input: TokenizeCreditCardInput!) {
  tokenizeCreditCard(input: $input) {
    paymentMethod {
      id
    }
  }
}`.trim();

export interface TokenizeCreditCardResponse {
  data: {
    tokenizeCreditCard: {
      paymentMethod: {
        id: string;
      };
    };
  };
}

export interface AddressInput {
  company?: string;
  streetAddress?: string;
  addressLine1?: string;
  extendedAddress?: string;
  addressLine2?: string;
  firstName?: string;
  lastName?: string;
  locality?: string;
  adminArea2?: string;
  region?: string;
  adminArea1?: string;
  postalCode?: string;
  countryCode?: string;
}

export interface CreditCardInput {
  number: string;
  expirationYear: string;
  expirationMonth: string;
  cvv: string;
  cardholderName: string;
  billingAddress: AddressInput;
}

export interface TokenizeCreditCardInput {
  creditCard: CreditCardInput;
}

// chargePaymentMethod

export const CHARGE_PAYMENT_METHOD_MUTATION = `
mutation chargePaymentMethod($input: ChargePaymentMethodInput!) {
  chargePaymentMethod(input: $input) {
    transaction {
      id
      status
    }
  }
}
`.trim();

export interface ChargePaymentMethodResponse {
  data: {
    chargePaymentMethod: {
      transaction: {
        id: string;
        status: string;
      };
    };
  };
}

export interface TransactionInput {
  amount: number;

  // Many additional properties omitted for simplicity
}

export interface ChargePaymentMethodInput {
  paymentMethodId: string;
  transaction: TransactionInput;
}
