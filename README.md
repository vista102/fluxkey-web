# FluxKey Web

ANSI 61-key Hall Effect keyboard configuration demo. White/lime reference layout: left navigation, top keyboard, bottom editor, right key inspector, and local profile save/discard bar.

No WebHID, USB commands, firmware writes, cloud requests, or OS-generated key events. Calibration/travel/update screens are explicitly simulated. The existing FluxBoard project and deployment are not part of this repository.

See [XSYD feature coverage and limitations](docs/XSYD-COVERAGE.md). UI field correspondence is not firmware protocol compatibility.

## Development

```bash
pnpm install
pnpm dev --host 127.0.0.1 --port 3001 --strictPort
pnpm build
pnpm lint
pnpm test:model
pnpm test:browser
```

Use Node 24+ for the TypeScript model test. Browser tests require installed Google Chrome and a running local server; optionally set `DEMO_URL`. They use an isolated browser context, not your working browser/profile. Screenshots are generated in `tests/` and ignored by Git.

Four independent profiles contain physical-key performance, four mapping layers, 16 macros, two lighting zones, and device preferences. Click/drag select multiple keys; Shift adds a range without losing earlier selections. Editing does not contact a device. Use **데모 저장** to persist to this browser or **되돌리기** to restore the last save. JSON import/export is demo-only and rejects incompatible data without replacing current settings.
