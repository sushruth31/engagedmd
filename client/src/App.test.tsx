// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { cardValidatorApi } from './api/cardValidator';
import { ApiError } from './api/client';

// Matches the input via its aria-label, case-insensitively.
const input = () => screen.getByLabelText(/card number/i);

describe('<App />', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('renders the card-number input', () => {
    render(<App />);
    expect(input()).toBeInTheDocument();
  });

  it('formats the number in groups of four as the user types', async () => {
    render(<App />);
    await userEvent.type(input(), '4532015112830366');
    expect(input()).toHaveValue('4532 0151 1283 0366');
  });

  it('shows a valid result with the detected card type', async () => {
    vi.spyOn(cardValidatorApi, 'validate').mockResolvedValue({ valid: true, cardType: 'Visa' });
    render(<App />);
    await userEvent.type(input(), '4532015112830366');
    // Matches the rendered "✓ Valid · Visa" status.
    expect(await screen.findByText(/valid · visa/i)).toBeInTheDocument();
  });

  it('shows the error message for an invalid number', async () => {
    vi.spyOn(cardValidatorApi, 'validate').mockResolvedValue({
      valid: false,
      error: 'Card number failed the Luhn checksum.',
    });
    render(<App />);
    await userEvent.type(input(), '4532015112830367');
    // Matches the rendered Luhn failure message.
    expect(await screen.findByText(/failed the luhn checksum/i)).toBeInTheDocument();
  });

  it('surfaces a friendly message when the service is unreachable', async () => {
    vi.spyOn(cardValidatorApi, 'validate').mockRejectedValue(
      new ApiError('Service unavailable. Please try again.', 0, 'NETWORK_ERROR'),
    );
    render(<App />);
    await userEvent.type(input(), '4532015112830366');
    // Matches the rendered transport-error copy.
    expect(await screen.findByText(/service unavailable/i)).toBeInTheDocument();
  });

  it('clears the result when the input is emptied', async () => {
    vi.spyOn(cardValidatorApi, 'validate').mockResolvedValue({ valid: true, cardType: 'Visa' });
    render(<App />);
    await userEvent.type(input(), '4532015112830366');
    // Valid status appears (matches the rendered "✓ Valid · Visa")...
    expect(await screen.findByText(/valid · visa/i)).toBeInTheDocument();
    await userEvent.clear(input());
    // ...then disappears once the field is cleared.
    await waitFor(() => expect(screen.queryByText(/valid · visa/i)).not.toBeInTheDocument());
  });
});
