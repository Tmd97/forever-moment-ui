# Forever Moment UI - Architecture & Onboarding Guide

Welcome to the Forever Moment UI project! This document provides a high-level overview of the application architecture, file structure, and development patterns to help you get up to speed quickly.

## 🏗️ Architecture Overview

This project is a React application built with **Vite**, **TypeScript**, and **Redux Toolkit**. It follows a **Domain-Feature Architecture**, which separates the application into distinct business domains (`Admin` vs `Customer`) to ensure scalability and maintainability.

### Key Technologies
- **Framework**: React 19 + Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS + Shadcn UI
- **Routing**: React Router v7
- **Configuration**: Dynamic JSON-based configuration

---

## 📂 Project Structure

The `src` directory is organized to keep related code together (Colocation Pattern).

```
src/
├── config/              # Centralized configuration (Navigation, Forms, Routes)
│   ├── navigation.json  # Sidebar menu structure
│   ├── forms.json       # Dynamic form definitions
│   └── ...
│
├── features/            # Core business logic features
│   ├── admin/           # Admin-specific features
│   │   ├── category/    # "Category" feature module
│   │   │   ├── pages/   # Feature-specific pages
│   │   │   ├── store/   # Redux slice (actions, reducers) & API
│   │   │   └── components/ # Feature-specific components
│   │   └── dashboard/   # "Dashboard" feature module
│   └── customer/        # Customer-facing features
│
├── components/          # Shared/Generic UI components
│   ├── ui/              # Shadcn primitive components (Button, Input, etc.)
│   ├── admin/common/    # Reusable admin components (DataTable, Sidebar)
│   └── customer/common/ # Reusable customer components
│
├── store/               # Global Redux store configuration
│   ├── config/          # Configuration state slice
│   └── reducers.ts      # Root reducer combining feature slices
│
├── layouts/             # Main application layouts
│   ├── admin/           # AdminLayout (Sidebar + Header + Content)
│   └── customer/        # CustomerLayout (Navbar + Footer + Content)
│
├── hooks/               # Custom React hooks (useNavigationConfig, etc.)
├── services/            # Global services (Auth, Config)
└── types/               # TypeScript type definitions
```

---

## 🔄 Data Flow

We use **Redux Toolkit** for state management. The data flow follows a unidirectional pattern:

1.  **Component** dispatches an **Action** (e.g., `fetchCategories()`).
2.  **Thunk** (in `store/actions.ts`) makes an API call via **Service/API**.
3.  **Reducer** updates the **State** based on the result (success/failure).
4.  **Selector** retrieves data from State to update the **Component**.

### Example: Category Feature
-   **State**: `src/features/admin/category/store/reducer.ts`
-   **Actions**: `src/features/admin/category/store/actions.ts`
-   **API**: `src/features/admin/category/store/api.ts`

---

## ⚙️ Dynamic Configuration System

The application is designed to be **configuration-driven**. This means many UI aspects are controlled by JSON files in `src/config/` rather than hardcoded logic.

-   **Navigation**: Sidebar menus are defined in `navigation.json`.
-   **Forms**: Form fields and validation in `forms.json`.
-   **Tables**: Column definitions in `tables.json`.

**Implication for Developers**:
-   When adding a new menu item, check `navigation.json` first.
-   The `configService.ts` handles loading these configurations on app startup.

---

## 🚀 Development Workflow

### Adding a New Admin Feature
1.  Create directory: `src/features/admin/[feature-name]`
2.  Add **Store Slice**: Create `store/reducer.ts`, `actions.ts`, `types.ts`
3.  Add **Pages**: Create `pages/[Feature]Page/index.tsx`
4.  Add **Route**: Update `src/config/routes.json` or `routes.tsx`
5.  Add **Menu Item**: Update `src/config/navigation.json`

### Styling
-   Use **Tailwind CSS** utility classes for layout and spacing.
-   Use **Shadcn UI** components (`src/components/ui`) for base elements.
-   Keep styles consistent with the `admin` or `customer` theme.

---

## 📝 Naming Conventions

-   **Folders**: `kebab-case` (e.g., `event-management`)
-   **Components**: `PascalCase` (e.g., `CategoryForm.tsx`)
-   **Functions/Variables**: `camelCase` (e.g., `fetchCategories`)
-   **Redux Actions**: `UPPER_SNAKE_CASE` (e.g., `FETCH_CATEGORIES_SUCCESS`)

---

## 🤝 Contributing

1.  Create a feature branch.
2.  Follow the folder structure.
3.  Ensure your code is typed strictly (avoid `any`).
4.  Run `npm run build` locally to verify no type errors before pushing.
