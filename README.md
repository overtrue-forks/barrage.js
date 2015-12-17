# barrage.js
Barrage for JavaScript.

### 文档
| 名称 | 类型 | 默认值 | 描述 |
| --- | ---- | ----- | --- |
| `loop` | boolean | `false` | 是否循环 |
| `time` | object | `{min: 5000, max: 10000}` | 随机时间范围 |
| `barrage` | array | `[]` | 弹幕集合 |
| `maxLength` | number | `5` | 单屏最多显示弹幕数量 |
| `color` | array | `[]` | 随机显示颜色，如果不随机，请用样式控制 |
| `container` | object | `null` | 父级容器 |

### 方法
| 名称 | 参数 | 返回值 | 描述 |
| --- | ----- | ----- | --- |
| `start` | -- | undefined | 开始动画 |
| `pause` | -- | undefined | 暂停动画 |
| `insert` | array | array | 添加弹幕 |
