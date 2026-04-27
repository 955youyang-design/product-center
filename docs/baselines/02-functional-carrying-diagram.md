# 图书多渠道商品中台-功能承载图

| 字段 | 内容 |
|---|---|
| 文档名称 | 02-functional-carrying-diagram.md |
| doc_id | BL-FUNC-CARRY |
| doc_slug | functional-carrying-diagram |
| 文档层级 | baseline |
| 文档对象 | 功能承载图 |
| 适用端 | 中台用户端；中台管理端 |
| 所属角色 | 产品经理、产品 Agent、研发、测试 |
| baseline_version | BSL-2026-04-20-A |
| doc_version | 2026-04-24-r3 |
| doc_status | current-effective |
| 更新时间 | 2026-04-24 |

## 1. 说明

- 本图回答“每个功能最终由哪个页面组、页面、功能动作或专题机制承接”。
- 功能动作和规则能力虽然不在页面树中，但必须在承载图中明确位置。

## 2. 承载图

```mermaid
graph LR
  FEAT_PROD["产品管理"] --> PG_PROD["产品管理页面组"]
  PG_PROD --> PAGE_PROD_LIST["产品列表"]
  PG_PROD --> PAGE_PROD_DETAIL["产品详情"]
  PG_PROD --> PAGE_PROD_IMPORT["产品导入"]
  PG_PROD --> PAGE_PROD_LOG["导入记录"]
  PG_PROD -.菜单入口.-> PAGE_ASSET_LIST["素材列表"]
  PG_PROD --> ACT_PROD_CREATE["新增产品"]
  PG_PROD --> RULE_MERCHANT["商家编码关联"]
  RULE_MERCHANT --> MECH_IMPORT["标准化导入机制"]

  FEAT_ASSET["素材管理"] --> PG_ASSET["素材管理页面组"]
  PG_ASSET --> PAGE_ASSET_LIST["素材列表"]
  PG_ASSET --> PAGE_ASSET_DETAIL["产品素材文件夹详情"]

  FEAT_ITEM["商品管理"] --> PG_ITEM["商品管理页面组"]
  PG_ITEM --> PAGE_ITEM_LIST["商品列表"]
  PG_ITEM --> PAGE_ITEM_DETAIL["渠道商品详情"]
  PG_ITEM --> PAGE_ITEM_DETAIL_PAGE_LIST["渠道商品详情页列表"]
  PG_ITEM --> ACT_BATCH["批量修改"]
  PG_ITEM -.读取.-> RULE_CATEGORY["管理端类目/属性映射结果"]
  RULE_CATEGORY --> MECH_MGMT["中台管理端映射治理机制"]

  FEAT_INV["库存管理"] --> PG_INV["库存管理页面组"]
  PG_INV --> PAGE_INV_LIST["库存列表"]
  PG_INV --> PAGE_INV_DETAIL["库存详情"]
  PG_INV --> PAGE_INV_LOG["库存调整记录"]
  PG_INV --> MECH_INV["库存同步与分配机制"]

  FEAT_CONF["配置管理"] --> PG_CONF["配置管理页面组"]
  PG_CONF --> PAGE_CONF_LIST["配置列表"]
  PG_CONF --> PAGE_CONF_DETAIL["店铺配置详情"]

  FEAT_PROD --> MECH_AUTH["权限与审计机制"]
  FEAT_ITEM --> MECH_AUTH
  FEAT_INV --> MECH_AUTH
  FEAT_CONF --> MECH_AUTH
```

## 3. 当前说明

- 当前不纳入历史独立发布相关页面、系统配置详情、渠道配置详情、导入模板配置页和操作日志页。
- 以上历史路径保留文档占位，但不进入当前基线和前端任务。

## 4. 中台管理端V1.0承载图

```mermaid
graph LR
  FEAT_MGMT_CUSTOMER["客户管理"] --> PG_MGMT_CUSTOMER["客户管理页面组"]
  PG_MGMT_CUSTOMER --> PAGE_MGMT_CUSTOMER_LIST["客户列表"]
  PG_MGMT_CUSTOMER --> PAGE_MGMT_CUSTOMER_DETAIL["客户详情"]
  PAGE_MGMT_CUSTOMER_DETAIL --> CAP_CUSTOMER_USER["中台用户端用户管理"]
  CAP_CUSTOMER_USER --> ACT_CUSTOMER_USER_CREATE["开中台用户端用户"]
  CAP_CUSTOMER_USER --> ACT_CUSTOMER_USER_PASSWORD["重置中台用户端用户密码"]

  FEAT_MGMT_CATEGORY["类目映射"] --> PG_MGMT_CATEGORY["类目映射页面组"]
  PG_MGMT_CATEGORY --> PAGE_MGMT_CATEGORY_LIST["类目映射列表"]
  PG_MGMT_CATEGORY --> PAGE_MGMT_CATEGORY_DETAIL["类目映射编辑页"]
  PG_MGMT_CATEGORY --> RULE_MGMT_CATEGORY["店铺级类目动态适配"]
  PAGE_MGMT_CATEGORY_DETAIL --> RULE_CATEGORY_UNIQUE["全局类目映射唯一性"]

  FEAT_MGMT_ATTRIBUTE["属性值映射"] --> PG_MGMT_ATTRIBUTE["属性值映射页面组"]
  PG_MGMT_ATTRIBUTE --> PAGE_MGMT_ATTRIBUTE_LIST["属性值映射列表"]
  PG_MGMT_ATTRIBUTE --> PAGE_MGMT_ATTRIBUTE_DETAIL["属性值映射编辑页"]
  PG_MGMT_ATTRIBUTE --> RULE_MGMT_CATEGORY
  PAGE_MGMT_ATTRIBUTE_DETAIL --> RULE_CUSTOMER_ISOLATION

  FEAT_MGMT_SYSTEM["系统管理"] --> PG_MGMT_SYSTEM["系统管理页面组"]
  PG_MGMT_SYSTEM --> PAGE_MGMT_ADMIN_LIST["管理端用户列表"]
  PG_MGMT_SYSTEM --> PAGE_MGMT_ADMIN_DETAIL["管理端用户详情"]

  FEAT_MGMT_CUSTOMER --> MECH_MGMT_AUTH["权限与审计机制"]
  FEAT_MGMT_CATEGORY --> MECH_MGMT_AUTH
  FEAT_MGMT_ATTRIBUTE --> MECH_MGMT_AUTH
  FEAT_MGMT_SYSTEM --> MECH_MGMT_AUTH
```

### 4.1 承载说明

- 中台用户端用户管理由客户详情承接，不建立独立一级菜单或脱离客户上下文的全局列表。
- 店铺级类目动态适配由中台管理端的类目映射和属性值映射共同承接；中台用户端只读取适配结果。
- 类目映射不按客户隔离，新增或保存不要求 `customer_id`；属性值映射仍按自身页面组规则处理。
- 管理端用户只属于中台管理端自身，不与客户建立归属关系。
