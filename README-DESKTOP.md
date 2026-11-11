# Desktop Buddy

Desktop Buddy is the Windows desktop edition of Muse Number 3: one Electron window holding three isolated Muse sessions. The tabs are ordered **Muse 3, Muse 2, Muse 1**. Switching is visibility-only; each session stays live and keeps its own cookies, local storage, and login.

## Build

```bash
npm ci
npm run check
npm run dist -- --win
```

The Windows installer is written to `dist/`. The CI workflow also builds Windows, macOS, and Linux artifacts.

## Local URLs

All slots default to `https://muse.ai`. For local testing, set `MUSE3_URL`, `MUSE2_URL`, and `MUSE1_URL` before `npm start`.

## Notes

- Sessions use Electron persistent partitions: `persist:muse3`, `persist:muse2`, and `persist:muse1`.
- The bottom switcher is black, 40px tall, with compact 11px labels.
- The packaged product name is Desktop Buddy; the project retains the Muse Number 3 slot model.
