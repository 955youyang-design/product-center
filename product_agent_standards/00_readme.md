# 产品 Agent 标准目录说明

| 字段 | 内容 |
|---|---|
| 文档名称 | 00_readme.md |
| 文档类型 | 标准目录说明 |
| 适用范围 | 标准规范目录 |
| 适用角色 | 产品经理、产品 Agent、交互设计、研发、测试 |
| 当前版本 | V1 |
| 维护人 | 产品 Agent 标准维护者 |
| 更新时间 | 2026-04-17 |

## 1. 目录定位

`product_agent_standards/` 只存放标准规范，不存放任何项目实例内容。

这个目录用于回答三类问题：

1. 产品 Agent 应该如何通过与产品对话完成从 0 到 1 的产品设计。
2. 产品 Agent 应该输出哪些必要文档，以及这些文档之间的上下游关系是什么。
3. 当需求持续迭代时，文档应该如何稳定演进，而不是反复推倒重写。

不应放入本目录的内容包括：

- 某个项目的具体功能范围
- 某个项目的页面设计细节
- 某个项目的对象、接口、测试用例
- 任何与具体业务口径强绑定的实例文档

## 2. 命名规范

### 2.1 标准目录文件命名

本目录内所有文件统一使用：

`NN_topic.md`

命名规则如下：

- `NN` 为两位数字序号，用于固定阅读顺序
- `topic` 使用英文小写 snake_case
- 文件名保持稳定，不因中文标题微调而频繁改名
- 文件内容可以使用中文，便于产品经理和产品 Agent 直接协作

建议预留编号分段，避免后续扩展时顺序混乱：

- `00-09`：总则与入口
- `10-19`：对话与工作流
- `20-29`：模板与输出约束
- `30-39`：迭代、版本与归档
- `40-49`：协同与治理

### 2.2 项目实例文档命名

后续项目实例文档建议单独放在 `docs/` 目录下，并遵循以下结构：

```text
docs/
  00-总览层/
  01-端产品层/
  02-专题机制层/
  03-页面设计层/
  04-数据与接口层/
  05-验收与测试层/
```

项目实例文档建议命名为：

- 层级目录：`NN-中文层级名`
- 层内文件：`NN-中文文档主题.md`
- 页面设计层子目录：`[端名称]/[一级功能]/[页面组]/NN-文档主题.md`

标准目录与项目目录分离后，标准文件保持稳定，项目实例文件可以按项目节奏持续迭代。

## 3. 标准文件清单

| 文件 | 作用 |
|---|---|
| `01_unified_standard.md` | 统一要求文档，定义总原则、工作流、交付边界 |
| `02_dialogue_workflow.md` | 定义产品 Agent 与产品对话的工作流 |
| `03_baseline_artifacts.md` | 定义三份输入基线：功能清单表、页面树表、功能承载图 |
| `04_layered_docs_spec.md` | 定义项目实例文档的分层结构、最小输出和命名要求 |
| `05_iteration_change_spec.md` | 定义需求变化后的影响分析、回写顺序和版本治理 |
| `06_output_checklist.md` | 定义从 0 到 1 以及后续迭代的交付检查清单 |
| `07_required_output_manifest.md` | 定义强制输出文档清单、触发条件和最低内容要求 |
| `08_multi_agent_collaboration.md` | 定义多产品经理 Agent 的任务拆分、汇总与审校规则 |
| `09_page_scaffold_spec.md` | 定义页面开发脚手架的作用、最小结构和与页面文档的映射关系 |
| `10_issue_confirmation_spec.md` | 定义文档阶段的问题整理、阻塞分级和人类确认规则 |
| `11_template_library.md` | 提供基线表、分层文档、页面脚手架等标准模板骨架 |
| `12_id_traceability_spec.md` | 定义稳定 ID、命名规则和需求追踪矩阵规则 |
| `13_review_signoff_spec.md` | 定义正式评审、签收门槛和评审意见闭环规则 |
| `14_delivery_index_spec.md` | 定义项目交付索引与当前有效版本清单规则 |
| `15_baseline_storage_format_spec.md` | 定义三份输入基线的存放位置、载体格式和引用方式 |
| `16_navigation_naming_resilience_spec.md` | 定义中文文档名、菜单名高频变化时的稳定键与解耦规则 |

## 4. 推荐阅读顺序

如果只看一份文件，优先看：

- `01_unified_standard.md`

如果要完整执行一轮从对话到文档输出的工作流，按以下顺序阅读：

1. `01_unified_standard.md`
2. `02_dialogue_workflow.md`
3. `03_baseline_artifacts.md`
4. `04_layered_docs_spec.md`
5. `05_iteration_change_spec.md`
6. `06_output_checklist.md`
7. `07_required_output_manifest.md`
8. `08_multi_agent_collaboration.md`
9. `09_page_scaffold_spec.md`
10. `10_issue_confirmation_spec.md`
11. `11_template_library.md`
12. `12_id_traceability_spec.md`
13. `13_review_signoff_spec.md`
14. `14_delivery_index_spec.md`
15. `15_baseline_storage_format_spec.md`
16. `16_navigation_naming_resilience_spec.md`

## 5. 使用方式

当产品 Agent 接到一个新项目时，建议按如下顺序推进：

1. 先依据 `01_unified_standard.md` 明确总体要求。
2. 按 `02_dialogue_workflow.md` 与产品完成结构化对话。
3. 按 `03_baseline_artifacts.md` 先收敛三份输入基线。
4. 按 `04_layered_docs_spec.md` 输出项目实例文档。
5. 当范围变化时，按 `05_iteration_change_spec.md` 回写。
6. 在交付前，用 `06_output_checklist.md` 逐项检查。

## 6. 边界说明

本目录是“标准包”，不是“项目包”。

后续如果要新增规范，应优先新增本目录文件；如果要新增某个项目的内容，应放入项目实例目录，而不是写回本目录。
