# 图书多渠道商品中台-页面树表

| 字段 | 内容 |
|---|---|
| 文档名称 | 01-page-tree.md |
| doc_id | BL-PAGE-TREE |
| doc_slug | page-tree |
| 文档层级 | baseline |
| 文档对象 | 页面基线 |
| 适用端 | 中台用户端；中台管理端 |
| 所属角色 | 产品经理、产品 Agent、研发、测试 |
| baseline_version | BSL-2026-04-20-A |
| doc_version | 2026-04-24-r2 |
| doc_status | current-effective |
| 上游来源 | 图书多渠道商品中台-功能清单（Excel版）.xlsx |
| 更新时间 | 2026-04-24 |

## 1. 基线定位

- 页面树先描述 Excel 来源中的页面入口关系，再补充稳定键和菜单承接键。
- 页面节点、功能动作、规则能力分开治理；功能动作和规则能力不进入页面树主表。
- 详情页和记录页是否隐藏路由属于实现策略，下游可以约束，但不得覆盖上游来源入口。

## 2. Excel 来源页面树

| 功能模块 | 来源入口 | 当前页面 | 页面类型 | 进入方式 | 当前状态 | 备注 |
|---|---|---|---|---|---|---|
| 产品管理 | 菜单入口 | 产品列表 | 列表页 | 左侧菜单直达 | V1.0 | 一级菜单落点。 |
| 产品管理 | 产品列表 | 产品详情 | 详情页 | 列表内容进入 | V1.0 | 非菜单页。 |
| 产品管理 | 菜单入口 | 产品导入 | 工作页 | 二级菜单直达 | V1.0 | 独立菜单工作页。 |
| 产品管理 | 产品导入 | 导入记录 | 记录页 | 导入页进入 | V1.0 | 非菜单页。 |
| 产品管理 | 产品列表 | 新增产品 | 功能动作 | 列表按钮进入 | V1.0 | 功能动作，不纳入页面树稳定键表。 |
| 产品管理 | 菜单入口 | 素材列表 | 列表页 | 产品管理菜单直达 | V1.0 | 素材能力入口归到产品管理下。 |
| 产品管理 | 素材列表 | 产品素材文件夹详情 | 详情页 | 产品文件夹进入 | V1.0 | 非菜单页，按图片类型分文件夹展示。 |
| 商品管理 | 菜单入口 | 商品列表 | 列表页 | 左侧菜单直达 | V1.0 | 一级菜单落点。 |
| 商品管理 | 商品列表 | 渠道商品详情 | 详情页 | 列表内容进入 | V1.0 | 非菜单页。 |
| 商品管理 | 菜单入口 | 渠道商品详情页列表 | 列表页 | 二级菜单直达 | V1.0 | 全量渠道商品详情页内容管理入口；统一展示所有渠道商品详情页记录并支持编辑。 |
| 商品管理 | 菜单入口 | 批量修改 | 功能动作 | 二级菜单直达 | V1.0 | 功能动作，不纳入页面树稳定键表。 |
| 库存管理 | 菜单入口 | 库存列表 | 列表页 | 左侧菜单直达 | V1.0 | 一级菜单落点。 |
| 库存管理 | 库存列表 | 库存详情 | 详情页 | 列表内容进入 | V1.0 | 非菜单页。 |
| 库存管理 | 菜单入口 | 库存调整记录 | 记录页 | 二级菜单直达 | V1.0 | 独立菜单记录页。 |
| 配置管理 | 菜单入口 | 配置列表 | 列表页 | 左侧菜单直达 | V1.0 | 一级菜单落点。 |
| 配置管理 | 配置列表 | 店铺配置详情 | 详情页 | 列表内容进入 | V1.0 | 非菜单页。 |

## 3. 页面节点稳定键与菜单承接

| page_id | feature_id | page_name | route_key | menu_key | menu_visible | 来源入口 | 当前状态 | 备注 |
|---|---|---|---|---|---|---|---|---|
| PG-PROD-LIST | FEAT-PROD-LIST | 产品列表 | product.list | menu.product | 显示 | 左侧菜单直达 | V1.0 | 产品管理一级菜单落点。 |
| PG-PROD-DETAIL | FEAT-PROD-DETAIL | 产品详情 | product.detail | - | 隐藏 | 列表内容进入 | V1.0 | 详情页。 |
| PG-PROD-IMPORT | FEAT-PROD-IMPORT | 产品导入 | product.import | menu.product.import | 显示 | 二级菜单直达 | V1.0 | 产品管理二级菜单。 |
| PG-PROD-IMPORT-LOG | FEAT-PROD-IMPORT-LOG | 导入记录 | product.import_log | - | 隐藏 | 导入页进入 | V1.0 | 记录页。 |
| PG-ASSET-LIST | FEAT-ASSET-LIST | 素材列表 | asset.list | menu.asset | 显示 | 产品管理菜单直达 | V1.0 | 素材列表挂在产品管理下，不再作为独立一级菜单。 |
| PG-ASSET-DETAIL | FEAT-ASSET-DETAIL | 产品素材文件夹详情 | asset.detail | - | 隐藏 | 产品文件夹进入 | V1.0 | 按主图、详情图、SKU 图分文件夹展示。 |
| PG-ITEM-LIST | FEAT-ITEM-LIST | 商品列表 | item.list | menu.channel_item | 显示 | 左侧菜单直达 | V1.0 | 商品管理一级菜单落点。 |
| PG-ITEM-DETAIL | FEAT-ITEM-DETAIL | 渠道商品详情 | item.detail | - | 隐藏 | 列表内容进入 | V1.0 | 详情页。 |
| PG-ITEM-DETAIL-PAGE-LIST | FEAT-ITEM-DETAIL-PAGE-LIST | 渠道商品详情页列表 | item.detail_page_list | menu.channel_item.detail_page_list | 显示 | 二级菜单直达 | V1.0 | 商品管理二级菜单；承接详情页内容编辑、版本管理和素材复用。 |
| PG-INV-LIST | FEAT-INV-LIST | 库存列表 | inventory.list | menu.inventory | 显示 | 左侧菜单直达 | V1.0 | 库存管理一级菜单落点。 |
| PG-INV-DETAIL | FEAT-INV-DETAIL | 库存详情 | inventory.detail | - | 隐藏 | 列表内容进入 | V1.0 | 详情页。 |
| PG-INV-LOG | FEAT-INV-LOG | 库存调整记录 | inventory.adjust_log | menu.inventory.adjust_log | 显示 | 二级菜单直达 | V1.0 | 库存管理二级菜单。 |
| PG-CONF-LIST | FEAT-CONF-LIST | 配置列表 | config.list | menu.config | 显示 | 左侧菜单直达 | V1.0 | 配置管理一级菜单落点。 |
| PG-CONF-DETAIL | FEAT-CONF-SHOP-DETAIL | 店铺配置详情 | config.shop_detail | - | 隐藏 | 列表内容进入 | V1.0 | 详情页。 |

## 4. 菜单路由调整要求

1. `page_id`、`page_group_id`、`menu_key`、`route_key` 是稳定治理键；调整菜单层级、中文名称或路由路径时，不得重建新键。
2. 菜单路由调整必须首先遵守来源入口关系：产品导入和渠道商品详情页列表是V1.0二级菜单直达，库存调整记录是V1.0二级菜单直达，新增产品是列表按钮进入；不得再把详情页内容编辑塞回渠道商品详情页。
3. 批量修改属于功能动作，不在页面树主表建 `page_id`；如果前端后续为其增加独立路由，应按“二级菜单直达”承接，而不是反写成列表按钮入口。
4. 详情页、记录页是否采用隐藏路由、`activePath` 或其他回挂策略，属于下游实现，不得反向覆盖本页中的来源入口事实。

## 5. 中台管理端V1.0页面树

本节承接 `docs/01-端产品层/07-中台管理端产品文档.md`。中台管理端是独立端，推荐根路径为 `/management`，不挂入中台用户端现有菜单。

### 5.1 来源页面树

| 功能模块 | 来源入口 | 当前页面 | 页面类型 | 进入方式 | 当前状态 | 备注 |
|---|---|---|---|---|---|---|
| 客户管理 | 菜单入口 | 客户列表 | 列表页 | 左侧菜单直达 | V1.0 | 管理客户主体，发起开客户。 |
| 客户管理 | 客户列表 | 客户详情 | 详情页 | 列表内容进入 | V1.0 | 承接客户基础信息和中台用户端用户管理。 |
| 客户管理 | 客户详情 | 中台用户端用户管理 | 页签能力 | 客户详情页签进入 | V1.0 | 不做独立一级菜单，必须在客户上下文内操作。 |
| 类目映射 | 菜单入口 | 类目映射列表 | 列表页 | 左侧菜单直达 | V1.0 | 按渠道查看平台全局类目映射。 |
| 类目映射 | 类目映射列表 | 类目映射编辑页 | 工作页 | 列表内容或新增动作进入 | V1.0 | 新增和编辑复用同一工作页。 |
| 属性值映射 | 菜单入口 | 属性值映射列表 | 列表页 | 左侧菜单直达 | V1.0 | 按客户、渠道、类目查看属性值映射。 |
| 属性值映射 | 属性值映射列表 | 属性值映射编辑页 | 工作页 | 列表内容或新增动作进入 | V1.0 | 依附客户和类目映射上下文。 |
| 系统管理 | 菜单入口 | 管理端用户列表 | 列表页 | 左侧菜单直达 | V1.0 | 管理中台管理端自身后台账号。 |
| 系统管理 | 管理端用户列表 | 管理端用户详情 | 详情页 | 列表内容进入 | V1.0 | 维护后台用户资料、角色和状态。 |

### 5.2 页面节点稳定键与菜单承接

| page_id | feature_id | page_name | route_key | route_path | menu_key | menu_visible | 来源入口 | 当前状态 | 备注 |
|---|---|---|---|---|---|---|---|---|---|
| PG-MGMT-CUSTOMER-LIST | FEAT-MGMT-CUSTOMER-LIST | 客户列表 | mgmt.customer.list | /management/customers/list | menu.mgmt.customer | 显示 | 左侧菜单直达 | V1.0 | 客户管理一级菜单落点。 |
| PG-MGMT-CUSTOMER-DETAIL | FEAT-MGMT-CUSTOMER-DETAIL | 客户详情 | mgmt.customer.detail | /management/customers/detail | - | 隐藏 | 列表内容进入 | V1.0 | 详情页；中台用户端用户管理在本页页签承接。 |
| PG-MGMT-CATEGORY-MAPPING-LIST | FEAT-MGMT-CATEGORY-MAPPING-LIST | 类目映射列表 | mgmt.category_mapping.list | /management/category-mappings/list | menu.mgmt.category_mapping | 显示 | 左侧菜单直达 | V1.0 | 类目映射一级菜单落点。 |
| PG-MGMT-CATEGORY-MAPPING-DETAIL | FEAT-MGMT-CATEGORY-MAPPING-DETAIL | 类目映射编辑页 | mgmt.category_mapping.detail | /management/category-mappings/detail | - | 隐藏 | 列表内容或新增动作进入 | V1.0 | 工作页。 |
| PG-MGMT-ATTRIBUTE-MAPPING-LIST | FEAT-MGMT-ATTRIBUTE-MAPPING-LIST | 属性值映射列表 | mgmt.attribute_mapping.list | /management/attribute-mappings/list | menu.mgmt.attribute_mapping | 显示 | 左侧菜单直达 | V1.0 | 属性值映射一级菜单落点。 |
| PG-MGMT-ATTRIBUTE-MAPPING-DETAIL | FEAT-MGMT-ATTRIBUTE-MAPPING-DETAIL | 属性值映射编辑页 | mgmt.attribute_mapping.detail | /management/attribute-mappings/detail | - | 隐藏 | 列表内容或新增动作进入 | V1.0 | 工作页。 |
| PG-MGMT-ADMIN-USER-LIST | FEAT-MGMT-ADMIN-USER-LIST | 管理端用户列表 | mgmt.system.admin_user_list | /management/system/admin-users/list | menu.mgmt.system | 显示 | 左侧菜单直达 | V1.0 | 系统管理一级菜单落点。 |
| PG-MGMT-ADMIN-USER-DETAIL | FEAT-MGMT-ADMIN-USER-DETAIL | 管理端用户详情 | mgmt.system.admin_user_detail | /management/system/admin-users/detail | - | 隐藏 | 列表内容进入 | V1.0 | 详情页。 |

### 5.3 中台管理端菜单路由要求

1. 中台管理端必须作为独立端建设，推荐根路径 `/management`。
2. 中台用户端用户管理必须挂在客户详情下，不得升为独立一级菜单。
3. 类目映射、属性值映射和中台用户端用户都必须以 `customer_id` 作为隔离主键。
4. 管理端用户归属于中台管理端自身，不挂客户，不参与客户隔离。
