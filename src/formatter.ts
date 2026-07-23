export function formatter(
  value: number | string | null | undefined,
  prefix: string = "Rp",
): string {
  // Default to 0 if null or undefined
  const amount = value === null || value === undefined ? 0 : Number(value);

  try {
    // Use en-US formatting for comma-separator and dot-decimal
    const formatted = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    return prefix ? `${prefix} ${formatted}` : formatted;
  } catch {
    return prefix ? `${prefix} ${amount}` : String(amount);
  }
}
