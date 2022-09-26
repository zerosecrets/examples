use hex;
use sha2::{Digest, Sha256};
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::TcpListener;
use tracing;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing::subscriber::set_global_default(
        tracing_subscriber::fmt()
            .with_max_level(tracing::Level::TRACE)
            .json()
            .finish(),
    )
    .unwrap();

    tracing::debug!("Attempting to bind TCP port...");

    let listener = TcpListener::bind("0.0.0.0:8080").await?;

    tracing::debug!("Now listening on port 8080.");

    loop {
        let (mut socket, _) = listener.accept().await?;

        tokio::spawn(async move {
            let mut buf = [0; 1024];

            // In a loop, read data from the socket and write the data back.
            loop {
                let n = match socket.read(&mut buf).await {
                    // socket closed
                    Ok(n) if n == 0 => return,
                    Ok(n) if n == 1 => {
                        // We received a newline character and nothing else
                        tracing::warn!("Input is invalid.");
                        continue;
                    }
                    Ok(n) => n,
                    Err(e) => {
                        tracing::error!("failed to read from socket; err = {:?}", e);
                        return;
                    }
                };

                tracing::debug!("Input is valid.");

                tracing::debug!("Generating hash...");

                let mut hasher = Sha256::new();

                // Write input message without the trailing newline
                hasher.update(&buf[0..(n - 1)]);

                // Read hash digest and consume hasher
                let result = hasher.finalize();

                let hex = hex::encode(result) + "\n";
                let hex_bytes = (&hex).as_bytes();

                tracing::info!("Successfully generated hash.");

                // Write the hash to the socket
                if let Err(e) = socket.write_all(&hex_bytes).await {
                    tracing::error!("failed to write to socket; err = {:?}", e);
                    return;
                }
            }
        });
    }
}
