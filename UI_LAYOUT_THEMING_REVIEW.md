# UI Layout & Theming Review

## Scope
- Review global providers, navigation shells, Tamagui config, and shared UI.
- Audit layout patterns, colour usage, dark mode, and typography.
- Propose atomic implementation plan with acceptance criteria.

## Current Architecture
- **Providers**: TamaguiProvider + React Query + React Navigation Theme tied to system scheme.
- **Routing**: Nested Stack/Tabs for `(client)` and `(trainer)` apps; headers often disabled; platform-specific tab styling inline.
- **UI Primitives**: Custom `Button`, `Card`, `Input`, `Modal` wrap Tamagui but include platform-native inline styles.
- **Theming**: `tamagui.config.ts` uses stock `@tamagui/config/v3`. `constants/Colors.ts` holds minimal light/dark palette. Many literals exist in screens/components.

## Findings
- **Fragmented styling tokens**
  - Inline hex/rgba values and spacing scattered across screens and UI components.
  - Limited reuse of tokens; hard-coded colours in charts and inputs.
- **Partial dark-mode support**
  - React Navigation theme toggles, but component overrides assume light backgrounds (cards/inputs, tab bars), risking contrast issues in dark.
- **Mixed typography**
  - Combination of Tamagui `H3/H5` and custom Themed `Text`; inconsistent font size/spacing semantics.
- **Duplicate layout scaffolding**
  - Repeated `SafeAreaView + StyleSheet` for container/center; missing higher-level layout primitives.
- **Platform divergence**
  - iOS: BlurView tab bar; Android: opaque tab with inline elevation; styles not tokenized and live outside theme.

## Risks
- Brand or palette changes require widespread edits.
- Inconsistent dark-mode experience and contrast/compliance problems.
- Harder to onboard contributors without a documented design system.

## Design Principles
- Prefer theme tokens over literals (colour, spacing, radii, typography).
- Encapsulate platform differences behind theme/variants, not inline styles.
- Provide small, composable layout primitives to reduce duplication.
- Ensure dark-mode parity and accessible contrast by default.

## Implementation Plan (Atomic Tasks)
1. Extend Tamagui theme with custom brand tokens
   - Add colour roles (primary, secondary, surface, surfaceHover, border, success, danger, warning, info) with light/dark variants.
   - Add spacing, radii, and typography scales.
   - Deprecate `constants/Colors.ts` in favour of tokens.
   - AC: All tokens available via Tamagui theme; `Colors.ts` no longer referenced by navigators/tabs.

2. Refactor core UI components to consume tokens
   - `Button`, `Card`, `Input`, `Modal`, `RoleSelector` use theme colours/space/radii.
   - Add variants (`primary`, `secondary`, `outline`, `danger`, `ghost`).
   - Remove platform-specific inline styles; move shadows/elevation to tokenized variants.
   - AC: No literal hex/rgba inside these components; dark mode visually correct.

3. Introduce layout primitives
   - `Screen` (wraps SafeAreaView, sets background, padding, status bar style).
   - `Section` (title + content spacing), `List` wrappers where needed.
   - Replace repeated container/center styles with these components.
   - AC: All screens adopt `Screen`; duplicated StyleSheet blocks removed.

4. Standardize typography
   - Define heading/body scales and weights in theme.
   - Use Tamagui `H1..H6` and a `BodyText` wrapper or unify `Themed.Text` to pull from tokens.
   - AC: No ad-hoc font sizes on `Text`; consistent margins for headings.

5. Centralize navigation styling
   - Create shared tab bar style derived from theme (background, border/elevation, blur tint/intensity).
   - Remove platform-literal styles from tab layouts.
   - AC: Trainer/Client tabs use the same helper; tokens only.

6. Tokenize charts & data viz
   - Replace hard-coded purple/grey with theme palette.
   - Provide semantic colours for series and axes that meet contrast in both modes.
   - AC: Charts pass light/dark visual QA; no literals.

7. Lint guardrails
   - Add ESLint rule(s)/custom lint to disallow inline hex colours and `backgroundColor` literals outside theme.
   - Add CI check to fail on violations.
   - AC: New literals are blocked in PR.

8. Accessibility pass
   - Verify colour contrast for surfaces and text; adjust tokens as needed.
   - AC: WCAG AA contrast for body text on primary/surface backgrounds.

9. Documentation
   - Author a short Design System Usage Guide (colours, spacing, variants) with code examples.
   - AC: Guide checked into repo and linked from README or API docs.

10. Tests
   - Add smoke renders for light/dark themes of key screens/components.
   - Snapshot health for core UI components across variants.
   - AC: CI snapshot baseline for tokens + core UI.

## Rollout Strategy
- Ship as small, independent PRs per task above to reduce risk.
- Start with tokens and primitives (1–3), then refactor components/screens (4–6), and finish with guardrails, docs, and tests (7–10).

## Affected Areas (non-exhaustive)
- `tamagui.config.ts`
- `components/ui/*` (Button, Card, Input, Modal, RoleSelector)
- `app/*` tab layouts and screens using inline styles
- `components/Themed.tsx` and usage of `constants/Colors.ts`
- Chart components in `components/dashboard/*`
