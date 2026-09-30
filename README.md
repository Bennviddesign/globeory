# Globeory

Personal travel archive: trips, flights, destinations, hotels, places and memories on an interactive globe.
React Native + Expo Router + TypeScript. **Local-first**, no cloud backend required.

## Run

```bash
npm install
npx expo start          # press a / i, or scan the QR code with Expo Go
```

On first launch choose **Try demo** for a complete sample world (Marcus, 17 countries, ~46 flights, Milan and
Paris visited several times, six other travelers with different privacy settings), or **Get started** to create
an empty local profile.

```bash
npx tsc --noEmit            # type-check
npx tsx scripts/sanity.ts   # data-layer checks (Haversine, repeat visits, search privacy)
```

## Structure

| Folder | Content |
| --- | --- |
| `src/app` | Expo Router screens (tabs: Explore, Trips, Places, Profile; details, forms, search, settings) |
| `src/components` | `common`, `globe`, `cards`, `modals`, `timeline`, `profile`, `forms`, `navigation` |
| `src/constants` | colors, light/dark themes, layout, categories, app constants |
| `src/models` | TypeScript types mirroring the planned Supabase tables (snake_case) |
| `src/services` | storage, CRUD, Haversine, stats, timeline, globe data, search, privacy, demo seed |
| `src/context` | Settings, Theme, Session (demo / local), Data (database + persistence) |

## Key rules implemented in the data model

- **One representative image per destination visit**: `destination_visits.image_path` is a single `string | null`;
  setting an image replaces (and deletes) the previous one, and stored data is normalized on load.
- **Automatic flight distance**: `FlightInput` has no distance; `createFlight` / `updateFlight` always compute
  `distance_km` with the Haversine formula. Kilometers are stored; miles are a display conversion.
- **Privacy by construction**: every profile / globe / timeline view reads from `scopeToUser(db, owner, viewer)`.
- **Repeat visits** (e.g. Milan 3x) are separate `destination_visits` rows, aggregated in Places and listed in full on the city page.

## Notes

- Demo images are remote Unsplash URLs with a placeholder fallback when offline.
- The Map view is a flat SVG projection (no native map SDK), so the app runs in Expo Go.
