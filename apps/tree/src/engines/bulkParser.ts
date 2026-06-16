/**
 * Parses and validates text input containing numbers separated by spaces, commas, or newlines.
 * Safely filters out and returns invalid tokens.
 */
export function parseBulkInput(input: string): { values: number[]; invalidTokens: string[] } {
  const values: number[] = [];
  const invalidTokens: string[] = [];

  // Standardize delimiters by replacing commas and newlines with space, then split by space
  const tokens = input.replace(/[\n,]/g, ' ').split(/\s+/);

  for (const token of tokens) {
    const trimmed = token.trim();
    if (trimmed === '') continue;

    // Validate if the token is a clean integer
    if (/^-?\d+$/.test(trimmed)) {
      const val = parseInt(trimmed, 10);
      if (!isNaN(val)) {
        values.push(val);
      }
    } else {
      invalidTokens.push(trimmed);
    }
  }

  return { values, invalidTokens };
}
