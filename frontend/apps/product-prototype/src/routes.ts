export type UserRoutePath =
  | '/products/list'
  | '/products/detail'
  | '/products/template-download'
  | '/products/import'
  | '/products/import-records'
  | '/products/create'
  | '/channel-items/list'
  | '/channel-items/detail'
  | '/channel-items/detail-pages'
  | '/channel-items/batch-edit'
  | '/inventory/list'
  | '/inventory/detail'
  | '/inventory/adjustments'
  | '/store-config/list'
  | '/store-config/detail'
  | '/materials/list'
  | '/materials/detail';

export type ManagementRoutePath =
  | '/management/customers/list'
  | '/management/customers/detail'
  | '/management/category-mappings/list'
  | '/management/category-mappings/detail'
  | '/management/attribute-mappings/list'
  | '/management/attribute-mappings/detail'
  | '/management/system/admin-users/list'
  | '/management/system/admin-users/detail';

export type RoutePath = UserRoutePath | ManagementRoutePath;

export type NavAccent = 'blue' | 'indigo' | 'slate' | 'violet';
export type IconKey =
  | 'attribute-mappings'
  | 'batch-edit'
  | 'category-mappings'
  | 'channel-items'
  | 'customers'
  | 'detail-pages'
  | 'inventory'
  | 'inventory-adjustments'
  | 'materials'
  | 'products'
  | 'products-import'
  | 'template-download'
  | 'settings'
  | 'store-config'
  | 'system';

export type RouteDefinition = {
  accent: NavAccent;
  activePath: RoutePath;
  group: string;
  iconKey: IconKey;
  label: string;
  menuKey?: string;
  path: RoutePath;
  routeKey: string;
  visibleInMenu: boolean;
};

export const routeDefinitions: RouteDefinition[] = [
  {
    accent: 'blue',
    activePath: '/products/list',
    group: '产品管理',
    iconKey: 'products',
    label: '产品列表',
    menuKey: 'menu.product',
    path: '/products/list',
    routeKey: 'product.list',
    visibleInMenu: true,
  },
  {
    accent: 'blue',
    activePath: '/products/list',
    group: '产品管理',
    iconKey: 'products',
    label: '产品详情',
    path: '/products/detail',
    routeKey: 'product.detail',
    visibleInMenu: false,
  },
  {
    accent: 'blue',
    activePath: '/products/template-download',
    group: '产品管理',
    iconKey: 'template-download',
    label: '模板下载',
    menuKey: 'menu.product.template_download',
    path: '/products/template-download',
    routeKey: 'product.template_download',
    visibleInMenu: true,
  },
  {
    accent: 'blue',
    activePath: '/products/import',
    group: '产品管理',
    iconKey: 'products-import',
    label: '产品导入',
    menuKey: 'menu.product.import',
    path: '/products/import',
    routeKey: 'product.import',
    visibleInMenu: true,
  },
  {
    accent: 'blue',
    activePath: '/products/import',
    group: '产品管理',
    iconKey: 'products-import',
    label: '导入记录',
    path: '/products/import-records',
    routeKey: 'product.import_log',
    visibleInMenu: false,
  },
  {
    accent: 'blue',
    activePath: '/products/list',
    group: '产品管理',
    iconKey: 'products',
    label: '新增产品',
    path: '/products/create',
    routeKey: 'product.create',
    visibleInMenu: false,
  },
  {
    accent: 'slate',
    activePath: '/channel-items/list',
    group: '商品管理',
    iconKey: 'channel-items',
    label: '商品列表',
    menuKey: 'menu.channel_item',
    path: '/channel-items/list',
    routeKey: 'item.list',
    visibleInMenu: true,
  },
  {
    accent: 'slate',
    activePath: '/channel-items/list',
    group: '商品管理',
    iconKey: 'channel-items',
    label: '渠道商品详情',
    path: '/channel-items/detail',
    routeKey: 'item.detail',
    visibleInMenu: false,
  },
  {
    accent: 'slate',
    activePath: '/channel-items/detail-pages',
    group: '商品管理',
    iconKey: 'detail-pages',
    label: '详情页列表',
    menuKey: 'menu.channel_item.detail_page_list',
    path: '/channel-items/detail-pages',
    routeKey: 'item.detail_page_list',
    visibleInMenu: true,
  },
  {
    accent: 'slate',
    activePath: '/channel-items/batch-edit',
    group: '商品管理',
    iconKey: 'batch-edit',
    label: '批量修改',
    menuKey: 'menu.channel_item.batch_edit',
    path: '/channel-items/batch-edit',
    routeKey: 'item.batch_edit',
    visibleInMenu: true,
  },
  {
    accent: 'indigo',
    activePath: '/inventory/list',
    group: '库存管理',
    iconKey: 'inventory',
    label: '库存列表',
    menuKey: 'menu.inventory',
    path: '/inventory/list',
    routeKey: 'inventory.list',
    visibleInMenu: true,
  },
  {
    accent: 'indigo',
    activePath: '/inventory/list',
    group: '库存管理',
    iconKey: 'inventory',
    label: '库存详情',
    path: '/inventory/detail',
    routeKey: 'inventory.detail',
    visibleInMenu: false,
  },
  {
    accent: 'indigo',
    activePath: '/inventory/adjustments',
    group: '库存管理',
    iconKey: 'inventory-adjustments',
    label: '库存调整记录',
    menuKey: 'menu.inventory.adjust_log',
    path: '/inventory/adjustments',
    routeKey: 'inventory.adjust_log',
    visibleInMenu: true,
  },
  {
    accent: 'violet',
    activePath: '/store-config/list',
    group: '配置管理',
    iconKey: 'store-config',
    label: '店铺管理',
    menuKey: 'menu.config',
    path: '/store-config/list',
    routeKey: 'config.list',
    visibleInMenu: true,
  },
  {
    accent: 'violet',
    activePath: '/store-config/list',
    group: '配置管理',
    iconKey: 'store-config',
    label: '店铺配置详情',
    path: '/store-config/detail',
    routeKey: 'config.shop_detail',
    visibleInMenu: false,
  },
  {
    accent: 'blue',
    activePath: '/materials/list',
    group: '产品管理',
    iconKey: 'materials',
    label: '素材列表',
    menuKey: 'menu.asset',
    path: '/materials/list',
    routeKey: 'asset.list',
    visibleInMenu: true,
  },
  {
    accent: 'blue',
    activePath: '/materials/list',
    group: '产品管理',
    iconKey: 'materials',
    label: '产品素材文件夹详情',
    path: '/materials/detail',
    routeKey: 'asset.detail',
    visibleInMenu: false,
  },
  {
    accent: 'blue',
    activePath: '/management/customers/list',
    group: '客户管理',
    iconKey: 'customers',
    label: '客户管理',
    menuKey: 'menu.mgmt.customer',
    path: '/management/customers/list',
    routeKey: 'mgmt.customer.list',
    visibleInMenu: true,
  },
  {
    accent: 'blue',
    activePath: '/management/customers/list',
    group: '客户管理',
    iconKey: 'customers',
    label: '客户详情',
    path: '/management/customers/detail',
    routeKey: 'mgmt.customer.detail',
    visibleInMenu: false,
  },
  {
    accent: 'indigo',
    activePath: '/management/category-mappings/list',
    group: '类目映射',
    iconKey: 'category-mappings',
    label: '类目映射',
    menuKey: 'menu.mgmt.category_mapping',
    path: '/management/category-mappings/list',
    routeKey: 'mgmt.category_mapping.list',
    visibleInMenu: true,
  },
  {
    accent: 'indigo',
    activePath: '/management/category-mappings/list',
    group: '类目映射',
    iconKey: 'category-mappings',
    label: '类目映射详情',
    path: '/management/category-mappings/detail',
    routeKey: 'mgmt.category_mapping.detail',
    visibleInMenu: false,
  },
  {
    accent: 'violet',
    activePath: '/management/attribute-mappings/list',
    group: '属性值映射',
    iconKey: 'attribute-mappings',
    label: '属性值映射',
    menuKey: 'menu.mgmt.attribute_mapping',
    path: '/management/attribute-mappings/list',
    routeKey: 'mgmt.attribute_mapping.list',
    visibleInMenu: true,
  },
  {
    accent: 'violet',
    activePath: '/management/attribute-mappings/list',
    group: '属性值映射',
    iconKey: 'attribute-mappings',
    label: '属性值映射详情',
    path: '/management/attribute-mappings/detail',
    routeKey: 'mgmt.attribute_mapping.detail',
    visibleInMenu: false,
  },
  {
    accent: 'slate',
    activePath: '/management/system/admin-users/list',
    group: '系统管理',
    iconKey: 'system',
    label: '系统管理',
    menuKey: 'menu.mgmt.system',
    path: '/management/system/admin-users/list',
    routeKey: 'mgmt.system.admin_user_list',
    visibleInMenu: true,
  },
  {
    accent: 'slate',
    activePath: '/management/system/admin-users/list',
    group: '系统管理',
    iconKey: 'system',
    label: '管理端用户详情',
    path: '/management/system/admin-users/detail',
    routeKey: 'mgmt.system.admin_user_detail',
    visibleInMenu: false,
  },
];

export const userMenuGroups = ['产品管理', '商品管理', '库存管理', '配置管理'] as const;
export const managementMenuGroups = ['客户管理', '类目映射', '属性值映射', '系统管理'] as const;

export const userMenuItems = routeDefinitions.filter(
  (route) => !route.path.startsWith('/management') && route.visibleInMenu,
);

export const managementMenuItems = routeDefinitions.filter(
  (route) => route.path.startsWith('/management') && route.visibleInMenu,
);

const allowedPaths = new Set<RoutePath>(routeDefinitions.map((route) => route.path));
const pathMap = new Map(routeDefinitions.map((route) => [route.path, route]));

export function normalizePath(pathname: string): RoutePath {
  if (allowedPaths.has(pathname as RoutePath)) {
    return pathname as RoutePath;
  }

  const redirects: Record<string, RoutePath> = {
    '/': '/products/list',
    '/overview': '/products/list',
    '/overview/index': '/products/list',
    '/products': '/products/list',
    '/channel-items': '/channel-items/list',
    '/inventory': '/inventory/list',
    '/store-config': '/store-config/list',
    '/materials': '/materials/list',
    '/management': '/management/customers/list',
    '/management/customers': '/management/customers/list',
    '/management/category-mappings': '/management/category-mappings/list',
    '/management/attribute-mappings': '/management/attribute-mappings/list',
    '/management/system': '/management/system/admin-users/list',
    '/management/system/admin-users': '/management/system/admin-users/list',
  };

  return redirects[pathname] ?? '/products/list';
}

export function getActivePath(path: RoutePath): RoutePath {
  return pathMap.get(path)?.activePath ?? path;
}

export function isManagementPath(path: RoutePath): path is ManagementRoutePath {
  return path.startsWith('/management');
}
