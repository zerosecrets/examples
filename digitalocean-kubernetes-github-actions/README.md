# DigitalOcean Kubernetes + GitHub Actions + Segment

This example is explained in depth in these blog articles:

- [Deploy Containers to DigitalOcean Kubernetes with GitHub Actions](https://www.tryzero.com/blog/deploy-containers-to-digitalocean-kubernetes-with-gitHub-actions)
- (Upcoming) [Gain Insight into your Users with Twilio Segment and Next.js](https://www.tryzero.com/blog/gain-insight-into-your-users-with-twilio-segment-and-next-js)

## Useful commands

- `ZERO_TOKEN='...' npm run dev` - run the website locally
- `docker build -t nextjs-docker .` - build the container image
- `docker run -p 3000:3000 nextjs-docker` - run the container

## TODO

If you want to run this example, you need to...

1. Create a Zero token and add DigitalOcean and Segment secrets to it.
1. Put your container registry and Kubernetes cluster names in the GitHub workflow (`nextjs-docker.yml`).
