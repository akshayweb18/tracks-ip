# 🤝 Contributing to Tracks IP

Thank you for your interest in contributing! This guide will help you get started.

## 📋 Code of Conduct

- Be respectful to all contributors
- Provide constructive feedback
- Help others learn and grow
- Report issues responsibly

## 🐛 How to Report Bugs

1. **Check existing issues** — Search before creating a new one
2. **Provide details**:
   - Steps to reproduce
   - Expected vs. actual behavior
   - Environment (Node version, OS, MongoDB version)
   - Screenshots/logs if applicable
3. **Use the bug report template** provided in GitHub Issues

## 💡 Feature Requests

1. **Describe the feature** — What problem does it solve?
2. **Provide examples** — How would users interact with it?
3. **Discuss alternatives** — Have you considered other solutions?

## 🔨 Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/tracks-ip.git
   cd tracks-ip
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Install dependencies**
   ```bash
   pnpm install
   ```

4. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your MongoDB URI
   ```

5. **Start development**
   ```bash
   pnpm dev
   ```

## ✅ Making Changes

### Frontend (React/Next.js)

- Components should be in `src/components/`
- Pages in `src/app/`
- Use Shadcn/UI and Tailwind CSS for styling
- Follow existing naming conventions (PascalCase for components)

### Backend (API Routes)

- API routes in `src/app/api/`
- Use `NextResponse` from `next/server`
- Include proper error handling
- Validate input data

### Database (MongoDB)

- Schemas in `src/models/`
- Use Mongoose for data validation
- Include required field constraints

## 📝 Code Quality

Before submitting a PR, ensure:

```bash
# Run linter
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format

# Check formatting
pnpm format:check
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/          # API endpoints
│   ├── devices/      # Device listing page
│   ├── login/        # Authentication pages
│   └── layout.jsx    # Root layout
├── components/       # React components
├── lib/              # Utilities, database connection
└── models/           # Mongoose schemas
```

## 🎯 Coding Standards

### File Naming
- Components: `PascalCase.jsx` (e.g., `DeviceTable.jsx`)
- Utilities: `camelCase.js` (e.g., `deviceStatus.js`)
- API routes: `route.js` (Next.js convention)

### Code Style
- Use `const` by default, `let` if needed (no `var`)
- Use arrow functions
- Destructure objects and arrays
- Add comments for complex logic
- Use meaningful variable names

### Example Component
```jsx
"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/button";

export default function MyComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch data on mount
    async function loadData() {
      try {
        const res = await fetch("/api/data");
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    }

    loadData();
  }, []);

  return <div>{data && <p>{data.message}</p>}</div>;
}
```

## 🔄 Submitting a Pull Request

1. **Ensure your branch is up to date**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Make sure tests pass** (if applicable)
   ```bash
   pnpm lint
   pnpm format:check
   pnpm build
   ```

3. **Push your changes**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a Pull Request** on GitHub

5. **PR Checklist**
   - [ ] Descriptive title and description
   - [ ] Linked related issues
   - [ ] Added/updated documentation
   - [ ] Code is linted and formatted
   - [ ] No console errors in browser
   - [ ] Tested in different browsers/devices (if UI change)

## 📖 Documentation

- Update `README.md` for major features
- Add inline comments for complex logic
- Document new API endpoints
- Update this guide if adding new processes

## 🚀 Release Process

1. **Version bumping** — Use semantic versioning (major.minor.patch)
2. **Update CHANGELOG** — Document changes
3. **Tag release** — `git tag v0.2.0`
4. **Push to main** — PR reviewers merge to main

## ❓ Questions?

- Open a **GitHub Discussion** for questions
- Check existing **Issues** and **Discussions**
- See the main [README.md](README.md) for setup help

---

**Thank you for contributing to Tracks IP! 🎉**
