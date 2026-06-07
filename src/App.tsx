import { useState, useCallback, useEffect } from 'react';

const CHARS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-=',
};

function generatePassword(length: number, options: Record<string, boolean>) {
  let pool = '';
  if (options.lower) pool += CHARS.lower;
  if (options.upper) pool += CHARS.upper;
  if (options.numbers) pool += CHARS.numbers;
  if (options.symbols) pool += CHARS.symbols;
  if (!pool) return '';

  let password = '';
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    password += pool[array[i] % pool.length];
  }
  return password;
}

export default function App() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    lower: true,
    upper: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const refresh = useCallback(() => {
    setPassword(generatePassword(length, options));
    setCopied(false);
  }, [length, options]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const copy = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggle = (key: keyof typeof options) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{ maxWidth: 480, width: '100%', margin: '0 auto' }}>
      <h1 style={{ marginBottom: 24 }}>🔐 Password Generator</h1>

      <div
        style={{
          background: '#1e293b',
          padding: '16px 20px',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 20,
          fontSize: '1.25rem',
          fontFamily: 'monospace',
          wordBreak: 'break-all',
        }}
      >
        <span>{password}</span>
        <button
          onClick={copy}
          style={{
            background: copied ? '#10b981' : '#3b82f6',
            border: 'none',
            borderRadius: 8,
            padding: '8px 14px',
            color: '#fff',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span>Length: {length}</span>
          <input
            type="range"
            min={4}
            max={64}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            style={{ width: '60%' }}
          />
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        {Object.entries(options).map(([key, value]) => (
          <label
            key={key}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#1e293b',
              padding: '12px 16px',
              borderRadius: 8,
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={value}
              onChange={() => toggle(key as keyof typeof options)}
            />
            <span style={{ textTransform: 'capitalize' }}>{key}</span>
          </label>
        ))}
      </div>

      <button
        onClick={refresh}
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: 10,
          border: 'none',
          background: '#3b82f6',
          color: '#fff',
          fontSize: '1rem',
          cursor: 'pointer',
        }}
      >
        Generate New Password
      </button>
    </div>
  );
}
