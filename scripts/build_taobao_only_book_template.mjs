import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const outputDir = path.join(projectRoot, "outputs", "taobao_book_product_template");
const outputPath = path.join(outputDir, "淘宝图书类目商品数据录入模板.xlsx");

const dataRowStart = 7;
const dataRowEnd = 106;

const fields = [
  ["基础信息", "线上商品ID", "线上店铺商品的原始商品ID；同一淘宝店铺内唯一。"],
  ["基础信息", "店铺ID", "线上店铺数据导入时用于定位店铺。"],
  ["基础信息", "店铺名称", "线上店铺数据导入时用于人工核对店铺归属。"],
  ["基础信息", "渠道", "固定填写淘宝。"],
  ["基础信息", "淘宝类目ID", "淘宝叶子类目ID；示例为假值，可由中台类目映射或线上商品数据回填。"],
  ["基础信息", "淘宝类目全称", "淘宝类目完整路径；示例为假值，用于人工核对和导入日志展示。"],
  ["基础信息", "宝贝标题", "最多 60 个汉字（120 字符）。"],
  ["基础信息", "导购标题", "最多 15 个汉字（30 字符）。"],
  ["类目属性", "书名", "淘宝图书类目属性必填。"],
  ["类目属性", "ISBN编号", "淘宝图书类目属性必填，建议填写 13 位 ISBN。"],
  ["类目属性", "主题", "按实际主题填写。"],
  ["类目属性", "书籍内容版本", "按平台允许值填写。"],
  ["类目属性", "内文用纸材质", "按平台允许值填写。"],
  ["类目属性", "出版时间", "建议格式 YYYY-MM 或 YYYY-MM-DD。"],
  ["类目属性", "包册数", "数字，如 1、3、10。"],
  ["类目属性", "是否是套装", "是/否。"],
  ["类目属性", "定价", "码洋/书籍定价，单位元。"],
  ["类目属性", "出版社名称", "出版社全称。"],
  ["类目属性", "作者", "多个作者可用中文顿号或分号分隔。"],
  ["类目属性", "作者地区", "按平台枚举或实际地区填写。"],
  ["类目属性", "译者", "多个译者可用中文顿号或分号分隔。"],
  ["类目属性", "编者", "多个编者可用中文顿号或分号分隔。"],
  ["类目属性", "开本", "如 16开、32开。"],
  ["SKU信息", "线上SKU ID", "淘宝 SKU 的原始 SKU ID；无规格单 SKU 商品可填 DEFAULT。"],
  ["SKU信息", "SKU编码", "商家侧 SKU 编码；同一线上商品ID下不可重复。"],
  ["SKU信息", "SKU规格", "填写规格名和值，如 装帧=平装。"],
  ["SKU信息", "SKU价格", "SKU 实际售卖价，单位元。"],
  ["SKU信息", "SKU库存", "SKU 级库存，单位件。"],
  ["SKU信息", "SKU条形码", "如有可填写 SKU 级条形码。"],
  ["销售信息", "一口价", "淘宝商品级一口价，单位元。"],
  ["销售信息", "总库存", "商品级总库存。"],
  ["销售信息", "购买须知", "最多 60 字符。"],
  ["销售信息", "商家编码", "平台页面未标星；中台归集建议填写。"],
  ["销售信息", "商品条形码", "如有可填写。"],
  ["销售信息", "多件优惠", "平台页面标星；可选择不启用或填写活动规则。"],
  ["销售信息", "库存扣减方式", "拍下减库存/付款减库存。"],
  ["销售信息", "上架时间", "立即上架/定时上架/放入仓库。"],
  ["销售信息", "定时上架时间", "仅上架时间选择定时上架时填写，建议格式 YYYY-MM-DD HH:mm。"],
  ["物流服务", "发货时间", "今日发/24小时内发货/48小时内发货/大于48小时发货。"],
  ["物流服务", "发货地范围", "大陆及港澳台/其他国家或地区。"],
  ["物流服务", "发货地设置", "单一发货地/多发货地。"],
  ["物流服务", "发货地省市", "如 安徽/合肥。"],
  ["物流服务", "提取方式", "平台页面默认为使用物流配送。"],
  ["物流服务", "运费模板", "填写店铺可用运费模板名称。"],
  ["物流服务", "区域限售", "不设置商品维度区域限售模板/选择商品维度区域限售模板。"],
  ["物流服务", "售后服务", "如保修服务。"],
  ["物流服务", "服务承诺", "该类商品通常要求支持七天退货，可保留默认值。"],
  ["备注", "备注", "内部协作用，不导入平台时可留空。"],
].map(([group, name, note]) => ({ group, name, note }));

const required = new Set([
  "线上商品ID",
  "店铺ID",
  "店铺名称",
  "渠道",
  "淘宝类目ID",
  "淘宝类目全称",
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

const options = {
  渠道: ["淘宝"],
  书籍内容版本: ["完整版", "节选版", "注音版", "双语版", "修订版", "典藏版"],
  内文用纸材质: ["胶版纸", "轻型纸", "铜版纸", "纯质纸", "其他"],
  是否是套装: ["否", "是"],
  作者地区: ["中国大陆", "中国香港", "中国台湾", "日本", "美国", "英国", "法国", "德国", "其他"],
  多件优惠: ["不启用", "满2件打折", "满3件打折", "自定义"],
  库存扣减方式: ["拍下减库存", "付款减库存"],
  上架时间: ["立即上架", "定时上架", "放入仓库"],
  发货时间: ["今日发", "24小时内发货", "48小时内发货", "大于48小时发货"],
  发货地范围: ["大陆及港澳台", "其他国家或地区"],
  发货地设置: ["单一发货地", "多发货地"],
  提取方式: ["使用物流配送"],
  区域限售: ["不设置商品维度区域限售模板", "选择商品维度区域限售模板"],
  售后服务: ["不勾选", "保修服务"],
  服务承诺: ["七天退货"],
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
    书名: "三体",
    ISBN编号: "9787536692930",
    书籍内容版本: "完整版",
    内文用纸材质: "胶版纸",
    出版时间: "2008-01",
    包册数: 1,
    是否是套装: "否",
    定价: 23.0,
    出版社名称: "重庆出版社",
    作者: "刘慈欣",
    作者地区: "中国大陆",
    开本: "16开",
    "线上SKU ID": "TB-SKU-100001-01",
    SKU编码: "TB-BOOK-0001-SKU01",
    SKU规格: "装帧=平装",
    SKU价格: 19.8,
    SKU库存: 60,
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
    书名: "三体",
    ISBN编号: "9787536692930",
    书籍内容版本: "完整版",
    内文用纸材质: "胶版纸",
    出版时间: "2008-01",
    包册数: 1,
    是否是套装: "否",
    定价: 23.0,
    出版社名称: "重庆出版社",
    作者: "刘慈欣",
    作者地区: "中国大陆",
    开本: "16开",
    "线上SKU ID": "TB-SKU-100001-02",
    SKU编码: "TB-BOOK-0001-SKU02",
    SKU规格: "装帧=精装",
    SKU价格: 35.0,
    SKU库存: 40,
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
    店铺ID: "SHOP-TB-001",
    店铺名称: "三味书屋旗舰店",
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
    店铺ID: "SHOP-TB-001",
    店铺名称: "三味书屋旗舰店",
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

const setRow = (sheet, row, values) => {
  sheet.getRange(`A${row}:${colLetter(values.length - 1)}${row}`).values = [values];
};

const workbook = Workbook.create();
const dataSheet = workbook.worksheets.getOrAdd("商品数据录入", { renameFirstIfOnlyNewSpreadsheet: true });
const fieldSheet = workbook.worksheets.add("字段说明");
const dictSheet = workbook.worksheets.add("选项字典");
const lastCol = colLetter(fields.length - 1);

for (const sheet of [dataSheet, fieldSheet, dictSheet]) sheet.showGridLines = false;

dataSheet.getRange(`A1:${lastCol}1`).merge();
dataSheet.getRange("A1").values = [["淘宝图书类目商品数据录入模板"]];
dataSheet.getRange("A1").format = { fill: "#1F4E78", font: { name: "Aptos", size: 16, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center" };
dataSheet.getRange(`A2:${lastCol}2`).merge();
dataSheet.getRange("A2").values = [["适用：淘宝线上店铺图书商品导入；一行录入一个 SKU。同一线上商品的多个 SKU 行填写相同线上商品ID。"]];
dataSheet.getRange("A2").format = { fill: "#EAF2F8", font: { name: "Aptos", size: 10, color: "#1F2937" } };
dataSheet.getRange(`A4:${lastCol}4`).merge();
dataSheet.getRange("A4").values = [["填写说明：红色表头为淘宝导入必填。线上商品唯一键建议使用 渠道+店铺ID+线上商品ID；线上 SKU 唯一键建议使用 渠道+店铺ID+线上商品ID+线上SKU ID。"]];
dataSheet.getRange("A4").format = { fill: "#FFF7ED", font: { name: "Aptos", size: 10, color: "#9A3412" } };

setRow(dataSheet, 5, fields.map((field) => field.group));
setRow(dataSheet, 6, fields.map((field) => required.has(field.name) ? `${field.name} *` : field.name));
dataSheet.getRange(`A${dataRowStart}`).values = Array.from({ length: dataRowEnd - dataRowStart + 1 }, () => Array(fields.length).fill(null));
dataSheet.getRange(`A${dataRowStart}`).values = sampleRows.map((row) => fields.map((field) => row[field.name] ?? null));

let groupStart = 0;
while (groupStart < fields.length) {
  let groupEnd = groupStart;
  while (groupEnd + 1 < fields.length && fields[groupEnd + 1].group === fields[groupStart].group) groupEnd += 1;
  if (groupEnd > groupStart) dataSheet.getRange(`${colLetter(groupStart)}5:${colLetter(groupEnd)}5`).merge();
  dataSheet.getRange(`${colLetter(groupStart)}5:${colLetter(groupEnd)}5`).format = {
    fill: fields[groupStart].group === "类目属性" ? "#D9EAD3" : fields[groupStart].group === "SKU信息" ? "#FCE4D6" : fields[groupStart].group === "销售信息" ? "#DDEBF7" : fields[groupStart].group === "物流服务" ? "#EADCF8" : "#E2F0D9",
    font: { name: "Aptos", size: 10, bold: true, color: "#1F2937" },
    horizontalAlignment: "center",
  };
  groupStart = groupEnd + 1;
}

dataSheet.getRange(`A1:${lastCol}${dataRowEnd}`).format = {
  font: { name: "Aptos", size: 10, color: "#1F2937" },
  verticalAlignment: "top",
  wrapText: true,
  borders: { preset: "inside", style: "thin", color: "#E5E7EB" },
};
dataSheet.getRange(`A6:${lastCol}6`).format = { fill: "#E5E7EB", font: { name: "Aptos", size: 10, bold: true, color: "#111827" }, horizontalAlignment: "center", wrapText: true };
fields.forEach((field, index) => {
  const column = colLetter(index);
  if (required.has(field.name)) {
    dataSheet.getRange(`${column}6`).format = { fill: "#FCE4D6", font: { name: "Aptos", size: 10, bold: true, color: "#C00000" }, horizontalAlignment: "center", wrapText: true };
    dataSheet.getRange(`${column}${dataRowStart}:${column}${dataRowEnd}`).format.fill = "#FFF2F2";
  }
  dataSheet.getRange(`${column}:${column}`).format.columnWidthPx = field.name.includes("标题") || field.name.includes("模板") || field.name.includes("SKU规格") ? 190 : field.group === "类目属性" ? 145 : 130;
});
dataSheet.tables.add(`A6:${lastCol}${dataRowEnd}`, true).name = "TaobaoBookProducts";
dataSheet.freezePanes.freezeRows(6);
dataSheet.freezePanes.freezeColumns(2);

const setListValidation = (fieldName, values) => {
  const index = fields.findIndex((field) => field.name === fieldName);
  if (index < 0) return;
  dataSheet.getRange(`${colLetter(index)}${dataRowStart}:${colLetter(index)}${dataRowEnd}`).dataValidation = {
    allowBlank: !required.has(fieldName),
    list: { inCellDropDown: true, source: values },
  };
};
Object.entries(options).forEach(([fieldName, values]) => setListValidation(fieldName, values));
["线上商品ID", "店铺ID", "淘宝类目ID", "ISBN编号", "线上SKU ID", "SKU编码", "SKU条形码", "商品条形码", "商家编码"].forEach((fieldName) => {
  const index = fields.findIndex((field) => field.name === fieldName);
  dataSheet.getRange(`${colLetter(index)}${dataRowStart}:${colLetter(index)}${dataRowEnd}`).format.numberFormat = "@";
});

fieldSheet.getRange("A1:F1").merge();
fieldSheet.getRange("A1").values = [["淘宝图书字段说明"]];
fieldSheet.getRange("A1").format = { fill: "#1F4E78", font: { name: "Aptos", size: 15, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center" };
fieldSheet.getRange("A2:F2").values = [["字段分组", "字段名称", "是否必填", "填写规则", "示例/选项", "备注"]];
fieldSheet.getRange("A2:F2").format = { fill: "#E5E7EB", font: { name: "Aptos", size: 10, bold: true, color: "#111827" }, horizontalAlignment: "center" };
fieldSheet.getRange("A3").values = fields.map((field) => [field.group, field.name, required.has(field.name) ? "必填" : "选填", field.note, options[field.name]?.join(" / ") ?? sampleRows[0][field.name] ?? "", required.has(field.name) ? "主录入页已标红。" : ""]);
fieldSheet.getRange(`A3:F${fields.length + 2}`).format = { font: { name: "Aptos", size: 10, color: "#1F2937" }, verticalAlignment: "top", wrapText: true, borders: { preset: "inside", style: "thin", color: "#E5E7EB" } };
["A:A", "B:B", "C:C", "D:D", "E:E", "F:F"].forEach((address, i) => {
  fieldSheet.getRange(address).format.columnWidthPx = [110, 160, 82, 330, 330, 220][i];
});
fieldSheet.freezePanes.freezeRows(2);

dictSheet.getRange("A1:D1").merge();
dictSheet.getRange("A1").values = [["选项字典"]];
dictSheet.getRange("A1").format = { fill: "#1F4E78", font: { name: "Aptos", size: 15, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center" };
dictSheet.getRange("A2:D2").values = [["字段名称", "可选值", "默认值/示例", "说明"]];
dictSheet.getRange("A3").values = Object.entries(options).map(([fieldName, values]) => [fieldName, values.join(" / "), values[0] ?? "", fields.find((field) => field.name === fieldName)?.note ?? ""]);
dictSheet.getRange("A:D").format = { font: { name: "Aptos", size: 10, color: "#1F2937" }, verticalAlignment: "top", wrapText: true };
dictSheet.getRange("A:A").format.columnWidthPx = 150;
dictSheet.getRange("B:B").format.columnWidthPx = 420;
dictSheet.getRange("C:C").format.columnWidthPx = 160;
dictSheet.getRange("D:D").format.columnWidthPx = 320;

await fs.mkdir(outputDir, { recursive: true });
const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "formula error scan",
});
console.log(errors.ndjson);

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(outputPath);
