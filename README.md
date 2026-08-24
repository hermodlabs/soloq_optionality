# Hermod SoloQ Optionality Lab — JSX React App

This is a Vite + React app written with JSX source files.

## Start

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## JSX files

- `src/App.jsx` — full UI and interaction logic
- `src/main.jsx` — React entrypoint
- `src/config.jsx` — globally editable UI/help/paid-feature configuration
- `src/data.jsx` — draft phases, strategies, requirements, and illustrative mappings

## Global configuration

Change the paid-tooltip close delay here:

```jsx
export const HERMOD_UI_CONFIG = {
  paidTooltipCloseDelayMs: 300,
};
```

All glossary copy, paid-feature teaser copy, and demo checkout copy are also in `src/config.jsx`.

The config objects are exposed on `window` as well for live browser experimentation.

## Notes

- The app loads the complete champion roster from Riot Data Dragon version 16.16.1 when online.
- The strategic mappings are intentionally illustrative for UI/UX experimentation.
- The checkout is a demo-only filler flow and does not process payments.
