# Typography Component

The Typography component provides a consistent way to apply design system typography styles while maintaining semantic HTML structure.

## Usage Examples

```tsx
import { Typography } from '@/components/atoms';

// Basic usage (defaults to <p> element)
<Typography variant="body-medium">
  This is body text rendered as a paragraph
</Typography>

// Custom HTML element
<Typography variant="heading-2" as="h1">
  This renders as an H1 but with heading-2 styling
</Typography>

// All available variants:
<Typography variant="heading-1">Largest heading</Typography>
<Typography variant="heading-2">Large heading</Typography>
<Typography variant="heading-3">Medium heading</Typography>
<Typography variant="heading-4">Small heading</Typography>
<Typography variant="heading-5">Smaller heading</Typography>
<Typography variant="heading-6">Smallest heading</Typography>
<Typography variant="heading-7">Tiny heading</Typography>
<Typography variant="heading-8">Micro heading</Typography>

<Typography variant="body-large">Large body text</Typography>
<Typography variant="body-medium">Standard body text</Typography>
<Typography variant="body-small">Small body text</Typography>

<Typography variant="caption">Caption text</Typography>
<Typography variant="overline">OVERLINE TEXT</Typography>

// With custom styling
<Typography
  variant="heading-3"
  as="h2"
  className="custom-class"
  style={{ color: 'blue' }}
>
  Custom styled text
</Typography>
```

## Available HTML Elements (`as` prop)

- `h1`, `h2`, `h3`, `h4`, `h5`, `h6` - Headings
- `p` - Paragraph (default)
- `span`, `div` - Generic containers
- `label`, `legend` - Form elements
- `figcaption` - Figure caption
- `small`, `strong`, `em`, `mark`, `del`, `ins`, `sub`, `sup` - Text formatting

## Benefits

- ✅ **Consistent styling** from design system
- ✅ **Semantic HTML** with flexible element choice
- ✅ **Type safety** with TypeScript
- ✅ **Accessible** markup with proper semantics
- ✅ **Easy maintenance** - styles centralized in SCSS tokens
