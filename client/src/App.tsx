import { useEffect, useState } from 'react';
import { cardValidatorApi } from './api/cardValidator';
import type { ValidationResponse } from '@ccv/shared';
import { formatCardNumber } from './format';

const DEBOUNCE_MS = 400;

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
      cardValidatorApi.validate(digits)
        .then((r) => { if (active) setResult(r); })
        .catch((e: unknown) => {
          if (active) setResult({ valid: false, error: e instanceof Error ? e.message : 'Validation failed.' });
        })
        .finally(() => { if (active) setLoading(false); });
    }, DEBOUNCE_MS);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [digits]);

  return { result, loading };
};

function Result({ digits, loading, result }: {
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
  const digits = value.replace(/\D/g, '').slice(0, 19);
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
