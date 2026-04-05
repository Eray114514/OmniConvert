# Tasks

- [x] Task 1: 基础设施与跨域隔离配置
  - [x] SubTask 1.1: 在 `vite.config.ts` 中配置中间件/插件，注入 `Cross-Origin-Opener-Policy: same-origin` 和 `Cross-Origin-Embedder-Policy: require-corp`。
  - [x] SubTask 1.2: 安装并初始化 Tailwind CSS、PostCSS、Autoprefixer。
  - [x] SubTask 1.3: 安装 UI 依赖：`lucide-react`, `clsx`, `tailwind-merge`, `framer-motion`。

- [ ] Task 2: 深色优先 (Dark-First) UI 组件重构
  - [ ] SubTask 2.1: 配置 Tailwind 为深色模式，设计现代化的毛玻璃 (Glassmorphism) 与暗黑背景风格。
  - [ ] SubTask 2.2: 重构 `Header.tsx`，增加“100%本地处理・隐私安全”等徽章和精致的 Logo 设计。
  - [ ] SubTask 2.3: 重构 `Dropzone.tsx`，增加文件拖入时的发光反馈与平滑动画。
  - [ ] SubTask 2.4: 重构 `FileCard.tsx`，设计包含真实进度条、格式选择下拉框和炫酷操作按钮的现代 UI。

- [x] Task 3: 图像转换引擎 (WASM) 接入
  - [x] SubTask 3.1: 安装图像处理依赖（如 `@jsquash/jpeg`, `@jsquash/png`, `@jsquash/webp` 等）。
  - [x] SubTask 3.2: 编写 `services/imageConverter.ts` 模块，通过 ArrayBuffer 实现真实的高质量图像格式互转。

- [x] Task 4: 音视频转换引擎 (FFmpeg.wasm) 接入
  - [x] SubTask 4.1: 安装 `@ffmpeg/ffmpeg` 和 `@ffmpeg/util`。
  - [x] SubTask 4.2: 编写 `services/mediaConverter.ts` 模块，初始化 FFmpeg 实例，实现视频转 GIF、视频提取音频及视频格式互转。
  - [x] SubTask 4.3: 将 FFmpeg 的 `progress` 事件暴露给前端，驱动 UI 进度条。

- [x] Task 5: 文档处理引擎接入
  - [x] SubTask 5.1: 安装 `mammoth` 和 `pdf-lib`。
  - [x] SubTask 5.2: 编写 `services/documentConverter.ts`，实现基本的 DOCX 文本解析为 PDF 的逻辑。

- [x] Task 6: 业务逻辑组装与全局状态管理
  - [x] SubTask 6.1: 在 `App.tsx` (或引入 Zustand) 重构全局状态，管理多个文件的加载、转换中、完成、失败等状态。
  - [x] SubTask 6.2: 根据文件类别 (category) 将上传的文件精确分发至对应的真实转换引擎模块。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 6] depends on [Task 2], [Task 3], [Task 4], [Task 5]
