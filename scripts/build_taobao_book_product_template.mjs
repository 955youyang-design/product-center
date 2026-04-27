import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const outputDir = process.env.TEMPLATE_OUTPUT_DIR
  ? path.resolve(process.env.TEMPLATE_OUTPUT_DIR)
  : path.join(projectRoot, "outputs", "taobao_book_product_template");
const outputFileName = process.env.TEMPLATE_OUTPUT_FILE_NAME || "图书多渠道商品数据录入模板.xlsx";
const templateOutputPath = path.join(outputDir, outputFileName);
const writePreviewImages = process.env.TEMPLATE_WRITE_PREVIEWS !== "0";

const dataRowStart = 7;
const dataRowEnd = 106;

const fields = [
  { group: "基础信息", name: "线上商品ID", required: true, note: "线上店铺商品的原始商品ID；同一渠道同一店铺内唯一。同一商品的多个 SKU 行必须填写相同线上商品ID。" },
  { group: "基础信息", name: "店铺ID", required: true, note: "线上店铺数据导入时用于定位店铺；同一客户多店铺时必须填写。" },
  { group: "基础信息", name: "店铺名称", required: true, note: "线上店铺数据导入时用于人工核对店铺归属；建议与店铺配置中的名称一致。" },
  { group: "基础信息", name: "渠道", required: true, note: "线上商品来源渠道；可选：淘宝、抖店。" },
  { group: "基础信息", name: "淘宝类目ID", required: true, note: "淘宝叶子类目ID；示例为假值，可由中台类目映射或线上商品数据回填。" },
  { group: "基础信息", name: "淘宝类目全称", required: true, note: "淘宝类目完整路径；示例为假值，用于人工核对和导入日志展示。" },
  { group: "基础信息", name: "宝贝标题", required: true, note: "最多 60 个汉字（120 字符）。" },
  { group: "基础信息", name: "导购标题", required: false, note: "最多 15 个汉字（30 字符）。" },
  { group: "基础信息", name: "抖店类目ID", required: false, note: "抖店叶子类目ID；不填时由中台按类目映射推断。科幻小说示例：1000006731。" },
  { group: "基础信息", name: "抖店类目路径", required: false, note: "抖店类目路径；用于人工核对和导入日志展示。" },

  { group: "类目属性", name: "书名", required: true, note: "淘宝类目属性必填。" },
  { group: "类目属性", name: "ISBN编号", required: true, note: "淘宝类目属性必填，建议填写 13 位 ISBN。" },
  { group: "类目属性", name: "主题", required: false, note: "按实际主题填写。" },
  { group: "类目属性", name: "书籍内容版本", required: false, note: "如下拉值不适用，可直接填写平台允许值。" },
  { group: "类目属性", name: "版本", required: false, note: "抖店图书属性，可选：套装、平装、精装。" },
  { group: "类目属性", name: "内文用纸材质", required: false, note: "如下拉值不适用，可直接填写平台允许值。" },
  { group: "类目属性", name: "出版时间", required: true, note: "抖店图书必填，建议格式 YYYY-MM-DD；淘宝可按平台口径截取到 YYYY-MM。" },
  { group: "类目属性", name: "版次", required: false, note: "抖店图书可填，示例：1。" },
  { group: "类目属性", name: "印次", required: false, note: "抖店图书可填，示例：1。" },
  { group: "类目属性", name: "包册数", required: false, note: "数字，如 1、3、10。" },
  { group: "类目属性", name: "品牌", required: true, note: "抖店图书必填；若平台品牌库未命中，中台需按店铺品牌映射或无品牌策略处理。" },
  { group: "类目属性", name: "学科版本", required: false, note: "教材、教辅类可填写。" },
  { group: "类目属性", name: "获奖信息", required: false, note: "按实际获奖信息填写。" },
  { group: "类目属性", name: "适用学龄段", required: false, note: "按平台枚举或实际适用人群填写。" },
  { group: "类目属性", name: "页数", required: false, note: "数字。" },
  { group: "类目属性", name: "是否是套装", required: false, note: "是/否。" },
  { group: "类目属性", name: "正：副书名", required: false, note: "副书名。" },
  { group: "类目属性", name: "定价", required: true, note: "抖店图书必填，码洋/书籍定价，单位元。" },
  { group: "类目属性", name: "出版社名称", required: true, note: "抖店图书必填，出版社全称；重庆出版社在抖店的值ID为 62228。" },
  { group: "类目属性", name: "抖店出版社值ID", required: false, note: "中台可按出版社名称映射；如需人工指定，重庆出版社=62228。" },
  { group: "类目属性", name: "作者", required: false, note: "多个作者可用中文顿号或分号分隔。" },
  { group: "类目属性", name: "作者地区", required: false, note: "按平台枚举或实际地区填写。" },
  { group: "类目属性", name: "译者", required: false, note: "多个译者可用中文顿号或分号分隔。" },
  { group: "类目属性", name: "编者", required: false, note: "多个编者可用中文顿号或分号分隔。" },
  { group: "类目属性", name: "开本", required: false, note: "如 16开、32开。" },

  { group: "SKU信息", name: "线上SKU ID", required: true, note: "线上店铺 SKU 的原始 SKU ID；无规格单 SKU 商品可填 DEFAULT 或平台返回的默认 SKU 标识。" },
  { group: "SKU信息", name: "SKU编码", required: true, note: "商家侧 SKU 编码；同一线上商品ID下不可重复。" },
  { group: "SKU信息", name: "SKU规格", required: true, note: "填写规格名和值，如 装帧=平装 或 版本=精装套装。" },
  { group: "SKU信息", name: "SKU价格", required: true, note: "SKU 实际售卖价，单位元；同一商品下不同 SKU 可不同价。" },
  { group: "SKU信息", name: "SKU库存", required: true, note: "SKU 级库存，单位件，必须为非负整数。" },
  { group: "SKU信息", name: "SKU重量(g)", required: false, note: "抖店 SKU 物流信息建议填写，导入时映射为 delivery_infos.weight，单位克。" },
  { group: "SKU信息", name: "SKU条形码", required: false, note: "如有可填写 SKU 级条形码。" },
  { group: "销售信息", name: "一口价", required: true, note: "淘宝商品级一口价，单位元；有多个 SKU 时建议填写该商品的基础价或最低 SKU 价。" },
  { group: "销售信息", name: "总库存", required: true, note: "商品级总库存；有多个 SKU 时建议填写该商品全部 SKU 库存合计。" },
  { group: "销售信息", name: "购买须知", required: false, note: "最多 60 字符。" },
  { group: "销售信息", name: "商家编码", required: false, note: "平台页面未标星；中台归集建议填写。" },
  { group: "销售信息", name: "商品条形码", required: false, note: "如有可填写。" },
  { group: "销售信息", name: "多件优惠", required: true, note: "平台页面标星；可选择不启用或填写活动规则。" },
  { group: "销售信息", name: "库存扣减方式", required: true, note: "拍下减库存/付款减库存。" },
  { group: "销售信息", name: "上架时间", required: true, note: "立即上架/定时上架/放入仓库。" },
  { group: "销售信息", name: "定时上架时间", required: false, note: "仅上架时间选择定时上架时填写，建议格式 YYYY-MM-DD HH:mm。" },

  { group: "物流服务", name: "发货时间", required: true, note: "今日发/24小时内发货/48小时内发货/大于48小时发货。" },
  { group: "物流服务", name: "发货地范围", required: true, note: "大陆及港澳台/其他国家或地区。" },
  { group: "物流服务", name: "发货地设置", required: true, note: "单一发货地/多发货地。" },
  { group: "物流服务", name: "发货地省市", required: true, note: "如 安徽/合肥。" },
  { group: "物流服务", name: "提取方式", required: true, note: "平台页面默认为使用物流配送。" },
  { group: "物流服务", name: "运费模板", required: true, note: "填写店铺可用运费模板名称。" },
  { group: "物流服务", name: "区域限售", required: false, note: "不设置商品维度区域限售模板/选择商品维度区域限售模板。" },
  { group: "物流服务", name: "售后服务", required: false, note: "如保修服务。" },
  { group: "物流服务", name: "服务承诺", required: false, note: "该类商品通常要求支持七天退货，可保留默认值。" },
  { group: "备注", name: "备注", required: false, note: "内部协作用，不导入平台时可留空。" },
];

const commonRequiredFields = new Set([
  "线上商品ID",
  "店铺ID",
  "店铺名称",
  "渠道",
  "宝贝标题",
  "书名",
  "ISBN编号",
  "线上SKU ID",
  "SKU编码",
  "SKU规格",
  "SKU价格",
  "SKU库存",
  "一口价",
  "总库存",
]);

const taobaoRequiredFields = new Set([
  ...commonRequiredFields,
  "淘宝类目ID",
  "淘宝类目全称",
  "多件优惠",
  "库存扣减方式",
  "上架时间",
  "发货时间",
  "发货地范围",
  "发货地设置",
  "发货地省市",
  "提取方式",
  "运费模板",
]);

const doudianRequiredFields = new Set([
  ...commonRequiredFields,
  "抖店类目ID",
  "抖店类目路径",
  "出版时间",
  "品牌",
  "定价",
  "出版社名称",
  "库存扣减方式",
  "上架时间",
  "发货时间",
  "发货地省市",
  "提取方式",
  "运费模板",
]);

fields.forEach((field) => {
  field.required = commonRequiredFields.has(field.name);
});

const originalFieldOrder = new Map(fields.map((field, index) => [field.name, index]));
const platformRequiredFields = new Set(
  [...taobaoRequiredFields, ...doudianRequiredFields].filter((fieldName) => !commonRequiredFields.has(fieldName)),
);
const fieldPriority = (field) => {
  if (commonRequiredFields.has(field.name)) return 0;
  if (platformRequiredFields.has(field.name)) return 1;
  return 2;
};
fields.sort((a, b) => fieldPriority(a) - fieldPriority(b) || originalFieldOrder.get(a.name) - originalFieldOrder.get(b.name));
fields.forEach((field) => {
  if (commonRequiredFields.has(field.name)) {
    field.group = "通用必填";
  } else if (platformRequiredFields.has(field.name)) {
    field.group = "渠道必填";
  }
});

const options = {
  "渠道": ["淘宝", "抖店"],
  "版本": ["套装", "平装", "精装"],
  "书籍内容版本": ["完整版", "节选版", "注音版", "双语版", "修订版", "典藏版"],
  "内文用纸材质": ["胶版纸", "轻型纸", "铜版纸", "纯质纸", "其他"],
  "是否是套装": ["否", "是"],
  "作者地区": ["中国大陆", "中国香港", "中国台湾", "日本", "美国", "英国", "法国", "德国", "其他"],
  "多件优惠": ["不启用", "满2件打折", "满3件打折", "自定义"],
  "库存扣减方式": ["拍下减库存", "付款减库存"],
  "上架时间": ["立即上架", "定时上架", "放入仓库"],
  "发货时间": ["今日发", "24小时内发货", "48小时内发货", "大于48小时发货"],
  "发货地范围": ["大陆及港澳台", "其他国家或地区"],
  "发货地设置": ["单一发货地", "多发货地"],
  "提取方式": ["使用物流配送"],
  "区域限售": ["不设置商品维度区域限售模板", "选择商品维度区域限售模板"],
  "售后服务": ["不勾选", "保修服务"],
  "服务承诺": ["七天退货"],
};

const examples = {
  线上商品ID: "TB-ON-100001",
  店铺ID: "SHOP-TB-001",
  店铺名称: "三味书屋旗舰店",
  渠道: "淘宝",
  淘宝类目ID: "50000123",
  淘宝类目全称: "书籍/杂志/报纸>>文学>>文学作品集",
  宝贝标题: "三体 刘慈欣 科幻文学作品集 正版图书",
  导购标题: "雨果奖经典科幻",
  抖店类目ID: "1000006731",
  抖店类目路径: "书籍/杂志/报纸>小说>科幻小说",
  书名: "中国科幻基石丛书 三体",
  ISBN编号: "9787104551003",
  书籍内容版本: "完整版",
  版本: "套装",
  内文用纸材质: "胶版纸",
  出版时间: "2008-01-01",
  版次: "1",
  包册数: "3",
  是否是套装: "是",
  品牌: "科幻世界",
  定价: "93.00",
  出版社名称: "重庆出版社",
  抖店出版社值ID: "62228",
  作者: "刘慈欣",
  作者地区: "中国大陆",
  开本: "16开",
  "线上SKU ID": "TB-SKU-100001-01",
  SKU编码: "SANTI-9787104551003-3BOOKS",
  SKU规格: "版本=三体全集 全3册",
  SKU价格: "93.00",
  SKU库存: "10",
  "SKU重量(g)": "1500",
  一口价: "93.00",
  总库存: "10",
  商家编码: "SANTI-9787104551003",
  多件优惠: "不启用",
  库存扣减方式: "拍下减库存",
  上架时间: "立即上架",
  发货时间: "48小时内发货",
  发货地范围: "大陆及港澳台",
  发货地设置: "单一发货地",
  发货地省市: "安徽/合肥",
  提取方式: "使用物流配送",
  运费模板: "发货模板",
  区域限售: "不设置商品维度区域限售模板",
  服务承诺: "七天退货",
};

const sampleRows = [
  {
    线上商品ID: "TB-ON-100001",
    店铺ID: "SHOP-TB-001",
    店铺名称: "三味书屋旗舰店",
    渠道: "淘宝",
    淘宝类目ID: "50000123",
    淘宝类目全称: "书籍/杂志/报纸>>文学>>文学作品集",
    宝贝标题: "三体 刘慈欣 科幻文学作品集 正版图书",
    导购标题: "雨果奖经典科幻",
    抖店类目ID: "1000006731",
    抖店类目路径: "书籍/杂志/报纸>小说>科幻小说",
    书名: "三体",
    ISBN编号: "9787536692930",
    书籍内容版本: "完整版",
    版本: "平装",
    内文用纸材质: "胶版纸",
    出版时间: "2008-01-01",
    版次: "1",
    包册数: 1,
    品牌: "科幻世界",
    是否是套装: "否",
    定价: 23.0,
    出版社名称: "重庆出版社",
    抖店出版社值ID: "62228",
    作者: "刘慈欣",
    作者地区: "中国大陆",
    开本: "16开",
    "线上SKU ID": "TB-SKU-100001-01",
    SKU编码: "TB-BOOK-0001-SKU01",
    SKU规格: "装帧=平装",
    SKU价格: 19.8,
    SKU库存: 60,
    "SKU重量(g)": 500,
    一口价: 19.8,
    总库存: 100,
    商家编码: "TB-BOOK-0001",
    多件优惠: "不启用",
    库存扣减方式: "拍下减库存",
    上架时间: "立即上架",
    发货时间: "48小时内发货",
    发货地范围: "大陆及港澳台",
    发货地设置: "单一发货地",
    发货地省市: "安徽/合肥",
    提取方式: "使用物流配送",
    运费模板: "发货模板",
    区域限售: "不设置商品维度区域限售模板",
    服务承诺: "七天退货",
  },
  {
    线上商品ID: "TB-ON-100001",
    店铺ID: "SHOP-TB-001",
    店铺名称: "三味书屋旗舰店",
    渠道: "淘宝",
    淘宝类目ID: "50000123",
    淘宝类目全称: "书籍/杂志/报纸>>文学>>文学作品集",
    宝贝标题: "三体 刘慈欣 科幻文学作品集 正版图书",
    导购标题: "雨果奖经典科幻",
    抖店类目ID: "1000006731",
    抖店类目路径: "书籍/杂志/报纸>小说>科幻小说",
    书名: "三体",
    ISBN编号: "9787536692930",
    书籍内容版本: "完整版",
    版本: "精装",
    内文用纸材质: "胶版纸",
    出版时间: "2008-01-01",
    版次: "1",
    包册数: 1,
    品牌: "科幻世界",
    是否是套装: "否",
    定价: 23.0,
    出版社名称: "重庆出版社",
    抖店出版社值ID: "62228",
    作者: "刘慈欣",
    作者地区: "中国大陆",
    开本: "16开",
    "线上SKU ID": "TB-SKU-100001-02",
    SKU编码: "TB-BOOK-0001-SKU02",
    SKU规格: "装帧=精装",
    SKU价格: 35.0,
    SKU库存: 40,
    "SKU重量(g)": 700,
    一口价: 19.8,
    总库存: 100,
    商家编码: "TB-BOOK-0001",
    多件优惠: "不启用",
    库存扣减方式: "拍下减库存",
    上架时间: "立即上架",
    发货时间: "48小时内发货",
    发货地范围: "大陆及港澳台",
    发货地设置: "单一发货地",
    发货地省市: "安徽/合肥",
    提取方式: "使用物流配送",
    运费模板: "发货模板",
    区域限售: "不设置商品维度区域限售模板",
    服务承诺: "七天退货",
  },
  {
    线上商品ID: "TB-ON-100002",
    店铺ID: "SHOP-TB-002",
    店铺名称: "阅享图书专营店",
    渠道: "淘宝",
    淘宝类目ID: "50000123",
    淘宝类目全称: "书籍/杂志/报纸>>文学>>文学作品集",
    宝贝标题: "人类简史 尤瓦尔赫拉利 历史通识读物",
    导购标题: "全球畅销社科",
    书名: "人类简史",
    ISBN编号: "9787508647357",
    书籍内容版本: "完整版",
    内文用纸材质: "轻型纸",
    出版时间: "2014-11",
    包册数: 1,
    是否是套装: "否",
    定价: 68.0,
    出版社名称: "中信出版社",
    作者: "尤瓦尔·赫拉利",
    作者地区: "其他",
    译者: "林俊宏",
    开本: "16开",
    "线上SKU ID": "TB-SKU-100002-01",
    SKU编码: "TB-BOOK-0002-SKU01",
    SKU规格: "版本=普通版",
    SKU价格: 49.0,
    SKU库存: 80,
    一口价: 49.0,
    总库存: 110,
    商家编码: "TB-BOOK-0002",
    多件优惠: "满2件打折",
    库存扣减方式: "拍下减库存",
    上架时间: "立即上架",
    发货时间: "48小时内发货",
    发货地范围: "大陆及港澳台",
    发货地设置: "单一发货地",
    发货地省市: "安徽/合肥",
    提取方式: "使用物流配送",
    运费模板: "发货模板",
    区域限售: "不设置商品维度区域限售模板",
    服务承诺: "七天退货",
  },
  {
    线上商品ID: "TB-ON-100002",
    店铺ID: "SHOP-TB-002",
    店铺名称: "阅享图书专营店",
    渠道: "淘宝",
    淘宝类目ID: "50000123",
    淘宝类目全称: "书籍/杂志/报纸>>文学>>文学作品集",
    宝贝标题: "人类简史 尤瓦尔赫拉利 历史通识读物",
    导购标题: "全球畅销社科",
    书名: "人类简史",
    ISBN编号: "9787508647357",
    书籍内容版本: "完整版",
    内文用纸材质: "轻型纸",
    出版时间: "2014-11",
    包册数: 1,
    是否是套装: "否",
    定价: 68.0,
    出版社名称: "中信出版社",
    作者: "尤瓦尔·赫拉利",
    作者地区: "其他",
    译者: "林俊宏",
    开本: "16开",
    "线上SKU ID": "TB-SKU-100002-02",
    SKU编码: "TB-BOOK-0002-SKU02",
    SKU规格: "版本=纪念版",
    SKU价格: 89.0,
    SKU库存: 30,
    一口价: 49.0,
    总库存: 110,
    商家编码: "TB-BOOK-0002",
    多件优惠: "满2件打折",
    库存扣减方式: "拍下减库存",
    上架时间: "立即上架",
    发货时间: "48小时内发货",
    发货地范围: "大陆及港澳台",
    发货地设置: "单一发货地",
    发货地省市: "安徽/合肥",
    提取方式: "使用物流配送",
    运费模板: "发货模板",
    区域限售: "不设置商品维度区域限售模板",
    服务承诺: "七天退货",
  },
];

sampleRows.unshift(
  {
    ...examples,
    线上商品ID: "DD-ON-100001",
    店铺ID: "SHOP-DD-001",
    店铺名称: "抖店测试图书店",
    渠道: "抖店",
    淘宝类目ID: "",
    淘宝类目全称: "",
    宝贝标题: "中国科幻基石丛书 三体 刘慈欣 正版全3册",
    导购标题: "三体全集全3册",
    抖店类目ID: "1000006731",
    抖店类目路径: "书籍/杂志/报纸>小说>科幻小说",
    书名: "中国科幻基石丛书 三体",
    ISBN编号: "9787104551003",
    版本: "套装",
    出版时间: "2008-01-01",
    版次: "1",
    包册数: 3,
    品牌: "科幻世界",
    是否是套装: "是",
    定价: 93.0,
    出版社名称: "重庆出版社",
    抖店出版社值ID: "62228",
    作者: "刘慈欣",
    作者地区: "中国大陆",
    开本: "16开",
    "线上SKU ID": "DD-SKU-100001-01",
    SKU编码: "SANTI-9787104551003-SET",
    SKU规格: "版本=三体全集 全3册",
    SKU价格: 93.0,
    SKU库存: 10,
    "SKU重量(g)": 1500,
    一口价: 93.0,
    总库存: 18,
    商家编码: "SANTI-9787104551003",
  },
  {
    ...examples,
    线上商品ID: "DD-ON-100001",
    店铺ID: "SHOP-DD-001",
    店铺名称: "抖店测试图书店",
    渠道: "抖店",
    淘宝类目ID: "",
    淘宝类目全称: "",
    宝贝标题: "中国科幻基石丛书 三体 刘慈欣 正版全3册",
    导购标题: "三体全集精装",
    抖店类目ID: "1000006731",
    抖店类目路径: "书籍/杂志/报纸>小说>科幻小说",
    书名: "中国科幻基石丛书 三体",
    ISBN编号: "9787104551003",
    版本: "精装",
    出版时间: "2008-01-01",
    版次: "1",
    包册数: 3,
    品牌: "科幻世界",
    是否是套装: "是",
    定价: 128.0,
    出版社名称: "重庆出版社",
    抖店出版社值ID: "62228",
    作者: "刘慈欣",
    作者地区: "中国大陆",
    开本: "16开",
    "线上SKU ID": "DD-SKU-100001-02",
    SKU编码: "SANTI-9787104551003-HC",
    SKU规格: "版本=三体全集 精装版",
    SKU价格: 128.0,
    SKU库存: 8,
    "SKU重量(g)": 2100,
    一口价: 93.0,
    总库存: 18,
    商家编码: "SANTI-9787104551003",
  },
);

const colLetter = (index) => {
  let n = index + 1;
  let out = "";
  while (n > 0) {
    const rem = (n - 1) % 26;
    out = String.fromCharCode(65 + rem) + out;
    n = Math.floor((n - 1) / 26);
  }
  return out;
};

const range = (startCol, startRow, endCol, endRow = startRow) =>
  `${colLetter(startCol)}${startRow}:${colLetter(endCol)}${endRow}`;

const setRowValues = (sheet, row, values) => {
  sheet.getRange(range(0, row, values.length - 1)).values = [values];
};

const applyBaseFormat = (sheet, address) => {
  sheet.getRange(address).format = {
    font: { name: "Aptos", size: 10, color: "#1F2937" },
    verticalAlignment: "center",
    wrapText: true,
  };
};

const workbook = Workbook.create();
const dataSheet = workbook.worksheets.getOrAdd("商品数据录入", { renameFirstIfOnlyNewSpreadsheet: true });
const fieldSheet = workbook.worksheets.add("字段说明");
const dictSheet = workbook.worksheets.add("选项字典");
const taobaoSheet = workbook.worksheets.add("淘宝字段映射");
const doudianSheet = workbook.worksheets.add("抖店字段映射");

const lastColIndex = fields.length - 1;
const lastCol = colLetter(lastColIndex);
const fullUsedRange = `A1:${lastCol}${dataRowEnd}`;

dataSheet.showGridLines = false;
fieldSheet.showGridLines = false;
dictSheet.showGridLines = false;
taobaoSheet.showGridLines = false;
doudianSheet.showGridLines = false;

dataSheet.getRange(`A1:${lastCol}1`).merge();
dataSheet.getRange("A1").values = [["图书多渠道商品数据录入模板"]];
dataSheet.getRange("A1").format = {
  fill: "#1F4E78",
  font: { name: "Aptos", size: 16, bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
};

dataSheet.getRange(`A2:${lastCol}2`).merge();
dataSheet.getRange("A2").values = [["适用：线上店铺图书商品导入；一行录入一个 SKU。线上商品ID 是店铺商品镜像的主关联键，同一线上商品的多个 SKU 行填写相同线上商品ID；产品ID由系统导入归集后生成。"]];
dataSheet.getRange("A2").format = {
  fill: "#EAF2F8",
  font: { name: "Aptos", size: 10, color: "#1F2937" },
  horizontalAlignment: "left",
  verticalAlignment: "center",
};

dataSheet.getRange("A3").values = [["当前类目 *"]];
dataSheet.getRange("B3:F3").merge();
dataSheet.getRange("B3").values = [["图书；示例：抖店 书籍/杂志/报纸>>小说>>科幻小说"]];
dataSheet.getRange("G3").values = [["渠道"]];
dataSheet.getRange("H3").values = [["淘宝 / 抖店"]];
dataSheet.getRange("I3").values = [["默认店铺"]];
dataSheet.getRange("J3:L3").merge();
dataSheet.getRange("J3").values = [["以明细行店铺ID/店铺名称为准"]];
dataSheet.getRange("A3:J3").format = {
  fill: "#F8FAFC",
  font: { name: "Aptos", size: 10, bold: true, color: "#1F2937" },
  borders: { preset: "outside", style: "thin", color: "#CBD5E1" },
  verticalAlignment: "center",
};
dataSheet.getRange("A3").format.font = { name: "Aptos", size: 10, bold: true, color: "#C00000" };

dataSheet.getRange(`A4:${lastCol}4`).merge();
dataSheet.getRange("A4").values = [["填写说明：红色 * 为通用必填，橙色 △ 为按渠道必填；前两段已集中必填字段。线上商品唯一键建议使用 渠道+店铺ID+线上商品ID；线上 SKU 唯一键建议使用 渠道+店铺ID+线上商品ID+线上SKU ID。"]];
dataSheet.getRange("A4").format = {
  fill: "#FFF7ED",
  font: { name: "Aptos", size: 10, color: "#9A3412" },
  verticalAlignment: "center",
};

const groupRow = [];
const headerRow = [];
for (const field of fields) {
  groupRow.push(field.group);
  headerRow.push(field.required ? `${field.name} *` : platformRequiredFields.has(field.name) ? `${field.name} △` : field.name);
}
setRowValues(dataSheet, 5, groupRow);
setRowValues(dataSheet, 6, headerRow);

let groupStart = 0;
while (groupStart < fields.length) {
  let groupEnd = groupStart;
  while (groupEnd + 1 < fields.length && fields[groupEnd + 1].group === fields[groupStart].group) {
    groupEnd += 1;
  }
  if (groupEnd > groupStart) dataSheet.getRange(range(groupStart, 5, groupEnd)).merge();
  const groupFill = fields[groupStart].group === "通用必填" ? "#FCE4D6" :
    fields[groupStart].group === "渠道必填" ? "#FFF2CC" :
    fields[groupStart].group === "类目属性" ? "#D9EAD3" :
    fields[groupStart].group === "SKU信息" ? "#FCE4D6" :
      fields[groupStart].group === "销售信息" ? "#DDEBF7" :
      fields[groupStart].group === "物流服务" ? "#EADCF8" :
        fields[groupStart].group === "备注" ? "#E5E7EB" : "#E2F0D9";
  dataSheet.getRange(range(groupStart, 5, groupEnd)).format = {
    fill: groupFill,
    font: { name: "Aptos", size: 10, bold: true, color: "#1F2937" },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    borders: { preset: "outside", style: "thin", color: "#94A3B8" },
  };
  groupStart = groupEnd + 1;
}

const blankRows = Array.from({ length: dataRowEnd - dataRowStart + 1 }, () => Array(fields.length).fill(null));
dataSheet.getRange(`A${dataRowStart}`).values = blankRows;
dataSheet.getRange(`A${dataRowStart}`).values = sampleRows.map((row) =>
  fields.map((field) => row[field.name] ?? null),
);
applyBaseFormat(dataSheet, fullUsedRange);
dataSheet.getRange(`A6:${lastCol}6`).format = {
  fill: "#E5E7EB",
  font: { name: "Aptos", size: 10, bold: true, color: "#111827" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
  borders: { preset: "outside", style: "thin", color: "#94A3B8" },
};

fields.forEach((field, index) => {
  const column = colLetter(index);
  const header = dataSheet.getRange(`${column}6`);
  const body = dataSheet.getRange(`${column}${dataRowStart}:${column}${dataRowEnd}`);
  if (field.required) {
    header.format = {
      fill: "#FCE4D6",
      font: { name: "Aptos", size: 10, bold: true, color: "#C00000" },
      horizontalAlignment: "center",
      verticalAlignment: "center",
      wrapText: true,
      borders: { preset: "outside", style: "thin", color: "#D9A6A6" },
    };
    body.format.fill = "#FFF2F2";
  } else if (platformRequiredFields.has(field.name)) {
    header.format = {
      fill: "#FFF2CC",
      font: { name: "Aptos", size: 10, bold: true, color: "#9A3412" },
      horizontalAlignment: "center",
      verticalAlignment: "center",
      wrapText: true,
      borders: { preset: "outside", style: "thin", color: "#D6B656" },
    };
    body.format.fill = "#FFF9E6";
  } else {
    body.format.fill = "#FFFFFF";
  }
  body.format = {
    font: { name: "Aptos", size: 10, color: "#1F2937" },
    verticalAlignment: "top",
    wrapText: true,
    borders: { preset: "outside", style: "thin", color: "#E5E7EB" },
  };
});

dataSheet.getRange(`A6:${lastCol}${dataRowEnd}`).format.borders = { preset: "inside", style: "thin", color: "#E5E7EB" };
dataSheet.getRange(`A6:${lastCol}${dataRowEnd}`).format.borders = { preset: "outside", style: "thin", color: "#94A3B8" };

const table = dataSheet.tables.add(`A6:${lastCol}${dataRowEnd}`, true);
table.name = "BookChannelProducts";

const narrowColumns = ["包册数", "页数", "是否是套装", "总库存", "SKU库存"];
const mediumColumns = ["店铺ID", "渠道", "淘宝类目ID", "抖店类目ID", "抖店出版社值ID", "出版时间", "定价", "一口价", "SKU价格", "SKU重量(g)", "开本", "发货时间", "发货地范围", "发货地设置", "提取方式", "上架时间", "库存扣减方式"];
fields.forEach((field, index) => {
  const column = colLetter(index);
  const width = narrowColumns.includes(field.name) ? 86 :
    mediumColumns.includes(field.name) ? 128 :
      field.name.includes("标题") || field.name.includes("运费模板") || field.name.includes("SKU规格") ? 190 :
        field.group === "类目属性" ? 150 : 160;
  dataSheet.getRange(`${column}:${column}`).format.columnWidthPx = width;
});

dataSheet.getRange(`A1:${lastCol}1`).format.rowHeightPx = 34;
dataSheet.getRange(`A2:${lastCol}2`).format.rowHeightPx = 28;
dataSheet.getRange(`A3:${lastCol}4`).format.rowHeightPx = 26;
dataSheet.getRange(`A5:${lastCol}6`).format.rowHeightPx = 42;
dataSheet.getRange(`A${dataRowStart}:${lastCol}${dataRowEnd}`).format.rowHeightPx = 26;
dataSheet.freezePanes.freezeRows(6);
dataSheet.freezePanes.freezeColumns(2);

const setListValidation = (fieldName, values) => {
  const index = fields.findIndex((field) => field.name === fieldName);
  if (index < 0) return;
  const column = colLetter(index);
  dataSheet.getRange(`${column}${dataRowStart}:${column}${dataRowEnd}`).dataValidation = {
    allowBlank: !fields[index].required,
    list: { inCellDropDown: true, source: values },
  };
};

Object.entries(options).forEach(([fieldName, values]) => setListValidation(fieldName, values));

const setNumberValidation = (fieldName, type, formula1, formula2 = undefined) => {
  const index = fields.findIndex((field) => field.name === fieldName);
  if (index < 0) return;
  const column = colLetter(index);
  const rule = { type, operator: formula2 === undefined ? "greaterThan" : "between", formula1 };
  if (formula2 !== undefined) rule.formula2 = formula2;
  dataSheet.getRange(`${column}${dataRowStart}:${column}${dataRowEnd}`).dataValidation = {
    allowBlank: !fields[index].required,
    rule,
    errorAlert: { style: "stop", title: "数值不符合要求", message: `${fieldName} 的数值不符合填写规则。` },
  };
};
setNumberValidation("一口价", "decimal", 0);
setNumberValidation("SKU价格", "decimal", 0);
setNumberValidation("总库存", "whole", 0);
setNumberValidation("SKU库存", "whole", 0);
setNumberValidation("SKU重量(g)", "whole", 0);
setNumberValidation("页数", "whole", 1);
setNumberValidation("包册数", "whole", 1);
setNumberValidation("定价", "decimal", 0);

["一口价", "SKU价格", "定价"].forEach((fieldName) => {
  const index = fields.findIndex((field) => field.name === fieldName);
  dataSheet.getRange(`${colLetter(index)}${dataRowStart}:${colLetter(index)}${dataRowEnd}`).format.numberFormat = "0.00";
});
["总库存", "SKU库存", "页数", "包册数", "SKU重量(g)"].forEach((fieldName) => {
  const index = fields.findIndex((field) => field.name === fieldName);
  dataSheet.getRange(`${colLetter(index)}${dataRowStart}:${colLetter(index)}${dataRowEnd}`).format.numberFormat = "0";
});
["线上商品ID", "店铺ID", "淘宝类目ID", "ISBN编号", "线上SKU ID", "SKU编码", "SKU条形码", "商品条形码", "商家编码", "抖店类目ID", "抖店出版社值ID"].forEach((fieldName) => {
  const index = fields.findIndex((field) => field.name === fieldName);
  dataSheet.getRange(`${colLetter(index)}${dataRowStart}:${colLetter(index)}${dataRowEnd}`).format.numberFormat = "@";
});

fieldSheet.getRange("A1:H1").merge();
fieldSheet.getRange("A1").values = [["图书多渠道字段说明"]];
fieldSheet.getRange("A1").format = {
  fill: "#1F4E78",
  font: { name: "Aptos", size: 15, bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
};
fieldSheet.getRange("G:G").format.numberFormat = "@";
fieldSheet.getRange("A2:H2").values = [["字段分组", "字段名称", "中台必填", "淘宝必填", "抖店必填", "填写规则", "示例/选项", "备注"]];
fieldSheet.getRange("A2:H2").format = {
  fill: "#E5E7EB",
  font: { name: "Aptos", size: 10, bold: true, color: "#111827" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
  borders: { preset: "outside", style: "thin", color: "#94A3B8" },
};
const fieldRows = fields.map((field) => [
  field.group,
  field.name,
  commonRequiredFields.has(field.name) ? "是" : "否",
  taobaoRequiredFields.has(field.name) ? "是" : "否",
  doudianRequiredFields.has(field.name) ? "是" : "否",
  field.note,
  options[field.name]?.join(" / ") ?? examples[field.name] ?? "",
  field.required ? "主录入页已标红；平台差异必填按渠道规则校验。" : "平台差异必填按渠道规则校验。",
]);
fieldSheet.getRange("A3").values = fieldRows;
fieldSheet.getRange(`A3:H${fields.length + 2}`).format = {
  font: { name: "Aptos", size: 10, color: "#1F2937" },
  verticalAlignment: "top",
  wrapText: true,
  borders: { preset: "inside", style: "thin", color: "#E5E7EB" },
};
fieldSheet.getRange(`A2:H${fields.length + 2}`).format.borders = { preset: "outside", style: "thin", color: "#94A3B8" };
for (let row = 3; row <= fields.length + 2; row += 1) {
  const field = fields[row - 3];
  if (field.required || taobaoRequiredFields.has(field.name) || doudianRequiredFields.has(field.name)) {
    fieldSheet.getRange(`B${row}:E${row}`).format = {
      fill: "#FCE4D6",
      font: { name: "Aptos", size: 10, bold: true, color: "#C00000" },
      verticalAlignment: "top",
      wrapText: true,
    };
  }
}
fieldSheet.getRange("A:A").format.columnWidthPx = 110;
fieldSheet.getRange("B:B").format.columnWidthPx = 160;
fieldSheet.getRange("C:E").format.columnWidthPx = 82;
fieldSheet.getRange("F:F").format.columnWidthPx = 330;
fieldSheet.getRange("G:G").format.columnWidthPx = 330;
fieldSheet.getRange("G:G").format.numberFormat = "@";
fieldSheet.getRange("H:H").format.columnWidthPx = 220;
fieldSheet.freezePanes.freezeRows(2);

dictSheet.getRange("A1:D1").merge();
dictSheet.getRange("A1").values = [["选项字典"]];
dictSheet.getRange("A1").format = {
  fill: "#1F4E78",
  font: { name: "Aptos", size: 15, bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
};
dictSheet.getRange("A2:D2").values = [["字段名称", "可选值", "默认值/示例", "说明"]];
dictSheet.getRange("A2:D2").format = {
  fill: "#E5E7EB",
  font: { name: "Aptos", size: 10, bold: true, color: "#111827" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
  borders: { preset: "outside", style: "thin", color: "#94A3B8" },
};
const dictRows = Object.entries(options).map(([fieldName, values]) => [
  fieldName,
  values.join(" / "),
  examples[fieldName] ?? values[0] ?? "",
  fields.find((field) => field.name === fieldName)?.note ?? "",
]);
dictSheet.getRange("A3").values = dictRows;
dictSheet.getRange(`A3:D${dictRows.length + 2}`).format = {
  font: { name: "Aptos", size: 10, color: "#1F2937" },
  verticalAlignment: "top",
  wrapText: true,
  borders: { preset: "inside", style: "thin", color: "#E5E7EB" },
};
dictSheet.getRange(`A2:D${dictRows.length + 2}`).format.borders = { preset: "outside", style: "thin", color: "#94A3B8" };
dictSheet.getRange("A:A").format.columnWidthPx = 150;
dictSheet.getRange("B:B").format.columnWidthPx = 420;
dictSheet.getRange("C:C").format.columnWidthPx = 160;
dictSheet.getRange("D:D").format.columnWidthPx = 320;
dictSheet.freezePanes.freezeRows(2);

taobaoSheet.getRange("A1:G1").merge();
taobaoSheet.getRange("A1").values = [["淘宝字段映射"]];
taobaoSheet.getRange("A1").format = {
  fill: "#1F4E78",
  font: { name: "Aptos", size: 15, bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
};
taobaoSheet.getRange("A2:G2").values = [["映射对象", "淘宝字段路径", "来源字段", "固定/默认值", "属性/枚举口径", "转换规则", "备注"]];
taobaoSheet.getRange("A2:G2").format = {
  fill: "#E5E7EB",
  font: { name: "Aptos", size: 10, bold: true, color: "#111827" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
  borders: { preset: "outside", style: "thin", color: "#94A3B8" },
};
const taobaoRows = [
  ["商品基础", "item_id", "线上商品ID", "", "渠道侧商品ID", "有值时走更新/映射；无值时走新增导入", "用于中台建立渠道商品关系"],
  ["商品基础", "shop_id", "店铺ID", "", "店铺配置ID", "按店铺ID匹配中台店铺配置", "淘宝店铺必填"],
  ["商品基础", "channel", "渠道", "淘宝", "淘宝", "渠道为淘宝时生成淘宝侧结构", "融合模板按渠道拆分"],
  ["商品基础", "category_id", "淘宝类目ID", "", "淘宝叶子类目", "优先使用单元格；空值时按中台类目映射", "淘宝发品/更新必填"],
  ["商品基础", "category_path", "淘宝类目全称", "", "类目路径", "用于人工核对和导入日志展示", "不直接写平台接口时也要保留"],
  ["商品基础", "title", "宝贝标题", "", "标题", "原样写入；校验长度不超过淘宝规则", "淘宝商品标题"],
  ["商品基础", "sell_point / short_title", "导购标题", "", "导购标题", "非空时写入", "选填"],
  ["类目属性", "item_props[书名]", "书名", "", "图书类目属性", "原样写入", "淘宝图书必填"],
  ["类目属性", "item_props[ISBN编号]", "ISBN编号", "", "图书类目属性", "按文本写入，避免科学计数法", "淘宝图书必填"],
  ["类目属性", "item_props[主题]", "主题", "", "图书类目属性", "非空写入", "选填"],
  ["类目属性", "item_props[书籍内容版本]", "书籍内容版本", "", "枚举/平台允许值", "按选项或原值写入", "选填"],
  ["类目属性", "item_props[内文用纸材质]", "内文用纸材质", "", "枚举/平台允许值", "按选项或原值写入", "选填"],
  ["类目属性", "item_props[出版时间]", "出版时间", "", "YYYY-MM 或 YYYY-MM-DD", "淘宝侧可按平台口径截取到年月", "按类目规则校验"],
  ["类目属性", "item_props[包册数]", "包册数", "", "数字", "整数写入", "套装/多册图书建议填"],
  ["类目属性", "item_props[是否是套装]", "是否是套装", "", "是/否", "按选项写入", "选填"],
  ["类目属性", "item_props[定价]", "定价", "", "码洋/定价", "金额保留两位小数", "按类目规则校验"],
  ["类目属性", "item_props[出版社名称]", "出版社名称", "", "出版社", "原样写入", "按类目规则校验"],
  ["类目属性", "item_props[作者]", "作者", "", "作者", "多个作者按原文本保留", "选填但建议填"],
  ["类目属性", "item_props[译者]", "译者", "", "译者", "非空写入", "选填"],
  ["类目属性", "item_props[编者]", "编者", "", "编者", "非空写入", "选填"],
  ["类目属性", "item_props[开本]", "开本", "", "开本", "原样写入", "选填"],
  ["销售属性", "sku_props[].property_name", "SKU规格", "", "销售属性名", "解析 SKU规格 左侧，如 装帧=平装", "SKU 维度必填"],
  ["销售属性", "sku_props[].value_name", "SKU规格", "", "销售属性值", "解析 SKU规格 右侧", "SKU 维度必填"],
  ["SKU明细", "skus[].outer_sku_id", "SKU编码", "", "商家SKU编码", "原样写入", "同商品下不可重复"],
  ["SKU明细", "skus[].price", "SKU价格", "", "销售价", "金额保留两位小数；需要平台分单位时由导入层换算", "SKU必填"],
  ["SKU明细", "skus[].quantity", "SKU库存", "", "库存", "整数库存", "SKU必填"],
  ["SKU明细", "skus[].barcode", "SKU条形码", "", "条码", "非空写入", "选填"],
  ["销售信息", "price", "一口价", "", "商品级价格", "金额保留两位小数", "淘宝必填"],
  ["销售信息", "quantity", "总库存", "", "商品总库存", "整数库存；可由 SKU 库存汇总校验", "淘宝必填"],
  ["销售信息", "outer_id", "商家编码", "", "商品商家编码", "原样写入", "中台归集建议必填"],
  ["销售信息", "barcode", "商品条形码", "", "商品条码", "非空写入", "选填"],
  ["销售信息", "multi_discount", "多件优惠", "不启用", "活动规则", "按选项映射", "淘宝页面标星"],
  ["销售信息", "sub_stock_type", "库存扣减方式", "拍下减库存", "拍下/付款减库存", "按选项映射", "淘宝必填"],
  ["销售信息", "approve_status / list_time", "上架时间 / 定时上架时间", "立即上架", "上下架状态", "立即上架/定时上架/放入仓库按店铺规则转换", "淘宝必填"],
  ["物流服务", "delivery_time", "发货时间", "48小时内发货", "发货承诺", "按店铺可选值映射", "淘宝必填"],
  ["物流服务", "ship_location", "发货地省市", "", "发货地", "拆分为省/市或按店铺地址模板匹配", "淘宝必填"],
  ["物流服务", "postage_template", "运费模板", "", "运费模板名称/ID", "按店铺模板名称映射到模板ID", "淘宝必填"],
];
taobaoSheet.getRange("A3").values = taobaoRows;
taobaoSheet.getRange(`A3:G${taobaoRows.length + 2}`).format = {
  font: { name: "Aptos", size: 10, color: "#1F2937" },
  verticalAlignment: "top",
  wrapText: true,
  borders: { preset: "inside", style: "thin", color: "#E5E7EB" },
};
taobaoSheet.getRange(`A2:G${taobaoRows.length + 2}`).format.borders = { preset: "outside", style: "thin", color: "#94A3B8" };
taobaoSheet.getRange("A:A").format.columnWidthPx = 110;
taobaoSheet.getRange("B:B").format.columnWidthPx = 240;
taobaoSheet.getRange("C:C").format.columnWidthPx = 190;
taobaoSheet.getRange("D:D").format.columnWidthPx = 130;
taobaoSheet.getRange("E:E").format.columnWidthPx = 220;
taobaoSheet.getRange("F:F").format.columnWidthPx = 320;
taobaoSheet.getRange("G:G").format.columnWidthPx = 260;
taobaoSheet.freezePanes.freezeRows(2);

doudianSheet.getRange("A1:G1").merge();
doudianSheet.getRange("A1").values = [["抖店字段映射"]];
doudianSheet.getRange("A1").format = {
  fill: "#1F4E78",
  font: { name: "Aptos", size: 15, bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
};
doudianSheet.getRange("A2:G2").values = [["映射对象", "抖店字段路径", "来源字段", "固定/默认值", "属性ID/值ID", "转换规则", "备注"]];
doudianSheet.getRange("A2:G2").format = {
  fill: "#E5E7EB",
  font: { name: "Aptos", size: 10, bold: true, color: "#111827" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
  borders: { preset: "outside", style: "thin", color: "#94A3B8" },
};
const doudianRows = [
  ["商品基础", "category_leaf_id", "抖店类目ID", "1000006731", "科幻小说", "空值时使用中台类目映射；三体示例为 1000006731", "书籍/杂志/报纸 > 小说 > 科幻小说"],
  ["商品基础", "name", "宝贝标题", "", "", "原样写入；建议与书名、作者、套装信息一致", "抖店商品标题"],
  ["商品基础", "product_type", "", "0", "普通商品", "固定值", "普通实物商品"],
  ["商品基础", "reduce_type", "库存扣减方式", "1", "拍下减库存=1；付款减库存=2", "按选项映射", "抖店必填"],
  ["商品基础", "freight_id", "运费模板", "0", "", "中台按店铺模板名称映射到运费模板ID；测试可用 0 包邮", "抖店必填"],
  ["商品属性", "product_format_new[1618]", "ISBN编号", "", "ISBN编号=1618", "value=0；name=单元格文本；diy_type=0", "必填"],
  ["商品属性", "product_format_new[1831]", "书名", "", "书名=1831", "value=0；name=单元格文本；diy_type=0", "必填"],
  ["商品属性", "product_format_new[1687]", "品牌", "", "品牌=1687", "优先按 standard_brand_id/品牌库映射；无法命中时进入异常或无品牌策略", "抖店必填但类目属性接口未返回品牌值列表"],
  ["商品属性", "product_format_new[855]", "出版社名称 / 抖店出版社值ID", "62228", "出版社名称=855；重庆出版社=62228", "value=抖店出版社值ID；name=出版社名称；diy_type=0", "必填"],
  ["商品属性", "product_format_new[3271]", "出版时间", "", "出版时间=3271", "value=0；name=YYYY-MM-DD；diy_type=0", "必填"],
  ["商品属性", "product_format_new[3296]", "定价", "", "定价=3296", "value=0；name=金额+元，如 93.00元；diy_type=0", "必填"],
  ["商品属性", "product_format_new[326]", "版本", "", "版本=326；套装=37507；平装=20624；精装=13708", "按选项映射 value；name=版本；diy_type=0", "选填但建议填"],
  ["商品属性", "product_format_new[501]", "是否是套装", "", "是否是套装=501；是=23964；否=7310", "按选项映射 value；name=是否是套装；diy_type=0", "选填但建议填"],
  ["商品属性", "product_format_new[449]", "作者", "", "作者=449", "value=0；name=作者；diy_type=0", "选填但建议填"],
  ["商品属性", "product_format_new[2000]", "作者地区", "中国大陆", "作者地区=2000；中国大陆=13850", "命中枚举时写 value_id，否则进入异常", "选填"],
  ["SKU规格", "spec_info.spec_values[].property_name", "SKU规格", "", "", "解析 SKU规格 左侧，如 版本=三体全集 全3册", "单 SKU 也建议填一个规格项"],
  ["SKU规格", "spec_info.spec_values[].values[].value_name", "SKU规格", "", "", "解析 SKU规格 右侧", "与 spec_prices_v2.sell_properties 顺序一致"],
  ["SKU明细", "spec_prices_v2[].sell_properties", "SKU规格", "", "", "解析为 [{property_name,value_name}]", "顺序必须与 spec_info 一致"],
  ["SKU明细", "spec_prices_v2[].price", "SKU价格", "", "", "元转分，四舍五入到整数分", "如 93.00 -> 9300"],
  ["SKU明细", "spec_prices_v2[].stock_num", "SKU库存", "", "", "整数库存", "普通库存"],
  ["SKU明细", "spec_prices_v2[].sku_type", "", "0", "普通库存=0", "固定值", "如区域库存需改用 stock_num_map"],
  ["SKU明细", "spec_prices_v2[].code / outer_sku_id", "SKU编码", "", "", "原样写入", "SKU级唯一编码"],
  ["SKU明细", "spec_prices_v2[].barcodes[]", "SKU条形码", "", "", "非空时写入数组", "可选"],
  ["SKU明细", "spec_prices_v2[].delivery_infos[]", "SKU重量(g)", "", "info_type=weight；info_unit=g", "非空时写入 {info_type:'weight', info_value, info_unit:'g'}", "建议填，部分店铺/模板会要求重量"],
];
doudianSheet.getRange("A3").values = doudianRows;
doudianSheet.getRange(`A3:G${doudianRows.length + 2}`).format = {
  font: { name: "Aptos", size: 10, color: "#1F2937" },
  verticalAlignment: "top",
  wrapText: true,
  borders: { preset: "inside", style: "thin", color: "#E5E7EB" },
};
doudianSheet.getRange(`A2:G${doudianRows.length + 2}`).format.borders = { preset: "outside", style: "thin", color: "#94A3B8" };
doudianSheet.getRange("A:A").format.columnWidthPx = 110;
doudianSheet.getRange("B:B").format.columnWidthPx = 260;
doudianSheet.getRange("C:C").format.columnWidthPx = 210;
doudianSheet.getRange("D:D").format.columnWidthPx = 130;
doudianSheet.getRange("E:E").format.columnWidthPx = 260;
doudianSheet.getRange("F:F").format.columnWidthPx = 320;
doudianSheet.getRange("G:G").format.columnWidthPx = 260;
doudianSheet.freezePanes.freezeRows(2);

await fs.mkdir(outputDir, { recursive: true });

for (const sheetName of ["商品数据录入", "字段说明", "选项字典", "淘宝字段映射", "抖店字段映射"]) {
  const blob = await workbook.render({ sheetName, scale: 1.4 });
  if (writePreviewImages) {
    await fs.writeFile(path.join(outputDir, `${sheetName}.png`), Buffer.from(await blob.arrayBuffer()));
  }
}

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "final formula error scan",
});
console.log(errors.ndjson);

const dataPreview = await workbook.inspect({
  kind: "table",
  range: `商品数据录入!A1:${colLetter(Math.min(12, lastColIndex))}12`,
  include: "values",
  tableMaxRows: 12,
  tableMaxCols: 13,
  tableMaxCellChars: 120,
});
console.log(dataPreview.ndjson);

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(templateOutputPath);
console.log(templateOutputPath);
