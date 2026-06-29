# Rovexa — Meal Scan

A photo-to-calorie Expo app built with React Native and TypeScript. Pick a meal photo from your library, analyze it with OpenAI vision, review the results, and save meals locally on your device.

This is a stripped-down version of a real Rovexa nutrition feature — one screen, no auth, no backend server.

## Features

- **Photo meal scan** — pick an image from the photo library (no camera required)
- **AI nutrition analysis** — OpenAI `gpt-4o-mini` vision estimates food name, calories, and macros (protein, carbs, fat)
- **Review before saving** — edit food name, calories, and macros before confirming
- **Confidence handling** — shows warnings for low-confidence or uncertain results
- **Error handling** — graceful messages for non-food photos, network failures, and invalid API responses
- **Saved meals** — persist meals locally with Zustand + AsyncStorage (survives app restarts)
- **Meal detail modal** — tap a saved meal to view full photo, stats, macros, and notes
- **Remove meals** — delete saved meals from the list or detail modal
- **Cross-platform** — runs on iOS, Android, and web via Expo

## Tech stack

- [Expo SDK 56](https://docs.expo.dev/) + [Expo Router](https://docs.expo.dev/router/introduction/)
- React Native 0.85, React 19, TypeScript
- [Zustand](https://github.com/pmndrs/zustand) + [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) for local persistence
- [OpenAI Chat Completions API](https://platform.openai.com/docs/guides/vision) (vision + JSON mode)
- [expo-image-picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/) for photo library access

## Prerequisites

- Node.js 18+
- npm
- [Expo Go](https://expo.dev/go) on a physical device, or Xcode / Android Studio for simulators
- An [OpenAI API key](https://platform.openai.com/api-keys)

## How to run

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example env file and add your OpenAI key:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
EXPO_PUBLIC_OPENAI_API_KEY=sk-your-openai-api-key

# Optional — defaults to gpt-4o-mini
# EXPO_PUBLIC_OPENAI_MODEL=gpt-4o-mini
```

> **Note:** `EXPO_PUBLIC_` variables are bundled into the app. This setup is fine for local development and demos. For production, use a backend proxy so the API key never ships in the client.

### 3. Start the dev server

```bash
npx expo start
```

Then open the app:

| Platform | Command / action |
|----------|------------------|
| iOS Simulator | Press `i` in the terminal |
| Android Emulator | Press `a` in the terminal |
| Physical device | Scan the QR code with Expo Go |
| Web | Press `w` or run `npm run web` |

### Other scripts

```bash
npm run ios       # Start and open iOS
npm run android   # Start and open Android
npm run web       # Start and open web
npm run lint      # Run ESLint
```

## Usage

1. Open the app — the home screen is the **Meal scan** flow
2. Tap **Pick photo from library** and choose a meal image
3. Wait for AI analysis (food name, calories, macros)
4. Review and edit the result if needed
5. Tap **Save meal** to store it locally, or **Discard** to start over
6. Scroll to **Saved meals** — tap a card to open details, or **Remove** to delete

## File structure

```
rovexa/
├── app.json                 # Expo config (plugins, permissions, icons)
├── .env.example             # Environment variable template
├── package.json
├── tsconfig.json
│
├── assets/                  # App icons, splash, images
│
├── scripts/
│   └── reset-project.js     # Expo starter reset script
│
└── src/
    ├── app/                 # Expo Router screens
    │   ├── _layout.tsx      # Root layout (theme, splash)
    │   └── index.tsx        # Home screen — meal scan UI
    │
    ├── components/
    │   ├── food-analysis/   # Meal scan feature components
    │   │   ├── food-result-form.tsx       # Editable review form
    │   │   ├── macro-row.tsx              # Protein / carbs / fat chips
    │   │   ├── photo-preview.tsx          # Selected photo display
    │   │   ├── saved-meal-detail-modal.tsx # Full meal detail modal
    │   │   └── saved-meals-list.tsx       # Saved meals list + cards
    │   │
    │   ├── ui/              # Reusable UI primitives
    │   │   ├── primary-button.tsx
    │   │   ├── section-header.tsx
    │   │   ├── status-banner.tsx
    │   │   ├── surface-card.tsx
    │   │   └── themed-text-input.tsx
    │   │
    │   ├── themed-text.tsx  # Themed typography
    │   └── themed-view.tsx  # Themed container
    │
    ├── constants/
    │   └── theme.ts         # Colors, spacing, brand tokens
    │
    ├── hooks/
    │   ├── use-food-analysis-screen.ts  # Scan flow state machine
    │   ├── use-theme.ts
    │   └── use-color-scheme.ts
    │
    ├── lib/
    │   ├── api/
    │   │   ├── analyze-food.ts          # OpenAI vision API client
    │   │   └── parse-food-analysis.ts   # Response validation
    │   ├── food/
    │   │   └── create-saved-meal.ts      # Build saved meal objects
    │   ├── image/
    │   │   ├── pick-image.ts             # Photo library picker
    │   │   └── to-base64.ts              # Cross-platform base64 encoding
    │   └── types/
    │       └── food.ts                   # Shared types + errors
    │
    └── stores/
        └── meals-store.ts   # Zustand store (persisted to AsyncStorage)
```

## Architecture

```
Pick photo → Base64 encode → OpenAI Vision API → Parse JSON
                                    ↓
                            Review & edit form
                                    ↓
                         Save to Zustand + AsyncStorage
                                    ↓
                         Saved meals list + detail modal
```

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `EXPO_PUBLIC_OPENAI_API_KEY` | Yes | OpenAI API key from [platform.openai.com](https://platform.openai.com/api-keys) |
| `EXPO_PUBLIC_OPENAI_MODEL` | No | Vision model (default: `gpt-4o-mini`) |

Restart Expo after changing env vars — they are loaded at startup.

## License

See [LICENSE](./LICENSE).
