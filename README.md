# 菠萝2号

> 手机上的专属 AI 助手 — DeepSeek + CellClaw + Tasker + MCP

菠萝2号是一个功能强大的 AI 代理管理中心，专为手机设计。

## 功能特性

- **DeepSeek 对话** — 接入 DeepSeek API，支持流式对话
- **CellClaw 手机控制** — 通过 HTTP API 控制手机操作
- **Tasker 自动化** — 配置自动化工作流
- **MCP 连接** — 连接日历、云盘、知识库
- **PWA 支持** — 可添加至手机桌面，离线可用

## 安装方式

### 方式一：PWA（推荐）
1. 手机浏览器打开网站
2. 点击"添加到主屏幕"
3. 手机桌面出现图标，点开即用

### 方式二：Android APK
```bash
npm install
npx cap sync
cd android && ./gradlew assembleDebug
```

### 方式三：GitHub Releases
打 tag 后 Actions 自动构建 APK

## 配置说明
1. 打开设置页面
2. 配置 DeepSeek API Key（必填）
3. 可选 CellClaw / Tasker / MCP

## 技术栈
前端: HTML/CSS/JS (PWA)
移动端: Capacitor + Android WebView
API: DeepSeek, HTTP, WebSocket
