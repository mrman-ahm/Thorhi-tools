"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SECRET_WORD = "THROHI";
const ACTIVE_DURATION = 9000;
const PRESS_DURATION = 720;
const RESET_DELAY = 1500;
const triggerSelector = ".brand, .hero-brand-mark, .footer-identity";

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return target.matches("input, textarea, select, [contenteditable='true']") || Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
}

function secretTrigger(target: EventTarget | null) {
  return target instanceof Element ? target.closest<HTMLElement>(triggerSelector) : null;
}

export function PrecisionSecrets() {
  const [active, setActive] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const buffer = useRef("");
  const activeTimer = useRef<number | null>(null);
  const resetTimer = useRef<number | null>(null);
  const pressTimer = useRef<number | null>(null);
  const pressTarget = useRef<HTMLElement | null>(null);
  const suppressClick = useRef(false);

  const clearTimer = (timer: React.MutableRefObject<number | null>) => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = null;
  };

  const deactivate = useCallback(() => {
    clearTimer(activeTimer);
    delete document.documentElement.dataset.precisionSecret;
    setActive(false);
    setAnnouncement("");
  }, []);

  const activate = useCallback(() => {
    clearTimer(activeTimer);
    document.documentElement.dataset.precisionSecret = "active";
    setActive(true);
    setAnnouncement("THROHI precision layer active. Press Escape to close.");
    activeTimer.current = window.setTimeout(deactivate, ACTIVE_DURATION);
  }, [deactivate]);

  useEffect(() => {
    const clearPress = () => {
      clearTimer(pressTimer);
      pressTarget.current = null;
    };

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && active) {
        deactivate();
        return;
      }
      if (event.metaKey || event.ctrlKey || event.altKey || isTypingTarget(event.target)) return;
      if (!/^[a-z]$/i.test(event.key)) return;

      buffer.current = `${buffer.current}${event.key.toUpperCase()}`.slice(-SECRET_WORD.length);
      clearTimer(resetTimer);
      resetTimer.current = window.setTimeout(() => { buffer.current = ""; }, RESET_DELAY);

      if (buffer.current === SECRET_WORD) {
        buffer.current = "";
        activate();
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      const trigger = secretTrigger(event.target);
      if (!trigger) return;
      clearPress();
      pressTarget.current = trigger;
      pressTimer.current = window.setTimeout(() => {
        if (!pressTarget.current?.isConnected) return;
        suppressClick.current = true;
        activate();
      }, PRESS_DURATION);
    };

    const handleClick = (event: MouseEvent) => {
      if (!suppressClick.current || !secretTrigger(event.target)) return;
      event.preventDefault();
      event.stopPropagation();
      suppressClick.current = false;
    };

    const handleContextMenu = (event: MouseEvent) => {
      if (pressTarget.current && secretTrigger(event.target)) event.preventDefault();
    };

    window.addEventListener("keydown", handleKeydown);
    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("pointerup", clearPress, true);
    document.addEventListener("pointercancel", clearPress, true);
    document.addEventListener("click", handleClick, true);
    document.addEventListener("contextmenu", handleContextMenu, true);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("pointerup", clearPress, true);
      document.removeEventListener("pointercancel", clearPress, true);
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("contextmenu", handleContextMenu, true);
      clearTimer(activeTimer);
      clearTimer(resetTimer);
      clearTimer(pressTimer);
      delete document.documentElement.dataset.precisionSecret;
    };
  }, [activate, active, deactivate]);

  return <>
    <div className="precision-secret-layer" aria-hidden="true" data-active={active}>
      <span className="precision-secret-line line-horizontal" />
      <span className="precision-secret-line line-vertical" />
      <span className="precision-secret-corner corner-a" />
      <span className="precision-secret-corner corner-b" />
      <span className="precision-secret-corner corner-c" />
      <span className="precision-secret-corner corner-d" />
      <div className="precision-secret-mark"><strong>THROHI</strong><small>PRECISION LAYER / 01</small></div>
      <div className="precision-secret-scale"><span>00</span><i /><span>25</span><i /><span>50</span><i /><span>75</span><i /><span>100</span></div>
    </div>
    <p className="precision-secret-status" role="status" aria-live="polite">{announcement}</p>
  </>;
}
