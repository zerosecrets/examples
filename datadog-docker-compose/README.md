# datadog-docker-compose

This example is explained in depth in the blog article (Upcoming) [Monitor Containerized Applications with Datadog and Docker Compose](https://www.tryzero.com/blog/monitor-containerized-applications-with-datadog-and-docker-compose).

## Useful commands

### `hash-server`

- `cargo run` - build & run the server binary directly on your system
- `docker build -t hash-server .` - built the Docker image
- `docker run -p 8080:8080 --init hash-server` - run the server as a container
- `curl telnet://127.0.0.1:8080 <<< testString` — send "testString" to the server over TCP

### `datadog-agent`

- `docker build -t datadog-agent .` — build the custom image
- `docker run --env ZERO_TOKEN='YOUR-ZERO-TOKEN' datadog-agent` — run the container by itself

### Docker Compose

- `ZERO_TOKEN='YOUR-ZERO-TOKEN' docker compose up --build` — run the `hash-server` and Datadog agent servers

## TODO

If you want to run this example, you need to...

1. Create a Zero token and add the Datadog API key as a secret.
