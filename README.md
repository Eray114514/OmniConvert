# OmniConverter (全能格式转换器)

一个高级、简洁且强大的本地文件格式转换器。支持图片、电子书、文档等多种格式的批量处理与转换，**完全本地运行，保护您的隐私**。

## ✨ 特性

- **🔒 隐私优先**：所有文件转换和处理都在您的浏览器本地完成，无需上传到任何服务器，数据绝对安全。
- **⚡️ 高效处理**：支持多文件拖拽和批量处理，提高您的工作效率。
- **🖼️ 丰富格式**：
  - **图像**：支持 PNG、JPEG、WebP、AVIF 等多种格式的互相转换和压缩。
  - **文档/电子书**：支持常见文档格式的高效解析和转换。
  - **音视频**：内置 FFmpeg WASM 支持强大的音视频格式转换处理。
- **🎨 现代 UI**：支持浅色/深色模式无缝切换，提供流畅的动画体验和清晰的操作反馈。
- **🚀 零依赖运行**：纯前端应用，借助 WebAssembly 在浏览器端释放强大算力。

## 🛠️ 技术栈

- **前端框架**：[React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **构建工具**：[Vite 6](https://vitejs.dev/)
- **样式方案**：[Tailwind CSS v4](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/)
- **状态管理**：[Zustand](https://github.com/pmndrs/zustand)
- **核心转换库**：
  - 音视频：`@ffmpeg/ffmpeg`
  - 图像处理：`@jsquash/png`, `@jsquash/jpeg`, `@jsquash/webp`, `@jsquash/avif`
  - 文档处理：`mammoth` (Word), `pdf-lib` (PDF)
- **图标库**：[Lucide React](https://lucide.dev/)

## 📦 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/Eray114514/OmniConvert.git
```

### 2. 安装依赖

确保您的环境中已安装 [Node.js](https://nodejs.org/) (推荐 v18+)。

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

打开浏览器并访问控制台提示的本地链接（通常为 `http://localhost:5173`）即可预览应用。

### 4. 构建生产环境代码

```bash
npm run build
```

构建产物将生成在 `dist` 目录中。如需预览生产环境构建效果，可运行：

```bash
npm run preview
```

## 📄 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。
