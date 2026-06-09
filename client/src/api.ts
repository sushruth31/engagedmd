export interface ValidationResponse {
  valid: boolean;
  cardType?: string;
  error?: string;
}

/** Sends a card number to the backend for Luhn validation. */
export const validateCard = async (cardNumber: string): Promise<ValidationResponse> => {
  const res = await fetch('/api/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cardNumber }),
  });
  return res.json() as Promise<ValidationResponse>;
};
