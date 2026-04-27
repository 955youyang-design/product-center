import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const doudianProjectDir = process.env.DOUDIAN_PROJECT_DIR
  ? path.resolve(process.env.DOUDIAN_PROJECT_DIR)
  : "/Users/youyang/项目/2026/抖店";

const outputDir = process.env.TEMPLATE_OUTPUT_DIR
  ? path.resolve(process.env.TEMPLATE_OUTPUT_DIR)
  : path.join(os.homedir(), "Desktop", "商品中台导入模板");
const outputFileName = process.env.TEMPLATE_OUTPUT_FILE_NAME || "抖店导入模板-2026-04-27.xlsx";
const outputPath = path.join(outputDir, outputFileName);
const writePreviewImages = process.env.TEMPLATE_WRITE_PREVIEWS === "1";

const doudianLeafCategoryId = "1000006731";
const doudianLeafCategoryPath = "书籍/杂志/报纸 > 小说 > 科幻小说";
const dataRowStart = 7;
const dataRowEnd = 106;

const readJson = async (fileName) => {
  const raw = await fs.readFile(path.join(doudianProjectDir, fileName), "utf8");
  return JSON.parse(raw);
};

const [tokenResponse, catePropertyResponse, updateRuleResponse, precheckResponse] = await Promise.all([
  readJson(".doudian_access_token.json"),
  readJson("cate_property_1000006731_santi.json"),
  readJson("product_update_rule_1000006731.json"),
  readJson("publish_precheck_santi.json"),
]);

const tokenData = tokenResponse.data ?? {};
const categoryProperties = (catePropertyResponse.data?.data ?? []).map((property) => ({
  ...property,
  options: property.options ?? [],
}));
const updateRule = updateRuleResponse.data ?? {};
const precheckResults = precheckResponse.data?.common_check_results ?? [];
const titleLimitRule = updateRule.recommend_name_rule?.title_limit_rule ?? {};
const fulfillmentRule = updateRule.fulfillment_rule ?? {};
const productSpecRule = updateRule.product_spec_rule ?? {};
const afterSaleRule = updateRule.after_sale_rule ?? {};
const qualificationRule = updateRule.qualification_rule ?? [];

const delayText = (value) => {
  if (value === 9999) return "现货发货";
  if (value === 1) return "次日发";
  if (value === 2) return "48小时内发货";
  return `${value}天内发货`;
};

const normalDelayOptions = (fulfillmentRule.normal_rule?.delay_options ?? []).map(delayText);
const stepDelayOptions = (fulfillmentRule.step_rule?.multi_times ?? []).map((item) => `${item.time_desc}发货`);
const deliveryOptions = Array.from(new Set([...normalDelayOptions, ...stepDelayOptions])).filter(Boolean);
const afterSaleOptions = afterSaleRule.supply_day_return_rule?.options?.map((item) => item.name) ?? [];

const baseFields = [
  { group: "抖店店铺", name: "店铺ID", required: true, note: "来自抖店授权测试店铺，用于限定本次模板模拟范围。", example: String(tokenData.shop_id ?? "4463798"), doudianPath: "shop_id" },
  { group: "抖店店铺", name: "店铺名称", required: true, note: "来自抖店授权测试店铺，用于人工核对。", example: tokenData.shop_name ?? "开放平台测试专用店", doudianPath: "shop_name" },
  { group: "抖店店铺", name: "抖店类目ID", required: true, note: `固定为图书叶子类目 ${doudianLeafCategoryId}。`, example: doudianLeafCategoryId, doudianPath: "category_leaf_id" },
  { group: "抖店店铺", name: "抖店类目路径", required: true, note: "用于人工核对类目选择。", example: doudianLeafCategoryPath, doudianPath: "category_path" },
  { group: "抖店商品基础", name: "外部商品编码", required: true, note: "中台商品导入幂等键，写入抖店外部商品编码。", example: "DD-BOOK-SANTI-001", doudianPath: "outer_product_id" },
  { group: "抖店商品基础", name: "抖店商品ID", required: false, note: "更新既有抖店商品时填写；新增模拟可留空。", example: "", doudianPath: "product_id" },
  { group: "抖店商品基础", name: "商品标题", required: true, note: `来自 product.getProductUpdateRule：标题长度 ${titleLimitRule.min_length ?? 15}-${titleLimitRule.max_length ?? 60} 字，且不能包含接口规则中的非法字符。`, example: "中国科幻基石丛书 三体 刘慈欣 正版全3册", doudianPath: "name" },
  { group: "抖店商品基础", name: "商品推荐语", required: false, note: "可用于抖店推荐语，按业务情况填写。", example: "雨果奖经典科幻", doudianPath: "recommend_remark" },
  { group: "抖店商品基础", name: "主图URL", required: true, note: "抖店商品主图，多个图片用英文竖线 | 分隔。", example: "https://example.com/doudian-book-main.jpg", doudianPath: "pic" },
  { group: "抖店商品基础", name: "详情图URL", required: true, note: "抖店商品详情图，多个图片用英文竖线 | 分隔。", example: "https://example.com/doudian-book-detail-1.jpg|https://example.com/doudian-book-detail-2.jpg", doudianPath: "description" },
];

const propertyExampleMap = new Map([
  ["ISBN编号", "9787104551003"],
  ["书名", "中国科幻基石丛书 三体"],
  ["版本", "套装"],
  ["品牌", "科幻世界"],
  ["出版社名称", "重庆出版社"],
  ["作者", "刘慈欣"],
  ["主题", "科幻文学"],
  ["是否是套装", "是"],
  ["配套资源", ""],
  ["装帧类型", "平装"],
  ["副书名", ""],
  ["版次", "1"],
  ["印次", "1"],
  ["作者地区", "中国大陆"],
  ["编者", ""],
  ["获奖信息", ""],
  ["定价", "93.00"],
  ["译者", ""],
  ["出版时间", "2008-01-01"],
  ["商品ISBN编码（全量）", "9787104551003"],
]);

const propertyFields = categoryProperties.map((property) => {
  const optionPreview = property.options.slice(0, 8).map((item) => item.name).filter(Boolean).join(" / ");
  const optionsText = property.options.length
    ? `接口返回 ${property.options.length} 个枚举值${optionPreview ? `，示例：${optionPreview}` : ""}。`
    : "接口未返回枚举值，按文本或平台映射值填写。";
  return {
    group: "抖店类目属性",
    name: property.property_name,
    required: property.required === 1,
    note: `来自 product.getCateProperty：property_id=${property.property_id}，type=${property.type}，diy_type=${property.diy_type}。${optionsText}`,
    example: propertyExampleMap.get(property.property_name) ?? "",
    doudianPath: `product_format_new[${property.property_id}]`,
    propertyId: property.property_id,
    propertyType: property.type,
    diyType: property.diy_type,
    optionValues: property.options.map((item) => item.name).filter(Boolean),
  };
});

const skuAndFulfillmentFields = [
  { group: "抖店SKU", name: "外部SKU编码", required: true, note: "SKU 维度唯一编码，写入抖店 SKU code / outer_sku_id。", example: "DD-BOOK-SANTI-001-SET", doudianPath: "spec_prices_v2[].code" },
  { group: "抖店SKU", name: "SKU规格", required: true, note: `来自 product.getProductUpdateRule：最多 ${productSpecRule.max_spec_num_limit ?? 3} 级规格，组合数上限 ${productSpecRule.spec_combination_limit ?? 450}。填写示例：版本=三体全集 全3册。`, example: "版本=三体全集 全3册", doudianPath: "spec_info/spec_prices_v2.sell_properties" },
  { group: "抖店SKU", name: "SKU价格", required: true, note: "单位元，导入时换算为分。", example: 93, doudianPath: "spec_prices_v2[].price" },
  { group: "抖店SKU", name: "SKU库存", required: true, note: "普通库存，必须为非负整数。", example: 10, doudianPath: "spec_prices_v2[].stock_num" },
  { group: "抖店SKU", name: "SKU重量(g)", required: false, note: "如需要履约重量，单位克。", example: 1500, doudianPath: "spec_prices_v2[].delivery_infos" },
  { group: "抖店履约", name: "库存扣减方式", required: true, note: "抖店 reduce_type 映射。", example: "拍下减库存", options: ["拍下减库存", "付款减库存"], doudianPath: "reduce_type" },
  { group: "抖店履约", name: "发货时效", required: true, note: "来自 product.getProductUpdateRule 的 normal_rule / step_rule。", example: deliveryOptions.includes("48小时内发货") ? "48小时内发货" : deliveryOptions[0] ?? "现货发货", options: deliveryOptions, doudianPath: "fulfillment_rule" },
  { group: "抖店履约", name: "发货地省市", required: true, note: "测试模拟发货地。", example: "安徽/合肥", doudianPath: "delivery_address" },
  { group: "抖店履约", name: "运费模板", required: true, note: "填写测试店铺可用运费模板名称；模拟导入时再映射 freight_id。", example: "测试包邮模板", doudianPath: "freight_id" },
  { group: "抖店履约", name: "售后承诺", required: false, note: "来自 product.getProductUpdateRule 的售后规则。", example: afterSaleOptions[0] ?? "7天无理由退货", options: afterSaleOptions, doudianPath: "after_sale_rule.supply_day_return_rule" },
  { group: "抖店模拟", name: "模拟结果备注", required: false, note: "本地模板生成备注，不写入抖店。", example: "测试店铺可发布商品，但当前类目资质预校验未通过，不能模拟落库。", doudianPath: "" },
];

const fields = [...baseFields, ...propertyFields, ...skuAndFulfillmentFields];
const requiredFields = new Set(fields.filter((field) => field.required).map((field) => field.name));

const workbook = Workbook.create();
const dataSheet = workbook.worksheets.getOrAdd("抖店商品数据", { renameFirstIfOnlyNewSpreadsheet: true });
const fieldSheet = workbook.worksheets.add("抖店字段说明");
const dictSheet = workbook.worksheets.add("抖店选项字典");
const ruleSheet = workbook.worksheets.add("抖店接口规则");
const mappingSheet = workbook.worksheets.add("抖店字段映射");

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

const cleanHtml = (value) => String(value ?? "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

const lastColIndex = fields.length - 1;
const lastCol = colLetter(lastColIndex);
const usedRange = `A1:${lastCol}${dataRowEnd}`;

for (const sheet of [dataSheet, fieldSheet, dictSheet, ruleSheet, mappingSheet]) {
  sheet.showGridLines = false;
}

dataSheet.getRange(`A1:${lastCol}1`).merge();
dataSheet.getRange("A1").values = [["抖店图书商品导入模板"]];
dataSheet.getRange("A1").format = {
  fill: "#0F766E",
  font: { name: "Aptos", size: 16, bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
};

dataSheet.getRange(`A2:${lastCol}2`).merge();
dataSheet.getRange("A2").values = [[`测试店铺：${tokenData.shop_name ?? "开放平台测试专用店"}（${tokenData.shop_id ?? "4463798"}）；叶子类目：${doudianLeafCategoryPath}（${doudianLeafCategoryId}）。字段来自抖店 SDK 项目中的真实接口返回。`]];
dataSheet.getRange("A2").format = {
  fill: "#CCFBF1",
  font: { name: "Aptos", size: 10, color: "#134E4A" },
  verticalAlignment: "center",
  wrapText: true,
};

dataSheet.getRange("A3").values = [["平台"]];
dataSheet.getRange("B3").values = [["抖店"]];
dataSheet.getRange("C3").values = [["类目"]];
dataSheet.getRange("D3:H3").merge();
dataSheet.getRange("D3").values = [[`${doudianLeafCategoryPath}（${doudianLeafCategoryId}）`]];
dataSheet.getRange("I3").values = [["模板日期"]];
dataSheet.getRange("J3").values = [["2026-04-27"]];
dataSheet.getRange("A3:J3").format = {
  fill: "#F8FAFC",
  font: { name: "Aptos", size: 10, bold: true, color: "#1F2937" },
  borders: { preset: "outside", style: "thin", color: "#CBD5E1" },
  verticalAlignment: "center",
};

dataSheet.getRange(`A4:${lastCol}4`).merge();
dataSheet.getRange("A4").values = [["填写说明：红色 * 为必填字段；金额单位为元，库存和重量为整数；图片 URL 多值使用英文竖线 | 分隔。此文件仅模拟抖店模板生成，不执行上传校验或落库。"]];
dataSheet.getRange("A4").format = {
  fill: "#FFF7ED",
  font: { name: "Aptos", size: 10, color: "#9A3412" },
  verticalAlignment: "center",
  wrapText: true,
};

setRowValues(dataSheet, 5, fields.map((field) => field.group));
setRowValues(dataSheet, 6, fields.map((field) => (field.required ? `${field.name} *` : field.name)));

let groupStart = 0;
while (groupStart < fields.length) {
  let groupEnd = groupStart;
  while (groupEnd + 1 < fields.length && fields[groupEnd + 1].group === fields[groupStart].group) groupEnd += 1;
  if (groupEnd > groupStart) dataSheet.getRange(range(groupStart, 5, groupEnd)).merge();
  const groupFill = fields[groupStart].group === "抖店店铺" ? "#CCFBF1"
    : fields[groupStart].group === "抖店商品基础" ? "#DBEAFE"
      : fields[groupStart].group === "抖店类目属性" ? "#DCFCE7"
        : fields[groupStart].group === "抖店SKU" ? "#FCE7F3"
          : fields[groupStart].group === "抖店履约" ? "#FEF3C7" : "#E5E7EB";
  dataSheet.getRange(range(groupStart, 5, groupEnd)).format = {
    fill: groupFill,
    font: { name: "Aptos", size: 10, bold: true, color: "#1F2937" },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    borders: { preset: "outside", style: "thin", color: "#94A3B8" },
  };
  groupStart = groupEnd + 1;
}

const sampleRowOne = Object.fromEntries(fields.map((field) => [field.name, field.example ?? ""]));
const sampleRowTwo = {
  ...sampleRowOne,
  外部商品编码: "DD-BOOK-SANTI-002",
  商品标题: "三体全集 精装纪念版 刘慈欣 科幻小说",
  外部SKU编码: "DD-BOOK-SANTI-002-HC",
  SKU规格: "版本=精装纪念版",
  SKU价格: 128,
  SKU库存: 8,
  "SKU重量(g)": 2100,
  版本: "精装",
  定价: "128.00",
};

dataSheet.getRange(`A${dataRowStart}:${lastCol}${dataRowEnd}`).values = Array.from(
  { length: dataRowEnd - dataRowStart + 1 },
  (_, index) => {
    const source = index === 0 ? sampleRowOne : index === 1 ? sampleRowTwo : {};
    return fields.map((field) => source[field.name] ?? null);
  },
);

dataSheet.getRange(usedRange).format = {
  font: { name: "Aptos", size: 10, color: "#1F2937" },
  verticalAlignment: "top",
  wrapText: true,
};
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
  dataSheet.getRange(`${column}${dataRowStart}:${column}${dataRowEnd}`).format = {
    font: { name: "Aptos", size: 10, color: "#1F2937" },
    verticalAlignment: "top",
    wrapText: true,
    borders: { preset: "outside", style: "thin", color: "#E5E7EB" },
    fill: field.required ? "#FFF2F2" : "#FFFFFF",
  };
  if (field.required) {
    dataSheet.getRange(`${column}6`).format = {
      fill: "#FCE4D6",
      font: { name: "Aptos", size: 10, bold: true, color: "#C00000" },
      horizontalAlignment: "center",
      verticalAlignment: "center",
      wrapText: true,
      borders: { preset: "outside", style: "thin", color: "#D9A6A6" },
    };
  }
});

const table = dataSheet.tables.add(`A6:${lastCol}${dataRowEnd}`, true);
table.name = "DoudianBookImport";

const narrowColumns = new Set(["SKU库存", "SKU重量(g)", "版次", "印次"]);
const mediumColumns = new Set(["店铺ID", "抖店商品ID", "抖店类目ID", "出版时间", "定价", "SKU价格", "发货时效", "库存扣减方式", "售后承诺"]);
fields.forEach((field, index) => {
  const column = colLetter(index);
  const width = narrowColumns.has(field.name) ? 86
    : mediumColumns.has(field.name) ? 128
      : field.name.includes("URL") || field.name.includes("路径") || field.name.includes("标题") || field.name.includes("规格") ? 220
        : field.group === "抖店类目属性" ? 150 : 160;
  dataSheet.getRange(`${column}:${column}`).format.columnWidthPx = width;
});

dataSheet.getRange(`A1:${lastCol}1`).format.rowHeightPx = 34;
dataSheet.getRange(`A2:${lastCol}4`).format.rowHeightPx = 30;
dataSheet.getRange(`A5:${lastCol}6`).format.rowHeightPx = 42;
dataSheet.getRange(`A${dataRowStart}:${lastCol}${dataRowEnd}`).format.rowHeightPx = 30;
dataSheet.freezePanes.freezeRows(6);
dataSheet.freezePanes.freezeColumns(4);

const setListValidation = (fieldName, values) => {
  if (!values?.length) return;
  const inlineText = values.join(",");
  if (values.length > 30 || inlineText.length > 220) return;
  const index = fields.findIndex((field) => field.name === fieldName);
  if (index < 0) return;
  const column = colLetter(index);
  dataSheet.getRange(`${column}${dataRowStart}:${column}${dataRowEnd}`).dataValidation = {
    allowBlank: !requiredFields.has(fieldName),
    list: { inCellDropDown: true, source: values },
  };
};

fields.forEach((field) => {
  setListValidation(field.name, field.options ?? field.optionValues);
});

const setNumberValidation = (fieldName, type, formula1) => {
  const index = fields.findIndex((field) => field.name === fieldName);
  if (index < 0) return;
  const column = colLetter(index);
  dataSheet.getRange(`${column}${dataRowStart}:${column}${dataRowEnd}`).dataValidation = {
    allowBlank: !requiredFields.has(fieldName),
    rule: { type, operator: "greaterThan", formula1 },
    errorAlert: { style: "stop", title: "数值不符合要求", message: `${fieldName} 的数值不符合填写规则。` },
  };
};
["SKU价格", "定价"].forEach((fieldName) => setNumberValidation(fieldName, "decimal", 0));
["SKU库存", "SKU重量(g)", "版次", "印次"].forEach((fieldName) => setNumberValidation(fieldName, "whole", 0));
["SKU价格", "定价"].forEach((fieldName) => {
  const index = fields.findIndex((field) => field.name === fieldName);
  if (index >= 0) dataSheet.getRange(`${colLetter(index)}${dataRowStart}:${colLetter(index)}${dataRowEnd}`).format.numberFormat = "0.00";
});
["店铺ID", "抖店商品ID", "外部商品编码", "抖店类目ID", "ISBN编号", "商品ISBN编码（全量）", "外部SKU编码"].forEach((fieldName) => {
  const index = fields.findIndex((field) => field.name === fieldName);
  if (index >= 0) dataSheet.getRange(`${colLetter(index)}${dataRowStart}:${colLetter(index)}${dataRowEnd}`).format.numberFormat = "@";
});

fieldSheet.getRange("A1:H1").merge();
fieldSheet.getRange("A1").values = [["抖店字段说明"]];
fieldSheet.getRange("A1").format = {
  fill: "#0F766E",
  font: { name: "Aptos", size: 15, bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
};
fieldSheet.getRange("A2:H2").values = [["字段分组", "字段名称", "是否必填", "抖店字段路径", "属性ID", "接口类型", "填写规则", "示例/默认值"]];
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
  field.required ? "是" : "否",
  field.doudianPath,
  field.propertyId ?? "",
  field.propertyType ?? "",
  field.note,
  field.example ?? "",
]);
fieldSheet.getRange("A3").values = fieldRows;
fieldSheet.getRange(`A3:H${fields.length + 2}`).format = {
  font: { name: "Aptos", size: 10, color: "#1F2937" },
  verticalAlignment: "top",
  wrapText: true,
  borders: { preset: "inside", style: "thin", color: "#E5E7EB" },
};
fieldSheet.getRange(`A2:H${fields.length + 2}`).format.borders = { preset: "outside", style: "thin", color: "#94A3B8" };
["A", "B", "C", "D", "E", "F", "G", "H"].forEach((column, index) => {
  fieldSheet.getRange(`${column}:${column}`).format.columnWidthPx = [120, 170, 80, 260, 90, 90, 440, 220][index];
});
fieldSheet.freezePanes.freezeRows(2);

dictSheet.getRange("A1:F1").merge();
dictSheet.getRange("A1").values = [["抖店选项字典"]];
dictSheet.getRange("A1").format = {
  fill: "#0F766E",
  font: { name: "Aptos", size: 15, bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
};
dictSheet.getRange("A2:F2").values = [["字段名称", "属性ID", "可选值ID", "可选值名称", "是否来自接口", "说明"]];
dictSheet.getRange("A2:F2").format = {
  fill: "#E5E7EB",
  font: { name: "Aptos", size: 10, bold: true, color: "#111827" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
  borders: { preset: "outside", style: "thin", color: "#94A3B8" },
};
const dictRows = [];
for (const field of fields) {
  const options = field.optionValues?.length
    ? categoryProperties.find((property) => property.property_id === field.propertyId)?.options ?? []
    : (field.options ?? []).map((name) => ({ value_id: "", value: "", name }));
  for (const option of options) {
    dictRows.push([
      field.name,
      field.propertyId ?? "",
      option.value_id ?? option.value ?? "",
      option.name ?? option.property_value_name ?? "",
      field.propertyId ? "是" : "否",
      field.propertyId ? "来自 product.getCateProperty" : "本地抖店映射选项",
    ]);
  }
}
if (!dictRows.length) dictRows.push(["", "", "", "", "", ""]);
dictSheet.getRange("A3").values = dictRows;
dictSheet.getRange(`A3:F${dictRows.length + 2}`).format = {
  font: { name: "Aptos", size: 10, color: "#1F2937" },
  verticalAlignment: "top",
  wrapText: true,
  borders: { preset: "inside", style: "thin", color: "#E5E7EB" },
};
dictSheet.getRange(`A2:F${dictRows.length + 2}`).format.borders = { preset: "outside", style: "thin", color: "#94A3B8" };
["A", "B", "C", "D", "E", "F"].forEach((column, index) => {
  dictSheet.getRange(`${column}:${column}`).format.columnWidthPx = [180, 90, 120, 260, 100, 240][index];
});
dictSheet.freezePanes.freezeRows(2);

ruleSheet.getRange("A1:E1").merge();
ruleSheet.getRange("A1").values = [["抖店接口规则"]];
ruleSheet.getRange("A1").format = {
  fill: "#0F766E",
  font: { name: "Aptos", size: 15, bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
};
ruleSheet.getRange("A2:E2").values = [["规则来源", "规则项", "接口返回", "模板处理", "备注"]];
ruleSheet.getRange("A2:E2").format = {
  fill: "#E5E7EB",
  font: { name: "Aptos", size: 10, bold: true, color: "#111827" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
  borders: { preset: "outside", style: "thin", color: "#94A3B8" },
};
const ruleRows = [
  ["token.create", "授权店铺", `${tokenData.shop_name ?? ""} / ${tokenData.shop_id ?? ""}`, "仅记录店铺身份，不写入敏感授权信息", "测试店铺真实授权元数据"],
  ["product.getCateProperty", "类目属性数量", `${categoryProperties.length} 个`, "生成“抖店类目属性”字段组", `类目 ${doudianLeafCategoryId}`],
  ["product.getCateProperty", "必填类目属性", categoryProperties.filter((item) => item.required === 1).map((item) => `${item.property_name}(${item.property_id})`).join("、"), "必填字段标红并带 *", "按接口 required=1"],
  ["product.getProductUpdateRule", "标题长度", `${titleLimitRule.min_length ?? ""}-${titleLimitRule.max_length ?? ""} 字`, "写入商品标题规则", "按接口规则提示"],
  ["product.getProductUpdateRule", "发货时效", deliveryOptions.join(" / "), "生成发货时效下拉选项", "normal_rule 与 step_rule 合并去重"],
  ["product.getProductUpdateRule", "规格规则", `最多 ${productSpecRule.max_spec_num_limit ?? ""} 级规格，组合数上限 ${productSpecRule.spec_combination_limit ?? ""}`, "写入 SKU 规格填写说明", "来自 product_spec_rule"],
  ["product.getProductUpdateRule", "售后规则", afterSaleOptions.join(" / "), "生成售后承诺下拉选项", "来自 after_sale_rule"],
  ["product.getProductUpdateRule", "资质提示", qualificationRule.map((item) => item.name).join(" / "), "仅作为本地模拟提示", "不执行落库"],
  ...precheckResults.map((item) => [
    "product.publishPreCheck",
    item.check_type,
    `${item.check_result_code} / ${cleanHtml(item.check_result_msg)}`,
    item.check_result_code === 0 ? "模拟校验通过" : "保留风险提示，不执行落库",
    `log_id: ${precheckResponse.log_id ?? ""}`,
  ]),
];
ruleSheet.getRange("A3").values = ruleRows;
ruleSheet.getRange(`A3:E${ruleRows.length + 2}`).format = {
  font: { name: "Aptos", size: 10, color: "#1F2937" },
  verticalAlignment: "top",
  wrapText: true,
  borders: { preset: "inside", style: "thin", color: "#E5E7EB" },
};
ruleSheet.getRange(`A2:E${ruleRows.length + 2}`).format.borders = { preset: "outside", style: "thin", color: "#94A3B8" };
["A", "B", "C", "D", "E"].forEach((column, index) => {
  ruleSheet.getRange(`${column}:${column}`).format.columnWidthPx = [190, 170, 420, 260, 240][index];
});
ruleSheet.freezePanes.freezeRows(2);

mappingSheet.getRange("A1:G1").merge();
mappingSheet.getRange("A1").values = [["抖店字段映射"]];
mappingSheet.getRange("A1").format = {
  fill: "#0F766E",
  font: { name: "Aptos", size: 15, bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
};
mappingSheet.getRange("A2:G2").values = [["字段分组", "来源字段", "抖店字段路径", "属性ID", "是否必填", "转换规则", "备注"]];
mappingSheet.getRange("A2:G2").format = {
  fill: "#E5E7EB",
  font: { name: "Aptos", size: 10, bold: true, color: "#111827" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
  borders: { preset: "outside", style: "thin", color: "#94A3B8" },
};
const mappingRows = fields.map((field) => [
  field.group,
  field.name,
  field.doudianPath,
  field.propertyId ?? "",
  field.required ? "是" : "否",
  field.name.includes("价格") || field.name === "定价" ? "金额按元填写，写入接口时换算或格式化" :
    field.group === "抖店类目属性" ? "写入 product_format_new，select 字段按抖店枚举值映射" :
      field.name.includes("URL") ? "多值用英文竖线 | 分隔后转数组或详情图" : "原样或按抖店字段类型转换",
  field.note,
]);
mappingSheet.getRange("A3").values = mappingRows;
mappingSheet.getRange(`A3:G${mappingRows.length + 2}`).format = {
  font: { name: "Aptos", size: 10, color: "#1F2937" },
  verticalAlignment: "top",
  wrapText: true,
  borders: { preset: "inside", style: "thin", color: "#E5E7EB" },
};
mappingSheet.getRange(`A2:G${mappingRows.length + 2}`).format.borders = { preset: "outside", style: "thin", color: "#94A3B8" };
["A", "B", "C", "D", "E", "F", "G"].forEach((column, index) => {
  mappingSheet.getRange(`${column}:${column}`).format.columnWidthPx = [130, 180, 260, 90, 80, 320, 420][index];
});
mappingSheet.freezePanes.freezeRows(2);

await fs.mkdir(outputDir, { recursive: true });

const renderTargets = [
  { sheetName: "抖店商品数据", range: `A1:${colLetter(Math.min(12, lastColIndex))}20` },
  { sheetName: "抖店字段说明", range: "A1:H30" },
  { sheetName: "抖店选项字典", range: "A1:F80" },
  { sheetName: "抖店接口规则", range: "A1:E20" },
  { sheetName: "抖店字段映射", range: "A1:G40" },
];
for (const target of renderTargets) {
  const blob = await workbook.render({ sheetName: target.sheetName, range: target.range, scale: 1.3 });
  if (writePreviewImages) {
    await fs.writeFile(path.join(outputDir, `${target.sheetName}.png`), Buffer.from(await blob.arrayBuffer()));
  }
}

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "final formula error scan",
});
console.log(errors.ndjson);

const forbiddenTerms = await workbook.inspect({
  kind: "match",
  searchTerm: "淘宝|拼多多|快手",
  options: { useRegex: true, maxResults: 20 },
  summary: "single channel scope scan",
});
console.log(forbiddenTerms.ndjson);

const dataPreview = await workbook.inspect({
  kind: "table",
  range: `抖店商品数据!A1:${colLetter(Math.min(12, lastColIndex))}12`,
  include: "values",
  tableMaxRows: 12,
  tableMaxCols: 13,
  tableMaxCellChars: 120,
});
console.log(dataPreview.ndjson);

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(outputPath);
