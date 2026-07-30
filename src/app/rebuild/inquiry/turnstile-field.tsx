"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./turnstile-field.module.css";

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
    let scriptElement = document.getElementById(scriptId) as HTMLScriptElement | null;

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

    if (window.turnstile) {
      render();
    } else if (scriptElement) {
      scriptElement.addEventListener("load", render, { once: true });
    } else {
      scriptElement = document.createElement("script");
      scriptElement.id = scriptId;
      scriptElement.src = scriptSrc;
      scriptElement.async = true;
      scriptElement.defer = true;
      scriptElement.addEventListener("load", render, { once: true });
      scriptElement.addEventListener(
        "error",
        () => setMessage("Verification could not load. Refresh the page and try again."),
        { once: true },
      );
      document.head.appendChild(scriptElement);
    }

    return () => {
      cancelled = true;
      scriptElement?.removeEventListener("load", render);
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [onToken, siteKey]);

  if (!siteKey) return null;

  return (
    <div className={styles.field} data-turnstile-field>
      <div ref={containerRef} />
      <input type="hidden" name="turnstileToken" value={token} readOnly />
      {message ? <p role="alert">{message}</p> : null}
    </div>
  );
}
