import React, { useEffect, useRef } from "react";
import { HERMOD_UI_CONFIG } from "../../config.jsx";
import PaidHoverCard from "../PaidHoverCard/PaidHoverCard.jsx";

function PaidHoverHost({ id, children, card, activePaidHoverId, setActivePaidHoverId, className = "", onClickOpen }) {
  const closeTimerRef = useRef(null);
  const isOpen = activePaidHoverId === id;

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  return (
    <span
      className={`paid-hover-host ${className}`}
      tabIndex={0}
      onClick={() => {
        if (onClickOpen) {
          onClickOpen();
        }
      }}
      onKeyDown={(event) => {
        if ((event.key === "Enter" || event.key === " ") && onClickOpen) {
          event.preventDefault();
          onClickOpen();
        }
      }}
    >
      {children}
      {isOpen && card}
    </span>
  );
}

export default PaidHoverHost;