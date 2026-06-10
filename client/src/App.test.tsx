// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('shows a fallback message when the request fails', async () => {
    vi.spyOn(cardValidatorApi, 'validate').mockRejectedValue(new Error('network down'));
    render(<App />);
    await userEvent.type(input(), '4532015112830366');
    // Any transport failure surfaces the same friendly fallback.
    expect(await screen.findByText(/could not reach/i)).toBeInTheDocument();
  });
});
