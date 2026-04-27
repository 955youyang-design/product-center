# Prototype Persistence And List Return Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the prototype stable across refresh and preserve product-list review context when entering and returning from product detail.

**Architecture:** Add small pure helpers in `prototypeLogic.ts` for prototype-state snapshot persistence and product-list query state encoding/decoding, then wire those helpers into `App.tsx` so shared rows survive refresh and product list can round-trip filters plus scroll position through detail navigation.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, browser localStorage/sessionStorage

---

### Task 1: Add and test persistence/query helpers

**Files:**
- Modify: `frontend/apps/product-prototype/src/prototypeLogic.ts`
- Modify: `frontend/apps/product-prototype/src/prototypeLogic.test.ts`

- [ ] Add failing tests for snapshot serialization/parsing and product-list query encoding/decoding.
- [ ] Implement minimal helpers for parsing persisted snapshot JSON and product-list filter query params.
- [ ] Re-run `corepack pnpm -F @book-channel/product-prototype test -- prototypeLogic.test.ts` and confirm the helper tests pass.

### Task 2: Persist shared prototype state in App

**Files:**
- Modify: `frontend/apps/product-prototype/src/App.tsx`

- [ ] Hydrate shared user-side and management-side rows from localStorage on startup with safe fallback to mock defaults.
- [ ] Persist shared rows back to localStorage whenever they change.
- [ ] Keep route/menu behavior unchanged while adding persistence.

### Task 3: Preserve product-list review context

**Files:**
- Modify: `frontend/apps/product-prototype/src/App.tsx`

- [ ] Initialize product-list filters from route search.
- [ ] When entering product detail from product list, carry current filters in the route params and capture scroll position.
- [ ] When returning from product detail, restore the list filters and scroll position.

### Task 4: Verify

**Files:**
- Modify: `frontend/apps/product-prototype/src/App.tsx`

- [ ] Run `corepack pnpm -F @book-channel/product-prototype test`.
- [ ] Run `corepack pnpm -F @book-channel/product-prototype typecheck`.
- [ ] Run `corepack pnpm -F @book-channel/product-prototype build`.
- [ ] Smoke-check `/products/list` and `/products/detail` with the running dev server.
