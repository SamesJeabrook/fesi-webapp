# Menu Components

This directory contains the menu-related components following atomic design principles.

## Components Overview

### Organism: MenuCategory

The `MenuCategory` component groups multiple `MenuItemCard` components under a category heading (e.g., "Pizza", "Sides", "Drinks").

**Location:** `src/components/organisms/MenuCategory/`

**Props:**

```typescript
interface MenuCategoryProps {
  name: string; // Category name
  items: MenuItem[]; // Array of menu items
  onItemClick?: (MenuItem) => void; // Item selection callback
  className?: string; // Custom styling
  "data-testid"?: string; // Testing identifier
}
```

**Features:**

- Responsive grid layout (1-4 columns based on screen size)
- Semantic HTML with proper ARIA labels
- Empty state handling
- Keyboard navigation support

### Template: MenuDisplay

The `MenuDisplay` template combines multiple `MenuCategory` organisms to display a complete restaurant menu with merchant information.

**Location:** `src/components/templates/MenuDisplay/`

**Props:**

```typescript
interface MenuDisplayProps {
  merchant: Merchant; // Restaurant information
  categories: MenuCategory[]; // Menu categories with items
  onItemClick?: (MenuItem) => void; // Item selection callback
  isLoading?: boolean; // Loading state
  error?: string; // Error message
  className?: string; // Custom styling
  "data-testid"?: string; // Testing identifier
}
```

**Features:**

- Loading and error states
- Empty menu handling
- Merchant header with optional image
- Responsive layout
- Accessible markup

## Data Transformation

### API Integration

The `src/utils/menu/menuTransformers.ts` provides utilities to transform your API response into the format expected by the components:

```typescript
import { transformMenuResponse } from "@/utils/menu";
import type { APIMenuResponse } from "@/utils/menu";

// Transform API response
const apiResponse: APIMenuResponse = await fetch("/api/menu").then((r) =>
  r.json()
);
const { merchant, categories } = transformMenuResponse(apiResponse);

// Use with components
<MenuDisplay
  merchant={merchant}
  categories={categories}
  onItemClick={handleItemClick}
/>;
```

### API Response Format

Your JSON structure is automatically transformed from:

```json
{
  "success": true,
  "data": {
    "merchant": {
      "id": "...",
      "name": "Mario's Authentic Pizzeria"
      // ... other merchant fields
    },
    "menu": [
      {
        "name": "Pizza",
        "display_order": 1,
        "items": [
          {
            "id": "...",
            "title": "Margherita",
            "base_price": 1200
            // ... other item fields
          }
        ]
      }
    ]
  }
}
```

## Usage Examples

### Basic Usage

```tsx
import { MenuDisplay } from "@/components/templates";
import { transformMenuResponse } from "@/utils/menu";

const MenuPage = () => {
  const [menuData, setMenuData] = useState(null);

  useEffect(() => {
    fetch("/api/menu")
      .then((response) => response.json())
      .then((apiResponse) => {
        const data = transformMenuResponse(apiResponse);
        setMenuData(data);
      });
  }, []);

  const handleItemClick = (item) => {
    // Add to cart, show details, etc.
    console.log("Selected:", item);
  };

  return (
    <MenuDisplay
      merchant={menuData?.merchant}
      categories={menuData?.categories || []}
      onItemClick={handleItemClick}
    />
  );
};
```

### Using Individual MenuCategory

```tsx
import { MenuCategory } from "@/components/organisms";

const PizzaSection = ({ pizzas }) => (
  <MenuCategory name="Pizza" items={pizzas} onItemClick={handlePizzaClick} />
);
```

## Styling

Components use CSS modules with design tokens:

- Spacing: `var(--spacing-1)` through `var(--spacing-16)`
- Colors: `var(--color-neutral-*)`, `var(--color-brand-*)`
- Typography: `%heading-h1`, `%body-large`, etc.
- Responsive: `@include mobile`, `@include tablet-up`

## Testing

Both components include comprehensive Storybook stories for development and testing:

- `MenuCategory.stories.tsx`
- `MenuDisplay.stories.tsx`

Stories cover various states:

- Default with items
- Loading states
- Error states
- Empty states
- Different item counts

## Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation
- Screen reader friendly
- Color contrast compliance
- Focus management

## Performance

- Efficient re-rendering with React.memo potential
- Optimized grid layouts
- Responsive images
- Minimal DOM updates
