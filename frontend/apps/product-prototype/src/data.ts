export type ProductStatus = 'draft' | 'published' | 'ready';
export type ShelfStatus = 'offline' | 'online';
export type DetailPageStatus = 'current' | 'history';
export type SyncStatus = 'failed' | 'pending' | 'success' | 'syncing';
export type CustomerStatus = 'disabled' | 'enabled';
export type MappingStatus = 'active' | 'inactive';
export type UserStatus = 'disabled' | 'enabled';
export type ImportJobStatus =
  | 'completed'
  | 'execute_failed'
  | 'executing'
  | 'ready_to_execute'
  | 'uploaded'
  | 'validate_failed'
  | 'validating';

export type Product = {
  author: string;
  category: string;
  channelCount: number;
  code: string;
  cover: string;
  detailPageCount: number;
  id: string;
  isbn: string;
  name: string;
  publisher: string;
  status: ProductStatus;
  updatedAt: string;
};

export type ChannelItem = {
  channel: '快手' | '拼多多' | '抖音' | '淘宝';
  detailPageCount: number;
  id: string;
  itemCode: string;
  price: number;
  productId: string;
  productName: string;
  shelfStatus: ShelfStatus;
  shop: string;
  title: string;
  updatedAt: string;
};

export type DetailPageBlock = {
  asset?: string;
  body: string;
  id: string;
  title: string;
  type: 'hero' | 'image' | 'text';
};

export type DetailPage = {
  assetCount: number;
  blocks: DetailPageBlock[];
  channelItemId: string;
  id: string;
  name: string;
  productId: string;
  status: DetailPageStatus;
  updatedAt: string;
};

export type CategoryAdaptation = {
  attributeCoverage: string;
  channel: string;
  channelCategoryId: string;
  channelCategoryName: string;
  channelItemId: string;
  customerName: string;
  id: string;
  itemCode: string;
  shop: string;
  sourceApi: 'API-ITEM-CATEGORY-ADAPTATION-GET';
  standardCategoryId: string;
  standardCategoryName: string;
  updatedAt: string;
};

export type InventoryItem = {
  channel: string;
  id: string;
  productName: string;
  sellable: number;
  shop: string;
  sku: string;
  status: SyncStatus;
  total: number;
  updatedAt: string;
};

export type MaterialItem = {
  detailPageIds: string[];
  fileName: string;
  id: string;
  productId: string;
  size: string;
  src: string;
  type: 'SKU 图' | '详情图' | '主图';
  usedBy: number;
};

export type StoreAppSubscriptionStatus = 'subscribed' | 'unsubscribed';
export type StoreAuthorizationStatus = 'authorized' | 'expired' | 'unauthorized';

export type StoreConfig = {
  appServiceName: string;
  appSubscriptionStatus: StoreAppSubscriptionStatus;
  authExpiresAt: string;
  authorizationStatus: StoreAuthorizationStatus;
  channel: string;
  defaultCategory: string;
  defaultShelfStatus: ShelfStatus;
  deliverySla: string;
  freightTemplate: string;
  id: string;
  platformStoreId: string;
  shippingOrigin: string;
  shop: string;
  status: 'active' | 'draft' | 'inactive';
  stockDeductionMethod: string;
  updatedAt: string;
};

export type ImportRecord = {
  category: string;
  channel: string;
  createdAt: string;
  failed: number;
  fileName: string;
  id: string;
  importType: '产品资料导入' | '渠道商品导入';
  operator: string;
  shop: string;
  status: ImportJobStatus;
  success: number;
  templateVersion: string;
  total: number;
};

export type InventoryAdjustment = {
  channel: string;
  createdAt: string;
  direction: '入库' | '出库' | '校正';
  id: string;
  operator: string;
  productName: string;
  quantity: number;
  reason: string;
  shop: string;
  sku: string;
  status: 'pending' | 'success';
};

export type Customer = {
  code: string;
  id: string;
  name: string;
  note: string;
  shopCount: number;
  status: CustomerStatus;
  updatedAt: string;
  userCount: number;
};

export type CustomerUser = {
  createdAt: string;
  customerId: string;
  email: string;
  id: string;
  lastLogin: string;
  name: string;
  phone: string;
  role: '商户管理员' | '商户只读用户' | '商户操作员';
  status: UserStatus;
  updatedAt: string;
  username: string;
};

export type ManagementCategoryMapping = {
  channel: string;
  channelCategoryId: string;
  channelCategoryName: string;
  id: string;
  shopScope: string;
  standardCategoryId: string;
  standardCategoryName: string;
  status: MappingStatus;
  updatedAt: string;
};

export type ManagementAttributeMapping = {
  channel: string;
  channelAttributeName: string;
  channelAttributeValue: string;
  customerId: string;
  customerName: string;
  id: string;
  mappingId: string;
  standardAttributeName: string;
  standardAttributeValue: string;
  status: MappingStatus;
  updatedAt: string;
};

export type ManagementAdminUser = {
  createdAt: string;
  createdBy: string;
  email: string;
  id: string;
  lastLogin: string;
  name: string;
  phone: string;
  recentActionAt: string;
  recentActionBy: string;
  role: '只读管理员' | '系统管理员' | '超级管理员' | '运营管理员';
  status: UserStatus;
  updatedAt: string;
  username: string;
};

export const products: Product[] = [
  {
    author: '英国 DK 出版社',
    category: '少儿百科',
    channelCount: 2,
    code: 'BOOK-001',
    cover: '/product-assets/0.jpg',
    detailPageCount: 3,
    id: 'prod-1',
    isbn: '978020000011',
    name: 'DK儿童百科全书（彩绘版）',
    publisher: '人民邮电出版社',
    status: 'published',
    updatedAt: '2026-04-16 18:10',
  },
  {
    author: '常怡',
    category: '儿童文学',
    channelCount: 1,
    code: 'BOOK-002',
    cover: '/product-assets/1.jpg',
    detailPageCount: 3,
    id: 'prod-2',
    isbn: '978020000022',
    name: '故宫里的大怪兽（套装）',
    publisher: '中国大百科全书出版社',
    status: 'ready',
    updatedAt: '2026-04-16 16:32',
  },
  {
    author: '刘慈欣',
    category: '科幻文学',
    channelCount: 1,
    code: 'BOOK-003',
    cover: '/product-assets/2.jpg',
    detailPageCount: 1,
    id: 'prod-3',
    isbn: '978020000033',
    name: '三体全集纪念版',
    publisher: '重庆出版社',
    status: 'draft',
    updatedAt: '2026-04-15 11:20',
  },
  {
    author: 'DK',
    category: '历史科普',
    channelCount: 1,
    code: 'BOOK-004',
    cover: '/product-assets/3.jpg',
    detailPageCount: 1,
    id: 'prod-4',
    isbn: '978020000044',
    name: '世界神话传说图鉴',
    publisher: '电子工业出版社',
    status: 'published',
    updatedAt: '2026-04-14 09:48',
  },
];

export const channelItems: ChannelItem[] = [
  {
    channel: '淘宝',
    detailPageCount: 2,
    id: 'item-1',
    itemCode: 'TB-BOOK-001',
    price: 79,
    productId: 'prod-1',
    productName: 'DK儿童百科全书（彩绘版）',
    shelfStatus: 'online',
    shop: '杭州旗舰店',
    title: 'DK儿童百科全书 彩图精装旗舰版',
    updatedAt: '2026-04-16 18:00',
  },
  {
    channel: '快手',
    detailPageCount: 1,
    id: 'item-2',
    itemCode: 'KS-BOOK-001',
    price: 75,
    productId: 'prod-1',
    productName: 'DK儿童百科全书（彩绘版）',
    shelfStatus: 'online',
    shop: '快手童书店',
    title: 'DK百科直播间专享亲子套装',
    updatedAt: '2026-04-16 16:10',
  },
  {
    channel: '抖音',
    detailPageCount: 3,
    id: 'item-3',
    itemCode: 'DY-BOOK-002',
    price: 128,
    productId: 'prod-2',
    productName: '故宫里的大怪兽（套装）',
    shelfStatus: 'offline',
    shop: '北京亲子图书',
    title: '故宫里的大怪兽 全套礼盒版',
    updatedAt: '2026-04-15 21:12',
  },
  {
    channel: '拼多多',
    detailPageCount: 1,
    id: 'item-4',
    itemCode: 'PDD-BOOK-003',
    price: 88,
    productId: 'prod-3',
    productName: '三体全集纪念版',
    shelfStatus: 'online',
    shop: '上海自营店',
    title: '三体全集 科幻文学精装收藏版',
    updatedAt: '2026-04-15 15:33',
  },
  {
    channel: '淘宝',
    detailPageCount: 1,
    id: 'item-5',
    itemCode: 'TB-BOOK-004',
    price: 92,
    productId: 'prod-4',
    productName: '世界神话传说图鉴',
    shelfStatus: 'online',
    shop: '杭州旗舰店',
    title: '世界神话传说图鉴 典藏图文版',
    updatedAt: '2026-04-14 12:20',
  },
];

export const detailPages: DetailPage[] = [
  {
    assetCount: 4,
    blocks: [
      { asset: '/product-assets/detail-0.jpg', body: '全彩图解，覆盖自然、人文、科技三大主题。', id: 'b1', title: '旗舰首图', type: 'hero' },
      { body: '适合亲子共读和礼赠场景，默认承接淘宝旗舰店精装版本。', id: 'b2', title: '核心卖点', type: 'text' },
    ],
    channelItemId: 'item-1',
    id: 'detail-1',
    name: '旗舰店标准详情页',
    productId: 'prod-1',
    status: 'current',
    updatedAt: '2026-04-22 10:30',
  },
  {
    assetCount: 3,
    blocks: [{ asset: '/product-assets/detail-1.jpg', body: '强化礼盒装权益、亲子阅读权益和赠品信息。', id: 'b3', title: '礼盒版首屏', type: 'hero' }],
    channelItemId: 'item-1',
    id: 'detail-2',
    name: '礼盒版详情页',
    productId: 'prod-1',
    status: 'history',
    updatedAt: '2026-04-21 17:00',
  },
  {
    assetCount: 2,
    blocks: [{ asset: '/product-assets/0.jpg', body: '快手短链成交版本，保留直播卖点和赠品权益。', id: 'b4', title: '直播精简版', type: 'hero' }],
    channelItemId: 'item-2',
    id: 'detail-3',
    name: '快手直播详情页',
    productId: 'prod-1',
    status: 'current',
    updatedAt: '2026-04-20 11:48',
  },
  {
    assetCount: 5,
    blocks: [{ asset: '/product-assets/detail-1.jpg', body: '直播间强转化版本，突出套装册数和限时价格。', id: 'b5', title: '直播专供详情', type: 'hero' }],
    channelItemId: 'item-3',
    id: 'detail-4',
    name: '抖音直播专供详情页',
    productId: 'prod-2',
    status: 'current',
    updatedAt: '2026-04-22 09:40',
  },
  {
    assetCount: 4,
    blocks: [{ asset: '/product-assets/1.jpg', body: '套装卖点强化版本，强调册数、礼盒和赠品。', id: 'b6', title: '套装增强版', type: 'hero' }],
    channelItemId: 'item-3',
    id: 'detail-5',
    name: '套装增强详情页',
    productId: 'prod-2',
    status: 'history',
    updatedAt: '2026-04-21 12:16',
  },
  {
    assetCount: 3,
    blocks: [{ asset: '/product-assets/detail-0.jpg', body: '活动短版，用于节日营销和大促转化测试。', id: 'b7', title: '活动短版', type: 'hero' }],
    channelItemId: 'item-3',
    id: 'detail-6',
    name: '大促活动详情页',
    productId: 'prod-2',
    status: 'history',
    updatedAt: '2026-04-20 18:12',
  },
  {
    assetCount: 2,
    blocks: [{ asset: '/product-assets/2.jpg', body: '精装收藏版详情页，突出作者与收藏价值。', id: 'b8', title: '收藏版首屏', type: 'hero' }],
    channelItemId: 'item-4',
    id: 'detail-7',
    name: '拼多多收藏版详情页',
    productId: 'prod-3',
    status: 'current',
    updatedAt: '2026-04-18 15:30',
  },
];

export const categoryAdaptations: CategoryAdaptation[] = [
  {
    attributeCoverage: '7/8 个属性已完成标准值适配',
    channel: '淘宝',
    channelCategoryId: '50025966',
    channelCategoryName: '图书 > 少儿 > 百科',
    channelItemId: 'item-1',
    customerName: '晨光图书',
    id: 'adapt-1',
    itemCode: 'TB-BOOK-001',
    shop: '杭州旗舰店',
    sourceApi: 'API-ITEM-CATEGORY-ADAPTATION-GET',
    standardCategoryId: 'STD-BOOK-CHILD-ENC',
    standardCategoryName: '标准图书 / 少儿百科',
    updatedAt: '2026-04-22 11:06',
  },
  {
    attributeCoverage: '6/8 个属性已完成标准值适配',
    channel: '快手',
    channelCategoryId: 'KS-BOOK-1001',
    channelCategoryName: '图书 / 亲子阅读 / 百科',
    channelItemId: 'item-2',
    customerName: '晨光图书',
    id: 'adapt-2',
    itemCode: 'KS-BOOK-001',
    shop: '快手童书店',
    sourceApi: 'API-ITEM-CATEGORY-ADAPTATION-GET',
    standardCategoryId: 'STD-BOOK-CHILD-ENC',
    standardCategoryName: '标准图书 / 少儿百科',
    updatedAt: '2026-04-22 10:42',
  },
  {
    attributeCoverage: '8/8 个属性已完成标准值适配',
    channel: '抖音',
    channelCategoryId: 'DY-BOOK-2209',
    channelCategoryName: '图书 / 儿童文学 / 套装',
    channelItemId: 'item-3',
    customerName: '童趣文化',
    id: 'adapt-3',
    itemCode: 'DY-BOOK-002',
    shop: '北京亲子图书',
    sourceApi: 'API-ITEM-CATEGORY-ADAPTATION-GET',
    standardCategoryId: 'STD-BOOK-CHILD-LIT',
    standardCategoryName: '标准图书 / 儿童文学',
    updatedAt: '2026-04-22 08:16',
  },
  {
    attributeCoverage: '5/7 个属性已完成标准值适配',
    channel: '拼多多',
    channelCategoryId: 'PDD-BOOK-301',
    channelCategoryName: '图书 / 科幻文学',
    channelItemId: 'item-4',
    customerName: '未来阅读',
    id: 'adapt-4',
    itemCode: 'PDD-BOOK-003',
    shop: '上海自营店',
    sourceApi: 'API-ITEM-CATEGORY-ADAPTATION-GET',
    standardCategoryId: 'STD-BOOK-SCI-FI',
    standardCategoryName: '标准图书 / 科幻文学',
    updatedAt: '2026-04-21 18:20',
  },
];

export const inventory: InventoryItem[] = [
  { channel: '淘宝', id: 'inv-1', productName: 'DK儿童百科全书（彩绘版）', sellable: 326, shop: '杭州旗舰店', sku: 'BOOK-001-STD', status: 'success', total: 410, updatedAt: '2026-04-22 09:10' },
  { channel: '快手', id: 'inv-2', productName: 'DK儿童百科全书（彩绘版）', sellable: 92, shop: '快手童书店', sku: 'BOOK-001-GIFT', status: 'syncing', total: 120, updatedAt: '同步中' },
  { channel: '抖音', id: 'inv-3', productName: '故宫里的大怪兽（套装）', sellable: 24, shop: '北京亲子图书', sku: 'BOOK-002-SET', status: 'failed', total: 30, updatedAt: '2026-04-21 18:20' },
  { channel: '拼多多', id: 'inv-4', productName: '三体全集纪念版', sellable: 210, shop: '上海自营店', sku: 'BOOK-003-FULL', status: 'pending', total: 260, updatedAt: '待同步' },
];

export const materials: MaterialItem[] = [
  { detailPageIds: ['detail-1', 'detail-2'], fileName: 'dk-cover-1.jpg', id: 'asset-1', productId: 'prod-1', size: '1.2MB', src: '/product-assets/0.jpg', type: '主图', usedBy: 2 },
  { detailPageIds: ['detail-1', 'detail-3', 'detail-6'], fileName: 'dk-detail-hero.jpg', id: 'asset-2', productId: 'prod-1', size: '980KB', src: '/product-assets/detail-0.jpg', type: '详情图', usedBy: 3 },
  { detailPageIds: ['detail-1'], fileName: 'dk-sku-gift.jpg', id: 'asset-6', productId: 'prod-1', size: '760KB', src: '/product-assets/3.jpg', type: 'SKU 图', usedBy: 1 },
  { detailPageIds: ['detail-4', 'detail-5', 'detail-6'], fileName: 'gugong-live.jpg', id: 'asset-3', productId: 'prod-2', size: '1.7MB', src: '/product-assets/detail-1.jpg', type: '详情图', usedBy: 3 },
  { detailPageIds: ['detail-7'], fileName: 'santi-cover.jpg', id: 'asset-4', productId: 'prod-3', size: '860KB', src: '/product-assets/2.jpg', type: '主图', usedBy: 1 },
  { detailPageIds: ['detail-4'], fileName: 'gugong-box-set.jpg', id: 'asset-5', productId: 'prod-2', size: '1.1MB', src: '/product-assets/1.jpg', type: '主图', usedBy: 1 },
];

export const configs: StoreConfig[] = [
  { appServiceName: '淘宝店铺服务应用', appSubscriptionStatus: 'subscribed', authExpiresAt: '2027-04-20', authorizationStatus: 'authorized', channel: '淘宝', defaultCategory: '标准图书 / 少儿百科', defaultShelfStatus: 'online', deliverySla: '48 小时内发货', freightTemplate: 'FT-TB-001', id: 'conf-1', platformStoreId: 'TB-STORE-1001', shippingOrigin: '浙江省 / 杭州市', shop: '杭州旗舰店', status: 'active', stockDeductionMethod: '付款减库存', updatedAt: '2026-04-20 12:00' },
  { appServiceName: '快手店铺服务应用', appSubscriptionStatus: 'subscribed', authExpiresAt: '2027-04-19', authorizationStatus: 'authorized', channel: '快手', defaultCategory: '标准图书 / 少儿百科', defaultShelfStatus: 'online', deliverySla: '24 小时内发货', freightTemplate: 'FT-KS-003', id: 'conf-2', platformStoreId: 'KS-STORE-1002', shippingOrigin: '浙江省 / 杭州市', shop: '快手童书店', status: 'active', stockDeductionMethod: '付款减库存', updatedAt: '2026-04-19 16:30' },
  { appServiceName: '抖音店铺服务应用', appSubscriptionStatus: 'subscribed', authExpiresAt: '2027-04-18', authorizationStatus: 'authorized', channel: '抖音', defaultCategory: '待选择默认类目', defaultShelfStatus: 'offline', deliverySla: '48 小时内发货', freightTemplate: '', id: 'conf-3', platformStoreId: 'DY-STORE-1003', shippingOrigin: '北京市 / 北京市', shop: '北京亲子图书', status: 'draft', stockDeductionMethod: '拍下减库存', updatedAt: '2026-04-18 10:10' },
  { appServiceName: '拼多多店铺服务应用', appSubscriptionStatus: 'subscribed', authExpiresAt: '2026-04-17', authorizationStatus: 'expired', channel: '拼多多', defaultCategory: '标准图书 / 科幻文学', defaultShelfStatus: 'online', deliverySla: '72 小时内发货', freightTemplate: 'FT-PDD-005', id: 'conf-4', platformStoreId: 'PDD-STORE-1004', shippingOrigin: '上海市 / 上海市', shop: '上海自营店', status: 'inactive', stockDeductionMethod: '付款减库存', updatedAt: '2026-04-17 09:40' },
];

export const importRecords: ImportRecord[] = [
  { category: '淘宝图书 > 少儿 > 百科', channel: '淘宝', createdAt: '2026-04-22 11:20', failed: 0, fileName: 'book-taobao-0422.xlsx', id: 'imp-1', importType: '渠道商品导入', operator: '张敏', shop: '杭州旗舰店', status: 'completed', success: 128, templateVersion: '淘宝导入模板 / 2026-04-22', total: 128 },
  { category: '快手图书音像 > 童书 > 百科读物', channel: '快手', createdAt: '2026-04-22 10:42', failed: 0, fileName: 'ks-live-books.zip', id: 'imp-2', importType: '渠道商品导入', operator: '李雷', shop: '快手童书店', status: 'validating', success: 0, templateVersion: '快手导入模板 / 2026-04-22', total: 46 },
  { category: '抖店书籍/杂志/报纸 > 童书 > 百科', channel: '抖音', createdAt: '2026-04-21 18:10', failed: 7, fileName: 'douyin-gift-set.xlsx', id: 'imp-3', importType: '渠道商品导入', operator: '王芳', shop: '北京亲子图书', status: 'validate_failed', success: 12, templateVersion: '抖店导入模板 / 2026-04-21', total: 19 },
];

export const inventoryAdjustments: InventoryAdjustment[] = [
  { channel: '淘宝', createdAt: '2026-04-22 09:45', direction: '校正', id: 'adj-1', operator: '系统同步', productName: 'DK儿童百科全书（彩绘版）', quantity: 16, reason: '渠道库存回传差异校正', shop: '杭州旗舰店', sku: 'BOOK-001-STD', status: 'success' },
  { channel: '快手', createdAt: '2026-04-21 20:18', direction: '出库', id: 'adj-2', operator: '陈晨', productName: 'DK儿童百科全书（彩绘版）', quantity: -8, reason: '直播间预占库存释放', shop: '快手童书店', sku: 'BOOK-001-GIFT', status: 'success' },
  { channel: '抖音', createdAt: '2026-04-21 16:06', direction: '入库', id: 'adj-3', operator: '周可', productName: '故宫里的大怪兽（套装）', quantity: 120, reason: '新批次到货', shop: '北京亲子图书', sku: 'BOOK-002-SET', status: 'pending' },
];

export const customers: Customer[] = [
  { code: 'CUS-001', id: 'customer-1', name: '晨光图书', note: '覆盖淘宝与快手售卖主体。', shopCount: 2, status: 'enabled', updatedAt: '2026-04-22 11:20', userCount: 3 },
  { code: 'CUS-002', id: 'customer-2', name: '童趣文化', note: '儿童文学与直播渠道重点客户。', shopCount: 1, status: 'enabled', updatedAt: '2026-04-21 16:40', userCount: 2 },
  { code: 'CUS-003', id: 'customer-3', name: '未来阅读', note: '科幻文学专项合作客户。', shopCount: 1, status: 'disabled', updatedAt: '2026-04-20 09:30', userCount: 1 },
];

export const customerUsers: CustomerUser[] = [
  { createdAt: '2026-03-12 10:20', customerId: 'customer-1', email: 'zhaoyu@bookhub.cn', id: 'cust-user-1', lastLogin: '2026-04-22 10:30', name: '赵雨', phone: '13800001234', role: '商户管理员', status: 'enabled', updatedAt: '2026-04-22 10:30', username: 'zhaoyu' },
  { createdAt: '2026-03-18 14:10', customerId: 'customer-1', email: 'linhao@bookhub.cn', id: 'cust-user-2', lastLogin: '2026-04-21 18:12', name: '林浩', phone: '13800005678', role: '商户操作员', status: 'enabled', updatedAt: '2026-04-21 18:12', username: 'linhao' },
  { createdAt: '2026-03-18 14:16', customerId: 'customer-1', email: 'chenyan@bookhub.cn', id: 'cust-user-3', lastLogin: '2026-04-19 09:22', name: '陈言', phone: '13800007890', role: '商户只读用户', status: 'disabled', updatedAt: '2026-04-20 09:05', username: 'chenyan' },
  { createdAt: '2026-03-21 11:08', customerId: 'customer-2', email: 'heqing@bookhub.cn', id: 'cust-user-4', lastLogin: '2026-04-22 08:46', name: '何青', phone: '13900001234', role: '商户管理员', status: 'enabled', updatedAt: '2026-04-22 08:46', username: 'heqing' },
  { createdAt: '2026-03-25 09:50', customerId: 'customer-2', email: 'yuchen@bookhub.cn', id: 'cust-user-5', lastLogin: '2026-04-18 12:06', name: '于辰', phone: '13900005678', role: '商户操作员', status: 'enabled', updatedAt: '2026-04-18 12:06', username: 'yuchen' },
  { createdAt: '2026-03-27 16:40', customerId: 'customer-3', email: 'shenfang@bookhub.cn', id: 'cust-user-6', lastLogin: '2026-04-15 19:20', name: '沈放', phone: '13700001234', role: '商户管理员', status: 'disabled', updatedAt: '2026-04-20 09:30', username: 'shenfang' },
];

export const managementCategoryMappings: ManagementCategoryMapping[] = [
  { channel: '淘宝', channelCategoryId: '50025966', channelCategoryName: '图书 > 少儿 > 百科', id: 'cat-map-1', shopScope: '杭州旗舰店', standardCategoryId: 'STD-BOOK-CHILD-ENC', standardCategoryName: '标准图书 / 少儿百科', status: 'active', updatedAt: '2026-04-22 11:06' },
  { channel: '快手', channelCategoryId: 'KS-BOOK-1001', channelCategoryName: '图书 / 亲子阅读 / 百科', id: 'cat-map-2', shopScope: '快手童书店', standardCategoryId: 'STD-BOOK-CHILD-ENC', standardCategoryName: '标准图书 / 少儿百科', status: 'active', updatedAt: '2026-04-22 10:42' },
  { channel: '抖音', channelCategoryId: 'DY-BOOK-2209', channelCategoryName: '图书 / 儿童文学 / 套装', id: 'cat-map-3', shopScope: '北京亲子图书', standardCategoryId: 'STD-BOOK-CHILD-LIT', standardCategoryName: '标准图书 / 儿童文学', status: 'active', updatedAt: '2026-04-22 08:16' },
  { channel: '拼多多', channelCategoryId: 'PDD-BOOK-301', channelCategoryName: '图书 / 科幻文学', id: 'cat-map-4', shopScope: '上海自营店', standardCategoryId: 'STD-BOOK-SCI-FI', standardCategoryName: '标准图书 / 科幻文学', status: 'inactive', updatedAt: '2026-04-21 18:20' },
];

export const managementAttributeMappings: ManagementAttributeMapping[] = [
  { channel: '淘宝', channelAttributeName: '适读年龄', channelAttributeValue: '7-12岁', customerId: 'customer-1', customerName: '晨光图书', id: 'attr-map-1', mappingId: 'cat-map-1', standardAttributeName: '建议年龄', standardAttributeValue: '小学阶段', status: 'active', updatedAt: '2026-04-22 11:08' },
  { channel: '淘宝', channelAttributeName: '装帧', channelAttributeValue: '精装', customerId: 'customer-1', customerName: '晨光图书', id: 'attr-map-2', mappingId: 'cat-map-1', standardAttributeName: '装帧形式', standardAttributeValue: '精装', status: 'active', updatedAt: '2026-04-22 11:09' },
  { channel: '抖音', channelAttributeName: '套装册数', channelAttributeValue: '12册', customerId: 'customer-2', customerName: '童趣文化', id: 'attr-map-3', mappingId: 'cat-map-3', standardAttributeName: '套装规格', standardAttributeValue: '12册套装', status: 'active', updatedAt: '2026-04-22 08:18' },
  { channel: '拼多多', channelAttributeName: '作者', channelAttributeValue: '刘慈欣', customerId: 'customer-3', customerName: '未来阅读', id: 'attr-map-4', mappingId: 'cat-map-4', standardAttributeName: '作者', standardAttributeValue: '刘慈欣', status: 'inactive', updatedAt: '2026-04-21 18:22' },
];

export const managementAdminUsers: ManagementAdminUser[] = [
  { createdAt: '2026-02-10 09:20', createdBy: '系统初始化', email: 'ops@bookhub.cn', id: 'admin-1', lastLogin: '2026-04-22 09:12', name: '周静', phone: '13600001111', recentActionAt: '2026-04-22 09:15', recentActionBy: '周静', role: '超级管理员', status: 'enabled', updatedAt: '2026-04-22 09:15', username: 'zhoujing' },
  { createdAt: '2026-02-18 13:40', createdBy: '周静', email: 'mapping@bookhub.cn', id: 'admin-2', lastLogin: '2026-04-21 20:15', name: '徐涛', phone: '13600002222', recentActionAt: '2026-04-21 20:18', recentActionBy: '周静', role: '运营管理员', status: 'enabled', updatedAt: '2026-04-21 20:18', username: 'xutao' },
  { createdAt: '2026-02-24 10:05', createdBy: '周静', email: 'system@bookhub.cn', id: 'admin-3', lastLogin: '2026-04-20 17:05', name: '黄宁', phone: '13600003333', recentActionAt: '2026-04-20 17:05', recentActionBy: '黄宁', role: '系统管理员', status: 'enabled', updatedAt: '2026-04-20 17:05', username: 'huangning' },
  { createdAt: '2026-03-02 16:20', createdBy: '周静', email: 'viewer@bookhub.cn', id: 'admin-4', lastLogin: '2026-04-18 11:42', name: '李彤', phone: '13600004444', recentActionAt: '2026-04-19 09:30', recentActionBy: '周静', role: '只读管理员', status: 'disabled', updatedAt: '2026-04-19 09:30', username: 'litong' },
];

export const currentManagementAdminUserId = 'admin-1';
