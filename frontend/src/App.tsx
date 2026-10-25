
import React, { useState } from 'react';

type ShortenResult = {
  originalUrl: string;
  shortUrl: string;
};

function App() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<ShortenResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let normalizedUrl = url.trim();

    if (!normalizedUrl) {
      setError('Please enter a URL to shorten.');
      return;
    }

    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    try {
      const parsedUrl = new URL(normalizedUrl);

      if (!parsedUrl.hostname.includes('.')) {
        throw new Error('Please enter a valid URL.');
      }
    } catch {
      setError('Please enter a valid URL.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setCopied(false);

    try {
      const res = await fetch('https://mern-url-shortener-jyxi.onrender.com/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl: normalizedUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Unable to shorten this URL.');
      }

      setResult(data);
      setUrl(normalizedUrl);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not connect to the server. Check that your backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  const copyUrl = async () => {
    if (!result?.shortUrl) return;

    try {
      await navigator.clipboard.writeText(result.shortUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Unable to copy automatically. Please copy the link manually.');
    }
  };

  return (
    <div className="app">
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
        }

        .app {
          min-height: 100vh;
          padding: 24px 28px;
          color: #f5f5ff;
          background: #0b0b14;
          font-family: Inter, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .nav {
          max-width: 1080px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 42px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.4px;
        }

        .brand-icon {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          background: linear-gradient(135deg, #a78bfa, #7045ef);
          font-size: 21px;
        }

        .gradient-text {
          color: #a78bfa;
          background: linear-gradient(90deg, #c4b5fd, #8b5cf6, #e879f9);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .nav-tag {
          color: #c4b5fd;
          border: 1px solid #ffffff1c;
          background: #ffffff08;
          padding: 7px 11px;
          border-radius: 20px;
          font-size: 12px;
        }

        .hero {
          max-width: 720px;
          margin: 76px auto 0;
          text-align: center;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
          color: #c4b5fd;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.4px;
          text-transform: uppercase;
        }

        .dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #a78bfa;
        }

        h1 {
          margin: 0;
          font-size: clamp(34px, 5vw, 54px);
          line-height: 1.12;
          letter-spacing: -2px;
          font-weight: 750;
        }

        .subtitle {
          max-width: 490px;
          margin: 20px auto 30px;
          color: #a5a5ba;
          font-size: 15px;
          line-height: 1.75;
        }

        .shorten-card {
          max-width: 680px;
          margin: 0 auto;
          padding: 8px;
          display: flex;
          gap: 8px;
          background: #171724;
          border: 1px solid #ffffff20;
          border-radius: 13px;
          transition: border-color 160ms ease;
        }

        .shorten-card:focus-within {
          border-color: #8b5cf6;
        }

        .url-input {
          flex: 1;
          min-width: 0;
          padding: 14px 12px;
          color: #fff;
          background: transparent;
          border: none;
          outline: none;
          font: inherit;
          font-size: 14px;
        }

        .url-input::placeholder {
          color: #77778f;
        }

        .shorten-button {
          padding: 0 20px;
          min-height: 46px;
          border: none;
          border-radius: 9px;
          color: white;
          background: #7045ef;
          font-size: 13px;
          font-weight: 650;
          cursor: pointer;
          transition: background 150ms ease;
          white-space: nowrap;
        }

        .shorten-button:hover:not(:disabled),
        .copy-button:hover {
          background: #805cf4;
        }

        .shorten-button:disabled {
          opacity: 0.65;
          cursor: wait;
        }

        .hint {
          margin-top: 12px;
          color: #77778f;
          font-size: 12px;
        }

        .error {
          max-width: 680px;
          margin: 18px auto 0;
          padding: 13px 15px;
          border: 1px solid #f8717144;
          border-radius: 9px;
          color: #fca5a5;
          background: #7f1d1d22;
          font-size: 13px;
          text-align: left;
        }

        .result-card {
          max-width: 680px;
          margin: 22px auto 0;
          padding: 20px;
          border: 1px solid #ffffff1c;
          border-radius: 13px;
          background: #171724;
          text-align: left;
        }

        .result-heading {
          margin: 0 0 20px;
          font-size: 16px;
          font-weight: 650;
        }

        .result-label {
          display: block;
          margin: 16px 0 7px;
          color: #9292aa;
          font-size: 11px;
          letter-spacing: 0.5px;
        }

        .result-value {
          overflow-wrap: anywhere;
          color: #ddd6fe;
          font-size: 13px;
          line-height: 1.7;
        }

        .result-value a {
          color: inherit;
          text-decoration: none;
        }

        .result-value a:hover {
          text-decoration: underline;
        }

        .short-link-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 11px 12px;
          border: 1px solid #ffffff16;
          border-radius: 9px;
          background: #0b0b14;
        }

        .copy-button {
          flex-shrink: 0;
          padding: 9px 13px;
          color: white;
          background: #7045ef;
          border: 0;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: background 150ms ease;
        }

        .features {
          max-width: 820px;
          margin: 76px auto 0;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
        }

        .feature {
          padding: 4px 0;
          text-align: left;
        }

        .feature-icon {
          font-size: 21px;
        }

        .feature h3 {
          margin: 12px 0 7px;
          font-size: 14px;
          font-weight: 650;
        }

        .feature p {
          margin: 0;
          color: #9292aa;
          font-size: 12px;
          line-height: 1.75;
        }

        .footer {
          max-width: 1080px;
          margin: 72px auto 0;
          padding-top: 20px;
          border-top: 1px solid #ffffff12;
          color: #66667e;
          text-align: center;
          font-size: 12px;
        }

        @media (max-width: 600px) {
          .app {
            padding: 18px 16px;
          }

          .hero {
            margin-top: 64px;
          }

          h1 {
            font-size: clamp(32px, 9vw, 43px);
            letter-spacing: -1.3px;
          }

          .subtitle {
            font-size: 14px;
          }

          .shorten-card {
            flex-direction: column;
          }

          .url-input {
            min-height: 44px;
          }

          .shorten-button {
            min-height: 46px;
          }

          .features {
            grid-template-columns: 1fr;
            gap: 25px;
            margin-top: 54px;
          }

          .feature {
            display: grid;
            grid-template-columns: 30px 1fr;
            column-gap: 10px;
          }

          .feature-icon {
            grid-row: span 2;
          }

          .feature h3 {
            margin: 2px 0 6px;
          }

          .short-link-row {
            align-items: stretch;
            flex-direction: column;
          }

          .copy-button {
            min-height: 40px;
          }

          .nav-tag {
            font-size: 10px;
          }

          .footer {
            margin-top: 54px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <nav className="nav">
        <div className="brand">
          <div className="brand-icon">↗</div>
          <span>
            snip<span className="gradient-text">link</span>
          </span>
        </div>
        <div className="nav-tag">✦ Simple. Fast. Reliable.</div>
      </nav>

      <main>
        <section className="hero">
          <div className="eyebrow">
            <span className="dot" /> YOUR LINKS, SIMPLIFIED
          </div>

          <h1>
            Short links.
            <br />
            <span className="gradient-text">Big possibilities.</span>
          </h1>

          <p className="subtitle">
            Turn long, messy URLs into clean, shareable links.
            Less clutter, more connection.
          </p>

          <form className="shorten-card" onSubmit={handleSubmit}>
            <input
              className="url-input"
              type="text"
              inputMode="url"
              aria-label="URL to shorten"
              placeholder="Paste your long URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button className="shorten-button" type="submit" disabled={loading}>
              {loading ? '⏳ Shortening...' : '✂ Shorten URL →'}
            </button>
          </form>

          <p className="hint">Free to use · No account required</p>

          {error && (
            <div className="error" role="alert">
              ⚠ {error}
            </div>
          )}

          {result && (
            <div className="result-card">
              <h2 className="result-heading">✨ Your short link is ready!</h2>

              <span className="result-label">ORIGINAL URL</span>
              <div className="result-value">
                <a href={result.originalUrl} target="_blank" rel="noreferrer">
                  {result.originalUrl}
                </a>
              </div>

              <span className="result-label">SHORT URL</span>
              <div className="short-link-row">
                <div className="result-value">
                  <a href={result.shortUrl} target="_blank" rel="noreferrer">
                    {result.shortUrl}
                  </a>
                </div>
                <button
                  className="copy-button"
                  type="button"
                  onClick={copyUrl}
                >
                  {copied ? '✓ Copied!' : '▢ Copy link'}
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="features">
          <article className="feature">
            <div className="feature-icon">⚡</div>
            <h3>Quick & effortless</h3>
            <p>Convert lengthy links into short URLs in just a click.</p>
          </article>

          <article className="feature">
            <div className="feature-icon">🔗</div>
            <h3>Easy to share</h3>
            <p>Clean links that are easy to copy, send, and remember.</p>
          </article>

          <article className="feature">
            <div className="feature-icon">🛡️</div>
            <h3>Simple by design</h3>
            <p>A focused experience that keeps link shortening straightforward.</p>
          </article>
        </section>
      </main>

      <footer className="footer">
        Built with care · Sniplink URL Shortener
      </footer>
    </div>
  );
}

export default App;

