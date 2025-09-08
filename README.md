# Fesi WebApp

A modern food ordering platform built with Next.js, TypeScript, and Storybook, following atomic design principles.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://gitlab.com/samesJeabrook/fesiwebapp.git
   cd fesiwebapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development servers**
   ```bash
   # Start Next.js development server
   npm run dev
   
   # In another terminal, start Storybook
   npm run storybook
   ```

4. **Open in browser**
   - **Next.js App**: http://localhost:3000
   - **Storybook**: http://localhost:6006

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with global styles
│   ├── page.tsx                 # Homepage
│   ├── loading.tsx              # Global loading component
│   ├── not-found.tsx            # 404 page
│   ├── global-error.tsx         # Error boundary
│   └── restaurants/             # Restaurant pages
│       ├── page.tsx             # Restaurant listing
│       └── [id]/                # Dynamic restaurant pages
│           └── page.tsx         # Individual restaurant
├── components/                   # Component library (Atomic Design)
│   ├── atoms/                   # Basic building blocks
│   │   ├── Button/              # Button component
│   │   ├── Input/               # Input component
│   │   └── Card/                # Card component
│   ├── molecules/               # Component combinations
│   │   ├── MenuItemCard/        # Menu item display
│   │   └── SearchInput/         # Search with debouncing
│   ├── organisms/               # Complex components (future)
│   └── templates/               # Page layouts (future)
├── styles/                      # Global styles and design system
│   ├── globals.scss             # Global styles and CSS variables
│   ├── designTokens.ts          # Design system tokens
│   └── mixins.scss              # SASS mixins
├── types/                       # TypeScript type definitions
│   ├── index.ts                 # Main type definitions
│   └── modules.d.ts             # Module declarations
├── mocks/                       # MSW (Mock Service Worker)
│   ├── handlers.ts              # API mock handlers
│   └── data.ts                  # Mock data
└── services/                    # API services (future)
```

## 🧪 Component Development

### Storybook Organization
Components are organized following atomic design principles:

- **🔬 Atoms**: Basic UI elements (Button, Input, Card)
- **🧬 Molecules**: Component combinations (MenuItemCard, SearchInput)
- **🏗️ Organisms**: Complex sections (coming soon)
- **📄 Templates**: Page layouts (coming soon)

### Component Structure
Each component follows a consistent structure:
```
ComponentName/
├── ComponentName.component.tsx   # React component
├── ComponentName.types.ts        # TypeScript interfaces
├── ComponentName.module.scss     # Styles (CSS modules)
├── ComponentName.stories.tsx     # Storybook stories
└── index.ts                      # Exports
```

## 🎨 Design System

### Design Tokens
Centralized design system with:
- **Colors**: Primary, secondary, neutral, success, warning, error palettes
- **Typography**: Font sizes, line heights, font weights
- **Spacing**: Consistent spacing scale
- **Borders**: Border radius and width tokens
- **Shadows**: Elevation system
- **Animations**: Duration and easing curves

### SASS Architecture
- **Modern @use syntax**: No deprecated @import statements
- **Mixins**: Reusable styles for buttons, inputs, typography, responsive design
- **Path aliases**: Clean imports with `@/styles/mixins`

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start Next.js development server
npm run storybook    # Start Storybook development server

# Building
npm run build        # Build Next.js for production
npm run build-storybook  # Build Storybook for deployment

# Testing
npm run test         # Run Vitest tests
npm run test:coverage    # Run tests with coverage

# Code Quality
npm run lint         # Run ESLint
```

## 🛠️ Technology Stack

### Core
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety

### Development
- **[Storybook 9](https://storybook.js.org/)** - Component development environment
- **[Vitest](https://vitest.dev/)** - Testing framework
- **[MSW](https://mswjs.io/)** - API mocking for development/testing

### Styling
- **[SASS](https://sass-lang.com/)** - CSS preprocessor with modern syntax
- **CSS Modules** - Scoped styling
- **Design Tokens** - Centralized design system

## 🏗️ Architecture Decisions

### Atomic Design
Components are organized using [Brad Frost's Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/) methodology:
- Promotes reusability and consistency
- Makes component hierarchy clear
- Facilitates design system thinking

### App Router (Next.js 15)
Using Next.js App Router for:
- Better developer experience
- Built-in loading and error states
- Improved SEO and performance
- Modern React features support

### Mock Service Worker (MSW)
MSW for API mocking:
- Realistic API behavior in Storybook
- Consistent data across development and testing
- No backend dependency for frontend development

## 📚 Documentation

### Component Documentation
Each component includes:
- **Storybook stories**: Interactive examples and documentation
- **TypeScript interfaces**: Clear prop definitions
- **Usage examples**: Multiple use cases and variations

### Design System
- **Storybook**: Visual component library at http://localhost:6006
- **Design tokens**: Centralized in `src/styles/designTokens.ts`
- **SASS mixins**: Reusable styles in `src/styles/mixins.scss`

## 🚧 Roadmap

### Current Status ✅
- [x] Basic component library (5 atoms, 2 molecules)
- [x] Next.js app structure with routing
- [x] Storybook with MSW integration
- [x] Design system foundation
- [x] TypeScript configuration
- [x] Modern SASS with @use syntax

### Upcoming 🔄
- [ ] Organism components (MenuGrid, RestaurantList)
- [ ] Template components (page layouts)
- [ ] API integration with backend
- [ ] Authentication system
- [ ] Cart functionality
- [ ] Payment integration
- [ ] Testing suite expansion

## 🤝 Contributing

1. **Component Development**: Use Storybook for isolated component development
2. **Follow Conventions**: Use the established component structure and naming
3. **Type Safety**: Ensure all components have proper TypeScript interfaces
4. **Documentation**: Add Storybook stories for new components
5. **Testing**: Write tests for component logic and interactions

## 📄 License

This project is licensed under the ISC License.

---

**Happy coding! 🎉**

For questions or support, please refer to the component documentation in Storybook or check the existing components for examples.
