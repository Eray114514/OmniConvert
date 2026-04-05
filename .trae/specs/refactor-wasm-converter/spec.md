# 纯前端 WASM 全能格式转换器重构 Spec

## Why
当前项目使用浏览器原生 Canvas 进行简单的虚假图像转换，并通过延迟 (`setTimeout`) 模拟其他复杂格式的转换。这导致转换质量差、不支持高级格式（如音视频、PDF），缺乏实际使用价值。用户希望在“完全免费、零服务器成本”的前提下，打造一个性能最强、交互体验最佳、且严格遵循“深色优先原则 (Dark Mode First)”的真实格式转换工具。

## What Changes
- **彻底重构 UI**：基于 Tailwind CSS 搭建，采用深色优先的现代化拟物/玻璃态设计，大幅优化拖拽、真实进度条和格式选择的视觉交互体验。
- **引入 WASM 音视频引擎**：使用 `@ffmpeg/ffmpeg` (WebAssembly) 实现纯前端的视频转 GIF、视频提取音频、视频格式互转。
- **引入 WASM 图像引擎**：使用 `@jsquash` 系列库实现极速、高质量、支持更多现代格式（WebP, AVIF 等）的图像转换。
- **引入纯前端文档引擎**：使用 `mammoth` 和 `pdf-lib` 等库实现 DOCX 解析、PDF 生成及处理。
- **配置跨域隔离**：在 Vite 开发环境及生产部署配置中加入 `Cross-Origin-Opener-Policy` 和 `Cross-Origin-Embedder-Policy` 响应头，以解锁 `SharedArrayBuffer`，启用 FFmpeg 多线程加速。

## Impact
- Affected specs: 格式转换能力、全局 UI 设计、跨域安全策略。
- Affected code: `services/conversionService.ts`、`components/*`、`vite.config.ts`、`App.tsx` 等。
- **BREAKING**: 完全移除旧版的虚假 `setTimeout` 和 `Canvas` 转换逻辑；所有文件处理将真正消耗客户端 CPU 和内存进行本地硬件级转换。

## ADDED Requirements
### Requirement: 纯客户端真实转换
系统 SHALL 在用户的浏览器内存中，利用 WebAssembly 引擎完成所有音视频、图片和部分文档的格式转换，文件数据 SHALL NOT 离开用户设备（100% 隐私安全）。

#### Scenario: 视频转 GIF 或 音频
- **WHEN** 用户上传 MP4 文件并选择目标格式为 GIF 或 MP3
- **THEN** FFmpeg.wasm 实例将被加载，并在浏览器中利用多线程进行本地解码与编码，并在 UI 上实时反馈真实的转换进度，最终提供下载。

### Requirement: 深色优先交互设计 (Dark Mode First)
系统 SHALL 默认呈现极致的深色主题。组件包含发光边框、毛玻璃背景 (Glassmorphism)、平滑的过渡动画，以提供沉浸式的高级视觉体验。

## MODIFIED Requirements
### Requirement: Vite 运行与打包配置
增加跨域隔离 (COOP 和 COEP) 插件或中间件配置，以允许浏览器分配 SharedArrayBuffer 内存，保障 WASM 引擎多线程全速运行。

## REMOVED Requirements
### Requirement: 旧版 Canvas 图像转换与模拟延迟
**Reason**: 转换质量低，且模拟延迟无实际业务价值，无法作为真正的产品级工具使用。
**Migration**: 彻底剥离，按类别分别桥接至底层 WASM 和纯 JS 处理 API。
