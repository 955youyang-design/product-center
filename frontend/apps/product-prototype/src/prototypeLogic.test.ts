import { describe, expect, it } from 'vitest';
import {
  channelItems,
  configs,
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
} from './data';
import {
  appendDetailPageBlock,
  buildProductListSearchParams,
  buildBatchEditSubmission,
  buildChannelItemShelfAction,
  buildChannelItemListSearchParams,
  buildDetailPageListSearchParams,
  buildImportRecordListSearchParams,
  buildInventoryListSearchParams,
  buildMaterialListSearchParams,
  createProductRowFromDraft,
  buildDraftCustomer,
  buildDraftCustomerUser,
  buildDraftManagementAdminUser,
  buildDraftAttributeMapping,
  buildDraftCategoryMapping,
  buildDraftStoreConfigRow,
  buildImportRecordAction,
  buildImportTaskSummary,
  createImportRecordFromUpload,
  buildStoreAppSubscriptionPatch,
  buildStoreAuthorizationCallbackPatch,
  buildStoreAuthorizationLink,
  buildStoreAuthorizationPatch,
  buildStoreConfigListSearchParams,
  buildTemplateDownloadPlan,
  addTemplateDownloadRecord,
  DETAIL_PAGE_LIMIT,
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
  getStoreConfigAutoStatus,
  getStoreConfigSetupState,
  getStoreFreightTemplateOptions,
  getDetailLimitState,
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
  setCurrentDetailPage,
  saveDetailPageRows,
  saveStoreConfigRows,
  serializePrototypeSnapshot,
  summarizeManagementAdminUsers,
  summarizeManagementCustomers,
  summarizeImportRecords,
  summarizeInventoryRows,
  summarizeMaterialProductFolders,
  summarizeMaterialTypeFolders,
  summarizeStoreConfigRows,
  summarizeStoreConfigSetupRows,
  summarizeProductExport,
  summarizeProductRelationships,
  summarizeManagementAttributeMappings,
  summarizeManagementCategoryMappings,
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
  reuseMaterial,
} from './prototypeLogic';

describe('prototype interaction logic', () => {
  it('detects the per-channel-item detail page limit', () => {
    expect(DETAIL_PAGE_LIMIT).toBe(3);
    expect(getDetailLimitState(detailPages, 'item-3')).toMatchObject({
      count: 3,
      limitReached: true,
      remaining: 0,
    });
    expect(getDetailLimitState(detailPages, 'item-2')).toMatchObject({
      count: 1,
      limitReached: false,
      remaining: 2,
    });
  });

  it('keeps only one current detail page under the same channel item', () => {
    const updated = setCurrentDetailPage(detailPages, 'detail-2');
    const itemDetails = updated.filter((detail) => detail.channelItemId === 'item-1');

    expect(itemDetails.filter((detail) => detail.status === 'current')).toHaveLength(1);
    expect(updated.find((detail) => detail.id === 'detail-2')?.status).toBe('current');
    expect(updated.find((detail) => detail.id === 'detail-1')?.status).toBe('history');
  });

  it('previews batch targets from selected channel, shop and shelf status', () => {
    const targets = previewBatchTargets(channelItems, {
      channel: '淘宝',
      product: 'DK儿童百科全书',
      shelfStatus: 'online',
      shop: '全部店铺',
    });

    expect(targets.map((item) => item.id)).toEqual(['item-1']);
  });

  it('blocks import confirmation until validation has passed and unresolved links are handled', () => {
    expect(canConfirmImport({ hasUploadedFile: false, unresolvedLinks: 0, validationStatus: 'passed' })).toBe(false);
    expect(canConfirmImport({ hasUploadedFile: true, unresolvedLinks: 2, validationStatus: 'passed' })).toBe(false);
    expect(canConfirmImport({ hasUploadedFile: true, unresolvedLinks: 0, validationStatus: 'failed' })).toBe(false);
    expect(canConfirmImport({ hasUploadedFile: true, unresolvedLinks: 0, validationStatus: 'passed' })).toBe(true);
  });

  it('builds a single-channel single-category online item template download plan', () => {
    expect(buildTemplateDownloadPlan({
      categories: ['标准图书 / 科幻文学', '标准图书 / 少儿百科'],
      channelCategory: { category: '淘宝图书 > 文学小说 > 科幻小说', channel: '淘宝' },
      channels: ['抖音', '淘宝', '抖音'],
      importType: 'online-item',
    })).toEqual({
      categoryCount: 1,
      categories: ['淘宝图书 > 文学小说 > 科幻小说'],
      channelCount: 1,
      channels: ['淘宝'],
      fileName: '渠道商品导入模板-淘宝-1个渠道类目.xlsx',
      importTypeLabel: '渠道商品导入',
      sheetCount: 1,
      templateModeLabel: '单渠道+单渠道类目模板',
    });
    expect(buildTemplateDownloadPlan({
      categories: [],
      channelCategory: null,
      channels: [],
      importType: 'online-item',
    })).toEqual({
      categoryCount: 0,
      categories: [],
      channelCount: 0,
      channels: [],
      fileName: '未选择导入范围模板.xlsx',
      importTypeLabel: '渠道商品导入',
      sheetCount: 0,
      templateModeLabel: '单渠道+单渠道类目模板',
    });
  });

  it('builds a product profile template download plan without channel sheets', () => {
    expect(buildTemplateDownloadPlan({
      categories: ['标准图书 / 少儿百科', '标准图书 / 儿童文学'],
      channelCategory: { category: '淘宝图书 > 少儿 > 百科', channel: '淘宝' },
      channels: ['淘宝'],
      importType: 'product-profile',
    })).toEqual({
      categoryCount: 2,
      categories: ['标准图书 / 少儿百科', '标准图书 / 儿童文学'],
      channelCount: 0,
      channels: [],
      fileName: '产品资料导入模板-2个类目.xlsx',
      importTypeLabel: '产品资料导入',
      sheetCount: 2,
      templateModeLabel: '按产品类目分子表',
    });
  });

  it('names the Douyin channel template as a Doudian import template', () => {
    expect(buildTemplateDownloadPlan({
      categories: [],
      channelCategory: { category: '抖店书籍/杂志/报纸 > 小说 > 科幻小说', channel: '抖音' },
      channels: ['抖音'],
      importType: 'online-item',
    }).fileName).toBe('渠道商品导入模板-抖店-1个渠道类目.xlsx');
  });

  it('keeps the latest ten downloaded import templates', () => {
    const existing = Array.from({ length: 10 }, (_, index) => ({
      categories: ['淘宝图书 > 文学小说 > 科幻小说'],
      categoryCount: 1,
      channelCount: 1,
      channels: ['淘宝' as const],
      downloadedAt: `2026-04-2${index}`,
      fileName: `模板-${index + 1}.xlsx`,
      id: `tpl-${index + 1}`,
      importTypeLabel: '渠道商品导入',
      scope: `范围-${index + 1}`,
      sheetCount: 1,
      templateModeLabel: '单渠道+单渠道类目模板',
    }));

    const next = addTemplateDownloadRecord(existing, {
      categories: ['标准图书 / 少儿百科', '标准图书 / 儿童文学'],
      categoryCount: 2,
      channelCount: 0,
      channels: [],
      downloadedAt: '2026-04-30',
      fileName: '最新模板.xlsx',
      id: 'tpl-new',
      importTypeLabel: '产品资料导入',
      scope: '产品资料 / 2 个类目',
      sheetCount: 2,
      templateModeLabel: '按产品类目分子表',
    });

    expect(next).toHaveLength(10);
    expect(next[0]?.id).toBe('tpl-new');
    expect(next.map((record) => record.id)).not.toContain('tpl-10');
  });

  it('summarizes the current import task target and readiness', () => {
    expect(
      buildImportTaskSummary({
        channel: '淘宝',
        hasUploadedFile: true,
        shop: '杭州旗舰店',
        unresolvedLinks: 2,
        validationStatus: 'failed',
      }),
    ).toEqual({
      label: '淘宝 / 杭州旗舰店',
      ready: false,
      statusText: '需处理 2 条关联问题',
    });

    expect(
      buildImportTaskSummary({
        channel: '淘宝',
        hasUploadedFile: true,
        shop: '',
        unresolvedLinks: 0,
        validationStatus: 'passed',
      }),
    ).toEqual({
      label: '淘宝',
      ready: true,
      statusText: '可确认导入',
    });
  });

  it('filters products by keyword, status and source channel', () => {
    expect(
      filterProductRows(products, channelItems, {
        keyword: 'BOOK-001',
        sourceChannel: '快手',
        status: 'published',
      }).map((row) => row.id),
    ).toEqual(['prod-1']);

    expect(
      filterProductRows(products, channelItems, {
        keyword: '',
        sourceChannel: '淘宝',
        status: 'ready',
      }),
    ).toEqual([]);
  });

  it('validates product draft before saving', () => {
    expect(
      validateProductDraft({
        author: '作者',
        category: '少儿百科',
        code: 'BOOK-009',
        coverUploaded: true,
        defaultTitle: '渠道标题',
        isbn: '978020000099',
        name: '新图书',
        publisher: '出版社',
      }),
    ).toEqual({
      allowed: true,
      missingFields: [],
      message: '产品草稿信息完整，可以保存并进入渠道商品创建。',
    });

    expect(
      validateProductDraft({
        author: '',
        category: '少儿百科',
        code: '',
        coverUploaded: false,
        defaultTitle: '',
        isbn: '978020000099',
        name: '',
        publisher: '出版社',
      }),
    ).toMatchObject({
      allowed: false,
      missingFields: ['图书名称', '商家编码', '作者', '默认标题', '封面'],
    });
  });

  it('creates a new product row from a valid draft', () => {
    expect(
      createProductRowFromDraft(
        {
          author: '新作者',
          category: '少儿百科',
          code: 'BOOK-009',
          coverUploaded: true,
          defaultTitle: '渠道默认标题',
          isbn: '978020000099',
          name: '新图书',
          publisher: '新出版社',
        },
        {
          cover: '/product-assets/0.jpg',
          id: 'prod-9',
          timestamp: '刚刚',
        },
      ),
    ).toEqual({
      author: '新作者',
      category: '少儿百科',
      channelCount: 0,
      code: 'BOOK-009',
      cover: '/product-assets/0.jpg',
      detailPageCount: 0,
      id: 'prod-9',
      isbn: '978020000099',
      name: '新图书',
      publisher: '新出版社',
      status: 'draft',
      updatedAt: '刚刚',
    });
  });

  it('updates product and channel item rows with the latest timestamp', () => {
    expect(
      updateProductRows(products, 'prod-1', {
        category: '亲子阅读',
        name: 'DK儿童百科全书（评审版）',
      }, '刚刚').find((row) => row.id === 'prod-1'),
    ).toMatchObject({
      category: '亲子阅读',
      name: 'DK儿童百科全书（评审版）',
      updatedAt: '刚刚',
    });

    expect(
      updateChannelItemRows(channelItems, 'item-1', {
        price: 81,
        shelfStatus: 'offline',
        title: 'DK儿童百科全书 新售卖标题',
      }, '刚刚').find((row) => row.id === 'item-1'),
    ).toMatchObject({
      price: 81,
      shelfStatus: 'offline',
      title: 'DK儿童百科全书 新售卖标题',
      updatedAt: '刚刚',
    });
  });

  it('saves detail page edits and syncs material reuse once', () => {
    const savedRows = saveDetailPageRows(detailPages, 'detail-3', {
      blocks: [
        { asset: '/product-assets/detail-0.jpg', body: '新的图文结构', id: 'b-new', title: '新模块', type: 'hero' },
      ],
      name: '快手直播详情页 V2',
    }, '刚刚');

    expect(savedRows.find((row) => row.id === 'detail-3')).toMatchObject({
      name: '快手直播详情页 V2',
      updatedAt: '刚刚',
    });

    const linked = linkMaterialToDetailPage({
      assetId: 'asset-1',
      detailPageId: 'detail-3',
      detailPageRows: savedRows,
      materialRows: materials,
      timestamp: '刚刚',
    });

    expect(linked.detailPageRows.find((row) => row.id === 'detail-3')).toMatchObject({
      assetCount: 3,
      updatedAt: '刚刚',
    });
    expect(linked.materialRows.find((row) => row.id === 'asset-1')).toMatchObject({
      detailPageIds: ['detail-1', 'detail-2', 'detail-3'],
      usedBy: 3,
    });

    expect(
      linkMaterialToDetailPage({
        assetId: 'asset-1',
        detailPageId: 'detail-3',
        detailPageRows: linked.detailPageRows,
        materialRows: linked.materialRows,
        timestamp: '再次保存',
      }).detailPageRows.find((row) => row.id === 'detail-3')?.assetCount,
    ).toBe(3);
  });

  it('creates, locks and saves store config rows', () => {
    expect(buildDraftStoreConfigRow('conf-new', '刚刚')).toMatchObject({
      id: 'conf-new',
      channel: '淘宝',
      shop: '待授权店铺',
      appServiceName: '淘宝店铺服务应用',
      appSubscriptionStatus: 'unsubscribed',
      authExpiresAt: '待授权',
      authorizationStatus: 'unauthorized',
      defaultCategory: '待选择默认类目',
      freightTemplate: '',
      platformStoreId: '',
      shippingOrigin: '浙江省 / 杭州市',
      deliverySla: '48 小时内发货',
      defaultShelfStatus: 'offline',
      stockDeductionMethod: '付款减库存',
      status: 'draft',
      updatedAt: '刚刚',
    });

    expect(
      createStoreConfigRowFromAuthorizationCallback('conf-new-auth', '回调完成', {
        authExpiresAt: '2027-04-26',
        channel: '抖音',
        platformStoreId: 'DY-STORE-1001',
        requestId: 'auth-123',
        shopName: '抖音授权店铺',
      }),
    ).toMatchObject({
      appServiceName: '抖音店铺服务应用',
      appSubscriptionStatus: 'subscribed',
      authExpiresAt: '2027-04-26',
      authorizationStatus: 'authorized',
      channel: '抖音',
      defaultCategory: '待选择默认类目',
      freightTemplate: '',
      id: 'conf-new-auth',
      platformStoreId: 'DY-STORE-1001',
      shop: '抖音授权店铺',
      status: 'draft',
      updatedAt: '回调完成',
    });

    expect(normalizeStoreConfigRows([
      ...configs,
      buildDraftStoreConfigRow('conf-unsaved', '刚刚'),
    ]).map((row) => row.id)).not.toContain('conf-unsaved');

    expect(
      saveStoreConfigRows(configs, 'conf-3', {
        defaultCategory: '标准图书 / 儿童文学',
        defaultShelfStatus: 'online',
        deliverySla: '24 小时内发货',
        freightTemplate: 'FT-DY-009',
        status: 'active',
      }, '刚刚').find((row) => row.id === 'conf-3'),
    ).toMatchObject({
      defaultCategory: '标准图书 / 儿童文学',
      defaultShelfStatus: 'online',
      deliverySla: '24 小时内发货',
      freightTemplate: 'FT-DY-009',
      status: 'active',
      updatedAt: '刚刚',
    });

    expect(
      saveStoreConfigRows(configs, 'conf-1', {
        appServiceName: '抖音店铺服务应用',
        appSubscriptionStatus: 'unsubscribed',
        authExpiresAt: '待授权',
        authorizationStatus: 'unauthorized',
        channel: '抖音',
        platformStoreId: 'DY-STORE-9999',
        shop: '误改店铺',
      }, '刚刚').find((row) => row.id === 'conf-1'),
    ).toMatchObject({
      appServiceName: configs[0].appServiceName,
      appSubscriptionStatus: configs[0].appSubscriptionStatus,
      authExpiresAt: configs[0].authExpiresAt,
      authorizationStatus: configs[0].authorizationStatus,
      channel: configs[0].channel,
      platformStoreId: configs[0].platformStoreId,
      shop: configs[0].shop,
      updatedAt: '刚刚',
    });

    expect(
      completeStoreAuthorizationFromCallback(
        configs,
        'conf-1',
        {
          authExpiresAt: '2028-04-26',
          channel: '抖音',
          platformStoreId: 'DY-STORE-9999',
          requestId: 'auth-retry',
          shopName: '误改店铺',
        },
        '重新授权',
      ).find((row) => row.id === 'conf-1'),
    ).toMatchObject({
      appSubscriptionStatus: 'subscribed',
      authExpiresAt: '2028-04-26',
      authorizationStatus: 'authorized',
      channel: configs[0].channel,
      platformStoreId: configs[0].platformStoreId,
      shop: configs[0].shop,
      updatedAt: '重新授权',
    });
  });

  it('filters, summarizes and validates user store configuration drafts', () => {
    expect(getStoreConfigSetupState(buildDraftStoreConfigRow('conf-new', '刚刚'))).toEqual({
      currentStep: 'add-store',
      defaultsReady: false,
      nextActionLabel: '先添加店铺',
      storeReady: false,
    });
    expect(getStoreConfigAutoStatus(buildDraftStoreConfigRow('conf-new', '刚刚'))).toBe('draft');

    expect(
      filterStoreConfigRows(configs, {
        channel: '淘宝',
        shop: '淘宝店铺服务',
        status: 'active',
      }).map((row) => row.id),
    ).toEqual(['conf-1']);

    expect(summarizeStoreConfigRows(configs)).toEqual({
      active: 2,
      authorized: 3,
      draft: 1,
      expired: 1,
      inactive: 1,
      subscribed: 4,
      total: 4,
      unauthorized: 0,
      unsubscribed: 0,
    });
    expect(summarizeStoreConfigSetupRows([
      buildDraftStoreConfigRow('conf-new', '刚刚'),
      {
        ...buildDraftStoreConfigRow('conf-ready-store', '刚刚'),
        appSubscriptionStatus: 'subscribed',
        authExpiresAt: '2027-04-26',
        authorizationStatus: 'authorized',
        platformStoreId: 'TB-STORE-2001',
        shop: '淘宝授权店铺',
      },
      configs[0],
    ])).toEqual({
      configured: 1,
      pendingConfig: 1,
      pendingStore: 1,
      storeReady: 2,
      total: 3,
    });

    expect(
      validateStoreConfigDraft({
        appServiceName: '淘宝店铺服务应用',
        appSubscriptionStatus: 'unsubscribed',
        authExpiresAt: '',
        authorizationStatus: 'unauthorized',
        channel: '淘宝',
        defaultCategory: '',
        defaultShelfStatus: 'online',
        deliverySla: '',
        freightTemplate: '   ',
        platformStoreId: '',
        shippingOrigin: '',
        shop: '',
        status: 'active',
        stockDeductionMethod: '',
      }),
    ).toEqual({
      allowed: false,
      message: '请先完成服务应用订购、平台店铺授权、店铺名称、授权有效期、默认类目、库存扣减方式、默认运费模板、发货时效、发货地省市后再保存店铺配置。',
      missingFields: ['服务应用订购', '平台店铺授权', '店铺名称', '授权有效期', '默认类目', '库存扣减方式', '默认运费模板', '发货时效', '发货地省市'],
    });

    expect(buildStoreAppSubscriptionPatch('抖音')).toEqual({
      appServiceName: '抖音店铺服务应用',
      appSubscriptionStatus: 'subscribed',
    });

    expect(getStoreFreightTemplateOptions('抖音')).toEqual([
      'FT-DY-002',
      'FT-DY-009',
      'FT-DY-LIVE',
    ]);

    expect(
      buildStoreAuthorizationLink({
        callbackUrl: 'https://prototype.local/store-auth/callback',
        channel: '抖音',
        configId: 'conf-new',
        requestId: 'auth-123',
      }),
    ).toBe('https://platform-auth.book-channel.local/store/authorize?platform=%E6%8A%96%E9%9F%B3&configId=conf-new&state=auth-123&redirectUri=https%3A%2F%2Fprototype.local%2Fstore-auth%2Fcallback');

    expect(
      buildStoreAuthorizationCallbackPatch({
        authExpiresAt: '2027-04-26',
        channel: '抖音',
        platformStoreId: 'DY-STORE-1001',
        requestId: 'auth-123',
        shopName: '抖音授权店铺',
      }),
    ).toEqual({
      appServiceName: '抖音店铺服务应用',
      appSubscriptionStatus: 'subscribed',
      authExpiresAt: '2027-04-26',
      authorizationStatus: 'authorized',
      channel: '抖音',
      platformStoreId: 'DY-STORE-1001',
      shop: '抖音授权店铺',
    });

    expect(
      completeStoreAuthorizationFromCallback(
        [buildDraftStoreConfigRow('conf-new', '刚刚')],
        'conf-new',
        {
          authExpiresAt: '2027-04-26',
          channel: '抖音',
          platformStoreId: 'DY-STORE-1001',
          requestId: 'auth-123',
          shopName: '抖音授权店铺',
        },
        '回调完成',
      )[0],
    ).toMatchObject({
      appSubscriptionStatus: 'subscribed',
      authorizationStatus: 'authorized',
      channel: '抖音',
      platformStoreId: 'DY-STORE-1001',
      shop: '抖音授权店铺',
      updatedAt: '回调完成',
    });

    expect(
      buildStoreAuthorizationPatch({
        authExpiresAt: '2027-04-26',
        platformStoreId: 'DY-STORE-1001',
        shopName: '抖音授权店铺',
      }),
    ).toEqual({
      authExpiresAt: '2027-04-26',
      authorizationStatus: 'authorized',
      platformStoreId: 'DY-STORE-1001',
      shop: '抖音授权店铺',
    });

    expect(
      validateStoreConfigDraft({
        appServiceName: '抖音店铺服务应用',
        appSubscriptionStatus: 'subscribed',
        authExpiresAt: '2027-04-26',
        authorizationStatus: 'authorized',
        channel: '抖音',
        defaultCategory: '标准图书 / 儿童文学',
        defaultShelfStatus: 'offline',
        deliverySla: '48 小时内发货',
        freightTemplate: 'FT-DY-009',
        platformStoreId: 'DY-STORE-1001',
        shippingOrigin: '北京市 / 北京市',
        shop: '北京亲子图书',
        status: 'draft',
        stockDeductionMethod: '拍下减库存',
      }),
    ).toMatchObject({
      allowed: true,
      missingFields: [],
    });
    expect(
      getStoreConfigAutoStatus({
        appServiceName: '抖音店铺服务应用',
        appSubscriptionStatus: 'subscribed',
        authExpiresAt: '2027-04-26',
        authorizationStatus: 'authorized',
        channel: '抖音',
        defaultCategory: '标准图书 / 儿童文学',
        defaultShelfStatus: 'offline',
        deliverySla: '48 小时内发货',
        freightTemplate: 'FT-DY-009',
        platformStoreId: 'DY-STORE-1001',
        shippingOrigin: '北京市 / 北京市',
        shop: '北京亲子图书',
        status: 'draft',
        stockDeductionMethod: '拍下减库存',
      }),
    ).toBe('active');

    expect(
      getStoreConfigSetupState({
        appServiceName: '抖音店铺服务应用',
        appSubscriptionStatus: 'subscribed',
        authExpiresAt: '2027-04-26',
        authorizationStatus: 'authorized',
        channel: '抖音',
        defaultCategory: '待选择默认类目',
        defaultShelfStatus: 'offline',
        deliverySla: '48 小时内发货',
        freightTemplate: '',
        platformStoreId: 'DY-STORE-1001',
        shippingOrigin: '北京市 / 北京市',
        shop: '抖音授权店铺',
        status: 'draft',
        stockDeductionMethod: '拍下减库存',
      }),
    ).toEqual({
      currentStep: 'configure-defaults',
      defaultsReady: false,
      nextActionLabel: '维护店铺配置',
      storeReady: true,
    });
  });

  it('filters materials by type, bind object and channel context', () => {
    expect(
      filterMaterialRows(
        materials,
        {
          bindObject: '套装增强',
          channel: '抖音',
          keyword: '',
          type: '详情图',
        },
        {
          channelItemRows: channelItems,
          detailPageRows: detailPages,
          productRows: products,
        },
      ).map((row) => row.id),
    ).toEqual(['asset-3']);

    expect(
      filterMaterialRows(
        materials,
        {
          bindObject: 'DK儿童百科',
          channel: '全部渠道',
          keyword: '',
          type: 'SKU 图',
        },
        {
          channelItemRows: channelItems,
          detailPageRows: detailPages,
          productRows: products,
        },
      ).map((row) => row.id),
    ).toEqual(['asset-6']);

    expect(
      filterMaterialRows(
        materials,
        {
          bindObject: '',
          channel: '全部渠道',
          keyword: 'DK儿童百科',
          type: '全部类型',
        },
        {
          channelItemRows: channelItems,
          detailPageRows: detailPages,
          productRows: products,
        },
      ).map((row) => row.id),
    ).toEqual(['asset-1', 'asset-2', 'asset-6']);

    expect(summarizeMaterialProductFolders(materials, products)[0]).toMatchObject({
      detailImageCount: 1,
      mainImageCount: 1,
      productId: 'prod-1',
      productName: 'DK儿童百科全书（彩绘版）',
      skuImageCount: 1,
      total: 3,
      usedBy: 6,
    });

    expect(summarizeMaterialTypeFolders(materials.filter((asset) => asset.productId === 'prod-1')).map((folder) => ({
      total: folder.total,
      type: folder.type,
    }))).toEqual([
      { total: 1, type: '主图' },
      { total: 1, type: '详情图' },
      { total: 1, type: 'SKU 图' },
    ]);
  });

  it('serializes and parses prototype snapshots with safe fallback', () => {
    const snapshot = {
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

    expect(parsePrototypeSnapshot(serializePrototypeSnapshot(snapshot), snapshot)).toEqual(snapshot);
    expect(parsePrototypeSnapshot(serializePrototypeSnapshot({
      ...snapshot,
      configs: [{
        channel: '淘宝',
        defaultCategory: '标准图书 / 少儿百科',
        defaultShelfStatus: 'online',
        deliverySla: '48 小时内发货',
        freightTemplate: 'FT-TB-001',
        id: 'conf-legacy',
        shop: '杭州旗舰店',
        status: 'active',
        updatedAt: '2026-04-20 12:00',
      } as typeof configs[number]],
    }), snapshot).configs[0]).toMatchObject({
      appServiceName: '淘宝店铺服务应用',
      appSubscriptionStatus: 'subscribed',
      authorizationStatus: 'authorized',
      defaultCategory: '标准图书 / 少儿百科',
      platformStoreId: 'STORE-CONF-LEGACY',
    });
    expect(parsePrototypeSnapshot('{"products":"broken"}', snapshot)).toEqual(snapshot);
    expect(parsePrototypeSnapshot('not-json', snapshot)).toEqual(snapshot);
  });

  it('builds and parses product list filters from route search', () => {
    expect(
      buildProductListSearchParams({
        keyword: 'BOOK-001',
        sourceChannel: '淘宝',
        status: 'published',
      }),
    ).toEqual({
      productKeyword: 'BOOK-001',
      productSourceChannel: '淘宝',
      productStatus: 'published',
    });

    expect(
      parseProductListFilters('?productKeyword=DK&productSourceChannel=%E5%BF%AB%E6%89%8B&productStatus=ready'),
    ).toEqual({
      keyword: 'DK',
      sourceChannel: '快手',
      status: 'ready',
    });

    expect(parseProductListFilters('')).toEqual({
      keyword: '',
      sourceChannel: '全部渠道',
      status: '全部状态',
    });
  });

  it('builds and parses import record list filters from route search', () => {
    expect(
      buildImportRecordListSearchParams({
        channel: '抖音',
        status: 'validate_failed',
      }),
    ).toEqual({
      importRecordChannel: '抖音',
      importRecordStatus: 'validate_failed',
    });

    expect(
      parseImportRecordListFilters('?importRecordChannel=%E5%BF%AB%E6%89%8B&importRecordStatus=validating'),
    ).toEqual({
      channel: '快手',
      status: 'validating',
    });
  });

  it('builds and parses channel item list filters from route search', () => {
    expect(
      buildChannelItemListSearchParams({
        channel: '淘宝',
        product: 'prod-1',
        shelfStatus: 'online',
        shop: '杭州旗舰店',
      }),
    ).toEqual({
      channelItemChannel: '淘宝',
      channelItemProduct: 'prod-1',
      channelItemShelfStatus: 'online',
      channelItemShop: '杭州旗舰店',
    });

    expect(
      parseChannelItemListFilters('?channelItemChannel=%E6%8A%96%E9%9F%B3&channelItemProduct=prod-2&channelItemShelfStatus=offline&channelItemShop=%E5%8C%97%E4%BA%AC%E4%BA%B2%E5%AD%90%E5%9B%BE%E4%B9%A6'),
    ).toEqual({
      channel: '抖音',
      product: 'prod-2',
      shelfStatus: 'offline',
      shop: '北京亲子图书',
    });
  });

  it('builds and parses detail page list filters from route search', () => {
    expect(
      buildDetailPageListSearchParams({
        channel: '淘宝',
        channelItem: 'item-1',
        detailName: '礼盒',
        product: 'prod-1',
        shop: '杭州旗舰店',
        status: 'history',
      }),
    ).toEqual({
      detailPageChannel: '淘宝',
      detailPageChannelItem: 'item-1',
      detailPageName: '礼盒',
      detailPageProduct: 'prod-1',
      detailPageShop: '杭州旗舰店',
      detailPageStatus: 'history',
    });

    expect(
      parseDetailPageListFilters('?detailPageChannel=%E6%B7%98%E5%AE%9D&detailPageChannelItem=item-1&detailPageName=%E7%A4%BC%E7%9B%92&detailPageProduct=prod-1&detailPageShop=%E6%9D%AD%E5%B7%9E%E6%97%97%E8%88%B0%E5%BA%97&detailPageStatus=current'),
    ).toEqual({
      channel: '淘宝',
      channelItem: 'item-1',
      detailName: '礼盒',
      product: 'prod-1',
      shop: '杭州旗舰店',
      status: 'current',
    });
  });

  it('builds and parses inventory, material and store-config filters from route search', () => {
    expect(
      buildInventoryListSearchParams({
        channel: '淘宝',
        searchTerm: 'BOOK-001',
        shop: '杭州旗舰店',
        status: 'success',
      }),
    ).toEqual({
      inventoryChannel: '淘宝',
      inventorySearchTerm: 'BOOK-001',
      inventoryShop: '杭州旗舰店',
      inventoryStatus: 'success',
    });
    expect(
      parseInventoryListFilters('?inventoryChannel=%E5%BF%AB%E6%89%8B&inventorySearchTerm=BOOK-001-GIFT&inventoryShop=%E5%BF%AB%E6%89%8B%E7%AB%A5%E4%B9%A6%E5%BA%97&inventoryStatus=syncing'),
    ).toEqual({
      channel: '快手',
      searchTerm: 'BOOK-001-GIFT',
      shop: '快手童书店',
      status: 'syncing',
    });

    expect(
      buildMaterialListSearchParams({
        bindObject: '礼盒',
        channel: '抖音',
        keyword: 'hero',
        type: 'SKU 图',
      }),
    ).toEqual({
      materialBindObject: '礼盒',
      materialChannel: '抖音',
      materialKeyword: 'hero',
      materialType: 'SKU 图',
    });
    expect(
      parseMaterialListFilters('?materialBindObject=%E7%A4%BC%E7%9B%92&materialChannel=%E6%8A%96%E9%9F%B3&materialKeyword=hero&materialType=SKU+%E5%9B%BE'),
    ).toEqual({
      bindObject: '礼盒',
      channel: '抖音',
      keyword: 'hero',
      type: 'SKU 图',
    });

    expect(
      buildStoreConfigListSearchParams({
        channel: '淘宝',
        shop: '杭州旗舰店',
        status: 'active',
      }),
    ).toEqual({
      storeConfigChannel: '淘宝',
      storeConfigShop: '杭州旗舰店',
      storeConfigStatus: 'active',
    });
    expect(
      parseStoreConfigListFilters('?storeConfigChannel=%E6%8A%96%E9%9F%B3&storeConfigShop=%E5%8C%97%E4%BA%AC%E4%BA%B2%E5%AD%90%E5%9B%BE%E4%B9%A6&storeConfigStatus=draft'),
    ).toEqual({
      channel: '抖音',
      shop: '北京亲子图书',
      status: 'draft',
    });
  });

  it('summarizes import records by status and total rows', () => {
    expect(summarizeImportRecords(importRecords)).toMatchObject({
      completed: 1,
      recordCount: 3,
      totalRows: 193,
      validate_failed: 1,
      validating: 1,
    });
  });

  it('builds row-level import record actions', () => {
    expect(buildImportRecordAction({ id: 'imp-x', status: 'validate_failed' })).toEqual({
      label: '下载失败明细',
      message: '已下载 imp-x 的失败明细，请修正文件后拖入新文件重新导入。',
      tone: 'warning',
    });
    expect(buildImportRecordAction({ id: 'imp-y', status: 'completed' })).toMatchObject({
      label: '下载结果',
      tone: 'success',
    });
  });

  it('creates a validating import record immediately after file upload', () => {
    expect(
      createImportRecordFromUpload(importRecords, {
        category: '淘宝图书 > 文学小说 > 科幻小说',
        channel: '淘宝',
        fileName: 'book-taobao-0427.xlsx',
        operator: '张敏',
        templateVersion: '淘宝导入模板 / 2026-04-27',
        timestamp: '2026-04-27 10:18',
      }),
    ).toMatchObject({
      category: '淘宝图书 > 文学小说 > 科幻小说',
      channel: '淘宝',
      failed: 0,
      fileName: 'book-taobao-0427.xlsx',
      id: 'imp-4',
      importType: '渠道商品导入',
      operator: '张敏',
      shop: '按模板识别',
      status: 'validating',
      success: 0,
      templateVersion: '淘宝导入模板 / 2026-04-27',
      total: 0,
    });
  });

  it('marks all inventory rows as synced after a manual sync', () => {
    const rows = [
      { channel: '淘宝', id: 'inv-a', productName: 'A', sellable: 1, shop: 'S1', sku: 'SKU-A', status: 'failed' as const, total: 2, updatedAt: '旧时间' },
      { channel: '快手', id: 'inv-b', productName: 'B', sellable: 3, shop: 'S2', sku: 'SKU-B', status: 'pending' as const, total: 4, updatedAt: '待同步' },
    ];

    expect(syncInventoryRows(rows, '刚刚')).toEqual([
      { ...rows[0], status: 'success', updatedAt: '刚刚' },
      { ...rows[1], status: 'success', updatedAt: '刚刚' },
    ]);
  });

  it('builds a batch edit submission summary only when targets and changed fields exist', () => {
    expect(
      buildBatchEditSubmission(channelItems.slice(0, 2), {
        nextShelfStatus: 'offline',
        priceDelta: -3,
        titleSuffix: '限时活动',
      }),
    ).toEqual({
      allowed: true,
      changedFields: ['标题后缀', '价格调整', '上下架状态'],
      message: '已提交批量修改任务，影响 2 个渠道商品，修改字段：标题后缀、价格调整、上下架状态。',
    });

    expect(
      buildBatchEditSubmission([], {
        nextShelfStatus: '保持不变',
        priceDelta: 0,
        titleSuffix: '',
      }),
    ).toMatchObject({
      allowed: false,
    });
  });

  it('filters inventory rows by channel, shop, status and search term', () => {
    expect(
      filterInventoryRows(inventory, {
        channel: '淘宝',
        searchTerm: 'BOOK-001-STD',
        shop: '杭州旗舰店',
        status: 'success',
      }).map((row) => row.id),
    ).toEqual(['inv-1']);
  });

  it('summarizes inventory rows for dashboard metrics', () => {
    expect(summarizeInventoryRows(inventory)).toEqual({
      failed: 1,
      pending: 1,
      sellable: 652,
      success: 1,
      syncing: 1,
      syncIssues: 3,
      total: 4,
      totalStock: 820,
    });
  });

  it('filters inventory adjustments by direction, status and search term', () => {
    expect(
      filterInventoryAdjustments(inventoryAdjustments, {
        direction: '入库',
        searchTerm: 'BOOK-002-SET',
        status: 'pending',
      }).map((row) => row.id),
    ).toEqual(['adj-3']);
  });

  it('validates inventory adjustment drafts before submit', () => {
    expect(
      validateInventoryAdjustmentDraft({
        direction: '入库',
        productName: 'DK儿童百科全书（彩绘版）',
        quantity: 8,
        reason: '补货入库',
        shop: '杭州旗舰店',
        sku: 'BOOK-001-STD',
      }),
    ).toEqual({
      allowed: true,
      message: '库存调整草稿完整，可以提交。',
      missingFields: [],
    });

    expect(
      validateInventoryAdjustmentDraft({
        direction: '入库',
        productName: '',
        quantity: 0,
        reason: '',
        shop: '',
        sku: '',
      }),
    ).toMatchObject({
      allowed: false,
      missingFields: ['产品', 'SKU', '店铺', '调整数量', '调整原因'],
    });
  });

  it('adds a material reference to a detail page only once', () => {
    const assets = [
      { detailPageIds: ['detail-1'], fileName: 'hero.jpg', id: 'asset-1', productId: 'prod-1', size: '1MB', src: '/x.jpg', type: '详情图' as const, usedBy: 1 },
    ];

    expect(reuseMaterial(assets, 'asset-1', 'detail-2')[0]).toMatchObject({
      detailPageIds: ['detail-1', 'detail-2'],
      usedBy: 2,
    });
    expect(reuseMaterial(assets, 'asset-1', 'detail-1')[0]).toMatchObject({
      detailPageIds: ['detail-1'],
      usedBy: 1,
    });
  });

  it('updates, reorders, appends and removes detail page blocks', () => {
    const updatedBlocks = updateDetailPageBlock(detailPages[0].blocks, 'b2', {
      body: '适合礼赠、亲子共读与百科入门。',
      title: '核心卖点升级',
    });
    expect(updatedBlocks.find((block) => block.id === 'b2')).toMatchObject({
      body: '适合礼赠、亲子共读与百科入门。',
      title: '核心卖点升级',
    });

    const movedBlocks = moveDetailPageBlock(updatedBlocks, 'b2', 'up');
    expect(movedBlocks.map((block) => block.id)).toEqual(['b2', 'b1']);

    const appendedBlocks = appendDetailPageBlock(movedBlocks, {
      body: '支持 7 天无忧退换。',
      id: 'b-new',
      title: '售后说明',
      type: 'text',
    });
    expect(appendedBlocks.at(-1)).toMatchObject({
      id: 'b-new',
      title: '售后说明',
      type: 'text',
    });

    const removedBlocks = removeDetailPageBlock(appendedBlocks, 'b1');
    expect(removedBlocks.map((block) => block.id)).toEqual(['b2', 'b-new']);
  });

  it('filters category mappings globally by fuzzy search', () => {
    expect(
      filterManagementCategoryMappings(managementCategoryMappings, {
        searchTerm: '',
      }).map((mapping) => mapping.id),
    ).toEqual(['cat-map-1', 'cat-map-2', 'cat-map-3', 'cat-map-4']);

    expect(
      filterManagementCategoryMappings(managementCategoryMappings, {
        searchTerm: '50025966',
      }).map((mapping) => mapping.id),
    ).toEqual(['cat-map-1']);
  });

  it('summarizes category mapping totals by active state', () => {
    expect(summarizeManagementCategoryMappings(managementCategoryMappings)).toEqual({
      active: 3,
      inactive: 1,
      total: 4,
    });
  });

  it('summarizes product export scope by publication readiness', () => {
    expect(summarizeProductExport(products.slice(0, 3))).toEqual({
      published: 1,
      ready: 1,
      total: 3,
      unpublished: 2,
    });
  });

  it('summarizes a product detail relationship footprint', () => {
    expect(
      summarizeProductRelationships({
        channelItems,
        detailPages,
        productId: 'prod-1',
      }),
    ).toEqual({
      channelItemCount: 2,
      currentDetailCount: 2,
      detailPageCount: 3,
      onlineChannelItemCount: 2,
    });
  });

  it('builds clear shelf action feedback for channel item detail', () => {
    expect(buildChannelItemShelfAction(channelItems[0])).toEqual({
      actionLabel: '下架商品',
      nextStatus: 'offline',
      tone: 'warning',
      message: '商品将切换为下架，用户端仍保留详情页和素材关系。',
    });
    expect(buildChannelItemShelfAction({ ...channelItems[0], shelfStatus: 'offline' })).toMatchObject({
      actionLabel: '上架商品',
      nextStatus: 'online',
      tone: 'success',
    });
  });

  it('filters attribute mappings by customer and category-mapping context', () => {
    expect(
      filterManagementAttributeMappings(managementAttributeMappings, {
        categoryMappingId: 'cat-map-1',
        customerId: 'customer-1',
        searchTerm: '',
      }).map((mapping) => mapping.id),
    ).toEqual(['attr-map-1', 'attr-map-2']);

    expect(
      filterManagementAttributeMappings(managementAttributeMappings, {
        categoryMappingId: 'cat-map-1',
        customerId: 'customer-1',
        searchTerm: '精装',
      }).map((mapping) => mapping.id),
    ).toEqual(['attr-map-2']);
  });

  it('summarizes attribute mappings with active totals', () => {
    expect(summarizeManagementAttributeMappings(managementAttributeMappings)).toEqual({
      active: 3,
      inactive: 1,
      total: 4,
    });
  });

  it('builds a draft category mapping for create mode from route context', () => {
    expect(
      buildDraftCategoryMapping(managementCategoryMappings[0], {
        channel: '抖音',
      }),
    ).toMatchObject({
      channel: '抖音',
      channelCategoryId: '',
      channelCategoryName: '',
      id: 'draft-category-mapping',
      shopScope: '待选择店铺范围',
      standardCategoryId: '',
      standardCategoryName: '',
      status: 'inactive',
      updatedAt: '未保存',
    });
  });

  it('builds a draft attribute mapping for create mode from route context', () => {
    expect(
      buildDraftAttributeMapping(managementAttributeMappings[0], {
        categoryMappingId: 'cat-map-3',
        channel: '抖音',
        customerId: 'customer-2',
        customerName: '童趣文化',
      }),
    ).toMatchObject({
      channel: '抖音',
      channelAttributeName: '',
      channelAttributeValue: '',
      customerId: 'customer-2',
      customerName: '童趣文化',
      id: 'draft-attribute-mapping',
      mappingId: 'cat-map-3',
      standardAttributeName: '',
      standardAttributeValue: '',
      status: 'inactive',
      updatedAt: '未保存',
    });
  });

  it('filters management customers by status and fuzzy search', () => {
    expect(
      filterManagementCustomers(customers, {
        searchTerm: '',
        status: 'enabled',
      }).map((customer) => customer.id),
    ).toEqual(['customer-1', 'customer-2']);

    expect(
      filterManagementCustomers(customers, {
        searchTerm: '未来',
        status: '全部状态',
      }).map((customer) => customer.id),
    ).toEqual(['customer-3']);
  });

  it('summarizes management customers by enabled state', () => {
    expect(summarizeManagementCustomers(customers)).toEqual({
      disabled: 1,
      enabled: 2,
      total: 3,
    });
  });

  it('builds a draft customer for create mode', () => {
    expect(buildDraftCustomer(customers[0])).toMatchObject({
      code: '',
      id: 'draft-customer',
      name: '',
      note: '',
      shopCount: 0,
      status: 'disabled',
      updatedAt: '未保存',
      userCount: 0,
    });
  });

  it('builds a draft customer user inside the current customer context', () => {
    expect(buildDraftCustomerUser('customer-1')).toMatchObject({
      createdAt: '未保存',
      customerId: 'customer-1',
      email: '',
      id: 'draft-customer-user',
      lastLogin: '未登录',
      name: '',
      phone: '',
      role: '商户操作员',
      status: 'disabled',
      updatedAt: '未保存',
      username: '',
    });
  });

  it('requires customer name and code before saving the customer', () => {
    expect(validateManagementCustomerDraft(buildDraftCustomer(customers[0]))).toEqual({
      allowed: false,
      message: '请先补齐客户名称、客户编码。',
      missingFields: ['客户名称', '客户编码'],
    });

    expect(
      validateManagementCustomerDraft({
        ...customers[0],
        code: 'CUS-009',
        name: '新客户',
      }),
    ).toEqual({
      allowed: true,
      message: '客户主体信息可提交保存。',
      missingFields: [],
    });
  });

  it('requires customer-user login account and name before saving', () => {
    expect(validateManagementCustomerUserDraft(buildDraftCustomerUser('customer-1'))).toEqual({
      allowed: false,
      message: '请先补齐登录账号、用户姓名。',
      missingFields: ['登录账号', '用户姓名'],
    });

    expect(
      validateManagementCustomerUserDraft({
        ...buildDraftCustomerUser('customer-1'),
        name: '陈默',
        username: 'chenmo',
      }),
    ).toEqual({
      allowed: true,
      message: '中台用户端用户信息可提交保存。',
      missingFields: [],
    });
  });

  it('filters management admin users by role, status and fuzzy search', () => {
    expect(
      filterManagementAdminUsers(managementAdminUsers, {
        role: '系统管理员',
        searchTerm: '',
        status: 'enabled',
      }).map((user) => user.id),
    ).toEqual(['admin-3']);

    expect(
      filterManagementAdminUsers(managementAdminUsers, {
        role: '全部角色',
        searchTerm: 'viewer',
        status: '全部状态',
      }).map((user) => user.id),
    ).toEqual(['admin-4']);
  });

  it('summarizes management admin users by enabled state', () => {
    expect(summarizeManagementAdminUsers(managementAdminUsers)).toEqual({
      disabled: 1,
      enabled: 3,
      total: 4,
    });
  });

  it('builds a draft management admin user for create mode', () => {
    expect(buildDraftManagementAdminUser(managementAdminUsers[0], '周静')).toMatchObject({
      createdAt: '未保存',
      createdBy: '周静',
      email: '',
      id: 'draft-admin-user',
      lastLogin: '未登录',
      name: '',
      phone: '',
      recentActionAt: '未写入审计',
      recentActionBy: '周静',
      role: '只读管理员',
      status: 'disabled',
      updatedAt: '未保存',
      username: '',
    });
  });

  it('requires management admin login account and name before saving', () => {
    expect(validateManagementAdminUserDraft(buildDraftManagementAdminUser(managementAdminUsers[0], '周静'))).toEqual({
      allowed: false,
      message: '请先补齐登录账号、用户姓名。',
      missingFields: ['登录账号', '用户姓名'],
    });

    expect(
      validateManagementAdminUserDraft({
        ...buildDraftManagementAdminUser(managementAdminUsers[0], '周静'),
        name: '平台管理员',
        username: 'platform-admin',
      }),
    ).toEqual({
      allowed: true,
      message: '管理端用户信息可提交保存。',
      missingFields: [],
    });
  });

  it('keeps customer usernames unique only inside the same customer scope', () => {
    expect(customerUsers.filter((user) => user.customerId === 'customer-1').map((user) => user.username)).toContain('zhaoyu');
    expect(customerUsers.filter((user) => user.customerId === 'customer-2').map((user) => user.username)).not.toContain('zhaoyu');
  });
});
