import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  getActivePath,
  managementMenuItems,
  normalizePath,
  userMenuGroups,
  userMenuItems,
} from './routes';

describe('prototype routes baseline', () => {
  it('keeps the fixed user-side top-level menu order', () => {
    expect(userMenuGroups).toEqual(['产品管理', '商品管理', '库存管理', '配置管理']);
  });

  it('keeps the required visible user-side entries', () => {
    expect(userMenuItems.map((item) => item.path)).toEqual([
      '/products/list',
      '/products/template-download',
      '/products/import',
      '/channel-items/list',
      '/channel-items/detail-pages',
      '/channel-items/batch-edit',
      '/inventory/list',
      '/inventory/adjustments',
      '/store-config/list',
      '/materials/list',
    ]);
  });

  it('places material list under product management', () => {
    expect(userMenuItems.find((item) => item.path === '/materials/list')).toMatchObject({
      group: '产品管理',
      label: '素材列表',
    });
  });

  it('maps hidden routes back to their active menu entries', () => {
    expect(getActivePath('/products/detail')).toBe('/products/list');
    expect(getActivePath('/products/template-download')).toBe('/products/template-download');
    expect(getActivePath('/products/import-records')).toBe('/products/import');
    expect(getActivePath('/channel-items/detail')).toBe('/channel-items/list');
    expect(getActivePath('/materials/detail')).toBe('/materials/list');
    expect(getActivePath('/management/customers/detail')).toBe('/management/customers/list');
    expect(getActivePath('/management/system/admin-users/detail')).toBe('/management/system/admin-users/list');
  });

  it('normalizes root and management container paths to the correct leaf routes', () => {
    expect(normalizePath('/')).toBe('/products/list');
    expect(normalizePath('/overview')).toBe('/products/list');
    expect(normalizePath('/products')).toBe('/products/list');
    expect(normalizePath('/channel-items')).toBe('/channel-items/list');
    expect(normalizePath('/inventory')).toBe('/inventory/list');
    expect(normalizePath('/store-config')).toBe('/store-config/list');
    expect(normalizePath('/materials')).toBe('/materials/list');
    expect(normalizePath('/management')).toBe('/management/customers/list');
  });

  it('keeps the fixed management-side menu tree', () => {
    expect(managementMenuItems.map((item) => item.path)).toEqual([
      '/management/customers/list',
      '/management/category-mappings/list',
      '/management/attribute-mappings/list',
      '/management/system/admin-users/list',
    ]);
  });

  it('does not expose internal product-scope decisions as visible prototype copy', () => {
    const appSource = readFileSync(new URL('./App.tsx', import.meta.url), 'utf8');

    expect(appSource).not.toContain('产品资料导入入口已保留');
    expect(appSource).not.toContain('入口保留');
    expect(appSource).not.toContain('本期不开放');
    expect(appSource).not.toContain('本期暂未开放');
  });

  it('does not render large import-count metric cards above the import table', () => {
    const appSource = readFileSync(new URL('./App.tsx', import.meta.url), 'utf8');

    expect(appSource).not.toContain('<MiniMetric label="当前批次"');
    expect(appSource).not.toContain('<MiniMetric label="失败批次"');
    expect(appSource).not.toContain('<MiniMetric label="待确认"');
  });

  it('keeps template download focused on conditions and records, without a pseudo preview panel', () => {
    const appSource = readFileSync(new URL('./App.tsx', import.meta.url), 'utf8');

    expect(appSource).not.toContain('模板预览');
    expect(appSource).not.toContain('字段范围');
  });

  it('simulates Doudian template download without embedding SDK credentials', () => {
    const appSource = readFileSync(new URL('./App.tsx', import.meta.url), 'utf8');
    const dataSource = readFileSync(new URL('./data.ts', import.meta.url), 'utf8');
    const visiblePrototypeSources = `${appSource}\n${dataSource}`;

    expect(visiblePrototypeSources).toContain('抖店导入模板 / 2026-04-27');
    expect(appSource).toContain('叶子类目 ID 1000006731');
    expect(appSource).toContain('抖店类目规则已带入模板字段');
    expect(visiblePrototypeSources).not.toContain('TPL-DOUYIN');
    expect(visiblePrototypeSources).not.toContain('TPL-TAOBAO');
    expect(visiblePrototypeSources).not.toContain('TPL-KUAISHOU');
    expect(visiblePrototypeSources).not.toContain('TPL-PINDUODUO');
    expect(appSource).not.toContain('.doudian_access_token');
    expect(appSource).not.toContain('access_token');
    expect(appSource).not.toContain('DOUDIAN_APP_SECRET');
  });
});
