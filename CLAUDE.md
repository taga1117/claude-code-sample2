# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Todo List application built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4. The app is deployed to GitHub Pages as a static export.

## Commands

All commands should be run from the `todo-app` directory:

```bash
cd todo-app

# Development
npm run dev          # Start dev server at http://localhost:3000

# Build
npm run build        # Build for production (static export to /out)

# Testing
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once

# Linting
npm run lint         # Run ESLint
```

## Architecture

### Directory Structure

- `todo-app/` - Main Next.js application
  - `src/app/` - Next.js App Router pages
  - `src/components/` - React components
  - `src/test/` - Test setup files

### Key Configuration

- **Static Export**: The app uses `output: "export"` in `next.config.ts` for GitHub Pages deployment
- **Base Path**: Set to `/claude-code-sample2` for GitHub Pages subdirectory hosting
- **Testing**: Uses Vitest with React Testing Library and jsdom environment

### Deployment

Pushes to `main` branch trigger automatic deployment to GitHub Pages via `.github/workflows/deploy.yml`.
