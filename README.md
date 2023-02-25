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
