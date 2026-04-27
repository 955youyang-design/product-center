# 图书多渠道商品中台-功能清单表

| 字段 | 内容 |
|---|---|
| 文档名称 | 00-feature-list.md |
| doc_id | BL-FEATURE-LIST |
| doc_slug | feature-list |
| 文档层级 | baseline |
| 文档对象 | 功能基线 |
| 适用端 | 中台用户端；中台管理端 |
| 所属角色 | 产品经理、产品 Agent、研发、测试 |
| baseline_version | BSL-2026-04-20-A |
| doc_version | 2026-04-24-r3 |
| doc_status | current-effective |
| 上游来源 | 图书多渠道商品中台-功能清单（Excel版）.xlsx |
| 更新时间 | 2026-04-24 |

## 1. 基线定位

- 本表是当前项目范围的权威源，任何范围变化必须先回写本表。
- 页面、功能动作和规则能力分开建模，但统一挂到稳定追踪链。
- 当前项目的核心目标是把多渠道、多店铺商品信息通过模板导入中台，并在统一后台维护产品、渠道商品和库存。

## 2. 状态口径

| 口径项 | 当前统一值 | 说明 |
|---|---|---|
| 适用端 | 中台用户端；中台管理端 | 不再保留其他端描述。 |
| 功能优先级 | 0 | 全部功能优先级打平，不再区分高低等级。 |
| 版本范围 | V1.0 | 全部功能、页面、接口和测试统一作为 V1.0。 |
| 当前状态 | V1.0 | 表示当前有效并纳入研发、测试和验收口径。 |

## 3. 功能清单

| feature_id | parent_feature_id | 功能层级 | 功能名称 | 节点类型 | 所属端 | 所属角色 | 优先级 | 版本范围 | 当前状态 | 承接页面组/机制 | 来源 | 备注 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| FEAT-PROD | - | 一级功能 | 产品管理 | 一级功能 | 中台用户端 | 商品运营 | 0 | V1.0 | V1.0 | PGROUP-PROD | 当前功能清单 | 产品主档、导入与归集主模块。 |
| FEAT-PROD-LIST | FEAT-PROD | 二级节点 | 产品列表 | 页面 | 中台用户端 | 商品运营 | 0 | V1.0 | V1.0 | PGROUP-PROD | 当前功能清单 | 产品管理主入口。 |
| FEAT-PROD-DETAIL | FEAT-PROD | 二级节点 | 产品详情 | 页面 | 中台用户端 | 商品运营 | 0 | V1.0 | V1.0 | PGROUP-PROD | 当前功能清单 | 维护图书产品主档与默认内容。 |
| FEAT-PROD-IMPORT | FEAT-PROD | 二级节点 | 产品导入 | 页面 | 中台用户端 | 商品运营 | 0 | V1.0 | V1.0 | PGROUP-PROD | 当前功能清单 | 模板下载、导入校验与导入执行入口。 |
| FEAT-PROD-IMPORT-LOG | FEAT-PROD | 二级节点 | 导入记录 | 页面 | 中台用户端 | 商品运营 | 0 | V1.0 | V1.0 | PGROUP-PROD | 当前功能清单 | 导入结果回溯、失败行查看与关联处理结果查看。 |
| FEAT-PROD-MERCHANT-LINK | FEAT-PROD | 二级节点 | 商家编码关联 | 规则能力 | 中台用户端 | 商品运营 | 0 | V1.0 | V1.0 | MECH-IMPORT-STD | 当前功能清单 | 通过商家编码建立产品与渠道商品统一归集关系。 |
| FEAT-PROD-CREATE | FEAT-PROD | 二级节点 | 新增产品 | 功能动作 | 中台用户端 | 商品运营 | 0 | V1.0 | V1.0 | PGROUP-PROD | 当前功能清单 | 少量手工补录产品主档。 |
| FEAT-ASSET | - | 一级功能 | 素材管理 | 一级功能 | 中台用户端 | 商品运营、渠道运营 | 0 | V1.0 | V1.0 | PGROUP-ASSET | 当前功能清单 | 统一查看导入后的主图、详情图、SKU 图以及商品详情页上传沉淀的素材文件；菜单入口挂在产品管理下。 |
| FEAT-ASSET-LIST | FEAT-ASSET | 二级节点 | 素材列表 | 页面 | 中台用户端 | 商品运营、渠道运营 | 0 | V1.0 | V1.0 | PGROUP-ASSET | 当前功能清单 | 素材资产总览。 |
| FEAT-ASSET-DETAIL | FEAT-ASSET | 二级节点 | 产品素材文件夹详情 | 页面 | 中台用户端 | 商品运营、渠道运营 | 0 | V1.0 | V1.0 | PGROUP-ASSET | 当前功能清单 | 按产品查看素材文件夹，并按主图、详情图、SKU 图分文件夹展示图片内容和引用关系。 |
| FEAT-ITEM | - | 一级功能 | 商品管理 | 一级功能 | 中台用户端 | 渠道运营 | 0 | V1.0 | V1.0 | PGROUP-ITEM | 当前功能清单 | 统一维护多渠道多店铺商品差异信息。 |
| FEAT-ITEM-LIST | FEAT-ITEM | 二级节点 | 商品列表 | 页面 | 中台用户端 | 渠道运营 | 0 | V1.0 | V1.0 | PGROUP-ITEM | 当前功能清单 | 统一查看多渠道多店铺商品售卖信息。 |
| FEAT-ITEM-DETAIL | FEAT-ITEM | 二级节点 | 渠道商品详情 | 页面 | 中台用户端 | 渠道运营 | 0 | V1.0 | V1.0 | PGROUP-ITEM | 当前功能清单 | 轻量维护标题、价格、属性、履约和上架信息，并展示详情页关联摘要。 |
| FEAT-ITEM-DETAIL-PAGE-LIST | FEAT-ITEM | 二级节点 | 渠道商品详情页列表 | 页面 | 中台用户端 | 渠道运营 | 0 | V1.0 | V1.0 | PGROUP-ITEM | 当前功能清单 | 统一查看和管理全部渠道商品详情页数据；一个产品在多渠道售卖会形成多个渠道商品；单个渠道商品最多允许 3 个详情页；支持上传新增详情页、编辑详情页内容，并复用素材列表中的图片到多个商品详情页。 |
| FEAT-ITEM-BATCH-EDIT | FEAT-ITEM | 二级节点 | 批量修改 | 功能动作 | 中台用户端 | 渠道运营 | 0 | V1.0 | V1.0 | PGROUP-ITEM | 当前功能清单 | 支持批量修改标题、价格、批量上下架和库存。 |
| FEAT-INV | - | 一级功能 | 库存管理 | 一级功能 | 中台用户端 | 库存运营 | 0 | V1.0 | V1.0 | PGROUP-INV | 当前功能清单 | 统一维护同一产品在各渠道商品和店铺下的库存。 |
| FEAT-INV-LIST | FEAT-INV | 二级节点 | 库存列表 | 页面 | 中台用户端 | 库存运营 | 0 | V1.0 | V1.0 | PGROUP-INV | 当前功能清单 | 库存总览、库存调整和同步操作主入口。 |
| FEAT-INV-DETAIL | FEAT-INV | 二级节点 | 库存详情 | 页面 | 中台用户端 | 库存运营 | 0 | V1.0 | V1.0 | PGROUP-INV | 当前功能清单 | 查看单条库存记录的完整明细。 |
| FEAT-INV-LOG | FEAT-INV | 二级节点 | 库存调整记录 | 页面 | 中台用户端 | 库存运营 | 0 | V1.0 | V1.0 | PGROUP-INV | 当前功能清单 | 查看库存台账、调整前后变化与原因。 |
| FEAT-CONF | - | 一级功能 | 配置管理 | 一级功能 | 中台用户端 | 系统管理员 | 0 | V1.0 | V1.0 | PGROUP-CONF | 当前功能清单 | 店铺配置维护主模块。 |
| FEAT-CONF-LIST | FEAT-CONF | 二级节点 | 配置列表 | 页面 | 中台用户端 | 系统管理员 | 0 | V1.0 | V1.0 | PGROUP-CONF | 当前功能清单 | 按渠道与店铺维护规则配置主入口。 |
| FEAT-CONF-SHOP-DETAIL | FEAT-CONF | 二级节点 | 店铺配置详情 | 页面 | 中台用户端 | 系统管理员 | 0 | V1.0 | V1.0 | PGROUP-CONF | 当前功能清单 | 维护运费模板、上下架默认状态与发货时效；类目动态适配规则由中台管理端维护。 |

## 4. 功能到菜单入口承接口径

| feature_id | 节点类型 | 主要承接对象 | 菜单入口类型 | 进入方式 | 当前状态 | 说明 |
|---|---|---|---|---|---|---|
| FEAT-PROD | 一级功能 | PGROUP-PROD | 一级菜单模块 | 左侧菜单直达 | V1.0 | 产品管理一级导航模块。 |
| FEAT-PROD-LIST | 页面 | PG-PROD-LIST | 一级菜单落点 | 左侧菜单直达 | V1.0 | 产品管理主入口。 |
| FEAT-PROD-DETAIL | 页面 | PG-PROD-DETAIL | 非菜单页 | 列表内容进入 | V1.0 | 详情页不单独作为菜单入口。 |
| FEAT-PROD-IMPORT | 页面 | PG-PROD-IMPORT | 二级菜单 | 二级菜单直达 | V1.0 | 独立工作页。 |
| FEAT-PROD-IMPORT-LOG | 页面 | PG-PROD-IMPORT-LOG | 非菜单页 | 导入页进入 | V1.0 | 导入记录页。 |
| FEAT-PROD-MERCHANT-LINK | 规则能力 | MECH-IMPORT-STD | 不单独建菜单 | 导入校验和落库过程执行 | V1.0 | 规则能力，不单独占菜单节点。 |
| FEAT-PROD-CREATE | 功能动作 | ACTION-PROD-CREATE | 列表内动作 | 列表按钮进入 | V1.0 | 手工补录动作。 |
| FEAT-ASSET | 一级功能 | PGROUP-ASSET | 不单独建一级菜单 | 产品管理菜单承接 | V1.0 | 素材能力保留独立页面组，入口归产品管理。 |
| FEAT-ASSET-LIST | 页面 | PG-ASSET-LIST | 产品管理菜单项 | 产品管理菜单直达 | V1.0 | 素材列表挂在产品管理下。 |
| FEAT-ASSET-DETAIL | 页面 | PG-ASSET-DETAIL | 非菜单页 | 列表内容进入 | V1.0 | 详情页不单独作为菜单入口。 |
| FEAT-ITEM | 一级功能 | PGROUP-ITEM | 一级菜单模块 | 左侧菜单直达 | V1.0 | 商品管理一级导航模块。 |
| FEAT-ITEM-LIST | 页面 | PG-ITEM-LIST | 一级菜单落点 | 左侧菜单直达 | V1.0 | 商品管理主入口。 |
| FEAT-ITEM-DETAIL | 页面 | PG-ITEM-DETAIL | 非菜单页 | 列表内容进入 | V1.0 | 详情页不单独作为菜单入口。 |
| FEAT-ITEM-DETAIL-PAGE-LIST | 页面 | PG-ITEM-DETAIL-PAGE-LIST | 二级菜单 | 二级菜单直达 | V1.0 | 商品管理当前二级菜单，用于统一维护渠道商品详情页内容、版本和素材复用关系。 |
| FEAT-ITEM-BATCH-EDIT | 功能动作 | ACTION-ITEM-BATCH-EDIT | 二级菜单 | 二级菜单直达 | V1.0 | 独立批量动作入口。 |
| FEAT-INV | 一级功能 | PGROUP-INV | 一级菜单模块 | 左侧菜单直达 | V1.0 | 库存管理一级导航模块。 |
| FEAT-INV-LIST | 页面 | PG-INV-LIST | 一级菜单落点 | 左侧菜单直达 | V1.0 | 库存管理主入口。 |
| FEAT-INV-DETAIL | 页面 | PG-INV-DETAIL | 非菜单页 | 列表内容进入 | V1.0 | 详情页不单独作为菜单入口。 |
| FEAT-INV-LOG | 页面 | PG-INV-LOG | 二级菜单 | 二级菜单直达 | V1.0 | 独立记录页入口。 |
| FEAT-CONF | 一级功能 | PGROUP-CONF | 一级菜单模块 | 左侧菜单直达 | V1.0 | 配置管理一级导航模块。 |
| FEAT-CONF-LIST | 页面 | PG-CONF-LIST | 一级菜单落点 | 左侧菜单直达 | V1.0 | 配置管理主入口。 |
| FEAT-CONF-SHOP-DETAIL | 页面 | PG-CONF-DETAIL | 非菜单页 | 列表内容进入 | V1.0 | 详情页不单独作为菜单入口。 |

## 5. 菜单路由治理约束

- 功能清单负责定义“模块、页面、动作、规则能力”以及它们的来源入口关系，不直接等同于当前前端代码现状。
- 只有页面节点进入页面树；功能动作和规则能力必须分别在页面组文档和专题机制文档承接。
- 上游入口语义以 Excel 功能清单和页面树为准：产品导入、渠道商品详情页列表、批量修改、库存调整记录属于独立菜单入口；新增产品属于列表按钮进入。
- 如果后续需要调整菜单层级、路由路径或显隐策略，必须先回写基线，再同步更新端产品文档、页面脚手架和追踪矩阵。

## 6. 中台管理端V1.0功能清单

本节承接 `docs/01-端产品层/07-中台管理端产品文档.md`，用于给后续页面设计、数据接口和验收测试提供稳定功能键。当前状态为V1.0，尚不改变中台用户端 V1 交付范围。

| feature_id | parent_feature_id | 功能层级 | 功能名称 | 节点类型 | 所属端 | 所属角色 | 优先级 | 版本范围 | 当前状态 | 承接页面组/机制 | 来源 | 备注 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| FEAT-MGMT-CUSTOMER | - | 一级功能 | 客户管理 | 一级功能 | 中台管理端 | 平台管理员、运营管理员 | 0 | V1.0 | V1.0 | PGROUP-MGMT-CUSTOMER | 端产品层设计 | 客户是中台用户端用户和属性值映射的隔离主体；类目映射不按客户隔离。 |
| FEAT-MGMT-CUSTOMER-LIST | FEAT-MGMT-CUSTOMER | 二级节点 | 客户列表 | 页面 | 中台管理端 | 平台管理员、运营管理员 | 0 | V1.0 | V1.0 | PGROUP-MGMT-CUSTOMER | 端产品层设计 | 查看客户、筛选状态、进入客户详情。 |
| FEAT-MGMT-CUSTOMER-DETAIL | FEAT-MGMT-CUSTOMER | 二级节点 | 客户详情 | 页面 | 中台管理端 | 平台管理员、运营管理员 | 0 | V1.0 | V1.0 | PGROUP-MGMT-CUSTOMER | 端产品层设计 | 维护客户基础信息和客户下中台用户端用户。 |
| FEAT-MGMT-CUSTOMER-CREATE | FEAT-MGMT-CUSTOMER | 二级节点 | 开客户 | 功能动作 | 中台管理端 | 平台管理员、运营管理员 | 0 | V1.0 | V1.0 | ACTION-MGMT-CUSTOMER-CREATE | 端产品层设计 | 从客户列表发起。 |
| FEAT-MGMT-CUSTOMER-STATUS | FEAT-MGMT-CUSTOMER | 二级节点 | 启停用客户 | 功能动作 | 中台管理端 | 平台管理员、运营管理员 | 0 | V1.0 | V1.0 | ACTION-MGMT-CUSTOMER-STATUS | 端产品层设计 | 控制客户是否可用。 |
| FEAT-MGMT-CUSTOMER-USER | FEAT-MGMT-CUSTOMER | 二级节点 | 中台用户端用户管理 | 功能能力 | 中台管理端 | 平台管理员、运营管理员 | 0 | V1.0 | V1.0 | PG-MGMT-CUSTOMER-DETAIL | 端产品层设计 | 放在客户详情下，必须按客户隔离。 |
| FEAT-MGMT-CUSTOMER-USER-CREATE | FEAT-MGMT-CUSTOMER-USER | 三级节点 | 开中台用户端用户 | 功能动作 | 中台管理端 | 平台管理员、运营管理员 | 0 | V1.0 | V1.0 | ACTION-MGMT-CUSTOMER-USER-CREATE | 端产品层设计 | 在客户详情内为当前客户开用户。 |
| FEAT-MGMT-CUSTOMER-USER-PASSWORD | FEAT-MGMT-CUSTOMER-USER | 三级节点 | 重置中台用户端用户密码 | 功能动作 | 中台管理端 | 平台管理员、运营管理员 | 0 | V1.0 | V1.0 | ACTION-MGMT-CUSTOMER-USER-RESET-PASSWORD | 端产品层设计 | 仅能重置当前客户下的中台用户端用户。 |
| FEAT-MGMT-CATEGORY-MAPPING | - | 一级功能 | 类目映射 | 一级功能 | 中台管理端 | 平台管理员、运营管理员 | 0 | V1.0 | V1.0 | PGROUP-MGMT-CATEGORY-MAPPING | 端产品层设计 | 维护平台全局的渠道类目到商品中台标准类目的映射。 |
| FEAT-MGMT-CATEGORY-MAPPING-LIST | FEAT-MGMT-CATEGORY-MAPPING | 二级节点 | 类目映射列表 | 页面 | 中台管理端 | 平台管理员、运营管理员 | 0 | V1.0 | V1.0 | PGROUP-MGMT-CATEGORY-MAPPING | 端产品层设计 | 按渠道、状态筛选映射关系。 |
| FEAT-MGMT-CATEGORY-MAPPING-DETAIL | FEAT-MGMT-CATEGORY-MAPPING | 二级节点 | 类目映射编辑页 | 页面 | 中台管理端 | 平台管理员、运营管理员 | 0 | V1.0 | V1.0 | PGROUP-MGMT-CATEGORY-MAPPING | 端产品层设计 | 新增或编辑类目映射。 |
| FEAT-MGMT-CATEGORY-DYNAMIC-ADAPTATION | FEAT-MGMT-CATEGORY-MAPPING | 二级节点 | 店铺级类目动态适配 | 规则能力 | 中台管理端 | 平台管理员、运营管理员 | 0 | V1.0 | V1.0 | DOC-MECH-MGMT-CUSTOMER-MAPPING | 端产品层设计 | 中台管理端按渠道、店铺和类目维护映射规则；中台用户端商品详情只读取适配结果，不维护规则。 |
| FEAT-MGMT-CATEGORY-MAPPING-STATUS | FEAT-MGMT-CATEGORY-MAPPING | 二级节点 | 启停用类目映射 | 功能动作 | 中台管理端 | 平台管理员、运营管理员 | 0 | V1.0 | V1.0 | ACTION-MGMT-CATEGORY-MAPPING-STATUS | 端产品层设计 | 控制映射是否生效。 |
| FEAT-MGMT-ATTRIBUTE-MAPPING | - | 一级功能 | 属性值映射 | 一级功能 | 中台管理端 | 平台管理员、运营管理员 | 0 | V1.0 | V1.0 | PGROUP-MGMT-ATTRIBUTE-MAPPING | 端产品层设计 | 按客户维护渠道属性值到中台标准值的映射。 |
| FEAT-MGMT-ATTRIBUTE-MAPPING-LIST | FEAT-MGMT-ATTRIBUTE-MAPPING | 二级节点 | 属性值映射列表 | 页面 | 中台管理端 | 平台管理员、运营管理员 | 0 | V1.0 | V1.0 | PGROUP-MGMT-ATTRIBUTE-MAPPING | 端产品层设计 | 按客户、渠道、类目、属性筛选。 |
| FEAT-MGMT-ATTRIBUTE-MAPPING-DETAIL | FEAT-MGMT-ATTRIBUTE-MAPPING | 二级节点 | 属性值映射编辑页 | 页面 | 中台管理端 | 平台管理员、运营管理员 | 0 | V1.0 | V1.0 | PGROUP-MGMT-ATTRIBUTE-MAPPING | 端产品层设计 | 新增或编辑属性值映射。 |
| FEAT-MGMT-ATTRIBUTE-MAPPING-STATUS | FEAT-MGMT-ATTRIBUTE-MAPPING | 二级节点 | 启停用属性值映射 | 功能动作 | 中台管理端 | 平台管理员、运营管理员 | 0 | V1.0 | V1.0 | ACTION-MGMT-ATTRIBUTE-MAPPING-STATUS | 端产品层设计 | 控制映射是否生效。 |
| FEAT-MGMT-SYSTEM | - | 一级功能 | 系统管理 | 一级功能 | 中台管理端 | 平台管理员、系统管理员 | 0 | V1.0 | V1.0 | PGROUP-MGMT-SYSTEM | 端产品层设计 | 管理中台管理端自己的后台用户。 |
| FEAT-MGMT-ADMIN-USER-LIST | FEAT-MGMT-SYSTEM | 二级节点 | 管理端用户列表 | 页面 | 中台管理端 | 平台管理员、系统管理员 | 0 | V1.0 | V1.0 | PGROUP-MGMT-SYSTEM | 端产品层设计 | 查看管理端用户并发起开用户、编辑和重置密码。 |
| FEAT-MGMT-ADMIN-USER-DETAIL | FEAT-MGMT-SYSTEM | 二级节点 | 管理端用户详情 | 页面 | 中台管理端 | 平台管理员、系统管理员 | 0 | V1.0 | V1.0 | PGROUP-MGMT-SYSTEM | 端产品层设计 | 维护管理端用户基础信息、角色和状态。 |
| FEAT-MGMT-ADMIN-USER-CREATE | FEAT-MGMT-SYSTEM | 二级节点 | 开管理端用户 | 功能动作 | 中台管理端 | 平台管理员、系统管理员 | 0 | V1.0 | V1.0 | ACTION-MGMT-ADMIN-USER-CREATE | 端产品层设计 | 从管理端用户列表发起。 |
| FEAT-MGMT-ADMIN-USER-PASSWORD | FEAT-MGMT-SYSTEM | 二级节点 | 重置管理端用户密码 | 功能动作 | 中台管理端 | 平台管理员、系统管理员 | 0 | V1.0 | V1.0 | ACTION-MGMT-ADMIN-USER-RESET-PASSWORD | 端产品层设计 | 重置中台管理端后台账号密码。 |
