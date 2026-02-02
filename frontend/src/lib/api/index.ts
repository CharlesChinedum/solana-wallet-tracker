import axios from "axios";
import type { WalletActivity } from "@/types/wallet";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3004";

export const walletApi = {
  async getActivities(address: string): Promise<WalletActivity[]> {
    try {
      const response = await axios.get<WalletActivity[]>(
        `${API_BASE_URL}/api/wallet/${address}/activities`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error || "Failed to fetch wallet activities",
        );
      }
      throw error;
    }
  },
};
