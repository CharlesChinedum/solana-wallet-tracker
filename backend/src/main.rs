// Basic structure
use axum::{Json, Router, extract::Path, http::StatusCode, routing::get};
use serde::{Deserialize, Serialize};
use solana_client::rpc_client::RpcClient;
use solana_sdk::pubkey::Pubkey;
use solana_transaction_status::UiTransactionEncoding;
use std::sync::Arc;
use tower_http::cors::{Any, CorsLayer};
// Define response structures
#[derive(Serialize, Deserialize)]
struct WalletActivity {
    signature: String,
    timestamp: Option<i64>,
    slot: u64,
    confirmation_status: Option<String>,
    sol_amount: Option<f64>,
    fee: Option<u64>,
    status: String,
    block_time: Option<String>,
}

#[derive(Serialize, Deserialize)]
struct ErrorResponse {
    error: String,
}

// App state to share RpcClient across handlers
#[derive(Clone)]
struct AppState {
    rpc_client: Arc<RpcClient>,
}

#[tokio::main]
async fn main() {
    // Connect to Solana
    let rpc_url = "https://api.mainnet-beta.solana.com";
    let client = RpcClient::new(rpc_url);

    // Wrap in Arc for shared state
    let state = AppState {
        rpc_client: Arc::new(client),
    };

    let origins = [
        "http://localhost:3000"
            .parse::<http::HeaderValue>()
            .unwrap(),
        "https://solana-wallet-tracker-lime.vercel.app"
            .parse::<http::HeaderValue>()
            .unwrap(),
    ];

    // Configure CORS
    let cors = CorsLayer::new()
        // Allow requests from your frontend (adjust port if needed)
        .allow_origin(origins)
        // Allow additional origins if needed (for production)
        // .allow_origin("https://yourdomain.com".parse::<http::HeaderValue>().unwrap())
        // Or allow any origin (use cautiously, only for development)
        // .allow_origin(Any)
        .allow_methods([http::Method::GET, http::Method::POST, http::Method::OPTIONS])
        .allow_headers(Any);

    let app = Router::new()
        .without_v07_checks()
        .route(
            "/api/wallet/{address}/activities",
            get(handle_get_wallet_activities),
        )
        .layer(cors) // Add CORS layer
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3004").await.unwrap();

    println!("Server running on http://0.0.0.0:3004");
    println!(
        "CORS enabled for {} {}",
        "http://localhost:3000", "https://solana-wallet-tracker-lime.vercel.app"
    );
    axum::serve(listener, app).await.unwrap();
}

async fn handle_get_wallet_activities(
    axum::extract::State(state): axum::extract::State<AppState>,
    Path(address): Path<String>,
) -> Result<Json<Vec<WalletActivity>>, (StatusCode, Json<ErrorResponse>)> {
    let pubkey = address.parse::<Pubkey>().map_err(|e| {
        (
            StatusCode::BAD_REQUEST,
            Json(ErrorResponse {
                error: format!("Invalid address: {}", e),
            }),
        )
    })?;

    let client = state.rpc_client.clone();
    let wallet_pubkey = pubkey.clone();

    // Fetch signatures with limit
    let signatures = tokio::task::spawn_blocking(move || {
        client.get_signatures_for_address_with_config(
            &pubkey,
            solana_client::rpc_client::GetConfirmedSignaturesForAddress2Config {
                limit: Some(10), // Adjust as needed
                ..Default::default()
            },
        )
    })
    .await
    .map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(ErrorResponse {
                error: format!("Task error: {}", e),
            }),
        )
    })?
    .map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(ErrorResponse {
                error: format!("Solana RPC error: {}", e),
            }),
        )
    })?;

    // Fetch full transaction details for each signature
    let mut activities = Vec::new();

    for sig_info in signatures {
        let client = state.rpc_client.clone();
        let signature = sig_info.signature.clone();
        let wallet_pubkey_clone = wallet_pubkey.clone();

        let transaction = tokio::task::spawn_blocking(move || {
            client.get_transaction(
                &signature.parse().unwrap(),
                UiTransactionEncoding::JsonParsed,
            )
        })
        .await
        .ok()
        .and_then(|result| result.ok());

        // Calculate SOL amount transferred
        let sol_amount = if let Some(ref tx) = transaction {
            calculate_sol_transfer(&tx, &wallet_pubkey_clone)
        } else {
            None
        };

        // Get fee
        let fee = transaction
            .as_ref()
            .and_then(|tx| tx.transaction.meta.as_ref())
            .map(|meta| meta.fee);

        // Format timestamp
        let block_time = sig_info.block_time.map(|ts| {
            chrono::DateTime::from_timestamp(ts, 0)
                .map(|dt| dt.format("%Y-%m-%d %H:%M:%S UTC").to_string())
                .unwrap_or_else(|| "Unknown".to_string())
        });

        let activity = WalletActivity {
            signature: sig_info.signature,
            timestamp: sig_info.block_time,
            slot: sig_info.slot,
            confirmation_status: sig_info.confirmation_status.map(|s| format!("{:?}", s)),
            sol_amount,
            fee,
            status: if sig_info.err.is_none() {
                "success".to_string()
            } else {
                "failed".to_string()
            },
            block_time,
        };

        activities.push(activity);
    }

    println!(
        "Found {} activities for address: {}",
        activities.len(),
        address
    );

    Ok(Json(activities))
}

// Helper function to calculate SOL transfer amount
fn calculate_sol_transfer(
    transaction: &solana_transaction_status::EncodedConfirmedTransactionWithStatusMeta,
    wallet_pubkey: &Pubkey,
) -> Option<f64> {
    let meta = transaction.transaction.meta.as_ref()?;

    // Find the wallet's index in account keys based on message type
    let wallet_index = if let solana_transaction_status::EncodedTransaction::Json(ui_tx) =
        &transaction.transaction.transaction
    {
        match &ui_tx.message {
            solana_transaction_status::UiMessage::Parsed(parsed_message) => {
                // For parsed messages, account_keys is Vec<TransactionParsedAccount>
                parsed_message
                    .account_keys
                    .iter()
                    .position(|key| key.pubkey == wallet_pubkey.to_string())
            }
            solana_transaction_status::UiMessage::Raw(raw_message) => {
                // For raw messages, account_keys is Vec<String>
                raw_message
                    .account_keys
                    .iter()
                    .position(|key| key == &wallet_pubkey.to_string())
            }
        }
    } else {
        return None;
    }?;

    let pre_balance = meta.pre_balances.get(wallet_index)?;
    let post_balance = meta.post_balances.get(wallet_index)?;

    // Calculate difference (negative = sent, positive = received)
    let lamports_diff = *post_balance as i64 - *pre_balance as i64;

    // Convert lamports to SOL (1 SOL = 1_000_000_000 lamports)
    Some(lamports_diff as f64 / 1_000_000_000.0)
}
