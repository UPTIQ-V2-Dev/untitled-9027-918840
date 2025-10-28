#!/bin/bash

# Install script for the calculator app
# This script provides npm alternatives to pnpm commands

case "$1" in
  "install")
    echo "Installing dependencies with npm..."
    npm install
    ;;
  "build")
    echo "Building with npm..."
    npm run build
    ;;
  "test:ci")
    echo "Running tests with npm..."
    npm run test:ci
    ;;
  "eslint")
    echo "Running ESLint with npm..."
    npm run eslint
    ;;
  "prettier")
    echo "Running Prettier with npm..."
    npm run prettier
    ;;
  *)
    echo "Usage: $0 {install|build|test:ci|eslint|prettier}"
    echo ""
    echo "Available commands:"
    echo "  install   - Install dependencies"
    echo "  build     - Build the application"
    echo "  test:ci   - Run tests"
    echo "  eslint    - Run linter"
    echo "  prettier  - Format code"
    ;;
esac