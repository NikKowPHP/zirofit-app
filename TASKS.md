Of course. Here is a comprehensive refactoring plan to replace Tamagui with a standardized, custom UI component library built on top of React Native's core components.

This plan is designed to be executed in atomic, sequential phases to minimize disruption and ensure a smooth transition.

### **Project Goal: Standardize the UI Library**

The primary objective is to remove the dependency on Tamagui and establish a custom, in-house UI component library. This will reduce dependency overhead, give full control over styling and behavior, and create a clear, documented design system based on standard React Native practices.

---

### **Phase 1: Establish the New Design System Foundation**

Before removing any code, we must build its replacement. This phase creates the foundational tokens and providers for the new component library.

**1. Define Design Tokens:**
Create a new file, `constants/Theme.ts`, to house all design system tokens. This replaces the token definitions in `tamagui.config.ts` and `constants/Colors.ts`.

*   **Action:** Create `constants/Theme.ts`.
*   **Content:** Define JavaScript objects for colors (light and dark modes), spacing, font sizes, font weights, line heights, and border radii.

**Example `constants/Theme.ts`:**
```typescript
const colors = {
  light: {
    primary: '#007AFF',
    background: '#FFFFFF',
    card: '#F9FAFB',
    text: '#111827',
    textSecondary: '#6B7280',
    border: '#D1D5DB',
    danger: '#EF4444',
  },
  dark: {
    primary: '#0A84FF',
    background: '#0B1120',
    card: '#1F2937',
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    border: '#4B5563',
    danger: '#F87171',
  },
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const fontSizes = {
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  // ... h1, h2, etc.
};

// ... other tokens

export const theme = {
  colors,
  spacing,
  fontSizes,
  //...
};
```

**2. Create a Theme Provider and Hooks:**
Implement a standard React Context Provider to inject the theme into the component tree.

*   **Action:** Create a `hooks/useTheme.ts` file.
*   **Content:** This file will contain the `ThemeProvider`, a `useTheme` hook to access the current theme's values (light/dark), and a `useTheme` hook to access all tokens.

**Example `hooks/useTheme.ts`:**
```typescript
import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { theme as themeTokens } from '@/constants/Theme';

const ThemeContext = createContext(themeTokens.light);
const AllTokensContext = createContext(themeTokens);

export const AppThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? themeTokens.dark : themeTokens.light;

  return (
    <AllTokensContext.Provider value={themeTokens}>
      <ThemeContext.Provider value={theme}>
        {children}
      </ThemeContext.Provider>
    </AllTokensContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
export const useTokens = () => useContext(AllTokensContext);
```

**3. Integrate the Provider:**
Wrap the entire application with the new `AppThemeProvider` in the root layout file.

*   **Action:** Modify `app/_layout.tsx`.
*   **Change:** Replace `TamaguiProvider` with `AppThemeProvider`.

```typescript
// app/_layout.tsx
import { AppThemeProvider } from '@/hooks/useTheme';

function RootLayoutNav() {
  // ...
  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>  // Replaces TamaguiProvider
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            {/* ...screens */}
          </Stack>
        </ThemeProvider>
      </AppThemeProvider>
    </QueryClientProvider>
  );
}
```

**Acceptance Criteria for Phase 1:**
*   `tamagui.config.ts` is no longer the source of truth for design tokens.
*   The new `AppThemeProvider` is wrapping the application.
*   The `useTheme()` hook can successfully provide light/dark color values anywhere in the app.

---

### **Phase 2: Rebuild Core UI Components**

Rewrite the components in `components/ui` to use React Native's core components and the new theme system. **Do not modify the props interface yet** to avoid breaking all screens at once.

**1. Rebuild Layout Primitives:**
Create replacements for `XStack` and `YStack` to handle flexbox layouts easily.

*   **Action:** Create `components/ui/Stack.tsx`.
*   **Content:** Create `HStack` and `VStack` components that are simple `View` wrappers with `flexDirection` styles.

**Example `components/ui/Stack.tsx`:**```typescript
import { View, StyleSheet, ViewProps } from 'react-native';

export const VStack = (props: ViewProps) => <View {...props} style={[styles.vstack, props.style]} />;
export const HStack = (props: ViewProps) => <View {...props} style={[styles.hstack, props.style]} />;

const styles = StyleSheet.create({
  vstack: { flexDirection: 'column' },
  hstack: { flexDirection: 'row', alignItems: 'center' },
});
```

**2. Rebuild UI Components:**
Go through each component in `components/ui` and rewrite its implementation.

*   **`Button.tsx`:** Rewrite using `TouchableOpacity` and `Text`. Use the `useTheme` hook for colors.
*   **`Card.tsx`:** Rewrite using `View`. Use `useTheme` for `backgroundColor`, `borderColor`, etc.
*   **`Input.tsx`:** Rewrite using `TextInput`. Style it with `useTheme` values.
*   **`Screen.tsx`, `Section.tsx`, `List.tsx`:** These are already close to standard implementations but should be updated to use the new `VStack` and theme hooks for spacing and colors.
*   **`Modal.tsx`:** The current implementation uses Tamagui's `Sheet`. This should be replaced with React Native's built-in `Modal` component or a more suitable cross-platform library if the sheet behavior is critical.

**Example `components/ui/Card.tsx` (Rebuilt):**
```typescript
import { View, StyleSheet, ViewProps } from 'react-native';
import { useTheme, useTokens } from '@/hooks/useTheme';

export function Card(props: ViewProps) {
  const theme = useTheme();
  const tokens = useTokens();

  const cardStyle = {
    backgroundColor: theme.card,
    borderColor: theme.border,
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.md,
  };

  return <View {...props} style={[styles.card, cardStyle, props.style]} />;
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    // Add shadow styles for iOS/Android here
  },
});
```

**Acceptance Criteria for Phase 2:**
*   All components in `components/ui` are free of `tamagui` imports.
*   Components are styled using `StyleSheet` and the `useTheme`/`useTokens` hooks.
*   The application should still build and run, though visual regressions are expected.

---

### **Phase 3: Incremental Refactoring of Screens**

With the new component library in place, systematically update all screens and components to use them.

**1. Replace Tamagui Imports:**
Perform a project-wide search for `import { ... } from 'tamagui';`. For each file:

*   Replace layout components: `YStack` -> `VStack`, `XStack` -> `HStack`.
*   Replace typography: `H3`, `H5`, `Paragraph` -> A new standardized `<Text variant="h3">` component (which you will need to create in `components/ui`).
*   Replace props: Convert Tamagui's shorthand props (`padding="$4"`, `space="$3"`) to standard `style` props using the `useTokens` hook.

**Before:**
```jsx
import { YStack, H3 } from 'tamagui';

<YStack space="$4" padding="$4">
  <H3>My Title</H3>
</YStack>
```

**After:**
```jsx
import { VStack } from '@/components/ui/Stack';
import { Text } from '@/components/ui/Text'; // Assuming a new Text component
import { useTokens } from '@/hooks/useTheme';

const MyComponent = () => {
  const tokens = useTokens();
  const style = {
    padding: tokens.spacing.lg,
    gap: tokens.spacing.lg // for VStack 'space' replacement
  };

  return (
    <VStack style={style}>
      <Text variant="h3">My Title</Text>
    </VStack>
  );
}
```

**2. Update Navigation and Themed Components:**

*   **`components/Themed.tsx`:** This file will need a significant overhaul. The goal is to simplify it into a set of standard, theme-aware components (like the new `Text` component mentioned above). The `useThemeColor` hook should be refactored to use the new `useTheme` hook.
*   **Tab Bars (`app/(app)/(client)/(tabs)/_layout.tsx`):** The styling logic that relies on `theme.primary.get()` will break. This needs to be updated to use the new `useTheme` hook: `const theme = useTheme(); ... tintColor: theme.primary`.

**Acceptance Criteria for Phase 3:**
*   No screen or component imports from `tamagui`.
*   All styling props like `space`, `padding`, `color` are converted to standard `style` objects using the theme tokens.
*   The application is fully functional and visually consistent with the new design system.

---

### **Phase 4: Decommissioning Tamagui**

The final step is to remove all traces of Tamagui from the project.

1.  **Remove Dependencies:**
    *   **Action:** Edit `package.json`.
    *   **Change:** Remove `tamagui`, `@tamagui/config`, `@tamagui/babel-plugin`, `@tamagui/lucide-icons`, `@tamagui/portal`.

2.  **Update Configuration:**
    *   **Action:** Delete `tamagui.config.ts`.
    *   **Action:** Edit `babel.config.js` and remove the `'@tamagui/babel-plugin'`.
    *   **Action:** Edit `app.json` and remove any Tamagui-specific entries in the `web.build.babel` section if they are no longer needed.

3.  **Clean Up:**
    *   **Action:** Run `npm install` (or `yarn`) to update `node_modules` and the lock file.
    *   **Action:** Delete any remaining unused files or code related to the old implementation.
    *   **Action:** Run all tests (`npm run test`) and perform a full manual QA of the application on both iOS and Android.

**Acceptance Criteria for Phase 4:**
*   The project contains no references to "tamagui" in its codebase.
*   The application builds, runs, and passes all tests without Tamagui.
*   The final bundle size is potentially smaller.