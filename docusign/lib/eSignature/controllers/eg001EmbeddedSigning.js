/**
 * @file
 * Example 001: Use embedded signing
 * @author DocuSign
 */

const path = require('path');
const { sendEnvelopeForEmbeddedSigning } = require('../../../embeddedSigning');
const validator = require('validator');
const { getExampleByNumber } = require('../../manifestService');
const dsConfig = require('../../../config/index.js').config;
const { API_TYPES, isCFR } = require('../../utils.js');

const eg001EmbeddedSigning = exports;
const exampleNumber = 1;
const eg = `eg00${exampleNumber}`; // This example reference.
const api = API_TYPES.ESIGNATURE;
const mustAuthenticate = '/ds/mustAuthenticate';
const minimumBufferMin = 3;
const signerClientId = 1000; // The id of the signer within this application.
const demoDocsPath = path.resolve(__dirname, '../../../demo_documents');
const pdf1File = 'World_Wide_Corp_lorem.pdf';
const dsReturnUrl = dsConfig.appUrl + '/ds-return';
const dsPingUrl = dsConfig.appUrl + '/'; // Url that will be pinged by the DocuSign signing via Ajax

/**
 * Create the envelope, the embedded signing, and then redirect to the DocuSign signing
 * @param {object} req Request obj
 * @param {object} res Response obj
 */
eg001EmbeddedSigning.createController = async (req, res) => {
  // Step 1. Check the token
  // At this point we should have a good token. But we
  // double-check here to enable a better UX to the user.
  const isTokenOK = req.dsAuth.checkToken(minimumBufferMin);
  if (!isTokenOK) {
    req.flash('info', 'Sorry, you need to re-authenticate.');
    // Save the current operation so it will be resumed after authentication
    req.dsAuth.setEg(req, eg);
    return res.redirect(mustAuthenticate);
  }

  // Step 2. Call the worker method
  const { body } = req;
  const envelopeArgs = {
    signerEmail: validator.escape(body.signerEmail),
    signerName: validator.escape(body.signerName),
    signerClientId: signerClientId,
    dsReturnUrl: dsReturnUrl,
    dsPingUrl: dsPingUrl,
    docFile: path.resolve(demoDocsPath, pdf1File),
  };
  const args = {
    accessToken: req.user.accessToken,
    basePath: req.session.basePath,
    accountId: req.session.accountId,
    envelopeArgs: envelopeArgs,
  };
  let results = null;

  try {
    results = await sendEnvelopeForEmbeddedSigning(args);
  } catch (error) {
    const errorBody = error && error.response && error.response.body;
    // we can pull the DocuSign error code and message from the response body
    const errorCode = errorBody && errorBody.errorCode;
    const errorMessage = errorBody && errorBody.message;
    // In production, may want to provide customized error messages and
    // remediation advice to the user.
    res.render('pages/error', { err: error, errorCode, errorMessage });
  }
  if (results) {
    // Redirect the user to the embedded signing
    // Don't use an iFrame!
    // State can be stored/recovered using the framework's session or a
    // query parameter on the returnUrl (see the makeRecipientViewRequest method)
    res.redirect(results.redirectUrl);
  }
};

/**
 * Form page for this application
 */
eg001EmbeddedSigning.getController = async (req, res) => {
  // Check that the authentication token is ok with a long buffer time.
  // If needed, now is the best time to ask the user to authenticate
  // since they have not yet entered any information into the form.
  const isTokenOK = req.dsAuth.checkToken();
  if (!isTokenOK) {
    // Save the current operation so it will be resumed after authentication
    req.dsAuth.setEg(req, eg);
    return res.redirect(mustAuthenticate);
  }

  let enableCFR = await isCFR(
    req.user.accessToken,
    req.session.accountId,
    req.session.basePath,
  );
  if (enableCFR === 'enabled') {
    res.locals.statusCFR = 'enabled';
  }

  const example = getExampleByNumber(res.locals.manifest, exampleNumber, api);
  if (res.locals.quickACG && res.locals.statusCFR === 'enabled') {
    res.redirect('/eg041');
  } else if (res.locals.quickACG) {
    res.render('pages/examples/quickEmbeddedSigning', {
      eg: eg,
      csrfToken: req.csrfToken(),
      title: 'Use embedded signing',
      example: example,
      sourceFile: path.basename(__filename),
      sourceUrl:
        'https://github.com/docusign/code-examples-node/blob/master/embeddedSigning.js',
      documentation: dsConfig.documentation + eg,
      showDoc: dsConfig.documentation,
    });
  } else if (
    res.locals.statusCFR === 'enabled' &&
    dsConfig.quickstart === 'true'
  ) {
    res.redirect('/eg041');
  } else if (res.locals.statusCFR === 'enabled') {
    res.render('pages/invalid_with_cfr', {
      title: 'Not CFR Part 11 compatible',
    });
  } else {
    res.render('pages/examples/eg001EmbeddedSigning', {
      eg: eg,
      csrfToken: req.csrfToken(),
      example: example,
      sourceFile: path.basename(__filename),
      sourceUrl:
        'https://github.com/docusign/code-examples-node/blob/master/embeddedSigning.js',
      documentation: dsConfig.documentation + eg,
      showDoc: dsConfig.documentation,
    });
  }
};
