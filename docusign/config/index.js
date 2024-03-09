exports.docOptions = require('./documentOptions.json');
exports.docNames = require('./documentNames.json');
const settings = require('./appsettings.json');
exports.github = require('./github.json');
const { zero } = require('@zerosecrets/zero');

const dsOauthServer = settings.production
  ? 'https://account.docusign.com'
  : 'https://account-d.docusign.com';

settings.gatewayAccountId =
  process.env.DS_PAYMENT_GATEWAY_ID || settings.gatewayAccountId;
settings.signerEmail = process.env.DS_SIGNER_EMAIL || settings.signerEmail;
settings.signerName = process.env.DS_SIGNER_NAME || settings.signerName;
settings.dsClientId = process.env.DS_CLIENT_ID || settings.dsClientId;
settings.appUrl = process.env.DS_APP_URL || settings.appUrl;
settings.dsJWTClientId = process.env.DS_JWT_CLIENT_ID || settings.dsJWTClientId;
settings.privateKeyLocation =
  process.env.DS_PRIVATE_KEY_PATH || settings.privateKeyLocation;
settings.impersonatedUserGuid =
  process.env.DS_IMPERSONATED_USER_GUID || settings.impersonatedUserGuid;

exports.config = {
  dsOauthServer,
  ...settings,
};

exports.fetchDsClientSecret = async () => {
  if (!process.env.ZERO_TOKEN) {
    throw new Error(
      'Did you forget to set the ZERO_TOKEN environment variable?'
    );
  }

  const zeroResult = await zero({
    token: process.env.ZERO_TOKEN,
    pick: ['docusign'],
  }).fetch();

  return zeroResult.docusign.client_secret;
};
