# Calculator App

A modern, responsive calculator built with React 19, TypeScript, and Tailwind CSS.

## Features

- ✅ Basic arithmetic operations (+, -, ×, ÷)
- ✅ Advanced operations (%, √, ^)
- ✅ Memory functions (MC, MR, MS, M+, M-)
- ✅ Keyboard input support
- ✅ Calculation history with persistence
- ✅ Dark/Light theme support
- ✅ Fully responsive design
- ✅ Comprehensive test coverage

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (comes with Node.js)

### Installation

Since this project was originally configured for pnpm but pnpm may not be available, use npm instead:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test:ci

# Run linter
npm run eslint

# Format code
npm run prettier
```

### Alternative Installation Script

You can also use the provided install script:

```bash
# Make script executable
chmod +x install.sh

# Install dependencies
./install.sh install

# Build application
./install.sh build

# Run tests
./install.sh test:ci
```

## Project Structure

```
src/
├── components/
│   ├── Calculator/     # Calculator components
│   ├── Layout/         # Layout components
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── types/              # TypeScript definitions
├── utils/              # Utility functions
└── __tests__/          # Test files
```

## Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - UI components
- **React Router** - Routing
- **Vitest** - Testing framework
- **React Testing Library** - Component testing

## Testing

The project includes comprehensive tests:

```bash
# Run all tests
npm run test

# Run tests in CI mode
npm run test:ci

# Run tests with coverage
npm run test:coverage
```

## Keyboard Shortcuts

- **Numbers (0-9)**: Input digits
- **Operators (+, -, *, /)**: Mathematical operations
- **=** or **Enter**: Calculate result
- **Backspace**: Clear current entry
- **Escape**: All clear
- **Ctrl/Cmd + A**: All clear
- **F9**: Toggle sign (+/-)
- **F12**: Square root

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is private and for demonstration purposes.