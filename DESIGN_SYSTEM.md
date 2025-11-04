# Design System

This document outlines the design tokens, components, and usage guidelines for the ZiRoFit app.

## Colors

The app uses a semantic color system with light and dark variants.

### Color Roles
- `primary`: Main brand color (#007AFF light, #0A84FF dark)
- `secondary`: Secondary actions (#6B7280 light, #9CA3AF dark)
- `surface`: Card backgrounds (#F9FAFB light, #1F2937 dark)
- `surfaceHover`: Hover states
- `border`: Dividers and outlines (#D1D5DB light, #4B5563 dark)
- `success`: Positive actions (#10B981 light, #34D399 dark)
- `danger`: Errors and destructive actions (#EF4444 light, #F87171 dark)
- `warning`: Warnings (#F59E0B light, #FBBF24 dark)
- `info`: Information (#3B82F6 light, #60A5FA dark)
- `text`: Primary text (#111827 light, #F9FAFB dark)
- `textSecondary`: Secondary text (#4B5563 light, #D1D5DB dark)
- `background`: Page backgrounds (#FFFFFF light, #0B1120 dark)

### Usage in Code
```tsx
import { Button } from '@/components/ui/Button';

// Primary button
<Button theme="primary">Save</Button>

// Custom color (avoid, prefer themes)
<View backgroundColor="$color.surface" />
```

## Spacing

Uses a consistent spacing scale:
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px
- `3xl`: 64px

## Typography

### Fonts
- Body: System font for regular text
- Heading: System font for headings with tighter letter spacing

### Text Components
```tsx
import { BodyText } from '@/components/Themed';
import { H1, H2, H3, H4, H5, H6 } from 'tamagui';

// Headings
<H1>Main Title</H1>
<H3>Section Title</H3>

// Body text
<BodyText>Regular content</BodyText>
```

## Components

### Layout
- `Screen`: Wraps content with SafeAreaView and background
- `Section`: Groups content with title and spacing
- `List`: Vertical list with consistent spacing

### UI
- `Button`: Variants for primary, secondary, outline, danger, ghost
- `Card`: Elevated containers
- `Input`: Form inputs with validation styles
- `Modal`: Platform-specific modal dialogs

### Example Usage
```tsx
import { Screen, Section, List, Card, Button } from '@/components/ui/*';

<Screen>
  <Section title="My Section">
    <List>
      <Card padding="$4">
        <BodyText>Content</BodyText>
        <Button variant="primary">Action</Button>
      </Card>
    </List>
  </Section>
</Screen>
```

## Theming

The app supports light and dark themes automatically based on system preference. All components are theme-aware.

## Accessibility

- Minimum 4.5:1 contrast ratio for text
- Touch targets minimum 44px
- Semantic color usage ensures readability in both themes

## Development Guidelines

- Always use theme tokens over hardcoded values
- Prefer component variants over custom styling
- Test components in both light and dark themes
- Use layout primitives for consistent spacing
