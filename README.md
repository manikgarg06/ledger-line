# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

---

## Modularization Overview (Project-specific)

The project has been refactored from a single App.tsx monolith into a modular structure with:
- Core (presentational) components: stateless, reusable UI building blocks
- Containers: page-level composition wiring data, state, and handlers

### New Structure

- src/components/core/
  - index.tsx (barrel; imports Swiper CSS once: `import 'swiper/swiper-bundle.css'`)
  - StatusBar.tsx
  - BalanceSummaryCard.tsx
  - PeopleList.tsx
  - PersonBalanceCard.tsx
  - QuickActions.tsx
  - TransactionsList.tsx
  - FloatingActionButton.tsx
  - TabBar.tsx
  - AddPersonModal.tsx
  - AddTransactionModal.tsx

- src/containers/
  - HomeContainer.tsx
    - Composes BalanceSummaryCard + PeopleList for the Home tab
  - DetailContainer.tsx
    - Composes PersonBalanceCard + QuickActions + TransactionsList for the Detail tab
  - index.ts
    - Barrel for container exports

- src/App.tsx
  - Now holds application state, effects, and event handlers
  - Composes containers and core components

### Usage examples

- Import core components (presentational):
  - import { StatusBar } from './components/core'

- Import containers (page composition):
  - import { HomeContainer, DetailContainer } from './containers'

### Guidelines for future contributions

- Add new reusable UI to src/components/core/index.tsx or split into files under src/components/core/ if the module grows. Keep these stateless and prop-driven.
- Add new pages/sections as containers under src/containers/. Containers should:
  - Receive data via props
  - Call back via props for actions
  - Avoid direct API calls (these belong in App-level logic or a state layer)
- Keep business logic and data fetching in App.tsx or a dedicated state management layer.
- Keep styling consistent with existing Tailwind utility classes.
