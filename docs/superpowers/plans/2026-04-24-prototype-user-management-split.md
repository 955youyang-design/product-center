# Prototype User And Management Split Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the prototype around the current docs baseline so the middle-platform user side and management side have independent menu trees, stable routes, and correct page boundaries.

**Architecture:** Keep the prototype inside the existing React app, but split route and menu metadata into focused config modules so both ends can share layout primitives while keeping independent navigation. Move the management-side governance flows under `/management`, narrow the user-side item detail and store config pages to read-only mapping consumption, and keep hidden detail routes mapped back to their active menus.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS, lucide-react, motion

---

### Task 1: Freeze navigation and route metadata into config

**Files:**
- Create: `frontend/apps/product-prototype/src/routes.ts`
- Modify: `frontend/apps/product-prototype/src/App.tsx`
- Test: `frontend/apps/product-prototype/src/routes.test.ts`

- [ ] Extract user-side and management-side route declarations, menu keys, route keys, active-path metadata, and redirect normalization helpers into `src/routes.ts`.
- [ ] Add a test file that asserts the fixed menu order, visible menu entries, hidden-route back-linking, and `/management` route normalization.
- [ ] Run the route tests first and confirm they fail before implementation.
- [ ] Update `App.tsx` to read navigation and normalization from the extracted config.

### Task 2: Re-shape user-side page boundaries

**Files:**
- Modify: `frontend/apps/product-prototype/src/App.tsx`
- Modify: `frontend/apps/product-prototype/src/data.ts`
- Test: `frontend/apps/product-prototype/src/routes.test.ts`

- [ ] Narrow `渠道商品详情` to selling fields plus adaptation-result summary and jump entry to `/channel-items/detail-pages`.
- [ ] Expand `渠道商品详情页列表` to support product aggregation, channel-item filtering, upload/edit/current-version/material-reuse actions, and enforce the per-channel-item max-3 rule in the UI.
- [ ] Narrow `配置管理` and `店铺配置详情` to store selling defaults only, and switch all adaptation language to `API-ITEM-CATEGORY-ADAPTATION-GET`.
- [ ] Keep `新增产品` button-only, keep detail/record pages hidden, and ensure active menu states remain correct.

### Task 3: Add management-side prototype under `/management`

**Files:**
- Modify: `frontend/apps/product-prototype/src/App.tsx`
- Modify: `frontend/apps/product-prototype/src/data.ts`
- Modify: `frontend/apps/product-prototype/src/routes.ts`
- Test: `frontend/apps/product-prototype/src/routes.test.ts`

- [ ] Add management-side menu groups and route views for customer list/detail, category mapping list/detail, attribute mapping list/detail, and admin-user list/detail.
- [ ] Build customer detail so middle-platform user accounts only appear inside the customer detail page and not as a standalone menu.
- [ ] Model customer-isolated category/attribute mapping data with dedicated mock objects and reflect their governance-only ownership in the UI copy and actions.
- [ ] Make `/management` normalize to `/management/customers/list`.

### Task 4: Verify the integrated prototype

**Files:**
- Modify: `frontend/apps/product-prototype/package.json`
- Modify: `frontend/package.json`

- [ ] Add the smallest viable automated test command for the new route assertions.
- [ ] Run the route tests, `corepack pnpm typecheck`, and `corepack pnpm build`.
- [ ] Confirm both `http://127.0.0.1:5670/products/list` and `http://127.0.0.1:5670/management/customers/list` return `200`.
