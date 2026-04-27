import type {
  ChannelItem,
  Customer,
  CustomerUser,
  DetailPage,
  DetailPageBlock,
  DetailPageStatus,
  ImportJobStatus,
  ImportRecord,
  InventoryAdjustment,
  InventoryItem,
  ManagementAdminUser,
  ManagementAttributeMapping,
  ManagementCategoryMapping,
  MaterialItem,
  Product,
  ProductStatus,
  ShelfStatus,
  StoreConfig,
  SyncStatus,
  UserStatus,
} from './data';

export const DETAIL_PAGE_LIMIT = 3;

export type DetailLimitState = {
  count: number;
  limit: number;
  limitReached: boolean;
  remaining: number;
};

export type BatchTargetFilters = {
  channel: ChannelItem['channel'] | '全部渠道';
  product: string;
  shelfStatus: ShelfStatus | '全部状态';
  shop: string;
};

export type BatchEditDraft = {
  nextShelfStatus: ShelfStatus | '保持不变';
  priceDelta: number;
  titleSuffix: string;
};

export type BatchEditSubmission = {
  allowed: boolean;
  changedFields: string[];
  message: string;
};

export type ImportValidationStatus = 'failed' | 'idle' | 'passed' | 'validating';

export type ProductImportType = 'online-item' | 'product-profile';

export type ImportConfirmState = {
  hasUploadedFile: boolean;
  unresolvedLinks: number;
  validationStatus: ImportValidationStatus;
};

export type ImportTaskSummaryInput = ImportConfirmState & {
  channel: ChannelItem['channel'];
  shop: string;
};

export type ImportTaskSummary = {
  label: string;
  ready: boolean;
  statusText: string;
};

export type ManagementMappingFilters = {
  categoryMappingId?: string | null;
  customerId?: string | null;
  searchTerm: string;
};

export type MappingSummary = {
  active: number;
  inactive: number;
  total: number;
};

export type ProductExportSummary = {
  published: number;
  ready: number;
  total: number;
  unpublished: number;
};

export type ProductDraft = {
  author: string;
  category: string;
  code: string;
  coverUploaded: boolean;
  defaultTitle: string;
  isbn: string;
  name: string;
  publisher: string;
};

export type ProductDraftValidation = {
  allowed: boolean;
  message: string;
  missingFields: string[];
};

export type ProductListFilters = {
  keyword: string;
  sourceChannel: ChannelItem['channel'] | '全部渠道';
  status: ProductStatus | '全部状态';
};

export type ImportRecordListFilters = {
  channel: ChannelItem['channel'] | '全部渠道';
  status: ImportRecord['status'] | '全部状态';
};

export type ChannelItemListFilters = {
  channel: ChannelItem['channel'] | '全部渠道';
  product: string;
  shelfStatus: ShelfStatus | '全部状态';
  shop: string;
};

export type DetailPageListFilters = {
  channel: ChannelItem['channel'] | '全部渠道';
  channelItem: string;
  detailName: string;
  product: string;
  shop: string;
  status: DetailPageStatus | '全部状态';
};

export type MaterialListFilters = {
  bindObject: string;
  channel: ChannelItem['channel'] | '全部渠道';
  keyword: string;
  type: MaterialItem['type'] | '全部类型';
};

export type MaterialProductFolderSummary = {
  detailImageCount: number;
  mainImageCount: number;
  previewSrc: string;
  productCode: string;
  productId: string;
  productName: string;
  skuImageCount: number;
  total: number;
  usedBy: number;
};

export type MaterialTypeFolderSummary = {
  assets: MaterialItem[];
  total: number;
  type: MaterialItem['type'];
  usedBy: number;
};

export type StoreConfigListFilters = {
  channel: ChannelItem['channel'] | '全部渠道';
  shop: string;
  status: StoreConfig['status'] | '全部状态';
};

export type StoreConfigDraft = Pick<
  StoreConfig,
  | 'appServiceName'
  | 'appSubscriptionStatus'
  | 'authExpiresAt'
  | 'authorizationStatus'
  | 'channel'
  | 'defaultCategory'
  | 'defaultShelfStatus'
  | 'deliverySla'
  | 'freightTemplate'
  | 'platformStoreId'
  | 'shippingOrigin'
  | 'shop'
  | 'status'
  | 'stockDeductionMethod'
>;

export type StoreConfigDraftValidation = {
  allowed: boolean;
  message: string;
  missingFields: string[];
};

export type StoreConfigSummary = Record<StoreConfig['status'], number> & {
  authorized: number;
  expired: number;
  subscribed: number;
  total: number;
  unauthorized: number;
  unsubscribed: number;
};

export type StoreConfigSetupState = {
  currentStep: 'add-store' | 'configure-defaults' | 'ready';
  defaultsReady: boolean;
  nextActionLabel: string;
  storeReady: boolean;
};

export type StoreConfigSetupSummary = {
  configured: number;
  pendingConfig: number;
  pendingStore: number;
  storeReady: number;
  total: number;
};

export type StoreAuthorizationSeed = {
  authExpiresAt: string;
  platformStoreId: string;
  shopName: string;
};

export type StoreAuthorizationLinkSeed = {
  callbackUrl: string;
  channel: StoreConfig['channel'];
  configId: string;
  requestId: string;
};

export type StoreAuthorizationCallback = StoreAuthorizationSeed & {
  channel: StoreConfig['channel'];
  requestId: string;
};

export type ProductRowSeed = {
  cover: string;
  id: string;
  timestamp: string;
};

export type DetailPageDraft = Pick<DetailPage, 'blocks' | 'name'>;

export type MaterialLinkResult = {
  detailPageRows: DetailPage[];
  materialRows: MaterialItem[];
};

export type PrototypeSnapshot = {
  adminUsers: ManagementAdminUser[];
  channelItems: ChannelItem[];
  configs: StoreConfig[];
  customerUsers: CustomerUser[];
  customers: Customer[];
  detailPages: DetailPage[];
  inventory: InventoryItem[];
  materials: MaterialItem[];
  products: Product[];
};

export type ManagementFormValidation = {
  allowed: boolean;
  message: string;
  missingFields: string[];
};

export type ProductRelationshipSummary = {
  channelItemCount: number;
  currentDetailCount: number;
  detailPageCount: number;
  onlineChannelItemCount: number;
};

export type ChannelItemShelfAction = {
  actionLabel: string;
  message: string;
  nextStatus: ShelfStatus;
  tone: 'success' | 'warning';
};

export type InventoryFilters = {
  channel: string;
  searchTerm: string;
  shop: string;
  status: SyncStatus | '全部状态';
};

export type InventorySummary = Record<SyncStatus, number> & {
  sellable: number;
  syncIssues: number;
  total: number;
  totalStock: number;
};

export type InventoryAdjustmentFilters = {
  direction: InventoryAdjustment['direction'] | '全部类型';
  searchTerm: string;
  status: InventoryAdjustment['status'] | '全部状态';
};

export type InventoryAdjustmentDraft = {
  direction: InventoryAdjustment['direction'];
  productName: string;
  quantity: number;
  reason: string;
  shop: string;
  sku: string;
};

export type InventoryAdjustmentDraftValidation = {
  allowed: boolean;
  message: string;
  missingFields: string[];
};

export type TemplateDownloadPlan = {
  categories: string[];
  categoryCount: number;
  channelCount: number;
  channels: ChannelItem['channel'][];
  fileName: string;
  importTypeLabel: string;
  sheetCount: number;
  templateModeLabel: string;
};

export type TemplateDownloadRecord = TemplateDownloadPlan & {
  downloadedAt: string;
  id: string;
  scope: string;
};

export type ChannelCategorySelection = {
  category: string;
  channel: ChannelItem['channel'];
};

export type TemplateDownloadPlanInput = {
  categories: string[];
  channelCategory: ChannelCategorySelection | null;
  channels: ChannelItem['channel'][];
  importType: ProductImportType;
};

export type ImportRecordSummary = Record<ImportRecord['status'], number> & {
  failedRows: number;
  recordCount: number;
  successRows: number;
  totalRows: number;
};

export type ImportUploadInput = {
  category: string;
  channel: ChannelItem['channel'];
  fileName: string;
  operator: string;
  templateVersion: string;
  timestamp: string;
};

export type ImportRecordAction = {
  label: string;
  message: string;
  tone: 'info' | 'success' | 'warning';
};

export type DraftCategoryMappingContext = {
  channel: ManagementCategoryMapping['channel'];
};

export type DraftAttributeMappingContext = {
  categoryMappingId: string;
  channel: ManagementAttributeMapping['channel'];
  customerId: string;
  customerName: string;
};

export type ManagementCustomerFilters = {
  searchTerm: string;
  status: Customer['status'] | '全部状态';
};

export type ManagementAdminUserFilters = {
  role: ManagementAdminUser['role'] | '全部角色';
  searchTerm: string;
  status: UserStatus | '全部状态';
};

export type EntityStatusSummary = {
  disabled: number;
  enabled: number;
  total: number;
};

const CHANNEL_OPTIONS = ['淘宝', '拼多多', '抖音', '快手'] as const;
const CHANNEL_TEMPLATE_DOWNLOAD_LABELS: Record<ChannelItem['channel'], string> = {
  快手: '快手',
  拼多多: '拼多多',
  抖音: '抖店',
  淘宝: '淘宝',
};
const PRODUCT_STATUS_OPTIONS = ['draft', 'published', 'ready'] as const;
const SHELF_STATUS_OPTIONS = ['online', 'offline'] as const;
const DETAIL_PAGE_STATUS_OPTIONS = ['current', 'history'] as const;
const IMPORT_RECORD_STATUS_OPTIONS = ['uploaded', 'validating', 'validate_failed', 'ready_to_execute', 'executing', 'completed', 'execute_failed'] as const satisfies readonly ImportJobStatus[];
const INVENTORY_STATUS_OPTIONS = ['success', 'syncing', 'pending', 'failed'] as const;
const MATERIAL_TYPE_OPTIONS = ['主图', '详情图', 'SKU 图'] as const;
const STORE_CONFIG_STATUS_OPTIONS = ['active', 'draft', 'inactive'] as const;
const FREIGHT_TEMPLATE_OPTIONS: Record<string, string[]> = {
  快手: ['FT-KS-003', 'FT-KS-LIVE', 'FT-KS-FAST'],
  拼多多: ['FT-PDD-005', 'FT-PDD-REMOTE', 'FT-PDD-FAST'],
  抖音: ['FT-DY-002', 'FT-DY-009', 'FT-DY-LIVE'],
  淘宝: ['FT-TB-001', 'FT-TB-002', 'FT-TB-FREE'],
};
export const STORE_STOCK_DEDUCTION_OPTIONS = ['付款减库存', '拍下减库存', '发货减库存'] as const;
export const STORE_SHIPPING_ORIGIN_OPTIONS = ['浙江省 / 杭州市', '北京市 / 北京市', '上海市 / 上海市', '广东省 / 广州市'] as const;
const DEFAULT_SHIPPING_ORIGIN_BY_CHANNEL: Record<string, string> = {
  快手: '浙江省 / 杭州市',
  拼多多: '上海市 / 上海市',
  抖音: '北京市 / 北京市',
  淘宝: '浙江省 / 杭州市',
};

function parseEnum<T extends string>(value: string | null, allowed: readonly T[], fallback: T): T {
  return value && allowed.includes(value as T) ? (value as T) : fallback;
}

function buildStringSearchParams(entries: Array<[string, string, string?]>): Record<string, string> {
  return entries.reduce<Record<string, string>>((params, [key, value, fallback = '']) => {
    if (value.trim().length > 0 && value !== fallback) {
      params[key] = value.trim();
    }
    return params;
  }, {});
}

export function getDetailLimitState(detailPageRows: DetailPage[], channelItemId: string): DetailLimitState {
  const count = detailPageRows.filter((detail) => detail.channelItemId === channelItemId).length;
  const remaining = Math.max(DETAIL_PAGE_LIMIT - count, 0);

  return {
    count,
    limit: DETAIL_PAGE_LIMIT,
    limitReached: remaining === 0,
    remaining,
  };
}

export function setCurrentDetailPage(detailPageRows: DetailPage[], detailPageId: string): DetailPage[] {
  const target = detailPageRows.find((detail) => detail.id === detailPageId);
  if (!target) return detailPageRows;

  return detailPageRows.map((detail) => {
    if (detail.channelItemId !== target.channelItemId) return detail;
    return {
      ...detail,
      status: detail.id === detailPageId ? 'current' : 'history',
      updatedAt: detail.id === detailPageId ? '刚刚' : detail.updatedAt,
    };
  });
}

export function previewBatchTargets(items: ChannelItem[], filters: BatchTargetFilters): ChannelItem[] {
  const normalizedProduct = filters.product.trim().toLowerCase();

  return items.filter((item) => {
    return (
      (filters.channel === '全部渠道' || item.channel === filters.channel) &&
      (normalizedProduct.length === 0 || `${item.productName}${item.productId}${item.title}`.toLowerCase().includes(normalizedProduct)) &&
      (filters.shop === '全部店铺' || item.shop === filters.shop) &&
      (filters.shelfStatus === '全部状态' || item.shelfStatus === filters.shelfStatus)
    );
  });
}

export function canConfirmImport(state: ImportConfirmState): boolean {
  return state.hasUploadedFile && state.validationStatus === 'passed' && state.unresolvedLinks === 0;
}

export function buildImportTaskSummary(input: ImportTaskSummaryInput): ImportTaskSummary {
  const label = input.shop.trim().length === 0 ? input.channel : `${input.channel} / ${input.shop}`;

  if (!input.hasUploadedFile) {
    return {
      label,
      ready: false,
      statusText: '待上传文件',
    };
  }

  if (input.unresolvedLinks > 0) {
    return {
      label,
      ready: false,
      statusText: `需处理 ${input.unresolvedLinks} 条关联问题`,
    };
  }

  if (input.validationStatus === 'passed') {
    return {
      label,
      ready: true,
      statusText: '可确认导入',
    };
  }

  return {
    label,
    ready: false,
    statusText: input.validationStatus === 'validating' ? '校验中' : input.validationStatus === 'failed' ? '需重新校验' : '待校验',
  };
}

export function filterProductRows(rows: Product[], itemRows: ChannelItem[], filters: ProductListFilters): Product[] {
  const normalizedKeyword = filters.keyword.trim().toLowerCase();

  return rows.filter((row) => {
    const matchesKeyword =
      normalizedKeyword.length === 0 || `${row.name}${row.isbn}${row.code}`.toLowerCase().includes(normalizedKeyword);
    const matchesStatus = filters.status === '全部状态' || row.status === filters.status;
    const matchesSourceChannel =
      filters.sourceChannel === '全部渠道' ||
      itemRows.some((item) => item.productId === row.id && item.channel === filters.sourceChannel);

    return matchesKeyword && matchesStatus && matchesSourceChannel;
  });
}

export function buildProductListSearchParams(filters: ProductListFilters): Record<string, string> {
  return buildStringSearchParams([
    ['productKeyword', filters.keyword],
    ['productSourceChannel', filters.sourceChannel, '全部渠道'],
    ['productStatus', filters.status, '全部状态'],
  ]);
}

export function parseProductListFilters(search: string): ProductListFilters {
  const params = new URLSearchParams(search);
  return {
    keyword: params.get('productKeyword') ?? '',
    sourceChannel: parseEnum(params.get('productSourceChannel'), CHANNEL_OPTIONS, '全部渠道'),
    status: parseEnum(params.get('productStatus'), PRODUCT_STATUS_OPTIONS, '全部状态'),
  };
}

export function buildImportRecordListSearchParams(filters: ImportRecordListFilters): Record<string, string> {
  return buildStringSearchParams([
    ['importRecordChannel', filters.channel, '全部渠道'],
    ['importRecordStatus', filters.status, '全部状态'],
  ]);
}

export function parseImportRecordListFilters(search: string): ImportRecordListFilters {
  const params = new URLSearchParams(search);

  return {
    channel: parseEnum(params.get('importRecordChannel'), CHANNEL_OPTIONS, '全部渠道'),
    status: parseEnum(params.get('importRecordStatus'), IMPORT_RECORD_STATUS_OPTIONS, '全部状态'),
  };
}

export function buildChannelItemListSearchParams(filters: ChannelItemListFilters): Record<string, string> {
  return buildStringSearchParams([
    ['channelItemChannel', filters.channel, '全部渠道'],
    ['channelItemProduct', filters.product],
    ['channelItemShelfStatus', filters.shelfStatus, '全部状态'],
    ['channelItemShop', filters.shop, '全部店铺'],
  ]);
}

export function parseChannelItemListFilters(search: string): ChannelItemListFilters {
  const params = new URLSearchParams(search);

  return {
    channel: parseEnum(params.get('channelItemChannel'), CHANNEL_OPTIONS, '全部渠道'),
    product: params.get('channelItemProduct') ?? '',
    shelfStatus: parseEnum(params.get('channelItemShelfStatus'), SHELF_STATUS_OPTIONS, '全部状态'),
    shop: params.get('channelItemShop') ?? '全部店铺',
  };
}

export function buildDetailPageListSearchParams(filters: DetailPageListFilters): Record<string, string> {
  return buildStringSearchParams([
    ['detailPageChannel', filters.channel, '全部渠道'],
    ['detailPageChannelItem', filters.channelItem],
    ['detailPageName', filters.detailName],
    ['detailPageProduct', filters.product],
    ['detailPageShop', filters.shop, '全部店铺'],
    ['detailPageStatus', filters.status, '全部状态'],
  ]);
}

export function parseDetailPageListFilters(search: string): DetailPageListFilters {
  const params = new URLSearchParams(search);

  return {
    channel: parseEnum(params.get('detailPageChannel'), CHANNEL_OPTIONS, '全部渠道'),
    channelItem: params.get('detailPageChannelItem') ?? '',
    detailName: params.get('detailPageName') ?? '',
    product: params.get('detailPageProduct') ?? '',
    shop: params.get('detailPageShop') ?? '全部店铺',
    status: parseEnum(params.get('detailPageStatus'), DETAIL_PAGE_STATUS_OPTIONS, '全部状态'),
  };
}

export function serializePrototypeSnapshot(snapshot: PrototypeSnapshot): string {
  return JSON.stringify(snapshot);
}

export function parsePrototypeSnapshot(raw: string | null | undefined, fallback: PrototypeSnapshot): PrototypeSnapshot {
  if (!raw) return fallback;

  try {
    const parsed = JSON.parse(raw) as Partial<PrototypeSnapshot>;
    const keys: Array<keyof PrototypeSnapshot> = ['adminUsers', 'channelItems', 'configs', 'customerUsers', 'customers', 'detailPages', 'inventory', 'materials', 'products'];
    const isValid = keys.every((key) => Array.isArray(parsed[key]));

    if (!isValid) {
      return fallback;
    }

    return {
      ...(parsed as PrototypeSnapshot),
      configs: normalizeStoreConfigRows(parsed.configs as StoreConfig[]),
    };
  } catch {
    return fallback;
  }
}

export function createProductRowFromDraft(draft: ProductDraft, seed: ProductRowSeed): Product {
  return {
    author: draft.author,
    category: draft.category,
    channelCount: 0,
    code: draft.code,
    cover: seed.cover,
    detailPageCount: 0,
    id: seed.id,
    isbn: draft.isbn,
    name: draft.name,
    publisher: draft.publisher,
    status: 'draft',
    updatedAt: seed.timestamp,
  };
}

export function updateProductRows(
  rows: Product[],
  productId: string,
  patch: Partial<Pick<Product, 'author' | 'category' | 'code' | 'cover' | 'isbn' | 'name' | 'publisher' | 'status'>>,
  timestamp: string,
): Product[] {
  return rows.map((row) => (
    row.id === productId
      ? {
          ...row,
          ...patch,
          updatedAt: timestamp,
        }
      : row
  ));
}

export function updateChannelItemRows(
  rows: ChannelItem[],
  channelItemId: string,
  patch: Partial<Pick<ChannelItem, 'price' | 'shelfStatus' | 'title'>>,
  timestamp: string,
): ChannelItem[] {
  return rows.map((row) => (
    row.id === channelItemId
      ? {
          ...row,
          ...patch,
          updatedAt: timestamp,
        }
      : row
  ));
}

export function saveDetailPageRows(rows: DetailPage[], detailPageId: string, patch: DetailPageDraft, timestamp: string): DetailPage[] {
  return rows.map((row) => (
    row.id === detailPageId
      ? {
          ...row,
          ...patch,
          updatedAt: timestamp,
        }
      : row
  ));
}

export function updateDetailPageBlock(
  blocks: DetailPageBlock[],
  blockId: string,
  patch: Partial<Pick<DetailPageBlock, 'asset' | 'body' | 'title' | 'type'>>,
): DetailPageBlock[] {
  return blocks.map((block) => (block.id === blockId ? { ...block, ...patch } : block));
}

export function moveDetailPageBlock(
  blocks: DetailPageBlock[],
  blockId: string,
  direction: 'down' | 'up',
): DetailPageBlock[] {
  const currentIndex = blocks.findIndex((block) => block.id === blockId);
  if (currentIndex < 0) return blocks;

  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= blocks.length) return blocks;

  const nextBlocks = [...blocks];
  [nextBlocks[currentIndex], nextBlocks[targetIndex]] = [nextBlocks[targetIndex]!, nextBlocks[currentIndex]!];
  return nextBlocks;
}

export function appendDetailPageBlock(blocks: DetailPageBlock[], block: DetailPageBlock): DetailPageBlock[] {
  return [...blocks, block];
}

export function removeDetailPageBlock(blocks: DetailPageBlock[], blockId: string): DetailPageBlock[] {
  const nextBlocks = blocks.filter((block) => block.id !== blockId);
  return nextBlocks.length === 0 ? blocks : nextBlocks;
}

export function buildTemplateDownloadPlan(input: TemplateDownloadPlanInput): TemplateDownloadPlan {
  const orderedChannels = input.importType === 'online-item'
    ? (['淘宝', '拼多多', '抖音', '快手'] as const).filter((channel) => input.channels.includes(channel)).slice(0, 1)
    : [];
  const channelCategory = input.channelCategory && orderedChannels.includes(input.channelCategory.channel)
    ? input.channelCategory.category.trim()
    : '';
  const categories = input.importType === 'online-item'
    ? (channelCategory ? [channelCategory] : [])
    : Array.from(new Set(input.categories.map((category) => category.trim()).filter(Boolean)));
  const importTypeLabel = input.importType === 'online-item' ? '渠道商品导入' : '产品资料导入';
  const templateModeLabel = input.importType === 'online-item' ? '单渠道+单渠道类目模板' : '按产品类目分子表';
  const sheetCount = input.importType === 'online-item'
    ? (orderedChannels.length > 0 && channelCategory ? 1 : 0)
    : categories.length;
  const channelTemplateLabel = orderedChannels[0] ? CHANNEL_TEMPLATE_DOWNLOAD_LABELS[orderedChannels[0]] : '未选渠道';
  const scopeSuffix = input.importType === 'online-item'
    ? `${channelTemplateLabel}-1个渠道类目`
    : `${categories.length}个类目`;

  return {
    categories,
    categoryCount: categories.length,
    channelCount: orderedChannels.length,
    channels: [...orderedChannels],
    fileName: sheetCount === 0 ? '未选择导入范围模板.xlsx' : `${importTypeLabel}模板-${scopeSuffix}.xlsx`,
    importTypeLabel,
    sheetCount,
    templateModeLabel,
  };
}

export function addTemplateDownloadRecord(
  records: TemplateDownloadRecord[],
  record: TemplateDownloadRecord,
  limit = 10,
): TemplateDownloadRecord[] {
  return [record, ...records].slice(0, limit);
}

export function validateProductDraft(draft: ProductDraft): ProductDraftValidation {
  const missingFields = [
    ['图书名称', draft.name],
    ['ISBN', draft.isbn],
    ['商家编码', draft.code],
    ['作者', draft.author],
    ['出版社', draft.publisher],
    ['分类', draft.category],
    ['默认标题', draft.defaultTitle],
  ]
    .filter(([, value]) => String(value).trim().length === 0)
    .map(([label]) => label);

  if (!draft.coverUploaded) {
    missingFields.push('封面');
  }

  return {
    allowed: missingFields.length === 0,
    message:
      missingFields.length === 0
        ? '产品草稿信息完整，可以保存并进入渠道商品创建。'
        : `请补齐 ${missingFields.join('、')} 后再保存产品草稿。`,
    missingFields,
  };
}

export function buildBatchEditSubmission(targets: ChannelItem[], draft: BatchEditDraft): BatchEditSubmission {
  const changedFields = [
    draft.titleSuffix.trim() ? '标题后缀' : '',
    draft.priceDelta !== 0 ? '价格调整' : '',
    draft.nextShelfStatus !== '保持不变' ? '上下架状态' : '',
  ].filter(Boolean);

  if (targets.length === 0) {
    return {
      allowed: false,
      changedFields,
      message: '当前没有命中渠道商品，不能提交批量修改。',
    };
  }

  if (changedFields.length === 0) {
    return {
      allowed: false,
      changedFields,
      message: '请至少填写一个批量修改字段。',
    };
  }

  return {
    allowed: true,
    changedFields,
    message: `已提交批量修改任务，影响 ${targets.length} 个渠道商品，修改字段：${changedFields.join('、')}。`,
  };
}

export function summarizeImportRecords(rows: ImportRecord[]): ImportRecordSummary {
  return rows.reduce<ImportRecordSummary>(
    (summary, row) => {
      summary.recordCount += 1;
      summary.totalRows += row.total;
      summary.successRows += row.success;
      summary.failedRows += row.failed;
      summary[row.status] += 1;
      return summary;
    },
    {
      completed: 0,
      execute_failed: 0,
      executing: 0,
      failedRows: 0,
      ready_to_execute: 0,
      recordCount: 0,
      successRows: 0,
      totalRows: 0,
      uploaded: 0,
      validate_failed: 0,
      validating: 0,
    },
  );
}

export function buildImportRecordAction(record: Pick<ImportRecord, 'id' | 'status'>): ImportRecordAction {
  if (record.status === 'validate_failed' || record.status === 'execute_failed') {
    return {
      label: '下载失败明细',
      message: `已下载 ${record.id} 的失败明细，请修正文件后拖入新文件重新导入。`,
      tone: 'warning',
    };
  }

  if (record.status === 'uploaded' || record.status === 'validating' || record.status === 'executing') {
    return {
      label: '刷新状态',
      message: `已刷新 ${record.id} 的导入任务状态，等待自动校验或执行完成。`,
      tone: 'info',
    };
  }

  if (record.status === 'ready_to_execute') {
    return {
      label: '确认导入',
      message: `${record.id} 已校验通过，可以确认导入落库。`,
      tone: 'success',
    };
  }

  return {
    label: '下载结果',
    message: `已下载 ${record.id} 的导入结果和错误明细。`,
    tone: 'success',
  };
}

export function createImportRecordFromUpload(rows: ImportRecord[], input: ImportUploadInput): ImportRecord {
  const nextNumber = rows.reduce((max, row) => {
    const match = /^imp-(\d+)$/.exec(row.id);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0) + 1;

  return {
    category: input.category,
    channel: input.channel,
    createdAt: input.timestamp,
    failed: 0,
    fileName: input.fileName,
    id: `imp-${nextNumber}`,
    importType: '渠道商品导入',
    operator: input.operator,
    shop: '按模板识别',
    status: 'validating',
    success: 0,
    templateVersion: input.templateVersion,
    total: 0,
  };
}

export function syncInventoryRows(rows: InventoryItem[], timestamp: string): InventoryItem[] {
  return rows.map((row) => ({
    ...row,
    status: 'success',
    updatedAt: timestamp,
  }));
}

export function filterInventoryRows(rows: InventoryItem[], filters: InventoryFilters): InventoryItem[] {
  const normalizedSearchTerm = filters.searchTerm.trim().toLowerCase();

  return rows.filter((row) => {
    const matchesChannel = filters.channel === '全部渠道' || row.channel === filters.channel;
    const matchesShop = filters.shop === '全部店铺' || row.shop === filters.shop;
    const matchesStatus = filters.status === '全部状态' || row.status === filters.status;
    const matchesSearch =
      normalizedSearchTerm.length === 0 ||
      `${row.productName}${row.sku}${row.channel}${row.shop}`.toLowerCase().includes(normalizedSearchTerm);

    return matchesChannel && matchesShop && matchesStatus && matchesSearch;
  });
}

export function buildInventoryListSearchParams(filters: InventoryFilters): Record<string, string> {
  return buildStringSearchParams([
    ['inventoryChannel', filters.channel, '全部渠道'],
    ['inventorySearchTerm', filters.searchTerm],
    ['inventoryShop', filters.shop, '全部店铺'],
    ['inventoryStatus', filters.status, '全部状态'],
  ]);
}

export function parseInventoryListFilters(search: string): InventoryFilters {
  const params = new URLSearchParams(search);

  return {
    channel: parseEnum(params.get('inventoryChannel'), CHANNEL_OPTIONS, '全部渠道'),
    searchTerm: params.get('inventorySearchTerm') ?? '',
    shop: params.get('inventoryShop') ?? '全部店铺',
    status: parseEnum(params.get('inventoryStatus'), INVENTORY_STATUS_OPTIONS, '全部状态'),
  };
}

export function summarizeInventoryRows(rows: InventoryItem[]): InventorySummary {
  return rows.reduce<InventorySummary>(
    (summary, row) => {
      summary.total += 1;
      summary.totalStock += row.total;
      summary.sellable += row.sellable;
      summary[row.status] += 1;
      summary.syncIssues = summary.total - summary.success;
      return summary;
    },
    { failed: 0, pending: 0, sellable: 0, success: 0, syncing: 0, syncIssues: 0, total: 0, totalStock: 0 },
  );
}

export function filterInventoryAdjustments(rows: InventoryAdjustment[], filters: InventoryAdjustmentFilters): InventoryAdjustment[] {
  const normalizedSearchTerm = filters.searchTerm.trim().toLowerCase();

  return rows.filter((row) => {
    const matchesDirection = filters.direction === '全部类型' || row.direction === filters.direction;
    const matchesStatus = filters.status === '全部状态' || row.status === filters.status;
    const matchesSearch =
      normalizedSearchTerm.length === 0 ||
      `${row.productName}${row.sku}${row.channel}${row.shop}${row.reason}${row.operator}`.toLowerCase().includes(normalizedSearchTerm);

    return matchesDirection && matchesStatus && matchesSearch;
  });
}

export function validateInventoryAdjustmentDraft(draft: InventoryAdjustmentDraft): InventoryAdjustmentDraftValidation {
  const missingFields = [
    ['产品', draft.productName],
    ['SKU', draft.sku],
    ['店铺', draft.shop],
    ['调整原因', draft.reason],
  ]
    .filter(([, value]) => String(value).trim().length === 0)
    .map(([label]) => label);

  if (draft.quantity === 0 || Number.isNaN(draft.quantity)) {
    missingFields.splice(3, 0, '调整数量');
  }

  return {
    allowed: missingFields.length === 0,
    message: missingFields.length === 0 ? '库存调整草稿完整，可以提交。' : `请补齐 ${missingFields.join('、')} 后再提交库存调整。`,
    missingFields,
  };
}

export function reuseMaterial(rows: MaterialItem[], assetId: string, detailPageId: string): MaterialItem[] {
  return rows.map((row) => {
    if (row.id !== assetId || row.detailPageIds.includes(detailPageId)) {
      return row;
    }

    return {
      ...row,
      detailPageIds: [...row.detailPageIds, detailPageId],
      usedBy: row.usedBy + 1,
    };
  });
}

export function linkMaterialToDetailPage({
  assetId,
  detailPageId,
  detailPageRows,
  materialRows,
  timestamp,
}: {
  assetId: string;
  detailPageId: string;
  detailPageRows: DetailPage[];
  materialRows: MaterialItem[];
  timestamp: string;
}): MaterialLinkResult {
  const sourceAsset = materialRows.find((row) => row.id === assetId);
  const alreadyLinked = sourceAsset?.detailPageIds.includes(detailPageId) ?? false;

  if (alreadyLinked) {
    return {
      detailPageRows,
      materialRows,
    };
  }

  return {
    detailPageRows: detailPageRows.map((row) => (
      row.id === detailPageId
        ? {
            ...row,
            assetCount: row.assetCount + 1,
            updatedAt: timestamp,
          }
        : row
    )),
    materialRows: reuseMaterial(materialRows, assetId, detailPageId),
  };
}

export function buildDraftStoreConfigRow(nextId: string, timestamp: string): StoreConfig {
  return {
    appServiceName: '淘宝店铺服务应用',
    appSubscriptionStatus: 'unsubscribed',
    authExpiresAt: '待授权',
    authorizationStatus: 'unauthorized',
    channel: '淘宝',
    defaultCategory: '待选择默认类目',
    defaultShelfStatus: 'offline',
    deliverySla: '48 小时内发货',
    freightTemplate: '',
    id: nextId,
    platformStoreId: '',
    shippingOrigin: '浙江省 / 杭州市',
    shop: '待授权店铺',
    status: 'draft',
    stockDeductionMethod: '付款减库存',
    updatedAt: timestamp,
  };
}

export function normalizeStoreConfigRows(rows: StoreConfig[]): StoreConfig[] {
  return rows.map((row) => {
    const authorizationStatus = row.authorizationStatus ?? (row.status === 'draft' ? 'unauthorized' : row.status === 'inactive' ? 'expired' : 'authorized');
    const appSubscriptionStatus = row.appSubscriptionStatus ?? 'subscribed';
    const authExpiresAt = row.authExpiresAt ?? (authorizationStatus === 'authorized' ? '2027-04-26' : authorizationStatus === 'expired' ? '已过期' : '待授权');
    const platformStoreId = row.platformStoreId ?? (authorizationStatus === 'unauthorized' ? '' : `STORE-${row.id.toUpperCase()}`);

    return {
      ...row,
      appServiceName: row.appServiceName ?? `${row.channel}店铺服务应用`,
      appSubscriptionStatus,
      authExpiresAt,
      authorizationStatus,
      defaultCategory: row.defaultCategory ?? '标准图书 / 少儿百科',
      platformStoreId,
      shippingOrigin: row.shippingOrigin ?? DEFAULT_SHIPPING_ORIGIN_BY_CHANNEL[row.channel] ?? STORE_SHIPPING_ORIGIN_OPTIONS[0],
      stockDeductionMethod: row.stockDeductionMethod ?? STORE_STOCK_DEDUCTION_OPTIONS[0],
    };
  }).filter((row) => (
    row.authorizationStatus !== 'unauthorized' ||
    (row.platformStoreId.trim().length > 0 && row.shop.trim().length > 0 && row.shop !== '待授权店铺')
  ));
}

export function buildStoreAppSubscriptionPatch(channel: StoreConfig['channel']): Pick<StoreConfigDraft, 'appServiceName' | 'appSubscriptionStatus'> {
  return {
    appServiceName: `${channel}店铺服务应用`,
    appSubscriptionStatus: 'subscribed',
  };
}

export function getStoreFreightTemplateOptions(channel: StoreConfig['channel']): string[] {
  return FREIGHT_TEMPLATE_OPTIONS[channel] ?? [];
}

export function buildStoreAuthorizationLink(seed: StoreAuthorizationLinkSeed): string {
  const url = new URL('https://platform-auth.book-channel.local/store/authorize');
  url.searchParams.set('platform', seed.channel);
  url.searchParams.set('configId', seed.configId);
  url.searchParams.set('state', seed.requestId);
  url.searchParams.set('redirectUri', seed.callbackUrl);
  return url.toString();
}

export function buildStoreAuthorizationPatch(seed: StoreAuthorizationSeed): Pick<StoreConfigDraft, 'authExpiresAt' | 'authorizationStatus' | 'platformStoreId' | 'shop'> {
  return {
    authExpiresAt: seed.authExpiresAt,
    authorizationStatus: 'authorized',
    platformStoreId: seed.platformStoreId,
    shop: seed.shopName,
  };
}

export function buildStoreAuthorizationCallbackPatch(callback: StoreAuthorizationCallback): Pick<
  StoreConfigDraft,
  'appServiceName' | 'appSubscriptionStatus' | 'authExpiresAt' | 'authorizationStatus' | 'channel' | 'platformStoreId' | 'shop'
> {
  return {
    ...buildStoreAppSubscriptionPatch(callback.channel),
    ...buildStoreAuthorizationPatch(callback),
    channel: callback.channel,
  };
}

export function createStoreConfigRowFromAuthorizationCallback(nextId: string, timestamp: string, callback: StoreAuthorizationCallback): StoreConfig {
  return {
    ...buildDraftStoreConfigRow(nextId, timestamp),
    ...buildStoreAuthorizationCallbackPatch(callback),
    status: 'draft',
    updatedAt: timestamp,
  };
}

export function isStoreConfigIdentityLocked(draft: StoreConfigDraft): boolean {
  return (
    (draft.authorizationStatus === 'authorized' || draft.authorizationStatus === 'expired') &&
    draft.platformStoreId.trim().length > 0 &&
    draft.shop.trim().length > 0 &&
    draft.shop !== '待授权店铺'
  );
}

function omitLockedStoreIdentityPatch(patch: Partial<StoreConfigDraft>): Partial<StoreConfigDraft> {
  const {
    appServiceName: _appServiceName,
    appSubscriptionStatus: _appSubscriptionStatus,
    authExpiresAt: _authExpiresAt,
    authorizationStatus: _authorizationStatus,
    channel: _channel,
    platformStoreId: _platformStoreId,
    shop: _shop,
    ...configPatch
  } = patch;
  return configPatch;
}

export function completeStoreAuthorizationFromCallback(
  rows: StoreConfig[],
  configId: string,
  callback: StoreAuthorizationCallback,
  timestamp: string,
): StoreConfig[] {
  const patch = buildStoreAuthorizationCallbackPatch(callback);
  return rows.map((row) => {
    if (row.id !== configId) return row;

    if (!isStoreConfigIdentityLocked(row)) {
      return {
        ...row,
        ...patch,
        updatedAt: timestamp,
      };
    }

    return {
      ...row,
      appSubscriptionStatus: patch.appSubscriptionStatus,
      authExpiresAt: patch.authExpiresAt,
      authorizationStatus: patch.authorizationStatus,
      updatedAt: timestamp,
    };
  });
}

export function getStoreConfigSetupState(draft: StoreConfigDraft): StoreConfigSetupState {
  const storeReady =
    draft.appSubscriptionStatus === 'subscribed' &&
    (draft.authorizationStatus === 'authorized' || draft.authorizationStatus === 'expired') &&
    draft.platformStoreId.trim().length > 0 &&
    draft.shop.trim().length > 0 &&
    draft.shop !== '待授权店铺' &&
    draft.authExpiresAt.trim().length > 0 &&
    draft.authExpiresAt !== '待授权';
  const defaultsReady =
    storeReady &&
    draft.defaultCategory.trim().length > 0 &&
    draft.defaultCategory !== '待选择默认类目' &&
    draft.freightTemplate.trim().length > 0 &&
    draft.shippingOrigin.trim().length > 0 &&
    draft.stockDeductionMethod.trim().length > 0 &&
    draft.deliverySla.trim().length > 0;

  if (!storeReady) {
    return {
      currentStep: 'add-store',
      defaultsReady,
      nextActionLabel: '先添加店铺',
      storeReady,
    };
  }

  if (!defaultsReady) {
    return {
      currentStep: 'configure-defaults',
      defaultsReady,
      nextActionLabel: '维护店铺配置',
      storeReady,
    };
  }

  return {
    currentStep: 'ready',
    defaultsReady,
    nextActionLabel: '可以保存配置',
    storeReady,
  };
}

export function getStoreConfigAutoStatus(draft: StoreConfigDraft): StoreConfig['status'] {
  if (draft.authorizationStatus === 'expired') return 'inactive';
  return getStoreConfigSetupState(draft).defaultsReady ? 'active' : 'draft';
}

export function summarizeStoreConfigSetupRows(rows: StoreConfig[]): StoreConfigSetupSummary {
  return rows.reduce<StoreConfigSetupSummary>(
    (summary, row) => {
      const state = getStoreConfigSetupState(row);
      summary.total += 1;
      if (state.storeReady) summary.storeReady += 1;
      if (!state.storeReady) summary.pendingStore += 1;
      if (state.storeReady && !state.defaultsReady) summary.pendingConfig += 1;
      if (state.defaultsReady) summary.configured += 1;
      return summary;
    },
    { configured: 0, pendingConfig: 0, pendingStore: 0, storeReady: 0, total: 0 },
  );
}

export function filterStoreConfigRows(rows: StoreConfig[], filters: StoreConfigListFilters): StoreConfig[] {
  const normalizedShop = filters.shop.trim().toLowerCase();

  return rows.filter((config) => {
    const matchesChannel = filters.channel === '全部渠道' || config.channel === filters.channel;
    const matchesShop =
      normalizedShop.length === 0 ||
      `${config.shop}${config.freightTemplate}${config.defaultCategory}${config.appServiceName}${config.authExpiresAt}${config.shippingOrigin}${config.stockDeductionMethod}`.toLowerCase().includes(normalizedShop);
    const matchesStatus = filters.status === '全部状态' || config.status === filters.status;

    return matchesChannel && matchesShop && matchesStatus;
  });
}

export function summarizeStoreConfigRows(rows: StoreConfig[]): StoreConfigSummary {
  return rows.reduce<StoreConfigSummary>(
    (summary, row) => {
      summary.total += 1;
      summary[row.status] += 1;
      summary[row.authorizationStatus] += 1;
      summary[row.appSubscriptionStatus] += 1;
      return summary;
    },
    { active: 0, authorized: 0, draft: 0, expired: 0, inactive: 0, subscribed: 0, total: 0, unauthorized: 0, unsubscribed: 0 },
  );
}

export function validateStoreConfigDraft(draft: StoreConfigDraft): StoreConfigDraftValidation {
  const missingFields = [
    [draft.appSubscriptionStatus === 'subscribed' ? 'done' : '', '服务应用订购'],
    [draft.authorizationStatus === 'authorized' && draft.platformStoreId.trim().length > 0 ? 'done' : '', '平台店铺授权'],
    [draft.shop === '待授权店铺' ? '' : draft.shop, '店铺名称'],
    [draft.authExpiresAt === '待授权' ? '' : draft.authExpiresAt, '授权有效期'],
    [draft.defaultCategory === '待选择默认类目' ? '' : draft.defaultCategory, '默认类目'],
    [draft.stockDeductionMethod, '库存扣减方式'],
    [draft.freightTemplate, '默认运费模板'],
    [draft.deliverySla, '发货时效'],
    [draft.shippingOrigin, '发货地省市'],
  ]
    .filter(([value]) => String(value).trim().length === 0)
    .map(([, label]) => String(label));

  return {
    allowed: missingFields.length === 0,
    message:
      missingFields.length === 0
        ? '店铺授权与店铺配置完整，可以保存。'
        : `请先完成${missingFields.join('、')}后再保存店铺配置。`,
    missingFields,
  };
}

export function saveStoreConfigRows(
  rows: StoreConfig[],
  configId: string,
  patch: Partial<StoreConfigDraft>,
  timestamp: string,
): StoreConfig[] {
  return rows.map((row) => {
    if (row.id !== configId) return row;
    const configPatch = isStoreConfigIdentityLocked(row) ? omitLockedStoreIdentityPatch(patch) : patch;
    return {
      ...row,
      ...configPatch,
      updatedAt: timestamp,
    };
  });
}

export function buildStoreConfigListSearchParams(filters: StoreConfigListFilters): Record<string, string> {
  return buildStringSearchParams([
    ['storeConfigChannel', filters.channel, '全部渠道'],
    ['storeConfigShop', filters.shop],
    ['storeConfigStatus', filters.status, '全部状态'],
  ]);
}

export function parseStoreConfigListFilters(search: string): StoreConfigListFilters {
  const params = new URLSearchParams(search);

  return {
    channel: parseEnum(params.get('storeConfigChannel'), CHANNEL_OPTIONS, '全部渠道'),
    shop: params.get('storeConfigShop') ?? '',
    status: parseEnum(params.get('storeConfigStatus'), STORE_CONFIG_STATUS_OPTIONS, '全部状态'),
  };
}

export function filterMaterialRows(
  rows: MaterialItem[],
  filters: MaterialListFilters,
  context: {
    channelItemRows: ChannelItem[];
    detailPageRows: DetailPage[];
    productRows: Product[];
  },
): MaterialItem[] {
  const normalizedKeyword = filters.keyword.trim().toLowerCase();
  const normalizedBindObject = filters.bindObject.trim().toLowerCase();

  return rows.filter((row) => {
    const product = context.productRows.find((productRow) => productRow.id === row.productId);
    const relatedDetails = context.detailPageRows.filter((detail) => row.detailPageIds.includes(detail.id));
    const relatedItems = relatedDetails
      .map((detail) => context.channelItemRows.find((item) => item.id === detail.channelItemId))
      .filter((item): item is ChannelItem => Boolean(item));

    const bindObjectText = [
      product?.name ?? '',
      product?.code ?? '',
      ...relatedItems.map((item) => `${item.title}${item.itemCode}${item.channel}${item.shop}`),
      ...relatedDetails.map((detail) => detail.name),
    ]
      .join('')
      .toLowerCase();

    const keywordText = [
      row.fileName,
      row.type,
      row.size,
      product?.name ?? '',
      product?.code ?? '',
      ...relatedItems.map((item) => `${item.title}${item.itemCode}${item.channel}${item.shop}`),
      ...relatedDetails.map((detail) => detail.name),
    ]
      .join('')
      .toLowerCase();
    const matchesKeyword = normalizedKeyword.length === 0 || keywordText.includes(normalizedKeyword);
    const matchesType = filters.type === '全部类型' || row.type === filters.type;
    const matchesBindObject = normalizedBindObject.length === 0 || bindObjectText.includes(normalizedBindObject);
    const matchesChannel =
      filters.channel === '全部渠道' || relatedItems.some((item) => item.channel === filters.channel);

    return matchesKeyword && matchesType && matchesBindObject && matchesChannel;
  });
}

export function summarizeMaterialProductFolders(rows: MaterialItem[], products: Product[]): MaterialProductFolderSummary[] {
  const productById = new Map(products.map((product) => [product.id, product]));
  const summaries = new Map<string, MaterialProductFolderSummary>();

  rows.forEach((asset) => {
    const product = productById.get(asset.productId);
    const current = summaries.get(asset.productId) ?? {
      detailImageCount: 0,
      mainImageCount: 0,
      previewSrc: asset.src,
      productCode: product?.code ?? asset.productId,
      productId: asset.productId,
      productName: product?.name ?? '未关联产品',
      skuImageCount: 0,
      total: 0,
      usedBy: 0,
    };

    current.total += 1;
    current.usedBy += asset.usedBy;
    if (!current.previewSrc) current.previewSrc = asset.src;
    if (asset.type === '主图') current.mainImageCount += 1;
    if (asset.type === '详情图') current.detailImageCount += 1;
    if (asset.type === 'SKU 图') current.skuImageCount += 1;
    summaries.set(asset.productId, current);
  });

  return Array.from(summaries.values()).sort((left, right) => right.total - left.total || left.productName.localeCompare(right.productName, 'zh-Hans-CN'));
}

export function summarizeMaterialTypeFolders(rows: MaterialItem[]): MaterialTypeFolderSummary[] {
  return MATERIAL_TYPE_OPTIONS.map((type) => {
    const assets = rows.filter((asset) => asset.type === type);
    return {
      assets,
      total: assets.length,
      type,
      usedBy: assets.reduce((sum, asset) => sum + asset.usedBy, 0),
    };
  });
}

export function buildMaterialListSearchParams(filters: MaterialListFilters): Record<string, string> {
  return buildStringSearchParams([
    ['materialBindObject', filters.bindObject],
    ['materialChannel', filters.channel, '全部渠道'],
    ['materialKeyword', filters.keyword],
    ['materialType', filters.type, '全部类型'],
  ]);
}

export function parseMaterialListFilters(search: string): MaterialListFilters {
  const params = new URLSearchParams(search);

  return {
    bindObject: params.get('materialBindObject') ?? '',
    channel: parseEnum(params.get('materialChannel'), CHANNEL_OPTIONS, '全部渠道'),
    keyword: params.get('materialKeyword') ?? '',
    type: parseEnum(params.get('materialType'), MATERIAL_TYPE_OPTIONS, '全部类型'),
  };
}

export function filterManagementCategoryMappings(
  rows: ManagementCategoryMapping[],
  filters: Pick<ManagementMappingFilters, 'searchTerm'>,
): ManagementCategoryMapping[] {
  const normalizedSearchTerm = filters.searchTerm.trim().toLowerCase();

  return rows.filter((row) => {
    const matchesSearch =
      normalizedSearchTerm.length === 0 ||
      `${row.channel}${row.channelCategoryName}${row.channelCategoryId}${row.standardCategoryName}${row.standardCategoryId}${row.shopScope}`
        .toLowerCase()
        .includes(normalizedSearchTerm);

    return matchesSearch;
  });
}

export function summarizeManagementCategoryMappings(rows: ManagementCategoryMapping[]): MappingSummary {
  return rows.reduce<MappingSummary>(
    (summary, row) => {
      summary.total += 1;
      summary[row.status] += 1;
      return summary;
    },
    { active: 0, inactive: 0, total: 0 },
  );
}

export function summarizeProductExport(rows: Product[]): ProductExportSummary {
  return rows.reduce<ProductExportSummary>(
    (summary, row) => {
      summary.total += 1;
      if (row.status === 'published') {
        summary.published += 1;
      }
      if (row.status === 'ready') {
        summary.ready += 1;
      }
      summary.unpublished = summary.total - summary.published;
      return summary;
    },
    { published: 0, ready: 0, total: 0, unpublished: 0 },
  );
}

export function summarizeProductRelationships({
  channelItems: itemRows,
  detailPages: detailRows,
  productId,
}: {
  channelItems: ChannelItem[];
  detailPages: DetailPage[];
  productId: string;
}): ProductRelationshipSummary {
  const relatedItems = itemRows.filter((item) => item.productId === productId);
  const relatedDetailPages = detailRows.filter((detail) => detail.productId === productId);

  return {
    channelItemCount: relatedItems.length,
    currentDetailCount: relatedDetailPages.filter((detail) => detail.status === 'current').length,
    detailPageCount: relatedDetailPages.length,
    onlineChannelItemCount: relatedItems.filter((item) => item.shelfStatus === 'online').length,
  };
}

export function buildChannelItemShelfAction(item: Pick<ChannelItem, 'shelfStatus'>): ChannelItemShelfAction {
  if (item.shelfStatus === 'online') {
    return {
      actionLabel: '下架商品',
      message: '商品将切换为下架，用户端仍保留详情页和素材关系。',
      nextStatus: 'offline',
      tone: 'warning',
    };
  }

  return {
    actionLabel: '上架商品',
    message: '商品将切换为上架，继续使用当前详情页和店铺售卖配置。',
    nextStatus: 'online',
    tone: 'success',
  };
}

export function filterManagementAttributeMappings(
  rows: ManagementAttributeMapping[],
  filters: ManagementMappingFilters,
): ManagementAttributeMapping[] {
  const normalizedSearchTerm = filters.searchTerm.trim().toLowerCase();

  return rows.filter((row) => {
    const matchesCustomer = !filters.customerId || row.customerId === filters.customerId;
    const matchesCategoryMapping = !filters.categoryMappingId || row.mappingId === filters.categoryMappingId;
    const matchesSearch =
      normalizedSearchTerm.length === 0 ||
      `${row.customerName}${row.channel}${row.channelAttributeName}${row.channelAttributeValue}${row.standardAttributeName}${row.standardAttributeValue}`
        .toLowerCase()
        .includes(normalizedSearchTerm);

    return matchesCustomer && matchesCategoryMapping && matchesSearch;
  });
}

export function summarizeManagementAttributeMappings(rows: ManagementAttributeMapping[]): MappingSummary {
  return rows.reduce<MappingSummary>(
    (summary, row) => {
      summary.total += 1;
      summary[row.status] += 1;
      return summary;
    },
    { active: 0, inactive: 0, total: 0 },
  );
}

export function buildDraftCategoryMapping(
  template: ManagementCategoryMapping,
  context: DraftCategoryMappingContext,
): ManagementCategoryMapping {
  return {
    ...template,
    channel: context.channel,
    channelCategoryId: '',
    channelCategoryName: '',
    id: 'draft-category-mapping',
    shopScope: '待选择店铺范围',
    standardCategoryId: '',
    standardCategoryName: '',
    status: 'inactive',
    updatedAt: '未保存',
  };
}

export function buildDraftAttributeMapping(
  template: ManagementAttributeMapping,
  context: DraftAttributeMappingContext,
): ManagementAttributeMapping {
  return {
    ...template,
    channel: context.channel,
    channelAttributeName: '',
    channelAttributeValue: '',
    customerId: context.customerId,
    customerName: context.customerName,
    id: 'draft-attribute-mapping',
    mappingId: context.categoryMappingId,
    standardAttributeName: '',
    standardAttributeValue: '',
    status: 'inactive',
    updatedAt: '未保存',
  };
}

export function filterManagementCustomers(rows: Customer[], filters: ManagementCustomerFilters): Customer[] {
  const normalizedSearchTerm = filters.searchTerm.trim().toLowerCase();

  return rows.filter((row) => {
    const matchesStatus = filters.status === '全部状态' || row.status === filters.status;
    const matchesSearch =
      normalizedSearchTerm.length === 0 ||
      `${row.name}${row.code}${row.note}`.toLowerCase().includes(normalizedSearchTerm);

    return matchesStatus && matchesSearch;
  });
}

export function summarizeManagementCustomers(rows: Customer[]): EntityStatusSummary {
  return rows.reduce<EntityStatusSummary>(
    (summary, row) => {
      summary.total += 1;
      summary[row.status] += 1;
      return summary;
    },
    { disabled: 0, enabled: 0, total: 0 },
  );
}

export function buildDraftCustomer(template: Customer): Customer {
  return {
    ...template,
    code: '',
    id: 'draft-customer',
    name: '',
    note: '',
    shopCount: 0,
    status: 'disabled',
    updatedAt: '未保存',
    userCount: 0,
  };
}

export function buildDraftCustomerUser(customerId: string): CustomerUser {
  return {
    createdAt: '未保存',
    customerId,
    email: '',
    id: 'draft-customer-user',
    lastLogin: '未登录',
    name: '',
    phone: '',
    role: '商户操作员',
    status: 'disabled',
    updatedAt: '未保存',
    username: '',
  };
}

export function validateManagementCustomerDraft(draft: Customer): ManagementFormValidation {
  const missingFields = [
    draft.name.trim().length === 0 ? '客户名称' : null,
    draft.code.trim().length === 0 ? '客户编码' : null,
  ].filter(Boolean) as string[];

  if (missingFields.length > 0) {
    return {
      allowed: false,
      message: `请先补齐${missingFields.join('、')}。`,
      missingFields,
    };
  }

  return {
    allowed: true,
    message: '客户主体信息可提交保存。',
    missingFields: [],
  };
}

export function validateManagementCustomerUserDraft(draft: CustomerUser): ManagementFormValidation {
  const missingFields = [
    draft.username.trim().length === 0 ? '登录账号' : null,
    draft.name.trim().length === 0 ? '用户姓名' : null,
  ].filter(Boolean) as string[];

  if (missingFields.length > 0) {
    return {
      allowed: false,
      message: `请先补齐${missingFields.join('、')}。`,
      missingFields,
    };
  }

  return {
    allowed: true,
    message: '中台用户端用户信息可提交保存。',
    missingFields: [],
  };
}

export function filterManagementAdminUsers(rows: ManagementAdminUser[], filters: ManagementAdminUserFilters): ManagementAdminUser[] {
  const normalizedSearchTerm = filters.searchTerm.trim().toLowerCase();

  return rows.filter((row) => {
    const matchesRole = filters.role === '全部角色' || row.role === filters.role;
    const matchesStatus = filters.status === '全部状态' || row.status === filters.status;
    const matchesSearch =
      normalizedSearchTerm.length === 0 ||
      `${row.name}${row.username}${row.email}${row.role}`.toLowerCase().includes(normalizedSearchTerm);

    return matchesRole && matchesStatus && matchesSearch;
  });
}

export function summarizeManagementAdminUsers(rows: ManagementAdminUser[]): EntityStatusSummary {
  return rows.reduce<EntityStatusSummary>(
    (summary, row) => {
      summary.total += 1;
      summary[row.status] += 1;
      return summary;
    },
    { disabled: 0, enabled: 0, total: 0 },
  );
}

export function buildDraftManagementAdminUser(template: ManagementAdminUser, operatorName: string): ManagementAdminUser {
  return {
    ...template,
    createdAt: '未保存',
    createdBy: operatorName,
    email: '',
    id: 'draft-admin-user',
    lastLogin: '未登录',
    name: '',
    phone: '',
    recentActionAt: '未写入审计',
    recentActionBy: operatorName,
    role: '只读管理员',
    status: 'disabled',
    updatedAt: '未保存',
    username: '',
  };
}

export function validateManagementAdminUserDraft(draft: ManagementAdminUser): ManagementFormValidation {
  const missingFields = [
    draft.username.trim().length === 0 ? '登录账号' : null,
    draft.name.trim().length === 0 ? '用户姓名' : null,
  ].filter(Boolean) as string[];

  if (missingFields.length > 0) {
    return {
      allowed: false,
      message: `请先补齐${missingFields.join('、')}。`,
      missingFields,
    };
  }

  return {
    allowed: true,
    message: '管理端用户信息可提交保存。',
    missingFields: [],
  };
}
