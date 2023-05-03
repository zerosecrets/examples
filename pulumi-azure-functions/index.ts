import * as resources from '@pulumi/azure-native/resources';
import * as storage from '@pulumi/azure-native/storage';
import * as web from '@pulumi/azure-native/web';
import * as pulumi from '@pulumi/pulumi';

import { getConnectionString, signedBlobReadUrl } from './helpers';

// Create an Azure Resource Group
const resourceGroup = new resources.ResourceGroup('resourceGroup');

// Create an Azure resource (Storage Account)
const storageAccount = new storage.StorageAccount('sa', {
  resourceGroupName: resourceGroup.name,
  sku: {
    name: storage.SkuName.Standard_LRS,
  },
  kind: storage.Kind.StorageV2,
});

// Function code archives will be stored in this container.
const codeContainer = new storage.BlobContainer('zips', {
  resourceGroupName: resourceGroup.name,
  accountName: storageAccount.name,
});

// Upload Azure Function's code as a zip archive to the storage account.
const codeBlob = new storage.Blob('zip', {
  resourceGroupName: resourceGroup.name,
  accountName: storageAccount.name,
  containerName: codeContainer.name,
  source: new pulumi.asset.FileArchive('./MyFunctionProject'),
});

// Define a Consumption Plan for the Function App.
// You can change the SKU to Premium or App Service Plan if needed.
const plan = new web.AppServicePlan('plan', {
  resourceGroupName: resourceGroup.name,
  sku: {
    name: 'Y1',
    tier: 'Dynamic',
  },
});

// Build the connection string and zip archive's SAS URL. They will go to Function App's settings.
const storageConnectionString = getConnectionString(
  resourceGroup.name,
  storageAccount.name
);
const codeBlobUrl = signedBlobReadUrl(
  codeBlob,
  codeContainer,
  storageAccount,
  resourceGroup
);

const app = new web.WebApp('fa', {
  resourceGroupName: resourceGroup.name,
  serverFarmId: plan.id,
  kind: 'functionapp',
  siteConfig: {
    appSettings: [
      { name: 'AzureWebJobsFeatureFlags', value: 'EnableWorkerIndexing' },
      { name: 'AzureWebJobsStorage', value: storageConnectionString },
      { name: 'FUNCTIONS_EXTENSION_VERSION', value: '~4' },
      { name: 'FUNCTIONS_WORKER_RUNTIME', value: 'node' },
      { name: 'WEBSITE_NODE_DEFAULT_VERSION', value: '~18' },
      { name: 'WEBSITE_RUN_FROM_PACKAGE', value: codeBlobUrl },
    ],
    http20Enabled: true,
    nodeVersion: '~18',
  },
});

export const endpoint = pulumi.interpolate`https://${app.defaultHostName}/api/HttpTrigger`;
