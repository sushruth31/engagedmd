// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AxiosError, type AxiosResponse } from 'axios';
import App from './App';
import { cardValidatorApi } from './api/cardValidator';

// Finds the card-number input by its aria-label, case-insensitively.
const input = () => screen.getByLabelText(/card number/i);

describe('<App />', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('shows a valid result with the detected card type', async () => {
    vi.spyOn(cardValidatorApi, 'validate').mockResolvedValue({ valid: true, cardType: 'Visa' });
    render(<App />);
    await userEvent.type(input(), '4532015112830366');
    // Matches the rendered "✓ Valid · Visa".
    expect(await screen.findByText(/valid · visa/i)).toBeInTheDocument();
  });

  it('shows the reason for an invalid number', async () => {
    vi.spyOn(cardValidatorApi, 'validate').mockResolvedValue({
      valid: false,
      error: 'Card number failed the Luhn checksum.',
    });
    render(<App />);
    await userEvent.type(input(), '4532015112830367');
    // Matches the rendered Luhn failure message.
    expect(await screen.findByText(/failed the luhn checksum/i)).toBeInTheDocument();
  });

  it("shows the API's own reason when it rejects with an error envelope", async () => {
    const response = { status: 400, data: { valid: false, error: 'Invalid request body.' } };
    vi.spyOn(cardValidatorApi, 'validate').mockRejectedValue(
      new AxiosError(
        'Bad Request',
        'ERR_BAD_REQUEST',
        undefined,
        undefined,
        response as AxiosResponse,
      ),
    );
    render(<App />);
    await userEvent.type(input(), '4532015112830366');
    // The request completed — the server's reason is shown, not the fallback.
    expect(await screen.findByText(/invalid request body/i)).toBeInTheDocument();
  });

  it('shows the fallback when the request never completes', async () => {
    vi.spyOn(cardValidatorApi, 'validate').mockRejectedValue(new Error('network down'));
    render(<App />);
    await userEvent.type(input(), '4532015112830366');
    // No response at all (network down, timeout) → generic fallback.
    expect(await screen.findByText(/could not reach/i)).toBeInTheDocument();
  });
});
