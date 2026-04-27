# User-Side Prototype Closure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the biggest user-side prototype gaps so the React prototype can support user-flow review with shared state, complete core filters, and tighter page-to-page behavior.

**Architecture:** Keep the existing single-app React prototype, but move the user-side core entities onto App-level shared state so product, channel item, detail page, inventory, material, and store-config pages stop drifting apart. Add focused interaction helpers in `prototypeLogic.ts`, then wire only the required user-side pages to that shared state instead of rewriting the whole app.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS, lucide-react, motion, Vitest

---

### Task 1: Add tested user-side shared-state helpers

**Files:**
- Modify: `frontend/apps/product-prototype/src/prototypeLogic.ts`
- Modify: `frontend/apps/product-prototype/src/prototypeLogic.test.ts`

- [ ] Add failing tests for user-side product filtering, optional upload-shop import summaries, product creation, product updates, channel-item updates, detail-page save/current/reuse behavior, store-config state changes, and material filtering.
- [ ] Run `corepack pnpm -F @book-channel/product-prototype test -- --runInBand prototypeLogic.test.ts` and confirm the new assertions fail for the expected missing helpers.
- [ ] Implement the minimal helper functions and types in `prototypeLogic.ts` to satisfy those behaviors without changing unrelated management-side logic.
- [ ] Re-run `corepack pnpm -F @book-channel/product-prototype test -- --runInBand prototypeLogic.test.ts` and confirm the logic tests pass.

### Task 2: Lift user-side entities into App-level shared state

**Files:**
- Modify: `frontend/apps/product-prototype/src/App.tsx`

- [ ] Add App-level `useState` ownership for user-side `products`, `channelItems`, `detailPages`, `inventory`, `materials`, and `configs`.
- [ ] Pass the shared rows and setters into user-side pages that currently mutate page-local copies.
- [ ] Remove page-local copies where they break cross-page continuity, especially `DetailPageList`, `MaterialsList`, `InventoryList`, and `StoreConfigList`.
- [ ] Keep route shape and menu structure unchanged while wiring the new state through.

### Task 3: Complete the user-side V1 list-page gaps

**Files:**
- Modify: `frontend/apps/product-prototype/src/App.tsx`
- Modify: `frontend/apps/product-prototype/src/prototypeLogic.ts`
- Modify: `frontend/apps/product-prototype/src/prototypeLogic.test.ts`

- [ ] Add product-list filter controls for keyword, status, and source channel; make the list and export summary read from those filters instead of the shell search term alone.
- [ ] Change product import so template download stays multi-channel and upload tasks treat shop as optional instead of mandatory.
- [ ] Expand detail-page list with a real preview summary, jump-to-channel-item entry, and jump-to-materials entry from asset counts.
- [ ] Expand store-config list with copy and enable/disable actions.
- [ ] Expand materials list with type, bind-object, and channel filtering.

### Task 4: Close save/create flows so user-side pages are reviewable

**Files:**
- Modify: `frontend/apps/product-prototype/src/App.tsx`
- Modify: `frontend/apps/product-prototype/src/prototypeLogic.ts`
- Modify: `frontend/apps/product-prototype/src/prototypeLogic.test.ts`

- [ ] Make product create insert a new product into shared state and return the user to a stable product detail flow.
- [ ] Make product detail and channel-item detail save back into shared rows instead of only showing feedback.
- [ ] Make detail-page list save/current/reuse update shared detail-page and material state so channel-item detail and materials detail stay consistent.
- [ ] Make store-config detail save back into shared configs, and keep inventory detail reading from the shared inventory rows used by inventory list.

### Task 5: Verify user-side closure end to end

**Files:**
- Modify: `frontend/apps/product-prototype/src/App.tsx`

- [ ] Run `corepack pnpm -F @book-channel/product-prototype test`.
- [ ] Run `corepack pnpm -F @book-channel/product-prototype typecheck`.
- [ ] Run `corepack pnpm -F @book-channel/product-prototype build`.
- [ ] Browser-smoke `/products/list`, `/products/import`, `/channel-items/detail-pages`, `/store-config/list`, and `/materials/list` to confirm they render and the new actions do not throw runtime errors.
