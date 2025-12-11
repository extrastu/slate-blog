---
title: Electron Builder 适配 Liquid Glass Icons for macOS 26
description: 了解如何在 electron-builder 中适配 macOS 26 的 Liquid Glass Icons，使用新的 .icon 格式替代传统的 .icns 格式，提升应用图标的视觉效果。
tags:
  - Electron
  - macOS
  - Development
pubDate: 2025-12-10
---

![Electron Builder 适配 Liquid Glass Icons for macOS 26 首页截图](/electron-builder-liquid-glass-icons-screenshot.png)

## 概述

macOS 26 引入了 Liquid Glass Icons（液态玻璃图标）新特性，这是一种全新的图标格式，提供了更加现代和流畅的视觉效果。electron-builder 从 Xcode 26+ 开始支持这种新的 `.icon` 格式，本文将介绍如何在 Electron 应用中适配这一新特性。

## Liquid Glass Icons 简介

Liquid Glass Icons 是 macOS 26 的新图标系统，相比传统的 `.icns` 格式，它提供了：

- **更流畅的视觉效果**：支持更丰富的透明度和光影效果
- **更好的缩放质量**：在不同尺寸下都能保持清晰的显示效果
- **现代化的设计语言**：符合 macOS 26 的设计规范

## electron-builder 图标配置

根据 [electron-builder 官方文档](https://www.electron.build/icons.html)，macOS 支持三种图标格式：

### 1. `.icon` 格式（推荐）

`.icon` 是 Apple Icon Composer asset 格式，是 macOS 26+ 的首选格式。

**要求：**
- Xcode 26+ (`actool` 26+)
- macOS 15+
- 图标尺寸至少 512x512

**优势：**
- electron-builder 会自动将其编译成 asset catalog (`Assets.car`)
- 通过 `CFBundleIconName` 引用
- 支持 Liquid Glass Icons 特性

### 2. `.icns` 格式（传统）

`.icns` 是传统的 macOS 图标格式，仍然被支持但已不是首选。

**特点：**
- 兼容性更好，支持旧版本 macOS
- 直接复制到 app bundle 并通过 `CFBundleIconFile` 引用
- DMG 卷图标仍使用 `.icns` 格式

### 3. `icon.png` 格式（通用）

`icon.png` 是通用格式，electron-builder 会自动转换为所需格式。

## 配置步骤

### 步骤 1：准备图标文件

创建或获取 `.icon` 格式的图标文件：

```bash
# 图标文件应放置在 buildResources 目录（默认为 build）
build/
  └── icon.icon  # macOS 26+ Liquid Glass Icon
```

### 步骤 2：配置 electron-builder

在 `package.json` 或 `electron-builder.yml` 中配置：

```json
{
  "build": {
    "mac": {
      "icon": "build/icon.icon"
    }
  }
}
```

或者使用 YAML 配置：

```yaml
mac:
  icon: build/icon.icon
```

### 步骤 3：处理 DMG 图标（可选）

如果使用默认 DMG 卷图标且只提供了 `.icon` 文件，建议显式设置 DMG 图标为 `.icns` 格式：

```yaml
mac:
  icon: build/icon.icon
dmg:
  icon: build/icon.icns  # DMG 卷图标仍使用 .icns
```

## 创建 .icon 文件

### 方法 1：使用 Xcode 26+

1. 打开 Xcode 26+
2. 创建新的 Asset Catalog
3. 添加 App Icon Set
4. 导出为 `.icon` 格式

### 方法 2：使用工具转换

可以使用以下工具将现有图标转换为 `.icon` 格式：

- **Icon Composer**：Apple 官方工具
- **AppIcon Generator**：在线工具
- **MakeAppIcon**：专业图标生成工具

### 方法 3：从 PNG 转换

如果有高质量的 PNG 图标（至少 512x512），可以使用 `iconutil` 命令：

```bash
# 创建临时目录结构
mkdir -p MyIcon.iconset

# 添加不同尺寸的图标
cp icon-16.png MyIcon.iconset/icon_16x16.png
cp icon-32.png MyIcon.iconset/icon_16x16@2x.png
# ... 添加其他尺寸

# 使用 iconutil 转换为 .iconset
iconutil -c icns MyIcon.iconset

# 然后在 Xcode 中转换为 .icon 格式
```

## 完整配置示例

```json
{
  "name": "my-electron-app",
  "version": "1.0.0",
  "main": "main.js",
  "build": {
    "appId": "com.example.myapp",
    "productName": "My App",
    "mac": {
      "icon": "build/icon.icon",
      "category": "public.app-category.productivity",
      "target": [
        {
          "target": "dmg",
          "arch": ["x64", "arm64"]
        }
      ]
    },
    "dmg": {
      "icon": "build/icon.icns",
      "background": "build/background.png"
    }
  }
}
```

## 注意事项

### 1. 系统要求

- **开发环境**：需要 macOS 15+ 和 Xcode 26+
- **构建工具**：`actool` 26+ 是必需的
- **目标系统**：应用可以在 macOS 15+ 上运行

### 2. 兼容性考虑

如果应用需要支持旧版本 macOS，建议：

- 同时提供 `.icon` 和 `.icns` 文件
- 在配置中优先使用 `.icon`，fallback 到 `.icns`
- 测试在不同 macOS 版本上的显示效果

### 3. DMG 图标

DMG 卷图标仍然使用 `.icns` 格式，即使应用图标使用 `.icon` 格式。确保同时提供两种格式：

```yaml
mac:
  icon: build/icon.icon  # 应用图标
dmg:
  icon: build/icon.icns  # DMG 卷图标
```

## 验证图标

构建完成后，验证图标是否正确应用：

```bash
# 检查 app bundle 中的图标
ls -la "dist/mac/MyApp.app/Contents/Resources/"

# 查看 Info.plist 中的图标配置
plutil -p "dist/mac/MyApp.app/Contents/Info.plist" | grep -i icon
```

应该看到 `CFBundleIconName` 或 `CFBundleIconFile` 的配置。

## 最佳实践

1. **图标尺寸**：确保源图标至少 512x512，推荐 1024x1024
2. **设计规范**：遵循 Apple 的 Human Interface Guidelines
3. **测试验证**：在不同 macOS 版本上测试图标显示效果
4. **文件组织**：将图标文件放在 `buildResources` 目录中
5. **版本控制**：将图标文件纳入版本控制，但注意文件大小

## 故障排除

### 问题 1：构建时提示找不到 actool

**解决方案**：确保安装了 Xcode 26+，并检查命令行工具：

```bash
xcode-select --print-path
xcode-select --switch /Applications/Xcode.app/Contents/Developer
```

### 问题 2：图标显示为默认 Electron 图标

**解决方案**：
- 检查图标文件路径是否正确
- 确认图标文件格式为 `.icon`、`.icns` 或 `.png`
- 验证图标文件大小至少 512x512

### 问题 3：DMG 图标不显示

**解决方案**：显式设置 DMG 图标为 `.icns` 格式：

```yaml
dmg:
  icon: build/icon.icns
```

## 总结

适配 macOS 26 的 Liquid Glass Icons 可以让你的 Electron 应用拥有更现代的外观。通过使用 `.icon` 格式并正确配置 electron-builder，你可以充分利用这一新特性，同时保持与旧版本 macOS 的兼容性。

记住关键点：
- 使用 `.icon` 格式作为首选
- 提供 `.icns` 作为 fallback 和 DMG 图标
- 确保开发环境满足系统要求
- 在不同 macOS 版本上测试验证

:::info
参考文档：[electron-builder Icons Documentation](https://www.electron.build/icons.html)
:::

