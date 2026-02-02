export const formatSolAmount = (amount: number | null): string => {
  if (amount === null) return "N/A";
  const absAmount = Math.abs(amount);
  return `${amount >= 0 ? "+" : "-"}${absAmount.toFixed(4)} SOL`;
};

export const formatFee = (fee: number | null): string => {
  if (fee === null) return "N/A";
  return `${(fee / 1_000_000_000).toFixed(6)} SOL`;
};

export const shortenAddress = (address: string, chars = 4): string => {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

export const formatTimestamp = (timestamp: number | null): string => {
  if (!timestamp) return "N/A";
  return new Date(timestamp * 1000).toLocaleString();
};
