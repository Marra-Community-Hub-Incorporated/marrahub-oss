import { useEffect, useRef, useState } from 'react';

const TURNSTILE_SCRIPT_ID = 'cf-turnstile-script';

interface TurnstileApi {
  render: (
    container: HTMLElement | string,
    options: {
      sitekey: string;
      theme?: 'light' | 'dark' | 'auto';
      size?: 'normal' | 'compact' | 'flexible';
      callback?: (token: string) => void;
      'expired-callback'?: () => void;
      'error-callback'?: () => void;
    },
  ) => string;
  reset: (widgetId?: string) => void;
  remove?: (widgetId?: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

function ensureTurnstileScript(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (window.turnstile) {
      resolve();
      return;
    }

    const existingScript = document.getElementById(TURNSTILE_SCRIPT_ID) as HTMLScriptElement | null;
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = TURNSTILE_SCRIPT_ID;
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onerror = () => reject(new Error('Failed to load Turnstile.'));
      document.head.appendChild(script);
    }

    let attempts = 0;
    const maxAttempts = 100;
    const intervalId = window.setInterval(() => {
      if (window.turnstile) {
        window.clearInterval(intervalId);
        resolve();
        return;
      }
      attempts += 1;
      if (attempts >= maxAttempts) {
        window.clearInterval(intervalId);
        reject(new Error('Turnstile took too long to load.'));
      }
    }, 100);
  });
}

export interface UseTurnstileResult {
  containerRef: React.RefObject<HTMLDivElement>;
  token: string;
  error: string | null;
  reset: () => void;
}

// Loads and renders a Cloudflare Turnstile widget, exposing the resulting token.
// Self-contained so the whole feature folder is portable to the Hub SaaS.
export function useTurnstile(siteKey: string): UseTurnstileResult {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const setup = async () => {
      try {
        await ensureTurnstileScript();
        if (!isMounted || !window.turnstile || !containerRef.current || widgetIdRef.current) {
          return;
        }
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: 'light',
          size: 'flexible',
          callback: (t) => {
            if (!isMounted) return;
            setToken(t);
            setError(null);
          },
          'expired-callback': () => {
            if (!isMounted) return;
            setToken('');
            setError('Security verification expired. Please complete it again before submitting.');
          },
          'error-callback': () => {
            if (!isMounted) return;
            setToken('');
            setError('Security verification could not be loaded. Please refresh and try again.');
          },
        });
      } catch {
        if (!isMounted) return;
        setError('Security verification could not be loaded. Please refresh and try again.');
      }
    };

    setup();

    return () => {
      isMounted = false;
      if (window.turnstile && widgetIdRef.current && typeof window.turnstile.remove === 'function') {
        window.turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = null;
    };
  }, [siteKey]);

  const reset = () => {
    if (window.turnstile && widgetIdRef.current) {
      window.turnstile.reset(widgetIdRef.current);
    }
    setToken('');
  };

  return { containerRef, token, error, reset };
}
