import React, { useEffect, useRef } from "react";
import { HERMOD_UI_CONFIG } from "../../config.jsx";
import PaidHoverCard from "../PaidHoverCard/PaidHoverCard.jsx";

function PaidHoverHost({ id, children, card, activePaidHoverId, setActivePaidHoverId, className = "" }) {
  const closeTimerRef = useRef(null);
  const isOpen = activePaidHoverId === id;

  const open = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    setActivePaidHoverId(id);
  };

  const scheduleClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = setTimeout(() => {
      setActivePaidHoverId((current) => (current === id ? null : current));
    }, Math.max(0, Number(HERMOD_UI_CONFIG.paidTooltipCloseDelayMs) || 0));
  };

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  return (
    <span
      className={`paid-hover-host ${className}`}
      tabIndex={0}
      onMouseEnter={open}
      onMouseLeave={scheduleClose}
      onFocus={open}
      onBlur={scheduleClose}
    >
      {children}
      {isOpen && card}
    </span>
  );
}