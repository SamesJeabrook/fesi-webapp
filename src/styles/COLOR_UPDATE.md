# Color Tokens Update

## ✅ Added Complete Color Palettes

I've extended all semantic color palettes to include numbered scales (50-900) in addition to the existing semantic names (light, main, dark).

### Available Warning Colors

```scss
// Numbered scale (50-900)
$warning-50: #fffbeb; // Lightest
$warning-100: #fef3c7;
$warning-200: #fde68a;
$warning-300: #fcd34d;
$warning-400: #fbbf24;
$warning-500: #f59e0b; // Main warning (what StarRating uses)
$warning-600: #d97706;
$warning-700: #b45309;
$warning-800: #92400e;
$warning-900: #78350f; // Darkest

// Semantic aliases (backwards compatibility)
$warning-light: #fef3c7;
$warning-main: #f59e0b;
$warning-dark: #d97706;
```

### Available Success Colors

```scss
$success-50 through $success-900
$success-light, $success-main, $success-dark
```

### Available Error Colors

```scss
$error-50 through $error-900
$error-light, $error-main, $error-dark
```

### Available Info Colors

```scss
$info-50 through $info-900
$info-light, $info-main, $info-dark
```

### Usage in Components

```scss
@use "../../../styles/tokens/colors" as colors;

.component {
  // Use numbered scale for precise control
  color: colors.$warning-500;
  background: colors.$success-100;
  border-color: colors.$error-300;

  // Or use semantic names for common cases
  color: colors.$warning-main;
  background: colors.$success-light;
  border-color: colors.$error-dark;
}
```

### Map Access

```scss
// Using the color() helper function
.component {
  color: colors.color(warning, 500);
  background: colors.color(success, 100);
}

// Direct map access
.component {
  color: map.get(colors.$warning, 500);
  background: map.get(colors.$success, 100);
}
```

## Fixed Issue

The StarRating component was looking for `colors.$warning-500` which is now available. All color palettes now have complete numbered scales for consistent usage across components.
