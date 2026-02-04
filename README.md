# Forever Moment UI

A React + TypeScript + Vite project structured for scalability and maintainability.

## 🚀 Getting Started

### Prerequisites

- Node.js v20.20.0 (or v20 LTS)
- npm v10.8.2

### Installation

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

## 📂 Project Structure

This project follows a feature-based architecture:

```
src/
├── assets/          # Static assets (images, fonts)
├── components/      # Shared/Global UI components
├── config/          # Environment variables & constants
├── features/        # Feature-specific components, hooks, stores
├── hooks/           # Global hooks
├── layouts/         # Page layouts
├── lib/             # Third-party library configurations
├── pages/           # Route components (lazy loaded)
├── router/          # Router configuration
├── store/           # Global Redux store
├── types/           # Global TS types
└── utils/           # Helper functions
```

## 🛠 Tech Stack & Tooling

- **Vite**: Build tool and dev server.
- **React 19**: UI library.
- **Redux Toolkit**: State management.
- **TailwindCSS**: Utility-first CSS framework.
- **TypeScript**: Static typing.
- **ESLint**: Linting.

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.
