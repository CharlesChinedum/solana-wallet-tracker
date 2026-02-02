// Basic structure
use axum::{
    Json, Router,
    body::Bytes,
    http::{
        StatusCode, Uri,
        header::{self, HeaderMap, HeaderName},
    },
    response::{Html, IntoResponse},
    routing::get,
};
use solana_client::rpc_client::RpcClient;
use solana_sdk::pubkey::Pubkey;
// mod routes;

#[tokio::main]
async fn main() {
    // // Connect to Solana
    // let rpc_url = "https://api.mainnet-beta.solana.com";
    // let client = RpcClient::new(rpc_url);

    // // Fetch signatures for address
    // let address = "YourWalletAddressHere".parse::<Pubkey>();
    // let signatures = client.get_signatures_for_address(&address);
    // // println!("Hello, world!");
    // print!("{:?}", address)

    // let app = Router::new().route("/", get(|| async { "Hello, World!" }));
    // let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    // axum::serve(listener, app).await.unwrap();
    let app = Router::new()
        .route("/", get(root))
        .route("/foo", get(get_foo).post(post_foo))
        .route("/foo/bar", get(foo_bar))
        .route("/json", get(json_res))
        .route("/html", get(html_res))
        .route("/status", get(status))
        .route("/echo", get(echo));

    async fn root(uri: Uri) -> String {
        // "root route".to_string()

        // String will get a `text/plain; charset=utf-8` content-type
        format!("Hi from {}", uri.path())
    }
    async fn get_foo() {
        println!("get foo route")
    }
    async fn post_foo() {
        println!("post foo route")
    }
    async fn foo_bar() {
        println!("foo bar route")
    }

    async fn echo(body: Bytes) -> Result<String, StatusCode> {
        if let Ok(string) = String::from_utf8(body.to_vec()) {
            Ok(string)
        } else {
            Err(StatusCode::BAD_REQUEST)
        }
    }

    async fn json_res() -> Json<Vec<String>> {
        Json(vec!["foo".to_owned(), "bar".to_owned()])
    }

    async fn html_res() -> Html<&'static str> {
        Html("<p>Hello, World!</p>")
    }

    // `StatusCode` gives an empty response with that status code
    async fn status() -> StatusCode {
        // StatusCode::NOT_FOUND
        // StatusCode::CREATED
        StatusCode::ACCEPTED
    }

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();

    // routes::run();
}
