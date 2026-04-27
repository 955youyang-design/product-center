import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowUpRight,
  Bell,
  BookOpen,
  Boxes,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Copy,
  Database,
  FileDown,
  FileCheck2,
  Filter,
  FolderOpen,
  Hash,
  Image,
  Layers,
  Link2,
  LogOut,
  Menu,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  ShoppingCart,
  Store,
  Upload,
  XCircle,
} from 'lucide-react';
import { type Dispatch, type DragEvent, type MouseEvent, type ReactNode, type SetStateAction, useEffect, useState } from 'react';
import {
  categoryAdaptations,
  channelItems,
  configs,
  currentManagementAdminUserId,
  customers,
  customerUsers,
  detailPages,
  importRecords,
  inventory,
  inventoryAdjustments,
  managementAdminUsers,
  managementAttributeMappings,
  managementCategoryMappings,
  materials,
  products,
  type ChannelItem,
  type CategoryAdaptation,
  type Customer,
  type CustomerUser,
  type CustomerStatus,
  type DetailPage,
  type DetailPageStatus,
  type ImportRecord,
  type InventoryItem,
  type ManagementAdminUser,
  type ManagementAttributeMapping,
  type ManagementCategoryMapping,
  type MaterialItem,
  type Product,
  type MappingStatus,
  type ProductStatus,
  type ShelfStatus,
  type StoreConfig,
  type SyncStatus,
  type UserStatus,
} from './data';
import {
  getAdminDisableGuard,
  getAdminUsernameConflictGuard,
  getAttributeMappingActivateGuard,
  getAttributeMappingConflictGuard,
  getCategoryMappingConflictGuard,
  getCustomerCodeConflictGuard,
  getCustomerUserCreateGuard,
  getCustomerUserUsernameConflictGuard,
} from './management-guards';
import {
  appendDetailPageBlock,
  buildProductListSearchParams,
  buildBatchEditSubmission,
  buildChannelItemShelfAction,
  buildChannelItemListSearchParams,
  buildDetailPageListSearchParams,
  createProductRowFromDraft,
  createImportRecordFromUpload,
  buildDraftCustomer,
  buildDraftCustomerUser,
  buildDraftManagementAdminUser,
  buildDraftAttributeMapping,
  buildDraftCategoryMapping,
  buildDraftStoreConfigRow,
  buildImportRecordAction,
  buildImportRecordListSearchParams,
  buildImportTaskSummary,
  buildInventoryListSearchParams,
  buildMaterialListSearchParams,
  buildStoreAppSubscriptionPatch,
  buildStoreAuthorizationLink,
  buildStoreConfigListSearchParams,
  buildTemplateDownloadPlan,
  addTemplateDownloadRecord,
  canConfirmImport,
  completeStoreAuthorizationFromCallback,
  createStoreConfigRowFromAuthorizationCallback,
  filterMaterialRows,
  filterProductRows,
  filterInventoryAdjustments,
  filterInventoryRows,
  filterManagementAdminUsers,
  filterManagementCustomers,
  filterManagementAttributeMappings,
  filterManagementCategoryMappings,
  filterStoreConfigRows,
  getDetailLimitState,
  getStoreConfigAutoStatus,
  getStoreConfigSetupState,
  getStoreFreightTemplateOptions,
  isStoreConfigIdentityLocked,
  linkMaterialToDetailPage,
  moveDetailPageBlock,
  normalizeStoreConfigRows,
  parseChannelItemListFilters,
  parseDetailPageListFilters,
  parseImportRecordListFilters,
  parseInventoryListFilters,
  parseMaterialListFilters,
  parseProductListFilters,
  parsePrototypeSnapshot,
  parseStoreConfigListFilters,
  previewBatchTargets,
  removeDetailPageBlock,
  saveDetailPageRows,
  saveStoreConfigRows,
  serializePrototypeSnapshot,
  setCurrentDetailPage,
  STORE_SHIPPING_ORIGIN_OPTIONS,
  STORE_STOCK_DEDUCTION_OPTIONS,
  summarizeInventoryRows,
  summarizeManagementAdminUsers,
  summarizeManagementCustomers,
  summarizeProductExport,
  summarizeProductRelationships,
  summarizeManagementAttributeMappings,
  summarizeManagementCategoryMappings,
  summarizeMaterialProductFolders,
  summarizeMaterialTypeFolders,
  summarizeStoreConfigSetupRows,
  syncInventoryRows,
  updateChannelItemRows,
  updateDetailPageBlock,
  updateProductRows,
  validateInventoryAdjustmentDraft,
  validateManagementAdminUserDraft,
  validateManagementCustomerDraft,
  validateManagementCustomerUserDraft,
  validateProductDraft,
  validateStoreConfigDraft,
  type BatchTargetFilters,
  type BatchEditDraft,
  type InventoryAdjustmentFilters,
  type InventoryAdjustmentDraft,
  type ImportRecordListFilters,
  type InventoryFilters,
  type ChannelItemListFilters,
  type DetailPageListFilters,
  type ImportValidationStatus,
  type MaterialListFilters,
  type ProductImportType,
  type ProductDraft,
  type ProductListFilters,
  type StoreConfigDraft,
  type StoreConfigListFilters,
  type TemplateDownloadRecord,
} from './prototypeLogic';
import {
  getActivePath,
  isManagementPath,
  managementMenuGroups,
  managementMenuItems,
  normalizePath,
  type IconKey,
  type RouteDefinition,
  type RoutePath,
  userMenuGroups,
  userMenuItems,
} from './routes';

type NavigateFn = (path: RoutePath, params?: Record<string, string>) => void;

type LocationState = {
  path: RoutePath;
  search: string;
};

const PROTOTYPE_NOW = '刚刚更新';
const PROTOTYPE_STORAGE_KEY = 'book-channel.prototype.snapshot.v1';
const PRODUCT_LIST_SCROLL_KEY = 'book-channel.prototype.product-list-scroll.v1';
const DEFAULT_PROTOTYPE_SNAPSHOT = {
  adminUsers: managementAdminUsers,
  channelItems,
  configs,
  customerUsers,
  customers,
  detailPages,
  inventory,
  materials,
  products,
};

function getLocationState(): LocationState {
  return {
    path: normalizePath(window.location.pathname),
    search: window.location.search,
  };
}

function buildPrototypeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function replaceRouteSearch(path: string, params: Record<string, string>) {
  if (typeof window === 'undefined') return;
  const queryString = new URLSearchParams(params).toString();
  window.history.replaceState({}, '', `${path}${queryString ? `?${queryString}` : ''}`);
}

function renderNavIcon(iconKey: IconKey, size = 20) {
  const icons: Record<IconKey, ReactNode> = {
    'attribute-mappings': <RefreshCw size={size} />,
    'batch-edit': <Hash size={size} />,
    'category-mappings': <Filter size={size} />,
    'channel-items': <ShoppingCart size={size} />,
    customers: <Store size={size} />,
    'detail-pages': <Layers size={size} />,
    inventory: <Database size={size} />,
    'inventory-adjustments': <Boxes size={size} />,
    materials: <Image size={size} />,
    products: <Package size={size} />,
    'products-import': <Upload size={size} />,
    'template-download': <FileDown size={size} />,
    settings: <Settings size={size} />,
    'store-config': <Store size={size} />,
    system: <ShieldCheck size={size} />,
  };
  return icons[iconKey];
}

function App() {
  const initialSnapshot =
    typeof window !== 'undefined'
      ? parsePrototypeSnapshot(window.localStorage.getItem(PROTOTYPE_STORAGE_KEY), DEFAULT_PROTOTYPE_SNAPSHOT)
      : DEFAULT_PROTOTYPE_SNAPSHOT;
  const [location, setLocation] = useState<LocationState>(() => getLocationState());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [shellFeedback, setShellFeedback] = useState<Feedback | null>(null);
  const [productRows, setProductRows] = useState(() => initialSnapshot.products);
  const [channelItemRows, setChannelItemRows] = useState(() => initialSnapshot.channelItems);
  const [detailPageRows, setDetailPageRows] = useState(() => initialSnapshot.detailPages);
  const [inventoryRows, setInventoryRows] = useState(() => initialSnapshot.inventory);
  const [materialRows, setMaterialRows] = useState(() => initialSnapshot.materials);
  const [configRows, setConfigRows] = useState(() => normalizeStoreConfigRows(initialSnapshot.configs));
  const [customerRows, setCustomerRows] = useState(() => initialSnapshot.customers);
  const [customerUserRows, setCustomerUserRows] = useState(() => initialSnapshot.customerUsers);
  const [adminUserRows, setAdminUserRows] = useState(() => initialSnapshot.adminUsers);

  useEffect(() => {
    const onPopState = () => setLocation(getLocationState());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(PROTOTYPE_STORAGE_KEY, serializePrototypeSnapshot({
      adminUsers: adminUserRows,
      channelItems: channelItemRows,
      configs: normalizeStoreConfigRows(configRows),
      customerUsers: customerUserRows,
      customers: customerRows,
      detailPages: detailPageRows,
      inventory: inventoryRows,
      materials: materialRows,
      products: productRows,
    }));
  }, [adminUserRows, channelItemRows, configRows, customerRows, customerUserRows, detailPageRows, inventoryRows, materialRows, productRows]);

  function navigate(nextPath: RoutePath, params?: Record<string, string>) {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    const search = queryString ? `?${queryString}` : '';
    window.history.pushState(null, '', `${nextPath}${search}`);
    setLocation({ path: nextPath, search });
  }

  const isManagement = isManagementPath(location.path);
  const activePath = getActivePath(location.path);
  const menuItems = isManagement ? managementMenuItems : userMenuItems;
  const menuGroups = isManagement ? managementMenuGroups : userMenuGroups;
  const currentNav = menuItems.find((item) => item.path === activePath) ?? menuItems[0]!;
  const searchPlaceholder = isManagement ? '搜索客户编码、映射规则、后台账号...' : '搜索 ISBN、商家编码、渠道商品...';

  return (
    <div className="flex h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
      <motion.aside
        animate={{ width: sidebarOpen ? 260 : 80 }}
        className="z-30 flex flex-col border-r border-slate-800 bg-slate-900 shadow-xl shadow-slate-900/40"
        initial={false}
      >
        <div className="flex h-16 shrink-0 items-center overflow-hidden border-b border-slate-800 px-6">
          <ShieldCheck className="shrink-0 text-blue-400" size={24} />
          {sidebarOpen && (
            <motion.div animate={{ opacity: 1 }} className="ml-3 whitespace-nowrap font-bold tracking-tight text-white" initial={{ opacity: 0 }}>
              {isManagement ? '图书管理端' : '图书中台'} <span className="font-mono text-xs text-blue-400">{isManagement ? 'MGMT' : 'PROTO'}</span>
            </motion.div>
          )}
        </div>

        <nav className="flex-1 space-y-8 overflow-y-auto overflow-x-hidden px-3 py-6">
          {menuGroups.map((group) => (
            <div className="space-y-1" key={group}>
              {sidebarOpen && <div className="mb-2 px-3 text-[10px] font-black uppercase tracking-widest text-slate-500">{group}</div>}
              {menuItems
                .filter((item) => item.group === group)
                .map((item) => {
                  const active = activePath === item.path;
                  return (
                    <button
                      className={`group relative flex h-10 w-full items-center rounded-lg px-3 transition-all duration-200 ${
                        active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                      key={item.path}
                      onClick={() => navigate(item.path)}
                    >
                      <span className="shrink-0 transition-transform duration-200 group-hover:scale-110">{renderNavIcon(item.iconKey)}</span>
                      {sidebarOpen && <span className="ml-3 truncate text-sm font-semibold">{item.label}</span>}
                      {active && <motion.div className="absolute left-0 h-5 w-1 rounded-r-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" layoutId="nav-glow" />}
                    </button>
                  );
                })}
            </div>
          ))}
        </nav>

        <div className="border-t border-slate-800 p-4">
          <button className="group flex w-full items-center rounded-lg px-3 py-2 text-slate-400 transition-colors hover:bg-red-900/20 hover:text-red-400" onClick={() => setShellFeedback({ message: '已触发退出登录确认，原型中保留当前会话以便继续演示。', tone: 'info' })}>
            <LogOut className="transition-transform group-hover:-translate-x-1" size={18} />
            {sidebarOpen && <span className="ml-3 text-sm font-semibold">退出登录</span>}
          </button>
        </div>
      </motion.aside>

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="glass-panel sticky top-0 z-20 flex h-16 items-center justify-between border-x-0 border-t-0 px-8">
          <div className="flex items-center gap-4">
            <button className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100" onClick={() => setSidebarOpen((value) => !value)}>
              <Menu size={20} />
            </button>
            <div className="flex items-center overflow-hidden whitespace-nowrap text-sm text-slate-400">
              <span className="hidden sm:inline">{isManagement ? '图书多渠道商品中台 / 中台管理端' : '图书多渠道商品中台 / 中台用户端'}</span>
              <ChevronRight className="mx-2 shrink-0" size={14} />
              <span className="truncate font-bold text-slate-900">{currentNav.label}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden w-80 items-center rounded-full border border-slate-200 bg-slate-100 px-4 py-1.5 transition-all focus-within:border-blue-500/50 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 lg:flex">
              <Search className="shrink-0 text-slate-400" size={16} />
              <input
                className="ml-2 w-full border-none bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={searchPlaceholder}
                value={searchTerm}
              />
            </div>
            <button className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100" onClick={() => setShellFeedback({ message: '当前有 3 条待处理提醒：导入失败、库存同步异常、类目适配更新。', tone: 'info' })}>
              <Bell size={20} />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 animate-pulse rounded-full border-2 border-white bg-red-500" />
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-xs font-black text-white shadow-md shadow-blue-500/20 ring-2 ring-white ring-offset-2 ring-offset-slate-50">
              PM
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto bg-slate-50/50 px-4 py-4 md:px-8 md:py-6 xl:px-10 xl:py-8 2xl:px-12">
          <InlineFeedback feedback={shellFeedback} />
          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="page-shell"
              exit={{ opacity: 0, x: 10 }}
              initial={{ opacity: 0, x: -10 }}
              key={`${location.path}${location.search}`}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <RouteView
                adminUserRows={adminUserRows}
                channelItemRows={channelItemRows}
                configRows={configRows}
                customerRows={customerRows}
                customerUserRows={customerUserRows}
                detailPageRows={detailPageRows}
                inventoryRows={inventoryRows}
                materialRows={materialRows}
                navigate={navigate}
                path={location.path}
                productRows={productRows}
                routeSearch={location.search}
                searchTerm={searchTerm}
                setAdminUserRows={setAdminUserRows}
                setChannelItemRows={setChannelItemRows}
                setConfigRows={setConfigRows}
                setCustomerRows={setCustomerRows}
                setCustomerUserRows={setCustomerUserRows}
                setDetailPageRows={setDetailPageRows}
                setInventoryRows={setInventoryRows}
                setMaterialRows={setMaterialRows}
                setProductRows={setProductRows}
              />
            </motion.div>
          </AnimatePresence>
        </section>
      </main>
      <button
        className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 text-left shadow-xl transition hover:-translate-y-0.5 ${
          isManagement
            ? 'border-blue-100 bg-white text-blue-700 shadow-blue-900/10 hover:bg-blue-50'
            : 'border-slate-700 bg-slate-900 text-white shadow-slate-900/20 hover:bg-slate-800'
        }`}
        onClick={() => {
          const nextPath: RoutePath = isManagement ? '/products/list' : '/management/customers/list';
          navigate(nextPath);
          setSearchTerm('');
          setShellFeedback(null);
        }}
        title={isManagement ? '切换到中台用户端' : '切换到中台管理端'}
      >
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${isManagement ? 'bg-blue-50 text-blue-600' : 'bg-white/10 text-blue-300'}`}>
          {isManagement ? <Store size={18} /> : <ShieldCheck size={18} />}
        </span>
        <span className="hidden sm:block">
          <span className="block text-xs font-black uppercase tracking-widest opacity-60">原型切换</span>
          <span className="mt-0.5 block text-sm font-black">{isManagement ? '进入中台用户端' : '进入中台管理端'}</span>
        </span>
      </button>
    </div>
  );
}

function RouteView({
  adminUserRows,
  channelItemRows,
  configRows,
  customerRows,
  customerUserRows,
  detailPageRows,
  inventoryRows,
  materialRows,
  navigate,
  path,
  productRows,
  routeSearch,
  searchTerm,
  setAdminUserRows,
  setChannelItemRows,
  setConfigRows,
  setCustomerRows,
  setCustomerUserRows,
  setDetailPageRows,
  setInventoryRows,
  setMaterialRows,
  setProductRows,
}: {
  adminUserRows: ManagementAdminUser[];
  channelItemRows: ChannelItem[];
  configRows: StoreConfig[];
  customerRows: Customer[];
  customerUserRows: CustomerUser[];
  detailPageRows: DetailPage[];
  inventoryRows: InventoryItem[];
  materialRows: MaterialItem[];
  navigate: NavigateFn;
  path: RoutePath;
  productRows: Product[];
  routeSearch: string;
  searchTerm: string;
  setAdminUserRows: Dispatch<SetStateAction<ManagementAdminUser[]>>;
  setChannelItemRows: Dispatch<SetStateAction<ChannelItem[]>>;
  setConfigRows: Dispatch<SetStateAction<StoreConfig[]>>;
  setCustomerRows: Dispatch<SetStateAction<Customer[]>>;
  setCustomerUserRows: Dispatch<SetStateAction<CustomerUser[]>>;
  setDetailPageRows: Dispatch<SetStateAction<DetailPage[]>>;
  setInventoryRows: Dispatch<SetStateAction<InventoryItem[]>>;
  setMaterialRows: Dispatch<SetStateAction<MaterialItem[]>>;
  setProductRows: Dispatch<SetStateAction<Product[]>>;
}) {
  switch (path) {
    case '/products/template-download':
      return <ProductTemplateDownload configRows={configRows} navigate={navigate} />;
    case '/products/import':
      return <ProductImport navigate={navigate} routeSearch={routeSearch} />;
    case '/products/import-records':
      return <ProductImport navigate={navigate} routeSearch={routeSearch} />;
    case '/products/create':
      return <ProductCreate navigate={navigate} setProductRows={setProductRows} />;
    case '/products/detail':
      return <ProductDetail channelItemRows={channelItemRows} detailPageRows={detailPageRows} inventoryRows={inventoryRows} materialRows={materialRows} navigate={navigate} productRows={productRows} routeSearch={routeSearch} setProductRows={setProductRows} />;
    case '/materials/list':
      return <MaterialsList channelItemRows={channelItemRows} detailPageRows={detailPageRows} materialRows={materialRows} navigate={navigate} productRows={productRows} routeSearch={routeSearch} setMaterialRows={setMaterialRows} />;
    case '/materials/detail':
      return <MaterialDetail detailPageRows={detailPageRows} materialRows={materialRows} navigate={navigate} productRows={productRows} routeSearch={routeSearch} setDetailPageRows={setDetailPageRows} setMaterialRows={setMaterialRows} />;
    case '/channel-items/list':
      return <ChannelItemList channelItemRows={channelItemRows} detailPageRows={detailPageRows} navigate={navigate} productRows={productRows} routeSearch={routeSearch} searchTerm={searchTerm} />;
    case '/channel-items/detail':
      return <ChannelItemDetail channelItemRows={channelItemRows} detailPageRows={detailPageRows} materialRows={materialRows} navigate={navigate} productRows={productRows} routeSearch={routeSearch} setChannelItemRows={setChannelItemRows} setDetailPageRows={setDetailPageRows} />;
    case '/channel-items/detail-pages':
      return <DetailPageList channelItemRows={channelItemRows} detailPageRows={detailPageRows} materialRows={materialRows} navigate={navigate} productRows={productRows} routeSearch={routeSearch} setDetailPageRows={setDetailPageRows} setMaterialRows={setMaterialRows} />;
    case '/channel-items/batch-edit':
      return <ChannelItemBatchEdit channelItemRows={channelItemRows} navigate={navigate} routeSearch={routeSearch} />;
    case '/inventory/list':
      return <InventoryList inventoryRows={inventoryRows} navigate={navigate} routeSearch={routeSearch} setInventoryRows={setInventoryRows} />;
    case '/inventory/detail':
      return <InventoryDetail inventoryRows={inventoryRows} navigate={navigate} routeSearch={routeSearch} setInventoryRows={setInventoryRows} />;
    case '/inventory/adjustments':
      return <InventoryAdjustments />;
    case '/store-config/list':
      return <StoreConfigList configRows={configRows} navigate={navigate} routeSearch={routeSearch} />;
    case '/store-config/detail':
      return <StoreConfigDetail configRows={configRows} navigate={navigate} routeSearch={routeSearch} setConfigRows={setConfigRows} />;
    case '/management/customers/list':
      return <CustomerList customerRows={customerRows} customerUserRows={customerUserRows} navigate={navigate} searchTerm={searchTerm} setCustomerRows={setCustomerRows} />;
    case '/management/customers/detail':
      return <CustomerDetail customerRows={customerRows} customerUserRows={customerUserRows} navigate={navigate} routeSearch={routeSearch} setCustomerRows={setCustomerRows} setCustomerUserRows={setCustomerUserRows} />;
    case '/management/category-mappings/list':
      return <CategoryMappingList navigate={navigate} routeSearch={routeSearch} searchTerm={searchTerm} />;
    case '/management/category-mappings/detail':
      return <CategoryMappingDetail navigate={navigate} routeSearch={routeSearch} />;
    case '/management/attribute-mappings/list':
      return <AttributeMappingList navigate={navigate} routeSearch={routeSearch} searchTerm={searchTerm} />;
    case '/management/attribute-mappings/detail':
      return <AttributeMappingDetail navigate={navigate} routeSearch={routeSearch} />;
    case '/management/system/admin-users/list':
      return <ManagementAdminUserList adminUserRows={adminUserRows} navigate={navigate} searchTerm={searchTerm} setAdminUserRows={setAdminUserRows} />;
    case '/management/system/admin-users/detail':
      return <ManagementAdminUserDetail adminUserRows={adminUserRows} navigate={navigate} routeSearch={routeSearch} setAdminUserRows={setAdminUserRows} />;
    case '/products/list':
    default:
      return <ProductList channelItemRows={channelItemRows} detailPageRows={detailPageRows} inventoryRows={inventoryRows} navigate={navigate} productRows={productRows} routeSearch={routeSearch} searchTerm={searchTerm} />;
  }
}

function pickById<T extends { id: string }>(items: T[], id: string | null) {
  return items.find((item) => item.id === id) ?? items[0]!;
}

function summarizeProductInventory(inventoryRows: InventoryItem[], productName: string) {
  const rows = inventoryRows.filter((row) => row.productName === productName);
  return {
    rowCount: rows.length,
    sellable: rows.reduce((sum, row) => sum + row.sellable, 0),
    syncIssues: rows.filter((row) => row.status !== 'success').length,
    total: rows.reduce((sum, row) => sum + row.total, 0),
  };
}

function PageTitle({ accent = 'blue', actions, icon, subtitle, title }: { accent?: 'blue' | 'indigo' | 'slate' | 'violet'; actions?: ReactNode; icon: ReactNode; subtitle?: string; title: string }) {
  const accentClass = {
    blue: 'text-blue-600',
    indigo: 'text-indigo-600',
    slate: 'text-slate-900',
    violet: 'text-violet-600',
  }[accent];
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
          <span className={accentClass}>{icon}</span>
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-xs font-medium text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

function CompactStat({ color = 'blue', label, value }: { color?: 'blue' | 'indigo' | 'red' | 'slate' | 'violet'; label: string; value: number | string }) {
  const colorClass = {
    blue: 'text-blue-600',
    indigo: 'text-indigo-600',
    red: 'text-red-500',
    slate: 'text-slate-900',
    violet: 'text-violet-600',
  }[color];
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}:</span>
      <span className={`mono-value text-sm font-black ${colorClass}`}>{value}</span>
    </div>
  );
}

const LIST_PANEL_CLASS = 'surface-panel rounded-xl border-slate-200 shadow-md shadow-slate-200/60';
const LIST_HEADER_CLASS = 'border-b border-slate-200 bg-white';
const LIST_BODY_CLASS = 'divide-y divide-slate-100 bg-white';
const LIST_ROW_CLASS = 'group hover:bg-slate-50/80';
const LIST_META_CLASS = 'text-[10px] font-bold text-slate-400';

type StatusView = {
  chip: string;
  dot: string;
  label: string;
  text: string;
};

const STATUS_VIEW: Record<string, StatusView> = {
  active: { chip: 'border-emerald-100 bg-emerald-50 text-emerald-600', dot: 'bg-emerald-300', label: '生效中', text: 'text-emerald-600' },
  authorized: { chip: 'border-emerald-100 bg-emerald-50 text-emerald-600', dot: 'bg-emerald-300', label: '已授权', text: 'text-emerald-600' },
  current: { chip: 'border-emerald-100 bg-emerald-50 text-emerald-600', dot: 'bg-emerald-300', label: '当前使用', text: 'text-emerald-600' },
  disabled: { chip: 'border-slate-200 bg-slate-50 text-slate-500', dot: 'bg-slate-300', label: '停用', text: 'text-slate-400' },
  draft: { chip: 'border-slate-200 bg-slate-50 text-slate-600', dot: 'bg-slate-300', label: '草稿', text: 'text-slate-500' },
  enabled: { chip: 'border-emerald-100 bg-emerald-50 text-emerald-600', dot: 'bg-emerald-300', label: '启用', text: 'text-emerald-600' },
  expired: { chip: 'border-red-100 bg-red-50 text-red-600', dot: 'bg-red-400', label: '授权过期', text: 'text-red-600' },
  completed: { chip: 'border-emerald-100 bg-emerald-50 text-emerald-600', dot: 'bg-emerald-300', label: '已完成', text: 'text-emerald-600' },
  execute_failed: { chip: 'border-red-100 bg-red-50 text-red-600', dot: 'bg-red-400', label: '执行失败', text: 'text-red-600' },
  executing: { chip: 'border-indigo-100 bg-indigo-50 text-indigo-600', dot: 'bg-indigo-300', label: '导入中', text: 'text-indigo-600' },
  failed: { chip: 'border-red-100 bg-red-50 text-red-600', dot: 'bg-red-400', label: '失败', text: 'text-red-600' },
  history: { chip: 'border-slate-200 bg-slate-50 text-slate-500', dot: 'bg-slate-300', label: '历史版本', text: 'text-slate-400' },
  inactive: { chip: 'border-slate-200 bg-slate-50 text-slate-500', dot: 'bg-slate-300', label: '停用', text: 'text-slate-400' },
  offline: { chip: 'border-slate-200 bg-slate-50 text-slate-500', dot: 'bg-slate-300', label: '已下架', text: 'text-slate-400' },
  online: { chip: 'border-emerald-100 bg-emerald-50 text-emerald-600', dot: 'bg-emerald-300', label: '上架中', text: 'text-emerald-600' },
  pending: { chip: 'border-indigo-100 bg-indigo-50 text-indigo-600', dot: 'bg-indigo-300', label: '待同步', text: 'text-indigo-600' },
  published: { chip: 'border-emerald-100 bg-emerald-50 text-emerald-600', dot: 'bg-emerald-300', label: '资料完整', text: 'text-emerald-600' },
  ready: { chip: 'border-amber-100 bg-amber-50 text-amber-600', dot: 'bg-amber-300', label: '待补齐', text: 'text-amber-600' },
  ready_to_execute: { chip: 'border-blue-100 bg-blue-50 text-blue-600', dot: 'bg-blue-300', label: '待确认', text: 'text-blue-600' },
  subscribed: { chip: 'border-blue-100 bg-blue-50 text-blue-600', dot: 'bg-blue-300', label: '已订购', text: 'text-blue-600' },
  success: { chip: 'border-emerald-100 bg-emerald-50 text-emerald-600', dot: 'bg-emerald-300', label: '成功', text: 'text-emerald-600' },
  syncing: { chip: 'border-indigo-100 bg-indigo-50 text-indigo-600', dot: 'bg-indigo-300', label: '同步中', text: 'text-indigo-600' },
  unauthorized: { chip: 'border-amber-100 bg-amber-50 text-amber-600', dot: 'bg-amber-300', label: '未授权', text: 'text-amber-600' },
  unsubscribed: { chip: 'border-slate-200 bg-slate-50 text-slate-500', dot: 'bg-slate-300', label: '未订购', text: 'text-slate-400' },
  uploaded: { chip: 'border-slate-200 bg-slate-50 text-slate-600', dot: 'bg-slate-300', label: '已上传', text: 'text-slate-500' },
  validate_failed: { chip: 'border-red-100 bg-red-50 text-red-600', dot: 'bg-red-400', label: '校验失败', text: 'text-red-600' },
  validating: { chip: 'border-indigo-100 bg-indigo-50 text-indigo-600', dot: 'bg-indigo-300', label: '校验中', text: 'text-indigo-600' },
};

function getStatusView(status: string, label?: string) {
  const fallback = { chip: 'border-slate-200 bg-slate-50 text-slate-500', dot: 'bg-slate-300', label: status, text: 'text-slate-500' };
  return {
    ...(STATUS_VIEW[status] ?? fallback),
    label: label ?? STATUS_VIEW[status]?.label ?? status,
  };
}

function ListStatus({ compact = false, label, status }: { compact?: boolean; label?: string; status: string }) {
  const view = getStatusView(status, label);
  return (
    <span className={`inline-flex items-center gap-2 font-black ${compact ? 'text-xs' : 'text-sm'} ${view.text}`}>
      <span className={`${compact ? 'h-1.5 w-1.5' : 'h-2 w-2'} rounded-full ${view.dot}`} />
      {view.label}
    </span>
  );
}

function ListMeta({ children, mono = false }: { children: ReactNode; mono?: boolean }) {
  return <div className={`mt-1 ${mono ? 'mono-value ' : ''}${LIST_META_CLASS}`}>{children}</div>;
}

const CHANNEL_ACCENT_CLASS: Record<string, string> = {
  快手: 'bg-amber-500',
  拼多多: 'bg-rose-500',
  抖音: 'bg-slate-950',
  淘宝: 'bg-orange-500',
};

function getChannelAccentClass(channel: string) {
  return CHANNEL_ACCENT_CLASS[channel] ?? 'bg-blue-500';
}

function ChannelIdentity({ channel, subtitle }: { channel: string; subtitle?: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`h-6 w-1.5 rounded-full ${getChannelAccentClass(channel)}`} />
      <div>
        <div className="font-black text-slate-950">{channel}</div>
        {subtitle && <div className={`mt-0.5 ${LIST_META_CLASS}`}>{subtitle}</div>}
      </div>
    </div>
  );
}

function ActionIconButton({
  children,
  disabled = false,
  onClick,
  title,
  tone = 'blue',
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  title: string;
  tone?: 'blue' | 'indigo' | 'red' | 'slate' | 'violet';
}) {
  const toneClass = {
    blue: 'hover:bg-blue-50 hover:text-blue-600',
    indigo: 'hover:bg-indigo-50 hover:text-indigo-600',
    red: 'hover:bg-red-50 hover:text-red-600',
    slate: 'hover:bg-slate-100 hover:text-slate-900',
    violet: 'hover:bg-violet-50 hover:text-violet-600',
  }[tone];

  return (
    <button
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${toneClass}`}
      disabled={disabled}
      onClick={onClick}
      title={title}
      type="button"
    >
      {children}
    </button>
  );
}

function StatusBadge({
  status,
}: {
  status: CustomerStatus | DetailPageStatus | MappingStatus | ProductStatus | ShelfStatus | StoreConfig['appSubscriptionStatus'] | StoreConfig['authorizationStatus'] | StoreConfig['status'] | SyncStatus | UserStatus;
}) {
  const view = getStatusView(status);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${view.chip}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${view.dot}`} />
      {view.label}
    </span>
  );
}

function SecondaryButton({ children, disabled = false, onClick, title }: { children: ReactNode; disabled?: boolean; onClick?: () => void; title?: string }) {
  return (
    <button
      className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      disabled={disabled}
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  );
}

function PrimaryButton({ children, color = 'blue', disabled = false, onClick, title }: { children: ReactNode; color?: 'blue' | 'indigo' | 'slate' | 'violet'; disabled?: boolean; onClick?: () => void; title?: string }) {
  const colorClass = {
    blue: 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20',
    indigo: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20',
    slate: 'bg-slate-900 hover:bg-slate-950 shadow-slate-900/20',
    violet: 'bg-violet-600 hover:bg-violet-700 shadow-violet-600/20',
  }[color];
  return (
    <button
      className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-bold text-white shadow-lg transition-all hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 ${colorClass}`}
      disabled={disabled}
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  );
}

type FeedbackTone = 'info' | 'success' | 'warning';
type Feedback = { message: string; tone: FeedbackTone };

function InlineFeedback({ feedback }: { feedback: Feedback | null }) {
  if (!feedback) return null;

  const toneClass = {
    info: 'border-blue-200 bg-blue-50 text-blue-700',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    warning: 'border-amber-200 bg-amber-50 text-amber-700',
  }[feedback.tone];

  return (
    <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold ${toneClass}`}>
      {feedback.tone === 'success' ? <CheckCircle2 size={14} /> : feedback.tone === 'warning' ? <XCircle size={14} /> : <ClipboardCheck size={14} />}
      <span>{feedback.message}</span>
    </div>
  );
}

function RuleStrip({ children, tone = 'info' }: { children: ReactNode; tone?: FeedbackTone }) {
  const toneClass = {
    info: 'border-blue-200 bg-blue-50 text-blue-700',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    warning: 'border-amber-200 bg-amber-50 text-amber-700',
  }[tone];

  return (
    <div className={`rounded-lg border px-4 py-3 text-xs font-semibold leading-5 ${toneClass}`}>
      {children}
    </div>
  );
}

function ProcessSteps({ current, steps }: { current: number; steps: string[] }) {
  return (
    <div className="grid gap-2 md:grid-cols-3">
      {steps.map((step, index) => {
        const active = index === current;
        const done = index < current;
        return (
          <div
            className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-xs font-bold ${
              active
                ? 'border-blue-200 bg-blue-50 text-blue-700'
                : done
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 bg-white text-slate-500'
            }`}
            key={step}
          >
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${done ? 'bg-emerald-600 text-white' : active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
              {done ? <CheckCircle2 size={12} /> : index + 1}
            </span>
            {step}
          </div>
        );
      })}
    </div>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
      <Search className="mx-auto text-slate-400" size={24} />
      <div className="mt-3 text-sm font-bold text-slate-900">{title}</div>
      <p className="mt-1 text-xs font-semibold text-slate-500">{description}</p>
    </div>
  );
}

function ProductList({
  channelItemRows,
  detailPageRows,
  inventoryRows,
  navigate,
  productRows,
  routeSearch,
  searchTerm,
}: {
  channelItemRows: ChannelItem[];
  detailPageRows: DetailPage[];
  inventoryRows: InventoryItem[];
  navigate: NavigateFn;
  productRows: Product[];
  routeSearch: string;
  searchTerm: string;
}) {
  const [filters, setFilters] = useState<ProductListFilters>(() => parseProductListFilters(routeSearch));
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const sourceChannels = Array.from(new Set(channelItemRows.map((item) => item.channel)));
  const filtered = filterProductRows(productRows, channelItemRows, {
    ...filters,
    keyword: [filters.keyword, searchTerm].filter(Boolean).join(' ').trim(),
  });
  const exportSummary = summarizeProductExport(filtered);

  useEffect(() => {
    const queryString = new URLSearchParams(buildProductListSearchParams(filters)).toString();
    window.history.replaceState(null, '', queryString ? `/products/list?${queryString}` : '/products/list');
  }, [filters]);

  useEffect(() => {
    const savedScroll = window.sessionStorage.getItem(PRODUCT_LIST_SCROLL_KEY);
    if (!savedScroll) return;
    window.sessionStorage.removeItem(PRODUCT_LIST_SCROLL_KEY);
    window.requestAnimationFrame(() => window.scrollTo({ top: Number(savedScroll) || 0, behavior: 'auto' }));
  }, []);

  return (
    <div className="space-y-4">
      <PageTitle
        actions={
          <>
            <SecondaryButton
              onClick={() =>
                setFeedback({
                  message:
                    filtered.length === 0
                      ? '当前检索范围没有可导出的产品，请先调整搜索条件。'
                      : `已导出 ${exportSummary.total} 个产品，其中 ${exportSummary.unpublished} 个待补齐，${exportSummary.published} 个资料完整。`,
                  tone: filtered.length === 0 ? 'warning' : 'success',
                })
              }
            >
              <FileDown className="mr-1.5" size={14} />
              导出
            </SecondaryButton>
            <PrimaryButton onClick={() => navigate('/products/create')}><Plus className="mr-1.5" size={14} />新增产品</PrimaryButton>
          </>
        }
        icon={<Package size={22} />}
        subtitle="按书名、ISBN、商家编码、状态和来源渠道检索统一产品主档。"
        title="产品列表"
      />
      <InlineFeedback feedback={feedback} />
      <div className="flex flex-wrap items-center gap-4">
        <CompactStat label="产品总数" value={productRows.length} />
        <CompactStat color="indigo" label="关联商品数" value={channelItemRows.length} />
        <CompactStat color="violet" label="详情页数" value={detailPageRows.length} />
        <CompactStat color="red" label="待补齐" value={productRows.filter((item) => item.status !== 'published').length} />
      </div>
      <div className="surface-panel p-4">
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-4">
          <input
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500"
            onChange={(event) => setFilters((current) => ({ ...current, keyword: event.target.value }))}
            placeholder="书名 / ISBN / 商家编码"
            value={filters.keyword}
          />
          <select
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500"
            onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value as ProductListFilters['status'] }))}
            value={filters.status}
          >
            <option>全部状态</option>
            <option value="published">资料完整</option>
            <option value="ready">待补齐</option>
            <option value="draft">草稿</option>
          </select>
          <select
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500"
            onChange={(event) => setFilters((current) => ({ ...current, sourceChannel: event.target.value as ProductListFilters['sourceChannel'] }))}
            value={filters.sourceChannel}
          >
            <option>全部渠道</option>
            {sourceChannels.map((channel) => <option key={channel}>{channel}</option>)}
          </select>
          <SecondaryButton onClick={() => setFilters({ keyword: '', sourceChannel: '全部渠道', status: '全部状态' })}>
            <SlidersHorizontal className="mr-1.5" size={14} />
            重置筛选
          </SecondaryButton>
        </div>
      </div>
      <div className={`${LIST_PANEL_CLASS} overflow-x-auto`}>
        <table className="w-full min-w-[1060px] border-collapse text-left">
          <thead className={LIST_HEADER_CLASS}>
            <tr>
              <th className="table-head-cell">图书资料 / 标识</th>
              <th className="table-head-cell">ISBN</th>
              <th className="table-head-cell">商家编码</th>
              <th className="table-head-cell">分类</th>
              <th className="table-head-cell">渠道覆盖</th>
              <th className="table-head-cell">产品库存</th>
              <th className="table-head-cell">状态</th>
              <th className="table-head-cell text-right">操作</th>
            </tr>
          </thead>
          <tbody className={LIST_BODY_CLASS}>
            {filtered.map((product) => {
              const productInventory = summarizeProductInventory(inventoryRows, product.name);
              return (
              <tr className={LIST_ROW_CLASS} key={product.id}>
                <td className="table-body-cell">
                  <div className="flex items-center gap-3">
                    <img alt={product.name} className="h-10 w-10 rounded-lg object-cover ring-1 ring-slate-200" src={product.cover} />
                    <div className="min-w-0">
                      <button
                        className="block truncate text-left font-black text-blue-600 transition-colors hover:text-blue-700"
                        onClick={() => {
                          window.sessionStorage.setItem(PRODUCT_LIST_SCROLL_KEY, String(window.scrollY));
                          navigate('/products/detail', {
                            productId: product.id,
                            ...buildProductListSearchParams(filters),
                          });
                        }}
                      >
                        {product.name}
                      </button>
                      <ListMeta mono>{product.id}</ListMeta>
                    </div>
                  </div>
                </td>
                <td className="table-body-cell mono-value text-xs">{product.isbn}</td>
                <td className="table-body-cell mono-value text-xs">{product.code}</td>
                <td className="table-body-cell"><span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{product.category}</span></td>
                <td className="table-body-cell">
                  <div className="flex -space-x-1">
                    {Array.from(new Set(channelItemRows.filter((item) => item.productId === product.id).map((item) => item.channel))).map((channel, index) => (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white bg-blue-100 text-[8px] font-black text-blue-600" key={`${product.id}-${channel}`}>{index + 1}</span>
                    ))}
                  </div>
                </td>
                <td className="table-body-cell">
                  <button
                    className="text-left"
                    onClick={() =>
                      navigate('/inventory/list', buildInventoryListSearchParams({
                        channel: '全部渠道',
                        searchTerm: product.name,
                        shop: '全部店铺',
                        status: '全部状态',
                      }))
                    }
                  >
                    <div className="mono-value text-sm font-black text-indigo-600">{productInventory.sellable}</div>
                    <ListMeta>可售 / 总 {productInventory.total}</ListMeta>
                  </button>
                </td>
                <td className="table-body-cell"><ListStatus status={product.status} /></td>
                <td className="table-body-cell text-right">
                  <ActionIconButton
                    onClick={() => {
                      window.sessionStorage.setItem(PRODUCT_LIST_SCROLL_KEY, String(window.scrollY));
                      navigate('/products/detail', {
                        productId: product.id,
                        ...buildProductListSearchParams(filters),
                      });
                    }}
                    title="查看产品详情"
                  >
                    <ArrowUpRight size={16} />
                  </ActionIconButton>
                </td>
              </tr>
            );
            })}
            {filtered.length === 0 && (
              <tr>
                <td className="p-5" colSpan={8}>
                  <EmptyState description="当前搜索条件下没有命中产品主档。" title="没有命中产品" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductDetail({
  channelItemRows,
  detailPageRows,
  inventoryRows,
  materialRows,
  navigate,
  productRows,
  routeSearch,
  setProductRows,
}: {
  channelItemRows: ChannelItem[];
  detailPageRows: DetailPage[];
  inventoryRows: InventoryItem[];
  materialRows: MaterialItem[];
  navigate: NavigateFn;
  productRows: Product[];
  routeSearch: string;
  setProductRows: Dispatch<SetStateAction<Product[]>>;
}) {
  const product = pickById(productRows, new URLSearchParams(routeSearch).get('productId'));
  const relatedChannelItems = channelItemRows.filter((item) => item.productId === product.id);
  const relationshipSummary = summarizeProductRelationships({
    channelItems: channelItemRows,
    detailPages: detailPageRows,
    productId: product.id,
  });
  const inventorySummary = summarizeProductInventory(inventoryRows, product.name);
  const productMaterials = materialRows.filter((asset) => asset.productId === product.id);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [draftProduct, setDraftProduct] = useState(() => ({
    author: product.author,
    category: product.category,
    name: product.name,
    publisher: product.publisher,
    status: product.status,
  }));
  const backToListParams = buildProductListSearchParams(parseProductListFilters(routeSearch));

  useEffect(() => {
    setDraftProduct({
      author: product.author,
      category: product.category,
      name: product.name,
      publisher: product.publisher,
      status: product.status,
    });
  }, [product.author, product.category, product.id, product.name, product.publisher, product.status]);

  return (
    <div className="space-y-4">
      <PageTitle
        actions={
          <>
            <SecondaryButton onClick={() => navigate('/products/list', backToListParams)}>返回产品列表</SecondaryButton>
            <SecondaryButton onClick={() => setFeedback({ message: `已复制 ${product.code} 的产品主档，渠道商品和详情页不会自动复制。`, tone: 'info' })}>
              <Copy className="mr-1.5" size={14} />
              复制产品
            </SecondaryButton>
            <PrimaryButton
              color="blue"
              onClick={() => {
                setProductRows((rows) => updateProductRows(rows, product.id, draftProduct, PROTOTYPE_NOW));
                setFeedback({ message: '产品主档已保存，关联商品和库存入口保持不变。', tone: 'success' });
              }}
            >
              <Save className="mr-1.5" size={14} />
              保存产品
            </PrimaryButton>
          </>
        }
        icon={<BookOpen size={22} />}
        subtitle="主档内容、SKU 摘要、默认素材和渠道商品关系。"
        title={product.name}
      />
      <InlineFeedback feedback={feedback} />
      <div className="flex flex-wrap items-center gap-4">
        <CompactStat label="渠道商品" value={relationshipSummary.channelItemCount} />
        <CompactStat color="indigo" label="上架商品" value={relationshipSummary.onlineChannelItemCount} />
        <CompactStat color="violet" label="详情页" value={relationshipSummary.detailPageCount} />
        <CompactStat color="slate" label="当前详情页" value={relationshipSummary.currentDetailCount} />
        <CompactStat color="blue" label="可售库存" value={inventorySummary.sellable} />
        <CompactStat color="slate" label="库存总量" value={inventorySummary.total} />
      </div>
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="surface-panel p-5">
          <div className="flex gap-4">
            <img alt={product.name} className="h-36 w-28 rounded-xl object-cover ring-1 ring-slate-200" src={product.cover} />
            <div className="grid flex-1 gap-3 md:grid-cols-2">
              <Field label="图书名称" onChange={(value) => setDraftProduct((current) => ({ ...current, name: value }))} value={draftProduct.name} wide />
              <Field label="ISBN" mono readOnly value={product.isbn} />
              <Field label="商家编码" mono readOnly value={product.code} />
              <Field label="作者" onChange={(value) => setDraftProduct((current) => ({ ...current, author: value }))} value={draftProduct.author} />
              <Field label="出版社" onChange={(value) => setDraftProduct((current) => ({ ...current, publisher: value }))} value={draftProduct.publisher} />
              <SelectField
                label="分类"
                onChange={(value) => setDraftProduct((current) => ({ ...current, category: value }))}
                options={[
                  { label: '少儿百科', value: '少儿百科' },
                  { label: '儿童文学', value: '儿童文学' },
                  { label: '科幻文学', value: '科幻文学' },
                  { label: '历史科普', value: '历史科普' },
                ]}
                value={draftProduct.category}
              />
              <SelectField
                label="产品状态"
                onChange={(value) => setDraftProduct((current) => ({ ...current, status: value as ProductStatus }))}
                options={[
                  { label: '资料完整', value: 'published' },
                  { label: '待补齐', value: 'ready' },
                  { label: '草稿', value: 'draft' },
                ]}
                value={draftProduct.status}
              />
            </div>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <SecondaryButton onClick={() => setFeedback({ message: '已上传新封面草稿，保存后会同步到素材库。', tone: 'success' })}>
              <Upload className="mr-1.5" size={14} />
              上传封面
            </SecondaryButton>
            <SecondaryButton onClick={() => navigate('/materials/list')}>
              <Image className="mr-1.5" size={14} />
              查看素材
            </SecondaryButton>
            <SecondaryButton onClick={() => setFeedback({ message: '已发起 ISBN 基础资料校验，结果将用于主档补齐。', tone: 'info' })}>
              <ClipboardCheck className="mr-1.5" size={14} />
              校验资料
            </SecondaryButton>
          </div>
        </div>
        <div className="surface-panel p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="text-sm font-black uppercase tracking-widest text-slate-500">关联商品</div>
            <PrimaryButton onClick={() => setFeedback({ message: `已为 ${product.name} 创建渠道商品草稿，需选择渠道、店铺和售卖字段后保存。`, tone: 'success' })}>
              <Plus className="mr-1.5" size={14} />
              创建渠道商品
            </PrimaryButton>
          </div>
          <div className="space-y-3">
            {relatedChannelItems.map((item) => (
              <button
                className="flex w-full items-center justify-between rounded-lg border border-slate-100 p-3 text-left transition-colors hover:bg-slate-50"
                key={item.id}
                onClick={() => navigate('/channel-items/detail', { channelItemId: item.id })}
              >
                <div>
                  <div className="font-bold text-slate-900">{item.title}</div>
                  <div className="mt-1 text-xs text-slate-400">{item.channel} / {item.shop}</div>
                </div>
                <span className="mono-value text-sm font-black text-blue-600">¥{item.price}</span>
              </button>
            ))}
            {relatedChannelItems.length === 0 && <EmptyState description="先创建渠道商品，再维护详情页、库存和素材复用。" title="暂无关联渠道商品" />}
          </div>
        </div>
        <div className="surface-panel p-5 lg:col-span-2">
          <div className="mb-4 text-sm font-black uppercase tracking-widest text-slate-500">产品交付边界</div>
          <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
            <RuleStrip>产品主档只维护 ISBN、标题、作者、出版社、分类和默认素材；渠道价格、上下架和运费模板在渠道商品详情维护。</RuleStrip>
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 text-xs font-semibold leading-6 text-slate-500">
              当前素材库中有 <span className="mono-value font-black text-slate-900">{productMaterials.length}</span> 个素材归属该产品，可被多个详情页复用，复用关系由详情页列表承接。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCreate({ navigate, setProductRows }: { navigate: NavigateFn; setProductRows: Dispatch<SetStateAction<Product[]>> }) {
  const [draft, setDraft] = useState<ProductDraft>({
    author: '作者 / 编者',
    category: '少儿百科',
    code: 'BOOK-005',
    coverUploaded: false,
    defaultTitle: '渠道商品默认标题',
    isbn: '978020000055',
    name: '新图书名称',
    publisher: '出版社名称',
  });
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const validation = validateProductDraft(draft);

  function updateDraft(key: keyof ProductDraft, value: string | boolean) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function saveDraft() {
    const nextValidation = validateProductDraft(draft);
    if (!nextValidation.allowed) {
      setFeedback({
        message: nextValidation.message,
        tone: 'warning',
      });
      return;
    }

    const nextProduct = createProductRowFromDraft(draft, {
      cover: '/product-assets/0.jpg',
      id: buildPrototypeId('prod'),
      timestamp: PROTOTYPE_NOW,
    });
    setProductRows((rows) => [nextProduct, ...rows]);
    setFeedback({
      message: '产品主档已创建，正在进入详情页继续补充和校验。',
      tone: 'success',
    });
    navigate('/products/detail', { productId: nextProduct.id });
  }

  return (
    <div className="space-y-4">
      <PageTitle
        actions={
          <>
            <SecondaryButton onClick={() => navigate('/products/list')}>返回产品列表</SecondaryButton>
            <PrimaryButton onClick={saveDraft}><CheckCircle2 className="mr-1.5" size={14} />保存产品</PrimaryButton>
          </>
        }
        icon={<Plus size={22} />}
        subtitle="从产品列表进入，先创建统一产品主档，再按渠道生成商品。"
        title="新增产品"
      />
      <InlineFeedback feedback={feedback} />
      {!validation.allowed && <RuleStrip tone="warning">待补齐字段：{validation.missingFields.join('、')}</RuleStrip>}
      <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="surface-panel p-5">
          <div className="mb-4 text-sm font-black uppercase tracking-widest text-slate-500">封面和编码</div>
          <button
            className={`w-full rounded-xl border border-dashed p-6 text-center transition ${
              draft.coverUploaded ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-300 bg-slate-50 text-slate-700 hover:border-blue-300 hover:bg-blue-50'
            }`}
            onClick={() => {
              updateDraft('coverUploaded', true);
              setFeedback({ message: '封面已上传并进入素材库草稿，保存产品后可复用。', tone: 'success' });
            }}
          >
            {draft.coverUploaded ? <FileCheck2 className="mx-auto text-emerald-600" size={34} /> : <BookOpen className="mx-auto text-blue-600" size={34} />}
            <div className="mt-3 text-sm font-bold text-slate-900">{draft.coverUploaded ? 'cover-book-005.jpg 已上传' : '上传图书封面'}</div>
            <p className="mt-1 text-xs text-slate-500">支持 JPG / PNG，后续可复用到素材库。</p>
          </button>
          <div className="mt-4 grid gap-4">
            <label>
              <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">ISBN</span>
              <input className="mono-value w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500" onChange={(event) => updateDraft('isbn', event.target.value)} value={draft.isbn} />
            </label>
            <label>
              <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">商家编码</span>
              <input className="mono-value w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500" onChange={(event) => updateDraft('code', event.target.value)} value={draft.code} />
            </label>
            <SecondaryButton onClick={() => setFeedback({ message: `已校验 ISBN ${draft.isbn}，可继续补齐主档字段。`, tone: 'info' })}>
              <ClipboardCheck className="mr-1.5" size={14} />
              校验 ISBN
            </SecondaryButton>
          </div>
        </div>
        <div className="surface-panel p-5">
          <div className="mb-4 text-sm font-black uppercase tracking-widest text-slate-500">基础信息</div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="md:col-span-2">
              <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">图书名称</span>
              <input className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500" onChange={(event) => updateDraft('name', event.target.value)} value={draft.name} />
            </label>
            <label>
              <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">作者</span>
              <input className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500" onChange={(event) => updateDraft('author', event.target.value)} value={draft.author} />
            </label>
            <label>
              <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">出版社</span>
              <input className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500" onChange={(event) => updateDraft('publisher', event.target.value)} value={draft.publisher} />
            </label>
            <label>
              <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">分类</span>
              <select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500" onChange={(event) => updateDraft('category', event.target.value)} value={draft.category}>
                <option>少儿百科</option>
                <option>儿童文学</option>
                <option>科幻文学</option>
                <option>亲子阅读</option>
              </select>
            </label>
            <label>
              <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">默认标题</span>
              <input className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500" onChange={(event) => updateDraft('defaultTitle', event.target.value)} value={draft.defaultTitle} />
            </label>
            <div className="md:col-span-2 rounded-xl border border-blue-100 bg-blue-50 p-4 text-xs font-semibold leading-6 text-blue-700">
              保存产品只生成统一产品主档；渠道、店铺、价格、上下架和详情页在后续渠道商品链路继续维护。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductTemplateDownload({ configRows, navigate }: { configRows: StoreConfig[]; navigate: NavigateFn }) {
  const importChannels: ChannelItem['channel'][] = ['淘宝', '拼多多', '抖音', '快手'];
  const doudianLeafCategoryLabel = '叶子类目 ID 1000006731';
  const channelCategoryOptions: Record<ChannelItem['channel'], string[]> = {
    淘宝: ['淘宝图书 > 少儿 > 百科', '淘宝图书 > 文学小说 > 科幻小说', '淘宝图书 > 教育考试 > 中小学教辅'],
    抖音: [`抖店书籍/杂志/报纸 > 小说 > 科幻小说（${doudianLeafCategoryLabel}）`, '抖店书籍/杂志/报纸 > 童书 > 百科', '抖店书籍/杂志/报纸 > 教材教辅 > 中小学教辅'],
    拼多多: ['拼多多图书 > 文学小说 > 科幻', '拼多多图书 > 童书 > 百科知识', '拼多多图书 > 教辅 > 中小学教辅'],
    快手: ['快手图书音像 > 小说文学 > 科幻小说', '快手图书音像 > 童书 > 百科读物', '快手图书音像 > 教材教辅 > 中小学教辅'],
  };
  const templateLabelMap: Record<ChannelItem['channel'], string> = {
    快手: '快手导入模板',
    拼多多: '拼多多导入模板',
    抖音: '抖店导入模板',
    淘宝: '淘宝导入模板',
  };
  const [selectedChannel, setSelectedChannel] = useState<ChannelItem['channel']>('抖音');
  const [selectedChannelCategory, setSelectedChannelCategory] = useState(channelCategoryOptions['抖音'][0] ?? '');
  const [downloadedTemplates, setDownloadedTemplates] = useState<TemplateDownloadRecord[]>([]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const authorizedShopCount = configRows.filter((config) => config.channel === selectedChannel && config.appSubscriptionStatus === 'subscribed' && config.authorizationStatus === 'authorized').length;
  const isDoudianTemplate = selectedChannel === '抖音';
  const templateDateLabel = '2026-04-27';
  const templateDisplayLabel = `${templateLabelMap[selectedChannel]} / ${templateDateLabel}`;
  const templatePlan = buildTemplateDownloadPlan({
    categories: [],
    channelCategory: selectedChannelCategory.trim() ? { category: selectedChannelCategory, channel: selectedChannel } : null,
    channels: [selectedChannel],
    importType: 'online-item',
  });
  const downloadFileName = templatePlan.fileName.replace('.xlsx', `-${templateDateLabel}.xlsx`);
  const scopeText = `${selectedChannel} / ${selectedChannelCategory}`;
  const downloadScopeText = isDoudianTemplate ? `${scopeText} / 抖店类目规则已带入模板字段` : `${scopeText} / ${authorizedShopCount} 个已授权店铺`;
  const scopeReady = templatePlan.sheetCount > 0;

  function selectChannel(channel: ChannelItem['channel']) {
    setSelectedChannel(channel);
    setSelectedChannelCategory(channelCategoryOptions[channel][0] ?? '');
    setFeedback({ message: `已切换到 ${channel} 渠道模板范围。`, tone: 'info' });
  }

  function downloadTemplate() {
    if (!scopeReady) {
      setFeedback({ message: '请先选择渠道和渠道类目后再下载模板。', tone: 'warning' });
      return;
    }
    const downloadedAt = new Date().toLocaleString('zh-CN', { hour12: false });
    setDownloadedTemplates((current) => addTemplateDownloadRecord(current, {
      ...templatePlan,
      downloadedAt,
      fileName: downloadFileName,
      id: `tpl-${Date.now()}`,
      scope: scopeText,
    }));
    setFeedback({ message: isDoudianTemplate ? `已生成抖店导入模板 ${downloadFileName}，${doudianLeafCategoryLabel}。` : `已生成 ${downloadFileName}。`, tone: 'success' });
  }

  return (
    <div className="space-y-4">
      <PageTitle
        actions={
          <SecondaryButton onClick={() => navigate('/products/import')}>
            <Upload className="mr-1.5" size={14} />
            去产品导入
          </SecondaryButton>
        }
        icon={<FileDown size={22} />}
        subtitle="单独承载模板生成与下载；上传、校验和导入批次处理在产品导入页完成。"
        title="模板下载"
      />
      <InlineFeedback feedback={feedback} />
      <div className="surface-panel p-5">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-black uppercase tracking-widest text-slate-500">下载条件</div>
            <div className="mt-1 text-xs font-semibold text-slate-400">选择模板类型、渠道和渠道类目后下载。</div>
          </div>
          <span className="w-fit rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-black text-slate-500">{templateDisplayLabel}</span>
        </div>
        <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <div>
            <div className="mb-2 text-xs font-black text-slate-500">模板类型</div>
            <div className="grid gap-3">
              <button className="rounded-lg border border-blue-300 bg-blue-50 p-4 text-left text-blue-700">
                <span className="flex items-center gap-2 text-sm font-black"><Store size={18} />渠道商品导入</span>
                <span className="mt-2 block text-xs font-semibold leading-5 text-blue-700/80">包含平台类目属性、售卖字段、SKU、库存和素材字段。</span>
              </button>
              <button className="cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 p-4 text-left text-slate-400" disabled>
                <span className="flex items-center gap-2 text-sm font-black"><BookOpen size={18} />产品资料导入</span>
                <span className="mt-2 block text-xs font-semibold leading-5">用于维护中台产品主档、ISBN、类目、主图和素材。</span>
              </button>
            </div>
          </div>
          <div>
            <div className="mb-2 text-xs font-black text-slate-500">渠道</div>
            <div className="grid grid-cols-2 gap-3">
              {importChannels.map((channel) => {
                const storeCount = configRows.filter((config) => config.channel === channel && config.authorizationStatus === 'authorized').length;
                return (
                  <button
                    className={`rounded-lg border p-3 text-left text-sm font-bold transition-colors ${selectedChannel === channel ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                    key={channel}
                    onClick={() => selectChannel(channel)}
                  >
                    <span className="block">{channel}</span>
                    <span className="mt-1 block text-[10px] font-black text-slate-400">{storeCount} 个已授权店铺</span>
                  </button>
                );
              })}
            </div>
            <label className="mt-4 block">
              <span className="mb-2 block text-xs font-black text-slate-500">{selectedChannel}渠道类目</span>
              <select
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500"
                onChange={(event) => setSelectedChannelCategory(event.target.value)}
                value={selectedChannelCategory}
              >
                {channelCategoryOptions[selectedChannel].map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="text-[10px] font-black uppercase tracking-widest text-blue-500">将下载</div>
            <div className="mt-1 break-words text-sm font-black text-slate-900">{downloadFileName}</div>
            <div className="mt-1 text-xs font-semibold text-blue-700/80">{downloadScopeText}</div>
          </div>
          <PrimaryButton disabled={!scopeReady} onClick={downloadTemplate}>
            <FileDown className="mr-1.5" size={14} />
            下载模板
          </PrimaryButton>
        </div>
      </div>
      <div className="surface-panel p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <div className="text-sm font-black uppercase tracking-widest text-slate-500">下载记录</div>
            <div className="mt-1 text-xs font-semibold text-slate-400">最近下载，最多保留 10 个</div>
          </div>
          <span className="mono-value text-xs font-black text-slate-500">{downloadedTemplates.length}/10</span>
        </div>
        {downloadedTemplates.length === 0 ? (
          <EmptyState description="选择渠道和渠道类目后点击下载模板，记录会保留在这里。" title="暂无模板下载记录" />
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {downloadedTemplates.map((record) => (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3" key={record.id}>
                <div className="text-sm font-black text-slate-900">{record.fileName}</div>
                <div className="mt-1 text-xs font-semibold leading-5 text-slate-500">{record.scope}</div>
                <div className="mt-2 text-[10px] font-black text-slate-400">{record.importTypeLabel} / {record.downloadedAt}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <SecondaryButton onClick={() => setFeedback({ message: `已重新下载 ${record.fileName}。`, tone: 'success' })}><FileDown className="mr-1.5" size={14} />重新下载</SecondaryButton>
                  <SecondaryButton onClick={() => setDownloadedTemplates((current) => current.filter((item) => item.id !== record.id))}><XCircle className="mr-1.5" size={14} />移除</SecondaryButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductImport({ navigate, routeSearch }: { navigate: NavigateFn; routeSearch: string }) {
  const [records, setRecords] = useState<ImportRecord[]>(importRecords);
  const [filters, setFilters] = useState<ImportRecordListFilters>(() => parseImportRecordListFilters(routeSearch));
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const filteredRecords = records.filter((record) => (
    (filters.channel === '全部渠道' || record.channel === filters.channel) &&
    (filters.status === '全部状态' || record.status === filters.status)
  ));

  useEffect(() => {
    replaceRouteSearch('/products/import', buildImportRecordListSearchParams(filters));
  }, [filters]);

  function buildUploadMetadata(fileName: string) {
    const lowerName = fileName.toLowerCase();
    if (lowerName.includes('ks') || lowerName.includes('kuaishou')) {
      return { category: '快手图书音像 > 童书 > 百科读物', channel: '快手' as const, templateVersion: '快手导入模板 / 2026-04-27' };
    }
    if (lowerName.includes('douyin') || lowerName.includes('dy')) {
      return { category: '抖店书籍/杂志/报纸 > 童书 > 百科', channel: '抖音' as const, templateVersion: '抖店导入模板 / 2026-04-27' };
    }
    if (lowerName.includes('pdd') || lowerName.includes('pinduoduo')) {
      return { category: '拼多多图书 > 文学小说 > 科幻', channel: '拼多多' as const, templateVersion: '拼多多导入模板 / 2026-04-27' };
    }
    return { category: '淘宝图书 > 文学小说 > 科幻小说', channel: '淘宝' as const, templateVersion: '淘宝导入模板 / 2026-04-27' };
  }

  function createUploadRecord(fileName = 'book-taobao-0427.xlsx') {
    const metadata = buildUploadMetadata(fileName);
    const nextRecord = createImportRecordFromUpload(records, {
      ...metadata,
      fileName,
      operator: '张敏',
      timestamp: new Date().toLocaleString('zh-CN', { hour12: false }),
    });
    setRecords((current) => [nextRecord, ...current]);
    setFeedback({ message: `${nextRecord.fileName} 已创建导入批次 ${nextRecord.id}，系统已自动进入校验中。`, tone: 'info' });
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const fileName = event.dataTransfer.files[0]?.name ?? 'book-taobao-0427.xlsx';
    createUploadRecord(fileName);
  }

  function markReady(recordId: string) {
    setRecords((current) => current.map((record) => (
      record.id === recordId
        ? { ...record, failed: 0, status: 'ready_to_execute', success: record.total || 36, total: record.total || 36 }
        : record
    )));
    setFeedback({ message: `${recordId} 已完成自动校验，可以确认导入。`, tone: 'success' });
  }

  function confirmRecord(recordId: string) {
    setRecords((current) => current.map((record) => (
      record.id === recordId
        ? { ...record, failed: 0, status: 'completed', success: record.total || record.success, total: record.total || record.success }
        : record
    )));
    setFeedback({ message: `${recordId} 已确认导入，产品、渠道商品、SKU、库存和素材已进入完成状态。`, tone: 'success' });
  }

  return (
    <div className="space-y-4">
      <PageTitle
        actions={
          <>
            <SecondaryButton onClick={() => navigate('/products/template-download')}>
              <FileDown className="mr-1.5" size={14} />
              模板下载
            </SecondaryButton>
            <SecondaryButton onClick={() => setFilters({ channel: '全部渠道', status: '全部状态' })}>
              <SlidersHorizontal className="mr-1.5" size={14} />
              重置筛选
            </SecondaryButton>
          </>
        }
        icon={<Upload size={22} />}
        subtitle="拖入新的 Excel 或导入包后自动创建批次并自动校验；下方列表统一追踪导入记录。"
        title="产品导入"
      />
      <InlineFeedback feedback={feedback} />
      <div
        className="rounded-lg border border-dashed border-blue-300 bg-blue-50 p-6 text-center text-blue-700"
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto" size={34} />
        <div className="mt-3 text-sm font-black text-slate-900">拖入新的导入文件</div>
        <p className="mt-1 text-xs font-semibold leading-5 text-blue-700/80">支持 Excel 或素材压缩包。系统从文件元信息识别模板、导入类型、渠道和类目，上传后直接进入自动校验。</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <SecondaryButton onClick={() => createUploadRecord('book-taobao-0427.xlsx')}>模拟拖入淘宝 Excel</SecondaryButton>
          <SecondaryButton onClick={() => createUploadRecord('ks-live-books-0427.zip')}>模拟拖入快手素材包</SecondaryButton>
        </div>
      </div>
      <div className="surface-panel p-4">
        <div className="grid gap-3 md:grid-cols-2">
          <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500" onChange={(event) => setFilters((current) => ({ ...current, channel: event.target.value as ImportRecordListFilters['channel'] }))} value={filters.channel}>
            <option>全部渠道</option>
            <option>淘宝</option>
            <option>快手</option>
            <option>抖音</option>
            <option>拼多多</option>
          </select>
          <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500" onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value as ImportRecordListFilters['status'] }))} value={filters.status}>
            <option>全部状态</option>
            <option value="validating">校验中</option>
            <option value="validate_failed">校验失败</option>
            <option value="ready_to_execute">待确认</option>
            <option value="executing">导入中</option>
            <option value="completed">已完成</option>
            <option value="execute_failed">执行失败</option>
          </select>
        </div>
      </div>
      <div className={`${LIST_PANEL_CLASS} overflow-x-auto`}>
        <table className="w-full min-w-[1180px] border-collapse text-left">
          <thead className={LIST_HEADER_CLASS}>
            <tr>
              <th className="table-head-cell">文件 / 批次</th>
              <th className="table-head-cell">导入范围</th>
              <th className="table-head-cell">模板</th>
              <th className="table-head-cell text-center">成功 / 失败</th>
              <th className="table-head-cell">操作人</th>
              <th className="table-head-cell">状态</th>
              <th className="table-head-cell">上传时间</th>
              <th className="table-head-cell text-right">操作</th>
            </tr>
          </thead>
          <tbody className={LIST_BODY_CLASS}>
            {filteredRecords.map((record) => {
              const action = buildImportRecordAction(record);
              return (
                <tr className={LIST_ROW_CLASS} key={record.id}>
                  <td className="table-body-cell">
                    <button
                      className="block text-left font-black text-blue-600 transition-colors hover:text-blue-700"
                      onClick={() => setFeedback({ message: action.message, tone: action.tone })}
                    >
                      {record.fileName}
                    </button>
                    <ListMeta mono>{record.id} / {record.importType}</ListMeta>
                  </td>
                  <td className="table-body-cell">
                    <ChannelIdentity channel={record.channel} subtitle={record.shop} />
                    <ListMeta>{record.category}</ListMeta>
                  </td>
                  <td className="table-body-cell mono-value text-xs text-slate-500">{record.templateVersion}</td>
                  <td className="table-body-cell text-center">
                    <span className="mono-value font-black text-emerald-600">{record.success}</span>
                    <span className="mx-1 text-slate-300">/</span>
                    <span className="mono-value font-black text-red-500">{record.failed}</span>
                    <ListMeta>共 {record.total} 行</ListMeta>
                  </td>
                  <td className="table-body-cell">{record.operator}</td>
                  <td className="table-body-cell"><ListStatus status={record.status} /></td>
                  <td className="table-body-cell mono-value text-xs text-slate-400">{record.createdAt}</td>
                  <td className="table-body-cell text-right">
                    <div className="flex items-center justify-end gap-2">
                      {record.status === 'validating' && (
                        <ActionIconButton onClick={() => markReady(record.id)} title="模拟校验通过">
                          <CheckCircle2 size={16} />
                        </ActionIconButton>
                      )}
                      {record.status === 'ready_to_execute' && (
                        <ActionIconButton onClick={() => confirmRecord(record.id)} title="确认导入">
                          <CheckCircle2 size={16} />
                        </ActionIconButton>
                      )}
                      <ActionIconButton
                        onClick={() => setFeedback({ message: action.message, tone: action.tone })}
                        title={action.label}
                      >
                        <ArrowUpRight size={16} />
                      </ActionIconButton>
                      <ActionIconButton
                        onClick={() => setFeedback({ message: `已复制导入任务 ID：${record.id}`, tone: 'info' })}
                        title="复制任务 ID"
                        tone="slate"
                      >
                        <Copy size={16} />
                      </ActionIconButton>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredRecords.length === 0 && (
              <tr>
                <td className="p-5" colSpan={8}>
                  <EmptyState description="拖入新文件或调整渠道、任务状态后重新查询。" title="没有命中导入批次" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ChannelItemList({
  channelItemRows,
  detailPageRows,
  navigate,
  productRows,
  routeSearch,
  searchTerm,
}: {
  channelItemRows: ChannelItem[];
  detailPageRows: DetailPage[];
  navigate: NavigateFn;
  productRows: Product[];
  routeSearch: string;
  searchTerm: string;
}) {
  const [filters, setFilters] = useState<ChannelItemListFilters>(() => parseChannelItemListFilters(routeSearch));
  const channels = Array.from(new Set(channelItemRows.map((item) => item.channel)));
  const shops = Array.from(new Set(channelItemRows.map((item) => item.shop)));
  const productById = new Map(productRows.map((product) => [product.id, product]));
  const filtered = channelItemRows.filter((item) => {
    const product = productById.get(item.productId);
    const isbn = product?.isbn ?? '';
    return (
      `${item.title}${item.productName}${item.itemCode}${isbn}`.toLowerCase().includes(searchTerm.toLowerCase()) &&
      `${item.productName}${item.productId}${isbn}`.toLowerCase().includes(filters.product.toLowerCase()) &&
      (filters.channel === '全部渠道' || item.channel === filters.channel) &&
      (filters.shop === '全部店铺' || item.shop === filters.shop) &&
      (filters.shelfStatus === '全部状态' || item.shelfStatus === filters.shelfStatus)
    );
  });

  function updateFilter(key: keyof typeof filters, value: string) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  useEffect(() => {
    replaceRouteSearch('/channel-items/list', buildChannelItemListSearchParams(filters));
  }, [filters]);

  return (
    <div className="space-y-4">
      <PageTitle
        actions={
          <>
            <SecondaryButton onClick={() => navigate('/channel-items/batch-edit', buildChannelItemListSearchParams(filters))}>
              <Hash className="mr-1.5" size={14} />
              批量修改
            </SecondaryButton>
            <SecondaryButton onClick={() => setFilters({ channel: '全部渠道', product: '', shelfStatus: '全部状态', shop: '全部店铺' })}>
              <Filter className="mr-1.5" size={14} />
              重置筛选
            </SecondaryButton>
          </>
        }
        accent="slate"
        icon={<ShoppingCart size={22} />}
        subtitle="按产品聚合、按渠道商品展开；商品可直接进入详情编辑，详情页数量列进入详情页列表。"
        title="商品列表"
      />
      <RuleStrip>列表页不在表格内直接改字段；点击商品标题进入可编辑的渠道商品详情，右侧图标分别进入商品详情和详情页列表。</RuleStrip>
      <div className="flex flex-wrap items-center gap-4">
        <CompactStat color="slate" label="渠道商品" value={channelItemRows.length} />
        <CompactStat color="blue" label="已上架" value={channelItemRows.filter((item) => item.shelfStatus === 'online').length} />
        <CompactStat color="indigo" label="详情页数量" value={detailPageRows.length} />
      </div>
      <div className="surface-panel p-4">
        <div className="grid gap-3 md:grid-cols-4">
          <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500" onChange={(event) => updateFilter('channel', event.target.value)} value={filters.channel}>
            <option>全部渠道</option>
            {channels.map((channel) => <option key={channel}>{channel}</option>)}
          </select>
          <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500" onChange={(event) => updateFilter('shop', event.target.value)} value={filters.shop}>
            <option>全部店铺</option>
            {shops.map((shop) => <option key={shop}>{shop}</option>)}
          </select>
          <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500" onChange={(event) => updateFilter('shelfStatus', event.target.value)} value={filters.shelfStatus}>
            <option>全部状态</option>
            <option value="online">上架中</option>
            <option value="offline">已下架</option>
          </select>
          <input className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500" onChange={(event) => updateFilter('product', event.target.value)} placeholder="产品名称 / 产品ID / ISBN / 商品ID" value={filters.product} />
        </div>
      </div>
      <div className={`${LIST_PANEL_CLASS} overflow-x-auto`}>
        <table className="w-full min-w-[1120px] border-collapse text-left">
          <thead className={LIST_HEADER_CLASS}>
            <tr>
              <th className="table-head-cell text-slate-500">渠道 / 店铺</th>
              <th className="table-head-cell">渠道商品标题</th>
              <th className="table-head-cell">关联主档</th>
              <th className="table-head-cell">ISBN</th>
              <th className="table-head-cell">渠道售价</th>
              <th className="table-head-cell">状态</th>
              <th className="table-head-cell text-right">操作</th>
            </tr>
          </thead>
          <tbody className={LIST_BODY_CLASS}>
            {filtered.map((item) => {
              const product = productById.get(item.productId);
              return (
              <tr className={LIST_ROW_CLASS} key={item.id}>
                <td className="table-body-cell">
                  <ChannelIdentity channel={item.channel} subtitle={item.shop} />
                </td>
                <td className="table-body-cell max-w-md">
                  <button
                    className="block max-w-md truncate text-left text-sm font-black text-blue-600 transition-colors hover:text-blue-700"
                    onClick={() => navigate('/channel-items/detail', { channelItemId: item.id, ...buildChannelItemListSearchParams(filters) })}
                  >
                    {item.title}
                  </button>
                  <ListMeta mono>商品ID {item.itemCode}</ListMeta>
                </td>
                <td className="table-body-cell">
                  <div className="text-sm font-bold text-slate-600">{item.productName}</div>
                  <ListMeta mono>产品ID {item.productId}</ListMeta>
                </td>
                <td className="table-body-cell mono-value text-xs font-bold text-slate-600">{product?.isbn ?? '-'}</td>
                <td className="table-body-cell mono-value text-sm font-black text-slate-950">¥{item.price.toFixed(2)}</td>
                <td className="table-body-cell">
                  <ListStatus status={item.shelfStatus} />
                </td>
                <td className="table-body-cell text-right">
                  <div className="flex items-center justify-end gap-2">
                    <ActionIconButton
                      onClick={() => navigate('/channel-items/detail', { channelItemId: item.id, ...buildChannelItemListSearchParams(filters) })}
                      title="编辑商品详情"
                    >
                      <ArrowUpRight size={17} />
                    </ActionIconButton>
                    <ActionIconButton
                      onClick={() => navigate('/channel-items/detail-pages', { channelItemId: item.id, ...buildChannelItemListSearchParams(filters) })}
                      title={`详情页 ${detailPageRows.filter((detail) => detail.channelItemId === item.id).length}/3`}
                      tone="indigo"
                    >
                      <Layers size={17} />
                    </ActionIconButton>
                  </div>
                </td>
              </tr>
            );
            })}
            {filtered.length === 0 && (
              <tr>
                <td className="p-5" colSpan={7}>
                  <EmptyState description="调整渠道、店铺、产品或上下架状态后重新查询。" title="没有命中渠道商品" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ChannelItemDetail({
  channelItemRows,
  detailPageRows,
  materialRows,
  navigate,
  productRows,
  routeSearch,
  setChannelItemRows,
  setDetailPageRows,
}: {
  channelItemRows: ChannelItem[];
  detailPageRows: DetailPage[];
  materialRows: MaterialItem[];
  navigate: NavigateFn;
  productRows: Product[];
  routeSearch: string;
  setChannelItemRows: Dispatch<SetStateAction<ChannelItem[]>>;
  setDetailPageRows: Dispatch<SetStateAction<DetailPage[]>>;
}) {
  const item = pickById(channelItemRows, new URLSearchParams(routeSearch).get('channelItemId'));
  const backToListParams = buildChannelItemListSearchParams(parseChannelItemListFilters(routeSearch));
  const itemDetailPages = detailPageRows.filter((detail) => detail.channelItemId === item.id);
  const detailPageCount = itemDetailPages.length;
  const currentDetail = itemDetailPages.find((detail) => detail.status === 'current') ?? itemDetailPages[0] ?? null;
  const product = productRows.find((row) => row.id === item.productId);
  const mainImage = materialRows.find((asset) => asset.productId === item.productId && asset.type === '主图')?.src ?? product?.cover ?? currentDetail?.blocks.find((block) => block.asset)?.asset;
  const adaptation = categoryAdaptations.find((entry) => entry.channelItemId === item.id) ?? categoryAdaptations[0]!;
  const [itemDraft, setItemDraft] = useState(() => ({
    price: item.price,
    shelfStatus: item.shelfStatus,
    title: item.title,
  }));
  const shelfAction = buildChannelItemShelfAction(itemDraft);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [detailDraft, setDetailDraft] = useState(() => ({
    blocks: currentDetail?.blocks.map((block) => ({ ...block })) ?? [],
    name: currentDetail?.name ?? '未配置商品详情',
  }));

  useEffect(() => {
    setItemDraft({
      price: item.price,
      shelfStatus: item.shelfStatus,
      title: item.title,
    });
  }, [item.id, item.price, item.shelfStatus, item.title]);

  useEffect(() => {
    setDetailDraft({
      blocks: currentDetail?.blocks.map((block) => ({ ...block })) ?? [],
      name: currentDetail?.name ?? '未配置商品详情',
    });
  }, [currentDetail?.blocks, currentDetail?.id, currentDetail?.name]);

  function saveCurrentDetail() {
    if (!currentDetail) {
      setFeedback({ message: '当前商品还没有详情页，请先进入详情页列表上传或创建详情页。', tone: 'warning' });
      return;
    }
    setDetailPageRows((rows) => saveDetailPageRows(rows, currentDetail.id, detailDraft, PROTOTYPE_NOW));
    setFeedback({ message: '商品详情已保存，主图和详情模块会随当前详情页继续展示。', tone: 'success' });
  }

  function appendDetailTextBlock() {
    setDetailDraft((current) => ({
      ...current,
      blocks: appendDetailPageBlock(current.blocks, {
        body: '请补充商品详情说明。',
        id: buildPrototypeId('block'),
        title: `新增详情模块 ${current.blocks.length + 1}`,
        type: 'text',
      }),
    }));
  }

  return (
    <div className="space-y-4">
      <PageTitle
        actions={
          <>
            <SecondaryButton onClick={() => navigate('/channel-items/list', backToListParams)}>返回商品列表</SecondaryButton>
            <PrimaryButton onClick={() => navigate('/channel-items/detail-pages', { channelItemId: item.id })}>查看详情页</PrimaryButton>
            <PrimaryButton
              color="slate"
              onClick={() => {
                setChannelItemRows((rows) => updateChannelItemRows(rows, item.id, itemDraft, PROTOTYPE_NOW));
                setFeedback({ message: '渠道商品售卖字段已保存，类目适配结果保持只读引用。', tone: 'success' });
              }}
            >
              <Save className="mr-1.5" size={14} />
              保存商品
            </PrimaryButton>
          </>
        }
        accent="slate"
        icon={<ShoppingCart size={22} />}
        subtitle="维护商品售卖字段，并编辑当前使用的商品详情内容。"
        title={item.title}
      />
      <InlineFeedback feedback={feedback} />
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <FormPanel item={itemDraft} onChange={(patch) => setItemDraft((current) => ({ ...current, ...patch }))} title="基础售卖字段" />
        <div className="surface-panel p-5">
          <div className="mb-4 text-sm font-black uppercase tracking-widest text-slate-500">商品主图</div>
          {mainImage ? (
            <img alt={item.title} className="h-56 w-full rounded-xl object-cover ring-1 ring-slate-200" src={mainImage} />
          ) : (
            <EmptyState description="当前商品尚未关联主图素材。" title="暂无主图" />
          )}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <MiniMetric label="详情页数量" value={detailPageCount} />
            <MiniMetric label="当前素材引用" value={currentDetail?.assetCount ?? 0} />
          </div>
          <button className="mt-4 w-full rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white shadow-lg shadow-blue-600/20" onClick={() => navigate('/channel-items/detail-pages', { channelItemId: item.id })}>
            进入详情页列表管理
          </button>
        </div>
        <div className="surface-panel p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-black uppercase tracking-widest text-slate-500">商品详情编辑</div>
              <p className="mt-1 text-xs font-medium text-slate-500">编辑当前使用详情页的名称、图文模块和文案。上传新详情页、切换版本和素材复用仍可进入详情页列表处理。</p>
            </div>
            <StatusBadge status={currentDetail?.status ?? 'history'} />
          </div>
          {currentDetail ? (
            <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="space-y-3">
                <Field label="详情页名称" onChange={(value) => setDetailDraft((current) => ({ ...current, name: value }))} value={detailDraft.name} />
                <div className="flex flex-wrap gap-2">
                  <SecondaryButton onClick={appendDetailTextBlock}>
                    <Plus className="mr-1.5" size={14} />
                    新增文案模块
                  </SecondaryButton>
                  <PrimaryButton color="slate" onClick={saveCurrentDetail}>
                    <Save className="mr-1.5" size={14} />
                    保存商品详情
                  </PrimaryButton>
                </div>
                {detailDraft.blocks.map((block, index) => (
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3" key={block.id}>
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="rounded bg-slate-900 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white">{block.type}</span>
                      <div className="flex items-center gap-2">
                        <button className="rounded border border-slate-200 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-slate-600" disabled={index === 0} onClick={() => setDetailDraft((current) => ({ ...current, blocks: moveDetailPageBlock(current.blocks, block.id, 'up') }))}>上移</button>
                        <button className="rounded border border-slate-200 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-slate-600" disabled={index === detailDraft.blocks.length - 1} onClick={() => setDetailDraft((current) => ({ ...current, blocks: moveDetailPageBlock(current.blocks, block.id, 'down') }))}>下移</button>
                        <button className="rounded border border-red-200 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-red-500" disabled={detailDraft.blocks.length === 1} onClick={() => setDetailDraft((current) => ({ ...current, blocks: removeDetailPageBlock(current.blocks, block.id) }))}>删除</button>
                      </div>
                    </div>
                    {block.asset && <img alt={block.title} className="mb-3 max-h-48 w-full rounded-lg object-cover" src={block.asset} />}
                    <div className="grid gap-3">
                      <Field label="模块标题" onChange={(value) => setDetailDraft((current) => ({ ...current, blocks: updateDetailPageBlock(current.blocks, block.id, { title: value }) }))} value={block.title} />
                      <label>
                        <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">模块内容</span>
                        <textarea
                          className="min-h-24 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                          onChange={(event) => setDetailDraft((current) => ({ ...current, blocks: updateDetailPageBlock(current.blocks, block.id, { body: event.target.value }) }))}
                          value={block.body}
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="mb-3 text-sm font-black uppercase tracking-widest text-slate-500">当前详情预览</div>
                {mainImage && <img alt={item.title} className="mb-3 max-h-52 w-full rounded-xl object-cover" src={mainImage} />}
                <div className="mb-3 text-lg font-black text-slate-900">{detailDraft.name}</div>
                <div className="space-y-3">
                  {detailDraft.blocks.map((block) => (
                    <div className="rounded-lg border border-slate-200 bg-white p-3" key={`${currentDetail.id}-${block.id}`}>
                      {block.asset && <img alt={block.title} className="mb-3 max-h-40 w-full rounded-lg object-cover" src={block.asset} />}
                      <div className="text-sm font-bold text-slate-900">{block.title}</div>
                      <div className="mt-1 text-xs leading-6 text-slate-500">{block.body}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <EmptyState description="当前商品没有详情页。请先进入详情页列表上传或创建详情页。" title="暂无可编辑详情" />
          )}
        </div>
        <div className="surface-panel p-5">
          <div className="mb-4 text-sm font-black uppercase tracking-widest text-slate-500">售卖操作</div>
          <div className="grid gap-3 md:grid-cols-2">
            <MiniMetric label="当前售价" value={`¥${itemDraft.price}`} />
            <MiniMetric label="商品状态" value={itemDraft.shelfStatus === 'online' ? '上架中' : '已下架'} />
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <SecondaryButton onClick={() => setItemDraft((current) => ({ ...current, price: current.price + 1 }))}>
              <Hash className="mr-1.5" size={14} />
              修改价格
            </SecondaryButton>
            <SecondaryButton
              onClick={() => {
                setItemDraft((current) => ({ ...current, shelfStatus: shelfAction.nextStatus }));
                setFeedback({ message: shelfAction.message, tone: shelfAction.tone });
              }}
            >
              {shelfAction.actionLabel}
            </SecondaryButton>
            <SecondaryButton onClick={() => setFeedback({ message: '已复制渠道商品链接和 item_code，用于外部校验。', tone: 'info' })}>
              <Link2 className="mr-1.5" size={14} />
              复制链接
            </SecondaryButton>
          </div>
        </div>
        <div className="surface-panel p-5">
          <div className="mb-4 text-sm font-black uppercase tracking-widest text-slate-500">库存与配置入口</div>
          <div className="grid gap-3">
            <button className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-left transition hover:border-indigo-200 hover:bg-indigo-50/50" onClick={() => navigate('/inventory/list')}>
              <div className="text-sm font-bold text-slate-900">查看库存对账</div>
              <div className="mt-1 text-xs font-semibold text-slate-500">{item.channel} / {item.shop} 的 SKU 库存从库存列表进入。</div>
            </button>
            <button className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-left transition hover:border-violet-200 hover:bg-violet-50/50" onClick={() => navigate('/store-config/list')}>
              <div className="text-sm font-bold text-slate-900">查看店铺配置</div>
              <div className="mt-1 text-xs font-semibold text-slate-500">运费模板、默认上下架和发货时效在店铺管理维护。</div>
            </button>
          </div>
        </div>
        <div className="surface-panel p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-black uppercase tracking-widest text-slate-500">类目适配结果</div>
              <p className="mt-1 text-xs font-medium text-slate-500">只读消费中台管理端结果，来源接口为 {adaptation.sourceApi}。</p>
            </div>
            <StatusBadge status={itemDraft.shelfStatus} />
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Info label="渠道类目" value={adaptation.channelCategoryName} />
            <Info label="标准类目" value={adaptation.standardCategoryName} />
            <Info label="渠道类目 ID" mono value={adaptation.channelCategoryId} />
            <Info label="标准类目 ID" mono value={adaptation.standardCategoryId} />
            <Info label="适配覆盖" value={adaptation.attributeCoverage} />
            <Info label="读取店铺" value={`${adaptation.channel} / ${adaptation.shop}`} />
            <Info label="治理主体" value={adaptation.customerName} />
            <Info label="最近同步" mono value={adaptation.updatedAt} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <SecondaryButton onClick={() => setFeedback({ message: '已重新读取类目适配结果，用户端仍不写入映射规则。', tone: 'info' })}>
              <RefreshCw className="mr-1.5" size={14} />
              重新读取适配
            </SecondaryButton>
            <SecondaryButton onClick={() => setFeedback({ message: '已复制类目适配 API 参数，用于联调核对。', tone: 'info' })}>
              <Copy className="mr-1.5" size={14} />
              复制 API 参数
            </SecondaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailPageList({
  channelItemRows,
  detailPageRows,
  materialRows,
  navigate,
  productRows,
  routeSearch,
  setDetailPageRows,
  setMaterialRows,
}: {
  channelItemRows: ChannelItem[];
  detailPageRows: DetailPage[];
  materialRows: MaterialItem[];
  navigate: NavigateFn;
  productRows: Product[];
  routeSearch: string;
  setDetailPageRows: Dispatch<SetStateAction<DetailPage[]>>;
  setMaterialRows: Dispatch<SetStateAction<MaterialItem[]>>;
}) {
  const query = new URLSearchParams(routeSearch);
  const defaultChannelItem = query.get('channelItemId') ?? '';
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [filters, setFilters] = useState<DetailPageListFilters>(() => {
    const parsed = parseDetailPageListFilters(routeSearch);
    return {
      ...parsed,
      channelItem: parsed.channelItem || defaultChannelItem,
      product: parsed.product || query.get('productId') || '',
    };
  });
  const [selectedDetailId, setSelectedDetailId] = useState(() => {
    if (query.get('detailId')) return query.get('detailId')!;
    if (defaultChannelItem) return detailPageRows.find((detail) => detail.channelItemId === defaultChannelItem)?.id ?? detailPageRows[0]!.id;
    return detailPageRows[0]!.id;
  });
  const selected = pickById(detailPageRows, selectedDetailId);
  const item = channelItemRows.find((row) => row.id === selected.channelItemId)!;
  const relatedAssets = materialRows.filter((asset) => asset.productId === selected.productId);
  const [detailDraft, setDetailDraft] = useState(() => ({
    blocks: selected.blocks.map((block) => ({ ...block })),
    name: selected.name,
  }));
  const limitState = getDetailLimitState(detailPageRows, selected.channelItemId);
  const limitReached = limitState.limitReached;
  const channels = Array.from(new Set(channelItemRows.map((row) => row.channel)));
  const shops = Array.from(new Set(channelItemRows.map((row) => row.shop)));
  const filteredDetails = detailPageRows.filter((detail) => {
    const rowItem = channelItemRows.find((entry) => entry.id === detail.channelItemId)!;
    const product = productRows.find((entry) => entry.id === detail.productId)!;
    return (
      `${product.name}${product.id}`.toLowerCase().includes(filters.product.toLowerCase()) &&
      `${rowItem.title}${rowItem.id}`.toLowerCase().includes(filters.channelItem.toLowerCase()) &&
      detail.name.toLowerCase().includes(filters.detailName.toLowerCase()) &&
      (filters.channel === '全部渠道' || rowItem.channel === filters.channel) &&
      (filters.shop === '全部店铺' || rowItem.shop === filters.shop) &&
      (filters.status === '全部状态' || detail.status === filters.status)
    );
  });
  const maxedItemCount = new Set(
    channelItemRows
      .filter((row) => getDetailLimitState(detailPageRows, row.id).limitReached)
      .map((row) => row.id),
  ).size;

  function updateFilter(key: keyof typeof filters, value: string) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  useEffect(() => {
    setDetailDraft({
      blocks: selected.blocks.map((block) => ({ ...block })),
      name: selected.name,
    });
  }, [selected.blocks, selected.id, selected.name]);

  useEffect(() => {
    if (filteredDetails.length === 0) return;
    if (!filteredDetails.some((detail) => detail.id === selectedDetailId)) {
      setSelectedDetailId(filteredDetails[0]!.id);
    }
  }, [filteredDetails, selectedDetailId]);

  useEffect(() => {
    replaceRouteSearch('/channel-items/detail-pages', {
      ...buildDetailPageListSearchParams(filters),
      ...(selectedDetailId ? { detailId: selectedDetailId } : {}),
    });
  }, [filters, selectedDetailId]);

  function saveDraft(message = '详情页草稿已保存，模块顺序和文案已回写到原型数据。') {
    setDetailPageRows((rows) => saveDetailPageRows(rows, selected.id, {
      blocks: detailDraft.blocks,
      name: detailDraft.name,
    }, PROTOTYPE_NOW));
    setFeedback({ message, tone: 'success' });
  }

  function appendTextBlock() {
    setDetailDraft((current) => ({
      ...current,
      blocks: appendDetailPageBlock(current.blocks, {
        body: '请补充该模块的卖点说明、适用场景或售后承诺。',
        id: buildPrototypeId('block'),
        title: `新增文案模块 ${current.blocks.length + 1}`,
        type: 'text',
      }),
    }));
  }

  function createDetailFromSelected(mode: 'copy' | 'upload') {
    if (limitReached) {
      setFeedback({ message: `当前渠道商品已有 ${limitState.count} 个详情页，已达到 ${limitState.limit} 个上限。`, tone: 'warning' });
      return;
    }

    const id = `detail-proto-${detailPageRows.length + 1}`;
    const nextDetail: typeof selected = {
      ...selected,
      blocks: detailDraft.blocks.map((block) => ({ ...block })),
      assetCount: mode === 'upload' ? Math.max(selected.assetCount, 1) : selected.assetCount,
      id,
      name: mode === 'upload' ? `${item.channel}新上传详情页` : `${detailDraft.name} 副本`,
      status: 'history',
      updatedAt: PROTOTYPE_NOW,
    };
    setDetailPageRows((rows) => [...rows, nextDetail]);
    setSelectedDetailId(id);
    setFeedback({ message: mode === 'upload' ? '已上传新详情页并归档素材，默认保留为历史版本。' : '已复制为新版本，可编辑后设为当前使用。', tone: 'success' });
  }

  function makeCurrent() {
    setDetailPageRows((rows) => setCurrentDetailPage(rows, selected.id));
    setFeedback({ message: '当前使用详情页已切换，同渠道商品下其他详情页自动转为历史版本。', tone: 'success' });
  }

  function reuseAsset(assetId: string, fileName: string) {
    const asset = materialRows.find((row) => row.id === assetId);
    if (!asset) return;

    const nextBlocks = appendDetailPageBlock(detailDraft.blocks, {
      asset: asset.src,
      body: `复用素材 ${fileName}，用于详情页图文说明。`,
      id: buildPrototypeId('block'),
      title: fileName.replace(/\.[^.]+$/, ''),
      type: detailDraft.blocks.some((block) => block.type === 'hero') ? 'image' : 'hero',
    });
    const linkedResult = linkMaterialToDetailPage({
      assetId,
      detailPageId: selected.id,
      detailPageRows,
      materialRows,
      timestamp: PROTOTYPE_NOW,
    });
    setMaterialRows(linkedResult.materialRows);
    setDetailPageRows(saveDetailPageRows(linkedResult.detailPageRows, selected.id, { blocks: nextBlocks, name: detailDraft.name }, PROTOTYPE_NOW));
    setDetailDraft((current) => ({ ...current, blocks: nextBlocks }));
    setFeedback({ message: `${fileName} 已加入当前详情页，并插入新的图文模块。`, tone: 'success' });
  }

  return (
    <div className="space-y-4">
      <PageTitle
        actions={
          <>
            <SecondaryButton onClick={() => navigate('/materials/list', { detailId: selected.id })}>从素材列表复用</SecondaryButton>
            <PrimaryButton disabled={limitReached} onClick={() => createDetailFromSelected('upload')} title={limitReached ? '该渠道商品已达到 3 个详情页上限' : undefined}><Plus className="mr-1.5" size={14} />上传新详情页</PrimaryButton>
          </>
        }
        accent="slate"
        icon={<Layers size={22} />}
        subtitle="统一管理全部渠道商品详情页；单个渠道商品最多 3 个版本，同时只有 1 个当前使用。"
        title="渠道商品详情页列表"
      />
      <InlineFeedback feedback={feedback} />
      {limitReached && (
        <RuleStrip tone="warning">当前渠道商品已有 {limitState.count} 个详情页，不能继续新建、上传或复制。请先停用或删除历史版本。</RuleStrip>
      )}
      <div className="flex flex-wrap items-center gap-4">
        <CompactStat color="blue" label="产品数" value={new Set(detailPageRows.map((row) => row.productId)).size} />
        <CompactStat color="slate" label="渠道商品数" value={new Set(detailPageRows.map((row) => row.channelItemId)).size} />
        <CompactStat color="indigo" label="详情页总数" value={detailPageRows.length} />
        <CompactStat color="red" label="已达上限" value={maxedItemCount} />
        <CompactStat color="violet" label="当前剩余额度" value={limitState.remaining} />
      </div>
      <div className="surface-panel p-4">
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          <input className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500" onChange={(event) => updateFilter('product', event.target.value)} placeholder="产品名称 / productId" value={filters.product} />
          <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500" onChange={(event) => updateFilter('channel', event.target.value)} value={filters.channel}>
            <option>全部渠道</option>
            {channels.map((channel) => <option key={channel}>{channel}</option>)}
          </select>
          <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500" onChange={(event) => updateFilter('shop', event.target.value)} value={filters.shop}>
            <option>全部店铺</option>
            {shops.map((shop) => <option key={shop}>{shop}</option>)}
          </select>
          <input className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500" onChange={(event) => updateFilter('channelItem', event.target.value)} placeholder="渠道商品 / channelItemId" value={filters.channelItem} />
          <input className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500" onChange={(event) => updateFilter('detailName', event.target.value)} placeholder="详情页名称" value={filters.detailName} />
          <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500" onChange={(event) => updateFilter('status', event.target.value)} value={filters.status}>
            <option>全部状态</option>
            <option value="current">当前使用</option>
            <option value="history">历史版本</option>
          </select>
        </div>
      </div>
      <div className="grid gap-4 2xl:grid-cols-[1.1fr_0.9fr]">
        <div className={`${LIST_PANEL_CLASS} overflow-x-auto`}>
          <table className="w-full min-w-[960px] border-collapse text-left">
            <thead className={LIST_HEADER_CLASS}>
              <tr>
                <th className="table-head-cell">产品 / 渠道商品</th>
                <th className="table-head-cell">渠道 / 店铺</th>
                <th className="table-head-cell">详情页名称</th>
                <th className="table-head-cell">当前使用</th>
                <th className="table-head-cell">素材</th>
                <th className="table-head-cell">最后编辑</th>
              </tr>
            </thead>
            <tbody className={LIST_BODY_CLASS}>
              {filteredDetails.map((detail) => {
                const rowItem = channelItemRows.find((entry) => entry.id === detail.channelItemId)!;
                return (
                  <tr className={`cursor-pointer ${detail.id === selected.id ? 'bg-blue-50/70' : 'hover:bg-slate-50/80'}`} key={detail.id} onClick={() => setSelectedDetailId(detail.id)}>
                    <td className="table-body-cell">
                      <div className="font-black text-blue-600">{productRows.find((product) => product.id === detail.productId)?.name}</div>
                      <ListMeta mono>商品ID {rowItem.itemCode}</ListMeta>
                    </td>
                    <td className="table-body-cell"><ChannelIdentity channel={rowItem.channel} subtitle={rowItem.shop} /></td>
                    <td className="table-body-cell font-bold text-slate-900">{detail.name}</td>
                    <td className="table-body-cell"><ListStatus status={detail.status} /></td>
                    <td className="table-body-cell">
                      <button className="mono-value text-blue-600" onClick={(event) => { event.stopPropagation(); navigate('/materials/list', { detailId: detail.id }); }}>
                        {detail.assetCount}
                      </button>
                    </td>
                    <td className="table-body-cell mono-value text-xs text-slate-400">{detail.updatedAt}</td>
                  </tr>
                );
              })}
              {filteredDetails.length === 0 && (
                <tr>
                  <td className="p-5" colSpan={6}>
                    <EmptyState description="调整产品、渠道、店铺、渠道商品或当前使用状态后重新查询。" title="没有命中详情页" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="space-y-4">
          <div className="surface-panel p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">{detailDraft.name}</div>
                <div className="mt-1 text-xs text-slate-400">{item.title}</div>
              </div>
              <StatusBadge status={selected.status} />
            </div>
            <div className="mb-4 grid gap-3">
              <Field label="详情页名称" onChange={(value) => setDetailDraft((current) => ({ ...current, name: value }))} value={detailDraft.name} />
              <SecondaryButton onClick={() => navigate('/channel-items/detail', { channelItemId: item.id })}>查看关联商品</SecondaryButton>
              <div className="flex flex-wrap gap-2">
                <SecondaryButton onClick={appendTextBlock}>
                  <Plus className="mr-1.5" size={14} />
                  新增文案模块
                </SecondaryButton>
              </div>
              <div className="flex flex-wrap gap-2">
                <SecondaryButton onClick={() => saveDraft()}>保存草稿</SecondaryButton>
                <SecondaryButton disabled={selected.status === 'current'} onClick={makeCurrent}>设为当前使用</SecondaryButton>
                <SecondaryButton disabled={limitReached} onClick={() => createDetailFromSelected('copy')} title={limitReached ? '该渠道商品已达到 3 个详情页上限' : undefined}>复制为新版本</SecondaryButton>
              </div>
            </div>
            <div className="space-y-3">
              {detailDraft.blocks.map((block, index) => (
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3" key={block.id}>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="rounded bg-slate-900 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white">{block.type}</span>
                    <div className="flex items-center gap-2">
                      <button className="rounded border border-slate-200 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-slate-600" disabled={index === 0} onClick={() => setDetailDraft((current) => ({ ...current, blocks: moveDetailPageBlock(current.blocks, block.id, 'up') }))}>上移</button>
                      <button className="rounded border border-slate-200 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-slate-600" disabled={index === detailDraft.blocks.length - 1} onClick={() => setDetailDraft((current) => ({ ...current, blocks: moveDetailPageBlock(current.blocks, block.id, 'down') }))}>下移</button>
                      <button className="rounded border border-red-200 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-red-500" disabled={detailDraft.blocks.length === 1} onClick={() => setDetailDraft((current) => ({ ...current, blocks: removeDetailPageBlock(current.blocks, block.id) }))}>删除</button>
                    </div>
                  </div>
                  {block.asset && <img alt={block.title} className="mb-3 max-h-48 w-full rounded-lg object-cover" src={block.asset} />}
                  <div className="grid gap-3">
                    <Field label="模块标题" onChange={(value) => setDetailDraft((current) => ({ ...current, blocks: updateDetailPageBlock(current.blocks, block.id, { title: value }) }))} value={block.title} />
                    <label>
                      <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">模块内容</span>
                      <textarea
                        className="min-h-24 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        onChange={(event) => setDetailDraft((current) => ({ ...current, blocks: updateDetailPageBlock(current.blocks, block.id, { body: event.target.value }) }))}
                        value={block.body}
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="surface-panel p-5">
            <div className="mb-3 text-sm font-black uppercase tracking-widest text-slate-500">预览与素材复用</div>
            <div className="mb-4 rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs font-semibold leading-6 text-slate-500">
              当前详情页共 <span className="mono-value text-slate-900">{detailDraft.blocks.length}</span> 个图文模块，关联素材 <span className="mono-value text-slate-900">{selected.assetCount}</span> 个，最近编辑于 <span className="mono-value text-slate-900">{selected.updatedAt}</span>。当前预览名称为 <span className="text-slate-900">{detailDraft.name}</span>。
            </div>
            <div className="mb-4 space-y-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
              {detailDraft.blocks.map((block) => (
                <div className="rounded-lg border border-slate-200 bg-white p-3" key={`${selected.id}-${block.id}`}>
                  {block.asset && <img alt={block.title} className="mb-3 max-h-40 w-full rounded-lg object-cover" src={block.asset} />}
                  <div className="text-sm font-bold text-slate-900">{block.title}</div>
                  <div className="mt-1 text-xs leading-6 text-slate-500">{block.body}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {relatedAssets.slice(0, 4).map((asset) => (
                <div className="rounded-lg border border-slate-100 p-2" key={asset.id}>
                  <img alt={asset.fileName} className="h-20 w-full rounded object-cover" src={asset.src} />
                  <div className="mt-2 truncate text-xs font-bold text-slate-700">{asset.fileName}</div>
                  <div className="mt-1 mono-value text-[10px] font-bold text-slate-400">引用 {asset.usedBy}</div>
                  <button className="mt-2 rounded border border-slate-200 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-blue-600" onClick={() => reuseAsset(asset.id, asset.fileName)}>复用并插入</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChannelItemBatchEdit({
  channelItemRows,
  navigate,
  routeSearch,
}: {
  channelItemRows: ChannelItem[];
  navigate: NavigateFn;
  routeSearch: string;
}) {
  const inheritedFilters = parseChannelItemListFilters(routeSearch);
  const [filters, setFilters] = useState<BatchTargetFilters>(() => ({
    channel: inheritedFilters.channel,
    product: inheritedFilters.product,
    shelfStatus: inheritedFilters.shelfStatus,
    shop: inheritedFilters.shop,
  }));
  const [editDraft, setEditDraft] = useState<BatchEditDraft>({
    nextShelfStatus: '保持不变',
    priceDelta: 0,
    titleSuffix: '限时活动',
  });
  const [previewed, setPreviewed] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const channels = Array.from(new Set(channelItemRows.map((item) => item.channel)));
  const shops = Array.from(new Set(channelItemRows.map((item) => item.shop)));
  const editableItems = previewed ? previewBatchTargets(channelItemRows, filters) : [];
  const submission = buildBatchEditSubmission(editableItems, editDraft);
  const inheritedSummary = [
    inheritedFilters.channel !== '全部渠道' ? `渠道 ${inheritedFilters.channel}` : '',
    inheritedFilters.shop !== '全部店铺' ? `店铺 ${inheritedFilters.shop}` : '',
    inheritedFilters.shelfStatus !== '全部状态' ? `状态 ${inheritedFilters.shelfStatus === 'online' ? '上架中' : '已下架'}` : '',
    inheritedFilters.product ? `产品 ${inheritedFilters.product}` : '',
  ].filter(Boolean);

  function updateFilter<K extends keyof BatchTargetFilters>(key: K, value: BatchTargetFilters[K]) {
    setFilters((current) => ({ ...current, [key]: value }));
    setPreviewed(false);
    setFeedback(null);
  }

  function updateEditDraft<K extends keyof BatchEditDraft>(key: K, value: BatchEditDraft[K]) {
    setEditDraft((current) => ({ ...current, [key]: value }));
  }

  function handlePreview() {
    setPreviewed(true);
    const targets = previewBatchTargets(channelItemRows, filters);
    setFeedback({
      message: targets.length > 0 ? `预览命中 ${targets.length} 个渠道商品，确认后将批量写入商品字段或库存。` : '当前条件没有命中商品，请缩小或调整筛选范围。',
      tone: targets.length > 0 ? 'info' : 'warning',
    });
  }

  useEffect(() => {
    replaceRouteSearch('/channel-items/batch-edit', buildChannelItemListSearchParams({
      channel: filters.channel,
      product: filters.product,
      shelfStatus: filters.shelfStatus,
      shop: filters.shop,
    }));
  }, [filters]);

  return (
    <div className="space-y-4">
      <PageTitle
        actions={
          <>
            <SecondaryButton onClick={() => navigate('/channel-items/list', buildChannelItemListSearchParams({
              channel: filters.channel,
              product: filters.product,
              shelfStatus: filters.shelfStatus,
              shop: filters.shop,
            }))}>
              返回商品列表
            </SecondaryButton>
            <SecondaryButton onClick={handlePreview}><Search className="mr-1.5" size={14} />预览命中</SecondaryButton>
            <PrimaryButton disabled={!previewed || !submission.allowed} onClick={() => setFeedback({ message: submission.message, tone: 'success' })}><CheckCircle2 className="mr-1.5" size={14} />提交批量修改</PrimaryButton>
          </>
        }
        accent="slate"
        icon={<Hash size={22} />}
        subtitle="支持从商品管理二级菜单直达，也支持从商品列表带当前筛选进入。"
        title="批量修改"
      />
      <InlineFeedback feedback={feedback} />
      <RuleStrip>批量修改本身是商品管理二级菜单直达页面；如果先在商品列表筛选，再进入这里，会自动继承当前筛选范围。</RuleStrip>
      {inheritedSummary.length > 0 && (
        <RuleStrip tone="info">当前已继承列表条件：{inheritedSummary.join(' / ')}。</RuleStrip>
      )}
      <div className="grid gap-4 2xl:grid-cols-[0.85fr_1.15fr]">
        <div className="surface-panel p-5">
          <div className="mb-4 text-sm font-black uppercase tracking-widest text-slate-500">批量条件</div>
          <div className="grid gap-4">
            <label>
              <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">目标渠道</span>
              <select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500" onChange={(event) => updateFilter('channel', event.target.value as BatchTargetFilters['channel'])} value={filters.channel}>
                <option>全部渠道</option>
                {channels.map((channel) => <option key={channel}>{channel}</option>)}
              </select>
            </label>
            <label>
              <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">店铺范围</span>
              <select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500" onChange={(event) => updateFilter('shop', event.target.value)} value={filters.shop}>
                <option>全部店铺</option>
                {shops.map((shop) => <option key={shop}>{shop}</option>)}
              </select>
            </label>
            <label>
              <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">产品范围</span>
              <input className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500" onChange={(event) => updateFilter('product', event.target.value)} placeholder="产品名称 / productId / 标题关键词" value={filters.product} />
            </label>
            <label>
              <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">上下架状态</span>
              <select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500" onChange={(event) => updateFilter('shelfStatus', event.target.value as BatchTargetFilters['shelfStatus'])} value={filters.shelfStatus}>
                <option>全部状态</option>
                <option value="online">上架中</option>
                <option value="offline">已下架</option>
              </select>
            </label>
            <label>
              <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">标题后缀</span>
              <input className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500" onChange={(event) => updateEditDraft('titleSuffix', event.target.value)} value={editDraft.titleSuffix} />
            </label>
            <label>
              <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">价格调整</span>
              <input className="mono-value w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500" onChange={(event) => updateEditDraft('priceDelta', Number(event.target.value))} type="number" value={editDraft.priceDelta} />
            </label>
            <label>
              <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">目标上下架</span>
              <select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500" onChange={(event) => updateEditDraft('nextShelfStatus', event.target.value as BatchEditDraft['nextShelfStatus'])} value={editDraft.nextShelfStatus}>
                <option>保持不变</option>
                <option value="online">上架中</option>
                <option value="offline">已下架</option>
              </select>
            </label>
            <RuleStrip>必须先预览命中范围，再允许提交批量修改；命中范围为空时提交按钮禁用。</RuleStrip>
            {!submission.allowed && previewed && <RuleStrip tone="warning">{submission.message}</RuleStrip>}
          </div>
        </div>
        <div className={`${LIST_PANEL_CLASS} overflow-x-auto`}>
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead className={LIST_HEADER_CLASS}>
              <tr>
                <th className="table-head-cell">渠道商品</th>
                <th className="table-head-cell">渠道 / 店铺</th>
                <th className="table-head-cell">当前售价</th>
                <th className="table-head-cell">状态</th>
              </tr>
            </thead>
            <tbody className={LIST_BODY_CLASS}>
              {editableItems.map((item) => (
                <tr className={LIST_ROW_CLASS} key={item.id}>
                  <td className="table-body-cell">
                    <div className="font-black text-blue-600">{item.title}</div>
                    <ListMeta mono>商品ID {item.itemCode}</ListMeta>
                  </td>
                  <td className="table-body-cell"><ChannelIdentity channel={item.channel} subtitle={item.shop} /></td>
                  <td className="table-body-cell mono-value font-black">¥{item.price.toFixed(2)}</td>
                  <td className="table-body-cell"><ListStatus status={item.shelfStatus} /></td>
                </tr>
              ))}
              {editableItems.length === 0 && (
                <tr>
                  <td className="p-5" colSpan={4}>
                    <EmptyState description="设置批量条件后点击“预览命中”，系统会展示受影响的渠道商品样例。" title="尚未生成预览结果" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function InventoryList({
  inventoryRows,
  navigate,
  routeSearch,
  setInventoryRows,
}: {
  inventoryRows: InventoryItem[];
  navigate: NavigateFn;
  routeSearch: string;
  setInventoryRows: Dispatch<SetStateAction<InventoryItem[]>>;
}) {
  const [filters, setFilters] = useState<InventoryFilters>(() => parseInventoryListFilters(routeSearch));
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const channels = Array.from(new Set(inventoryRows.map((item) => item.channel)));
  const shops = Array.from(new Set(inventoryRows.map((item) => item.shop)));
  const filteredRows = filterInventoryRows(inventoryRows, filters);
  const summary = summarizeInventoryRows(filteredRows);

  function updateFilter<K extends keyof InventoryFilters>(key: K, value: InventoryFilters[K]) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  useEffect(() => {
    replaceRouteSearch('/inventory/list', buildInventoryListSearchParams(filters));
  }, [filters]);

  return (
    <div className="space-y-4">
      <PageTitle
        actions={
          <>
            <SecondaryButton onClick={() => setFilters({ channel: '全部渠道', searchTerm: '', shop: '全部店铺', status: '全部状态' })}>
              <SlidersHorizontal className="mr-1.5" size={14} />
              重置筛选
            </SecondaryButton>
            <PrimaryButton
              color="indigo"
              onClick={() => {
                setInventoryRows((rows) => syncInventoryRows(rows, '刚刚'));
                setFeedback({ message: '所有渠道库存已触发手动同步，异常与待同步状态已刷新为成功。', tone: 'success' });
              }}
            >
              <RefreshCw className="mr-1.5" size={14} />同步所有渠道
            </PrimaryButton>
          </>
        }
        accent="indigo"
        icon={<Database size={22} />}
        subtitle="多渠道库存快照、同步状态和可售库存对账视图。"
        title="库存列表"
      />
      <InlineFeedback feedback={feedback} />
      <RuleStrip tone="info">库存页承担对账与同步反馈，不直接修改商品资料；异常库存通过同步和调整记录追踪。</RuleStrip>
      <div className="flex flex-wrap items-center gap-4">
        <CompactStat color="indigo" label="当前库存行" value={summary.total} />
        <CompactStat color="blue" label="可售库存" value={summary.sellable} />
        <CompactStat color="slate" label="库存总量" value={summary.totalStock} />
        <CompactStat color="red" label="同步异常" value={summary.syncIssues} />
      </div>
      <div className="surface-panel p-4">
        <div className="grid gap-3 md:grid-cols-4">
          <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-indigo-500" onChange={(event) => updateFilter('channel', event.target.value)} value={filters.channel}>
            <option>全部渠道</option>
            {channels.map((channel) => <option key={channel}>{channel}</option>)}
          </select>
          <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-indigo-500" onChange={(event) => updateFilter('shop', event.target.value)} value={filters.shop}>
            <option>全部店铺</option>
            {shops.map((shop) => <option key={shop}>{shop}</option>)}
          </select>
          <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-indigo-500" onChange={(event) => updateFilter('status', event.target.value as InventoryFilters['status'])} value={filters.status}>
            <option>全部状态</option>
            <option value="success">成功</option>
            <option value="syncing">同步中</option>
            <option value="pending">待同步</option>
            <option value="failed">失败</option>
          </select>
          <input className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-indigo-500" onChange={(event) => updateFilter('searchTerm', event.target.value)} placeholder="产品 / SKU / 店铺" value={filters.searchTerm} />
        </div>
      </div>
      <div className={`${LIST_PANEL_CLASS} overflow-x-auto`}>
        <table className="w-full min-w-[980px] border-collapse text-left">
          <thead className={LIST_HEADER_CLASS}>
            <tr>
              <th className="table-head-cell">产品 / SKU</th>
              <th className="table-head-cell">渠道 / 店铺</th>
              <th className="table-head-cell text-center">总库存</th>
              <th className="table-head-cell text-center">可售</th>
              <th className="table-head-cell">同步</th>
              <th className="table-head-cell">更新时间</th>
              <th className="table-head-cell text-right">操作</th>
            </tr>
          </thead>
          <tbody className={LIST_BODY_CLASS}>
            {filteredRows.map((item) => (
              <tr className={LIST_ROW_CLASS} key={item.id}>
                <td className="table-body-cell">
                  <button
                    className="block text-left font-black text-blue-600 transition-colors hover:text-blue-700"
                    onClick={() => navigate('/inventory/detail', { inventoryId: item.id, ...buildInventoryListSearchParams(filters) })}
                  >
                    {item.productName}
                  </button>
                  <ListMeta mono>SKU {item.sku}</ListMeta>
                </td>
                <td className="table-body-cell"><ChannelIdentity channel={item.channel} subtitle={item.shop} /></td>
                <td className="table-body-cell mono-value text-center font-black">{item.total}</td>
                <td className="table-body-cell mono-value text-center font-black text-indigo-600">{item.sellable}</td>
                <td className="table-body-cell"><ListStatus status={item.status} /></td>
                <td className="table-body-cell mono-value text-xs text-slate-400">{item.updatedAt}</td>
                <td className="table-body-cell text-right">
                  <ActionIconButton
                    onClick={() => navigate('/inventory/detail', { inventoryId: item.id, ...buildInventoryListSearchParams(filters) })}
                    title="查看库存详情"
                    tone="indigo"
                  >
                    <ArrowUpRight size={16} />
                  </ActionIconButton>
                </td>
              </tr>
            ))}
            {filteredRows.length === 0 && (
              <tr>
                <td className="p-5" colSpan={7}>
                  <EmptyState description="调整渠道、店铺、同步状态或关键词后重新查询。" title="没有命中库存记录" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InventoryDetail({
  inventoryRows,
  navigate,
  routeSearch,
  setInventoryRows,
}: {
  inventoryRows: InventoryItem[];
  navigate: NavigateFn;
  routeSearch: string;
  setInventoryRows: Dispatch<SetStateAction<InventoryItem[]>>;
}) {
  const item = pickById(inventoryRows, new URLSearchParams(routeSearch).get('inventoryId'));
  const backToListParams = buildInventoryListSearchParams(parseInventoryListFilters(routeSearch));
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  return (
    <div className="space-y-4">
      <PageTitle
        actions={
          <>
            <SecondaryButton onClick={() => navigate('/inventory/list', backToListParams)}>返回库存列表</SecondaryButton>
            <PrimaryButton
              color="indigo"
              onClick={() => {
                setInventoryRows((rows) => rows.map((row) => row.id === item.id ? { ...row, status: 'success', updatedAt: PROTOTYPE_NOW } : row));
                setFeedback({ message: `${item.sku} 已触发单 SKU 同步，结果已回写库存列表。`, tone: 'success' });
              }}
            >
              <RefreshCw className="mr-1.5" size={14} />
              同步当前 SKU
            </PrimaryButton>
          </>
        }
        accent="indigo"
        icon={<Database size={22} />}
        subtitle="列表内容进入的非菜单页，展示单个渠道店铺 SKU 的库存快照。"
        title="库存详情"
      />
      <InlineFeedback feedback={feedback} />
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="surface-panel p-5">
          <div className="mb-4 text-sm font-black uppercase tracking-widest text-slate-500">库存快照</div>
          <div className="grid grid-cols-2 gap-3">
            <MiniMetric label="总库存" value={item.total} />
            <MiniMetric label="可售库存" value={item.sellable} />
            <MiniMetric label="锁定库存" value={item.total - item.sellable} />
            <MiniMetric label="同步状态" value={item.status === 'success' ? '正常' : item.updatedAt} />
          </div>
        </div>
        <div className="surface-panel p-5">
          <div className="mb-4 text-sm font-black uppercase tracking-widest text-slate-500">基础信息</div>
          <div className="grid gap-4 md:grid-cols-2">
            <Info label="产品" value={item.productName} />
            <Info label="SKU" mono value={item.sku} />
            <Info label="渠道" value={item.channel} />
            <Info label="店铺" value={item.shop} />
            <Info label="更新时间" mono value={item.updatedAt} />
            <StatusBadge status={item.status} />
          </div>
        </div>
      </div>
    </div>
  );
}

function InventoryAdjustments() {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [filters, setFilters] = useState<InventoryAdjustmentFilters>({
    direction: '全部类型',
    searchTerm: '',
    status: '全部状态',
  });
  const [draftAdjustment, setDraftAdjustment] = useState<InventoryAdjustmentDraft>({
    direction: '入库',
    productName: 'DK儿童百科全书（彩绘版）',
    quantity: 8,
    reason: '补货入库',
    shop: '杭州旗舰店',
    sku: 'BOOK-001-STD',
  });
  const filteredAdjustments = filterInventoryAdjustments(inventoryAdjustments, filters);
  const draftValidation = validateInventoryAdjustmentDraft(draftAdjustment);

  function updateFilter<K extends keyof InventoryAdjustmentFilters>(key: K, value: InventoryAdjustmentFilters[K]) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function updateDraftAdjustment<K extends keyof InventoryAdjustmentDraft>(key: K, value: InventoryAdjustmentDraft[K]) {
    setDraftAdjustment((current) => ({ ...current, [key]: value }));
  }

  function submitAdjustment() {
    const validation = validateInventoryAdjustmentDraft(draftAdjustment);
    setFeedback({
      message: validation.allowed ? `已提交 ${draftAdjustment.sku} 的${draftAdjustment.direction}调整，数量 ${draftAdjustment.quantity}。` : validation.message,
      tone: validation.allowed ? 'success' : 'warning',
    });
  }

  return (
    <div className="space-y-4">
      <PageTitle
        actions={
          <>
            <SecondaryButton onClick={() => setFilters({ direction: '全部类型', searchTerm: '', status: '全部状态' })}>
              <SlidersHorizontal className="mr-1.5" size={14} />
              重置筛选
            </SecondaryButton>
            <PrimaryButton color="indigo" onClick={() => setFeedback({ message: '已创建库存调整草稿，可在下方表单补充数量和原因后提交。', tone: 'success' })}>
              <Plus className="mr-1.5" size={14} />
              新增调整
            </PrimaryButton>
          </>
        }
        accent="indigo"
        icon={<Boxes size={22} />}
        subtitle="库存管理二级菜单直达，记录库存入库、出库和校正操作。"
        title="库存调整记录"
      />
      <InlineFeedback feedback={feedback} />
      {!draftValidation.allowed && <RuleStrip tone="warning">库存调整草稿待补齐：{draftValidation.missingFields.join('、')}</RuleStrip>}
      <div className="flex flex-wrap items-center gap-4">
        <CompactStat color="indigo" label="当前记录" value={filteredAdjustments.length} />
        <CompactStat color="blue" label="已完成" value={filteredAdjustments.filter((item) => item.status === 'success').length} />
        <CompactStat color="slate" label="待处理" value={filteredAdjustments.filter((item) => item.status === 'pending').length} />
      </div>
      <div className="surface-panel p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="text-sm font-black uppercase tracking-widest text-slate-500">新增调整草稿</div>
          <PrimaryButton color="indigo" onClick={submitAdjustment}>
            <CheckCircle2 className="mr-1.5" size={14} />
            提交调整
          </PrimaryButton>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <label>
            <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">产品</span>
            <input className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-indigo-500" onChange={(event) => updateDraftAdjustment('productName', event.target.value)} value={draftAdjustment.productName} />
          </label>
          <label>
            <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">SKU</span>
            <input className="mono-value w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-indigo-500" onChange={(event) => updateDraftAdjustment('sku', event.target.value)} value={draftAdjustment.sku} />
          </label>
          <label>
            <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">店铺</span>
            <input className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-indigo-500" onChange={(event) => updateDraftAdjustment('shop', event.target.value)} value={draftAdjustment.shop} />
          </label>
          <label>
            <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">类型</span>
            <select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-indigo-500" onChange={(event) => updateDraftAdjustment('direction', event.target.value as InventoryAdjustmentDraft['direction'])} value={draftAdjustment.direction}>
              <option value="入库">入库</option>
              <option value="出库">出库</option>
              <option value="校正">校正</option>
            </select>
          </label>
          <label>
            <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">数量</span>
            <input className="mono-value w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-indigo-500" onChange={(event) => updateDraftAdjustment('quantity', Number(event.target.value))} type="number" value={draftAdjustment.quantity} />
          </label>
          <label>
            <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">原因</span>
            <input className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-indigo-500" onChange={(event) => updateDraftAdjustment('reason', event.target.value)} value={draftAdjustment.reason} />
          </label>
        </div>
      </div>
      <div className="surface-panel p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-indigo-500" onChange={(event) => updateFilter('direction', event.target.value as InventoryAdjustmentFilters['direction'])} value={filters.direction}>
            <option>全部类型</option>
            <option value="入库">入库</option>
            <option value="出库">出库</option>
            <option value="校正">校正</option>
          </select>
          <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-indigo-500" onChange={(event) => updateFilter('status', event.target.value as InventoryAdjustmentFilters['status'])} value={filters.status}>
            <option>全部状态</option>
            <option value="success">成功</option>
            <option value="pending">待处理</option>
          </select>
          <input className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-indigo-500" onChange={(event) => updateFilter('searchTerm', event.target.value)} placeholder="产品 / SKU / 原因 / 操作人" value={filters.searchTerm} />
        </div>
      </div>
      <div className={`${LIST_PANEL_CLASS} overflow-x-auto`}>
        <table className="w-full min-w-[980px] border-collapse text-left">
          <thead className={LIST_HEADER_CLASS}>
            <tr>
              <th className="table-head-cell">产品 / SKU</th>
              <th className="table-head-cell">渠道 / 店铺</th>
              <th className="table-head-cell">类型</th>
              <th className="table-head-cell text-center">数量</th>
              <th className="table-head-cell">原因</th>
              <th className="table-head-cell">状态</th>
              <th className="table-head-cell">时间</th>
            </tr>
          </thead>
          <tbody className={LIST_BODY_CLASS}>
            {filteredAdjustments.map((item) => (
              <tr className={LIST_ROW_CLASS} key={item.id}>
                <td className="table-body-cell">
                  <div className="font-black text-blue-600">{item.productName}</div>
                  <ListMeta mono>SKU {item.sku}</ListMeta>
                </td>
                <td className="table-body-cell"><ChannelIdentity channel={item.channel} subtitle={item.shop} /></td>
                <td className="table-body-cell">{item.direction}</td>
                <td className={`table-body-cell mono-value text-center font-black ${item.quantity < 0 ? 'text-red-500' : 'text-indigo-600'}`}>{item.quantity > 0 ? `+${item.quantity}` : item.quantity}</td>
                <td className="table-body-cell text-slate-500">{item.reason}</td>
                <td className="table-body-cell"><ListStatus label={item.status === 'pending' ? '待处理' : undefined} status={item.status} /></td>
                <td className="table-body-cell mono-value text-xs text-slate-400">{item.createdAt}</td>
              </tr>
            ))}
            {filteredAdjustments.length === 0 && (
              <tr>
                <td className="p-5" colSpan={7}>
                  <EmptyState description="调整类型、状态或关键词后重新查询。" title="没有命中库存调整记录" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MaterialsList({
  channelItemRows,
  detailPageRows,
  materialRows,
  navigate,
  productRows,
  routeSearch,
  setMaterialRows,
}: {
  channelItemRows: ChannelItem[];
  detailPageRows: DetailPage[];
  materialRows: MaterialItem[];
  navigate: NavigateFn;
  productRows: Product[];
  routeSearch: string;
  setMaterialRows: Dispatch<SetStateAction<MaterialItem[]>>;
}) {
  const detailId = new URLSearchParams(routeSearch).get('detailId');
  const presetDetail = detailId ? detailPageRows.find((detail) => detail.id === detailId) : null;
  const presetChannel = presetDetail ? channelItemRows.find((item) => item.id === presetDetail.channelItemId)?.channel ?? '全部渠道' : '全部渠道';
  const [filters, setFilters] = useState<MaterialListFilters>(() => {
    const parsed = parseMaterialListFilters(routeSearch);
    return {
      bindObject: parsed.bindObject || presetDetail?.name || '',
      channel: parsed.channel !== '全部渠道' ? parsed.channel : presetChannel,
      keyword: parsed.keyword,
      type: parsed.type,
    };
  });
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const filteredAssets = filterMaterialRows(materialRows, filters, {
    channelItemRows,
    detailPageRows,
    productRows,
  });
  const productFolders = summarizeMaterialProductFolders(filteredAssets, productRows);

  useEffect(() => {
    if (!presetDetail) return;
    setFilters((current) => ({
      ...current,
      bindObject: current.bindObject || presetDetail.name,
      channel: current.channel === '全部渠道' ? presetChannel : current.channel,
    }));
  }, [presetChannel, presetDetail]);

  useEffect(() => {
    replaceRouteSearch('/materials/list', {
      ...buildMaterialListSearchParams(filters),
      ...(detailId ? { detailId } : {}),
    });
  }, [detailId, filters]);

  return (
    <div className="space-y-4">
      <PageTitle
        actions={
          <PrimaryButton
            onClick={() => {
              setMaterialRows((rows) => [
                {
                  detailPageIds: [],
                  fileName: 'new-detail-banner.jpg',
                  id: `asset-proto-${rows.length + 1}`,
                  productId: 'prod-1',
                  size: '1.4MB',
                  src: '/product-assets/detail-0.jpg',
                  type: '详情图',
                  usedBy: 0,
                },
                ...rows,
              ]);
              setFeedback({ message: '素材已上传到素材库，可被多个详情页复用。', tone: 'success' });
            }}
          >
            <Plus className="mr-1.5" size={14} />上传素材
          </PrimaryButton>
        }
        icon={<Image size={22} />}
        subtitle="素材按产品名称形成文件夹，进入产品文件夹后再按主图、详情图、SKU 图查看图片内容。"
        title="素材列表"
      />
      <InlineFeedback feedback={feedback} />
      <div className="surface-panel p-4">
        <div className="grid gap-3 md:grid-cols-4">
          <input className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500" onChange={(event) => setFilters((current) => ({ ...current, keyword: event.target.value }))} placeholder="产品名称 / 编码 / 文件名" value={filters.keyword} />
          <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500" onChange={(event) => setFilters((current) => ({ ...current, type: event.target.value as MaterialListFilters['type'] }))} value={filters.type}>
            <option>全部类型</option>
            <option value="主图">主图</option>
            <option value="详情图">详情图</option>
            <option value="SKU 图">SKU 图</option>
          </select>
          <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500" onChange={(event) => setFilters((current) => ({ ...current, channel: event.target.value as MaterialListFilters['channel'] }))} value={filters.channel}>
            <option>全部渠道</option>
            {Array.from(new Set(channelItemRows.map((item) => item.channel))).map((channel) => <option key={channel}>{channel}</option>)}
          </select>
          <input className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500" onChange={(event) => setFilters((current) => ({ ...current, bindObject: event.target.value }))} placeholder="引用对象 / 渠道商品 / 详情页" value={filters.bindObject} />
        </div>
        <div className="mt-3">
          <SecondaryButton onClick={() => setFilters({ bindObject: presetDetail?.name ?? '', channel: presetChannel, keyword: '', type: '全部类型' })}><SlidersHorizontal className="mr-1.5" size={14} />重置筛选</SecondaryButton>
        </div>
      </div>
      <div className={`${LIST_PANEL_CLASS} overflow-x-auto`}>
        <table className="w-full min-w-[980px] border-collapse text-left">
          <thead className={LIST_HEADER_CLASS}>
            <tr>
              <th className="table-head-cell">产品文件夹</th>
              <th className="table-head-cell">图片数</th>
              <th className="table-head-cell">主图</th>
              <th className="table-head-cell">详情图</th>
              <th className="table-head-cell">SKU 图</th>
              <th className="table-head-cell">引用次数</th>
              <th className="table-head-cell">预览</th>
              <th className="table-head-cell text-right">操作</th>
            </tr>
          </thead>
          <tbody className={LIST_BODY_CLASS}>
            {productFolders.map((folder) => {
              const folderAssets = filteredAssets.filter((asset) => asset.productId === folder.productId);
              return (
                <tr className={LIST_ROW_CLASS} key={folder.productId}>
                  <td className="table-body-cell">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <FolderOpen size={18} />
                      </div>
                      <div className="min-w-0">
                        <button className="block truncate text-left font-black text-blue-600 transition-colors hover:text-blue-700" onClick={() => navigate('/materials/detail', { productId: folder.productId, ...buildMaterialListSearchParams(filters), ...(detailId ? { detailId } : {}) })}>
                          {folder.productName}
                        </button>
                        <ListMeta mono>{folder.productCode}</ListMeta>
                      </div>
                    </div>
                  </td>
                  <td className="table-body-cell mono-value font-black text-slate-900">{folder.total}</td>
                  <td className="table-body-cell mono-value text-slate-600">{folder.mainImageCount}</td>
                  <td className="table-body-cell mono-value text-slate-600">{folder.detailImageCount}</td>
                  <td className="table-body-cell mono-value text-slate-600">{folder.skuImageCount}</td>
                  <td className="table-body-cell mono-value text-slate-500">{folder.usedBy}</td>
                  <td className="table-body-cell">
                    <div className="flex -space-x-2">
                      {folderAssets.slice(0, 4).map((asset) => (
                        <img alt={asset.fileName} className="h-10 w-10 rounded-lg border-2 border-white object-cover shadow-sm" key={asset.id} src={asset.src} />
                      ))}
                    </div>
                  </td>
                  <td className="table-body-cell text-right">
                    <ActionIconButton
                      onClick={() => navigate('/materials/detail', { productId: folder.productId, ...buildMaterialListSearchParams(filters), ...(detailId ? { detailId } : {}) })}
                      title="进入文件夹"
                    >
                      <ArrowUpRight size={16} />
                    </ActionIconButton>
                  </td>
                </tr>
              );
            })}
            {productFolders.length === 0 && (
              <tr>
                <td className="p-5" colSpan={8}>
                  <EmptyState description="调整素材关键词后重新查询。" title="没有命中产品素材文件夹" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MaterialDetail({
  detailPageRows,
  materialRows,
  navigate,
  productRows,
  routeSearch,
  setMaterialRows,
}: {
  detailPageRows: DetailPage[];
  materialRows: MaterialItem[];
  navigate: NavigateFn;
  productRows: Product[];
  routeSearch: string;
  setDetailPageRows: Dispatch<SetStateAction<DetailPage[]>>;
  setMaterialRows: Dispatch<SetStateAction<MaterialItem[]>>;
}) {
  const query = new URLSearchParams(routeSearch);
  const seedAsset = materialRows.find((row) => row.id === query.get('assetId'));
  const product = pickById(productRows, query.get('productId') ?? seedAsset?.productId ?? null);
  const productAssets = materialRows.filter((asset) => asset.productId === product.id);
  const typeFolders = summarizeMaterialTypeFolders(productAssets);
  const backToListParams = {
    ...buildMaterialListSearchParams(parseMaterialListFilters(routeSearch)),
    ...(query.get('detailId') ? { detailId: query.get('detailId')! } : {}),
  };
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  function getRelatedPages(asset: MaterialItem) {
    return detailPageRows.filter((detail) => asset.detailPageIds.includes(detail.id));
  }

  return (
    <div className="space-y-4">
      <PageTitle
        actions={
          <>
            <SecondaryButton onClick={() => navigate('/materials/list', backToListParams)}>返回素材列表</SecondaryButton>
            <SecondaryButton onClick={() => setFeedback({ message: `产品素材文件夹链接已复制：${product.id}`, tone: 'info' })}><Link2 className="mr-1.5" size={14} />复制文件夹链接</SecondaryButton>
            <PrimaryButton
              onClick={() => {
                setMaterialRows((rows) => [
                  {
                    detailPageIds: [],
                    fileName: `${product.code.toLowerCase()}-sku-${rows.length + 1}.jpg`,
                    id: `asset-proto-${rows.length + 1}`,
                    productId: product.id,
                    size: '720KB',
                    src: '/product-assets/4.jpg',
                    type: 'SKU 图',
                    usedBy: 0,
                  },
                  ...rows,
                ]);
                setFeedback({ message: `已上传到 ${product.name} / SKU 图 文件夹。`, tone: 'success' });
              }}
            >
              <Upload className="mr-1.5" size={14} />
              上传到当前产品
            </PrimaryButton>
          </>
        }
        icon={<Image size={22} />}
        subtitle="按产品文件夹进入后，继续按主图、详情图、SKU 图分文件夹查看图片和引用关系。"
        title={`${product.name} / 素材文件夹`}
      />
      <InlineFeedback feedback={feedback} />
      <div className="grid gap-4 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="surface-panel p-5">
          <img alt={product.name} className="max-h-[440px] w-full rounded-xl object-cover ring-1 ring-slate-200" src={product.cover} />
          <div className="mt-4 grid grid-cols-2 gap-3">
            <MiniMetric label="图片总数" value={productAssets.length} />
            <MiniMetric label="主图" value={typeFolders.find((folder) => folder.type === '主图')?.total ?? 0} />
            <MiniMetric label="详情图" value={typeFolders.find((folder) => folder.type === '详情图')?.total ?? 0} />
            <MiniMetric label="SKU 图" value={typeFolders.find((folder) => folder.type === 'SKU 图')?.total ?? 0} />
          </div>
          <div className="mt-4 grid gap-3">
            <Info label="产品名称" value={product.name} />
            <Info label="产品编码" mono value={product.code} />
            <Info label="标准类目" value={product.category} />
          </div>
        </div>
        <div className="space-y-4">
          {typeFolders.map((folder) => (
            <div className="surface-panel p-5" key={folder.type}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <FolderOpen size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-black uppercase tracking-widest text-slate-500">{folder.type} 文件夹</div>
                    <ListMeta>{folder.total} 张图片，累计引用 {folder.usedBy} 次</ListMeta>
                  </div>
                </div>
                <button className="text-[10px] font-black uppercase tracking-widest text-blue-600" onClick={() => setFeedback({ message: `已定位到 ${product.name} / ${folder.type} 文件夹。`, tone: 'info' })}>
                  打开文件夹
                </button>
              </div>
              {folder.assets.length > 0 ? (
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {folder.assets.map((asset) => {
                    const relatedPages = getRelatedPages(asset);
                    return (
                      <div className="rounded-lg border border-slate-100 bg-slate-50 p-3" key={asset.id}>
                        <img alt={asset.fileName} className="h-36 w-full rounded-lg object-cover ring-1 ring-slate-200" src={asset.src} />
                        <div className="mt-3 flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="truncate text-sm font-black text-slate-900">{asset.fileName}</div>
                            <ListMeta mono>{asset.size} / {asset.id}</ListMeta>
                          </div>
                          <span className="rounded bg-white px-2 py-0.5 text-[10px] font-black text-blue-600 ring-1 ring-blue-100">{asset.usedBy} 引用</span>
                        </div>
                        <div className="mt-3 min-h-10 text-xs font-semibold leading-5 text-slate-500">
                          {relatedPages.length > 0 ? relatedPages.slice(0, 2).map((detail) => detail.name).join('、') : '暂无详情页引用'}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-200 pt-3">
                          <button className="rounded border border-slate-200 bg-white px-2 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500" onClick={() => setFeedback({ message: `已下载 ${asset.fileName}。`, tone: 'success' })}>
                            <FileDown className="mr-1 inline" size={12} />
                            下载
                          </button>
                          <button className="rounded border border-slate-200 bg-white px-2 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500" onClick={() => setFeedback({ message: `已复制素材引用：${asset.id}`, tone: 'info' })}>
                            <Copy className="mr-1 inline" size={12} />
                            复制引用
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState description={`当前产品下暂时没有${folder.type}，上传后会显示在这个分文件夹内。`} title={`${folder.type} 文件夹为空`} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StoreConfigList({
  configRows,
  navigate,
  routeSearch,
}: {
  configRows: StoreConfig[];
  navigate: NavigateFn;
  routeSearch: string;
}) {
  const [filters, setFilters] = useState<StoreConfigListFilters>(() => parseStoreConfigListFilters(routeSearch));
  const safeConfigRows = normalizeStoreConfigRows(configRows);
  const channels = Array.from(new Set(safeConfigRows.map((config) => config.channel)));
  const filteredConfigs = filterStoreConfigRows(safeConfigRows, filters);
  const setupSummary = summarizeStoreConfigSetupRows(filteredConfigs);
  const authIssueCount = filteredConfigs.filter((config) => config.authorizationStatus === 'expired').length;

  function updateFilter(key: keyof typeof filters, value: string) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  useEffect(() => {
    replaceRouteSearch('/store-config/list', buildStoreConfigListSearchParams(filters));
  }, [filters]);

  return (
    <div className="space-y-4">
      <PageTitle
        actions={
          <PrimaryButton
            color="violet"
            onClick={() => {
              const nextId = buildPrototypeId('conf');
              navigate('/store-config/detail', { configId: nextId, mode: 'create', ...buildStoreConfigListSearchParams(filters) });
            }}
          >
            <Plus className="mr-1.5" size={14} />
            添加店铺
          </PrimaryButton>
        }
        accent="violet"
        icon={<Store size={22} />}
        subtitle="先添加店铺并完成平台授权，再维护店铺配置。"
        title="店铺管理"
      />
      <div className="flex flex-wrap items-center gap-4">
        <CompactStat color="violet" label="店铺总数" value={setupSummary.total} />
        <CompactStat color="blue" label="已添加店铺" value={setupSummary.storeReady} />
        <CompactStat color="red" label="需重新授权" value={authIssueCount} />
        <CompactStat color="slate" label="待填配置" value={setupSummary.pendingConfig} />
        <CompactStat color="blue" label="配置完成" value={setupSummary.configured} />
      </div>
      <div className="surface-panel p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-violet-500" onChange={(event) => updateFilter('channel', event.target.value)} value={filters.channel}>
            <option>全部渠道</option>
            {channels.map((channel) => <option key={channel}>{channel}</option>)}
          </select>
          <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-violet-500" onChange={(event) => updateFilter('status', event.target.value)} value={filters.status}>
            <option value="全部状态">全部配置状态</option>
            <option value="active">生效中</option>
            <option value="draft">草稿</option>
            <option value="inactive">停用</option>
          </select>
          <input className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-violet-500" onChange={(event) => updateFilter('shop', event.target.value)} placeholder="店铺 / 应用 / 默认类目 / 抖店配置" value={filters.shop} />
        </div>
      </div>
      <div className={`${LIST_PANEL_CLASS} overflow-x-auto`}>
        <table className="w-full min-w-[900px] table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[25%]" />
            <col className="w-[20%]" />
            <col className="w-[15%]" />
            <col className="w-[28%]" />
            <col className="w-[12%]" />
          </colgroup>
          <thead className={LIST_HEADER_CLASS}>
            <tr>
              <th className="table-head-cell">店铺 / 平台</th>
              <th className="table-head-cell">服务与授权</th>
              <th className="table-head-cell">配置状态</th>
              <th className="table-head-cell">店铺配置</th>
              <th className="table-head-cell text-right">更新 / 操作</th>
            </tr>
          </thead>
          <tbody className={LIST_BODY_CLASS}>
            {filteredConfigs.map((config) => {
              const setup = getStoreConfigSetupState(config);
              const autoStatus = getStoreConfigAutoStatus(config);
              const authHint =
                config.authorizationStatus === 'authorized'
                  ? `授权有效期 ${config.authExpiresAt}`
                  : config.authorizationStatus === 'expired'
                    ? `授权有效期 ${config.authExpiresAt}`
                    : '等待平台授权回调';
              const defaultCategory = setup.storeReady && config.defaultCategory !== '待选择默认类目' ? config.defaultCategory : '-';
              const freightTemplate = setup.storeReady && config.freightTemplate.trim().length > 0 ? config.freightTemplate : '-';
              const deliverySla = setup.storeReady && config.deliverySla.trim().length > 0 ? config.deliverySla : '-';
              return (
                <tr className={LIST_ROW_CLASS} key={config.id}>
                  <td className="table-body-cell">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className={`h-6 w-1.5 shrink-0 rounded-full ${getChannelAccentClass(config.channel)}`} />
                      <div className="min-w-0">
                        <button className="block max-w-full truncate text-left font-black text-blue-600 transition-colors hover:text-blue-700" onClick={() => navigate('/store-config/detail', { configId: config.id, ...buildStoreConfigListSearchParams(filters) })}>
                          {config.shop}
                        </button>
                        <div className={`mt-1 truncate ${LIST_META_CLASS}`} title={`${config.channel} / ${authHint}`}>{config.channel} / {authHint}</div>
                      </div>
                    </div>
                  </td>
                  <td className="table-body-cell">
                    <div className="truncate text-xs font-semibold text-slate-500" title={config.appServiceName}>{config.appServiceName}</div>
                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                      <ListStatus compact status={config.appSubscriptionStatus} />
                      <ListStatus compact status={config.authorizationStatus} />
                    </div>
                  </td>
                  <td className="table-body-cell">
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                      <ListStatus compact label={setup.defaultsReady ? '配置完成' : setup.storeReady ? '待填写配置' : '待添加店铺'} status={setup.defaultsReady ? 'active' : setup.storeReady ? 'ready' : 'draft'} />
                      <ListStatus compact status={autoStatus} />
                    </div>
                  </td>
                  <td className="table-body-cell">
                    <div className="truncate font-semibold text-slate-700" title={defaultCategory}>{defaultCategory}</div>
                    <div className={`mt-1 truncate mono-value ${LIST_META_CLASS}`} title={`${config.stockDeductionMethod} / ${config.shippingOrigin} / ${freightTemplate} / ${deliverySla}`}>
                      {config.stockDeductionMethod} / {config.shippingOrigin} / {freightTemplate} / {deliverySla}
                    </div>
                  </td>
                  <td className="table-body-cell text-right">
                    <div className="mono-value text-xs text-slate-400">{config.updatedAt}</div>
                    <div className="mt-2 flex items-center justify-end gap-2">
                      <ActionIconButton
                        onClick={() => navigate('/store-config/detail', { configId: config.id, ...buildStoreConfigListSearchParams(filters) })}
                        title="修改配置"
                        tone="violet"
                      >
                        <Pencil size={16} />
                      </ActionIconButton>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredConfigs.length === 0 && <EmptyState description="调整渠道、状态或店铺关键词后重新查询。" title="没有命中店铺" />}
      </div>
    </div>
  );
}

function StoreConfigDetail({
  configRows,
  navigate,
  routeSearch,
  setConfigRows,
}: {
  configRows: StoreConfig[];
  navigate: NavigateFn;
  routeSearch: string;
  setConfigRows: Dispatch<SetStateAction<StoreConfig[]>>;
}) {
  const safeConfigRows = normalizeStoreConfigRows(configRows);
  const routeQuery = new URLSearchParams(routeSearch);
  const routeConfigId = routeQuery.get('configId');
  const existingConfig = safeConfigRows.find((row) => row.id === routeConfigId);
  const [draftConfigId] = useState(() => routeConfigId ?? buildPrototypeId('conf'));
  const isCreateMode = !existingConfig;
  const config = existingConfig ?? buildDraftStoreConfigRow(draftConfigId, PROTOTYPE_NOW);
  const backToListParams = buildStoreConfigListSearchParams(parseStoreConfigListFilters(routeSearch));
  const [draftConfig, setDraftConfig] = useState<StoreConfigDraft>({
    appServiceName: config.appServiceName,
    appSubscriptionStatus: config.appSubscriptionStatus,
    authExpiresAt: config.authExpiresAt,
    authorizationStatus: config.authorizationStatus,
    channel: config.channel,
    defaultCategory: config.defaultCategory,
    defaultShelfStatus: config.defaultShelfStatus,
    deliverySla: config.deliverySla,
    freightTemplate: config.freightTemplate,
    platformStoreId: config.platformStoreId,
    shippingOrigin: config.shippingOrigin,
    shop: config.shop,
    status: config.status,
    stockDeductionMethod: config.stockDeductionMethod,
  });
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [authRequest, setAuthRequest] = useState<{ callbackUrl: string; link: string; requestId: string } | null>(null);
  const [callbackStatus, setCallbackStatus] = useState<'idle' | 'listening' | 'received'>(() => (config.authorizationStatus === 'authorized' ? 'received' : 'idle'));
  const changed =
    draftConfig.appServiceName !== config.appServiceName ||
    draftConfig.appSubscriptionStatus !== config.appSubscriptionStatus ||
    draftConfig.authExpiresAt !== config.authExpiresAt ||
    draftConfig.authorizationStatus !== config.authorizationStatus ||
    draftConfig.channel !== config.channel ||
    draftConfig.defaultCategory !== config.defaultCategory ||
    draftConfig.defaultShelfStatus !== config.defaultShelfStatus ||
    draftConfig.deliverySla !== config.deliverySla ||
    draftConfig.freightTemplate !== config.freightTemplate ||
    draftConfig.platformStoreId !== config.platformStoreId ||
    draftConfig.shippingOrigin !== config.shippingOrigin ||
    draftConfig.shop !== config.shop ||
    draftConfig.stockDeductionMethod !== config.stockDeductionMethod;
  const setupState = getStoreConfigSetupState(draftConfig);
  const defaultSettingsDisabled = !setupState.storeReady;
  const disabledControlClass = defaultSettingsDisabled ? 'cursor-not-allowed bg-slate-50 text-slate-400' : 'bg-white';
  const storeIdentityLocked = !isCreateMode && isStoreConfigIdentityLocked(config);
  const platformControlClass = storeIdentityLocked ? 'cursor-not-allowed bg-slate-50 text-slate-400' : 'bg-white';
  const authCallbackUrl = typeof window === 'undefined' ? 'https://prototype.local/store-auth/callback' : `${window.location.origin}/store-auth/callback`;
  const freightTemplateOptions = getStoreFreightTemplateOptions(draftConfig.channel);
  const autoStatus = getStoreConfigAutoStatus(draftConfig);

  function updateDraftConfig<K extends keyof typeof draftConfig>(key: K, value: (typeof draftConfig)[K]) {
    setDraftConfig((current) => ({ ...current, [key]: value }));
  }

  useEffect(() => {
    setDraftConfig({
      appServiceName: config.appServiceName,
      appSubscriptionStatus: config.appSubscriptionStatus,
      authExpiresAt: config.authExpiresAt,
      authorizationStatus: config.authorizationStatus,
      channel: config.channel,
      defaultCategory: config.defaultCategory,
      defaultShelfStatus: config.defaultShelfStatus,
      deliverySla: config.deliverySla,
      freightTemplate: config.freightTemplate,
      platformStoreId: config.platformStoreId,
      shippingOrigin: config.shippingOrigin,
      shop: config.shop,
      status: config.status,
      stockDeductionMethod: config.stockDeductionMethod,
    });
    setAuthRequest(null);
    setCallbackStatus(config.authorizationStatus === 'authorized' ? 'received' : 'idle');
  }, [config.appServiceName, config.appSubscriptionStatus, config.authExpiresAt, config.authorizationStatus, config.channel, config.defaultCategory, config.defaultShelfStatus, config.deliverySla, config.freightTemplate, config.id, config.platformStoreId, config.shippingOrigin, config.shop, config.status, config.stockDeductionMethod]);

  return (
    <div className="space-y-4">
      <PageTitle
        actions={
          <>
            <SecondaryButton onClick={() => navigate('/store-config/list', backToListParams)}>返回店铺管理</SecondaryButton>
            <SecondaryButton
              disabled={!changed}
              onClick={() => {
                setDraftConfig({
                  appServiceName: config.appServiceName,
                  appSubscriptionStatus: config.appSubscriptionStatus,
                  authExpiresAt: config.authExpiresAt,
                  authorizationStatus: config.authorizationStatus,
                  channel: config.channel,
                  defaultCategory: config.defaultCategory,
                  defaultShelfStatus: config.defaultShelfStatus,
                  deliverySla: config.deliverySla,
                  freightTemplate: config.freightTemplate,
                  platformStoreId: config.platformStoreId,
                  shippingOrigin: config.shippingOrigin,
                  shop: config.shop,
                  status: config.status,
                  stockDeductionMethod: config.stockDeductionMethod,
                });
                setFeedback({ message: '已恢复为进入页面时的店铺配置。', tone: 'info' });
              }}
            >
              重置修改
            </SecondaryButton>
            {isCreateMode && !setupState.storeReady ? (
              <PrimaryButton color="violet" disabled title="店铺授权完成后才会生成店铺配置记录">
                等待授权
              </PrimaryButton>
            ) : (
              <PrimaryButton
                color="violet"
                onClick={() => {
                  const validation = validateStoreConfigDraft(draftConfig);
                  if (!validation.allowed) {
                    setFeedback({ message: validation.message, tone: 'warning' });
                    return;
                  }
                  if (!changed) {
                    setFeedback({ message: '当前配置未发生变化，无需重复保存。', tone: 'info' });
                    return;
                  }
                  setConfigRows((rows) => saveStoreConfigRows(rows, config.id, { ...draftConfig, status: getStoreConfigAutoStatus(draftConfig) }, PROTOTYPE_NOW));
                  setFeedback({ message: '店铺配置已保存，后续导入商品将使用该店铺配置中的默认类目、库存扣减方式、发货时效、发货地和运费模板。', tone: 'success' });
                }}
              >
                保存配置
              </PrimaryButton>
            )}
          </>
        }
        accent="violet"
        icon={<Store size={22} />}
        subtitle="第一步添加店铺并完成渠道服务应用订购、平台店铺授权；第二步维护店铺配置。"
        title={isCreateMode ? '添加店铺' : '店铺配置详情'}
      />
      <InlineFeedback feedback={feedback} />
      {changed && !isCreateMode && <RuleStrip tone="warning">当前有未保存修改：保存后仅影响后续导入与店铺商品操作，已导入商品不自动回溯。</RuleStrip>}
      {isCreateMode && <RuleStrip>添加店铺时先选择平台并完成授权回调；未完成授权不会生成店铺配置记录。</RuleStrip>}
      <div className="surface-panel p-4">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ['1', '添加店铺', setupState.storeReady ? 'completed' : 'active'],
            ['2', '维护店铺配置', setupState.storeReady ? (setupState.defaultsReady ? 'completed' : 'active') : 'locked'],
            ['3', '保存配置', setupState.defaultsReady ? 'active' : 'locked'],
          ].map(([index, label, state]) => (
            <div className={`rounded-lg border px-3 py-2 text-xs font-bold ${state === 'completed' ? 'border-emerald-100 bg-emerald-50 text-emerald-700' : state === 'active' ? 'border-violet-200 bg-violet-50 text-violet-700' : 'border-slate-100 bg-slate-50 text-slate-400'}`} key={label}>
              <span className="mono-value mr-2">{index}</span>
              {label}
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="surface-panel p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="text-sm font-black uppercase tracking-widest text-slate-500">第一步：{storeIdentityLocked ? '店铺授权' : '添加店铺'}</div>
            <span className="rounded border border-violet-100 bg-violet-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-violet-600">{storeIdentityLocked ? '店铺身份已锁定' : setupState.nextActionLabel}</span>
          </div>
          <div className="grid gap-4">
            <label>
              <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">选择平台</span>
              <select
                className={`w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold outline-none focus:border-violet-500 ${platformControlClass}`}
                disabled={storeIdentityLocked}
                onChange={(event) => {
                  const channel = event.target.value;
                  const shippingOrigin =
                    channel === '抖音'
                      ? '北京市 / 北京市'
                      : channel === '拼多多'
                        ? '上海市 / 上海市'
                        : '浙江省 / 杭州市';
                  setDraftConfig((current) => ({
                    ...current,
                    appServiceName: `${channel}店铺服务应用`,
                    appSubscriptionStatus: 'unsubscribed',
                    authExpiresAt: '待授权',
                    authorizationStatus: 'unauthorized',
                    channel,
                    defaultCategory: '待选择默认类目',
                    freightTemplate: '',
                    platformStoreId: '',
                    shippingOrigin,
                    shop: '待授权店铺',
                    status: 'draft',
                    stockDeductionMethod: channel === '抖音' ? '拍下减库存' : '付款减库存',
                  }));
                  setAuthRequest(null);
                  setCallbackStatus('idle');
                  setFeedback({ message: `已选择 ${channel} 平台。请先在浏览器内登录该平台账号，再生成店铺授权链接。`, tone: 'info' });
                }}
                title={storeIdentityLocked ? '店铺授权完成后不可手动修改平台' : undefined}
                value={draftConfig.channel}
              >
                <option>淘宝</option>
                <option>拼多多</option>
                <option>抖音</option>
                <option>快手</option>
              </select>
            </label>
            <Info label="店铺" value={draftConfig.shop} />
            <Info label="渠道" value={draftConfig.channel} />
            <Info label="服务应用" value={draftConfig.appServiceName} />
            <Info label="授权有效期" value={draftConfig.authExpiresAt} />
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={draftConfig.appSubscriptionStatus} />
              <StatusBadge status={draftConfig.authorizationStatus} />
              <StatusBadge status={autoStatus} />
            </div>
            <div className="flex flex-wrap gap-2">
              <SecondaryButton
                onClick={() => setFeedback({ message: `请先在浏览器内登录 ${draftConfig.channel} 平台账号，再回到本页生成店铺授权链接。`, tone: 'info' })}
              >
                我已登录平台
              </SecondaryButton>
              <SecondaryButton
                onClick={() => {
                  const requestId = buildPrototypeId('auth');
                  const link = buildStoreAuthorizationLink({
                    callbackUrl: authCallbackUrl,
                    channel: draftConfig.channel,
                    configId: config.id,
                    requestId,
                  });
                  setDraftConfig((current) => ({ ...current, ...buildStoreAppSubscriptionPatch(current.channel) }));
                  setAuthRequest({ callbackUrl: authCallbackUrl, link, requestId });
                  setCallbackStatus('listening');
                  setFeedback({ message: storeIdentityLocked ? '已生成重新授权链接，系统开始监听平台回调。' : '已生成携带参数的授权链接，系统开始监听平台回调。', tone: 'success' });
                }}
              >
                {storeIdentityLocked ? '重新授权' : '生成授权链接'}
              </SecondaryButton>
              {authRequest && (
                <a className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50" href={authRequest.link} rel="noreferrer" target="_blank">
                  <ArrowUpRight className="mr-1.5" size={14} />
                  打开授权链接
                </a>
              )}
              <SecondaryButton
                disabled={callbackStatus !== 'listening' || !authRequest}
                onClick={() => {
                  if (!authRequest) return;
                  const platformCode = { 快手: 'KS', 拼多多: 'PDD', 抖音: 'DY', 淘宝: 'TB' }[draftConfig.channel] ?? 'STORE';
                  const requestTail = authRequest.requestId.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(-6);
                  const callback = {
                    authExpiresAt: '2027-04-26',
                    channel: draftConfig.channel,
                    platformStoreId: `${platformCode}-STORE-${requestTail}`,
                    requestId: authRequest.requestId,
                    shopName: draftConfig.shop === '待授权店铺' ? `${draftConfig.channel}授权店铺` : draftConfig.shop,
                  };
                  if (isCreateMode) {
                    const createdConfig = createStoreConfigRowFromAuthorizationCallback(config.id, PROTOTYPE_NOW, callback);
                    setConfigRows((rows) => [createdConfig, ...rows]);
                    setDraftConfig(createdConfig);
                    navigate('/store-config/detail', { configId: createdConfig.id, ...backToListParams });
                  } else {
                    setConfigRows((rows) => completeStoreAuthorizationFromCallback(rows, config.id, callback, PROTOTYPE_NOW));
                    setDraftConfig((current) => ({
                      ...current,
                      appServiceName: storeIdentityLocked ? config.appServiceName : `${callback.channel}店铺服务应用`,
                      appSubscriptionStatus: 'subscribed',
                      authExpiresAt: callback.authExpiresAt,
                      authorizationStatus: 'authorized',
                      channel: storeIdentityLocked ? config.channel : callback.channel,
                      platformStoreId: storeIdentityLocked ? config.platformStoreId : callback.platformStoreId,
                      shop: storeIdentityLocked ? config.shop : callback.shopName,
                    }));
                  }
                  setCallbackStatus('received');
                  setFeedback({ message: isCreateMode ? '已监听到平台回调，店铺添加完成并已生成店铺配置记录。' : storeIdentityLocked ? '已监听到平台回调，店铺重新授权完成。' : '已监听到平台回调，店铺添加完成；刷新列表后可以看到该店铺。', tone: 'success' });
                }}
                title={!authRequest ? '需要先生成授权链接' : callbackStatus !== 'listening' ? '当前未处于监听回调状态' : undefined}
              >
                模拟收到平台回调
              </SecondaryButton>
            </div>
            {authRequest && (
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs font-semibold leading-6 text-slate-500">
                <div>授权请求已发起，回调监听中。</div>
                <div className="mono-value mt-2 break-all text-slate-900">state={authRequest.requestId}</div>
                <div className="mono-value mt-1 break-all text-slate-900">redirectUri={authRequest.callbackUrl}</div>
              </div>
            )}
            {callbackStatus === 'received' && (
              <SecondaryButton onClick={() => navigate('/store-config/list', backToListParams)}>
                刷新查看店铺
              </SecondaryButton>
            )}
            <RuleStrip>授权链接会携带平台、店铺配置 ID、state 和回调地址；平台店铺 ID 和授权凭证由系统内部记录，不在用户端明文展示。</RuleStrip>
          </div>
        </div>
        <div className="surface-panel p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="text-sm font-black uppercase tracking-widest text-slate-500">第二步：维护店铺配置</div>
            {!setupState.storeReady && <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-slate-400">需先添加店铺</span>}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label>
              <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">默认类目</span>
              <select className={`w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold outline-none focus:border-violet-500 ${disabledControlClass}`} disabled={defaultSettingsDisabled} onChange={(event) => updateDraftConfig('defaultCategory', event.target.value)} value={draftConfig.defaultCategory}>
                <option>待选择默认类目</option>
                <option>标准图书 / 少儿百科</option>
                <option>标准图书 / 儿童文学</option>
                <option>标准图书 / 科幻文学</option>
                <option>标准图书 / 神话传说</option>
              </select>
            </label>
            <label>
              <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">默认上下架状态</span>
              <select className={`w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold outline-none focus:border-violet-500 ${disabledControlClass}`} disabled={defaultSettingsDisabled} onChange={(event) => updateDraftConfig('defaultShelfStatus', event.target.value as ShelfStatus)} value={draftConfig.defaultShelfStatus}>
                <option value="online">上架中</option>
                <option value="offline">已下架</option>
              </select>
            </label>
            <label>
              <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">库存扣减方式 *</span>
              <select className={`w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold outline-none focus:border-violet-500 ${disabledControlClass}`} disabled={defaultSettingsDisabled} onChange={(event) => updateDraftConfig('stockDeductionMethod', event.target.value)} value={draftConfig.stockDeductionMethod}>
                {STORE_STOCK_DEDUCTION_OPTIONS.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label>
              <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">发货时效 *</span>
              <select className={`w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold outline-none focus:border-violet-500 ${disabledControlClass}`} disabled={defaultSettingsDisabled} onChange={(event) => updateDraftConfig('deliverySla', event.target.value)} value={draftConfig.deliverySla}>
                <option>24 小时内发货</option>
                <option>48 小时内发货</option>
                <option>72 小时内发货</option>
              </select>
            </label>
            <label>
              <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">发货地省市 *</span>
              <select className={`w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold outline-none focus:border-violet-500 ${disabledControlClass}`} disabled={defaultSettingsDisabled} onChange={(event) => updateDraftConfig('shippingOrigin', event.target.value)} value={draftConfig.shippingOrigin}>
                {STORE_SHIPPING_ORIGIN_OPTIONS.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label>
              <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">运费模板 *</span>
              <select className={`mono-value w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold outline-none focus:border-violet-500 ${disabledControlClass}`} disabled={defaultSettingsDisabled} onChange={(event) => updateDraftConfig('freightTemplate', event.target.value)} value={draftConfig.freightTemplate}>
                <option value="">请选择运费模板</option>
                {freightTemplateOptions.map((template) => <option key={template} value={template}>{template}</option>)}
              </select>
            </label>
            <div className="md:col-span-2 grid gap-3 md:grid-cols-3">
              <MiniMetric label="导入类目" value={draftConfig.defaultCategory} />
              <MiniMetric label="发货地" value={draftConfig.shippingOrigin} />
              <MiniMetric label="系统状态" value={autoStatus === 'active' ? '生效中' : autoStatus === 'inactive' ? '停用' : '草稿'} />
            </div>
            <div className="md:col-span-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs font-semibold leading-6 text-slate-500">
              导入该店铺商品数据时，系统会读取当前店铺配置中的默认类目、默认上下架状态、库存扣减方式、发货时效、发货地省市和运费模板。类目映射和属性值映射仍由管理端统一治理。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomerList({
  customerRows,
  customerUserRows,
  navigate,
  searchTerm,
  setCustomerRows,
}: {
  customerRows: Customer[];
  customerUserRows: CustomerUser[];
  navigate: NavigateFn;
  searchTerm: string;
  setCustomerRows: Dispatch<SetStateAction<Customer[]>>;
}) {
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | '全部状态'>('全部状态');
  const filtered = filterManagementCustomers(customerRows, { searchTerm, status: statusFilter });
  const summary = summarizeManagementCustomers(filtered);
  const [selectedCustomerId, setSelectedCustomerId] = useState(filtered[0]?.id ?? customerRows[0]?.id ?? '');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const selectedCustomer = filtered.find((customer) => customer.id === selectedCustomerId) ?? filtered[0] ?? customerRows[0]!;
  const selectedCustomerAttributeMappings = managementAttributeMappings.filter((mapping) => mapping.customerId === selectedCustomer.id);
  const selectedCustomerUsers = customerUserRows.filter((user) => user.customerId === selectedCustomer.id);
  const selectClass = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10';
  return (
    <div className="space-y-4">
      <PageTitle
        actions={
          <PrimaryButton onClick={() => navigate('/management/customers/detail', { mode: 'create' })}>
            <Plus className="mr-1.5" size={14} />
            开客户
          </PrimaryButton>
        }
        accent="blue"
        icon={<Store size={22} />}
        subtitle="中台管理端独立治理客户主体，并在客户详情内承接中台用户端用户管理。"
        title="客户管理"
      />
      <InlineFeedback feedback={feedback} />
      <div className="flex flex-wrap items-center gap-4">
        <CompactStat label="客户总数" value={summary.total} />
        <CompactStat color="indigo" label="启用客户" value={summary.enabled} />
        <CompactStat color="slate" label="停用客户" value={summary.disabled} />
        <CompactStat color="violet" label="商户用户" value={customerUserRows.length} />
      </div>
      <div className="surface-panel p-5">
        <div className="mb-4 text-sm font-black uppercase tracking-widest text-slate-500">筛选区</div>
        <div className="grid gap-4 md:grid-cols-[1fr_1fr] xl:grid-cols-[1fr_1fr_1.2fr]">
          <label>
            <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">客户状态</span>
            <select className={selectClass} onChange={(event) => setStatusFilter(event.target.value as CustomerStatus | '全部状态')} value={statusFilter}>
              <option value="全部状态">全部状态</option>
              <option value="enabled">启用</option>
              <option value="disabled">停用</option>
            </select>
          </label>
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs font-semibold leading-6 text-slate-500">
            当前搜索同时匹配客户名称、客户编码和备注。启停用客户时，需要同步提示客户下用户和属性值映射的影响范围。
          </div>
        </div>
      </div>
      <div className="grid gap-4 2xl:grid-cols-[1.15fr_0.85fr]">
        <div className={`${LIST_PANEL_CLASS} overflow-x-auto`}>
          <table className="w-full min-w-[920px] border-collapse text-left">
            <thead className={LIST_HEADER_CLASS}>
              <tr>
                <th className="table-head-cell">客户主体</th>
                <th className="table-head-cell">店铺数</th>
                <th className="table-head-cell">用户数</th>
                <th className="table-head-cell">状态</th>
                <th className="table-head-cell">更新时间</th>
                <th className="table-head-cell text-right">操作</th>
              </tr>
            </thead>
            <tbody className={LIST_BODY_CLASS}>
              {filtered.map((customer) => (
                <tr
                  className={`cursor-pointer ${customer.id === selectedCustomer.id ? 'bg-blue-50/70' : 'hover:bg-slate-50/80'}`}
                  key={customer.id}
                  onClick={() => setSelectedCustomerId(customer.id)}
                >
                  <td className="table-body-cell">
                    <div className="font-black text-blue-600">{customer.name}</div>
                    <ListMeta mono>{customer.code}</ListMeta>
                  </td>
                  <td className="table-body-cell mono-value font-black">{customer.shopCount}</td>
                  <td className="table-body-cell mono-value font-black">{customer.userCount}</td>
                  <td className="table-body-cell"><ListStatus status={customer.status} /></td>
                  <td className="table-body-cell mono-value text-xs text-slate-400">{customer.updatedAt}</td>
                  <td className="table-body-cell text-right">
                    <ActionIconButton
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate('/management/customers/detail', { customerId: customer.id });
                      }}
                      title="查看客户详情"
                    >
                      <ArrowUpRight size={16} />
                    </ActionIconButton>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td className="p-5" colSpan={6}>
                    <EmptyState description="当前搜索或状态条件下没有命中客户主体。" title="没有命中客户" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="space-y-4">
          <div className="surface-panel p-5">
            <div className="mb-3 text-sm font-black uppercase tracking-widest text-slate-500">动作区</div>
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">当前选中</div>
                <div className="mt-2 text-sm font-bold text-slate-900">{selectedCustomer.name}</div>
                <div className="mono-value mt-1 text-xs text-slate-400">{selectedCustomer.code}</div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <StatusBadge status={selectedCustomer.status} />
                  <span className="text-xs font-semibold text-slate-500">{selectedCustomer.shopCount} 个店铺</span>
                </div>
              </div>
              <div className="grid gap-3">
                <PrimaryButton onClick={() => navigate('/management/customers/detail', { customerId: selectedCustomer.id })}>查看详情</PrimaryButton>
                <SecondaryButton onClick={() => navigate('/management/customers/detail', { customerId: selectedCustomer.id })}>编辑客户</SecondaryButton>
                <SecondaryButton
                  onClick={() => {
                    const nextStatus = selectedCustomer.status === 'enabled' ? 'disabled' : 'enabled';
                    setCustomerRows((current) =>
                      current.map((row) =>
                        row.id === selectedCustomer.id
                          ? {
                              ...row,
                              status: nextStatus,
                              updatedAt: PROTOTYPE_NOW,
                            }
                          : row,
                      ),
                    );
                    setFeedback({
                      message:
                        nextStatus === 'disabled'
                          ? `客户 ${selectedCustomer.name} 停用后，${selectedCustomerUsers.length} 个中台用户端用户和 ${selectedCustomerAttributeMappings.length} 条属性值映射进入只读或不可用状态；类目映射为平台全局规则，不按客户隔离。`
                          : `客户 ${selectedCustomer.name} 已恢复启用，可继续开通中台用户端用户并维护治理规则。`,
                      tone: nextStatus === 'disabled' ? 'warning' : 'success',
                    });
                  }}
                >
                  {selectedCustomer.status === 'enabled' ? '停用客户' : '启用客户'}
                </SecondaryButton>
              </div>
            </div>
          </div>
          <div className="surface-panel p-5">
            <div className="mb-3 text-sm font-black uppercase tracking-widest text-slate-500">客户影响范围</div>
            <div className="grid gap-4 md:grid-cols-2">
              <Info label="中台用户端用户" value={`${selectedCustomerUsers.length} 个`} />
              <Info label="类目映射" value="平台全局" />
              <Info label="属性值映射" value={`${selectedCustomerAttributeMappings.length} 条`} />
              <Info label="最近更新时间" mono value={selectedCustomer.updatedAt} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomerDetail({
  customerRows,
  customerUserRows,
  navigate,
  routeSearch,
  setCustomerRows,
  setCustomerUserRows,
}: {
  customerRows: Customer[];
  customerUserRows: CustomerUser[];
  navigate: NavigateFn;
  routeSearch: string;
  setCustomerRows: Dispatch<SetStateAction<Customer[]>>;
  setCustomerUserRows: Dispatch<SetStateAction<CustomerUser[]>>;
}) {
  const query = new URLSearchParams(routeSearch);
  const isCreate = query.get('mode') === 'create';
  const sourceCustomer = query.get('customerId') ? pickById(customerRows, query.get('customerId')) : customerRows[0]!;
  const [customerDraft, setCustomerDraft] = useState<Customer>(() => (isCreate ? buildDraftCustomer(sourceCustomer) : { ...sourceCustomer }));
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [passwordPreview, setPasswordPreview] = useState<string | null>(null);
  const scopedUsers = isCreate ? [] : customerUserRows.filter((user) => user.customerId === customerDraft.id);
  const [selectedCustomerUserId, setSelectedCustomerUserId] = useState(scopedUsers[0]?.id ?? 'draft-customer-user');
  const [userDraft, setUserDraft] = useState<CustomerUser>(() => (scopedUsers[0] ? { ...scopedUsers[0] } : buildDraftCustomerUser(customerDraft.id)));
  const selectedUser = selectedCustomerUserId === 'draft-customer-user' ? null : scopedUsers.find((user) => user.id === selectedCustomerUserId) ?? null;
  const createGuard = getCustomerUserCreateGuard(customerDraft.status);
  const customerValidation = validateManagementCustomerDraft(customerDraft);
  const codeGuard = getCustomerCodeConflictGuard({
    candidateCode: customerDraft.code,
    currentCustomerId: isCreate ? undefined : customerDraft.id,
    customers: customerRows.map((row) => ({ code: row.code, id: row.id })),
  });
  const usernameGuard = getCustomerUserUsernameConflictGuard({
    candidateCustomerId: customerDraft.id,
    candidateUsername: userDraft.username,
    currentCustomerUserId: selectedUser?.id,
    users: customerUserRows.map((user) => ({ customerId: user.customerId, id: user.id, username: user.username })),
  });
  const customerUserValidation = validateManagementCustomerUserDraft(userDraft);
  const customerAttributeMappings = managementAttributeMappings.filter((mapping) => mapping.customerId === customerDraft.id);

  function syncCustomerUserDraft(user: CustomerUser) {
    setSelectedCustomerUserId(user.id);
    setUserDraft({ ...user });
    setPasswordPreview(null);
  }

  function startCustomerUserCreate() {
    if (isCreate || !createGuard.allowed) return;
    setSelectedCustomerUserId('draft-customer-user');
    setUserDraft(buildDraftCustomerUser(customerDraft.id));
    setPasswordPreview(null);
    setFeedback({ message: `已在 ${customerDraft.name || '当前客户'} 下创建用户草稿，待补充登录账号、角色和联系方式。`, tone: 'info' });
  }

  function saveCustomer() {
    if (!codeGuard.allowed) return;
    if (!customerValidation.allowed) return;
    if (isCreate) {
      const savedCustomer: Customer = {
        ...customerDraft,
        id: buildPrototypeId('customer'),
        updatedAt: PROTOTYPE_NOW,
        userCount: 0,
      };
      setCustomerRows((current) => [savedCustomer, ...current]);
      setFeedback({ message: '客户主体已创建，接下来可以在该客户下开通中台用户端用户。', tone: 'success' });
      navigate('/management/customers/detail', { customerId: savedCustomer.id });
      return;
    }

    setCustomerRows((current) =>
      current.map((row) =>
        row.id === customerDraft.id
          ? {
              ...row,
              ...customerDraft,
              updatedAt: PROTOTYPE_NOW,
            }
          : row,
      ),
    );
    setCustomerDraft((current) => ({ ...current, updatedAt: PROTOTYPE_NOW }));
    setFeedback({ message: '客户主体信息已保存，客户隔离边界保持不变。', tone: 'success' });
  }

  function saveCustomerUser() {
    if (!usernameGuard.allowed) return;
    if (!customerUserValidation.allowed) return;
    if (selectedCustomerUserId === 'draft-customer-user' || !selectedUser) {
      const savedUser: CustomerUser = {
        ...userDraft,
        customerId: customerDraft.id,
        createdAt: PROTOTYPE_NOW,
        id: buildPrototypeId('cust-user'),
        lastLogin: '未登录',
        updatedAt: PROTOTYPE_NOW,
      };
      setCustomerUserRows((current) => [savedUser, ...current]);
      setCustomerRows((current) =>
        current.map((row) =>
          row.id === customerDraft.id
            ? {
                ...row,
                updatedAt: PROTOTYPE_NOW,
                userCount: row.userCount + 1,
              }
            : row,
        ),
      );
      setCustomerDraft((current) => ({ ...current, updatedAt: PROTOTYPE_NOW, userCount: current.userCount + 1 }));
      setSelectedCustomerUserId(savedUser.id);
      setUserDraft(savedUser);
      setFeedback({ message: `已为 ${customerDraft.name} 新增中台用户端用户 ${savedUser.name || savedUser.username || '未命名账号'}。`, tone: 'success' });
      return;
    }

    const savedUser: CustomerUser = {
      ...selectedUser,
      ...userDraft,
      customerId: customerDraft.id,
      id: selectedUser.id,
      updatedAt: PROTOTYPE_NOW,
    };
    setCustomerUserRows((current) => current.map((row) => (row.id === savedUser.id ? savedUser : row)));
    setCustomerRows((current) => current.map((row) => (row.id === customerDraft.id ? { ...row, updatedAt: PROTOTYPE_NOW } : row)));
    setCustomerDraft((current) => ({ ...current, updatedAt: PROTOTYPE_NOW }));
    setUserDraft(savedUser);
    setFeedback({ message: `用户 ${savedUser.name || savedUser.username} 的账号资料已保存。`, tone: 'success' });
  }

  function toggleCustomerUserStatus() {
    const targetUserId = selectedUser?.id ?? (selectedCustomerUserId !== 'draft-customer-user' ? selectedCustomerUserId : null);
    if (!targetUserId) return;
    const currentStatus = userDraft.status;
    const nextStatus: UserStatus = currentStatus === 'enabled' ? 'disabled' : 'enabled';
    const savedUser: CustomerUser = { ...userDraft, id: targetUserId, customerId: customerDraft.id, status: nextStatus, updatedAt: PROTOTYPE_NOW };
    setCustomerUserRows((current) => current.map((row) => (row.id === targetUserId ? { ...row, status: nextStatus, updatedAt: PROTOTYPE_NOW } : row)));
    setCustomerRows((current) => current.map((row) => (row.id === customerDraft.id ? { ...row, updatedAt: PROTOTYPE_NOW } : row)));
    setCustomerDraft((current) => ({ ...current, updatedAt: PROTOTYPE_NOW }));
    setUserDraft(savedUser);
    setFeedback({ message: nextStatus === 'disabled' ? `用户 ${savedUser.name || savedUser.username} 已停用。` : `用户 ${savedUser.name || savedUser.username} 已恢复启用。`, tone: 'info' });
  }

  function resetCustomerUserPassword() {
    const temporaryPassword = `TMP-${(userDraft.username || 'new-customer-user').toUpperCase()}`;
    setPasswordPreview(temporaryPassword);
    setFeedback({ message: `已生成 ${userDraft.name || userDraft.username || '当前用户'} 的一次性临时密码。`, tone: 'success' });
  }

  const customerUserPanelVisible = !isCreate && (scopedUsers.length > 0 || selectedCustomerUserId === 'draft-customer-user');

  return (
    <div className="space-y-4">
      <PageTitle
        actions={
          <>
            <SecondaryButton onClick={() => navigate('/management/customers/list')}>返回客户列表</SecondaryButton>
            {!isCreate && <SecondaryButton onClick={() => navigate('/management/category-mappings/list')}>查看类目映射</SecondaryButton>}
            {!isCreate && <SecondaryButton onClick={() => navigate('/management/attribute-mappings/list', { customerId: customerDraft.id })}>查看属性值映射</SecondaryButton>}
            <PrimaryButton disabled={isCreate || !createGuard.allowed} onClick={startCustomerUserCreate} title={isCreate ? '请先保存客户主体，再开通中台用户端用户。' : createGuard.reason}>
              <Plus className="mr-1.5" size={14} />
              开中台用户端用户
            </PrimaryButton>
          </>
        }
        accent="blue"
        icon={<Store size={22} />}
        subtitle="客户详情页承接基础信息和中台用户端用户管理，不拆独立一级菜单。"
        title={isCreate ? '新增客户' : customerDraft.name}
      />
      <InlineFeedback feedback={feedback} />
      {isCreate && <RuleStrip tone="info">当前为新增模式。请先补齐客户名称、客户编码和备注，再进入客户下的用户与治理管理。</RuleStrip>}
      {!customerValidation.allowed && <RuleStrip tone="warning">{customerValidation.message}</RuleStrip>}
      {!codeGuard.allowed && <RuleStrip tone="warning">{codeGuard.reason}</RuleStrip>}
      {!createGuard.allowed && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold text-amber-700">
          {isCreate ? '客户草稿尚未保存，暂不能开通中台用户端用户。' : `${createGuard.reason} 如需继续维护中台用户端用户，请先启用当前客户。`}
        </div>
      )}
      <div className="grid gap-4 xl:grid-cols-[0.78fr_1.22fr]">
        <div className="space-y-4">
          <div className="surface-panel p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-black uppercase tracking-widest text-slate-500">头部摘要区</div>
                <p className="mt-1 text-xs font-medium text-slate-500">维护客户主体和当前客户下的业务账号边界。</p>
              </div>
              <StatusBadge status={customerDraft.status} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <MiniMetric label="客户编码" value={customerDraft.code || '待填写'} />
              <MiniMetric label="店铺数" value={customerDraft.shopCount} />
              <MiniMetric label="商户用户数" value={scopedUsers.length} />
              <MiniMetric label="更新时间" value={customerDraft.updatedAt} />
            </div>
          </div>
          <div className="surface-panel p-5">
            <div className="mb-4 text-sm font-black uppercase tracking-widest text-slate-500">基础信息区</div>
            <div className="grid gap-4">
              <Field label="客户名称" onChange={(value) => setCustomerDraft((current) => ({ ...current, name: value }))} value={customerDraft.name} />
              <Field label="客户编码" mono onChange={(value) => setCustomerDraft((current) => ({ ...current, code: value }))} value={customerDraft.code} />
              <SelectField
                label="客户状态"
                onChange={(value) => setCustomerDraft((current) => ({ ...current, status: value as CustomerStatus }))}
                options={[
                  { label: '启用', value: 'enabled' },
                  { label: '停用', value: 'disabled' },
                ]}
                value={customerDraft.status}
              />
              <TextAreaField label="备注" onChange={(value) => setCustomerDraft((current) => ({ ...current, note: value }))} value={customerDraft.note} />
              <div className="flex flex-wrap gap-2">
                <SecondaryButton
                  onClick={() =>
                    setCustomerDraft((current) => ({
                      ...current,
                      status: current.status === 'enabled' ? 'disabled' : 'enabled',
                    }))
                  }
                >
                  {customerDraft.status === 'enabled' ? '切换为停用' : '切换为启用'}
                </SecondaryButton>
                <PrimaryButton disabled={!customerValidation.allowed || !codeGuard.allowed} title={!customerValidation.allowed ? customerValidation.message : codeGuard.reason} onClick={saveCustomer}>
                  保存客户信息
                </PrimaryButton>
              </div>
            </div>
          </div>
          <div className="surface-panel p-5">
            <div className="mb-4 text-sm font-black uppercase tracking-widest text-slate-500">关联统计区</div>
            <div className="grid grid-cols-3 gap-3">
              <button className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50/40" disabled={isCreate} onClick={() => navigate('/management/category-mappings/list')}>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">类目映射</div>
                <div className="mt-2 text-sm font-black text-slate-900">平台全局</div>
              </button>
              <button className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-left transition hover:border-violet-200 hover:bg-violet-50/40" disabled={isCreate} onClick={() => navigate('/management/attribute-mappings/list', { customerId: customerDraft.id })}>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">属性值映射</div>
                <div className="mono-value mt-2 text-lg font-black text-slate-900">{customerAttributeMappings.length}</div>
              </button>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">中台用户端用户</div>
                <div className="mono-value mt-2 text-lg font-black text-slate-900">{scopedUsers.length}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="surface-panel p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-black uppercase tracking-widest text-slate-500">中台用户端用户页签</div>
                <p className="mt-1 text-xs font-medium text-slate-500">当前客户上下文内查看、开通、编辑、启停用和重置密码。</p>
              </div>
              <SecondaryButton disabled={isCreate || !createGuard.allowed} onClick={startCustomerUserCreate} title={isCreate ? '请先保存客户主体，再开通中台用户端用户。' : createGuard.reason}>
                <Plus className="mr-1.5" size={14} />
                开用户
              </SecondaryButton>
            </div>
            {scopedUsers.length === 0 && (isCreate || selectedCustomerUserId !== 'draft-customer-user') ? (
              <EmptyState
                description={isCreate ? '请先保存客户主体，再进入当前客户上下文开通中台用户端用户。' : '当前客户下还没有中台用户端用户，可直接从右上角开用户。'}
                title={isCreate ? '先保存客户后再开用户' : '当前没有中台用户端用户'}
              />
            ) : (
              <div className="-mx-5 -mb-5 overflow-x-auto border-t border-slate-200">
              <table className="w-full min-w-[820px] border-collapse text-left">
                <thead className={LIST_HEADER_CLASS}>
                  <tr>
                    <th className="table-head-cell">账号</th>
                    <th className="table-head-cell">角色</th>
                    <th className="table-head-cell">手机号</th>
                    <th className="table-head-cell">状态</th>
                    <th className="table-head-cell">最后登录</th>
                    <th className="table-head-cell text-right">操作</th>
                  </tr>
                </thead>
                <tbody className={LIST_BODY_CLASS}>
                  {scopedUsers.map((user) => (
                    <tr className={`cursor-pointer ${user.id === selectedUser?.id ? 'bg-blue-50/70' : 'hover:bg-slate-50/80'}`} key={user.id} onClick={() => syncCustomerUserDraft(user)}>
                      <td className="table-body-cell">
                        <div className="font-black text-blue-600">{user.name}</div>
                        <ListMeta mono>{user.username}</ListMeta>
                      </td>
                      <td className="table-body-cell">{user.role}</td>
                      <td className="table-body-cell mono-value text-xs">{user.phone}</td>
                      <td className="table-body-cell"><ListStatus status={user.status} /></td>
                      <td className="table-body-cell mono-value text-xs text-slate-400">{user.lastLogin}</td>
                      <td className="table-body-cell text-right">
                        <div className="flex items-center justify-end gap-2">
                          <ActionIconButton
                            onClick={(event) => {
                              event.stopPropagation();
                              syncCustomerUserDraft(user);
                              setFeedback({ message: `已切换到 ${user.name} 的编辑态。`, tone: 'info' });
                            }}
                            title="编辑用户"
                          >
                            <Pencil size={16} />
                          </ActionIconButton>
                          <ActionIconButton
                            onClick={(event) => {
                              event.stopPropagation();
                              syncCustomerUserDraft(user);
                              setPasswordPreview(`TMP-${user.username.toUpperCase()}`);
                              setFeedback({ message: `已生成 ${user.name} 的一次性临时密码。`, tone: 'success' });
                            }}
                            title="重置密码"
                            tone="slate"
                          >
                            <RefreshCw size={16} />
                          </ActionIconButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            )}
          </div>
          {customerUserPanelVisible && (
            <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="surface-panel p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">{selectedCustomerUserId === 'draft-customer-user' ? '新增中台用户端用户' : userDraft.name || '未命名账号'}</div>
                    <ListMeta mono>{selectedCustomerUserId === 'draft-customer-user' ? 'draft-customer-user' : userDraft.id}</ListMeta>
                  </div>
                  <StatusBadge status={userDraft.status} />
                </div>
                {!customerUserValidation.allowed && <RuleStrip tone="warning">{customerUserValidation.message}</RuleStrip>}
                {!usernameGuard.allowed && <RuleStrip tone="warning">{usernameGuard.reason}</RuleStrip>}
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="登录账号" mono onChange={(value) => setUserDraft((current) => ({ ...current, username: value }))} value={userDraft.username} />
                  <Field label="用户姓名" onChange={(value) => setUserDraft((current) => ({ ...current, name: value }))} value={userDraft.name} />
                  <Field label="手机号" mono onChange={(value) => setUserDraft((current) => ({ ...current, phone: value }))} value={userDraft.phone} />
                  <Field label="邮箱" onChange={(value) => setUserDraft((current) => ({ ...current, email: value }))} value={userDraft.email} />
                  <SelectField
                    label="角色"
                    onChange={(value) => setUserDraft((current) => ({ ...current, role: value as CustomerUser['role'] }))}
                    options={[
                      { label: '商户管理员', value: '商户管理员' },
                      { label: '商户操作员', value: '商户操作员' },
                      { label: '商户只读用户', value: '商户只读用户' },
                    ]}
                    value={userDraft.role}
                  />
                  <SelectField
                    label="账号状态"
                    onChange={(value) => setUserDraft((current) => ({ ...current, status: value as UserStatus }))}
                    options={[
                      { label: '启用', value: 'enabled' },
                      { label: '停用', value: 'disabled' },
                    ]}
                    value={userDraft.status}
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <PrimaryButton disabled={!customerUserValidation.allowed || !usernameGuard.allowed} title={!customerUserValidation.allowed ? customerUserValidation.message : usernameGuard.reason} onClick={saveCustomerUser}>
                    保存用户信息
                  </PrimaryButton>
                  <SecondaryButton disabled={selectedCustomerUserId === 'draft-customer-user'} onClick={toggleCustomerUserStatus} title={selectedCustomerUserId === 'draft-customer-user' ? '请先保存用户，再执行启停用。' : undefined}>
                    {userDraft.status === 'enabled' ? '停用用户' : '启用用户'}
                  </SecondaryButton>
                  <SecondaryButton onClick={resetCustomerUserPassword}>重置密码</SecondaryButton>
                </div>
              </div>
              <div className="space-y-4">
                <div className="surface-panel p-5">
                  <div className="mb-3 text-sm font-black uppercase tracking-widest text-slate-500">状态与反馈</div>
                  <div className="space-y-3 text-xs font-semibold leading-6 text-slate-500">
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                      中台用户端用户必须归属当前客户，保存和重置密码都只在当前 <span className="mono-value text-slate-900">customer_id={customerDraft.id}</span> 上下文内执行。
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                      如果客户被停用，页面会阻止新增用户，同时保留现有用户查看与审计追踪。
                    </div>
                  </div>
                </div>
                <div className="surface-panel p-5">
                  <div className="mb-3 text-sm font-black uppercase tracking-widest text-slate-500">密码重置反馈</div>
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-xs font-semibold leading-6 text-emerald-700">
                    已为 <span className="font-black">{userDraft.name || userDraft.username || '当前用户'}</span> 生成一次性临时密码：
                    <span className="mono-value ml-2 text-emerald-900">{passwordPreview ?? `TMP-${(userDraft.username || 'new-customer-user').toUpperCase()}`}</span>
                  </div>
                  <div className="mt-3 text-[10px] font-black uppercase tracking-widest text-slate-400">只展示一次，用于模拟 API-MGMT-CUSTOMER-USER-PASSWORD-POST 反馈。</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CategoryMappingList({ navigate, routeSearch, searchTerm }: { navigate: NavigateFn; routeSearch: string; searchTerm: string }) {
  const query = new URLSearchParams(routeSearch);
  const [channelFilter, setChannelFilter] = useState(query.get('channel') ?? 'all');
  const [statusFilter, setStatusFilter] = useState(query.get('status') ?? 'all');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const baseFiltered = filterManagementCategoryMappings(managementCategoryMappings, {
    searchTerm,
  });
  const filtered = baseFiltered.filter((mapping) => {
    return (
      (channelFilter === 'all' || mapping.channel === channelFilter) &&
      (statusFilter === 'all' || mapping.status === statusFilter)
    );
  });
  const [selectedMappingId, setSelectedMappingId] = useState(filtered[0]?.id ?? managementCategoryMappings[0]?.id ?? '');
  const selectedMapping = filtered.find((mapping) => mapping.id === selectedMappingId) ?? filtered[0] ?? managementCategoryMappings[0]!;
  const summary = summarizeManagementCategoryMappings(filtered);
  const relatedAttributeCount = managementAttributeMappings.filter((mapping) => mapping.mappingId === selectedMapping.id).length;
  const selectClass = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10';

  return (
    <div className="space-y-4">
      <PageTitle
        actions={
          <PrimaryButton
            color="indigo"
            onClick={() =>
              navigate('/management/category-mappings/detail', {
                channel: channelFilter === 'all' ? selectedMapping.channel : channelFilter,
                mode: 'create',
              })
            }
          >
            <Plus className="mr-1.5" size={14} />
            新增类目映射
          </PrimaryButton>
        }
        accent="indigo"
        icon={<Filter size={22} />}
        subtitle="按渠道统一治理渠道类目到中台标准类目的全局映射关系，用户端只读消费治理结果。"
        title="类目映射"
      />
      <InlineFeedback feedback={feedback} />
      <div className="flex flex-wrap items-center gap-4">
        <CompactStat color="indigo" label="当前结果" value={summary.total} />
        <CompactStat color="blue" label="生效映射" value={summary.active} />
        <CompactStat color="slate" label="停用映射" value={summary.inactive} />
      </div>
      <div className="surface-panel p-5">
        <div className="mb-4 text-sm font-black uppercase tracking-widest text-slate-500">筛选区</div>
        <div className="grid gap-4 lg:grid-cols-3">
          <label>
            <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">渠道</span>
            <select className={selectClass} onChange={(event) => setChannelFilter(event.target.value)} value={channelFilter}>
              <option value="all">全部渠道</option>
              {[...new Set(managementCategoryMappings.map((mapping) => mapping.channel))].map((channel) => (
                <option key={channel} value={channel}>
                  {channel}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">状态</span>
            <select className={selectClass} onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}>
              <option value="all">全部状态</option>
              <option value="active">生效中</option>
              <option value="inactive">已停用</option>
            </select>
          </label>
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs font-semibold leading-6 text-slate-500">
            当前搜索会同时匹配渠道类目 ID、渠道类目名称、中台标准类目名称和店铺范围。
          </div>
        </div>
      </div>
      <RuleStrip tone="info">类目映射为平台全局配置，不按用户或客户隔离；同一渠道类目只能保留一条生效映射。</RuleStrip>
      <div className="grid gap-4 2xl:grid-cols-[1.2fr_0.8fr]">
        <div className={`${LIST_PANEL_CLASS} overflow-x-auto`}>
          <table className="w-full min-w-[1080px] border-collapse text-left">
            <thead className={LIST_HEADER_CLASS}>
              <tr>
                <th className="table-head-cell">渠道</th>
                <th className="table-head-cell">渠道类目</th>
                <th className="table-head-cell">标准类目</th>
                <th className="table-head-cell">店铺范围</th>
                <th className="table-head-cell">状态</th>
                <th className="table-head-cell">更新时间</th>
                <th className="table-head-cell text-right">操作</th>
              </tr>
            </thead>
            <tbody className={LIST_BODY_CLASS}>
              {filtered.map((mapping) => {
                const active = selectedMapping.id === mapping.id;
                return (
                  <tr
                    className={`cursor-pointer ${active ? 'bg-indigo-50/60' : 'hover:bg-slate-50/80'}`}
                    key={mapping.id}
                    onClick={() => setSelectedMappingId(mapping.id)}
                  >
                    <td className="table-body-cell">
                      <ChannelIdentity channel={mapping.channel} subtitle="平台全局" />
                    </td>
                    <td className="table-body-cell">
                      <div className="font-black text-blue-600">{mapping.channelCategoryName}</div>
                      <ListMeta mono>{mapping.channelCategoryId}</ListMeta>
                    </td>
                    <td className="table-body-cell">
                      <div className="font-bold text-slate-900">{mapping.standardCategoryName}</div>
                      <ListMeta mono>{mapping.standardCategoryId}</ListMeta>
                    </td>
                    <td className="table-body-cell">{mapping.shopScope}</td>
                    <td className="table-body-cell"><ListStatus status={mapping.status} /></td>
                    <td className="table-body-cell mono-value text-xs text-slate-400">{mapping.updatedAt}</td>
                    <td className="table-body-cell text-right">
                      <div className="flex items-center justify-end gap-2">
                        <ActionIconButton
                          onClick={(event) => {
                            event.stopPropagation();
                            navigate('/management/attribute-mappings/list', {
                              categoryMappingId: mapping.id,
                            });
                          }}
                          title="查看属性值映射"
                          tone="violet"
                        >
                          <Layers size={16} />
                        </ActionIconButton>
                        <ActionIconButton
                          onClick={(event) => {
                            event.stopPropagation();
                            navigate('/management/category-mappings/detail', {
                              channel: mapping.channel,
                              mappingId: mapping.id,
                            });
                          }}
                          title="编辑类目映射"
                          tone="indigo"
                        >
                          <ArrowUpRight size={16} />
                        </ActionIconButton>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td className="p-5" colSpan={7}>
                    <EmptyState description="当前渠道或搜索条件下没有命中类目映射。" title="没有命中类目映射" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="space-y-4">
          <div className="surface-panel p-5">
            <div className="mb-3 text-sm font-black uppercase tracking-widest text-slate-500">动作区</div>
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">当前选中</div>
                <div className="mt-2 text-sm font-bold text-slate-900">{selectedMapping.channelCategoryName}</div>
                <div className="mono-value mt-1 text-xs text-slate-400">{selectedMapping.channelCategoryId}</div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <StatusBadge status={selectedMapping.status} />
                  <span className="text-xs font-semibold text-slate-500">{selectedMapping.channel}</span>
                </div>
              </div>
              <div className="grid gap-3">
                <SecondaryButton
                  onClick={() =>
                    navigate('/management/category-mappings/detail', {
                      channel: selectedMapping.channel,
                      mappingId: selectedMapping.id,
                    })
                  }
                >
                  编辑类目映射
                </SecondaryButton>
                <SecondaryButton
                  onClick={() =>
                    navigate('/management/attribute-mappings/list', {
                      categoryMappingId: selectedMapping.id,
                    })
                  }
                >
                  查看属性值映射
                </SecondaryButton>
                <PrimaryButton
                  color="indigo"
                  onClick={() =>
                    setFeedback({
                      message:
                        selectedMapping.status === 'active'
                          ? `类目映射 ${selectedMapping.channelCategoryId} 已进入停用流程，需同步关注下游 ${relatedAttributeCount} 条属性值映射。`
                          : `类目映射 ${selectedMapping.channelCategoryId} 已恢复生效，用户端可继续读取该治理结果。`,
                      tone: selectedMapping.status === 'active' ? 'warning' : 'success',
                    })
                  }
                >
                  {selectedMapping.status === 'active' ? '停用映射' : '启用映射'}
                </PrimaryButton>
              </div>
            </div>
          </div>
          <div className="surface-panel p-5">
            <div className="mb-3 text-sm font-black uppercase tracking-widest text-slate-500">选中映射摘要</div>
            <div className="grid gap-4 md:grid-cols-2">
              <Info label="标准类目" value={selectedMapping.standardCategoryName} />
              <Info label="店铺范围" value={selectedMapping.shopScope} />
              <Info label="关联属性值映射" value={`${relatedAttributeCount} 条`} />
              <Info label="最近更新时间" mono value={selectedMapping.updatedAt} />
            </div>
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold leading-6 text-amber-700">
              停用类目映射前必须确认下游属性值映射是否还能复用。用户端商品详情页只读消费适配结果，不在该端写规则。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryMappingDetail({ navigate, routeSearch }: { navigate: NavigateFn; routeSearch: string }) {
  const query = new URLSearchParams(routeSearch);
  const isCreate = query.get('mode') === 'create';
  const sourceMapping = query.get('mappingId') ? pickById(managementCategoryMappings, query.get('mappingId')) : managementCategoryMappings[0]!;
  const requestedChannel = query.get('channel');
  const mapping = isCreate
    ? buildDraftCategoryMapping(sourceMapping, {
        channel: (requestedChannel && ['淘宝', '快手', '抖音', '拼多多'].includes(requestedChannel) ? requestedChannel : sourceMapping.channel) as ManagementCategoryMapping['channel'],
      })
    : sourceMapping;
  const [draftStatus, setDraftStatus] = useState<MappingStatus>(mapping.status);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const relatedAttributeMappings = isCreate ? [] : managementAttributeMappings.filter((row) => row.mappingId === mapping.id);
  const conflictGuard =
    draftStatus === 'active'
      ? getCategoryMappingConflictGuard({
          candidateChannel: mapping.channel,
          candidateChannelCategoryId: mapping.channelCategoryId,
          currentMappingId: isCreate ? undefined : mapping.id,
          mappings: managementCategoryMappings.map((row) => ({
            channel: row.channel,
            channelCategoryId: row.channelCategoryId,
            id: row.id,
            status: row.status,
          })),
        })
      : { allowed: true, reason: '' };
  return (
    <div className="space-y-4">
      <PageTitle
        actions={
          <>
            <SecondaryButton onClick={() => navigate('/management/category-mappings/list', { channel: mapping.channel })}>返回类目映射</SecondaryButton>
            {!isCreate && <SecondaryButton onClick={() => navigate('/management/attribute-mappings/list', { categoryMappingId: mapping.id })}>查看属性值映射</SecondaryButton>}
            <SecondaryButton onClick={() => setFeedback({ message: conflictGuard.allowed ? '已校验全局 active 唯一性。' : conflictGuard.reason, tone: conflictGuard.allowed ? 'info' : 'warning' })}>
              <Copy className="mr-1.5" size={14} />
              校验唯一性
            </SecondaryButton>
            <PrimaryButton
              color="indigo"
              disabled={!conflictGuard.allowed}
              onClick={() =>
                setFeedback({
                  message: isCreate
                    ? draftStatus === 'active'
                      ? '新增类目映射已保存并生效，用户端将继续只读消费治理结果。'
                      : '新增类目映射已保存为停用状态，后续可再启用。'
                    : draftStatus === 'active'
                      ? '类目映射已保存并保持生效，用户端将继续只读消费治理结果。'
                      : '类目映射已保存为停用状态，下游属性值映射需要一并复核。',
                  tone: draftStatus === 'active' ? 'success' : 'warning',
                })
              }
            >
              保存映射
            </PrimaryButton>
          </>
        }
        accent="indigo"
        icon={<Filter size={22} />}
        subtitle="类目映射编辑页负责治理平台全局的渠道类目到中台标准类目映射关系。"
        title={isCreate ? '新增类目映射' : mapping.channelCategoryName}
      />
      <InlineFeedback feedback={feedback} />
      {isCreate && <RuleStrip tone="info">当前为新增模式。保存前需要补齐渠道类目和中台标准类目字段。</RuleStrip>}
      {!conflictGuard.allowed && <RuleStrip tone="warning">{conflictGuard.reason}</RuleStrip>}
      {draftStatus === 'inactive' && (
        <RuleStrip tone="warning">当前映射处于停用状态。停用前需提示其下 {relatedAttributeMappings.length} 条属性值映射可能不可用。</RuleStrip>
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="surface-panel p-5">
            <div className="mb-4 text-sm font-black uppercase tracking-widest text-slate-500">基础信息区</div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="渠道" value={mapping.channel} />
              <Field label="店铺范围" value={mapping.shopScope} />
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">映射状态</div>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <StatusBadge status={draftStatus} />
                  <SecondaryButton
                    onClick={() => {
                      const nextStatus = draftStatus === 'active' ? 'inactive' : 'active';
                      setDraftStatus(nextStatus);
                      setFeedback({
                        message: nextStatus === 'active' ? '映射状态已切换为生效，保存后可供用户端继续消费。' : '映射状态已切换为停用，保存前请复核下游影响。',
                        tone: nextStatus === 'active' ? 'info' : 'warning',
                      });
                    }}
                  >
                    {draftStatus === 'active' ? '切换为停用' : '切换为生效'}
                  </SecondaryButton>
                </div>
              </div>
            </div>
          </div>
          <div className="surface-panel p-5">
            <div className="mb-4 text-sm font-black uppercase tracking-widest text-slate-500">渠道类目区</div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="渠道类目 ID" mono value={mapping.channelCategoryId} />
              <Field label="渠道类目名称" value={mapping.channelCategoryName} />
              <Field label="渠道类目路径" value={mapping.channelCategoryName} wide />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="surface-panel p-5">
            <div className="mb-4 text-sm font-black uppercase tracking-widest text-slate-500">中台类目区</div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="中台类目 ID" mono value={mapping.standardCategoryId} />
              <Field label="中台类目名称" value={mapping.standardCategoryName} />
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 md:col-span-2">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">治理结果摘要</div>
                <div className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                  当前类目映射为平台全局规则，服务于
                  <span className="mx-1 font-black text-slate-900">{mapping.shopScope}</span>，并向用户端商品详情返回类目适配结果。
                </div>
              </div>
            </div>
          </div>
          <div className="surface-panel p-5">
            <div className="mb-4 text-sm font-black uppercase tracking-widest text-slate-500">操作区</div>
            <div className="grid gap-4 md:grid-cols-2">
              <Info label="关联属性值映射" value={`${relatedAttributeMappings.length} 条`} />
              <Info label="最近更新时间" mono value={mapping.updatedAt} />
            </div>
            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs font-semibold leading-6 text-slate-500">
                保存成功后应返回列表，并尽量保留当前渠道筛选条件。
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold leading-6 text-amber-700">
                停用该类目映射前必须提示：其下属性值映射可能不可用，需要同步检查。
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AttributeMappingList({ navigate, routeSearch, searchTerm }: { navigate: NavigateFn; routeSearch: string; searchTerm: string }) {
  const query = new URLSearchParams(routeSearch);
  const [customerFilter, setCustomerFilter] = useState(query.get('customerId') ?? 'all');
  const [channelFilter, setChannelFilter] = useState(query.get('channel') ?? 'all');
  const [statusFilter, setStatusFilter] = useState(query.get('status') ?? 'all');
  const [categoryMappingFilter, setCategoryMappingFilter] = useState(query.get('categoryMappingId') ?? 'all');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const scopedCustomerId = customerFilter === 'all' ? null : customerFilter;
  const scopedCategoryMappingId = categoryMappingFilter === 'all' ? null : categoryMappingFilter;
  const baseFiltered = filterManagementAttributeMappings(managementAttributeMappings, {
    categoryMappingId: scopedCategoryMappingId,
    customerId: scopedCustomerId,
    searchTerm,
  });
  const filtered = baseFiltered.filter((mapping) => {
    return (
      (channelFilter === 'all' || mapping.channel === channelFilter) &&
      (statusFilter === 'all' || mapping.status === statusFilter)
    );
  });
  const [selectedMappingId, setSelectedMappingId] = useState(filtered[0]?.id ?? managementAttributeMappings[0]?.id ?? '');
  const selectedMapping = filtered.find((mapping) => mapping.id === selectedMappingId) ?? filtered[0] ?? managementAttributeMappings[0]!;
  const parentMapping = managementCategoryMappings.find((mapping) => mapping.id === selectedMapping.mappingId) ?? managementCategoryMappings[0]!;
  const scopedCategoryMapping = scopedCategoryMappingId ? managementCategoryMappings.find((mapping) => mapping.id === scopedCategoryMappingId) : null;
  const summary = summarizeManagementAttributeMappings(filtered);
  const toggleGuard = getAttributeMappingActivateGuard({
    parentCategoryMappingStatus: parentMapping.status,
    targetMappingStatus: selectedMapping.status === 'active' ? 'inactive' : 'active',
  });
  const selectClass = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10';
  return (
    <div className="space-y-4">
      <PageTitle
        actions={
          <PrimaryButton
            color="violet"
            onClick={() =>
              navigate('/management/attribute-mappings/detail', {
                categoryMappingId: categoryMappingFilter === 'all' ? selectedMapping.mappingId : categoryMappingFilter,
                customerId: customerFilter === 'all' ? selectedMapping.customerId : customerFilter,
                mode: 'create',
              })
            }
          >
            <Plus className="mr-1.5" size={14} />
            新增属性值映射
          </PrimaryButton>
        }
        accent="violet"
        icon={<RefreshCw size={22} />}
        subtitle="属性值映射依附类目映射上下文维护，用户端只读取适配结果。"
        title="属性值映射"
      />
      <InlineFeedback feedback={feedback} />
      <div className="flex flex-wrap items-center gap-4">
        <CompactStat color="violet" label="当前结果" value={summary.total} />
        <CompactStat color="blue" label="生效映射" value={summary.active} />
        <CompactStat color="slate" label="停用映射" value={summary.inactive} />
      </div>
      <div className="surface-panel p-5">
        <div className="mb-4 text-sm font-black uppercase tracking-widest text-slate-500">筛选区</div>
        <div className="grid gap-4 lg:grid-cols-4">
          <label>
            <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">客户</span>
            <select className={selectClass} onChange={(event) => setCustomerFilter(event.target.value)} value={customerFilter}>
              <option value="all">全部客户</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">渠道</span>
            <select className={selectClass} onChange={(event) => setChannelFilter(event.target.value)} value={channelFilter}>
              <option value="all">全部渠道</option>
              {[...new Set(managementAttributeMappings.map((mapping) => mapping.channel))].map((channel) => (
                <option key={channel} value={channel}>
                  {channel}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">类目映射</span>
            <select className={selectClass} onChange={(event) => setCategoryMappingFilter(event.target.value)} value={categoryMappingFilter}>
              <option value="all">全部类目映射</option>
              {managementCategoryMappings.map((mapping) => (
                <option key={mapping.id} value={mapping.id}>
                  {mapping.channel} / {mapping.channelCategoryName}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">状态</span>
            <select className={selectClass} onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}>
              <option value="all">全部状态</option>
              <option value="active">生效中</option>
              <option value="inactive">已停用</option>
            </select>
          </label>
        </div>
      </div>
      {scopedCategoryMapping && (
        <RuleStrip tone="info">
          当前按类目映射范围查看：{scopedCategoryMapping.channelCategoryName}。新增、编辑和启停用都应继承该 category_mapping_id 上下文。
        </RuleStrip>
      )}
      <div className="grid gap-4 2xl:grid-cols-[1.2fr_0.8fr]">
        <div className={`${LIST_PANEL_CLASS} overflow-x-auto`}>
          <table className="w-full min-w-[1080px] border-collapse text-left">
            <thead className={LIST_HEADER_CLASS}>
              <tr>
                <th className="table-head-cell">客户 / 渠道</th>
                <th className="table-head-cell">类目映射</th>
                <th className="table-head-cell">渠道属性</th>
                <th className="table-head-cell">标准值</th>
                <th className="table-head-cell">状态</th>
                <th className="table-head-cell">更新时间</th>
                <th className="table-head-cell text-right">操作</th>
              </tr>
            </thead>
            <tbody className={LIST_BODY_CLASS}>
              {filtered.map((mapping) => {
                const active = selectedMapping.id === mapping.id;
                const mappingParent = managementCategoryMappings.find((row) => row.id === mapping.mappingId);
                return (
                  <tr
                    className={`cursor-pointer ${active ? 'bg-violet-50/60' : 'hover:bg-slate-50/80'}`}
                    key={mapping.id}
                    onClick={() => setSelectedMappingId(mapping.id)}
                  >
                    <td className="table-body-cell">
                      <div className="font-black text-blue-600">{mapping.customerName}</div>
                      <ListMeta>{mapping.channel}</ListMeta>
                    </td>
                    <td className="table-body-cell">
                      <div className="font-bold text-slate-900">{mappingParent?.channelCategoryName ?? mapping.mappingId}</div>
                      <ListMeta mono>{mapping.mappingId}</ListMeta>
                    </td>
                    <td className="table-body-cell">
                      <div className="font-bold text-slate-900">{mapping.channelAttributeName}</div>
                      <ListMeta mono>{mapping.channelAttributeValue}</ListMeta>
                    </td>
                    <td className="table-body-cell">
                      <div className="font-bold text-slate-900">{mapping.standardAttributeName}</div>
                      <ListMeta mono>{mapping.standardAttributeValue}</ListMeta>
                    </td>
                    <td className="table-body-cell"><ListStatus status={mapping.status} /></td>
                    <td className="table-body-cell mono-value text-xs text-slate-400">{mapping.updatedAt}</td>
                    <td className="table-body-cell text-right">
                      <ActionIconButton
                        onClick={(event) => {
                          event.stopPropagation();
                          navigate('/management/attribute-mappings/detail', {
                            categoryMappingId: mapping.mappingId,
                            customerId: mapping.customerId,
                            mappingId: mapping.id,
                          });
                        }}
                        title="编辑属性值映射"
                        tone="violet"
                      >
                        <ArrowUpRight size={16} />
                      </ActionIconButton>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td className="p-5" colSpan={7}>
                    <EmptyState description="当前客户、类目映射或搜索条件下没有命中属性值映射。" title="没有命中属性值映射" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="space-y-4">
          <div className="surface-panel p-5">
            <div className="mb-3 text-sm font-black uppercase tracking-widest text-slate-500">动作区</div>
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">当前选中</div>
                <div className="mt-2 text-sm font-bold text-slate-900">{selectedMapping.channelAttributeName}</div>
                <div className="mono-value mt-1 text-xs text-slate-400">{selectedMapping.channelAttributeValue}</div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <StatusBadge status={selectedMapping.status} />
                  <span className="text-xs font-semibold text-slate-500">{parentMapping.channelCategoryName}</span>
                </div>
              </div>
              <div className="grid gap-3">
                <SecondaryButton
                  onClick={() =>
                    navigate('/management/attribute-mappings/detail', {
                      categoryMappingId: selectedMapping.mappingId,
                      customerId: selectedMapping.customerId,
                      mappingId: selectedMapping.id,
                    })
                  }
                >
                  编辑属性值映射
                </SecondaryButton>
                <SecondaryButton onClick={() => navigate('/management/category-mappings/detail', { mappingId: parentMapping.id })}>
                  查看所属类目映射
                </SecondaryButton>
                <PrimaryButton
                  color="violet"
                  disabled={!toggleGuard.allowed}
                  onClick={() =>
                    setFeedback({
                      message:
                        selectedMapping.status === 'active'
                          ? `属性值映射 ${selectedMapping.channelAttributeName} 已切换为停用，用户端将停止读取该值。`
                          : `属性值映射 ${selectedMapping.channelAttributeName} 已恢复生效，可供用户端继续读取。`,
                      tone: selectedMapping.status === 'active' ? 'warning' : 'success',
                    })
                  }
                  title={toggleGuard.reason}
                >
                  {selectedMapping.status === 'active' ? '停用映射' : '启用映射'}
                </PrimaryButton>
              </div>
            </div>
          </div>
          <div className="surface-panel p-5">
            <div className="mb-3 text-sm font-black uppercase tracking-widest text-slate-500">选中映射摘要</div>
            <div className="grid gap-4 md:grid-cols-2">
              <Info label="客户" value={selectedMapping.customerName} />
              <Info label="所属类目映射" value={parentMapping.channelCategoryName} />
              <Info label="中台标准值" value={selectedMapping.standardAttributeValue} />
              <Info label="最近更新时间" mono value={selectedMapping.updatedAt} />
            </div>
            {!toggleGuard.allowed && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold leading-6 text-amber-700">
                {toggleGuard.reason}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AttributeMappingDetail({ navigate, routeSearch }: { navigate: NavigateFn; routeSearch: string }) {
  const query = new URLSearchParams(routeSearch);
  const isCreate = query.get('mode') === 'create';
  const sourceMapping = query.get('mappingId') ? pickById(managementAttributeMappings, query.get('mappingId')) : managementAttributeMappings[0]!;
  const requestedCustomer = customers.find((customer) => customer.id === query.get('customerId'));
  const requestedCategoryMapping = managementCategoryMappings.find((mapping) => mapping.id === query.get('categoryMappingId'));
  const draftParentMapping = requestedCategoryMapping ?? managementCategoryMappings.find((row) => row.id === sourceMapping.mappingId) ?? managementCategoryMappings[0]!;
  const draftCustomer = requestedCustomer ?? customers.find((customer) => customer.id === sourceMapping.customerId) ?? customers[0]!;
  const mapping = isCreate
    ? buildDraftAttributeMapping(sourceMapping, {
        categoryMappingId: draftParentMapping.id,
        channel: draftParentMapping.channel,
        customerId: draftCustomer.id,
        customerName: draftCustomer.name,
      })
    : sourceMapping;
  const [draftStatus, setDraftStatus] = useState<MappingStatus>(mapping.status);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const parentMapping = managementCategoryMappings.find((row) => row.id === mapping.mappingId) ?? draftParentMapping;
  const activateGuard = getAttributeMappingActivateGuard({
    parentCategoryMappingStatus: parentMapping.status,
    targetMappingStatus: draftStatus,
  });
  const conflictGuard =
    draftStatus === 'active'
      ? getAttributeMappingConflictGuard({
          candidateChannelAttributeName: mapping.channelAttributeName,
          candidateChannelAttributeValue: mapping.channelAttributeValue,
          candidateCustomerId: mapping.customerId,
          candidateMappingId: mapping.mappingId,
          currentMappingId: isCreate ? undefined : mapping.id,
          mappings: managementAttributeMappings.map((row) => ({
            channelAttributeName: row.channelAttributeName,
            channelAttributeValue: row.channelAttributeValue,
            customerId: row.customerId,
            id: row.id,
            mappingId: row.mappingId,
            status: row.status,
          })),
        })
      : { allowed: true, reason: '' };
  const canSave = activateGuard.allowed && conflictGuard.allowed;
  return (
    <div className="space-y-4">
      <PageTitle
        actions={
          <>
            <SecondaryButton onClick={() => navigate('/management/attribute-mappings/list', { categoryMappingId: mapping.mappingId, customerId: mapping.customerId })}>返回属性值映射</SecondaryButton>
            <SecondaryButton onClick={() => navigate('/management/category-mappings/detail', { mappingId: parentMapping.id })}>查看所属类目映射</SecondaryButton>
            <PrimaryButton
              color="violet"
              disabled={!canSave}
              onClick={() =>
                setFeedback({
                  message: isCreate
                    ? draftStatus === 'active'
                      ? '新增属性值映射已保存并生效，用户端可继续读取该适配结果。'
                      : '新增属性值映射已保存为停用状态，仅保留治理记录。'
                    : draftStatus === 'active'
                      ? '属性值映射已保存并保持生效，用户端可继续读取该适配结果。'
                      : '属性值映射已保存为停用状态，仅保留治理记录。',
                  tone: draftStatus === 'active' ? 'success' : 'warning',
                })
              }
            >
              保存映射
            </PrimaryButton>
          </>
        }
        accent="violet"
        icon={<RefreshCw size={22} />}
        subtitle="属性值映射编辑页只在管理端维护，负责客户下渠道属性值到中台标准值的治理。"
        title={isCreate ? '新增属性值映射' : `${mapping.channelAttributeName} / ${mapping.channelAttributeValue}`}
      />
      <InlineFeedback feedback={feedback} />
      {isCreate && <RuleStrip tone="info">当前为新增模式。保存前需要补齐渠道属性和值、中台标准属性和值。</RuleStrip>}
      {!activateGuard.allowed && <RuleStrip tone="warning">{activateGuard.reason}</RuleStrip>}
      {!conflictGuard.allowed && <RuleStrip tone="warning">{conflictGuard.reason}</RuleStrip>}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="surface-panel p-5">
            <div className="mb-4 text-sm font-black uppercase tracking-widest text-slate-500">基础信息区</div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="客户" value={mapping.customerName} />
              <Field label="渠道" value={mapping.channel} />
              <Field label="类目映射 ID" mono value={mapping.mappingId} />
              <Field label="所属类目" value={parentMapping.channelCategoryName} />
            </div>
          </div>
          <div className="surface-panel p-5">
            <div className="mb-4 text-sm font-black uppercase tracking-widest text-slate-500">渠道属性区</div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="渠道属性名" value={mapping.channelAttributeName} />
              <Field label="渠道属性值" value={mapping.channelAttributeValue} />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="surface-panel p-5">
            <div className="mb-4 text-sm font-black uppercase tracking-widest text-slate-500">中台标准值区</div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="中台标准属性名" value={mapping.standardAttributeName} />
              <Field label="中台标准值" value={mapping.standardAttributeValue} />
            </div>
          </div>
          <div className="surface-panel p-5">
            <div className="mb-4 text-sm font-black uppercase tracking-widest text-slate-500">操作区</div>
            <div className="grid gap-4 md:grid-cols-2">
              <Info label="父类目映射状态" value={parentMapping.status === 'active' ? '生效中' : '已停用'} />
              <Info label="最近更新时间" mono value={mapping.updatedAt} />
            </div>
            <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">映射状态</div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <StatusBadge status={draftStatus} />
                <SecondaryButton
                  disabled={draftStatus === 'inactive' ? !activateGuard.allowed : false}
                  onClick={() => {
                    const nextStatus = draftStatus === 'active' ? 'inactive' : 'active';
                    setDraftStatus(nextStatus);
                    setFeedback({
                      message: nextStatus === 'active' ? '映射状态已切换为生效，保存前将再次校验父类目和重复 active 规则。' : '映射状态已切换为停用，可继续保留治理记录。',
                      tone: nextStatus === 'active' ? 'info' : 'warning',
                    });
                  }}
                  title={draftStatus === 'inactive' ? activateGuard.reason : undefined}
                >
                  {draftStatus === 'active' ? '切换为停用' : '切换为生效'}
                </SecondaryButton>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs font-semibold leading-6 text-slate-500">
                保存前必须确认客户、渠道、类目映射和渠道属性值完整。当前页面仅治理映射，不回写用户端商品详情。
              </div>
              <div className="rounded-xl border border-violet-100 bg-violet-50 p-4 text-xs font-semibold leading-6 text-violet-700">
                用户端商品详情只通过 <span className="mono-value text-violet-900">API-ITEM-CATEGORY-ADAPTATION-GET</span> 读取适配结果。
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ManagementAdminUserList({
  adminUserRows,
  navigate,
  searchTerm,
  setAdminUserRows,
}: {
  adminUserRows: ManagementAdminUser[];
  navigate: NavigateFn;
  searchTerm: string;
  setAdminUserRows: Dispatch<SetStateAction<ManagementAdminUser[]>>;
}) {
  const [roleFilter, setRoleFilter] = useState<ManagementAdminUser['role'] | '全部角色'>('全部角色');
  const [statusFilter, setStatusFilter] = useState<UserStatus | '全部状态'>('全部状态');
  const filtered = filterManagementAdminUsers(adminUserRows, { role: roleFilter, searchTerm, status: statusFilter });
  const summary = summarizeManagementAdminUsers(filtered);
  const [selectedAdminUserId, setSelectedAdminUserId] = useState(filtered[0]?.id ?? adminUserRows[0]?.id ?? '');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const selectedAdminUser = pickById(adminUserRows, selectedAdminUserId || adminUserRows[0]?.id || '');
  const operatorName = adminUserRows.find((adminUser) => adminUser.id === currentManagementAdminUserId)?.name ?? '系统管理员';
  const disableGuard = getAdminDisableGuard({
    currentAdminUserId: currentManagementAdminUserId,
    targetAdminUserId: selectedAdminUser.id,
  });
  const selectClass = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-500/10';
  return (
    <div className="space-y-4">
      <PageTitle
        actions={
          <PrimaryButton color="slate" onClick={() => navigate('/management/system/admin-users/detail', { mode: 'create' })}>
            <Plus className="mr-1.5" size={14} />
            开管理端用户
          </PrimaryButton>
        }
        accent="slate"
        icon={<ShieldCheck size={22} />}
        subtitle="系统管理只维护中台管理端自己的后台账号。"
        title="系统管理"
      />
      <InlineFeedback feedback={feedback} />
      <div className="flex flex-wrap items-center gap-4">
        <CompactStat color="slate" label="管理端用户" value={summary.total} />
        <CompactStat color="blue" label="启用账号" value={summary.enabled} />
        <CompactStat color="violet" label="系统管理员" value={filtered.filter((user) => user.role === '系统管理员').length} />
        <CompactStat color="slate" label="停用账号" value={summary.disabled} />
      </div>
      <div className="surface-panel p-5">
        <div className="mb-4 text-sm font-black uppercase tracking-widest text-slate-500">筛选区</div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <label>
            <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">角色</span>
            <select className={selectClass} onChange={(event) => setRoleFilter(event.target.value as ManagementAdminUser['role'] | '全部角色')} value={roleFilter}>
              <option value="全部角色">全部角色</option>
              {['超级管理员', '运营管理员', '系统管理员', '只读管理员'].map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">状态</span>
            <select className={selectClass} onChange={(event) => setStatusFilter(event.target.value as UserStatus | '全部状态')} value={statusFilter}>
              <option value="全部状态">全部状态</option>
              <option value="enabled">启用</option>
              <option value="disabled">停用</option>
            </select>
          </label>
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs font-semibold leading-6 text-slate-500">
            当前搜索同时匹配登录账号、姓名、邮箱和角色。重置密码、角色变更和启停用都需要写审计日志。
          </div>
        </div>
      </div>
      <div className="grid gap-4 2xl:grid-cols-[1.15fr_0.85fr]">
        <div className={`${LIST_PANEL_CLASS} overflow-x-auto`}>
          <table className="w-full min-w-[920px] border-collapse text-left">
            <thead className={LIST_HEADER_CLASS}>
              <tr>
                <th className="table-head-cell">账号</th>
                <th className="table-head-cell">角色</th>
                <th className="table-head-cell">邮箱</th>
                <th className="table-head-cell">状态</th>
                <th className="table-head-cell">最后登录</th>
                <th className="table-head-cell text-right">操作</th>
              </tr>
            </thead>
            <tbody className={LIST_BODY_CLASS}>
              {filtered.map((user) => (
                <tr className={`cursor-pointer ${user.id === selectedAdminUser.id ? 'bg-blue-50/70' : 'hover:bg-slate-50/80'}`} key={user.id} onClick={() => setSelectedAdminUserId(user.id)}>
                  <td className="table-body-cell">
                    <div className="font-black text-blue-600">{user.name}</div>
                    <ListMeta mono>{user.username}</ListMeta>
                  </td>
                  <td className="table-body-cell">{user.role}</td>
                  <td className="table-body-cell mono-value text-xs">{user.email}</td>
                  <td className="table-body-cell"><ListStatus status={user.status} /></td>
                  <td className="table-body-cell mono-value text-xs text-slate-400">{user.lastLogin}</td>
                  <td className="table-body-cell text-right">
                    <div className="flex items-center justify-end gap-2">
                      <ActionIconButton
                        onClick={(event) => {
                          event.stopPropagation();
                          navigate('/management/system/admin-users/detail', { adminUserId: user.id });
                        }}
                        title="编辑用户"
                        tone="slate"
                      >
                        <Pencil size={16} />
                      </ActionIconButton>
                      <ActionIconButton
                        onClick={(event) => {
                          event.stopPropagation();
                          setFeedback({ message: `已生成临时密码 TMP-${user.username.toUpperCase()}。`, tone: 'success' });
                        }}
                        title="重置密码"
                        tone="indigo"
                      >
                        <RefreshCw size={16} />
                      </ActionIconButton>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td className="p-5" colSpan={6}>
                    <EmptyState description="当前搜索、角色或状态条件下没有命中管理端用户。" title="没有命中管理端用户" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="space-y-4">
          <div className="surface-panel p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">{selectedAdminUser.name}</div>
                <ListMeta mono>{selectedAdminUser.username}</ListMeta>
              </div>
              <StatusBadge status={selectedAdminUser.status} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Info label="角色" value={selectedAdminUser.role} />
              <Info label="手机号" mono value={selectedAdminUser.phone} />
              <Info label="邮箱" mono value={selectedAdminUser.email} />
              <Info label="最后登录" mono value={selectedAdminUser.lastLogin} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <PrimaryButton color="slate" onClick={() => navigate('/management/system/admin-users/detail', { adminUserId: selectedAdminUser.id })}>进入详情页</PrimaryButton>
              <SecondaryButton
                disabled={!disableGuard.allowed}
                onClick={() => {
                  const nextStatus: UserStatus = selectedAdminUser.status === 'enabled' ? 'disabled' : 'enabled';
                  setAdminUserRows((current) =>
                    current.map((row) =>
                      row.id === selectedAdminUser.id
                        ? {
                            ...row,
                            recentActionAt: PROTOTYPE_NOW,
                            recentActionBy: operatorName,
                            status: nextStatus,
                            updatedAt: PROTOTYPE_NOW,
                          }
                        : row,
                    ),
                  );
                  setFeedback({ message: nextStatus === 'disabled' ? '账号已进入停用流程。' : '账号已恢复启用。', tone: 'info' });
                }}
                title={disableGuard.reason}
              >
                {selectedAdminUser.status === 'enabled' ? '停用账号' : '启用账号'}
              </SecondaryButton>
              <SecondaryButton onClick={() => setFeedback({ message: `已生成临时密码 TMP-${selectedAdminUser.username.toUpperCase()}。`, tone: 'success' })}>重置密码</SecondaryButton>
            </div>
          </div>
          <div className="surface-panel p-5">
            <div className="mb-3 text-sm font-black uppercase tracking-widest text-slate-500">动作约束</div>
            <div className="space-y-3 text-xs font-semibold leading-6 text-slate-500">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                当前登录账号为 <span className="mono-value text-slate-900">{currentManagementAdminUserId}</span>。系统管理页需阻止停用自己当前登录的后台账号。
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                当前选中账号的角色为 <span className="font-black text-slate-900">{selectedAdminUser.role}</span>，最近一次操作人是 {selectedAdminUser.recentActionBy}。
              </div>
              {!disableGuard.allowed && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-700">{disableGuard.reason}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ManagementAdminUserDetail({
  adminUserRows,
  navigate,
  routeSearch,
  setAdminUserRows,
}: {
  adminUserRows: ManagementAdminUser[];
  navigate: NavigateFn;
  routeSearch: string;
  setAdminUserRows: Dispatch<SetStateAction<ManagementAdminUser[]>>;
}) {
  const query = new URLSearchParams(routeSearch);
  const isCreate = query.get('mode') === 'create';
  const sourceUser = query.get('adminUserId') ? pickById(adminUserRows, query.get('adminUserId')) : adminUserRows[0]!;
  const operatorName = adminUserRows.find((adminUser) => adminUser.id === currentManagementAdminUserId)?.name ?? '系统管理员';
  const [userDraft, setUserDraft] = useState<ManagementAdminUser>(() => (isCreate ? buildDraftManagementAdminUser(sourceUser, operatorName) : { ...sourceUser }));
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [passwordPreview, setPasswordPreview] = useState<string | null>(null);
  const disableGuard = isCreate
    ? { allowed: true, reason: '' }
    : getAdminDisableGuard({
        currentAdminUserId: currentManagementAdminUserId,
        targetAdminUserId: userDraft.id,
      });
  const usernameGuard = getAdminUsernameConflictGuard({
    candidateUsername: userDraft.username,
    currentAdminUserId: isCreate ? undefined : userDraft.id,
    users: adminUserRows.map((adminUser) => ({ id: adminUser.id, username: adminUser.username })),
  });
  const adminUserValidation = validateManagementAdminUserDraft(userDraft);

  function saveAdminUser() {
    if (!usernameGuard.allowed) return;
    if (!adminUserValidation.allowed) return;
    if (isCreate) {
      const savedUser: ManagementAdminUser = {
        ...userDraft,
        createdAt: PROTOTYPE_NOW,
        createdBy: operatorName,
        id: buildPrototypeId('admin'),
        recentActionAt: PROTOTYPE_NOW,
        recentActionBy: operatorName,
        updatedAt: PROTOTYPE_NOW,
      };
      setAdminUserRows((current) => [savedUser, ...current]);
      setFeedback({ message: '管理端用户草稿已保存，后续可继续启停用和重置密码。', tone: 'success' });
      navigate('/management/system/admin-users/detail', { adminUserId: savedUser.id });
      return;
    }

    const savedUser: ManagementAdminUser = {
      ...userDraft,
      recentActionAt: PROTOTYPE_NOW,
      recentActionBy: operatorName,
      updatedAt: PROTOTYPE_NOW,
    };
    setAdminUserRows((current) => current.map((row) => (row.id === userDraft.id ? savedUser : row)));
    setUserDraft(savedUser);
    setFeedback({ message: '管理端账号信息已保存，权限边界仍受固定角色枚举控制。', tone: 'success' });
  }

  function toggleAdminUserStatus() {
    if (isCreate || !disableGuard.allowed) return;
    const nextStatus: UserStatus = userDraft.status === 'enabled' ? 'disabled' : 'enabled';
    const savedUser: ManagementAdminUser = {
      ...userDraft,
      recentActionAt: PROTOTYPE_NOW,
      recentActionBy: operatorName,
      status: nextStatus,
      updatedAt: PROTOTYPE_NOW,
    };
    setAdminUserRows((current) => current.map((row) => (row.id === userDraft.id ? savedUser : row)));
    setUserDraft(savedUser);
    setFeedback({ message: nextStatus === 'enabled' ? '账号已恢复启用。' : '账号已进入停用流程。', tone: 'info' });
  }

  function resetAdminPassword() {
    const temporaryPassword = `TMP-${(userDraft.username || 'new-admin').toUpperCase()}`;
    setPasswordPreview(temporaryPassword);
    setFeedback({ message: `已生成 ${userDraft.name || userDraft.username || '当前账号'} 的一次性临时密码。`, tone: 'success' });
  }

  return (
    <div className="space-y-4">
      <PageTitle
        actions={
          <>
            <SecondaryButton onClick={() => navigate('/management/system/admin-users/list')}>返回系统管理</SecondaryButton>
            <PrimaryButton color="slate" disabled={!adminUserValidation.allowed || !usernameGuard.allowed} title={!adminUserValidation.allowed ? adminUserValidation.message : usernameGuard.reason} onClick={saveAdminUser}>
              保存账号
            </PrimaryButton>
          </>
        }
        accent="slate"
        icon={<ShieldCheck size={22} />}
        subtitle="管理端用户详情为隐藏详情页，承接编辑、启停用和重置密码动作。"
        title={isCreate ? '新增管理端用户' : userDraft.name}
      />
      <InlineFeedback feedback={feedback} />
      {isCreate && <RuleStrip tone="info">当前为新增模式。请先补齐登录账号、姓名、手机号、邮箱和角色，再决定是否启用账号。</RuleStrip>}
      {!adminUserValidation.allowed && <RuleStrip tone="warning">{adminUserValidation.message}</RuleStrip>}
      {!usernameGuard.allowed && <RuleStrip tone="warning">{usernameGuard.reason}</RuleStrip>}
      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="surface-panel p-5">
          <div className="mb-4 text-sm font-black uppercase tracking-widest text-slate-500">基础信息区</div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="登录账号" mono onChange={(value) => setUserDraft((current) => ({ ...current, username: value }))} value={userDraft.username} />
            <Field label="用户姓名" onChange={(value) => setUserDraft((current) => ({ ...current, name: value }))} value={userDraft.name} />
            <Field label="手机号" mono onChange={(value) => setUserDraft((current) => ({ ...current, phone: value }))} value={userDraft.phone} />
            <Field label="邮箱" onChange={(value) => setUserDraft((current) => ({ ...current, email: value }))} value={userDraft.email} />
            <Field label="创建时间" mono readOnly value={userDraft.createdAt} />
            <Field label="创建人" readOnly value={userDraft.createdBy} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <PrimaryButton color="slate" disabled={!adminUserValidation.allowed || !usernameGuard.allowed} title={!adminUserValidation.allowed ? adminUserValidation.message : usernameGuard.reason} onClick={saveAdminUser}>
              保存管理端用户
            </PrimaryButton>
            <SecondaryButton disabled={isCreate || !disableGuard.allowed} onClick={toggleAdminUserStatus} title={isCreate ? '请先保存账号，再执行启停用。' : disableGuard.reason}>
              {userDraft.status === 'enabled' ? '停用账号' : '启用账号'}
            </SecondaryButton>
            <SecondaryButton disabled={isCreate} onClick={resetAdminPassword} title={isCreate ? '请先保存账号，再重置密码。' : undefined}>
              重置密码
            </SecondaryButton>
          </div>
        </div>
        <div className="space-y-4">
          <div className="surface-panel p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm font-black uppercase tracking-widest text-slate-500">角色区</div>
              <StatusBadge status={userDraft.status} />
            </div>
            <div className="grid gap-3">
              {['超级管理员', '运营管理员', '系统管理员', '只读管理员'].map((role) => (
                <label className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-bold ${role === userDraft.role ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-700'}`} key={role}>
                  <span>{role}</span>
                  <input checked={role === userDraft.role} onChange={() => setUserDraft((current) => ({ ...current, role: role as ManagementAdminUser['role'] }))} type="radio" name="admin-role" />
                </label>
              ))}
            </div>
          </div>
          <div className="surface-panel p-5">
            <div className="mb-3 text-sm font-black uppercase tracking-widest text-slate-500">状态区</div>
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">账号状态</div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-sm font-bold text-slate-900">{userDraft.status === 'enabled' ? '启用中' : '已停用'}</div>
                  <SecondaryButton disabled={isCreate || !disableGuard.allowed} onClick={toggleAdminUserStatus} title={isCreate ? '请先保存账号，再执行启停用。' : disableGuard.reason}>
                    {userDraft.status === 'enabled' ? '停用账号' : '启用账号'}
                  </SecondaryButton>
                </div>
              </div>
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-xs font-semibold leading-6 text-emerald-700">
                重置密码将触发 <span className="mono-value text-emerald-900">API-MGMT-ADMIN-USER-PASSWORD-POST</span>，
                并返回一次性临时密码：
                <span className="mono-value ml-1 text-emerald-900">{passwordPreview ?? `TMP-${(userDraft.username || 'new-admin').toUpperCase()}`}</span>
              </div>
              {!isCreate && !disableGuard.allowed && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold leading-6 text-amber-700">
                  {disableGuard.reason} 超级管理员账号停用应二次确认。
                </div>
              )}
            </div>
          </div>
          <div className="surface-panel p-5">
            <div className="mb-3 text-sm font-black uppercase tracking-widest text-slate-500">审计摘要区</div>
            <div className="grid gap-4 md:grid-cols-2">
              <Info label="最近登录" mono value={userDraft.lastLogin} />
              <Info label="最近操作时间" mono value={userDraft.recentActionAt} />
              <Info label="最近操作人" value={userDraft.recentActionBy} />
              <Info label="当前登录账号" mono value={currentManagementAdminUserId} />
            </div>
            <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs font-semibold leading-6 text-slate-500">
              V1 不单独建设角色管理页。当前通过固定角色枚举控制客户治理、映射治理和系统账号维护边界。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormPanel({
  item,
  onChange,
  title,
}: {
  item: Pick<ChannelItem, 'price' | 'shelfStatus' | 'title'>;
  onChange?: (patch: Partial<Pick<ChannelItem, 'price' | 'shelfStatus' | 'title'>>) => void;
  title: string;
}) {
  return (
    <div className="surface-panel p-5">
      <div className="mb-4 text-sm font-black uppercase tracking-widest text-slate-500">{title}</div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="商品标题" onChange={onChange ? (value) => onChange({ title: value }) : undefined} value={item.title} wide />
        <Field label="售价" mono onChange={onChange ? (value) => onChange({ price: Number(value) || 0 }) : undefined} value={String(item.price)} />
        <Field label="销售属性" readOnly value="精装 / 套装 / 赠品联动" />
        <Field label="类目属性摘要" readOnly value="作者、适读年龄、套装册数" />
        <Field label="发货时效" readOnly value="48 小时内发货" />
        <Field label="运费模板" mono readOnly value="FT-TB-001" />
        <SelectField
          label="上下架"
          onChange={(value) => onChange?.({ shelfStatus: value as ShelfStatus })}
          options={[
            { label: '上架中', value: 'online' },
            { label: '已下架', value: 'offline' },
          ]}
          value={item.shelfStatus}
        />
      </div>
    </div>
  );
}

function Field({
  label,
  mono = false,
  onChange,
  readOnly = false,
  value,
  wide = false,
}: {
  label: string;
  mono?: boolean;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  value: string;
  wide?: boolean;
}) {
  return (
    <label className={wide ? 'md:col-span-2' : ''}>
      <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
      <input
        className={`w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 ${mono ? 'mono-value' : ''}`}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        readOnly={readOnly || !onChange}
        value={value}
      />
    </label>
  );
}

function SelectField({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  value: string;
}) {
  return (
    <label>
      <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
      <select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" onChange={(event) => onChange(event.target.value)} value={value}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextAreaField({ label, onChange, value }: { label: string; onChange: (value: string) => void; value: string }) {
  return (
    <label>
      <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
      <textarea
        className="min-h-24 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
}

function Info({ label, mono = false, value }: { label: string; mono?: boolean; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</div>
      <div className={`mt-1 text-sm font-bold text-slate-900 ${mono ? 'mono-value' : ''}`}>{value}</div>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</div>
      <div className="mono-value mt-2 text-lg font-black text-slate-900">{value}</div>
    </div>
  );
}

export default App;
