# gitbook-plugin-platform-tabs

一个用于 SDK 文档的 GitBook 插件，提供平台切换（Android/iOS/HarmonyOS）和语言切换（Java/Kotlin、ObjC/Swift、TypeScript/JavaScript）功能。

## 功能特性

- **平台切换**：支持 Android、iOS、HarmonyOS 三大平台的内容切换
- **语言切换**：支持同一平台下不同编程语言的代码切换
- **两级标签**：支持单级平台标签和双级（平台+语言）代码示例标签
- **状态记忆**：自动记住用户的平台和语言选择偏好
- **图标支持**：内置 Font Awesome 图标，平台标签更直观

## 安装

在 `book.json` 中添加插件：

```json
{
  "plugins": ["platform-tabs"]
}
```

然后运行：

```bash
gitbook install
```

## 配置

可在 `book.json` 中配置默认平台：

```json
{
  "plugins": ["platform-tabs"],
  "pluginsConfig": {
    "platform-tabs": {
      "defaultPlatform": "Android",
      "platforms": [
        "Android",
        "iOS",
        "HarmonyOS"
      ]
    }
  }
}
```

## 使用方法

### 单级平台标签

使用 `platformtabs` 实现简单的平台内容切换：

```markdown
<!-- platformtabs id="demo-1" -->
<!-- platform: Android -->
这是 Android 平台的内容。

安装 SDK：
```gradle
implementation 'com.example:sdk:1.0.0'
```
<!-- /platform -->
<!-- platform: iOS -->
这是 iOS 平台的内容。

安装 SDK：
```ruby
pod 'ExampleSDK', '~> 1.0.0'
```
<!-- /platform -->
<!-- platform: HarmonyOS -->
这是 HarmonyOS 平台的内容。

安装 SDK：
```json
"dependencies": {
  "@example/sdk": "^1.0.0"
}
```
<!-- /platform -->
<!-- /platformtabs -->
```

### 双级代码示例标签

使用 `codesample` 实现平台+语言的双级切换：

```markdown
<!-- codesample id="demo-2" -->
<!-- platform: Android -->
<!-- lang: Java -->
```java
public class Example {
    public void init() {
        SDK.init(context);
    }
}
```
<!-- /lang -->
<!-- lang: Kotlin -->
```kotlin
class Example {
    fun init() {
        SDK.init(context)
    }
}
```
<!-- /lang -->
<!-- /platform -->
<!-- platform: iOS -->
<!-- lang: Objective-C -->
```objc
@implementation Example
- (void)init {
    [SDK initWithContext:context];
}
@end
```
<!-- /lang -->
<!-- lang: Swift -->
```swift
class Example {
    func initialize() {
        SDK.init(context: context)
    }
}
```
<!-- /lang -->
<!-- /platform -->
<!-- /codesample -->
```

## 语法说明

### 平台标签

| 标签 | 说明 |
|------|------|
| `<!-- platformtabs id="唯一ID" -->` | 开始单级平台标签组 |
| `<!-- /platformtabs -->` | 结束单级平台标签组 |
| `<!-- codesample id="唯一ID" -->` | 开始双级代码示例标签组 |
| `<!-- /codesample -->` | 结束双级代码示例标签组 |
| `<!-- platform: 平台名 -->` | 开始平台内容块 |
| `<!-- /platform -->` | 结束平台内容块 |
| `<!-- lang: 语言名 -->` | 开始语言内容块（仅用于 codesample） |
| `<!-- /lang -->` | 结束语言内容块 |

### 支持的平台

- `Android` - 显示 Android 图标
- `iOS` - 显示 Apple 图标
- `HarmonyOS` - 显示移动设备图标

### 常用语言组合

| 平台 | 推荐语言 |
|------|----------|
| Android | Java、Kotlin |
| iOS | Objective-C、Swift |
| HarmonyOS | TypeScript、JavaScript |

## 项目结构

```
gitbook-plugin-platform-tabs/
├── index.js              # 插件主入口
├── package.json          # 包配置文件
├── assets/
│   ├── platform-tabs.css # 样式文件
│   └── platform-tabs.js  # 前端交互脚本
└── utils/
    └── defined.js        # 工具函数
```

## 样式自定义

插件提供了完整的 CSS 类名，可以通过自定义样式覆盖默认样式：

```css
/* 平台标签容器 */
.platform-tabs-container { }

/* 平台标签头部 */
.platform-tabs-header { }

/* 平台标签按钮 */
.platform-tab { }
.platform-tab.active { }

/* 平台内容区域 */
.platform-tabs-content { }
.platform-content { }
.platform-content.active { }

/* 语言标签（双级模式） */
.language-tabs-header { }
.language-tab { }
.language-tab.active { }
.language-tabs-content { }
.language-content { }
.language-content.active { }
```

## 兼容性

- GitBook >= 3.0.0

## 许可证

MIT
