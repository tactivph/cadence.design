# @tactivph/cadence-ui

**Cadence Design System** — the shared Angular component library + centralized styling for the
Cadence platform (the ground-up rebuild of PDO). Built with **Angular 22**, **SASS**, and
**Bootstrap 5.3**, documented in **Storybook**, and published to **GitHub Packages**.

> **Scope:** this package ships **styling and presentational components only**. It has no HTTP calls,
> no routing, no business logic. Components expose `@Input()` / `@Output()` and content slots — you
> wire the behavior, data and API calls in the consuming app.

Design language (colors, type, spacing, status taxonomies), the **Inter + Hyogo** typefaces and the
**Phosphor** icon set are carried over 1:1 from the existing PDO codebase, then consolidated DRY.

---

## Install (in the Cadence app)

The package lives in **GitHub Packages** under the `@tactivph` scope. Add an `.npmrc` to the
consuming app (see [`.npmrc.example`](.npmrc.example)):

```ini
@tactivph:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

Then:

```bash
export NODE_AUTH_TOKEN=<a GitHub PAT with read:packages>
npm install @tactivph/cadence-ui bootstrap @phosphor-icons/web
```

`bootstrap` and `@phosphor-icons/web` are **peer dependencies** — install them in the app.

### 1. Load the theme (once)

In the app's global `styles.scss`:

```scss
@use '@tactivph/cadence-ui/styles/theme';
```

This emits the themed Bootstrap + CSS custom properties + base styles. Add the icon CSS and font
copy to the app's `angular.json`:

```jsonc
"styles": [
  "node_modules/@phosphor-icons/web/src/regular/style.css",
  "node_modules/@phosphor-icons/web/src/bold/style.css",
  "node_modules/@phosphor-icons/web/src/fill/style.css",
  "src/styles.scss"
],
"assets": [
  { "glob": "**/*", "input": "node_modules/@tactivph/cadence-ui/styles/fonts", "output": "assets/fonts" }
]
```

(The `@font-face` rules reference `/assets/fonts/...`; override `$cds-font-path` before the theme
import if your app serves them elsewhere.)

### 2. Use the components (standalone)

```ts
import { CdsButtonComponent, CdsStatusBadgeComponent } from '@tactivph/cadence-ui';

@Component({
  standalone: true,
  imports: [CdsButtonComponent, CdsStatusBadgeComponent],
  template: `
    <button cds-button variant="primary" iconLeft="ph ph-plus" (click)="onAdd()">Add lead</button>
    <cds-status-badge kind="contract" code="reserved_buyer"></cds-status-badge>
  `,
})
export class MyComponent {}
```

---

## What's inside

**Foundations (centralized, DRY):**
`styles/abstracts` — one token source (`_tokens.scss`), `_css-vars.scss` (runtime `--cds-*`
variables), `_mixins.scss`, `_functions.scss`. `styles/_bootstrap.scss` feeds those tokens into
Bootstrap's Sass variables, so the whole system has a single source of truth. `styles/base` — fonts,
reset, typography utilities. `styles/theme.scss` — the single entry the app imports.

**Components (presentational):**
Button · Badge · Status badge (lead-progress / contract / requirement / temperature presets) ·
Avatar · Spinner · Skeleton · Card · Empty state · Alert · Form field · Input (directive) ·
Checkbox · Radio. All standalone, `OnPush`, prefixed `cds-`.

**Re-theming:** override the semantic CSS variables anywhere downstream — e.g.

```css
:root { --cds-color-primary: #4f46e5; }  /* instant rebrand, no recompile */
```

---

## Develop

```bash
npm install --legacy-peer-deps   # Storybook 10 ↔ Angular 22 peer range; see note below
npm run storybook                # live component workbench at http://localhost:6006
npm run build:lib                # build the publishable package into dist/cadence-ui
npm run build-storybook          # static Storybook into storybook-static/
```

> **Peer-deps note:** Storybook 10's Angular builder still declares a peer range that resolves
> `@angular-devkit/build-angular` to v21, so installs use `--legacy-peer-deps`. We install
> `@angular-devkit/build-angular@22` explicitly (a thin compat package) and Storybook compiles
> cleanly against Angular 22. When Storybook ships Angular-22-native support, drop the flag.

### Add a component

1. `projects/cadence-ui/src/lib/<name>/<name>.component.ts|.html|.scss` — standalone, `cds-` prefix,
   `@use '../../styles/abstracts' as *;` in the SCSS (tokens/mixins only — never hardcode values).
2. Add a `<name>.stories.ts`.
3. Export it from `projects/cadence-ui/src/public-api.ts`.

---

## Publish (GitHub Packages)

Automated on a version tag via [`.github/workflows/publish.yml`](.github/workflows/publish.yml):

```bash
npm version patch           # bumps projects/cadence-ui version too (keep them in sync)
git push --follow-tags      # tag push → CI builds the lib and publishes to GitHub Packages
```

Manual:

```bash
npm run build:lib
cd dist/cadence-ui && npm publish
```

The library version lives in `projects/cadence-ui/package.json`.

---

## Stack

| | |
|---|---|
| Framework | Angular 22 (standalone components, ng-packagr / Angular Package Format) |
| Styling | SASS + Bootstrap 5.3, tokenized via CSS custom properties |
| Icons | Phosphor (`@phosphor-icons/web`) — `ph ph-*`, `ph-bold`, `ph-fill` |
| Fonts | Inter (UI) + Hyogo (display) |
| Docs | Storybook 10 |
| Registry | GitHub Packages (`@tactivph` scope) |
