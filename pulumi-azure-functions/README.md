# pulumi-azure-functions

This example is explained in depth in the blog article [Deploying Azure Functions with Pulumi and Zero](https://www.tryzero.com/blog/deploying-azure-functions-with-pulumi-and-zero).

## Useful commands

Run the application locally:

```shell
cd MyFunctionProject
npm start
```

Semi-manual deployment to Azure:

```shell
cd MyFunctionProject
npm run build

cd ..
pulumi up
```

Automated deployment to Azure — see the blog post for the full setup instructions:

```shell
npm run deploy
```
