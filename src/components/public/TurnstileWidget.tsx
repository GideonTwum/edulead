"use client";

import { useEffect, useRef, useCallback } from "react";
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
const isDev = process.env.NODE_ENV === "development";

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onError?: () => void;
  className?: string;
}

export function TurnstileWidget({ onVerify, onError, className }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const renderWidget = useCallback(() => {
    if (!containerRef.current || !window.turnstile || !turnstileSiteKey) return;

    if (widgetIdRef.current) {
      window.turnstile.remove(widgetIdRef.current);
    }

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: turnstileSiteKey,
      callback: onVerify,
      "error-callback": onError,
      theme: "light",
    });
  }, [onVerify, onError]);

  useEffect(() => {
    if (!turnstileSiteKey) {
      if (isDev) onVerify("dev-bypass-token");
      return;
    }

    if (window.turnstile) {
      renderWidget();
      return;
    }

    window.onTurnstileLoad = renderWidget;
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, [renderWidget, onVerify]);

  if (!turnstileSiteKey && isDev) {
    return <p className="text-xs text-brand-grey">Turnstile bypassed in development</p>;
  }

  return <div ref={containerRef} className={className} />;
}
