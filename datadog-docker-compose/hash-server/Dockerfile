FROM rust:1.63 AS builder

WORKDIR /app
COPY . .
RUN cargo build --release

FROM debian:buster-slim
COPY --from=builder /app/target/release/hash-server /app/target/release/hash-server

ENTRYPOINT ["/app/target/release/hash-server"]