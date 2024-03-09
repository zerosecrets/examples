/**
 * @file
 * Example 041: Use embedded signing with a CFR account
 * @author DocuSign
 */

const fs = require('fs-extra');
const docusign = require('docusign-esign');

/**
 * This function does the work of creating the envelope and the
 * embedded signing
 * @param {object} args
 */
const sendEnvelopeForEmbeddedSigning = async (args) => {
  // Data for this method
  // args.basePath
  // args.accessToken
  // args.accountId

  //ds-snippet-start:eSign41Step2
  let dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath(args.basePath);
  dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + args.accessToken);

  // Obtain your workflowId
  let accountsApi = new docusign.AccountsApi(dsApiClient);
  let workflowId = null;

  let workflowResults = await accountsApi.getAccountIdentityVerification(
    args.accountId
  );

  // Find the workflow ID corresponding to the name "Phone Authentication"
  workflowResults.identityVerification.forEach(workflow => {
    if (workflow.defaultName === 'SMS for access & signatures') {
      workflowId = workflow.workflowId;
    }
  });
  //ds-snippet-end:eSign41Step2

  if (workflowId === null) {
    throw new Error('IDENTITY_WORKFLOW_INVALID_ID');
  }

  args.envelopeArgs.workflowId = workflowId;

  let envelopesApi = new docusign.EnvelopesApi(dsApiClient);
    let results = null;

  // Make the envelope request body
  //ds-snippet-start:eSign41Step4
  let envelope = makeEnvelope(args.envelopeArgs);

  // call Envelopes::create API method
  // Exceptions will be caught by the calling function
  results = await envelopesApi.createEnvelope(args.accountId, {
    envelopeDefinition: envelope,
  });

  let envelopeId = results.envelopeId;
  //ds-snippet-end:eSign41Step4
  console.log(`Envelope was created. EnvelopeId ${envelopeId}`);

  // create the recipient view, the embedded signing
  //ds-snippet-start:eSign41Step6
  let viewRequest = makeRecipientViewRequest(args.envelopeArgs);

  // Call the CreateRecipientView API
  // Exceptions will be caught by the calling function
  results = await envelopesApi.createRecipientView(args.accountId, envelopeId, {
    recipientViewRequest: viewRequest,
  });
  //ds-snippet-end:eSign41Step6

  return { envelopeId: envelopeId, redirectUrl: results.url };
};

/**
 * Creates envelope
 * @function
 * @param {Object} args parameters for the envelope:
 * @returns {Envelope} An envelope definition
 * @private
 */
//ds-snippet-start:eSign41Step3
function makeEnvelope(args) {
  // Data for this method
  // args.signerEmail
  // args.signerName
  // args.signerClientId
  // docFile

  // document 1 (pdf) has tag /sn1/
  //
  // The envelope has one recipients.
  // recipient 1 - signer

  let docPdfBytes;
  // read file from a local directory
  // The read could raise an exception if the file is not available!
  docPdfBytes = fs.readFileSync(args.docFile);

  // create the envelope definition
  let env = new docusign.EnvelopeDefinition();
  env.emailSubject = 'Please sign this document';

  // add the documents
  let doc1 = new docusign.Document();
    let doc1b64 = Buffer.from(docPdfBytes).toString('base64');
  doc1.documentBase64 = doc1b64;
  doc1.name = 'Lorem Ipsum'; // can be different from actual file name
  doc1.fileExtension = 'pdf';
  doc1.documentId = '3';

  // The order in the docs array determines the order in the envelope
  env.documents = [doc1];

  // Create a signer recipient to sign the document, identified by name and email
  // We set the clientUserId to enable embedded signing for the recipient
  // We're setting the parameters via the object creation
  let signer1 = docusign.Signer.constructFromObject({
    email: args.signerEmail,
    name: args.signerName,
    clientUserId: args.signerClientId,
    recipientId: 1,
    identityVerification: { workflowId: args.workflowId, steps: null, inputOptions: [{name: 'phone_number_list', valueType: 'PhoneNumberList', phoneNumberList: [{countryCode: args.countryCode, code: '1', number: args.phoneNumber}]}], idCheckConfigurationName: ''}
  });

  // Create signHere fields (also known as tabs) on the documents,
  // We're using anchor (autoPlace) positioning
  //
  // The DocuSign platform seaches throughout your envelope's
  // documents for matching anchor strings.
  let signHere1 = docusign.SignHere.constructFromObject({
    anchorString: '/sn1/',
    anchorYOffset: '-30',
    anchorUnits: 'pixels',
    anchorXOffset: '20',
  });
  // Tabs are set per recipient / signer
  let signer1Tabs = docusign.Tabs.constructFromObject({
    signHereTabs: [signHere1],
  });
  signer1.tabs = signer1Tabs;

  // Add the recipient to the envelope object
  let recipients = docusign.Recipients.constructFromObject({
    signers: [signer1],
  });
  env.recipients = recipients;

  // Request that the envelope be sent by setting |status| to "sent".
  // To request that the envelope be created as a draft, set to "created"
  env.status = 'sent';

  return env;
}
//ds-snippet-end:eSign41Step3

//ds-snippet-start:eSign41Step5
function makeRecipientViewRequest(args) {
  // Data for this method
  // args.dsReturnUrl
  // args.signerEmail
  // args.signerName
  // args.signerClientId
  // args.dsPingUrl

  let viewRequest = new docusign.RecipientViewRequest();

  // Set the url where you want the recipient to go once they are done signing
  // should typically be a callback route somewhere in your app.
  // The query parameter is included as an example of how
  // to save/recover state information during the redirect to
  // the DocuSign signing. It's usually better to use
  // the session mechanism of your web framework. Query parameters
  // can be changed/spoofed very easily.
  viewRequest.returnUrl = args.dsReturnUrl + '?state=123';

  // How has your app authenticated the user? In addition to your app's
  // authentication, you can include authenticate steps from DocuSign.
  // Eg, SMS authentication
  viewRequest.authenticationMethod = 'none';

  // Recipient information must match embedded recipient info
  // we used to create the envelope.
  viewRequest.email = args.signerEmail;
  viewRequest.userName = args.signerName;
  viewRequest.clientUserId = args.signerClientId;

  // DocuSign recommends that you redirect to DocuSign for the
  // embedded signing. There are multiple ways to save state.
  // To maintain your application's session, use the pingUrl
  // parameter. It causes the DocuSign signing web page
  // (not the DocuSign server) to send pings via AJAX to your
  // app,
  viewRequest.pingFrequency = 600; // seconds
  // NOTE: The pings will only be sent if the pingUrl is an https address
  viewRequest.pingUrl = args.dsPingUrl; // optional setting

  return viewRequest;
}
//ds-snippet-end:eSig41Step5

module.exports = { sendEnvelopeForEmbeddedSigning };
