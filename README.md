# Phi Long Portfolio

A personal portfolio site for Phi Long, built with React, Vite, Tailwind, Framer Motion, and React Three Fiber.

## What changed

The original site had a strong visual hook, but it read more like a 3D template shell than a convincing portfolio:

- expired countdown section
- weak project hierarchy
- almost no explanation of actual work
- stock Vite README noise

This pass rebuilds the structure around what matters:

- a clearer hero
- selected project highlights
- a short focus/strengths section
- better navigation
- portfolio-first copy instead of placeholder energy

## Stack

- React
- Vite
- Tailwind CSS
- Framer Motion
- React Three Fiber / Drei

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Lint

```bash
npm run lint
```

## Notes

- The repo still contains an AWS CDK deployment folder under `cdk/`.
- The current priority is improving the site itself; infra/docs cleanup can be a second pass.
