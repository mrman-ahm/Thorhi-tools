"use client";

import { useEffect, useRef, useState } from "react";

const scriptId = "throhi-turnstile-script";
const scriptSrc = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileApi = {
  render(
    element: HTMLElement,
    options: {
      sitekey: string;
      callback(token: string): void;
      "expired-callback"(): void;
      "error-callback"(): void;
      theme: "light";
      size: "flexible";
    },
  ): string;
  remove(widgetId: string): void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export function TurnstileField({
  token,
  onToken,
}: {
  token: string;
  onToken(token: string): void;
}) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  const containerRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!siteKey) return;
    let widgetId: string | undefined;
    let cancelled = false;

    const render = () => {
      if (cancelled || widgetId || !containerRef.current || !window.turnstile) return;
      widgetId = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback(value) {
          setMessage("");
          onToken(value);
        },
        "expired-callback"() {
          onToken("");
          setMessage("Verification expired. Complete it again before submitting.");
        },
        "error-callback"() {
          onToken("");
          setMessage("Verification could not load. Refresh the page and try again.");
        },
        theme: "light",
        size: "flexible",
      });
    };

    const existing = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (window.turnstile) {
      render();
    } else if (existing) {
      existing.addEventListener("load", render, { once: true });
    } else {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = scriptSrc;
      script.async = true;
      script.defer = true;
      script.addEventListener("load", render, { once: true });
      script.addEventListener(
        "error",
        () => setMessage("Verification could not load. Refresh the page and try again."),
        { once: true },
      );
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      existing?.removeEventListener("load", render);
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [onToken, siteKey]);

  if (!siteKey) return null;

  return (
    <div data-turnstile-field>
      <div ref={containerRef} />
      <input type="hidden" name="turnstileToken" value={token} readOnly />
      {message ? <p role="alert">{message}</p> : null}
    </div>
  );
}
