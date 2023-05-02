# cdk8s-nginx

This example is explained in depth in the blog article [Use cdk8s to Define your Kubernetes Manifest with TypeScript](https://www.tryzero.com/blog/use-cdk8s-to-define-your-kubernetes-manifest-with-typescript).

## Useful commands

Synthesize the manifest:

```shell
npm run build
```

Deploy the manifest to the cluster:

```shell
kubectl apply -f dist/nginx-project.k8s.yaml
```
