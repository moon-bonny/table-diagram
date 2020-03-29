## 项目文件注意事项

- const文件夹只存放变量文件，公共函数应放在utils文件夹下或是该文件夹下的utils.js文件中
- 接口路径统一写在const/api-modules文件中，通过const/api.js导出，接口模块文件名与接口前缀名保持一致，如 `/deepexi-daas-metrics` 文件名则为 `metrics`
- utils/form-rules文件夹中的文件为表单验证规则，其中rules.js为可复用表单校验规则方法，调用方法参照src/pages/modeling/dimension-table/index.vue文件的代码。

## 项目及代码文件命名规则

- 全部采用小写方式，以中划线分隔。
例：my-project-name

- 有复数结构时，要采用复数命名法。
例：scripts, styles, images, data-models


## 代码规范

- 缩进均采用2个空格缩进。
- 单个组件/页面的行数应控制在700-1000行左右，多出这个范围内的应考虑拆分以便于维护。

## HTML

### 语法
- 在属性上，使用双引号，不要使用单引号；
- 属性名全小写，用中划线做分隔符；
- 不要在自动闭合标签结尾处使用斜线（HTML5 规范 指出他们是可选的）；
- 不要忽略可选的关闭标签，例：</li> 和 </body>。

### 减少标签数量
- 在编写HTML代码时，需要尽量避免多余的父节点；
- 很多时候，需要通过迭代和重构来使HTML变得更少。
- 任何时候都要用尽量小的复杂度和尽量少的标签来解决问题。

## CSS, LESS

### 命名
- 类名使用小写字母，以中划线分隔
- id采用驼峰式命名
- Less中的变量、函数、混合、placeholder采用驼峰式命名

```CSS
/* class */
.element-content {
    ...
}

/* id */
#myDialog {
    ...
}
```

```LESS
/* 变量 */
@colorBlack: #000;
```

### 颜色
- 颜色16进制用小写字母；
- 颜色16进制尽量用简写。

```CSS
/* not good */
.element {
    color: #ABCDEF;
    background-color: #001122;
}

/* good */
.element {
    color: #abcdef;
    background-color: #012;
}
```

### 媒体查询
- 尽量将媒体查询的规则靠近与他们相关的规则，不要将他们一起放到一个独立的样式文件中，或者丢在文档的最底部，这样做只会让大家以后更容易忘记他们。

### LESS相关
- 嵌套最多不能超过5层。

### 杂项
- 不允许有空的规则；
- 元素选择器用小写字母；
- 去掉小数点前面的0；
- 去掉数字中不必要的小数点和末尾的0；
- 属性值'0'后面不要加单位；
- 无前缀的标准属性应该写在有前缀的属性后面；
- 不要在同个规则里出现重复的属性，如果重复的属性是连续的则没关系；
- 不要在一个文件里出现两个相同的规则；
- 用 border: 0; 代替 border: none;；
- 选择器不要超过4层(在less中如果超过4层应该考虑用嵌套的方式来写);
- 发布的代码中不要有 @import；
- 尽量少用 `*` 选择器。

## JavaScript

### 换行
换行的地方，行末必须有','或者运算符；
以下几种情况不需要换行：
- 下列关键字后：else, catch, finally
- 代码块'{'前
以下几种情况需要换行：
- 代码块'{'后和'}'前
- 变量赋值后

```js
// no need line break with 'else', 'catch', 'finally'
if (condition) {
    ...
} else {
    ...
}

try {
    ...
} catch (e) {
    ...
} finally {
    ...
}

// not good
function test()
{
    ...
}

// good
function test() {
    ...
}

// not good
var a, foo = 7, b,
    c, bar = 8;

// good
var a,
    foo = 7,
    b, c, bar = 8;
```

### 单行注释
- 双斜线后，必须跟一个空格；
- 缩进与下一行代码保持一致；
- 可位于一个代码行的末尾，与代码间隔一个空格。

```js
if (condition) {
    // if you made it here, then all security checks passed
    allowed();
}

var zhangsan = 'zhangsan'; // one space after code
```

### 多行注释
最少三行, '*'后跟一个空格，具体参下边的写法；
建议在以下情况下使用：
- 难于理解的代码段
- 可能存在错误的代码段
- 浏览器特殊的HACK代码
- 业务逻辑强相关的代码

```js
/*
 * one space after '*'
 */
var x = 1;
```

### 文档注释
各类标签@param, @method等请参考usejsdoc和JSDoc Guide；
建议在以下情况下使用：
- 所有常量
- 所有函数，编辑器中配置好可一键输入。
- 所有类

```js
/**
 * @func foo
 * @desc 一个带参数的函数
 * @param {string} a - 参数a
 * @param {number} b=1 - 参数b默认值为1
 * @param {string} c=1 - 参数c有两种支持的取值</br>1—表示x</br>2—表示xx
 * @param {object} d - 参数d为一个对象
 * @param {string} d.e - 参数d的e属性
 * @param {string} d.f - 参数d的f属性
 * @param {object[]} g - 参数g为一个对象数组
 * @param {string} g.h - 参数g数组中一项的h属性
 * @param {string} g.i - 参数g数组中一项的i属性
 * @param {string} [j] - 参数j是一个可选参数
 */
function foo(a, b, c, d, g, j) {
    ...
}

```

### 变量命名
- 标准变量采用驼峰式命名，例：userName
- 'ID'在变量名中全大写
- 'URL'在变量名中全大写
- 'Android'在变量名中大写第一个字母
- 'iOS'在变量名中小写第一个，大写后两个字母
- 常量全大写，用下划线连接
- 构造函数，组件变量大写第一个字母，例：PersonClass
- 事件函数以on开头，一般的函数采用动词开头命名，call或者是handle等，采用驼峰式命名，例：onClick，onConfirm

```js
var thisIsMyName;

var goodID;

var reportURL;

var AndroidVersion;

var iOSVersion;

var MAX_COUNT = 10;

function Person(name) {
    this.name = name;
}
```

### 变量声明
- 一个函数作用域中所有的变量声明尽量提到函数首部，用一个let/const声明，不允许出现两个连续的let/const声明。

```js
function doSomethingWithItems(items) {
    // use one let
    let value = 10,
        result = value + 10,
        i,
        len;

    for (i = 0, len = items.length; i < len; i++) {
        result += 10;
    }
}
```

### 数组、对象
- 对象属性名不需要加引号；
- 对象以缩进的形式书写，不要写在一行；
- 数组、对象最后不要有逗号。

```js
// not good
var a = {
    'b': 1
};

var a = {b: 1};

var a = {
    b: 1,
    c: 2,
};

// good
var a = {
    b: 1,
    c: 2
};
```

### 括号
下列关键字后必须有大括号（即使代码块的内容只有一行）：if, else, for, while, do, switch, try, catch, finally, with。

```js
// not good
if (condition)
    doSomething();

// good
if (condition) {
    doSomething();
}
```

### null
适用场景：
- 初始化一个将来可能被赋值为对象的变量
- 与已经初始化的变量做比较
- 作为一个参数为对象的函数的调用传参
- 作为一个返回对象的函数的返回值

不适用场景：
- 不要用null来判断函数调用时有无传参
- 不要与未初始化的变量做比较inally, with。

```js
// not good
function test(a, b) {
    if (b === null) {
        // not mean b is not supply
        ...
    }
}

var a;

if (a === null) {
    ...
}

// good
var a = null;

if (a === null) {
    ...
}
```

### undefined
- 永远不要直接使用undefined进行变量判断；
- 使用typeof和字符串'undefined'对变量进行判断。

```js
// not good
if (person === undefined) {
    ...
}

// good
if (typeof person === 'undefined') {
    ...
}

```

### jshint
- 用'===', '!=='代替'==', '!='；
- for-in里一定要有hasOwnProperty的判断；
- 不要在内置对象的原型上添加方法，如Array, Date；
- 不要在内层作用域的代码里声明了变量，之后却访问到了外层作用域的同名变量；
- 变量不要先使用后声明；
- 不要在一句代码中单单使用构造函数，记得将其赋值给某个变量；
- 不要在同个作用域下声明同名变量；
- 不要在一些不需要的地方加括号，例：delete(a.b)；
- 不要使用未声明的变量（全局变量需要加到.jshintrc文件的globals属性里面）；
- 不要声明了变量却不使用；
- 不要在应该做比较的地方做赋值；
- debugger不要出现在提交的代码里；
- 数组中不要存在空元素；
- 不要在循环内部声明函数；
- 不要像这样使用构造函数，例：new function () { ... }, new Object；

### 杂项
- 对上下文this的引用只能使用'_this', 'that', 'self'其中一个来命名；
- 行尾不要有空白字符；
- switch的falling through和no default的情况一定要有注释特别说明；
- 不允许有空的代码块。