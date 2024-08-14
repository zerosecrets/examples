_Examples of Zero SDKs and integrations usage. Some of the examples are explained in [the blog](https://tryzero.com/blog)_.

### [`lambda-sendgrid-cdk`](https://github.com/zerosecrets/examples/tree/main/lambda-sendgrid-cdk)

A CDK stack that deploys a Lambda function. The function sends an email using SendGrid after being called through API Gateway.

### [`nextjs-stripe`](https://github.com/zerosecrets/examples/tree/main/nextjs-stripe)

A Next.js application that allows purchasing a mock product through the Stripe API, using a prebuilt checkout page.

### [`digitalocean-kubernetes-github-actions`](https://github.com/zerosecrets/examples/tree/main/digitalocean-kubernetes-github-actions)

A Next.js application with a GitHub Actions workflow that builds the application into a Docker image and then deploys the image to a DigitalOcean Kubernetes cluster. The application displays a button which logs an analytics event with Segment when clicked.

### [`datadog-docker-compose`](https://github.com/zerosecrets/examples/tree/main/datadog-docker-compose)

A Rust TCP client & server. The server runs as a container which logs to `stdout`. There is a custom Datadog agent container which fetches the Datadog API key from Zero and collects logs from the TCP server.

### [`nextjs-braintree`](https://github.com/zerosecrets/examples/tree/main/nextjs-braintree)

A simple Next.js application that illustrates how to charge a credit card using the Braintree GraphQL API.

### [`recaptcha-django`](https://github.com/zerosecrets/examples/tree/main/recaptcha-django)

A Python web app built on Django that renders a user signup form. The form is protected from automated abuse by bots thanks to invisible reCAPTCHA v2.

### [`slack-alerts`](https://github.com/zerosecrets/examples/tree/main/slack-alerts)

A Remix web app that allows you to create an alert in Slack by submitting a form.

### [`work-queue`](https://github.com/zerosecrets/examples/tree/main/work-queue)

An implementation of the work queue pattern, which is useful for performing computationally-intense tasks outside of your main web server process. In this demonstration project, the Next.js frontend sends a message to an Amazon SQS message queue. The message is then processed by an AWS Lambda worker function.

### [`mailchimp-transactional`](https://github.com/zerosecrets/examples/tree/main/mailchimp-transactional)

A simple Next.js web app that shows a mock user sign up form. If you enter your email address and submit the form, the application will send you an email via the Mailchimp Transactional Email API.

### [`twilio-sms`](https://github.com/zerosecrets/examples/tree/main/twilio-sms)

An Azure Functions project written in TypeScript with a single HTTP-triggered function. When called, the function sends an SMS text message via Twilio's API.

### [`cdk8s-nginx`](https://github.com/zerosecrets/examples/tree/main/cdk8s-nginx)

A cdk8s project that builds a Kubernetes manifest to deploy the nginx web server. The manifest can be applied to a Kubernetes cluster running in the cloud, for example DigitalOcean Kubernetes.

### [`pulumi-azure-functions`](https://github.com/zerosecrets/examples/tree/main/pulumi-azure-functions)

An Azure Functions project written in TypeScript with a single HTTP-triggered function. The Azure infrastructure is defined using the Pulumi Infrastructure as Code platform. You can deploy the application to Azure simply by running `pulumi up`.

### [`openai-api`](https://github.com/zerosecrets/examples/tree/main/openai-api)

A REST API written in TypeScript / Express that accepts the description of a service from a payment invoice and returns the category of the service. It accomplishes this by leveraging the OpenAI API and GPT.

### [`hubspot`](https://github.com/zerosecrets/examples/tree/main/hubspot)

A full stack web application written using Svelte and Node.js + Express that displays a lead capture form. When the user submits the form, the backend uses the HubSpot API to create a new contact in HubSpot.

### [`github-linear-sync`](https://github.com/zerosecrets/examples/tree/main/github-linear-sync)

A Vercel serverless function that is called from a GitHub webhook when a pull request review is submitted. The function then uses the Linear API to update the status of a Linear issue to Has Feedback.

### [`docusign`](https://github.com/zerosecrets/examples/tree/main/docusign)

A Node.js web application that implements the DocuSign embedded signing workflow to get the user's signature on a document. The code is powered by the DocuSign eSignature REST API.

### [`gmail-claude`](https://github.com/zerosecrets/examples/tree/main/gmail-claude)

A Node.js web application that watches your Gmail inbox for new emails. When an email is received, the application uses the Claude AI assistant to summarize the email and then sends you the summary on Slack as a DM.

### [`nextjs-sendgrid`](https://github.com/zerosecrets/examples/tree/main/nextjs-sendgrid)

A Next.js web application that displays a purchase confirmation form. When you enter your email address in the form, it calls a backend API method which sends off a transactional email using the SendGrid API.

### [`terraform-cloudfront`](https://github.com/zerosecrets/examples/tree/main/terraform-cloudfront)

A Terraform project that creates an Amazon Cloudfront distribution which serves a static website hosted in S3. This directory also contains a trivial Next.js app that can be used for testing purposes.

### [`auth0`](https://github.com/zerosecrets/examples/tree/main/auth0)

A Next.js app that uses the Auth0 Next.js SDK to implement authentication. The demo app displays log in / log out buttons and the email address of the current user, if signed in.

### [`pusher`](https://github.com/zerosecrets/examples/tree/main/pusher)

A Next.js app that implements real-time in-app notifications via Pusher. You can manually send a notification via a form, and the server will broadcast that notification to all clients.

### [`rollbar`](https://github.com/zerosecrets/examples/tree/main/rollbar)

An Express.js web API with error logging implemented via Rollbar.
