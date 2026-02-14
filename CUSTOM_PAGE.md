# Custom Pages 文档

本文档记录本次新增的两个自定义页面模块：

1. Validators（custom 版本）
2. DHCs（设备列表与详情）

## 1. Validators（custom）

### 路由

- `/validators`
- `/validators/[id]`

### 页面入口文件

- `pages/validators/index.tsx`
- `pages/validators/[id].tsx`

### 主要 UI 组件

- `ui/pages/ValidatorsCustom.tsx`
- `ui/pages/ValidatorCustom.tsx`
- `ui/validators/custom/ValidatorsTable.tsx`
- `ui/validators/custom/ValidatorsListItem.tsx`
- `ui/validators/custom/ValidatorsTableItem.tsx`
- `ui/validators/custom/ValidatorDetails.tsx`
- `ui/validators/custom/ValidatorStatistic.tsx`
- `ui/validators/custom/ValidatorStats.tsx`

### 启用条件

- 需要开启 validators feature，且链类型为 custom。
- 通过环境变量控制：`NEXT_PUBLIC_VALIDATORS_CHAIN_TYPE=custom`

### 依赖的数据接口

- `customData:validators` -> `/node/validators`
- `customData:validatorDetail` -> `/node/validator-detail`
- `customData:validatorStatistic` -> `/node/validator-statistic`
- `customData:validatorEpochInfo` -> `/node/epoch-info`
- `customData:validatorEraInfo` -> `/node/era-info`
- RPC: `staking_validatorInfo`（通过 `useCustomRpcApi`，请求 `chain.rpcUrls[0]`）

### 页面能力

- 列表页支持状态筛选、搜索、分页。
- 桌面端为表格视图，移动端为列表视图。
- 详情页支持基础信息、RPC 数据补充、统计图表。

## 2. DHCs

### 路由

- `/dhcs`
- `/dhcs/[id]`

### 页面入口文件

- `pages/dhcs/index.tsx`
- `pages/dhcs/[id].tsx`

### 主要 UI 组件

- `ui/pages/DHCs.tsx`
- `ui/pages/DHC.tsx`
- `ui/dhcs/DHCDevicesTable.tsx`
- `ui/dhcs/DHCDeviceTableItem.tsx`
- `ui/dhcs/DHCDeviceListItem.tsx`
- `ui/dhcs/DHCDetails.tsx`
- `ui/dhcs/DHCStatistic.tsx`
- `ui/dhcs/DHCStatistics.tsx`

### 启用条件

- 导航显示依赖环境变量：`NEXT_PUBLIC_SHOW_CUSTOM_PAGES` 包含 `"dhcs"`。
- 当前 SSR guard 复用了 validators guard：
  - 列表页使用 `validators` guard
  - 详情页使用 `validatorDetails` guard
- 因此实际运行中建议与 validators custom 一起启用（`NEXT_PUBLIC_VALIDATORS_CHAIN_TYPE=custom`）。

### 依赖的数据接口

- `customData:deviceInfo` -> `/blockchain/device:info`
- `customData:devices` -> `/blockchain/device:owner`
- `customData:device` -> `/blockchain/device`
- `customData:deviceStatistic` -> `/blockchain/device:statistic`

### 页面能力

- 列表页支持统计卡片、分页、桌面表格/移动列表双视图。
- 详情页支持设备状态信息、在线状态展示、奖励与惩罚统计图。

## 3. 通用环境变量

- `NEXT_PUBLIC_CUSTOM_DATA_API_HOST`：customData API host（必须）
- `NEXT_PUBLIC_CUSTOM_DATA_API_PROXY`：customData API basePath（可选）
- `NEXT_PUBLIC_NETWORK_RPC_URL`：Validators RPC 数据请求地址（建议配置）
- `NEXT_PUBLIC_VALIDATORS_CHAIN_TYPE=custom`：启用 validators custom 模块
- `NEXT_PUBLIC_SHOW_CUSTOM_PAGES=["dhcs"]`：显示 DHCs 导航入口

### 示例配置

```bash
NEXT_PUBLIC_VALIDATORS_CHAIN_TYPE='custom'
NEXT_PUBLIC_SHOW_CUSTOM_PAGES="['dhcs']"
NEXT_PUBLIC_CUSTOM_DATA_API_HOST=https://api-testnet.safex.network
NEXT_PUBLIC_CUSTOM_DATA_API_PROXY=safex-network-backend-testnet
```

注：`NEXT_PUBLIC_SHOW_CUSTOM_PAGES` 在解析时建议使用 JSON 数组格式（如 `["dhcs"]`）。

## 4. 本地验证建议

1. 配置上述环境变量并启动前端。
2. 打开 `/validators`，验证筛选/搜索/分页和移动端布局。
3. 打开 `/validators/{address}`，验证详情和图表。
4. 打开 `/dhcs`，验证统计卡片、分页和移动端布局。
5. 打开 `/dhcs/{deviceId}`，验证详情和图表。

## 5. 相关类型与资源定义

- 资源定义：`lib/api/services/customData.ts`
- Validators 类型：`types/api/customData/validators.ts`
- DHC 类型：`types/api/customData/devices.ts`
- 路由元数据映射：
  - `lib/metadata/getPageOgType.ts`
  - `lib/metadata/templates/title.ts`
  - `lib/metadata/templates/description.ts`
  - `lib/mixpanel/getPageType.ts`
