# table-diagram
table-diagram用于拖拽生成关系图的业务中，主要有添加节点，删除节点和添加节点关联关系功能。

# 简介

table-diagram用于拖拽生成关系图的业务中，主要有添加节点，删除节点和添加节点关联关系功能。

# 配置选项

## basic

通过引入组件table-diagram，配置关系图数据及事件。

### 数据配置

#### diagramList

关系图数据，必传，类型为object。只介绍组件中通用的属性，属性如下：

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| id | 节点id | int |   | 1 |
| level | 节点层级 | int |   | 1 |
| name | 节点名字 | string |   | &#39;&#39; |
| path | 节点路径 | array |   | — |
| children | 节点的子节点 | array |   | [] |
| canEdit | 是否可以编辑节点关系 | boolean | true/false | true |
| canAdd | 是否可以能在该节点上添加子节点 | boolean | true/false | true |

![image.png](https://github.com/moon-bonny/table-diagram/tree/master/src/assets/images/simple-diagram.png "image.png")

```js
<template>
  <table-diagram
    ref="tableDiagram"
    :diagram-list="diagramList">
  </table-diagram>
</template>
import TableDiagram from '@/components/table-diagram/table-diagram'
export default {
	data() {
    return {
      diagramList: [{ //关系图
        "id": 1,
        "nodeId": "1177069532016017462",
        "tableCode": "yatun",
        "tableType": 1,
        "tableId": "1177069531248459854",
        "canEdit": true,
        "canAdd": true,
        "name": "雅图测试模型",
        "level": 1,
        "sortNo": 1,
        "path": ["0"],
        "children": [{
          "id": 2,
          "nodeId": "1186487106747236447",
          "tableCode": "xinjianyige",
          "tableType": 0,
          "tableId": "1186181932308758574",
          "canEdit": true,
          "canAdd": false,
          "name": "新建一个",
          "level": 2,
          "sortNo": 1,
          "path": ["0", "0"],
          "children": []
        }, {
          "id": 3,
          "nodeId": "1186538434315944031",
          "tableCode": "zhegzheg",
          "tableType": 0,
          "tableId": "1184005572228284485",
          "canEdit": true,
          "canAdd": false,
          "name": "用一次就作废",
          "level": 2,
          "sortNo": 1,
          "path": ["0", "1"],
          "children": []
        }]
      }]
    }
  },
}
```

#### **nodeId**

当前需添加的节点id，仅用于添加节点id使用，可选，类型为int，默认为0。

#### **isEditable**

是否可编辑关系图，包括添加/删除节点和编辑节点关系，可选，类型为Boolean，默认为true。

beforeDeleteNode

删除节点前回调，用于判断是否删除节点，可选，类型为Function。

### **事件方法**

#### **after-add-node**

添加节点后事件。

参数如下：

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| parentNode | 父节点对象 | obj |   |   |
| node | 节点对象 | obj |   |   |
| id | 节点id | int |   |   |

#### **delete-node**

删除节点事件。

参数如下：

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| item | 当前节点对象 | obj |   |   |
| e | 事件对象 | obj |   |   |

#### **choose-node**

选择当前节点事件。

参数如下：

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| e | 事件对象 | obj |   |   |

#### **add-relation**

点击+按钮添加关联。

参数如下：

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| parentItem | 父节点对象 | obj |   |   |
| item | 当前节点对象 | obj |   |   |

### **弹窗**

#### **数据变量**

#### **tableRelation**

表关系弹窗数据，可选，类型为Object，属性如下：

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| type | 关联关系类型 | string |   | inner join |
| leftOpts | 关联关系字段选项(左表) | array |   | 1 |
| rightOpts | 关联关系字段选项(右表) | array |   | &#39;&#39; |

#### **tableRelations**

表关系弹窗字段关联数据，可选，类型为Object，组件需用到的必要属性如下：

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| table1 | 左表数据对象（对象中有name属性） | obj |   |   |
| table2 | 右表数据对象 | obj |   |   |
| foreignKeys | 字段对应关系对象（每个元素对象中都有table1，table2） | array |   |   |

#### **事件方法**

#### **dialog-close**

关闭弹窗事件，点击左上角关闭按钮, 点击取消按钮, 点击弹窗蒙层回调。

#### **dialog-confirm**

点击弹窗确定按钮事件。

参数如下：

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| dialogTitle | 弹窗标题 | string |   |   |

#### **table-relation-type-change**

表关系类型触发change事件时，获取当前选择的关系类型。

参数如下：

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| currTableRelationType | 当前选择表关系类型 | string |   |   |
