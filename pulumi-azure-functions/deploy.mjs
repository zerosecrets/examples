#!/usr/bin/env zx

import { zero } from '@zerosecrets/zero';

if (!process.env.ZERO_TOKEN) {
  throw new Error('Did you forget to set the ZERO_TOKEN environment variable?');
}

const secrets = await zero({
  token: process.env.ZERO_TOKEN,
  pick: ['azure', 'pulumi'],
  callerName: 'development',
}).fetch();

const azureClientId = secrets.azure.client_id;
const azureClientSecret = secrets.azure.client_secret;
const azureTenantId = secrets.azure.tenant_id;
const azureSubscriptionId = secrets.azure.subscription_id;
const pulumiAccessToken = secrets.pulumi.pulumi_access_token;

await $`pulumi config set azure-native:clientId ${azureClientId}`;

// zx prints the commands you run by default. Do not print the next command
// since it contains our client secret
$.verbose = false;
await $`pulumi config set azure-native:clientSecret ${azureClientSecret} --secret`;
$.verbose = true;

await $`pulumi config set azure-native:tenantId ${azureTenantId}`;
await $`pulumi config set azure-native:subscriptionId ${azureSubscriptionId}`;

cd('MyFunctionProject');
await $`npm run build`;

cd('..');

process.env.PULUMI_ACCESS_TOKEN = pulumiAccessToken;

await $`pulumi up --skip-preview`;
