export interface WalletActivity {
  signature: string;
  timestamp: number | null;
  slot: number;
  confirmation_status: string | null;
  sol_amount: number | null;
  fee: number | null;
  status: "success" | "failed";
  block_time: string | null;
}

export interface ErrorResponse {
  error: string;
}
