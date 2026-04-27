from __future__ import annotations

from pathlib import Path
from textwrap import dedent


ROOT = Path("/Users/youyang/项目/2026/商品中台")
DOCS_ROOT = ROOT / "docs"
TODAY = "2026-04-21"
BASELINE_VERSION = "BSL-2026-04-20-A"
DOC_VERSION = "2026-04-21-r4"
OWNER = "产品 Agent"
PROJECT = "图书多渠道商品中台"


def md_table(headers: list[str], rows: list[list[str]]) -> str:
    lines = [
        "| " + " | ".join(headers) + " |",
        "|" + "|".join(["---"] * len(headers)) + "|",
    ]
    for row in rows:
        lines.append("| " + " | ".join(row) + " |")
    return "\n".join(lines)


def meta_table(meta: list[tuple[str, str]]) -> str:
    return md_table(["字段", "内容"], [[k, v] for k, v in meta])


def bullet(items: list[str]) -> str:
    return "\n".join(f"- {item}" for item in items)


def write(path: str, content: str) -> None:
    file_path = ROOT / path
    file_path.parent.mkdir(parents=True, exist_ok=True)
    file_path.write_text(content.strip() + "\n", encoding="utf-8")


FEATURES = [
    {
        "feature_id": "FEAT-PROD",
        "parent": "-",
        "level": "一级功能",
        "name": "产品管理",
        "type": "一级功能",
        "terminal": "平台电脑端",
        "role": "商品运营",
        "priority": "0",
        "scope": "V1",
        "status": "当前范围",
        "carrier": "PGROUP-PROD",
        "source": "当前功能清单",
        "note": "产品主档、导入与归集主模块。",
    },
    {
        "feature_id": "FEAT-PROD-LIST",
        "parent": "FEAT-PROD",
        "level": "二级节点",
        "name": "产品列表",
        "type": "页面",
        "terminal": "平台电脑端",
        "role": "商品运营",
        "priority": "0",
        "scope": "V1-必做",
        "status": "当前范围",
        "carrier": "PGROUP-PROD",
        "source": "当前功能清单",
        "note": "产品管理主入口。",
    },
    {
        "feature_id": "FEAT-PROD-DETAIL",
        "parent": "FEAT-PROD",
        "level": "二级节点",
        "name": "产品详情",
        "type": "页面",
        "terminal": "平台电脑端",
        "role": "商品运营",
        "priority": "0",
        "scope": "V1-必做",
        "status": "当前范围",
        "carrier": "PGROUP-PROD",
        "source": "当前功能清单",
        "note": "维护图书产品主档与默认内容。",
    },
    {
        "feature_id": "FEAT-PROD-IMPORT",
        "parent": "FEAT-PROD",
        "level": "二级节点",
        "name": "产品导入",
        "type": "页面",
        "terminal": "平台电脑端",
        "role": "商品运营",
        "priority": "0",
        "scope": "V1-必做",
        "status": "当前范围",
        "carrier": "PGROUP-PROD",
        "source": "当前功能清单",
        "note": "模板下载、导入校验与导入执行入口。",
    },
    {
        "feature_id": "FEAT-PROD-IMPORT-LOG",
        "parent": "FEAT-PROD",
        "level": "二级节点",
        "name": "导入记录",
        "type": "页面",
        "terminal": "平台电脑端",
        "role": "商品运营",
        "priority": "0",
        "scope": "V1-必做",
        "status": "当前范围",
        "carrier": "PGROUP-PROD",
        "source": "当前功能清单",
        "note": "导入结果回溯、失败行查看与关联处理结果查看。",
    },
    {
        "feature_id": "FEAT-PROD-MERCHANT-LINK",
        "parent": "FEAT-PROD",
        "level": "二级节点",
        "name": "商家编码关联",
        "type": "规则能力",
        "terminal": "平台电脑端",
        "role": "商品运营",
        "priority": "0",
        "scope": "V1-必做",
        "status": "当前范围",
        "carrier": "MECH-IMPORT-STD",
        "source": "当前功能清单",
        "note": "通过商家编码建立产品与渠道商品统一归集关系。",
    },
    {
        "feature_id": "FEAT-PROD-CREATE",
        "parent": "FEAT-PROD",
        "level": "二级节点",
        "name": "新增产品",
        "type": "功能动作",
        "terminal": "平台电脑端",
        "role": "商品运营",
        "priority": "1",
        "scope": "V1-增强",
        "status": "增强预留",
        "carrier": "PGROUP-PROD",
        "source": "当前功能清单",
        "note": "少量手工补录产品主档。",
    },
    {
        "feature_id": "FEAT-ASSET",
        "parent": "-",
        "level": "一级功能",
        "name": "素材管理",
        "type": "一级功能",
        "terminal": "平台电脑端",
        "role": "商品运营、渠道运营",
        "priority": "1",
        "scope": "V1",
        "status": "增强预留",
        "carrier": "PGROUP-ASSET",
        "source": "当前功能清单",
        "note": "统一查看导入后的主图、详情图与 SKU 图。",
    },
    {
        "feature_id": "FEAT-ASSET-LIST",
        "parent": "FEAT-ASSET",
        "level": "二级节点",
        "name": "素材列表",
        "type": "页面",
        "terminal": "平台电脑端",
        "role": "商品运营、渠道运营",
        "priority": "1",
        "scope": "V1-增强",
        "status": "增强预留",
        "carrier": "PGROUP-ASSET",
        "source": "当前功能清单",
        "note": "素材资产总览。",
    },
    {
        "feature_id": "FEAT-ASSET-DETAIL",
        "parent": "FEAT-ASSET",
        "level": "二级节点",
        "name": "素材详情",
        "type": "页面",
        "terminal": "平台电脑端",
        "role": "商品运营、渠道运营",
        "priority": "1",
        "scope": "V1-增强",
        "status": "增强预留",
        "carrier": "PGROUP-ASSET",
        "source": "当前功能清单",
        "note": "素材预览、引用关系与替换说明。",
    },
    {
        "feature_id": "FEAT-ITEM",
        "parent": "-",
        "level": "一级功能",
        "name": "商品管理",
        "type": "一级功能",
        "terminal": "平台电脑端",
        "role": "渠道运营",
        "priority": "0",
        "scope": "V1",
        "status": "当前范围",
        "carrier": "PGROUP-ITEM",
        "source": "当前功能清单",
        "note": "统一维护多渠道多店铺商品差异信息。",
    },
    {
        "feature_id": "FEAT-ITEM-LIST",
        "parent": "FEAT-ITEM",
        "level": "二级节点",
        "name": "渠道商品列表",
        "type": "页面",
        "terminal": "平台电脑端",
        "role": "渠道运营",
        "priority": "0",
        "scope": "V1-必做",
        "status": "当前范围",
        "carrier": "PGROUP-ITEM",
        "source": "当前功能清单",
        "note": "统一查看多渠道多店铺商品售卖信息。",
    },
    {
        "feature_id": "FEAT-ITEM-DETAIL",
        "parent": "FEAT-ITEM",
        "level": "二级节点",
        "name": "渠道商品详情",
        "type": "页面",
        "terminal": "平台电脑端",
        "role": "渠道运营",
        "priority": "0",
        "scope": "V1-必做",
        "status": "当前范围",
        "carrier": "PGROUP-ITEM",
        "source": "当前功能清单",
        "note": "轻量维护标题、价格、属性、履约和上架信息，并展示详情页关联摘要。",
    },
    {
        "feature_id": "FEAT-ITEM-DETAIL-PAGE-LIST",
        "parent": "FEAT-ITEM",
        "level": "二级节点",
        "name": "渠道商品详情页列表",
        "type": "页面",
        "terminal": "平台电脑端",
        "role": "渠道运营",
        "priority": "0",
        "scope": "V1-必做",
        "status": "当前范围",
        "carrier": "PGROUP-ITEM",
        "source": "当前功能清单",
        "note": "统一查看和管理全部渠道商品详情页数据；单个渠道商品最多 3 个详情页，支持内容编辑与素材复用。",
    },
    {
        "feature_id": "FEAT-ITEM-CATEGORY-RULE",
        "parent": "FEAT-ITEM",
        "level": "二级节点",
        "name": "店铺级类目动态适配",
        "type": "规则能力",
        "terminal": "平台电脑端",
        "role": "渠道运营、系统管理员",
        "priority": "0",
        "scope": "V1-必做",
        "status": "当前范围",
        "carrier": "MECH-ITEM-MAINTAIN",
        "source": "当前功能清单",
        "note": "根据渠道、店铺和类目动态返回类目属性与可维护字段。",
    },
    {
        "feature_id": "FEAT-ITEM-BATCH-EDIT",
        "parent": "FEAT-ITEM",
        "level": "二级节点",
        "name": "批量修改",
        "type": "功能动作",
        "terminal": "平台电脑端",
        "role": "渠道运营",
        "priority": "1",
        "scope": "V1-增强",
        "status": "增强预留",
        "carrier": "PGROUP-ITEM",
        "source": "当前功能清单",
        "note": "支持批量修改标题、价格、批量上下架和库存。",
    },
    {
        "feature_id": "FEAT-INV",
        "parent": "-",
        "level": "一级功能",
        "name": "库存管理",
        "type": "一级功能",
        "terminal": "平台电脑端",
        "role": "库存运营",
        "priority": "0",
        "scope": "V1",
        "status": "当前范围",
        "carrier": "PGROUP-INV",
        "source": "当前功能清单",
        "note": "统一维护同一产品在各渠道商品和店铺下的库存。",
    },
    {
        "feature_id": "FEAT-INV-LIST",
        "parent": "FEAT-INV",
        "level": "二级节点",
        "name": "库存列表",
        "type": "页面",
        "terminal": "平台电脑端",
        "role": "库存运营",
        "priority": "0",
        "scope": "V1-必做",
        "status": "当前范围",
        "carrier": "PGROUP-INV",
        "source": "当前功能清单",
        "note": "库存总览、库存调整和同步操作主入口。",
    },
    {
        "feature_id": "FEAT-INV-DETAIL",
        "parent": "FEAT-INV",
        "level": "二级节点",
        "name": "库存详情",
        "type": "页面",
        "terminal": "平台电脑端",
        "role": "库存运营",
        "priority": "1",
        "scope": "V1-增强",
        "status": "增强预留",
        "carrier": "PGROUP-INV",
        "source": "当前功能清单",
        "note": "查看单条库存记录的完整明细。",
    },
    {
        "feature_id": "FEAT-INV-LOG",
        "parent": "FEAT-INV",
        "level": "二级节点",
        "name": "库存调整记录",
        "type": "页面",
        "terminal": "平台电脑端",
        "role": "库存运营",
        "priority": "1",
        "scope": "V1-增强",
        "status": "增强预留",
        "carrier": "PGROUP-INV",
        "source": "当前功能清单",
        "note": "查看库存台账、调整前后变化与原因。",
    },
    {
        "feature_id": "FEAT-CONF",
        "parent": "-",
        "level": "一级功能",
        "name": "配置管理",
        "type": "一级功能",
        "terminal": "平台电脑端",
        "role": "系统管理员",
        "priority": "0",
        "scope": "V1",
        "status": "当前范围",
        "carrier": "PGROUP-CONF",
        "source": "当前功能清单",
        "note": "店铺级规则配置主模块。",
    },
    {
        "feature_id": "FEAT-CONF-LIST",
        "parent": "FEAT-CONF",
        "level": "二级节点",
        "name": "配置列表",
        "type": "页面",
        "terminal": "平台电脑端",
        "role": "系统管理员",
        "priority": "0",
        "scope": "V1-必做",
        "status": "当前范围",
        "carrier": "PGROUP-CONF",
        "source": "当前功能清单",
        "note": "按渠道与店铺维护规则配置主入口。",
    },
    {
        "feature_id": "FEAT-CONF-SHOP-DETAIL",
        "parent": "FEAT-CONF",
        "level": "二级节点",
        "name": "店铺配置详情",
        "type": "页面",
        "terminal": "平台电脑端",
        "role": "系统管理员",
        "priority": "0",
        "scope": "V1-必做",
        "status": "当前范围",
        "carrier": "PGROUP-CONF",
        "source": "当前功能清单",
        "note": "维护店铺级类目动态适配、运费模板、上下架默认状态与发货时效。",
    },
]


PAGES = [
    {
        "page_id": "PG-PROD-LIST",
        "parent_page_id": "-",
        "page_group_id": "PGROUP-PROD",
        "route_key": "product.list",
        "menu_key": "menu.product",
        "page_name": "产品列表",
        "menu_name": "产品管理",
        "terminal": "平台电脑端",
        "feature": "FEAT-PROD-LIST",
        "page_type": "列表页",
        "level": "一级页面",
        "entry": "左侧菜单直达",
        "exit": "产品详情、新增产品",
        "precondition": "产品查看权限",
        "scope": "V1-必做",
        "status": "当前范围",
        "note": "产品主档列表。",
    },
    {
        "page_id": "PG-PROD-DETAIL",
        "parent_page_id": "PG-PROD-LIST",
        "page_group_id": "PGROUP-PROD",
        "route_key": "product.detail",
        "menu_key": "-",
        "page_name": "产品详情",
        "menu_name": "-",
        "terminal": "平台电脑端",
        "feature": "FEAT-PROD-DETAIL",
        "page_type": "详情页",
        "level": "二级页面",
        "entry": "产品列表内容进入",
        "exit": "产品列表、渠道商品详情、库存列表",
        "precondition": "产品已存在",
        "scope": "V1-必做",
        "status": "当前范围",
        "note": "图书产品主档维护页。",
    },
    {
        "page_id": "PG-PROD-IMPORT",
        "parent_page_id": "-",
        "page_group_id": "PGROUP-PROD",
        "route_key": "product.import",
        "menu_key": "menu.product.import",
        "page_name": "产品导入",
        "menu_name": "产品导入",
        "terminal": "平台电脑端",
        "feature": "FEAT-PROD-IMPORT",
        "page_type": "工作页",
        "level": "一级页面",
        "entry": "二级菜单直达",
        "exit": "导入记录、产品列表",
        "precondition": "导入执行权限",
        "scope": "V1-必做",
        "status": "当前范围",
        "note": "模板下载、导入校验与执行页面。",
    },
    {
        "page_id": "PG-PROD-IMPORT-LOG",
        "parent_page_id": "PG-PROD-IMPORT",
        "page_group_id": "PGROUP-PROD",
        "route_key": "product.import_log",
        "menu_key": "-",
        "page_name": "导入记录",
        "menu_name": "-",
        "terminal": "平台电脑端",
        "feature": "FEAT-PROD-IMPORT-LOG",
        "page_type": "记录页",
        "level": "二级页面",
        "entry": "导入页进入",
        "exit": "产品导入、产品列表、产品详情",
        "precondition": "存在导入任务",
        "scope": "V1-必做",
        "status": "当前范围",
        "note": "导入批次、失败明细与关联结果查看页。",
    },
    {
        "page_id": "PG-ASSET-LIST",
        "parent_page_id": "-",
        "page_group_id": "PGROUP-ASSET",
        "route_key": "asset.list",
        "menu_key": "menu.asset",
        "page_name": "素材列表",
        "menu_name": "素材管理",
        "terminal": "平台电脑端",
        "feature": "FEAT-ASSET-LIST",
        "page_type": "列表页",
        "level": "一级页面",
        "entry": "菜单直达",
        "exit": "素材详情",
        "precondition": "素材查看权限",
        "scope": "V1-增强",
        "status": "增强预留",
        "note": "增强页。",
    },
    {
        "page_id": "PG-ASSET-DETAIL",
        "parent_page_id": "PG-ASSET-LIST",
        "page_group_id": "PGROUP-ASSET",
        "route_key": "asset.detail",
        "menu_key": "-",
        "page_name": "素材详情",
        "menu_name": "-",
        "terminal": "平台电脑端",
        "feature": "FEAT-ASSET-DETAIL",
        "page_type": "详情页",
        "level": "二级页面",
        "entry": "列表内容进入",
        "exit": "素材列表、产品详情、渠道商品详情",
        "precondition": "素材已存在",
        "scope": "V1-增强",
        "status": "增强预留",
        "note": "增强页。",
    },
    {
        "page_id": "PG-ITEM-LIST",
        "parent_page_id": "-",
        "page_group_id": "PGROUP-ITEM",
        "route_key": "item.list",
        "menu_key": "menu.channel_item",
        "page_name": "渠道商品列表",
        "menu_name": "商品管理",
        "terminal": "平台电脑端",
        "feature": "FEAT-ITEM-LIST",
        "page_type": "列表页",
        "level": "一级页面",
        "entry": "菜单直达",
        "exit": "渠道商品详情、渠道商品详情页列表",
        "precondition": "商品查看权限",
        "scope": "V1-必做",
        "status": "当前范围",
        "note": "多渠道商品总览。",
    },
    {
        "page_id": "PG-ITEM-DETAIL-PAGE-LIST",
        "parent_page_id": "PG-ITEM-LIST",
        "page_group_id": "PGROUP-ITEM",
        "route_key": "item.detail_page_list",
        "menu_key": "menu.channel_item.detail_page_list",
        "page_name": "渠道商品详情页列表",
        "menu_name": "渠道商品详情页列表",
        "terminal": "平台电脑端",
        "feature": "FEAT-ITEM-DETAIL-PAGE-LIST",
        "page_type": "列表页",
        "level": "二级页面",
        "entry": "二级菜单直达",
        "exit": "渠道商品详情、素材列表",
        "precondition": "商品查看权限",
        "scope": "V1-必做",
        "status": "当前范围",
        "note": "全量商品详情页内容管理入口。",
    },
    {
        "page_id": "PG-ITEM-DETAIL",
        "parent_page_id": "PG-ITEM-LIST",
        "page_group_id": "PGROUP-ITEM",
        "route_key": "item.detail",
        "menu_key": "-",
        "page_name": "渠道商品详情",
        "menu_name": "-",
        "terminal": "平台电脑端",
        "feature": "FEAT-ITEM-DETAIL",
        "page_type": "详情页",
        "level": "二级页面",
        "entry": "列表内容进入",
        "exit": "渠道商品列表、渠道商品详情页列表、库存列表、店铺配置详情",
        "precondition": "渠道商品已存在",
        "scope": "V1-必做",
        "status": "当前范围",
        "note": "轻量维护单商品售卖字段。",
    },
    {
        "page_id": "PG-INV-LIST",
        "parent_page_id": "-",
        "page_group_id": "PGROUP-INV",
        "route_key": "inventory.list",
        "menu_key": "menu.inventory",
        "page_name": "库存列表",
        "menu_name": "库存管理",
        "terminal": "平台电脑端",
        "feature": "FEAT-INV-LIST",
        "page_type": "列表页",
        "level": "一级页面",
        "entry": "菜单直达",
        "exit": "库存详情",
        "precondition": "库存查看权限",
        "scope": "V1-必做",
        "status": "当前范围",
        "note": "库存总览与调整入口。",
    },
    {
        "page_id": "PG-INV-DETAIL",
        "parent_page_id": "PG-INV-LIST",
        "page_group_id": "PGROUP-INV",
        "route_key": "inventory.detail",
        "menu_key": "-",
        "page_name": "库存详情",
        "menu_name": "-",
        "terminal": "平台电脑端",
        "feature": "FEAT-INV-DETAIL",
        "page_type": "详情页",
        "level": "二级页面",
        "entry": "列表内容进入",
        "exit": "库存列表",
        "precondition": "库存记录已存在",
        "scope": "V1-增强",
        "status": "增强预留",
        "note": "增强页。",
    },
    {
        "page_id": "PG-INV-LOG",
        "parent_page_id": "PG-INV-LIST",
        "page_group_id": "PGROUP-INV",
        "route_key": "inventory.adjust_log",
        "menu_key": "menu.inventory.adjust_log",
        "page_name": "库存调整记录",
        "menu_name": "库存调整记录",
        "terminal": "平台电脑端",
        "feature": "FEAT-INV-LOG",
        "page_type": "记录页",
        "level": "二级页面",
        "entry": "二级菜单直达",
        "exit": "库存列表、库存详情",
        "precondition": "库存查看权限",
        "scope": "V1-增强",
        "status": "增强预留",
        "note": "增强页。",
    },
    {
        "page_id": "PG-CONF-LIST",
        "parent_page_id": "-",
        "page_group_id": "PGROUP-CONF",
        "route_key": "config.list",
        "menu_key": "menu.config",
        "page_name": "配置列表",
        "menu_name": "配置管理",
        "terminal": "平台电脑端",
        "feature": "FEAT-CONF-LIST",
        "page_type": "列表页",
        "level": "一级页面",
        "entry": "菜单直达",
        "exit": "店铺配置详情",
        "precondition": "配置查看权限",
        "scope": "V1-必做",
        "status": "当前范围",
        "note": "店铺级规则配置入口。",
    },
    {
        "page_id": "PG-CONF-DETAIL",
        "parent_page_id": "PG-CONF-LIST",
        "page_group_id": "PGROUP-CONF",
        "route_key": "config.shop_detail",
        "menu_key": "-",
        "page_name": "店铺配置详情",
        "menu_name": "-",
        "terminal": "平台电脑端",
        "feature": "FEAT-CONF-SHOP-DETAIL",
        "page_type": "详情页",
        "level": "二级页面",
        "entry": "列表内容进入",
        "exit": "配置列表、渠道商品详情",
        "precondition": "配置已存在或以复制模式进入",
        "scope": "V1-必做",
        "status": "当前范围",
        "note": "店铺级规则维护页。",
    },
]


PAGE_GROUPS = [
    {
        "group_id": "PGROUP-PROD",
        "name": "产品管理",
        "main_role": "商品运营",
        "pages": ["PG-PROD-LIST", "PG-PROD-DETAIL", "PG-PROD-IMPORT", "PG-PROD-IMPORT-LOG"],
        "actions": ["新增产品"],
        "rules": ["商家编码关联"],
        "mechanisms": ["MECH-IMPORT-STD", "MECH-AUTH-AUDIT"],
        "status": "当前范围",
        "path": "docs/03-页面设计层/平台电脑端/01-产品管理-页面组.md",
    },
    {
        "group_id": "PGROUP-ASSET",
        "name": "素材管理",
        "main_role": "商品运营、渠道运营",
        "pages": ["PG-ASSET-LIST", "PG-ASSET-DETAIL"],
        "actions": [],
        "rules": [],
        "mechanisms": ["MECH-IMPORT-STD", "MECH-AUTH-AUDIT"],
        "status": "增强预留",
        "path": "docs/03-页面设计层/平台电脑端/02-素材管理-页面组.md",
    },
    {
        "group_id": "PGROUP-ITEM",
        "name": "商品管理",
        "main_role": "渠道运营",
        "pages": ["PG-ITEM-LIST", "PG-ITEM-DETAIL-PAGE-LIST", "PG-ITEM-DETAIL"],
        "actions": ["批量修改"],
        "rules": ["店铺级类目动态适配"],
        "mechanisms": ["MECH-ITEM-MAINTAIN", "MECH-AUTH-AUDIT"],
        "status": "当前范围",
        "path": "docs/03-页面设计层/平台电脑端/03-商品管理-页面组.md",
    },
    {
        "group_id": "PGROUP-INV",
        "name": "库存管理",
        "main_role": "库存运营",
        "pages": ["PG-INV-LIST", "PG-INV-DETAIL", "PG-INV-LOG"],
        "actions": ["库存调整", "库存同步"],
        "rules": [],
        "mechanisms": ["MECH-INV-SYNC", "MECH-AUTH-AUDIT"],
        "status": "当前范围",
        "path": "docs/03-页面设计层/平台电脑端/04-库存管理-页面组.md",
    },
    {
        "group_id": "PGROUP-CONF",
        "name": "配置管理",
        "main_role": "系统管理员",
        "pages": ["PG-CONF-LIST", "PG-CONF-DETAIL"],
        "actions": [],
        "rules": ["店铺级类目动态适配配置"],
        "mechanisms": ["MECH-ITEM-MAINTAIN", "MECH-AUTH-AUDIT"],
        "status": "当前范围",
        "path": "docs/03-页面设计层/平台电脑端/05-配置管理-页面组.md",
    },
]


MECHANISMS = [
    {
        "id": "MECH-IMPORT-STD",
        "name": "标准化导入机制",
        "path": "docs/02-专题机制层/01-标准化导入机制.md",
        "goal": "通过统一模板下载、导入校验、商家编码关联和落库流程，把多渠道多店铺商品信息标准化导入中台。",
        "triggers": ["商品运营进入产品导入页下载模板", "上传导入文件并执行校验", "确认导入落库"],
        "steps": [
            "选择渠道后下载对应模板；如已选择店铺，则模板附带店铺级类目与属性字段口径。",
            "上传导入包，系统解析产品、商品、SKU、素材和库存相关数据。",
            "按渠道、店铺、类目规则校验必填项、类目属性、销售属性、运费模板、上下架状态和发货时效。",
            "按商家编码建立产品与渠道商品的归集关系，对无法命中的记录输出异常。",
            "确认导入后写入产品主档、渠道商品、素材引用、库存初始值和导入日志。",
        ],
        "pages": ["PG-PROD-IMPORT", "PG-PROD-IMPORT-LOG", "PG-PROD-DETAIL"],
        "objects": ["OBJ-PRODUCT", "OBJ-CHANNEL-ITEM", "OBJ-IMPORT-JOB", "OBJ-ASSET", "OBJ-INVENTORY"],
        "apis": ["API-IMPORT-TEMPLATE-PROFILE-GET", "API-IMPORT-TEMPLATE-DOWNLOAD-GET", "API-IMPORT-UPLOAD-POST", "API-IMPORT-VALIDATE-POST", "API-IMPORT-EXECUTE-POST", "API-IMPORT-LIST-GET"],
        "exceptions": [
            "模板字段缺失或列名不匹配时，任务停留在校验失败。",
            "商家编码无法命中现有产品或商品关系时，导入记录页展示未关联结果并允许人工修正后重新执行。",
            "店铺级类目规则版本过期时，不允许继续导入，必须先刷新模板。",
        ],
    },
    {
        "id": "MECH-ITEM-MAINTAIN",
        "name": "商品维护与批量修改机制",
        "path": "docs/02-专题机制层/02-商品维护与类目联动机制.md",
        "goal": "围绕渠道商品详情、渠道商品详情页列表和批量修改入口，维护多渠道多店铺商品的售卖差异信息、详情页内容与素材复用关系，不承接外部平台发品流程。",
        "triggers": ["渠道运营进入渠道商品详情页", "渠道运营进入渠道商品详情页列表页", "渠道运营进入批量修改入口", "系统管理员维护店铺规则配置"],
        "steps": [
            "渠道商品详情页根据渠道、店铺和当前类目加载可维护字段范围。",
            "渠道运营在渠道商品详情页修改标题、价格、类目属性、销售属性、运费模板、上下架状态和发货时效。",
            "同一产品在多个渠道、店铺售卖会形成多个渠道商品；渠道商品详情页列表按渠道商品维度展示全部详情页记录，并支持按产品聚合筛选。",
            "同一渠道商品最多允许 3 个详情页，且当前使用记录同时最多一条。",
            "渠道运营可在渠道商品详情页列表编辑详情页内容，并把素材列表中的已有图片复用到多个商品详情页。",
            "上传新详情页时，系统创建详情页记录并把详情素材沉淀到素材列表。",
            "批量修改入口支持按筛选结果对标题、价格、批量上下架和库存执行批量动作。",
            "系统把修改结果回写到渠道商品、详情页记录，并保留操作人与时间。",
        ],
        "pages": ["PG-ITEM-LIST", "PG-ITEM-DETAIL-PAGE-LIST", "PG-ITEM-DETAIL", "PG-CONF-DETAIL"],
        "objects": ["OBJ-CHANNEL-ITEM", "OBJ-ITEM-DETAIL-PAGE", "OBJ-SHOP-CONFIG", "OBJ-CATEGORY-PROFILE", "OBJ-ASSET"],
        "apis": ["API-ITEM-LIST-GET", "API-ITEM-DETAIL-PAGE-LIST-GET", "API-ITEM-DETAIL-PAGE-DETAIL-GET", "API-ITEM-DETAIL-PAGE-UPLOAD-POST", "API-ITEM-DETAIL-PAGE-PUT", "API-ITEM-DETAIL-PAGE-ASSET-LINK-POST", "API-ITEM-DETAIL-GET", "API-ITEM-DETAIL-PUT", "API-ITEM-CATEGORY-PROFILE-GET", "API-ITEM-BATCH-PREVIEW-POST", "API-ITEM-BATCH-EXECUTE-POST", "API-CONF-DETAIL-PUT"],
        "exceptions": [
            "切换店铺后类目规则不兼容时，强制用户重新选择类目并清空失效属性。",
            "商品详情页上传解析失败时，不允许创建详情页记录或写入脏素材。",
            "同一渠道商品详情页数量达到 3 条后，不允许继续新建、上传或复制详情页。",
            "批量修改命中商品超过系统上限时，要求先缩小筛选范围再执行。",
            "渠道商品被外部系统锁定时，页面仅允许查看，不允许编辑或批量修改。",
        ],
    },
    {
        "id": "MECH-INV-SYNC",
        "name": "库存同步与分配机制",
        "path": "docs/02-专题机制层/03-库存同步与分配机制.md",
        "goal": "统一维护渠道商品库存，支持人工调整、同步外部渠道结果和查看库存变化记录。",
        "triggers": ["库存运营在库存列表发起调整", "库存运营触发同步", "渠道商品详情查看关联库存"],
        "steps": [
            "库存列表按产品、渠道、店铺、SKU 聚合展示总库存、可用库存、锁定库存和可售库存。",
            "人工调整时记录调整量、原因、操作人和时间，并更新库存快照。",
            "触发同步后写入同步任务状态，等待外部渠道结果回写。",
            "增强阶段开放库存详情与库存调整记录页查看完整台账。",
        ],
        "pages": ["PG-INV-LIST", "PG-INV-DETAIL", "PG-INV-LOG", "PG-ITEM-DETAIL"],
        "objects": ["OBJ-INVENTORY", "OBJ-INVENTORY-LOG", "OBJ-CHANNEL-ITEM-SKU"],
        "apis": ["API-INV-LIST-GET", "API-INV-ADJUST-POST", "API-INV-SYNC-POST", "API-INV-DETAIL-GET", "API-INV-ADJUST-LOG-GET"],
        "exceptions": [
            "库存同步失败时保留失败原因，列表中突出展示。",
            "调整后可售库存小于零时，不允许保存。",
            "同一库存记录存在未完成同步任务时，禁止重复发起同步。",
        ],
    },
    {
        "id": "MECH-AUTH-AUDIT",
        "name": "权限与审计机制",
        "path": "docs/02-专题机制层/04-权限与审计机制.md",
        "goal": "控制不同角色的查看与操作边界，并保证导入、编辑、批量修改、库存调整等关键动作可追溯。",
        "triggers": ["用户访问任意菜单", "执行导入、编辑、库存调整、配置保存", "查看审计字段或失败日志"],
        "steps": [
            "路由与页面根据权限决定是否可见、可访问和是否可编辑。",
            "提交动作时校验操作权限并写审计日志。",
            "关键对象记录最后修改人、修改时间、来源页面和动作类型。",
        ],
        "pages": ["PG-PROD-IMPORT", "PG-ITEM-DETAIL", "PG-INV-LIST", "PG-CONF-DETAIL"],
        "objects": ["OBJ-AUDIT-LOG", "OBJ-IMPORT-JOB", "OBJ-CHANNEL-ITEM", "OBJ-INVENTORY", "OBJ-SHOP-CONFIG"],
        "apis": ["API-AUTH-ME-GET", "API-AUDIT-LIST-GET"],
        "exceptions": [
            "无权限用户直接访问详情路由时返回无权限页。",
            "已提交但审计写入失败时，动作结果应回滚或转为失败状态。",
        ],
    },
]


DOC_MANIFEST: list[dict[str, str]] = []


def register_doc(path: str, artifact_type: str, status: str, version: str = DOC_VERSION) -> None:
    DOC_MANIFEST.append(
        {
            "artifact_id": path.replace("/", "::"),
            "artifact_name": Path(path).name,
            "file_path": path,
            "artifact_type": artifact_type,
            "current_version": version,
            "doc_status": status,
            "baseline_version": BASELINE_VERSION,
            "supersedes": "-",
            "archive_path": "-",
            "owner": OWNER,
        }
    )


def page_by_id(page_id: str) -> dict[str, str]:
    return next(page for page in PAGES if page["page_id"] == page_id)


def feature_by_id(feature_id: str) -> dict[str, str]:
    return next(feature for feature in FEATURES if feature["feature_id"] == feature_id)


def feature_table() -> str:
    rows = [
        [
            item["feature_id"],
            item["parent"],
            item["level"],
            item["name"],
            item["type"],
            item["terminal"],
            item["role"],
            item["priority"],
            item["scope"],
            item["status"],
            item["carrier"],
            item["source"],
            item["note"],
        ]
        for item in FEATURES
    ]
    return md_table(
        [
            "feature_id",
            "parent_feature_id",
            "功能层级",
            "功能名称",
            "节点类型",
            "所属端",
            "所属角色",
            "优先级",
            "版本范围",
            "当前状态",
            "承接页面组/机制",
            "来源",
            "备注",
        ],
        rows,
    )


def page_tree_table() -> str:
    rows = [
        [
            item["page_id"],
            item["parent_page_id"],
            item["page_group_id"],
            item["route_key"],
            item["menu_key"],
            item["page_name"],
            item["menu_name"],
            item["terminal"],
            item["feature"],
            item["page_type"],
            item["level"],
            item["entry"],
            item["exit"],
            item["precondition"],
            item["scope"],
            item["status"],
            item["note"],
        ]
        for item in PAGES
    ]
    return md_table(
        [
            "page_id",
            "parent_page_id",
            "page_group_id",
            "route_key",
            "menu_key",
            "页面名称",
            "菜单名称",
            "所属端",
            "所属功能",
            "页面类型",
            "页面层级",
            "入口说明",
            "默认出口",
            "前置条件",
            "版本范围",
            "当前状态",
            "备注",
        ],
        rows,
    )


def feature_status_summary() -> str:
    rows = [
        ["当前范围", "一期必须覆盖，研发、测试和交付都要纳入。"],
        ["增强预留", "一期建议保留完整文档，但不作为 MVP 阻断条件。"],
        ["候选归档", "保留历史路径或占位文档，不纳入当前基线和前端任务。"],
    ]
    return md_table(["状态", "说明"], rows)


def doc_overview_table() -> str:
    rows = [
        ["docs/baselines/", "当前功能清单、页面树和功能承载图权威源。"],
        ["docs/00-总览层/", "产品目标、角色、流程、问题清单、追踪矩阵和交付治理。"],
        ["docs/01-端产品层/", "按端汇总当前有效功能与页面映射关系。"],
        ["docs/02-专题机制层/", "导入、商品维护、库存同步、权限审计等跨页机制。"],
        ["docs/03-页面设计层/", "页面组与单页说明，直接服务前端实现。"],
        ["docs/04-数据与接口层/", "对象、字段、状态、接口、事件与表结构建议。"],
        ["docs/05-验收与测试层/", "MVP 验收标准、测试场景和回归范围。"],
    ]
    return md_table(["目录", "定位"], rows)


def build_baseline_docs() -> None:
    feature_doc = f"""
# {PROJECT}-功能清单表

{meta_table([
    ("文档名称", "00-feature-list.md"),
    ("doc_id", "BL-FEATURE-LIST"),
    ("doc_slug", "feature-list"),
    ("文档层级", "baseline"),
    ("文档对象", "功能基线"),
    ("适用端", "平台电脑端"),
    ("所属角色", "产品经理、产品 Agent、研发、测试"),
    ("baseline_version", BASELINE_VERSION),
    ("doc_version", DOC_VERSION),
    ("doc_status", "current-effective"),
    ("上游来源", "图书多渠道商品中台-功能清单（Excel版）.xlsx"),
    ("更新时间", TODAY),
])}

## 1. 基线定位

- 本表是当前项目范围的权威源，任何范围变化必须先回写本表。
- 页面、功能动作和规则能力分开建模，但统一挂到稳定追踪链。
- 当前项目的核心目标是把多渠道、多店铺商品信息通过模板导入中台，并在统一后台维护产品、渠道商品和库存。

## 2. 状态口径

{feature_status_summary()}

## 3. 功能清单

{feature_table()}
"""
    write("docs/baselines/00-feature-list.md", feature_doc)
    register_doc("docs/baselines/00-feature-list.md", "baseline-feature-list", "current-effective")

    page_tree_doc = f"""
# {PROJECT}-页面树表

{meta_table([
    ("文档名称", "01-page-tree.md"),
    ("doc_id", "BL-PAGE-TREE"),
    ("doc_slug", "page-tree"),
    ("文档层级", "baseline"),
    ("文档对象", "页面基线"),
    ("适用端", "平台电脑端"),
    ("所属角色", "产品经理、产品 Agent、研发、测试"),
    ("baseline_version", BASELINE_VERSION),
    ("doc_version", DOC_VERSION),
    ("doc_status", "current-effective"),
    ("上游来源", "图书多渠道商品中台-功能清单（Excel版）.xlsx"),
    ("更新时间", TODAY),
])}

## 1. 基线定位

- 页面树只承接页面节点，不承接功能动作和规则能力。
- 中文菜单名称允许调整，但 `page_id`、`page_group_id`、`route_key` 和 `menu_key` 必须稳定。
- 二级菜单只用于承接高频独立入口；详情页默认从列表或工作页进入。

## 2. 页面树

{page_tree_table()}
"""
    write("docs/baselines/01-page-tree.md", page_tree_doc)
    register_doc("docs/baselines/01-page-tree.md", "baseline-page-tree", "current-effective")

    carrying_doc = f"""
# {PROJECT}-功能承载图

{meta_table([
    ("文档名称", "02-functional-carrying-diagram.md"),
    ("doc_id", "BL-FUNC-CARRY"),
    ("doc_slug", "functional-carrying-diagram"),
    ("文档层级", "baseline"),
    ("文档对象", "功能承载图"),
    ("适用端", "平台电脑端"),
    ("所属角色", "产品经理、产品 Agent、研发、测试"),
    ("baseline_version", BASELINE_VERSION),
    ("doc_version", DOC_VERSION),
    ("doc_status", "current-effective"),
    ("更新时间", TODAY),
])}

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
  PG_PROD --> ACT_PROD_CREATE["新增产品（增强）"]
  PG_PROD --> RULE_MERCHANT["商家编码关联"]
  RULE_MERCHANT --> MECH_IMPORT["标准化导入机制"]

  FEAT_ASSET["素材管理（增强）"] --> PG_ASSET["素材管理页面组"]
  PG_ASSET --> PAGE_ASSET_LIST["素材列表"]
  PG_ASSET --> PAGE_ASSET_DETAIL["素材详情"]

  FEAT_ITEM["商品管理"] --> PG_ITEM["商品管理页面组"]
  PG_ITEM --> PAGE_ITEM_LIST["渠道商品列表"]
  PG_ITEM --> PAGE_ITEM_DETAIL["渠道商品详情"]
  PG_ITEM --> ACT_BATCH["批量修改（增强）"]
  PG_ITEM --> RULE_CATEGORY["店铺级类目动态适配"]
  RULE_CATEGORY --> MECH_ITEM["商品维护与批量修改机制"]

  FEAT_INV["库存管理"] --> PG_INV["库存管理页面组"]
  PG_INV --> PAGE_INV_LIST["库存列表"]
  PG_INV --> PAGE_INV_DETAIL["库存详情（增强）"]
  PG_INV --> PAGE_INV_LOG["库存调整记录（增强）"]
  PG_INV --> MECH_INV["库存同步与分配机制"]

  FEAT_CONF["配置管理"] --> PG_CONF["配置管理页面组"]
  PG_CONF --> PAGE_CONF_LIST["配置列表"]
  PG_CONF --> PAGE_CONF_DETAIL["店铺配置详情"]
  PAGE_CONF_DETAIL --> RULE_CATEGORY

  FEAT_PROD --> MECH_AUTH["权限与审计机制"]
  FEAT_ITEM --> MECH_AUTH
  FEAT_INV --> MECH_AUTH
  FEAT_CONF --> MECH_AUTH
```

## 3. 当前说明

- 当前不再承接独立发品工作台、发布记录页、系统配置详情、渠道配置详情、导入模板配置页和操作日志页。
- 以上历史路径保留文档占位，但不进入当前基线和前端任务。
"""
    write("docs/baselines/02-functional-carrying-diagram.md", carrying_doc)
    register_doc("docs/baselines/02-functional-carrying-diagram.md", "baseline-carrying-diagram", "current-effective")

    change_log = f"""
# {PROJECT}-基线变更记录

{meta_table([
    ("文档名称", "99-baseline-change-log.md"),
    ("doc_id", "BL-CHANGE-LOG"),
    ("doc_slug", "baseline-change-log"),
    ("文档层级", "baseline"),
    ("文档对象", "基线变更记录"),
    ("baseline_version", BASELINE_VERSION),
    ("doc_version", DOC_VERSION),
    ("doc_status", "current-effective"),
    ("更新时间", TODAY),
])}

## 1. 变更记录

{md_table(
    ["变更时间", "变更人", "变更项", "影响范围", "变更说明"],
    [
        [TODAY, OWNER, "功能清单重定版", "全部文档层", "按当前 Excel 功能清单统一当前范围、增强预留和候选归档口径。"],
        [TODAY, OWNER, "页面树回写", "03 页面设计层、01 端产品层", "只保留当前功能清单中的页面节点；批量修改、商家编码关联等非页面能力改由页面组和机制文档承接。"],
        [TODAY, OWNER, "文档全量重写", "docs/ 全目录", "按照 product_agent_standards 统一元信息、追踪关系和版本口径。"],
    ],
)}
"""
    write("docs/baselines/99-baseline-change-log.md", change_log)
    register_doc("docs/baselines/99-baseline-change-log.md", "baseline-change-log", "current-effective")


def build_overview_docs() -> None:
    overview_index = f"""
# {PROJECT}-文档总览与目录定义

{meta_table([
    ("文档名称", "00-文档总览与目录定义.md"),
    ("doc_id", "DOC-OVERVIEW-INDEX"),
    ("doc_slug", "project-doc-index"),
    ("文档层级", "00-总览层"),
    ("文档对象", "项目文档目录"),
    ("适用端", "平台电脑端"),
    ("所属角色", "产品经理、产品 Agent、研发、测试"),
    ("上游文档", "../../product_agent_standards/01_unified_standard.md；../../product_agent_standards/04_layered_docs_spec.md；../baselines/00-feature-list.md"),
    ("下游文档", "../01-端产品层/；../02-专题机制层/；../03-页面设计层/；../04-数据与接口层/；../05-验收与测试层/"),
    ("baseline_version", BASELINE_VERSION),
    ("doc_version", DOC_VERSION),
    ("doc_status", "current-effective"),
    ("更新时间", TODAY),
])}

## 1. 文档目标

- 给当前项目提供统一文档入口，明确每层文档解决什么问题。
- 指定当前权威基线来源和下游引用关系，避免并行稿件互相覆盖。
- 明确哪些文件是当前范围，哪些文件只是增强预留或候选归档。

## 2. 当前目录结构

{doc_overview_table()}

## 3. 当前基线引用

{md_table(
    ["基线", "文件", "当前版本", "作用"],
    [
        ["功能清单表", "../baselines/00-feature-list.md", BASELINE_VERSION, "权威范围源"],
        ["页面树表", "../baselines/01-page-tree.md", BASELINE_VERSION, "页面组织与入口关系"],
        ["功能承载图", "../baselines/02-functional-carrying-diagram.md", BASELINE_VERSION, "页面组、动作、规则与机制承接关系"],
    ],
)}

## 4. 当前文档状态约定

{feature_status_summary()}

## 5. 使用要求

{bullet([
    "任何范围、页面、机制变化先回写 baselines，再回写 00-05 层文档。",
    "页面相关实现与前端任务必须优先引用 03-页面设计层和 04-数据与接口层，不直接凭功能表开工。",
    "候选归档文件只保留路径和历史上下文，不作为当前交付输入。",
])}
"""
    write("docs/00-总览层/00-文档总览与目录定义.md", overview_index)
    register_doc("docs/00-总览层/00-文档总览与目录定义.md", "overview", "current-effective")

    product_summary = f"""
# {PROJECT}-产品总述

{meta_table([
    ("文档名称", "01-产品总述.md"),
    ("doc_id", "DOC-PRODUCT-SUMMARY"),
    ("doc_slug", "product-summary"),
    ("文档层级", "00-总览层"),
    ("文档对象", "产品总述"),
    ("适用端", "平台电脑端"),
    ("所属角色", "商品运营、渠道运营、库存运营、系统管理员"),
    ("所属功能", "产品管理、商品管理、库存管理、配置管理、素材管理"),
    ("关联机制", "标准化导入、商品维护与批量修改、库存同步与分配、权限与审计"),
    ("上游文档", "../baselines/00-feature-list.md；../baselines/01-page-tree.md"),
    ("下游文档", "02-业务模型与角色协同.md；04-整体业务流程图.md；../01-端产品层/05-平台电脑端产品文档.md"),
    ("baseline_version", BASELINE_VERSION),
    ("doc_version", DOC_VERSION),
    ("doc_status", "current-effective"),
    ("更新时间", TODAY),
])}

## 1. 产品目标

当前一期的目标，是让运营团队通过统一后台：

{bullet([
    "通过标准模板把多渠道、多店铺商品信息导入中台。",
    "以产品为中心归集同一产品在多个渠道、多个店铺下的不同售卖信息。",
    "在统一页面维护渠道商品差异信息、库存和店铺级规则。",
])}

## 2. 当前业务边界

### 2.1 当前范围

{bullet([
    "产品列表、产品详情、产品导入、导入记录。",
    "商家编码关联规则。",
    "渠道商品列表、渠道商品详情页列表、渠道商品详情、店铺级类目动态适配规则。",
    "库存列表，以及库存详情、库存调整记录的增强底稿。",
    "配置列表、店铺配置详情。",
    "素材列表、素材详情、新增产品、批量修改的增强底稿。",
])}

### 2.2 当前不做

{bullet([
    "不做独立发品工作台和发布记录页。",
    "不做系统级配置详情、渠道配置详情、导入模板独立配置页和独立操作日志页。",
    "不做多仓调拨、组合包库存、复杂价格策略和审批流。",
])}

## 3. 当前支持渠道与对象

{md_table(
    ["维度", "当前口径"],
    [
        ["渠道", "淘宝、拼多多、抖音、快手"],
        ["主对象", "产品、产品 SKU、渠道商品、渠道商品 SKU、商品详情页、库存、店铺配置、导入任务、素材"],
        ["关联主键", "商家编码；SKU 维度建议补充商家 SKU 编码；商品详情页按渠道商品关联"],
        ["商品范围", "同一产品在不同渠道/店铺下的售卖信息差异维护，以及同一商品下多详情页记录管理"],
    ],
)}

## 4. 一期价值

{bullet([
    "减少多渠道商品资料重复维护。",
    "把商品详情页从单商品编辑页中拆开，统一管理详情页版本和上传动作。",
    "把店铺级类目规则、运费模板和发货时效前置沉淀，避免导入后返工。",
    "让库存和渠道商品围绕同一产品主档查看和维护。",
])}
"""
    write("docs/00-总览层/01-产品总述.md", product_summary)
    register_doc("docs/00-总览层/01-产品总述.md", "overview", "current-effective")

    business_model = f"""
# {PROJECT}-业务模型与角色协同

{meta_table([
    ("文档名称", "02-业务模型与角色协同.md"),
    ("doc_id", "DOC-BIZ-ROLE-MODEL"),
    ("doc_slug", "business-role-model"),
    ("文档层级", "00-总览层"),
    ("文档对象", "角色与业务模型"),
    ("适用端", "平台电脑端"),
    ("所属角色", "商品运营、渠道运营、库存运营、系统管理员"),
    ("上游文档", "01-产品总述.md；../baselines/00-feature-list.md"),
    ("下游文档", "../02-专题机制层/；../03-页面设计层/"),
    ("baseline_version", BASELINE_VERSION),
    ("doc_version", DOC_VERSION),
    ("doc_status", "current-effective"),
    ("更新时间", TODAY),
])}

## 1. 角色分工

{md_table(
    ["角色", "核心职责", "主要页面", "关键结果"],
    [
        ["商品运营", "维护产品主档、下载模板、执行导入、处理商家编码关联", "产品列表、产品详情、产品导入、导入记录", "产品主档和导入任务闭环"],
        ["渠道运营", "维护渠道商品售卖差异、处理类目与属性联动、管理商品详情页内容与版本、执行批量修改", "渠道商品列表、渠道商品详情页列表、渠道商品详情、批量修改", "渠道商品售卖信息、详情页内容和素材引用关系正确"],
        ["库存运营", "维护库存总览、人工调整库存、发起同步、查看调整记录", "库存列表、库存详情、库存调整记录", "库存正确且同步状态可追踪"],
        ["系统管理员", "维护店铺级规则配置与生效状态", "配置列表、店铺配置详情", "店铺级类目、运费模板和时效配置稳定生效"],
    ],
)}

## 2. 核心对象协同

{md_table(
    ["对象", "由谁主导", "谁消费", "协同说明"],
    [
        ["产品", "商品运营", "渠道运营、库存运营", "产品是多渠道商品和库存归集中心。"],
        ["渠道商品", "渠道运营", "库存运营", "同一产品在不同渠道/店铺下可有多条渠道商品记录。"],
        ["商品详情页", "渠道运营", "渠道运营、商品运营", "同一渠道商品下允许存在多条详情页记录，上传后的素材沉淀到素材列表。"],
        ["店铺配置", "系统管理员", "商品运营、渠道运营", "配置决定导入模板字段口径和详情页动态字段范围。"],
        ["库存", "库存运营", "渠道运营", "库存围绕渠道商品 SKU 维护，但在中台统一展示。"],
        ["导入任务", "商品运营", "系统管理员、渠道运营", "导入任务沉淀导入结果、错误原因和关联处理结论。"],
    ],
)}

## 3. 协同链路

1. 系统管理员先维护店铺配置。
2. 商品运营按渠道下载模板，执行导入并确认商家编码关联。
3. 渠道运营在渠道商品详情页维护售卖字段，在渠道商品详情页列表维护详情页内容、版本切换和素材复用。
4. 库存运营在库存列表统一处理库存与同步结果。
"""
    write("docs/00-总览层/02-业务模型与角色协同.md", business_model)
    register_doc("docs/00-总览层/02-业务模型与角色协同.md", "overview", "current-effective")

    status_doc = f"""
# {PROJECT}-状态流转机制说明

{meta_table([
    ("文档名称", "03-状态流转机制说明.md"),
    ("doc_id", "DOC-STATE-FLOW"),
    ("doc_slug", "state-flow"),
    ("文档层级", "00-总览层"),
    ("文档对象", "状态流转说明"),
    ("适用端", "平台电脑端"),
    ("关联对象", "导入任务、产品、渠道商品、库存、店铺配置"),
    ("上游文档", "../04-数据与接口层/04-状态与枚举字典.md；../02-专题机制层/"),
    ("下游文档", "../03-页面设计层/；../05-验收与测试层/04-权限与状态流转测试场景.md"),
    ("baseline_version", BASELINE_VERSION),
    ("doc_version", DOC_VERSION),
    ("doc_status", "current-effective"),
    ("更新时间", TODAY),
])}

## 1. 导入任务状态

{md_table(
    ["状态", "含义", "进入条件", "可操作"],
    [
        ["draft", "已创建未校验", "上传文件后", "下载模板、重新上传、执行校验"],
        ["validating", "校验中", "点击执行校验后", "仅可查看进度"],
        ["validate_failed", "校验失败", "模板或数据校验未通过", "下载错误报告、重新上传"],
        ["ready_to_execute", "校验通过待确认", "校验全部通过或仅存在可忽略告警", "确认导入"],
        ["executing", "导入执行中", "点击确认导入后", "查看导入进度"],
        ["completed", "导入完成", "导入成功落库", "查看导入记录、跳转产品详情"],
        ["execute_failed", "导入失败", "落库或关联处理失败", "查看失败原因、重新发起导入"],
    ],
)}

## 2. 渠道商品状态

{md_table(
    ["状态", "含义", "说明"],
    [
        ["draft", "草稿", "导入后尚未补齐全部售卖信息。"],
        ["ready", "可售资料齐备", "标题、价格、类目、素材等满足售卖条件。"],
        ["on_shelf", "已上架", "渠道侧处于上架状态。"],
        ["off_shelf", "已下架", "渠道侧处于下架状态。"],
        ["locked", "锁定", "受外部平台或内部规则限制，仅可查看。"],
    ],
)}

## 3. 库存同步状态

{md_table(
    ["状态", "含义", "页面表现"],
    [
        ["idle", "未同步", "列表显示默认状态。"],
        ["pending", "待同步", "触发同步后进入待处理。"],
        ["syncing", "同步中", "按钮禁用并展示进度文案。"],
        ["success", "同步成功", "展示最近同步成功时间。"],
        ["failed", "同步失败", "高亮失败原因并允许重新同步。"],
    ],
)}

## 4. 店铺配置状态

{md_table(
    ["状态", "含义", "说明"],
    [
        ["draft", "草稿", "已保存但未生效。"],
        ["active", "生效中", "当前店铺正在使用的配置版本。"],
        ["inactive", "停用", "历史配置，仅供查看和复制。"],
    ],
)}
"""
    write("docs/00-总览层/03-状态流转机制说明.md", status_doc)
    register_doc("docs/00-总览层/03-状态流转机制说明.md", "overview", "current-effective")

    flow_doc = f"""
# {PROJECT}-整体业务流程图

{meta_table([
    ("文档名称", "04-整体业务流程图.md"),
    ("doc_id", "DOC-BIZ-FLOW"),
    ("doc_slug", "business-flow"),
    ("文档层级", "00-总览层"),
    ("文档对象", "业务流程图"),
    ("适用端", "平台电脑端"),
    ("上游文档", "01-产品总述.md；02-业务模型与角色协同.md；../baselines/02-functional-carrying-diagram.md"),
    ("下游文档", "../02-专题机制层/；../03-页面设计层/；../05-验收与测试层/02-主流程测试场景.md"),
    ("baseline_version", BASELINE_VERSION),
    ("doc_version", DOC_VERSION),
    ("doc_status", "current-effective"),
    ("更新时间", TODAY),
])}

## 1. 导入主流程

```mermaid
flowchart LR
  A["系统管理员维护店铺配置"] --> B["商品运营进入产品导入页"]
  B --> C["选择渠道并下载模板"]
  C --> D["整理导入数据并上传文件"]
  D --> E["执行校验"]
  E --> F{"校验是否通过"}
  F -- "否" --> G["查看错误报告并修正重传"]
  G --> D
  F -- "是" --> H["系统按商家编码建立关联"]
  H --> I["确认导入"]
  I --> J["写入产品/商品/库存/素材"]
  J --> K["导入记录页查看结果"]
```

## 2. 商品维护主流程

```mermaid
flowchart LR
  A["渠道运营进入渠道商品列表"] --> B["筛选渠道、店铺、状态"]
  B --> C["打开渠道商品详情"]
  C --> D["系统按店铺/类目加载动态字段"]
  D --> E["维护标题、价格、属性、图片、发货信息"]
  E --> F["保存渠道商品"]
  B --> G["进入批量修改"]
  G --> H["选择修改类型和命中范围"]
  H --> I["批量执行标题/价格/批量上下架/库存修改"]
```

## 3. 库存维护主流程

```mermaid
flowchart LR
  A["库存运营进入库存列表"] --> B["按产品/渠道/店铺/SKU 筛选"]
  B --> C["查看库存快照"]
  C --> D["人工调整库存"]
  C --> E["触发库存同步"]
  D --> F["写入库存调整记录"]
  E --> G["等待渠道同步结果"]
  G --> H["回写同步状态"]
```
"""
    write("docs/00-总览层/04-整体业务流程图.md", flow_doc)
    register_doc("docs/00-总览层/04-整体业务流程图.md", "overview", "current-effective")

    norm_doc = f"""
# {PROJECT}-文档规范与 Agent 要求

{meta_table([
    ("文档名称", "05-文档规范与Agent要求.md"),
    ("doc_id", "DOC-DOC-RULES"),
    ("doc_slug", "document-rules"),
    ("文档层级", "00-总览层"),
    ("文档对象", "项目文档规范"),
    ("上游文档", "../../product_agent_standards/01_unified_standard.md；../../product_agent_standards/09_page_scaffold_spec.md；../../product_agent_standards/16_navigation_naming_resilience_spec.md"),
    ("下游文档", "全部项目文档"),
    ("baseline_version", BASELINE_VERSION),
    ("doc_version", DOC_VERSION),
    ("doc_status", "current-effective"),
    ("更新时间", TODAY),
])}

## 1. 当前项目文档约束

{bullet([
    "先改 baselines，再改 00-05 层文档。",
    "所有页面、功能动作、规则能力都必须有稳定 ID 或明确承接位置。",
    "页面设计层文档直接服务前端实现，必须写清入口、区块、动作、状态和依赖接口。",
    "历史路径保留文件必须显式标成候选归档，不能伪装成当前范围。",
])}

## 2. 命名与追踪要求

{bullet([
    "中文标题可调整，但 doc_id、feature_id、page_id、route_key、menu_key 原则上保持稳定。",
    "批量修改、商家编码关联、店铺级类目动态适配这类非页面能力，必须在页面组和机制文档中明确承接。",
    "前端路由、后端接口、测试用例应优先引用稳定键，不直接依赖中文标题。",
])}

## 3. 当前项目特殊约束

{bullet([
    "导入模板下载不是独立页面，承接在产品导入页。",
    "店铺级类目动态适配同时影响导入模板字段和渠道商品详情页动态字段。",
    "当前项目不做独立发品流，因此不得再引用发布工作台、发布记录页作为有效页面。",
])}
"""
    write("docs/00-总览层/05-文档规范与Agent要求.md", norm_doc)
    register_doc("docs/00-总览层/05-文档规范与Agent要求.md", "overview", "current-effective")

    issue_doc = f"""
# {PROJECT}-问题清单与确认记录

{meta_table([
    ("文档名称", "06-问题清单与确认记录.md"),
    ("doc_id", "DOC-ISSUE-LOG"),
    ("doc_slug", "issue-log"),
    ("文档层级", "00-总览层"),
    ("文档对象", "问题清单与确认记录"),
    ("上游文档", "../../product_agent_standards/10_issue_confirmation_spec.md；../baselines/00-feature-list.md"),
    ("下游文档", "../04-数据与接口层/；../05-验收与测试层/"),
    ("baseline_version", BASELINE_VERSION),
    ("doc_version", DOC_VERSION),
    ("doc_status", "current-effective"),
    ("更新时间", TODAY),
])}

## 1. 当前问题清单

{md_table(
    ["issue_id", "问题类型", "问题内容", "影响范围", "阻塞等级", "默认处理方式", "待确认角色", "待确认人", "当前状态", "备注"],
    [
        ["ISSUE-001", "对象字段", "商家编码是否同时要求覆盖 SKU 级别映射。", "导入机制、逻辑数据模型、字段字典", "L3-不阻塞当前推进", "当前按产品级商家编码为必填，SKU 级建议补充商家 SKU 编码但不阻塞一期。", "产品经理", "待定", "待确认", "如后续确认强制 SKU 级映射，需要回写模板字段和接口。"],
        ["ISSUE-002", "机制规则", "模板下载时是否必须先选择店铺，还是只选渠道即可。", "产品导入页、标准化导入机制、模板字段说明", "L3-不阻塞当前推进", "当前要求至少选择渠道；如已选店铺则带出更精确的类目字段模板。", "产品经理", "待定", "待确认", "当前前端默认支持渠道必选、店铺可选。"],
        ["ISSUE-003", "机制规则", "店铺配置变更后的生效时点是立即生效还是新导入任务生效。", "店铺配置详情、导入机制、测试场景", "L2-阻塞研发实施", "当前按新导入任务生效、已创建任务不回溯处理。", "产品经理/系统管理员", "待定", "待确认", "需要在研发前锁定。"],
        ["ISSUE-004", "范围问题", "库存是否需要多仓维度。", "库存管理、数据模型、接口清单", "L3-不阻塞当前推进", "一期按单库存池处理，不引入多仓模型。", "产品经理", "待定", "已默认推进", "作为后续扩展项。"],
    ],
)}

## 2. 当前确认记录

{md_table(
    ["issue_id", "确认方式", "确认结论", "确认人", "确认角色", "确认时间", "影响文档", "是否已回写", "关闭状态"],
    [
        ["ISSUE-004", "本轮范围确认", "一期不做多仓库存。", "当前会话默认结论", "产品经理", TODAY, "总览层、数据层、测试层", "是", "已关闭"],
    ],
)}
"""
    write("docs/00-总览层/06-问题清单与确认记录.md", issue_doc)
    register_doc("docs/00-总览层/06-问题清单与确认记录.md", "overview", "current-effective")

    trace_rows = [
        ["FEAT-PROD-LIST", "PGROUP-PROD", "PG-PROD-LIST", "menu.product", "product.list", "MECH-AUTH-AUDIT", "OBJ-PRODUCT", "API-PROD-LIST-GET", "TC-MAIN-001", "03-页面设计层/平台电脑端/产品管理/01-产品列表页.md", "当前范围", "产品主入口"],
        ["FEAT-PROD-IMPORT", "PGROUP-PROD", "PG-PROD-IMPORT", "menu.product.import", "product.import", "MECH-IMPORT-STD", "OBJ-IMPORT-JOB", "API-IMPORT-UPLOAD-POST", "TC-MAIN-002", "03-页面设计层/平台电脑端/产品管理/04-产品导入页.md", "当前范围", "模板下载和导入执行"],
        ["FEAT-PROD-IMPORT-LOG", "PGROUP-PROD", "PG-PROD-IMPORT-LOG", "-", "product.import_log", "MECH-IMPORT-STD", "OBJ-IMPORT-JOB", "API-IMPORT-LIST-GET", "TC-MAIN-003", "03-页面设计层/平台电脑端/产品管理/05-导入记录页.md", "当前范围", "导入结果回溯"],
        ["FEAT-PROD-MERCHANT-LINK", "PGROUP-PROD", "-", "-", "-", "MECH-IMPORT-STD", "OBJ-IMPORT-JOB-LINE", "API-MERCHANT-LINK-POST", "TC-EXC-002", "02-专题机制层/01-标准化导入机制.md", "当前范围", "规则能力"],
        ["FEAT-ITEM-LIST", "PGROUP-ITEM", "PG-ITEM-LIST", "menu.channel_item", "item.list", "MECH-AUTH-AUDIT", "OBJ-CHANNEL-ITEM", "API-ITEM-LIST-GET", "TC-MAIN-004", "03-页面设计层/平台电脑端/商品管理/01-渠道商品列表页.md", "当前范围", "商品总览"],
        ["FEAT-ITEM-DETAIL-PAGE-LIST", "PGROUP-ITEM", "PG-ITEM-DETAIL-PAGE-LIST", "menu.channel_item.detail_page_list", "item.detail_page_list", "MECH-ITEM-MAINTAIN", "OBJ-ITEM-DETAIL-PAGE", "API-ITEM-DETAIL-PAGE-PUT", "TC-MAIN-009", "03-页面设计层/平台电脑端/商品管理/05-渠道商品详情页列表.md", "当前范围", "商品详情页内容统一管理、版本切换与素材复用"],
        ["FEAT-ITEM-DETAIL", "PGROUP-ITEM", "PG-ITEM-DETAIL", "-", "item.detail", "MECH-ITEM-MAINTAIN", "OBJ-CHANNEL-ITEM", "API-ITEM-DETAIL-PUT", "TC-MAIN-005", "03-页面设计层/平台电脑端/商品管理/02-渠道商品详情页.md", "当前范围", "单商品售卖字段维护"],
        ["FEAT-ITEM-BATCH-EDIT", "PGROUP-ITEM", "-", "menu.channel_item.batch_edit", "item.batch_edit", "MECH-ITEM-MAINTAIN", "OBJ-CHANNEL-ITEM", "API-ITEM-BATCH-EXECUTE-POST", "TC-EXC-004", "03-页面设计层/平台电脑端/商品管理/03-批量修改工作台.md", "增强预留", "批量修改动作承接页"],
        ["FEAT-INV-LIST", "PGROUP-INV", "PG-INV-LIST", "menu.inventory", "inventory.list", "MECH-INV-SYNC", "OBJ-INVENTORY", "API-INV-LIST-GET", "TC-MAIN-006", "03-页面设计层/平台电脑端/库存管理/01-库存列表页.md", "当前范围", "库存主入口"],
        ["FEAT-INV-DETAIL", "PGROUP-INV", "PG-INV-DETAIL", "-", "inventory.detail", "MECH-INV-SYNC", "OBJ-INVENTORY", "API-INV-DETAIL-GET", "TC-REG-003", "03-页面设计层/平台电脑端/库存管理/02-库存详情页.md", "增强预留", "增强页"],
        ["FEAT-INV-LOG", "PGROUP-INV", "PG-INV-LOG", "menu.inventory.adjust_log", "inventory.adjust_log", "MECH-INV-SYNC", "OBJ-INVENTORY-LOG", "API-INV-ADJUST-LOG-GET", "TC-REG-004", "03-页面设计层/平台电脑端/库存管理/03-库存调整记录页.md", "增强预留", "增强页"],
        ["FEAT-CONF-LIST", "PGROUP-CONF", "PG-CONF-LIST", "menu.config", "config.list", "MECH-AUTH-AUDIT", "OBJ-SHOP-CONFIG", "API-CONF-LIST-GET", "TC-MAIN-007", "03-页面设计层/平台电脑端/配置管理/01-配置列表页.md", "当前范围", "配置主入口"],
        ["FEAT-CONF-SHOP-DETAIL", "PGROUP-CONF", "PG-CONF-DETAIL", "-", "config.shop_detail", "MECH-ITEM-MAINTAIN", "OBJ-SHOP-CONFIG", "API-CONF-DETAIL-PUT", "TC-MAIN-008", "03-页面设计层/平台电脑端/配置管理/04-店铺配置详情页.md", "当前范围", "店铺规则配置"],
    ]
    trace_doc = f"""
# {PROJECT}-需求追踪矩阵

{meta_table([
    ("文档名称", "08-需求追踪矩阵.md"),
    ("doc_id", "DOC-TRACE-MATRIX"),
    ("doc_slug", "trace-matrix"),
    ("文档层级", "00-总览层"),
    ("文档对象", "需求追踪矩阵"),
    ("上游文档", "../../product_agent_standards/12_id_traceability_spec.md；../baselines/00-feature-list.md；../baselines/01-page-tree.md"),
    ("下游文档", "../03-页面设计层/；../04-数据与接口层/；../05-验收与测试层/"),
    ("baseline_version", BASELINE_VERSION),
    ("doc_version", DOC_VERSION),
    ("doc_status", "current-effective"),
    ("更新时间", TODAY),
])}

## 1. 追踪矩阵

{md_table(
    ["feature_id", "page_group_id", "page_id", "menu_key", "route_key", "mechanism_id", "object_id", "api_id", "test_case_id", "doc_ref", "current_status", "notes"],
    trace_rows,
)}
"""
    write("docs/00-总览层/08-需求追踪矩阵.md", trace_doc)
    register_doc("docs/00-总览层/08-需求追踪矩阵.md", "overview", "current-effective")

    signoff_doc = f"""
# {PROJECT}-评审签收与交付门槛

{meta_table([
    ("文档名称", "09-评审签收与交付门槛.md"),
    ("doc_id", "DOC-REVIEW-SIGNOFF"),
    ("doc_slug", "review-signoff"),
    ("文档层级", "00-总览层"),
    ("文档对象", "评审与交付门槛"),
    ("上游文档", "../../product_agent_standards/13_review_signoff_spec.md；07-项目交付索引与当前有效版本清单.md"),
    ("下游文档", "当前项目交付包"),
    ("baseline_version", BASELINE_VERSION),
    ("doc_version", DOC_VERSION),
    ("doc_status", "draft-review-ready"),
    ("更新时间", TODAY),
])}

## 1. 当前评审入口门槛自检

{md_table(
    ["检查项", "结果", "说明"],
    [
        ["三份输入基线", "通过", "功能清单、页面树、功能承载图已统一到当前范围。"],
        ["00-05 层文档", "通过", "目录内文档已按当前范围重写。"],
        ["阻塞性问题", "部分通过", "ISSUE-003 需在研发前确认生效时点。"],
        ["追踪关系", "通过", "已建立 feature/page/api/test 主链路追踪。"],
        ["候选归档说明", "通过", "范围外页面已明确标注为候选归档。"],
    ],
)}

## 2. 评审意见记录模板

{md_table(
    ["review_comment_id", "来源文档", "问题级别", "问题描述", "责任人", "当前状态", "修订结论", "复核人", "关闭时间"],
    [["-", "-", "-", "待正式评审录入。", "-", "待评审", "-", "-", "-"]],
)}

## 3. 签收记录

{md_table(
    ["package_version", "评审范围", "签收人", "签收结论", "blocker_count", "exception_note", "signed_at"],
    [[DOC_VERSION, "当前项目 docs/ 与 baselines/", "-", "待签收", "1", "需确认店铺配置变更生效时点。", "-"]],
)}
"""
    write("docs/00-总览层/09-评审签收与交付门槛.md", signoff_doc)
    register_doc("docs/00-总览层/09-评审签收与交付门槛.md", "overview", "draft-review-ready")


def build_terminal_docs() -> None:
    terminal_intro = f"""
# {PROJECT}-端产品层说明与校验结论

{meta_table([
    ("文档名称", "00-端产品层说明与校验结论.md"),
    ("doc_id", "DOC-TERMINAL-CHECK"),
    ("doc_slug", "terminal-check"),
    ("文档层级", "01-端产品层"),
    ("文档对象", "端产品层说明"),
    ("适用端", "平台电脑端"),
    ("上游文档", "../baselines/00-feature-list.md；../baselines/01-page-tree.md"),
    ("下游文档", "05-平台电脑端产品文档.md；06-各端功能总清单.md"),
    ("baseline_version", BASELINE_VERSION),
    ("doc_version", DOC_VERSION),
    ("doc_status", "current-effective"),
    ("更新时间", TODAY),
])}

## 1. 当前端范围

- 当前项目只有一个当前有效端：平台电脑端。
- 所有当前范围页面、功能动作和规则能力都由平台电脑端承接。
- 不存在独立移动端、商家端或消费者端交付物。

## 2. 校验结论

{md_table(
    ["校验项", "结果", "说明"],
    [
        ["功能清单覆盖", "通过", "当前 feature 都能在端产品层找到归属。"],
        ["页面树覆盖", "通过", "当前 page_id 均有页面组或页面文档承接。"],
        ["范围外页面隔离", "通过", "历史发布页、系统配置页等已标为候选归档。"],
    ],
)}
"""
    write("docs/01-端产品层/00-端产品层说明与校验结论.md", terminal_intro)
    register_doc("docs/01-端产品层/00-端产品层说明与校验结论.md", "terminal", "current-effective")

    pc_doc = f"""
# {PROJECT}-平台电脑端产品文档

{meta_table([
    ("文档名称", "05-平台电脑端产品文档.md"),
    ("doc_id", "DOC-TERMINAL-PC"),
    ("doc_slug", "terminal-pc-product-doc"),
    ("文档层级", "01-端产品层"),
    ("文档对象", "端产品"),
    ("适用端", "平台电脑端"),
    ("所属角色", "商品运营、渠道运营、库存运营、系统管理员"),
    ("所属功能", "产品管理、素材管理、商品管理、库存管理、配置管理"),
    ("所属页面组", "PGROUP-PROD、PGROUP-ASSET、PGROUP-ITEM、PGROUP-INV、PGROUP-CONF"),
    ("关联机制", "MECH-IMPORT-STD、MECH-ITEM-MAINTAIN、MECH-INV-SYNC、MECH-AUTH-AUDIT"),
    ("上游文档", "../baselines/00-feature-list.md；../baselines/01-page-tree.md；../baselines/02-functional-carrying-diagram.md"),
    ("下游文档", "../02-专题机制层/；../03-页面设计层/；../04-数据与接口层/；../05-验收与测试层/"),
    ("baseline_version", BASELINE_VERSION),
    ("doc_version", DOC_VERSION),
    ("doc_status", "current-effective"),
    ("更新时间", TODAY),
])}

## 1. 端定位

平台电脑端是一体化中台的唯一当前交付端，用于承接产品导入、产品主档维护、渠道商品轻量维护、库存统一维护和店铺级规则配置。

## 2. 导航结构

{md_table(
    ["一级菜单", "当前子入口", "状态", "说明"],
    [
        ["产品管理", "产品列表、产品导入", "当前范围", "产品主档和导入入口。"],
        ["商品管理", "渠道商品列表、渠道商品详情页列表", "当前范围", "渠道商品维护入口，渠道商品详情页列表为当前范围二级菜单，并承接详情页内容编辑。"],
        ["库存管理", "库存列表", "当前范围", "库存总览入口；库存调整记录保留增强二级菜单。"],
        ["配置管理", "配置列表", "当前范围", "店铺级规则配置入口。"],
        ["素材管理", "素材列表", "增强预留", "素材资产统一查看。"],
    ],
)}

## 3. 平台端功能总表

{md_table(
    ["功能模块", "主页面组", "当前范围页面", "增强预留", "规则能力/动作"],
    [
        ["产品管理", "PGROUP-PROD", "产品列表、产品详情、产品导入、导入记录", "新增产品", "商家编码关联"],
        ["商品管理", "PGROUP-ITEM", "渠道商品列表、渠道商品详情页列表、渠道商品详情", "批量修改", "店铺级类目动态适配"],
        ["库存管理", "PGROUP-INV", "库存列表", "库存详情、库存调整记录", "库存调整、库存同步"],
        ["配置管理", "PGROUP-CONF", "配置列表、店铺配置详情", "-", "店铺级类目动态适配配置"],
        ["素材管理", "PGROUP-ASSET", "-", "素材列表、素材详情", "-"],
    ],
)}

## 4. 前端实现提醒

{bullet([
    "当前仓库的前端主承接目录是 frontend/apps/web-antd/src/views/product-platform/。",
    "路由统一挂在 frontend/apps/web-antd/src/router/routes/modules/product-platform.ts。",
    "当前范围外路由应移出默认导航或显式标成预留，不再按当前交付页面实现。",
])}
"""
    write("docs/01-端产品层/05-平台电脑端产品文档.md", pc_doc)
    register_doc("docs/01-端产品层/05-平台电脑端产品文档.md", "terminal", "current-effective")

    terminal_list = f"""
# {PROJECT}-各端功能总清单

{meta_table([
    ("文档名称", "06-各端功能总清单.md"),
    ("doc_id", "DOC-TERMINAL-FEATURE-LIST"),
    ("doc_slug", "all-terminal-feature-list"),
    ("文档层级", "01-端产品层"),
    ("文档对象", "端功能总清单"),
    ("baseline_version", BASELINE_VERSION),
    ("doc_version", DOC_VERSION),
    ("doc_status", "current-effective"),
    ("更新时间", TODAY),
])}

## 1. 当前端清单

{md_table(
    ["端", "当前状态", "承接功能", "备注"],
    [
        ["平台电脑端", "当前范围", "全部当前 feature", "唯一当前交付端。"],
        ["移动端", "未纳入", "-", "当前不做。"],
        ["商家端", "未纳入", "-", "当前不做。"],
        ["消费者端", "未纳入", "-", "当前不做。"],
    ],
)}
"""
    write("docs/01-端产品层/06-各端功能总清单.md", terminal_list)
    register_doc("docs/01-端产品层/06-各端功能总清单.md", "terminal", "current-effective")


def mechanism_doc(mech: dict[str, object], inherited_path_note: str | None = None) -> str:
    inherited = ""
    if inherited_path_note:
        inherited = f"\n## 0. 路径说明\n\n- {inherited_path_note}\n"
    return f"""
# {PROJECT}-{mech["name"]}

{meta_table([
    ("文档名称", Path(str(mech["path"])).name),
    ("doc_id", str(mech["id"])),
    ("doc_slug", str(mech["id"]).lower().replace("_", "-")),
    ("文档层级", "02-专题机制层"),
    ("文档对象", "专题机制"),
    ("所属功能", "跨页面机制"),
    ("关联页面", "、".join(mech["pages"])),
    ("关联对象", "、".join(mech["objects"])),
    ("上游文档", "../baselines/02-functional-carrying-diagram.md；../00-总览层/04-整体业务流程图.md"),
    ("下游文档", "../03-页面设计层/；../04-数据与接口层/；../05-验收与测试层/"),
    ("baseline_version", BASELINE_VERSION),
    ("doc_version", DOC_VERSION),
    ("doc_status", "current-effective"),
    ("更新时间", TODAY),
])}
{inherited}
## 1. 机制目标

{mech["goal"]}

## 2. 触发条件

{bullet(list(mech["triggers"]))}

## 3. 流转规则

{bullet([f"{idx}. {step}" for idx, step in enumerate(mech["steps"], start=1)])}

## 4. 页面承接点

{md_table(
    ["page_id", "页面名称", "承接方式"],
    [[page_id, page_by_id(page_id)["page_name"], "页面触发或结果承接"] for page_id in mech["pages"]],
)}

## 5. 对象与接口承接

{md_table(
    ["对象 / 接口", "作用"],
    [[obj, "机制涉及的核心对象"] for obj in mech["objects"]] + [[api, "机制依赖接口"] for api in mech["apis"]],
)}

## 6. 异常与回退

{bullet(list(mech["exceptions"]))}
"""


def build_mechanism_docs() -> None:
    for mech in MECHANISMS:
        doc = mechanism_doc(mech, None)
        write(str(mech["path"]), doc)
        register_doc(str(mech["path"]), "mechanism", "current-effective")


def page_group_doc(group: dict[str, object]) -> str:
    pages = [page_by_id(page_id) for page_id in group["pages"]]
    page_rows = [
        [page["page_id"], page["page_name"], page["page_type"], page["scope"], page["status"], page["entry"], page["exit"]]
        for page in pages
    ]
    return f"""
# {PROJECT}-{group["name"]}页面组

{meta_table([
    ("文档名称", Path(str(group["path"])).name),
    ("doc_id", f"DOC-{group['group_id']}"),
    ("doc_slug", str(group["group_id"]).lower()),
    ("文档层级", "03-页面设计层"),
    ("文档对象", "页面组"),
    ("适用端", "平台电脑端"),
    ("所属角色", str(group["main_role"])),
    ("所属功能", str(group["name"])),
    ("所属页面组", str(group["group_id"])),
    ("关联机制", "、".join(group["mechanisms"])),
    ("上游文档", "../../baselines/00-feature-list.md；../../baselines/01-page-tree.md；../../baselines/02-functional-carrying-diagram.md"),
    ("下游文档", "组内页面文档"),
    ("baseline_version", BASELINE_VERSION),
    ("doc_version", DOC_VERSION),
    ("doc_status", "current-effective" if group["status"] != "增强预留" else "enhancement-reserved"),
    ("更新时间", TODAY),
])}

## 1. 页面组目标

{group["name"]}页面组负责承接 {group["name"]} 相关能力，并把列表页、详情页、工作页、记录页以及功能动作、规则能力组织成稳定的前端实现边界。

## 2. 页面清单

{md_table(["page_id", "页面名称", "页面类型", "版本范围", "当前状态", "入口说明", "默认出口"], page_rows)}

## 3. 跨页动作与规则能力

{md_table(
    ["类型", "内容", "当前状态", "承接位置"],
    [["功能动作", action, "增强预留" if action in {"新增产品", "批量修改"} else "当前范围", str(group["group_id"])] for action in group["actions"]]
    + [["规则能力", rule, "当前范围", "专题机制 / 详情页联动"] for rule in group["rules"]],
)}

## 4. 页面间入口出口关系

{bullet([f"{row[1]}：入口为{row[5]}；默认出口为{row[6]}。" for row in page_rows])}

## 5. 与机制的关系

{bullet([f"{mech} 在本页面组中提供关键规则支撑。" for mech in group["mechanisms"]])}

## 6. 前端实现说明

{bullet([
    "页面组文档优先指导路由层、列表与详情的边界划分。",
    "功能动作如果不是页面树节点，仍需在页面组中落到独立交互承接点。",
    "增强预留页面可以先保留路由占位或按钮入口，不作为一期阻断范围。",
])}
"""


def reserved_page_doc(title: str, file_name: str, doc_id: str, doc_slug: str, page_id: str, page_group_id: str, route_key: str, feature: str, level: str, status: str, note: str, upstream: str, extra: str = "") -> str:
    return f"""
# {PROJECT}-{title}

{meta_table([
    ("文档名称", file_name),
    ("doc_id", doc_id),
    ("doc_slug", doc_slug),
    ("page_id", page_id),
    ("page_group_id", page_group_id),
    ("route_key", route_key),
    ("文档层级", "03-页面设计层"),
    ("文档对象", "页面"),
    ("交付级别", level),
    ("所属功能", feature),
    ("上游文档", upstream),
    ("baseline_version", BASELINE_VERSION),
    ("doc_version", DOC_VERSION),
    ("doc_status", status),
    ("更新时间", TODAY),
])}

## 1. 当前状态

- {note}
- 当前文件保留是为了保持路径、追踪关系和未来恢复时的上下文。

## 2. 若未来恢复，需要先完成

1. 把对应功能和页面节点重新纳入当前 baselines。
2. 补齐对象、接口和测试用例。
3. 在前端路由中恢复入口并重新纳入交付索引。

{extra}
"""


def active_page_doc(
    title: str,
    file_name: str,
    doc_id: str,
    doc_slug: str,
    page_id: str,
    page_group_id: str,
    route_key: str,
    menu_key: str,
    menu_name: str,
    feature_ids: str,
    mechanisms: str,
    upstream: str,
    downstream: str,
    level: str,
    status: str,
    goal: str,
    entry_exit: list[list[str]],
    layout: list[list[str]],
    actions: list[list[str]],
    fields: list[list[str]],
    states: list[str],
    deps: list[list[str]],
    boundaries: list[str],
) -> str:
    return f"""
# {PROJECT}-{title}

{meta_table([
    ("文档名称", file_name),
    ("doc_id", doc_id),
    ("doc_slug", doc_slug),
    ("page_id", page_id),
    ("page_group_id", page_group_id),
    ("route_key", route_key),
    ("menu_key", menu_key),
    ("当前菜单名称", menu_name),
    ("文档层级", "03-页面设计层"),
    ("文档对象", "页面"),
    ("交付级别", level),
    ("所属功能", feature_ids),
    ("关联机制", mechanisms),
    ("上游文档", upstream),
    ("下游文档", downstream),
    ("baseline_version", BASELINE_VERSION),
    ("doc_version", DOC_VERSION),
    ("doc_status", status),
    ("更新时间", TODAY),
])}

## 1. 页面目标

{goal}

## 2. 入口、出口与前置条件

{md_table(["项目", "内容"], entry_exit)}

## 3. 页面结构

{md_table(["区块", "说明", "当前重点"], layout)}

## 4. 主次操作

{md_table(["动作", "触发条件", "结果"], actions)}

## 5. 字段与校验

{md_table(["字段", "编码 / 类型", "规则"], fields)}

## 6. 状态与反馈

{bullet(states)}

## 7. 依赖对象与接口

{md_table(["类型", "标识", "作用"], deps)}

## 8. 范围边界

{bullet(boundaries)}
"""


def build_page_design_docs() -> None:
    page_intro = f"""
# {PROJECT}-页面设计说明

{meta_table([
    ("文档名称", "00-页面设计说明.md"),
    ("doc_id", "DOC-PAGE-DESIGN-INTRO"),
    ("doc_slug", "page-design-intro"),
    ("文档层级", "03-页面设计层"),
    ("文档对象", "页面设计说明"),
    ("适用端", "平台电脑端"),
    ("上游文档", "../baselines/01-page-tree.md；../baselines/02-functional-carrying-diagram.md；../01-端产品层/05-平台电脑端产品文档.md"),
    ("下游文档", "各页面组与单页面文档"),
    ("baseline_version", BASELINE_VERSION),
    ("doc_version", DOC_VERSION),
    ("doc_status", "current-effective"),
    ("更新时间", TODAY),
])}

## 1. 当前页面设计层目标

- 把页面树中的页面节点和功能清单中的动作、规则能力落到可实现的前端页面与交互结构。
- 给前端明确每个页面的入口、布局、动作、字段和依赖接口。
- 明确哪些页面是当前范围，哪些仅为增强底稿或候选归档。

## 2. 当前页面组

{md_table(
    ["页面组", "当前状态", "主要页面", "非页面能力"],
    [
        ["产品管理", "当前范围", "产品列表、产品详情、产品导入、导入记录", "新增产品、商家编码关联"],
        ["商品管理", "当前范围", "渠道商品列表、渠道商品详情页列表、渠道商品详情", "批量修改、店铺级类目动态适配"],
        ["库存管理", "当前范围", "库存列表", "库存调整、库存同步；库存详情和记录为增强底稿"],
        ["配置管理", "当前范围", "配置列表、店铺配置详情", "店铺级类目动态适配配置"],
        ["素材管理", "增强预留", "素材列表、素材详情", "-"],
    ],
)}

## 3. 页面设计共性要求

{bullet([
    "列表页必须明确筛选区、表格区、分页或统计区和主操作区。",
    "详情页必须明确保存动作、动态字段区、只读信息区和返回链路。",
    "工作页必须明确任务状态、结果反馈和错误处理方式。",
    "功能动作如果有独立工作台，也必须写清命中范围、预览和结果反馈。",
])}
"""
    write("docs/03-页面设计层/00-页面设计说明.md", page_intro)
    register_doc("docs/03-页面设计层/00-页面设计说明.md", "page-design", "current-effective")

    for group in PAGE_GROUPS:
        write(str(group["path"]), page_group_doc(group))
        register_doc(str(group["path"]), "page-group", "current-effective" if group["status"] == "当前范围" else "enhancement-reserved")

    # 产品管理
    write(
        "docs/03-页面设计层/平台电脑端/产品管理/01-产品列表页.md",
        active_page_doc(
            title="产品列表页",
            file_name="01-产品列表页.md",
            doc_id="PAGE-PROD-LIST",
            doc_slug="page-product-list",
            page_id="PG-PROD-LIST",
            page_group_id="PGROUP-PROD",
            route_key="product.list",
            menu_key="menu.product",
            menu_name="产品管理",
            feature_ids="FEAT-PROD-LIST",
            mechanisms="MECH-AUTH-AUDIT",
            upstream="../../../baselines/00-feature-list.md；../../../baselines/01-page-tree.md；../01-产品管理-页面组.md",
            downstream="02-新建产品页.md；03-产品详情页.md",
            level="V1-必做",
            status="current-effective",
            goal="查看和筛选产品主档信息，作为产品维护总入口。",
            entry_exit=[
                ["入口", "左侧菜单 `menu.product`"],
                ["出口", "产品详情、新增产品（增强）"],
                ["前置条件", "产品查看权限"],
            ],
            layout=[
                ["筛选区", "按书名/ISBN/商家编码/状态/来源渠道筛选产品", "当前重点"],
                ["统计区", "展示产品总数、待补充详情数、已关联商品数", "建议保留"],
                ["列表区", "展示产品基础信息、SKU 摘要、关联商品数、最近更新时间", "当前重点"],
                ["快捷操作区", "查看详情、进入新增产品", "当前重点"],
            ],
            actions=[
                ["搜索/重置", "输入筛选条件后", "刷新列表结果"],
                ["查看详情", "点击产品名称或详情按钮", "进入产品详情页"],
                ["新增产品", "点击新增按钮", "进入增强页或保留提示"],
            ],
            fields=[
                ["关键词", "keyword / 输入框", "支持书名、ISBN、商家编码模糊搜索"],
                ["产品状态", "product_status / 下拉", "默认全部"],
                ["来源渠道", "source_channel / 多选", "支持淘宝、拼多多、抖音、快手"],
                ["关联商品数", "item_count / 只读", "列表展示字段"],
            ],
            states=[
                "初始加载失败时展示重试提示。",
                "无数据时展示空态说明，并保留新增产品入口占位。",
                "进入详情页后，返回应保留筛选条件和滚动位置。",
            ],
            deps=[
                ["对象", "OBJ-PRODUCT", "产品主档对象"],
                ["接口", "API-PROD-LIST-GET", "获取产品列表"],
            ],
            boundaries=[
                "当前页不直接编辑产品字段，编辑发生在产品详情页。",
                "当前页不承接模板下载，模板下载发生在产品导入页。",
            ],
        ),
    )
    register_doc("docs/03-页面设计层/平台电脑端/产品管理/01-产品列表页.md", "page", "current-effective")

    write(
        "docs/03-页面设计层/平台电脑端/产品管理/02-新建产品页.md",
        active_page_doc(
            title="新增产品页",
            file_name="02-新建产品页.md",
            doc_id="PAGE-PROD-CREATE",
            doc_slug="page-product-create",
            page_id="ACTION-PROD-CREATE",
            page_group_id="PGROUP-PROD",
            route_key="product.create",
            menu_key="menu.product.create",
            menu_name="新增产品",
            feature_ids="FEAT-PROD-CREATE",
            mechanisms="MECH-AUTH-AUDIT",
            upstream="../../../baselines/00-feature-list.md；../01-产品管理-页面组.md",
            downstream="03-产品详情页.md",
            level="V1-增强",
            status="enhancement-reserved",
            goal="支持少量手工补录图书产品主档，补充模板导入之外的个别场景。",
            entry_exit=[
                ["入口", "产品列表主按钮"],
                ["出口", "保存后进入产品详情或返回产品列表"],
                ["前置条件", "产品编辑权限"],
            ],
            layout=[
                ["基础信息区", "图书名称、ISBN、作者、出版社等基础信息", "增强预留"],
                ["默认内容区", "默认主图、详情内容、默认卖点", "增强预留"],
                ["SKU 区", "初始 SKU 摘要和商家编码", "增强预留"],
            ],
            actions=[
                ["保存草稿", "填写最少字段后", "创建产品草稿"],
                ["保存并查看详情", "保存成功后", "进入产品详情"],
            ],
            fields=[
                ["图书名称", "product_name / 输入框", "必填"],
                ["ISBN", "isbn / 输入框", "建议唯一"],
                ["商家编码", "merchant_code / 输入框", "必填，用于归集"],
            ],
            states=[
                "当前为增强预留，不作为一期阻断项。",
                "若未纳入当前迭代，前端可仅保留入口占位或隐藏。",
            ],
            deps=[
                ["对象", "OBJ-PRODUCT", "产品对象"],
                ["接口", "API-PROD-CREATE-POST", "增强接口，手工创建产品"],
            ],
            boundaries=[
                "当前一期仍以模板导入为主，新增产品不是主路径。",
            ],
        ),
    )
    register_doc("docs/03-页面设计层/平台电脑端/产品管理/02-新建产品页.md", "page", "enhancement-reserved")

    write(
        "docs/03-页面设计层/平台电脑端/产品管理/03-产品详情页.md",
        active_page_doc(
            title="产品详情页",
            file_name="03-产品详情页.md",
            doc_id="PAGE-PROD-DETAIL",
            doc_slug="page-product-detail",
            page_id="PG-PROD-DETAIL",
            page_group_id="PGROUP-PROD",
            route_key="product.detail",
            menu_key="-",
            menu_name="无固定菜单",
            feature_ids="FEAT-PROD-DETAIL",
            mechanisms="MECH-AUTH-AUDIT",
            upstream="../../../baselines/00-feature-list.md；../../../baselines/01-page-tree.md；../01-产品管理-页面组.md",
            downstream="../商品管理/02-渠道商品详情页.md；../库存管理/01-库存列表页.md",
            level="V1-必做",
            status="current-effective",
            goal="维护图书产品主档、默认内容和 SKU 摘要，为多渠道商品共用信息提供统一来源。",
            entry_exit=[
                ["入口", "产品列表点击产品名称或详情按钮"],
                ["出口", "返回产品列表；跳转渠道商品详情；跳转库存列表"],
                ["前置条件", "产品已存在且具备查看权限"],
            ],
            layout=[
                ["头部摘要", "展示产品名称、ISBN、商家编码、关联商品数", "当前重点"],
                ["基础信息区", "图书名称、作者、出版社、版次、开本、装帧等", "当前重点"],
                ["默认内容区", "默认主图、详情图、内容摘要和卖点", "当前重点"],
                ["SKU 摘要区", "展示 SKU 数量、商家 SKU 编码、默认图片", "当前重点"],
                ["关联信息区", "展示关联渠道商品和库存概况", "建议保留"],
            ],
            actions=[
                ["保存产品", "编辑基础信息或默认内容后", "保存并刷新产品详情"],
                ["查看关联商品", "点击关联商品数量", "跳转商品详情或商品列表"],
                ["查看库存", "点击库存摘要", "跳转库存列表并带筛选条件"],
            ],
            fields=[
                ["图书名称", "product_name / 输入框", "必填"],
                ["ISBN", "isbn / 输入框", "建议唯一且可检索"],
                ["商家编码", "merchant_code / 输入框", "只允许管理员修改"],
                ["默认主图", "default_main_images / 图片列表", "至少 1 张，支持排序"],
                ["默认详情", "default_detail_content / 富文本或图片列表", "允许空草稿，正式售卖前建议补齐"],
            ],
            states=[
                "无编辑权限时所有字段只读。",
                "保存成功后保留当前位置并更新最后修改信息。",
                "关联商品为空时展示“尚未关联渠道商品”的提示。",
            ],
            deps=[
                ["对象", "OBJ-PRODUCT", "产品主档"],
                ["对象", "OBJ-PRODUCT-SKU", "产品 SKU 摘要"],
                ["接口", "API-PROD-DETAIL-GET", "读取产品详情"],
                ["接口", "API-PROD-DETAIL-PUT", "保存产品详情"],
            ],
            boundaries=[
                "当前页不直接维护渠道特有字段，例如运费模板和上架状态。",
                "库存不在当前页直接编辑，只展示摘要和跳转入口。",
            ],
        ),
    )
    register_doc("docs/03-页面设计层/平台电脑端/产品管理/03-产品详情页.md", "page", "current-effective")

    write(
        "docs/03-页面设计层/平台电脑端/产品管理/04-产品导入页.md",
        active_page_doc(
            title="产品导入页",
            file_name="04-产品导入页.md",
            doc_id="PAGE-PROD-IMPORT",
            doc_slug="page-product-import",
            page_id="PG-PROD-IMPORT",
            page_group_id="PGROUP-PROD",
            route_key="product.import",
            menu_key="menu.product.import",
            menu_name="产品导入",
            feature_ids="FEAT-PROD-IMPORT、FEAT-PROD-MERCHANT-LINK",
            mechanisms="MECH-IMPORT-STD、MECH-AUTH-AUDIT",
            upstream="../../../baselines/00-feature-list.md；../../../baselines/01-page-tree.md；../01-产品管理-页面组.md",
            downstream="05-导入记录页.md",
            level="V1-必做",
            status="current-effective",
            goal="通过选择渠道下载模板、上传导入包、执行校验并确认导入，把产品、渠道商品、库存和素材信息统一导入中台。",
            entry_exit=[
                ["入口", "二级菜单 `menu.product.import`"],
                ["出口", "导入记录、产品列表"],
                ["前置条件", "导入执行权限；存在生效中的店铺配置"],
            ],
            layout=[
                ["导入说明区", "说明模板适用范围、当前支持渠道与导入字段", "当前重点"],
                ["模板下载区", "先选择渠道；可选选择店铺后下载更精确模板", "当前重点"],
                ["文件上传区", "上传导入文件或素材包，创建导入任务", "当前重点"],
                ["校验结果区", "显示通过数、失败数、失败原因和待处理关联数", "当前重点"],
                ["确认导入区", "校验通过后确认执行导入", "当前重点"],
            ],
            actions=[
                ["下载模板", "选择渠道（可选店铺）后", "下载包含渠道、店铺、类目、商品 ID、类目属性、销售属性、运费模板、上下架状态、发货时效、SKU 信息、库存、主图、详情、SKU 图等字段的模板"],
                ["上传文件", "选择本地文件后", "创建导入任务并进入草稿状态"],
                ["执行校验", "上传成功后", "进入校验中并输出校验结果"],
                ["确认导入", "校验通过后", "执行落库并跳转导入记录"],
            ],
            fields=[
                ["渠道", "channel_code / 下拉", "必填；决定模板结构"],
                ["店铺", "shop_code / 下拉", "选填；填写后可返回更精确的类目与属性字段"],
                ["模板版本", "template_version / 只读或下拉", "随配置版本变化"],
                ["导入文件", "file_ref / 上传", "必填；需符合模板结构"],
            ],
            states=[
                "未选择渠道时，下载模板按钮不可点击。",
                "校验失败时显示错误数量、错误类型和失败行下载入口。",
                "存在未处理商家编码关联时，确认导入按钮禁用并提示先解决关联问题。",
            ],
            deps=[
                ["对象", "OBJ-IMPORT-JOB", "导入任务"],
                ["对象", "OBJ-IMPORT-JOB-LINE", "导入行结果"],
                ["接口", "API-IMPORT-TEMPLATE-PROFILE-GET", "查询模板字段版本"],
                ["接口", "API-IMPORT-TEMPLATE-DOWNLOAD-GET", "下载模板"],
                ["接口", "API-IMPORT-UPLOAD-POST", "上传导入文件"],
                ["接口", "API-IMPORT-VALIDATE-POST", "执行校验"],
                ["接口", "API-IMPORT-EXECUTE-POST", "确认导入"],
            ],
            boundaries=[
                "当前页不负责单条产品编辑，编辑在产品详情页完成。",
                "当前页不承接独立发品，不生成发布单。",
            ],
        ),
    )
    register_doc("docs/03-页面设计层/平台电脑端/产品管理/04-产品导入页.md", "page", "current-effective")

    write(
        "docs/03-页面设计层/平台电脑端/产品管理/05-导入记录页.md",
        active_page_doc(
            title="导入记录页",
            file_name="05-导入记录页.md",
            doc_id="PAGE-PROD-IMPORT-LOG",
            doc_slug="page-import-records",
            page_id="PG-PROD-IMPORT-LOG",
            page_group_id="PGROUP-PROD",
            route_key="product.import_log",
            menu_key="-",
            menu_name="无固定菜单",
            feature_ids="FEAT-PROD-IMPORT-LOG、FEAT-PROD-MERCHANT-LINK",
            mechanisms="MECH-IMPORT-STD",
            upstream="../../../baselines/00-feature-list.md；../../../baselines/01-page-tree.md；../01-产品管理-页面组.md",
            downstream="03-产品详情页.md",
            level="V1-必做",
            status="current-effective",
            goal="查看导入批次、失败明细和商家编码关联处理结果，支持回溯导入闭环。",
            entry_exit=[
                ["入口", "产品导入页进入"],
                ["出口", "产品导入、产品列表、产品详情"],
                ["前置条件", "存在导入任务"],
            ],
            layout=[
                ["任务筛选区", "按状态、渠道、时间筛选导入任务", "当前重点"],
                ["任务列表区", "展示任务批次、渠道、上传人、状态、成功/失败数量", "当前重点"],
                ["失败明细区", "展示失败行、失败原因和原始数据摘要", "当前重点"],
                ["关联处理区", "展示商家编码关联结果和待处理项", "当前重点"],
            ],
            actions=[
                ["查看批次详情", "点击任务行", "展开失败明细和关联结果"],
                ["下载失败报告", "任务存在失败行时", "下载失败行文件"],
                ["重新进入导入", "需要重传时", "返回产品导入页"],
                ["跳转产品详情", "导入成功且已关联产品时", "打开产品详情页"],
            ],
            fields=[
                ["导入任务号", "import_job_id / 只读", "唯一标识导入批次"],
                ["状态", "import_job_status / 标签", "展示当前批次状态"],
                ["失败原因", "error_message / 列表", "按行或按字段展示"],
                ["关联结果", "merchant_link_result / 区块", "展示已关联、未关联和冲突数量"],
            ],
            states=[
                "任务执行中时，列表要支持轮询刷新或手动刷新。",
                "当失败行为 0 时，失败明细区默认收起。",
                "当未关联数大于 0 时，高亮提示需要后续处理。",
            ],
            deps=[
                ["对象", "OBJ-IMPORT-JOB", "导入任务"],
                ["对象", "OBJ-IMPORT-JOB-LINE", "导入行结果"],
                ["接口", "API-IMPORT-LIST-GET", "获取导入记录"],
                ["接口", "API-MERCHANT-LINK-POST", "处理商家编码关联"],
            ],
            boundaries=[
                "当前页不直接修改产品字段，只负责查看导入结果和跳转。",
            ],
        ),
    )
    register_doc("docs/03-页面设计层/平台电脑端/产品管理/05-导入记录页.md", "page", "current-effective")

    # 商品管理
    write(
        "docs/03-页面设计层/平台电脑端/商品管理/01-渠道商品列表页.md",
        active_page_doc(
            title="渠道商品列表页",
            file_name="01-渠道商品列表页.md",
            doc_id="PAGE-ITEM-LIST",
            doc_slug="page-channel-item-list",
            page_id="PG-ITEM-LIST",
            page_group_id="PGROUP-ITEM",
            route_key="item.list",
            menu_key="menu.channel_item",
            menu_name="商品管理",
            feature_ids="FEAT-ITEM-LIST、FEAT-ITEM-BATCH-EDIT",
            mechanisms="MECH-ITEM-MAINTAIN、MECH-AUTH-AUDIT",
            upstream="../../../baselines/00-feature-list.md；../../../baselines/01-page-tree.md；../03-商品管理-页面组.md",
            downstream="02-渠道商品详情页.md；03-批量修改工作台.md",
            level="V1-必做",
            status="current-effective",
            goal="统一查看同一产品在不同渠道、店铺下的商品售卖信息。",
            entry_exit=[
                ["入口", "菜单 `menu.channel_item`"],
                ["出口", "渠道商品详情、渠道商品详情页列表"],
                ["前置条件", "商品查看权限"],
            ],
            layout=[
                ["筛选区", "按渠道、店铺、产品、商品状态、上下架状态筛选", "当前重点"],
                ["统计区", "展示商品总数、待完善商品数、已上架商品数", "建议保留"],
                ["列表区", "展示渠道商品标题、价格、类目、上下架状态、库存摘要、详情页数量", "当前重点"],
                ["列表操作区", "承接详情跳转、详情页跳转、库存跳转和当前页状态反馈", "当前重点"],
            ],
            actions=[
                ["查看详情", "点击标题或详情按钮", "进入渠道商品详情页"],
                ["查看详情页", "点击详情页数量或详情页按钮", "进入渠道商品详情页列表并带商品筛选条件"],
                ["跳转库存", "点击库存摘要", "进入库存列表并带筛选条件"],
            ],
            fields=[
                ["渠道", "channel_code / 下拉", "支持淘宝、拼多多、抖音、快手"],
                ["店铺", "shop_code / 下拉", "支持按店铺过滤"],
                ["上下架状态", "shelf_status / 下拉", "全部、已上架、已下架"],
                ["商品标题", "item_title / 列表字段", "支持详情页跳转"],
                ["详情页数量", "detail_page_count / 列表字段", "支持跳转渠道商品详情页列表；单个渠道商品最多 3 条"],
            ],
            states=[
                "未命中数据时展示空态和可返回筛选的引导。",
                "勾选条目时显示已选数量，供后续增强动作扩展使用。",
            ],
            deps=[
                ["对象", "OBJ-CHANNEL-ITEM", "渠道商品"],
                ["接口", "API-ITEM-LIST-GET", "获取渠道商品列表"],
            ],
            boundaries=[
                "当前列表页不直接编辑商品字段，单条编辑在详情页承接；详情页内容、版本和素材复用统一在渠道商品详情页列表承接；批量修改作为增强预留二级入口独立承接。",
            ],
        ),
    )
    register_doc("docs/03-页面设计层/平台电脑端/商品管理/01-渠道商品列表页.md", "page", "current-effective")

    write(
        "docs/03-页面设计层/平台电脑端/商品管理/02-渠道商品详情页.md",
        active_page_doc(
            title="渠道商品详情页",
            file_name="02-渠道商品详情页.md",
            doc_id="PAGE-ITEM-DETAIL",
            doc_slug="page-channel-item-detail",
            page_id="PG-ITEM-DETAIL",
            page_group_id="PGROUP-ITEM",
            route_key="item.detail",
            menu_key="-",
            menu_name="无固定菜单",
            feature_ids="FEAT-ITEM-DETAIL、FEAT-ITEM-CATEGORY-RULE",
            mechanisms="MECH-ITEM-MAINTAIN",
            upstream="../../../baselines/00-feature-list.md；../../../baselines/01-page-tree.md；../03-商品管理-页面组.md；../../../02-专题机制层/02-商品维护与类目联动机制.md",
            downstream="../库存管理/01-库存列表页.md；../配置管理/04-店铺配置详情页.md；05-渠道商品详情页列表.md",
            level="V1-必做",
            status="current-effective",
            goal="轻量维护渠道商品标题、价格、类目属性、销售属性、运费模板、上下架状态和发货时效，并展示详情页关联摘要。",
            entry_exit=[
                ["入口", "渠道商品列表点击详情"],
                ["出口", "渠道商品列表、渠道商品详情页列表、库存列表、店铺配置详情"],
                ["前置条件", "渠道商品已存在且具备查看权限"],
            ],
            layout=[
                ["摘要区", "展示产品、渠道、店铺、商家编码、商品状态", "当前重点"],
                ["基础售卖区", "标题、价格、上下架状态、发货时效", "当前重点"],
                ["类目与属性区", "根据渠道、店铺、类目动态返回类目属性和销售属性", "当前重点"],
                ["履约区", "运费模板、发货承诺、售卖状态", "当前重点"],
                ["详情页关联区", "展示已关联详情页数量、当前使用详情页和跳转入口", "当前重点"],
                ["关联库存区", "查看关联 SKU 库存摘要并跳转库存页面", "建议保留"],
            ],
            actions=[
                ["保存商品", "修改字段后", "保存渠道商品详情"],
                ["刷新类目规则", "切换店铺或类目后", "重新加载可维护字段范围"],
                ["查看详情页", "点击详情页关联摘要", "跳转渠道商品详情页列表并带当前商品筛选条件"],
                ["查看库存", "点击库存摘要", "跳转库存列表"],
            ],
            fields=[
                ["商品标题", "item_title / 输入框", "必填"],
                ["价格", "sale_price / 数字输入", "必填，大于 0"],
                ["类目", "category_code / 级联选择", "必填，受渠道和店铺限制"],
                ["类目属性", "category_attributes / 动态表单", "按返回 profile 渲染"],
                ["销售属性", "sales_attributes / 动态表单", "按 SKU 维度维护"],
                ["运费模板", "freight_template_id / 下拉", "按店铺配置返回"],
                ["上下架状态", "shelf_status / 单选", "支持上架、下架"],
                ["发货时效", "delivery_sla / 下拉或输入", "必填"],
            ],
            states=[
                "切换店铺或类目时，失效字段要提示并清空。",
                "无编辑权限或商品锁定时，页面只读。",
                "保存成功后展示最近同步时间和操作人。",
            ],
            deps=[
                ["对象", "OBJ-CHANNEL-ITEM", "渠道商品"],
                ["对象", "OBJ-ITEM-DETAIL-PAGE", "商品详情页记录"],
                ["对象", "OBJ-CATEGORY-PROFILE", "店铺级类目字段配置"],
                ["接口", "API-ITEM-DETAIL-GET", "读取详情"],
                ["接口", "API-ITEM-DETAIL-PAGE-LIST-GET", "读取当前商品关联的详情页摘要"],
                ["接口", "API-ITEM-CATEGORY-PROFILE-GET", "加载动态字段配置"],
                ["接口", "API-ITEM-DETAIL-PUT", "保存详情"],
            ],
            boundaries=[
                "当前页不承接独立发品动作，不做平台发布结果回写。",
                "详情内容上传、版本化和素材复用统一由渠道商品详情页列表承接，当前页不直接编辑详情页内容。",
                "库存仍由库存管理统一维护，详情页只展示摘要和跳转入口。",
            ],
        ),
    )
    register_doc("docs/03-页面设计层/平台电脑端/商品管理/02-渠道商品详情页.md", "page", "current-effective")

    write(
        "docs/03-页面设计层/平台电脑端/商品管理/05-渠道商品详情页列表.md",
        active_page_doc(
            title="渠道商品详情页列表",
            file_name="05-渠道商品详情页列表.md",
            doc_id="PAGE-ITEM-DETAIL-PAGE-LIST",
            doc_slug="page-channel-item-detail-page-list",
            page_id="PG-ITEM-DETAIL-PAGE-LIST",
            page_group_id="PGROUP-ITEM",
            route_key="item.detail_page_list",
            menu_key="menu.channel_item.detail_page_list",
            menu_name="渠道商品详情页列表",
            feature_ids="FEAT-ITEM-DETAIL-PAGE-LIST",
            mechanisms="MECH-ITEM-MAINTAIN、MECH-AUTH-AUDIT",
            upstream="../../../baselines/00-feature-list.md；../../../baselines/01-page-tree.md；../03-商品管理-页面组.md；../../../02-专题机制层/02-商品维护与类目联动机制.md",
            downstream="02-渠道商品详情页.md；../素材管理/01-素材列表页.md",
            level="V1-必做",
            status="current-effective",
            goal="统一查看和管理全部渠道商品的详情页数据，按产品聚合、按渠道商品展开；支持上传新详情页、编辑详情页内容并复用素材列表中的图片。",
            entry_exit=[
                ["入口", "商品管理二级菜单 `menu.channel_item.detail_page_list`"],
                ["出口", "渠道商品详情、素材列表"],
                ["前置条件", "商品查看权限；新建、上传、编辑和素材复用动作需要商品编辑或详情页管理权限"],
            ],
            layout=[
                ["筛选区", "按产品、渠道、店铺、渠道商品、详情页名称、当前使用状态筛选", "当前重点"],
                ["统计区", "展示产品数、渠道商品数、详情页总数、已达 3 条上限的商品数", "建议保留"],
                ["列表区", "展示产品名称、渠道商品标题、渠道、店铺、详情页名称、当前使用标记、关联素材数量", "当前重点"],
                ["编辑工作区", "编辑详情页内容结构、图文模块顺序和素材引用", "当前重点"],
                ["预览区", "预览当前详情页渲染结果和素材引用摘要", "当前重点"],
            ],
            actions=[
                ["查看关联商品", "点击渠道商品标题", "进入渠道商品详情页"],
                ["上传详情页", "选择渠道商品并上传文件", "创建详情页记录并关联渠道商品"],
                ["编辑详情页内容", "选择列表行并进入编辑工作区", "保存详情页结构、文案和排序"],
                ["复用素材", "在编辑工作区选择已有素材", "将同一素材引用到当前详情页，也可继续用于其他商品详情页"],
                ["设为当前使用", "点击“设为当前”", "当前渠道商品只有该详情页处于 current"],
            ],
            fields=[
                ["产品名称", "product_name / 列表字段", "支持按产品聚合查看多个渠道商品下的详情页"],
                ["渠道商品", "channel_item_id / 关联字段", "必填；同一渠道商品最多 3 个详情页"],
                ["详情页名称", "detail_page_name / 输入框", "必填，用于区分多个详情页记录"],
                ["详情页内容", "content_schema_json / 富文本或模块化结构", "必填；支持图文模块编辑"],
                ["当前使用", "is_current / 开关", "同一渠道商品同时最多一条当前使用记录"],
                ["复用素材", "reused_asset_ids / 多选", "可选择素材列表已有图片；同一素材可关联多个详情页"],
            ],
            states=[
                "同一产品在多个渠道、店铺售卖时会形成多个渠道商品，列表需统一展示这些渠道商品下的全部详情页记录。",
                "同一渠道商品最多允许存在 3 条详情页记录，历史记录保留可追溯。",
                "上传成功后要创建新的详情页记录，并把详情素材同步归档到素材列表。",
                "编辑保存后要保留详情页版本、最后编辑人和素材引用关系。",
            ],
            deps=[
                ["对象", "OBJ-CHANNEL-ITEM", "渠道商品"],
                ["对象", "OBJ-ITEM-DETAIL-PAGE", "商品详情页记录"],
                ["对象", "OBJ-ASSET", "素材对象"],
                ["接口", "API-ITEM-DETAIL-PAGE-LIST-GET", "获取商品详情页列表"],
                ["接口", "API-ITEM-DETAIL-PAGE-DETAIL-GET", "获取详情页预览与素材摘要"],
                ["接口", "API-ITEM-DETAIL-PAGE-UPLOAD-POST", "上传新详情页并归档素材"],
                ["接口", "API-ITEM-DETAIL-PAGE-PUT", "保存详情页内容与当前使用状态"],
                ["接口", "API-ITEM-DETAIL-PAGE-ASSET-LINK-POST", "复用素材列表中的已有图片到详情页"],
            ],
            boundaries=[
                "当前页管理的是全部渠道商品的详情页记录，不是单商品售卖字段编辑页。",
                "素材原子管理在素材列表，但当前页必须支持搜索和引用已有素材到详情页。",
                "允许把同一张图片复用到多个商品详情页，但素材文件本身的原子维护仍归素材列表。",
            ],
        ),
    )
    register_doc("docs/03-页面设计层/平台电脑端/商品管理/05-渠道商品详情页列表.md", "page", "current-effective")

    write(
        "docs/03-页面设计层/平台电脑端/商品管理/03-批量修改工作台.md",
        active_page_doc(
            title="批量修改工作台",
            file_name="03-批量修改工作台.md",
            doc_id="PAGE-ITEM-BATCH-EDIT",
            doc_slug="page-item-batch-edit",
            page_id="ACTION-ITEM-BATCH-EDIT",
            page_group_id="PGROUP-ITEM",
            route_key="item.batch_edit",
            menu_key="menu.channel_item.batch_edit",
            menu_name="批量修改",
            feature_ids="FEAT-ITEM-BATCH-EDIT",
            mechanisms="MECH-ITEM-MAINTAIN",
            upstream="../../../baselines/00-feature-list.md；../03-商品管理-页面组.md；../../../02-专题机制层/02-商品维护与类目联动机制.md",
            downstream="01-渠道商品列表页.md",
            level="V1-增强",
            status="enhancement-reserved",
            goal="按筛选范围批量修改渠道商品标题、价格、批量上下架和库存。",
            entry_exit=[
                ["入口", "商品管理二级菜单 `menu.channel_item.batch_edit`"],
                ["出口", "渠道商品列表"],
                ["前置条件", "商品编辑权限；当前有命中的商品范围"],
            ],
            layout=[
                ["命中范围区", "继承列表筛选条件或重新设置筛选", "增强预留"],
                ["修改类型区", "标题、价格、批量上下架、库存四类操作切换", "增强预留"],
                ["预览区", "展示命中条数、受影响渠道/店铺和样例数据", "增强预留"],
                ["执行结果区", "展示执行成功数、失败数和失败原因", "增强预留"],
            ],
            actions=[
                ["预览命中结果", "设置筛选条件和修改内容后", "返回命中商品数和样例"],
                ["执行批量修改", "预览通过后", "批量写入商品或库存"],
                ["下载失败明细", "存在失败行时", "下载执行结果"],
            ],
            fields=[
                ["修改类型", "batch_type / 单选", "必填：title、price、shelf_status、inventory"],
                ["标题规则", "title_pattern / 输入框", "仅标题修改时必填"],
                ["目标价格", "target_price / 数字输入", "价格修改时必填，大于 0"],
                ["目标上下架状态", "target_shelf_status / 单选", "批量上下架时必填"],
                ["目标库存", "target_stock / 数字输入", "库存修改时必填，大于等于 0"],
            ],
            states=[
                "当前为增强预留，前端可先保留路由和空态提示。",
                "批量执行失败时必须展示失败明细，不允许静默吞掉部分失败。",
            ],
            deps=[
                ["对象", "OBJ-CHANNEL-ITEM", "渠道商品"],
                ["对象", "OBJ-INVENTORY", "库存对象"],
                ["接口", "API-ITEM-BATCH-PREVIEW-POST", "批量修改预览"],
                ["接口", "API-ITEM-BATCH-EXECUTE-POST", "批量修改执行"],
            ],
            boundaries=[
                "不做独立发布，不维护发布单或发布结果状态。",
            ],
        ),
    )
    register_doc("docs/03-页面设计层/平台电脑端/商品管理/03-批量修改工作台.md", "page", "enhancement-reserved")

    write(
        "docs/03-页面设计层/平台电脑端/商品管理/04-发布记录页.md",
        reserved_page_doc(
            title="发布记录页",
            file_name="04-发布记录页.md",
            doc_id="PAGE-ITEM-PUBLISH-LOG",
            doc_slug="page-item-publish-log",
            page_id="PAGE-ITEM-PUBLISH-LOG",
            page_group_id="PGROUP-ITEM",
            route_key="item.publish_log",
            feature="历史发品相关占位",
            level="不在当前范围",
            status="archive-candidate",
            note="当前产品范围不做独立发品和发布记录，本文件仅保留历史占位，不纳入当前前端实现。",
            upstream="../../../baselines/00-feature-list.md；../03-商品管理-页面组.md",
        ),
    )
    register_doc("docs/03-页面设计层/平台电脑端/商品管理/04-发布记录页.md", "page", "archive-candidate")

    # 库存管理
    write(
        "docs/03-页面设计层/平台电脑端/库存管理/01-库存列表页.md",
        active_page_doc(
            title="库存列表页",
            file_name="01-库存列表页.md",
            doc_id="PAGE-INV-LIST",
            doc_slug="page-inventory-list",
            page_id="PG-INV-LIST",
            page_group_id="PGROUP-INV",
            route_key="inventory.list",
            menu_key="menu.inventory",
            menu_name="库存管理",
            feature_ids="FEAT-INV-LIST",
            mechanisms="MECH-INV-SYNC、MECH-AUTH-AUDIT",
            upstream="../../../baselines/00-feature-list.md；../../../baselines/01-page-tree.md；../04-库存管理-页面组.md",
            downstream="02-库存详情页.md",
            level="V1-必做",
            status="current-effective",
            goal="统一查看产品在各渠道商品、店铺和 SKU 下的库存总览，并执行库存调整和同步。",
            entry_exit=[
                ["入口", "菜单 `menu.inventory`"],
                ["出口", "库存详情"],
                ["前置条件", "库存查看权限"],
            ],
            layout=[
                ["筛选区", "按产品、渠道、店铺、SKU、同步状态筛选", "当前重点"],
                ["指标区", "总库存、可售库存、低库存数、同步失败数", "当前重点"],
                ["列表区", "展示总库存、可用库存、锁定库存、可售库存和同步状态", "当前重点"],
                ["操作区", "库存调整、触发同步、查看详情", "当前重点"],
            ],
            actions=[
                ["调整库存", "点击调整按钮", "弹出调整框并提交库存调整"],
                ["触发同步", "点击同步按钮", "发起库存同步任务"],
                ["查看详情", "点击详情按钮", "进入库存详情页（增强）"],
            ],
            fields=[
                ["产品 / SKU", "product_id、sku_code / 组合字段", "支持模糊搜索"],
                ["渠道", "channel_code / 下拉", "支持四渠道"],
                ["同步状态", "sync_status / 下拉", "全部、待同步、同步中、成功、失败"],
                ["可售库存", "sellable_stock / 列表字段", "列表高亮低库存"],
            ],
            states=[
                "同步中时禁用再次同步按钮。",
                "调整库存成功后刷新当前行并提示最新同步状态。",
                "低库存行高亮，便于运营快速定位。",
            ],
            deps=[
                ["对象", "OBJ-INVENTORY", "库存对象"],
                ["接口", "API-INV-LIST-GET", "库存列表查询"],
                ["接口", "API-INV-ADJUST-POST", "库存调整"],
                ["接口", "API-INV-SYNC-POST", "库存同步"],
            ],
            boundaries=[
                "当前页是库存维护主入口，当前一期不展开多仓拆分。",
                "库存调整记录作为增强预留二级菜单独立承接，不作为库存列表的默认出口。",
            ],
        ),
    )
    register_doc("docs/03-页面设计层/平台电脑端/库存管理/01-库存列表页.md", "page", "current-effective")

    write(
        "docs/03-页面设计层/平台电脑端/库存管理/02-库存详情页.md",
        active_page_doc(
            title="库存详情页",
            file_name="02-库存详情页.md",
            doc_id="PAGE-INV-DETAIL",
            doc_slug="page-inventory-detail",
            page_id="PG-INV-DETAIL",
            page_group_id="PGROUP-INV",
            route_key="inventory.detail",
            menu_key="-",
            menu_name="无固定菜单",
            feature_ids="FEAT-INV-DETAIL",
            mechanisms="MECH-INV-SYNC",
            upstream="../../../baselines/00-feature-list.md；../../../baselines/01-page-tree.md；../04-库存管理-页面组.md",
            downstream="-",
            level="V1-增强",
            status="enhancement-reserved",
            goal="查看单条库存记录的完整快照、最近同步结果和关联调整记录。",
            entry_exit=[
                ["入口", "库存列表详情按钮"],
                ["出口", "库存列表"],
                ["前置条件", "库存记录已存在"],
            ],
            layout=[
                ["摘要区", "产品、渠道、店铺、SKU、同步状态摘要", "增强预留"],
                ["库存快照区", "总库存、可用库存、锁定库存、可售库存", "增强预留"],
                ["最近记录区", "展示最近几次调整与同步结果", "增强预留"],
            ],
            actions=[
                ["返回总览", "点击返回", "返回库存列表"],
            ],
            fields=[
                ["库存记录 ID", "inventory_id / 只读", "唯一标识"],
                ["同步失败原因", "failure_reason / 文本", "同步失败时展示"],
            ],
            states=[
                "当前为增强预留，可先保留路由占位。",
            ],
            deps=[
                ["对象", "OBJ-INVENTORY", "库存对象"],
                ["接口", "API-INV-DETAIL-GET", "库存详情查询"],
            ],
            boundaries=[
                "当前一期库存主流程已由库存列表覆盖，本页不是阻断依赖。",
            ],
        ),
    )
    register_doc("docs/03-页面设计层/平台电脑端/库存管理/02-库存详情页.md", "page", "enhancement-reserved")

    write(
        "docs/03-页面设计层/平台电脑端/库存管理/03-库存调整记录页.md",
        active_page_doc(
            title="库存调整记录页",
            file_name="03-库存调整记录页.md",
            doc_id="PAGE-INV-LOG",
            doc_slug="page-inventory-adjust-log",
            page_id="PG-INV-LOG",
            page_group_id="PGROUP-INV",
            route_key="inventory.adjust_log",
            menu_key="menu.inventory.adjust_log",
            menu_name="库存调整记录",
            feature_ids="FEAT-INV-LOG",
            mechanisms="MECH-INV-SYNC",
            upstream="../../../baselines/00-feature-list.md；../../../baselines/01-page-tree.md；../04-库存管理-页面组.md",
            downstream="02-库存详情页.md",
            level="V1-增强",
            status="enhancement-reserved",
            goal="查看库存调整台账、调整前后变化、原因、操作人和同步结果。",
            entry_exit=[
                ["入口", "二级菜单 `menu.inventory.adjust_log`"],
                ["出口", "库存列表"],
                ["前置条件", "库存查看权限"],
            ],
            layout=[
                ["筛选区", "按产品、渠道、店铺、时间、操作人筛选", "增强预留"],
                ["台账区", "展示调整前后库存、原因、同步状态、操作时间", "增强预留"],
            ],
            actions=[
                ["返回库存总览", "点击返回", "返回库存列表"],
            ],
            fields=[
                ["调整原因", "adjust_reason / 文本", "必填"],
                ["调整前后值", "before_after / 只读", "台账展示字段"],
            ],
            states=[
                "当前为增强预留。",
            ],
            deps=[
                ["对象", "OBJ-INVENTORY-LOG", "库存调整日志"],
                ["接口", "API-INV-ADJUST-LOG-GET", "库存调整记录查询"],
            ],
            boundaries=[
                "当前一期不阻断交付，可后续补齐。",
            ],
        ),
    )
    register_doc("docs/03-页面设计层/平台电脑端/库存管理/03-库存调整记录页.md", "page", "enhancement-reserved")

    # 素材管理
    write(
        "docs/03-页面设计层/平台电脑端/素材管理/01-素材列表页.md",
        active_page_doc(
            title="素材列表页",
            file_name="01-素材列表页.md",
            doc_id="PAGE-ASSET-LIST",
            doc_slug="page-asset-list",
            page_id="PG-ASSET-LIST",
            page_group_id="PGROUP-ASSET",
            route_key="asset.list",
            menu_key="menu.asset",
            menu_name="素材管理",
            feature_ids="FEAT-ASSET-LIST",
            mechanisms="MECH-IMPORT-STD",
            upstream="../../../baselines/00-feature-list.md；../../../baselines/01-page-tree.md；../02-素材管理-页面组.md",
            downstream="02-素材详情页.md",
            level="V1-增强",
            status="enhancement-reserved",
            goal="统一查看导入后的主图、详情图和 SKU 图素材，并按引用关系筛选。",
            entry_exit=[
                ["入口", "素材管理菜单"],
                ["出口", "素材详情、产品详情、渠道商品详情"],
                ["前置条件", "素材查看权限"],
            ],
            layout=[
                ["筛选区", "按素材类型、引用对象、渠道筛选", "增强预留"],
                ["列表区", "展示预览图、引用对象、来源导入任务", "增强预留"],
            ],
            actions=[
                ["查看详情", "点击素材卡片或详情按钮", "进入素材详情页"],
            ],
            fields=[
                ["素材类型", "asset_type / 下拉", "主图、详情、SKU 图"],
                ["引用对象", "bind_object / 文本", "支持产品或渠道商品检索"],
            ],
            states=[
                "当前为增强预留。",
            ],
            deps=[
                ["对象", "OBJ-ASSET", "素材对象"],
                ["接口", "API-ASSET-LIST-GET", "素材列表查询"],
            ],
            boundaries=[
                "当前一期不以素材管理为主入口。",
            ],
        ),
    )
    register_doc("docs/03-页面设计层/平台电脑端/素材管理/01-素材列表页.md", "page", "enhancement-reserved")

    write(
        "docs/03-页面设计层/平台电脑端/素材管理/02-素材详情页.md",
        active_page_doc(
            title="素材详情页",
            file_name="02-素材详情页.md",
            doc_id="PAGE-ASSET-DETAIL",
            doc_slug="page-asset-detail",
            page_id="PG-ASSET-DETAIL",
            page_group_id="PGROUP-ASSET",
            route_key="asset.detail",
            menu_key="-",
            menu_name="无固定菜单",
            feature_ids="FEAT-ASSET-DETAIL",
            mechanisms="MECH-IMPORT-STD",
            upstream="../../../baselines/00-feature-list.md；../../../baselines/01-page-tree.md；../02-素材管理-页面组.md",
            downstream="../产品管理/03-产品详情页.md；../商品管理/02-渠道商品详情页.md",
            level="V1-增强",
            status="enhancement-reserved",
            goal="查看素材预览、存储路径、引用关系和替换建议。",
            entry_exit=[
                ["入口", "素材列表内容进入"],
                ["出口", "素材列表、产品详情、渠道商品详情"],
                ["前置条件", "素材已存在"],
            ],
            layout=[
                ["预览区", "展示原图、缩略图和尺寸信息", "增强预留"],
                ["引用关系区", "展示引用产品/商品/SKU", "增强预留"],
            ],
            actions=[
                ["返回列表", "点击返回", "返回素材列表"],
            ],
            fields=[
                ["素材路径", "asset_path / 只读", "展示存储路径"],
                ["引用次数", "bind_count / 只读", "展示素材使用范围"],
            ],
            states=[
                "当前为增强预留。",
            ],
            deps=[
                ["对象", "OBJ-ASSET", "素材对象"],
                ["接口", "API-ASSET-DETAIL-GET", "素材详情查询"],
            ],
            boundaries=[
                "当前不做在线图片编辑或裁剪。",
            ],
        ),
    )
    register_doc("docs/03-页面设计层/平台电脑端/素材管理/02-素材详情页.md", "page", "enhancement-reserved")

    # 配置管理
    write(
        "docs/03-页面设计层/平台电脑端/配置管理/01-配置列表页.md",
        active_page_doc(
            title="配置列表页",
            file_name="01-配置列表页.md",
            doc_id="PAGE-CONF-LIST",
            doc_slug="page-config-list",
            page_id="PG-CONF-LIST",
            page_group_id="PGROUP-CONF",
            route_key="config.list",
            menu_key="menu.config",
            menu_name="配置管理",
            feature_ids="FEAT-CONF-LIST",
            mechanisms="MECH-ITEM-MAINTAIN、MECH-AUTH-AUDIT",
            upstream="../../../baselines/00-feature-list.md；../../../baselines/01-page-tree.md；../05-配置管理-页面组.md",
            downstream="04-店铺配置详情页.md",
            level="V1-必做",
            status="current-effective",
            goal="汇总店铺级规则配置，作为导入模板和渠道商品动态字段的配置入口。",
            entry_exit=[
                ["入口", "菜单 `menu.config`"],
                ["出口", "店铺配置详情"],
                ["前置条件", "配置查看权限"],
            ],
            layout=[
                ["筛选区", "按渠道、店铺、状态筛选配置", "当前重点"],
                ["列表区", "展示店铺、渠道、配置状态、类目规则版本、更新时间", "当前重点"],
                ["操作区", "查看详情、复制配置、启停用配置", "建议保留"],
            ],
            actions=[
                ["查看详情", "点击配置名称", "进入店铺配置详情页"],
                ["复制配置", "点击复制", "以复制模式进入详情页"],
                ["停用配置", "点击停用", "更新配置状态"],
            ],
            fields=[
                ["渠道", "channel_code / 下拉", "必填"],
                ["店铺", "shop_code / 下拉", "必填"],
                ["配置状态", "config_status / 标签", "草稿、生效中、停用"],
            ],
            states=[
                "无配置时保留新增或复制入口。",
                "停用操作需二次确认。",
            ],
            deps=[
                ["对象", "OBJ-SHOP-CONFIG", "店铺配置对象"],
                ["接口", "API-CONF-LIST-GET", "配置列表查询"],
            ],
            boundaries=[
                "当前不拆系统级配置和渠道级配置独立页。",
            ],
        ),
    )
    register_doc("docs/03-页面设计层/平台电脑端/配置管理/01-配置列表页.md", "page", "current-effective")

    write(
        "docs/03-页面设计层/平台电脑端/配置管理/02-系统配置详情页.md",
        reserved_page_doc(
            title="系统配置详情页",
            file_name="02-系统配置详情页.md",
            doc_id="PAGE-CONF-SYSTEM",
            doc_slug="page-config-system-detail",
            page_id="PAGE-CONF-SYSTEM",
            page_group_id="PGROUP-CONF",
            route_key="config.system_detail",
            feature="历史扩展页",
            level="不在当前范围",
            status="archive-candidate",
            note="当前配置只做到店铺级规则，不做独立系统配置详情页。",
            upstream="../../../baselines/00-feature-list.md；../05-配置管理-页面组.md",
        ),
    )
    register_doc("docs/03-页面设计层/平台电脑端/配置管理/02-系统配置详情页.md", "page", "archive-candidate")

    write(
        "docs/03-页面设计层/平台电脑端/配置管理/03-渠道配置详情页.md",
        reserved_page_doc(
            title="渠道配置详情页",
            file_name="03-渠道配置详情页.md",
            doc_id="PAGE-CONF-CHANNEL",
            doc_slug="page-config-channel-detail",
            page_id="PAGE-CONF-CHANNEL",
            page_group_id="PGROUP-CONF",
            route_key="config.channel_detail",
            feature="历史扩展页",
            level="不在当前范围",
            status="archive-candidate",
            note="当前一期不拆独立渠道配置详情页，渠道差异规则收口在店铺配置详情页内。",
            upstream="../../../baselines/00-feature-list.md；../05-配置管理-页面组.md",
        ),
    )
    register_doc("docs/03-页面设计层/平台电脑端/配置管理/03-渠道配置详情页.md", "page", "archive-candidate")

    write(
        "docs/03-页面设计层/平台电脑端/配置管理/04-店铺配置详情页.md",
        active_page_doc(
            title="店铺配置详情页",
            file_name="04-店铺配置详情页.md",
            doc_id="PAGE-CONF-DETAIL",
            doc_slug="page-config-shop-detail",
            page_id="PG-CONF-DETAIL",
            page_group_id="PGROUP-CONF",
            route_key="config.shop_detail",
            menu_key="-",
            menu_name="无固定菜单",
            feature_ids="FEAT-CONF-SHOP-DETAIL、FEAT-ITEM-CATEGORY-RULE",
            mechanisms="MECH-ITEM-MAINTAIN、MECH-AUTH-AUDIT",
            upstream="../../../baselines/00-feature-list.md；../../../baselines/01-page-tree.md；../05-配置管理-页面组.md",
            downstream="../产品管理/04-产品导入页.md；../商品管理/02-渠道商品详情页.md",
            level="V1-必做",
            status="current-effective",
            goal="维护店铺级类目动态适配规则、运费模板、默认上下架状态和发货时效，为导入模板和商品详情页提供字段口径。",
            entry_exit=[
                ["入口", "配置列表内容进入"],
                ["出口", "配置列表、渠道商品详情、产品导入"],
                ["前置条件", "配置编辑权限"],
            ],
            layout=[
                ["基本信息区", "渠道、店铺、状态、适用范围", "当前重点"],
                ["类目规则区", "配置可用类目、属性 profile 版本和字段范围", "当前重点"],
                ["履约规则区", "运费模板、默认上下架状态、发货时效", "当前重点"],
                ["生效信息区", "展示最近发布时间、发布人和生效说明", "建议保留"],
            ],
            actions=[
                ["保存草稿", "修改规则后", "保存但不生效"],
                ["启用配置", "草稿保存后", "切换为生效中"],
                ["停用配置", "已生效配置点击停用", "切换为停用"],
            ],
            fields=[
                ["店铺", "shop_code / 下拉", "必填"],
                ["可用类目", "available_categories / 多选或树", "决定导入模板与详情页类目范围"],
                ["类目字段版本", "profile_version / 只读或选择", "用于模板下载和详情动态字段"],
                ["运费模板", "freight_templates / 多选", "支持配置可用模板集合"],
                ["默认上下架状态", "default_shelf_status / 单选", "上架或下架"],
                ["发货时效", "default_delivery_sla / 下拉或输入", "必填"],
            ],
            states=[
                "停用后不能被新导入任务和详情页规则加载。",
                "复制模式进入时默认生成新配置主键。",
                "生效中配置编辑时，需要提示是否覆盖后续新任务的模板字段口径。",
            ],
            deps=[
                ["对象", "OBJ-SHOP-CONFIG", "店铺配置对象"],
                ["对象", "OBJ-CATEGORY-PROFILE", "类目 profile"],
                ["接口", "API-CONF-DETAIL-GET", "读取配置详情"],
                ["接口", "API-CONF-DETAIL-PUT", "保存配置详情"],
            ],
            boundaries=[
                "当前不拆系统级配置、渠道级配置和模板配置独立页面。",
            ],
        ),
    )
    register_doc("docs/03-页面设计层/平台电脑端/配置管理/04-店铺配置详情页.md", "page", "current-effective")

    write(
        "docs/03-页面设计层/平台电脑端/配置管理/05-导入模板配置页.md",
        reserved_page_doc(
            title="导入模板配置页",
            file_name="05-导入模板配置页.md",
            doc_id="PAGE-CONF-TEMPLATE",
            doc_slug="page-config-template",
            page_id="PAGE-CONF-TEMPLATE",
            page_group_id="PGROUP-CONF",
            route_key="config.template",
            feature="历史扩展页",
            level="不在当前范围",
            status="archive-candidate",
            note="模板下载已收口在产品导入页，当前不做独立导入模板配置页。",
            upstream="../../../baselines/00-feature-list.md；../05-配置管理-页面组.md",
        ),
    )
    register_doc("docs/03-页面设计层/平台电脑端/配置管理/05-导入模板配置页.md", "page", "archive-candidate")

    write(
        "docs/03-页面设计层/平台电脑端/配置管理/06-操作日志页.md",
        reserved_page_doc(
            title="操作日志页",
            file_name="06-操作日志页.md",
            doc_id="PAGE-CONF-LOG",
            doc_slug="page-config-log",
            page_id="PAGE-CONF-LOG",
            page_group_id="PGROUP-CONF",
            route_key="config.log",
            feature="历史扩展页",
            level="不在当前范围",
            status="archive-candidate",
            note="审计能力通过对象级字段和事件日志承接，当前不做独立操作日志页。",
            upstream="../../../baselines/00-feature-list.md；../05-配置管理-页面组.md",
        ),
    )
    register_doc("docs/03-页面设计层/平台电脑端/配置管理/06-操作日志页.md", "page", "archive-candidate")

    scaffold_doc = f"""
# {PROJECT}-页面开发脚手架定义

{meta_table([
    ("文档名称", "99-页面开发脚手架定义.md"),
    ("doc_id", "DOC-PAGE-SCAFFOLD"),
    ("doc_slug", "page-scaffold"),
    ("文档层级", "03-页面设计层"),
    ("文档对象", "前端脚手架定义"),
    ("适用端", "平台电脑端"),
    ("上游文档", "../../product_agent_standards/09_page_scaffold_spec.md；../01-端产品层/05-平台电脑端产品文档.md"),
    ("下游文档", "前端实现任务"),
    ("baseline_version", BASELINE_VERSION),
    ("doc_version", DOC_VERSION),
    ("doc_status", "current-effective"),
    ("更新时间", TODAY),
])}

## 1. 当前前端承接位置

{md_table(
    ["类型", "路径", "说明"],
    [
        ["路由模块", "/Users/youyang/项目/2026/商品中台/frontend/apps/web-antd/src/router/routes/modules/product-platform.ts", "产品中台路由总入口"],
        ["页面目录", "/Users/youyang/项目/2026/商品中台/frontend/apps/web-antd/src/views/product-platform/", "页面实现主目录"],
        ["前端模拟数据", "/Users/youyang/项目/2026/商品中台/frontend/apps/web-antd/src/views/product-platform/data.ts", "当前已有示例数据和行为封装"],
    ],
)}

## 2. 当前页面脚手架建议

{bullet([
    "列表页统一采用：筛选区 + 指标区 + 表格区 + 操作区。",
    "详情页统一采用：头部摘要 + 主表单区 + 关联信息区 + 页脚动作区。",
    "工作页统一采用：说明区 + 任务输入区 + 校验/结果区 + 确认区。",
    "增强动作工作台采用：命中范围区 + 动作配置区 + 预览区 + 结果区。",
])}

## 3. 路由调整要求

{bullet([
    "当前应保留：产品列表、产品详情、产品导入、导入记录、渠道商品列表、渠道商品详情页列表、渠道商品详情、库存列表、配置列表、店铺配置详情。",
    "增强预留：素材列表、素材详情、库存详情、库存调整记录、批量修改工作台、新增产品。",
    "候选归档：独立发布工作台/发布记录、系统配置详情、渠道配置详情、导入模板配置页、操作日志页。",
    "渠道商品详情页列表必须承接详情页内容编辑、当前版本切换和素材复用，不得再回塞到渠道商品详情页。",
])}
"""
    write("docs/03-页面设计层/平台电脑端/99-页面开发脚手架定义.md", scaffold_doc)
    register_doc("docs/03-页面设计层/平台电脑端/99-页面开发脚手架定义.md", "page-design", "current-effective")


def build_data_docs() -> None:
    object_doc = f"""
# {PROJECT}-核心对象定义

{meta_table([
    ("文档名称", "01-核心对象定义.md"),
    ("doc_id", "DOC-DATA-OBJECTS"),
    ("doc_slug", "core-objects"),
    ("文档层级", "04-数据与接口层"),
    ("文档对象", "核心对象定义"),
    ("上游文档", "../baselines/00-feature-list.md；../02-专题机制层/"),
    ("下游文档", "02-逻辑数据模型.md；03-字段字典.md；05-接口清单.md"),
    ("baseline_version", BASELINE_VERSION),
    ("doc_version", DOC_VERSION),
    ("doc_status", "current-effective"),
    ("更新时间", TODAY),
])}

## 1. 核心对象清单

{md_table(
    ["object_id", "对象名称", "作用", "主要关系", "当前状态"],
    [
        ["OBJ-PRODUCT", "产品", "中台统一产品主档", "1:N 产品 SKU；1:N 渠道商品", "当前范围"],
        ["OBJ-PRODUCT-SKU", "产品 SKU", "产品规格和基础编码", "N:1 产品；1:N 渠道商品 SKU", "当前范围"],
        ["OBJ-CHANNEL-ITEM", "渠道商品", "多渠道多店铺售卖信息", "N:1 产品；1:N 渠道商品 SKU；N:1 店铺配置", "当前范围"],
        ["OBJ-ITEM-DETAIL-PAGE", "商品详情页", "渠道商品详情页内容与版本记录", "N:1 渠道商品；N:M 素材对象", "当前范围"],
        ["OBJ-CHANNEL-ITEM-SKU", "渠道商品 SKU", "渠道商品下的销售规格记录", "N:1 渠道商品；1:1 库存记录", "当前范围"],
        ["OBJ-IMPORT-JOB", "导入任务", "导入批次级任务对象", "1:N 导入行结果", "当前范围"],
        ["OBJ-IMPORT-JOB-LINE", "导入行结果", "记录行级校验和落库结果", "N:1 导入任务；可关联产品/商品", "当前范围"],
        ["OBJ-INVENTORY", "库存记录", "聚合库存快照", "1:1 渠道商品 SKU；1:N 库存调整日志", "当前范围"],
        ["OBJ-INVENTORY-LOG", "库存调整日志", "库存台账与同步记录", "N:1 库存记录", "增强预留"],
        ["OBJ-SHOP-CONFIG", "店铺配置", "店铺级规则入口", "1:N 类目 profile；1:N 运费模板映射", "当前范围"],
        ["OBJ-CATEGORY-PROFILE", "类目 profile", "按渠道/店铺/类目定义动态字段范围", "N:1 店铺配置；供模板下载和详情页调用", "当前范围"],
        ["OBJ-ASSET", "素材对象", "主图、详情图和 SKU 图素材资产", "可引用到产品/商品/详情页/SKU，支持跨商品详情页复用", "增强预留"],
        ["OBJ-AUDIT-LOG", "审计日志", "关键动作审计与回放", "关联导入任务、商品、库存、配置", "当前范围"],
    ],
)}
"""
    write("docs/04-数据与接口层/01-核心对象定义.md", object_doc)
    register_doc("docs/04-数据与接口层/01-核心对象定义.md", "data", "current-effective")

    model_doc = f"""
# {PROJECT}-逻辑数据模型

{meta_table([
    ("文档名称", "02-逻辑数据模型.md"),
    ("doc_id", "DOC-DATA-MODEL"),
    ("doc_slug", "logical-data-model"),
    ("文档层级", "04-数据与接口层"),
    ("文档对象", "逻辑数据模型"),
    ("上游文档", "01-核心对象定义.md"),
    ("下游文档", "03-字段字典.md；07-表设计建议.md"),
    ("baseline_version", BASELINE_VERSION),
    ("doc_version", DOC_VERSION),
    ("doc_status", "current-effective"),
    ("更新时间", TODAY),
])}

## 1. 关系图

```mermaid
graph LR
  PRODUCT["产品"] --> PRODUCT_SKU["产品 SKU"]
  PRODUCT --> CHANNEL_ITEM["渠道商品"]
  CHANNEL_ITEM --> ITEM_DETAIL_PAGE["商品详情页"]
  CHANNEL_ITEM --> CHANNEL_ITEM_SKU["渠道商品 SKU"]
  CHANNEL_ITEM_SKU --> INVENTORY["库存记录"]
  INVENTORY --> INVENTORY_LOG["库存调整日志"]
  SHOP_CONFIG["店铺配置"] --> CATEGORY_PROFILE["类目 profile"]
  CATEGORY_PROFILE --> CHANNEL_ITEM
  SHOP_CONFIG --> IMPORT_JOB["导入任务"]
  IMPORT_JOB --> IMPORT_LINE["导入行结果"]
  IMPORT_LINE --> PRODUCT
  IMPORT_LINE --> CHANNEL_ITEM
  PRODUCT --> ASSET["素材对象"]
  CHANNEL_ITEM --> ASSET
  ITEM_DETAIL_PAGE --> ASSET
  IMPORT_JOB --> AUDIT["审计日志"]
  CHANNEL_ITEM --> AUDIT
  INVENTORY --> AUDIT
```

## 2. 建模说明

{bullet([
    "产品是归集中心，同一产品下允许存在多个渠道商品。",
    "渠道商品与渠道商品 SKU 承接渠道差异信息和销售属性。",
    "同一渠道商品最多允许存在 3 个商品详情页，详情页内容与售卖字段拆页管理。",
    "素材对象允许被多个商品详情页复用，不要求每次都重新上传图片。",
    "库存围绕渠道商品 SKU 聚合，不在一期引入仓库层级。",
    "店铺配置决定模板下载字段和详情页动态字段范围。",
])}
"""
    write("docs/04-数据与接口层/02-逻辑数据模型.md", model_doc)
    register_doc("docs/04-数据与接口层/02-逻辑数据模型.md", "data", "current-effective")

    field_doc = f"""
# {PROJECT}-字段字典

{meta_table([
    ("文档名称", "03-字段字典.md"),
    ("doc_id", "DOC-DATA-FIELDS"),
    ("doc_slug", "field-dictionary"),
    ("文档层级", "04-数据与接口层"),
    ("文档对象", "字段字典"),
    ("上游文档", "01-核心对象定义.md；02-逻辑数据模型.md；../02-专题机制层/01-标准化导入机制.md"),
    ("下游文档", "05-接口清单.md；07-表设计建议.md"),
    ("baseline_version", BASELINE_VERSION),
    ("doc_version", DOC_VERSION),
    ("doc_status", "current-effective"),
    ("更新时间", TODAY),
])}

## 1. 关键字段

{md_table(
    ["对象", "字段", "编码", "类型", "说明"],
    [
        ["产品", "产品 ID", "product_id", "string", "产品主键"],
        ["产品", "图书名称", "product_name", "string", "图书主标题"],
        ["产品", "ISBN", "isbn", "string", "图书唯一识别码"],
        ["产品", "商家编码", "merchant_code", "string", "产品与渠道商品归集主键"],
        ["产品 SKU", "商家 SKU 编码", "merchant_sku_code", "string", "建议用于 SKU 级映射"],
        ["渠道商品", "渠道", "channel_code", "enum", "TAOBAO / PINDUODUO / DOUYIN / KUAISHOU"],
        ["渠道商品", "店铺", "shop_code", "string", "店铺识别码"],
        ["渠道商品", "商品 ID", "channel_item_id", "string", "渠道侧商品识别"],
        ["渠道商品", "商品标题", "item_title", "string", "售卖标题"],
        ["渠道商品", "类目", "category_code", "string", "渠道类目编码"],
        ["渠道商品", "类目属性", "category_attributes", "json", "动态字段集合"],
        ["渠道商品", "销售属性", "sales_attributes", "json", "SKU 级销售规格"],
        ["渠道商品", "运费模板", "freight_template_id", "string", "按店铺配置可选值"],
        ["渠道商品", "上下架状态", "shelf_status", "enum", "上架 / 下架"],
        ["渠道商品", "发货时效", "delivery_sla", "string", "发货承诺"],
        ["商品详情页", "详情页 ID", "detail_page_id", "string", "详情页主键"],
        ["商品详情页", "所属渠道商品 ID", "channel_item_id", "string", "关联渠道商品"],
        ["商品详情页", "详情页名称", "detail_page_name", "string", "用于区分多个详情页记录"],
        ["商品详情页", "内容结构", "content_schema_json", "json", "详情页图文模块、排序和文案结构"],
        ["商品详情页", "当前使用标记", "is_current", "boolean", "标记当前作为商品详情使用的版本"],
        ["商品详情页", "复用素材 ID 列表", "reused_asset_ids", "json", "当前详情页引用的素材列表资产"],
        ["库存", "总库存", "total_stock", "number", "总库存"],
        ["库存", "可用库存", "available_stock", "number", "可用库存"],
        ["库存", "锁定库存", "locked_stock", "number", "锁定库存"],
        ["库存", "可售库存", "sellable_stock", "number", "可售库存"],
        ["导入任务", "模板版本", "template_version", "string", "模板版本号"],
        ["导入任务", "导入状态", "import_job_status", "enum", "导入任务状态"],
        ["素材", "素材类型", "asset_type", "enum", "主图 / 详情 / SKU 图"],
        ["素材", "素材路径", "asset_path", "string", "存储路径"],
        ["素材", "绑定对象类型", "bind_object_type", "enum", "product / channel_item / item_detail_page / channel_item_sku"],
        ["店铺配置", "类目字段版本", "profile_version", "string", "动态字段版本号"],
        ["店铺配置", "默认上下架状态", "default_shelf_status", "enum", "默认售卖状态"],
    ],
)}
"""
    write("docs/04-数据与接口层/03-字段字典.md", field_doc)
    register_doc("docs/04-数据与接口层/03-字段字典.md", "data", "current-effective")

    enum_doc = f"""
# {PROJECT}-状态与枚举字典

{meta_table([
    ("文档名称", "04-状态与枚举字典.md"),
    ("doc_id", "DOC-DATA-ENUMS"),
    ("doc_slug", "status-enum-dictionary"),
    ("文档层级", "04-数据与接口层"),
    ("文档对象", "状态与枚举"),
    ("上游文档", "../00-总览层/03-状态流转机制说明.md"),
    ("下游文档", "05-接口清单.md；../05-验收与测试层/04-权限与状态流转测试场景.md"),
    ("baseline_version", BASELINE_VERSION),
    ("doc_version", DOC_VERSION),
    ("doc_status", "current-effective"),
    ("更新时间", TODAY),
])}

## 1. 渠道枚举

{md_table(
    ["编码", "名称", "说明"],
    [
        ["TAOBAO", "淘宝", "当前支持导入与商品维护"],
        ["PINDUODUO", "拼多多", "当前支持导入与商品维护"],
        ["DOUYIN", "抖音", "当前支持导入与商品维护"],
        ["KUAISHOU", "快手", "当前支持导入与商品维护"],
    ],
)}

## 2. 关键状态

{md_table(
    ["分类", "枚举值", "说明"],
    [
        ["导入任务", "draft / validating / validate_failed / ready_to_execute / executing / completed / execute_failed", "导入状态流转"],
        ["渠道商品", "draft / ready / on_shelf / off_shelf / locked", "渠道商品售卖状态"],
        ["库存同步", "idle / pending / syncing / success / failed", "库存同步状态"],
        ["配置状态", "draft / active / inactive", "店铺配置状态"],
        ["素材类型", "main / detail / sku", "素材分类"],
    ],
)}
"""
    write("docs/04-数据与接口层/04-状态与枚举字典.md", enum_doc)
    register_doc("docs/04-数据与接口层/04-状态与枚举字典.md", "data", "current-effective")

    api_doc = f"""
# {PROJECT}-接口清单

{meta_table([
    ("文档名称", "05-接口清单.md"),
    ("doc_id", "DOC-DATA-APIS"),
    ("doc_slug", "api-catalog"),
    ("文档层级", "04-数据与接口层"),
    ("文档对象", "接口定义"),
    ("上游文档", "01-核心对象定义.md；03-字段字典.md；04-状态与枚举字典.md"),
    ("下游文档", "../03-页面设计层/；../05-验收与测试层/"),
    ("baseline_version", BASELINE_VERSION),
    ("doc_version", DOC_VERSION),
    ("doc_status", "current-effective"),
    ("更新时间", TODAY),
])}

## 1. 接口清单

{md_table(
    ["api_id", "接口", "方法", "主要归属", "版本范围", "当前状态", "用途"],
    [
        ["API-PROD-LIST-GET", "/api/products", "GET", "产品列表", "V1", "current-effective", "查询产品列表"],
        ["API-PROD-DETAIL-GET", "/api/products/{{product_id}}", "GET", "产品详情", "V1", "current-effective", "查询产品详情"],
        ["API-PROD-DETAIL-PUT", "/api/products/{{product_id}}", "PUT", "产品详情", "V1", "current-effective", "保存产品详情"],
        ["API-PROD-CREATE-POST", "/api/products", "POST", "新增产品", "增强", "enhancement-reserved", "手工创建产品"],
        ["API-IMPORT-TEMPLATE-PROFILE-GET", "/api/import-templates/profiles", "GET", "产品导入", "V1", "current-effective", "查询模板字段版本和可选项"],
        ["API-IMPORT-TEMPLATE-DOWNLOAD-GET", "/api/import-templates/download", "GET", "产品导入", "V1", "current-effective", "按渠道下载模板，店铺可选"],
        ["API-IMPORT-UPLOAD-POST", "/api/import-jobs/upload", "POST", "产品导入", "V1", "current-effective", "上传导入文件并创建任务"],
        ["API-IMPORT-VALIDATE-POST", "/api/import-jobs/{{import_job_id}}/validate", "POST", "产品导入", "V1", "current-effective", "执行校验"],
        ["API-IMPORT-EXECUTE-POST", "/api/import-jobs/{{import_job_id}}/execute", "POST", "产品导入", "V1", "current-effective", "确认导入"],
        ["API-IMPORT-LIST-GET", "/api/import-jobs", "GET", "导入记录", "V1", "current-effective", "查询导入任务列表"],
        ["API-MERCHANT-LINK-POST", "/api/import-jobs/{{import_job_id}}/merchant-links/resolve", "POST", "商家编码关联", "V1", "current-effective", "处理关联冲突或未命中结果"],
        ["API-ITEM-LIST-GET", "/api/channel-items", "GET", "渠道商品列表", "V1", "current-effective", "查询渠道商品列表"],
        ["API-ITEM-DETAIL-PAGE-LIST-GET", "/api/channel-item-detail-pages", "GET", "渠道商品详情页列表", "V1", "current-effective", "查询全量商品详情页记录"],
        ["API-ITEM-DETAIL-PAGE-DETAIL-GET", "/api/channel-item-detail-pages/{{detail_page_id}}", "GET", "渠道商品详情页列表", "V1", "current-effective", "查询详情页预览与素材摘要"],
        ["API-ITEM-DETAIL-PAGE-UPLOAD-POST", "/api/channel-item-detail-pages", "POST", "渠道商品详情页列表", "V1", "current-effective", "上传新详情页并归档素材"],
        ["API-ITEM-DETAIL-PAGE-PUT", "/api/channel-item-detail-pages/{{detail_page_id}}", "PUT", "渠道商品详情页列表", "V1", "current-effective", "保存详情页内容、当前使用状态和版本信息"],
        ["API-ITEM-DETAIL-PAGE-ASSET-LINK-POST", "/api/channel-item-detail-pages/{{detail_page_id}}/asset-links", "POST", "渠道商品详情页列表", "V1", "current-effective", "复用素材列表中的已有图片到详情页"],
        ["API-ITEM-DETAIL-GET", "/api/channel-items/{{channel_item_id}}", "GET", "渠道商品详情", "V1", "current-effective", "查询渠道商品详情"],
        ["API-ITEM-DETAIL-PUT", "/api/channel-items/{{channel_item_id}}", "PUT", "渠道商品详情", "V1", "current-effective", "保存渠道商品详情"],
        ["API-ITEM-CATEGORY-PROFILE-GET", "/api/channel-items/{{channel_item_id}}/category-profile", "GET", "类目动态适配", "V1", "current-effective", "按店铺和类目返回动态字段范围"],
        ["API-ITEM-BATCH-PREVIEW-POST", "/api/channel-items/batch-edit/preview", "POST", "批量修改", "增强", "enhancement-reserved", "预览批量命中结果"],
        ["API-ITEM-BATCH-EXECUTE-POST", "/api/channel-items/batch-edit/execute", "POST", "批量修改", "增强", "enhancement-reserved", "执行批量修改"],
        ["API-INV-LIST-GET", "/api/inventories", "GET", "库存列表", "V1", "current-effective", "查询库存列表"],
        ["API-INV-ADJUST-POST", "/api/inventories/{{inventory_id}}/adjust", "POST", "库存列表", "V1", "current-effective", "库存调整"],
        ["API-INV-SYNC-POST", "/api/inventories/{{inventory_id}}/sync", "POST", "库存列表", "V1", "current-effective", "触发库存同步"],
        ["API-INV-DETAIL-GET", "/api/inventories/{{inventory_id}}", "GET", "库存详情", "增强", "enhancement-reserved", "查询库存详情"],
        ["API-INV-ADJUST-LOG-GET", "/api/inventories/{{inventory_id}}/adjust-logs", "GET", "库存调整记录", "增强", "enhancement-reserved", "查询库存台账"],
        ["API-CONF-LIST-GET", "/api/shop-configs", "GET", "配置列表", "V1", "current-effective", "查询店铺配置列表"],
        ["API-CONF-DETAIL-GET", "/api/shop-configs/{{config_id}}", "GET", "店铺配置详情", "V1", "current-effective", "查询店铺配置详情"],
        ["API-CONF-DETAIL-PUT", "/api/shop-configs/{{config_id}}", "PUT", "店铺配置详情", "V1", "current-effective", "保存店铺配置详情"],
        ["API-ASSET-LIST-GET", "/api/assets", "GET", "素材列表", "增强", "enhancement-reserved", "查询素材列表"],
        ["API-ASSET-DETAIL-GET", "/api/assets/{{asset_id}}", "GET", "素材详情", "增强", "enhancement-reserved", "查询素材详情"],
        ["API-AUTH-ME-GET", "/api/auth/me", "GET", "权限与审计", "V1", "current-effective", "查询当前用户权限"],
        ["API-AUDIT-LIST-GET", "/api/audit-logs", "GET", "权限与审计", "V1", "current-effective", "查询审计日志，当前无独立页面"],
    ],
)}
"""
    write("docs/04-数据与接口层/05-接口清单.md", api_doc)
    register_doc("docs/04-数据与接口层/05-接口清单.md", "data", "current-effective")

    event_doc = f"""
# {PROJECT}-事件与日志清单

{meta_table([
    ("文档名称", "06-事件与日志清单.md"),
    ("doc_id", "DOC-DATA-EVENTS"),
    ("doc_slug", "event-log-catalog"),
    ("文档层级", "04-数据与接口层"),
    ("文档对象", "事件与日志"),
    ("上游文档", "../02-专题机制层/；05-接口清单.md"),
    ("下游文档", "../05-验收与测试层/03-异常流程测试场景.md"),
    ("baseline_version", BASELINE_VERSION),
    ("doc_version", DOC_VERSION),
    ("doc_status", "current-effective"),
    ("更新时间", TODAY),
])}

## 1. 事件与日志清单

{md_table(
    ["event_id", "触发动作", "生产对象", "消费方", "持久化位置", "当前状态"],
    [
        ["EVENT-IMPORT-UPLOADED", "上传导入文件", "OBJ-IMPORT-JOB", "导入校验服务", "import_job", "当前范围"],
        ["EVENT-IMPORT-VALIDATED", "导入校验完成", "OBJ-IMPORT-JOB", "导入记录页", "import_job", "当前范围"],
        ["EVENT-MERCHANT-LINK-RESOLVED", "商家编码关联完成", "OBJ-IMPORT-JOB-LINE", "导入记录页、产品详情", "import_job_line", "当前范围"],
        ["EVENT-IMPORT-EXECUTED", "导入执行完成", "OBJ-IMPORT-JOB", "产品列表、渠道商品列表、库存列表", "import_job", "当前范围"],
        ["EVENT-ITEM-SAVED", "保存渠道商品详情", "OBJ-CHANNEL-ITEM", "审计服务", "audit_log", "当前范围"],
        ["EVENT-ITEM-BATCH-EXECUTED", "执行批量修改", "OBJ-CHANNEL-ITEM", "审计服务", "audit_log", "增强预留"],
        ["EVENT-INVENTORY-ADJUSTED", "库存调整", "OBJ-INVENTORY", "库存台账", "inventory_log", "当前范围"],
        ["EVENT-INVENTORY-SYNC-REQUESTED", "触发库存同步", "OBJ-INVENTORY", "外部同步服务", "inventory_sync_task", "当前范围"],
        ["EVENT-SHOP-CONFIG-SAVED", "保存店铺配置", "OBJ-SHOP-CONFIG", "导入模板服务、详情页规则服务", "shop_config", "当前范围"],
    ],
)}
"""
    write("docs/04-数据与接口层/06-事件与日志清单.md", event_doc)
    register_doc("docs/04-数据与接口层/06-事件与日志清单.md", "data", "current-effective")

    table_doc = f"""
# {PROJECT}-表设计建议

{meta_table([
    ("文档名称", "07-表设计建议.md"),
    ("doc_id", "DOC-DATA-TABLES"),
    ("doc_slug", "table-design"),
    ("文档层级", "04-数据与接口层"),
    ("文档对象", "表设计建议"),
    ("上游文档", "01-核心对象定义.md；02-逻辑数据模型.md；03-字段字典.md"),
    ("下游文档", "研发实现"),
    ("baseline_version", BASELINE_VERSION),
    ("doc_version", DOC_VERSION),
    ("doc_status", "current-effective"),
    ("更新时间", TODAY),
])}

## 1. 建议表

{md_table(
    ["表名", "主键", "核心字段", "索引建议"],
    [
        ["product", "product_id", "product_name, isbn, merchant_code, status", "merchant_code 唯一索引；isbn 普通索引"],
        ["product_sku", "product_sku_id", "product_id, merchant_sku_code, spec_json", "product_id 普通索引"],
        ["channel_item", "channel_item_id", "product_id, channel_code, shop_code, item_title, category_code, shelf_status", "product_id + channel_code + shop_code 组合索引"],
        ["channel_item_sku", "channel_item_sku_id", "channel_item_id, sku_code, sales_attr_json", "channel_item_id 普通索引"],
        ["inventory", "inventory_id", "channel_item_sku_id, total_stock, available_stock, locked_stock, sellable_stock, sync_status", "channel_item_sku_id 唯一索引"],
        ["inventory_log", "inventory_log_id", "inventory_id, delta, before_stock, after_stock, reason, operator_id", "inventory_id + created_at 组合索引"],
        ["shop_config", "shop_config_id", "channel_code, shop_code, status, profile_version, default_shelf_status, default_delivery_sla", "channel_code + shop_code 组合索引"],
        ["category_profile", "profile_id", "shop_config_id, category_code, field_schema_json", "shop_config_id + category_code 组合索引"],
        ["import_job", "import_job_id", "channel_code, template_version, status, creator_id", "status + created_at 组合索引"],
        ["import_job_line", "line_id", "import_job_id, merchant_code, row_no, validate_result, execute_result", "import_job_id + row_no 组合索引"],
        ["asset", "asset_id", "asset_type, asset_path, bind_object_type, bind_object_id", "bind_object_type + bind_object_id 组合索引"],
        ["audit_log", "audit_log_id", "biz_type, biz_id, action_type, operator_id, created_at", "biz_type + biz_id 组合索引"],
    ],
)}
"""
    write("docs/04-数据与接口层/07-表设计建议.md", table_doc)
    register_doc("docs/04-数据与接口层/07-表设计建议.md", "data", "current-effective")

    asset_spec_doc = f"""
# {PROJECT}-图书素材装包规范

{meta_table([
    ("文档名称", "08-图书素材装包规范.md"),
    ("doc_id", "DOC-ASSET-PACKAGE"),
    ("doc_slug", "asset-package-spec"),
    ("文档层级", "04-数据与接口层"),
    ("文档对象", "素材装包规范"),
    ("上游文档", "../02-专题机制层/01-标准化导入机制.md；../03-页面设计层/平台电脑端/产品管理/04-产品导入页.md"),
    ("下游文档", "../03-页面设计层/平台电脑端/素材管理/；研发实现"),
    ("baseline_version", BASELINE_VERSION),
    ("doc_version", DOC_VERSION),
    ("doc_status", "current-effective"),
    ("更新时间", TODAY),
])}

## 1. 目录建议

```text
import-package/
  products.xlsx
  assets/
    main/
      {{merchant_code}}_main_01.jpg
    detail/
      {{merchant_code}}_detail_01.jpg
    sku/
      {{merchant_sku_code}}_sku_01.jpg
```

## 2. 规则说明

{bullet([
    "产品模板与素材包建议放在同一个导入压缩包中。",
    "主图、详情图、SKU 图命名应能通过商家编码或商家 SKU 编码直接建立关联。",
    "图片格式建议统一为 jpg/png，单图大小和总包大小由后端上传限制控制。",
    "当模板中图片字段填写外链地址时，仍建议保留本地素材包作为回溯依据。",
])}

## 3. 当前字段口径

{md_table(
    ["字段", "说明"],
    [
        ["主图", "产品或渠道商品主展示图"],
        ["详情", "详情图或详情内容素材"],
        ["SKU 图", "SKU 维度图片"],
    ],
)}
"""
    write("docs/04-数据与接口层/08-图书素材装包规范.md", asset_spec_doc)
    register_doc("docs/04-数据与接口层/08-图书素材装包规范.md", "data", "current-effective")


def build_test_docs() -> None:
    mvp_doc = f"""
# {PROJECT}-MVP验收标准

{meta_table([
    ("文档名称", "01-MVP验收标准.md"),
    ("doc_id", "DOC-TEST-MVP"),
    ("doc_slug", "mvp-acceptance"),
    ("文档层级", "05-验收与测试层"),
    ("文档对象", "MVP 验收标准"),
    ("上游文档", "../baselines/00-feature-list.md；../00-总览层/08-需求追踪矩阵.md"),
    ("下游文档", "02-主流程测试场景.md；03-异常流程测试场景.md"),
    ("baseline_version", BASELINE_VERSION),
    ("doc_version", DOC_VERSION),
    ("doc_status", "current-effective"),
    ("更新时间", TODAY),
])}

## 1. 必过标准

{md_table(
    ["编号", "验收项", "标准"],
    [
        ["ACC-001", "模板下载", "产品导入页可按渠道下载模板；店铺选填时能带出更精确模板字段。"],
        ["ACC-002", "导入闭环", "上传、校验、确认导入、导入记录回溯完整可用。"],
        ["ACC-003", "商家编码关联", "导入后能通过商家编码把产品与渠道商品归集。"],
        ["ACC-004", "渠道商品维护", "渠道商品详情可维护标题、价格、属性、运费模板、上下架状态和发货时效。"],
        ["ACC-005", "渠道商品详情页管理", "渠道商品详情页列表可查看全部渠道商品详情页数据，支持上传新详情页、编辑内容、复用已有素材；单个渠道商品最多 3 个详情页。"],
        ["ACC-006", "店铺级类目动态适配", "不同店铺/类目返回不同字段范围。"],
        ["ACC-007", "库存维护", "库存列表可查询、调整、触发同步并展示状态。"],
        ["ACC-008", "店铺配置", "配置列表和店铺配置详情可维护并影响导入模板与详情页规则。"],
    ],
)}
"""
    write("docs/05-验收与测试层/01-MVP验收标准.md", mvp_doc)
    register_doc("docs/05-验收与测试层/01-MVP验收标准.md", "test", "current-effective")

    main_cases = f"""
# {PROJECT}-主流程测试场景

{meta_table([
    ("文档名称", "02-主流程测试场景.md"),
    ("doc_id", "DOC-TEST-MAIN"),
    ("doc_slug", "main-test-cases"),
    ("文档层级", "05-验收与测试层"),
    ("文档对象", "主流程测试"),
    ("baseline_version", BASELINE_VERSION),
    ("doc_version", DOC_VERSION),
    ("doc_status", "current-effective"),
    ("更新时间", TODAY),
])}

{md_table(
    ["test_case_id", "主流程", "前置条件", "关键步骤", "预期结果"],
    [
        ["TC-MAIN-001", "产品列表查看", "存在产品数据", "进入产品列表并筛选", "列表正确展示并可进入详情"],
        ["TC-MAIN-002", "模板下载与上传校验", "已配置店铺规则", "选择渠道下载模板，上传文件并校验", "模板下载成功，校验结果正确返回"],
        ["TC-MAIN-003", "确认导入并查看记录", "导入任务校验通过", "确认导入并进入导入记录", "导入成功，记录页可查看结果"],
        ["TC-MAIN-004", "渠道商品列表查看", "存在渠道商品数据", "进入商品列表并筛选", "列表正确展示"],
        ["TC-MAIN-005", "渠道商品详情维护", "存在渠道商品且具备编辑权限", "修改字段并保存", "保存成功并回显最新数据"],
        ["TC-MAIN-006", "管理渠道商品详情页列表并编辑内容", "存在已导入渠道商品且具备详情页管理权限", "进入渠道商品详情页列表；按产品筛选；上传新详情页；编辑图文内容；复用已有素材并设为当前", "列表正确展示全部详情页数据；详情页内容编辑成功；同一素材可在多个商品详情页复用；单个渠道商品详情页数量不超过 3 条"],
        ["TC-MAIN-007", "库存调整与同步", "存在库存记录", "在库存列表调整库存并触发同步", "库存数更新，同步状态变化正确"],
        ["TC-MAIN-008", "配置列表查看", "存在配置数据", "进入配置列表筛选和查看详情", "列表正确展示，能进入详情"],
        ["TC-MAIN-009", "店铺配置保存", "具备配置编辑权限", "修改店铺配置并保存", "保存成功，后续导入模板字段口径生效"],
    ],
)}
"""
    write("docs/05-验收与测试层/02-主流程测试场景.md", main_cases)
    register_doc("docs/05-验收与测试层/02-主流程测试场景.md", "test", "current-effective")

    exception_cases = f"""
# {PROJECT}-异常流程测试场景

{meta_table([
    ("文档名称", "03-异常流程测试场景.md"),
    ("doc_id", "DOC-TEST-EXCEPTIONS"),
    ("doc_slug", "exception-test-cases"),
    ("文档层级", "05-验收与测试层"),
    ("文档对象", "异常流程测试"),
    ("baseline_version", BASELINE_VERSION),
    ("doc_version", DOC_VERSION),
    ("doc_status", "current-effective"),
    ("更新时间", TODAY),
])}

{md_table(
    ["test_case_id", "异常场景", "关键步骤", "预期结果"],
    [
        ["TC-EXC-001", "模板字段缺失", "上传缺字段模板并校验", "校验失败并返回缺失字段"],
        ["TC-EXC-002", "商家编码未命中", "导入含未知商家编码的数据", "导入记录页高亮未关联结果"],
        ["TC-EXC-003", "类目规则冲突", "切换到不兼容的店铺或类目并保存", "失效字段被清空并提示重新填写"],
        ["TC-EXC-004", "批量修改超限", "批量修改命中过大范围", "系统阻止执行并提示缩小范围"],
        ["TC-EXC-005", "库存同步失败", "触发库存同步后模拟外部失败", "列表显示失败原因并支持重试"],
        ["TC-EXC-006", "商品详情页上传解析失败", "在渠道商品详情页列表上传非法文件", "系统阻止创建详情页记录并返回失败原因"],
        ["TC-EXC-007", "单商品详情页数量超限", "某个渠道商品已存在 3 个详情页后继续新建", "系统阻止新增并提示“单个渠道商品最多 3 个详情页”"],
    ],
)}
"""
    write("docs/05-验收与测试层/03-异常流程测试场景.md", exception_cases)
    register_doc("docs/05-验收与测试层/03-异常流程测试场景.md", "test", "current-effective")

    permission_cases = f"""
# {PROJECT}-权限与状态流转测试场景

{meta_table([
    ("文档名称", "04-权限与状态流转测试场景.md"),
    ("doc_id", "DOC-TEST-PERMISSIONS"),
    ("doc_slug", "permission-state-test-cases"),
    ("文档层级", "05-验收与测试层"),
    ("文档对象", "权限与状态流转测试"),
    ("baseline_version", BASELINE_VERSION),
    ("doc_version", DOC_VERSION),
    ("doc_status", "current-effective"),
    ("更新时间", TODAY),
])}

{md_table(
    ["test_case_id", "场景", "验证点"],
    [
        ["TC-PERM-001", "无导入权限访问产品导入页", "菜单不可见或进入后无权限提示"],
        ["TC-PERM-002", "无编辑权限访问渠道商品详情页", "字段只读且保存按钮隐藏"],
        ["TC-PERM-003", "无详情页编辑权限访问渠道商品详情页列表页", "列表可查看，但上传、编辑、设为当前和素材复用入口隐藏或接口返回无权限"],
        ["TC-STATE-001", "导入任务状态流转", "draft -> validating -> ready_to_execute -> executing -> completed"],
        ["TC-STATE-002", "库存同步状态流转", "idle -> pending -> syncing -> success/failed"],
        ["TC-STATE-003", "店铺配置状态流转", "draft -> active -> inactive"],
        ["TC-STATE-004", "商品详情页状态流转", "history/current 切换正确；同一 channel_item_id 同时最多一条 current，且详情页总数不超过 3 条"],
    ],
)}
"""
    write("docs/05-验收与测试层/04-权限与状态流转测试场景.md", permission_cases)
    register_doc("docs/05-验收与测试层/04-权限与状态流转测试场景.md", "test", "current-effective")

    regression_doc = f"""
# {PROJECT}-回归范围

{meta_table([
    ("文档名称", "05-回归范围.md"),
    ("doc_id", "DOC-TEST-REGRESSION"),
    ("doc_slug", "regression-scope"),
    ("文档层级", "05-验收与测试层"),
    ("文档对象", "回归范围"),
    ("baseline_version", BASELINE_VERSION),
    ("doc_version", DOC_VERSION),
    ("doc_status", "current-effective"),
    ("更新时间", TODAY),
])}

## 1. 必回归页面

{bullet([
    "产品列表、产品详情、产品导入、导入记录",
    "渠道商品列表、渠道商品详情页列表、渠道商品详情",
    "库存列表",
    "配置列表、店铺配置详情",
])}

## 2. 条件性回归

{bullet([
    "新增产品、批量修改、库存详情、库存调整记录、素材管理页面在进入当前迭代时纳入回归。",
    "候选归档页面不纳入当前回归。",
])}

## 3. 必回归接口

{bullet([
    "导入模板下载、导入上传/校验/执行、导入记录",
    "渠道商品详情读取/保存、类目 profile 查询、商品详情页列表/详情/上传/保存/素材复用",
    "库存列表、库存调整、库存同步",
    "配置列表、配置详情读取/保存",
])}
"""
    write("docs/05-验收与测试层/05-回归范围.md", regression_doc)
    register_doc("docs/05-验收与测试层/05-回归范围.md", "test", "current-effective")


def build_delivery_index() -> None:
    rows = [
        [
            item["artifact_id"],
            item["artifact_name"],
            item["file_path"],
            item["artifact_type"],
            item["current_version"],
            item["doc_status"],
            item["baseline_version"],
            item["supersedes"],
            item["archive_path"],
            item["owner"],
        ]
        for item in sorted(DOC_MANIFEST, key=lambda x: x["file_path"])
    ]
    doc = f"""
# {PROJECT}-项目交付索引与当前有效版本清单

{meta_table([
    ("文档名称", "07-项目交付索引与当前有效版本清单.md"),
    ("doc_id", "DOC-DELIVERY-INDEX"),
    ("doc_slug", "delivery-index"),
    ("文档层级", "00-总览层"),
    ("文档对象", "交付索引"),
    ("上游文档", "../../product_agent_standards/14_delivery_index_spec.md；../baselines/99-baseline-change-log.md"),
    ("下游文档", "全部当前项目文档"),
    ("baseline_version", BASELINE_VERSION),
    ("doc_version", DOC_VERSION),
    ("doc_status", "current-effective"),
    ("更新时间", TODAY),
])}

## 1. 当前有效说明

- `current-effective` 和 `draft-review-ready` 视为当前有效文档集合。
- `enhancement-reserved` 视为增强底稿，当前不作为 MVP 阻断范围。
- `archive-candidate` 视为候选归档文件，仅保留路径与历史上下文。

## 2. 交付索引

{md_table(
    ["artifact_id", "artifact_name", "file_path", "artifact_type", "current_version", "doc_status", "baseline_version", "supersedes", "archive_path", "owner"],
    rows,
)}
"""
    write("docs/00-总览层/07-项目交付索引与当前有效版本清单.md", doc)


def main() -> None:
    build_baseline_docs()
    build_overview_docs()
    build_terminal_docs()
    build_mechanism_docs()
    build_page_design_docs()
    build_data_docs()
    build_test_docs()
    build_delivery_index()


if __name__ == "__main__":
    main()
