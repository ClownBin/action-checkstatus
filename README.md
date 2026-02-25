# action-checkstatus
检查 workflow 执行状态是否正确

## Action 功能简介

这是一个使用 JavaScript 实现的 GitHub Action，用于**检查当前正在执行的 GitHub Actions workflow 运行状态**。  
Action 会：

- 查询当前 run 的状态（`status`）和结果（`conclusion`）
- 将结果通过输出参数暴露出来
- 可选地在当前 run 已完成且结果不是 `success` 时，让步骤失败

## 输入参数（inputs）

- **`github-token`（可选）**  
  - 说明：用于调用 GitHub Actions API 的 token  
  - 默认：如果不传，则使用环境变量 `GITHUB_TOKEN`

- **`fail-on-non-success`（可选）**  
  - 说明：当当前 workflow run 已完成且 `conclusion` 不是 `success` 时，是否让该步骤失败  
  - 可选值：`"true"` / `"false"`（字符串）  
  - 默认：`"false"`

## 输出参数（outputs）

- **`run-id`**：当前 workflow run 的 ID
- **`status`**：当前 workflow run 的状态（例如：`queued` / `in_progress` / `completed`）
- **`conclusion`**：当前 workflow run 的结果（例如：`success` / `failure` / `cancelled` 等，仅在 `completed` 时有值）

## 使用示例

在任意仓库的 workflow 中使用本 Action 示例（假设本仓库为 `ClownBin/action-checkstatus`，并使用 `main` 分支）：

```yaml
name: Demo - Check Current Workflow Status

on:
  push:
    branches:
      - main
  workflow_dispatch: {}

jobs:
  check-status:
    runs-on: ubuntu-latest
    permissions:
      actions: read
      contents: read

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Check current workflow run status
        id: check
        uses: ClownBin/action-checkstatus@main
        with:
          # 可选：在当前运行已完成且结果不是 success 时让步骤失败
          fail-on-non-success: "true"
          # 可选：自定义 token，不填则默认使用 GITHUB_TOKEN
          # github-token: ${{ secrets.MY_PAT }}

      - name: Echo result
        run: |
          echo "Run ID: ${{ steps.check.outputs['run-id'] }}"
          echo "Status: ${{ steps.check.outputs.status }}"
          echo "Conclusion: ${{ steps.check.outputs.conclusion }}"
```
