# Market Collection Frontend

A modern, responsive web application built with React, TypeScript, and Vite. This application provides a robust frontend solution for market data collection and visualization.

## ✨ Features

- **Modern UI Components** - Built with Radix UI and shadcn/ui for accessible, customizable components
- **State Management** - Powered by TanStack Query for efficient server state management
- **Form Handling** - Robust form management with React Hook Form and Zod validation
- **Routing** - Client-side routing with TanStack Router
- **Data Visualization** - Interactive charts and data tables with Tremor
- **Realtime Updates** - Real-time data synchronization with ElectricSQL
- **Type Safety** - Full TypeScript support for type-safe development

## 🚀 Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with Tailwind Merge
- **UI Components**: Radix UI, shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: TanStack Router
- **Data Visualization**: Tremor
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Realtime**: ElectricSQL

## 📁 Project Structure

```
src/
├── assets/          # Static assets (images, fonts, etc.)
├── components/      # Reusable UI components
├── features/        # Feature-based modules
├── hooks/           # Custom React hooks
├── lib/             # Third-party library configurations
├── routes/          # Application routes
├── services/        # API services and data fetching
├── stores/          # Global state management
├── styles/          # Global styles and Tailwind configuration
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/market-collection-fe.git
   cd market-collection-fe
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
# or
yarn build
```

## 📦 Dependencies

Key dependencies and their purposes:

- `@tanstack/react-query`: Server state management
- `@tanstack/router`: Type-safe routing
- `@radix-ui/*`: Accessible UI primitives
- `@shadcn/ui`: Reusable UI components
- `tremor`: Data visualization
- `react-hook-form`: Form state management
- `date-fns`: Date manipulation
- `axios`: HTTP client
- `electric-sql`: Realtime data synchronization

## 🌐 Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
VITE_API_URL=your_api_url_here
VITE_ELECTRIC_URL=your_electric_sql_url
# Add other environment variables as needed
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vite](https://vitejs.dev/) for the amazing build tooling
- [TanStack](https://tanstack.com/) for their excellent React libraries
- [Radix UI](https://www.radix-ui.com/) for accessible UI primitives
- [shadcn/ui](https://ui.shadcn.com/) for beautiful, reusable components

---

<div align="center">
  Made with ❤️ by [Your Team/Name]
</div>
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
