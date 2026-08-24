import React, { useState } from "react";
import { HERMOD_HELP } from "../../config.jsx";

function HelpIcon({ helpKey, label }) {
  const [open, setOpen] = useState(false);
  const entry = HERMOD_HELP[helpKey];

  if (!entry) return null;

  return (
    <span
      className="help-anchor"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <button
        type="button"
        className={`info-icon ${open ? "active" : ""}`}
        aria-label={`About ${label || entry.title}`}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen((value) => !value);
        }}
      >
        ⓘ
      </button>

      {open && (
        <span className="help-popover local" role="tooltip">
          <span className="help-title">{entry.title}</span>
          <span className="help-body">{entry.description}</span>
        </span>
      )}
    </span>
  );
}