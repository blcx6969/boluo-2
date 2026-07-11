# 菠萝2号

> DeepSeek + CellClaw + Tasker + MCP 一体化桌面客户端

菠萝2号 是一个功能强大的 AI 代理管理中心，集成了 DeepSeek 对话、手机自动化控制 (CellClaw)、任务自动化引擎 (Tasker) 和 MCP 协议连接。

## 功能特性

- **DeepSeek 对话** - 接入 DeepSeek API，支持流式对话
- **CellClaw 手机控制** - 通过 HTTP API 控制手机操作（点击、滑动、输入等）
- **Tasker 自动化** - 配置定时触发、通知监听等自动化工作流
- **MCP 连接** - 支持 Model Context Protocol，连接日历、云盘、知识库
- **美观界面** - 支持深色/浅色/跟随系统主题

## 快速开始

### 方法一：源码运行

`ash
# 1. 安装依赖
npm install

# 2. 启动应用
npm start
`

### 方法二：构建安装包

`ash
# Windows
npm run build:win

# Linux
npm run build:linux

# macOS
npm run build:mac

# 全部平台
npm run build:all
`

### 方法三：使用安装脚本

Windows 用户可以直接运行：
- installer/install.bat (命令行)
- installer/install.ps1 (PowerShell)

## 环境要求

- Node.js 16+ (构建时需要)
- npm 8+

## 配置说明

1. 启动应用后进入设置页面
2. 配置 DeepSeek API Key（必填）
3. 可选配置 CellClaw / Tasker 地址
4. 可选连接 MCP 服务器

## 技术栈

- 前端: 原生 HTML/CSS/JS (PWA)
- 桌面端: Electron 28
- 构建: electron-builder
- API: DeepSeek API, HTTP, WebSocket

## 项目结构

`
boluo-2/
  main.js              Electron 主进程
  preload.js           Electron 预加载脚本
  package.json         项目配置
  index.html           主页面 (PWA)
  manifest.json        PWA 清单
  css/style.css        样式
  js/app.js            核心应用逻辑
  js/chat.js           对话模块
  js/dashboard.js      仪表盘
  js/agents.js         代理管理
  js/mcp.js            MCP 连接
  js/settings.js       设置
  icons/               应用图标
  installer/           安装脚本
  dist/                构建输出
`
