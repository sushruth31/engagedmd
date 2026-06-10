import { useEffect, useState } from 'react';
import { cardValidatorApi } from './api/cardValidator';
import { UI, MESSAGES } from './constants';
import type { ValidationResponse } from '@ccv/shared';
import { formatCardNumber } from './format';

/** Validates the card number on the backend, debounced as the user types. */
const useValidation = (digits: string) => {
  const [result, setResult] = useState<ValidationResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!digits) {
      setResult(null);
      return;
    }
    let active = true;
    setLoading(true);
    const timer = setTimeout(() => {
      cardValidatorApi
        .validate(digits)
        .then((r) => {
          if (active) setResult(r);
        })
        .catch(() => {
          if (active) setResult({ valid: false, error: MESSAGES.UNAVAILABLE });
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, UI.DEBOUNCE_MS);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [digits]);

  return { result, loading };
};

function Result({
  digits,
  loading,
  result,
}: {
  digits: string;
  loading: boolean;
  result: ValidationResponse | null;
}) {
  if (!digits) return <p className="status status--idle">Enter a card number to validate.</p>;
  if (loading || !result) return <p className="status status--idle">Checking...</p>;
  if (result.valid) return <p className="status status--valid">✓ Valid · {result.cardType}</p>;
  return <p className="status status--invalid">✗ {result.error}</p>;
}

export default function App() {
  const [value, setValue] = useState('');
  // Keep digits only, capped at the maximum card length.
  const digits = value.replace(/\D/g, '').slice(0, UI.MAX_CARD_DIGITS);
  const { result, loading } = useValidation(digits);

  return (
    <main className="page">
      <form className="card" onSubmit={(e) => e.preventDefault()}>
        <h1 className="title">Credit Card Validator</h1>
        <input
          className="card-input"
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="0000 0000 0000 0000"
          aria-label="Credit card number"
          value={formatCardNumber(value)}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="result" aria-live="polite">
          <Result digits={digits} loading={loading} result={result} />
        </div>
      </form>
    </main>
  );
}
