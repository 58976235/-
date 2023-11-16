### financialconversion
```financialconversion```适用于需要转换阿拉伯数字与中文数字的场景。

>特点如下:
> - 以字符串的方式转换，没有超大数及浮点数等问题(请自行对原数据进行四舍五入等操作)
> - 支持口语化
> - 支持自定义转换(不论是兆还是厘都可以用)
> - 对超大数支持用争议较少的兆代替万亿
> - 当然,你还可以把中文数字再转回阿拉伯数字
#### 安装
 ```node
 npm install financialconversion --save
 ```
#### 引用
```js
import num2str from 'financialconversion';
```

#### 示例
```js
// 返回 壹佰亿零壹拾壹万零壹佰贰拾圆贰角壹分
const money1 = num2str.numToStrMoney(10000110120.21) 
// 返回 10000110120.21
const money2 = num2str.strToNumMoney('壹佰亿零壹拾壹万零壹佰贰拾圆贰角壹分')

// 返回 壹佰亿零壹拾壹万零壹佰贰拾点贰壹
const money3 = num2str.numToStr(10000110120.21) 
// 返回 10000110120.21
const money4 = num2str.strToNum('壹佰亿零壹拾壹万零壹佰贰拾点贰壹')
```

#### 不止于此
我们还可以根据自己的需求谁知不同的字符串
##### 例如
```js
// 对0和1进行了修改
num2str.setNums({ 0: "凌", 1: "一", 2: "贰", 3: "叁", 4: "肆", 5: "伍", 6: "陆", 7: "柒", 8: "捌", 9: "玖" })


// 返回 一佰亿凌一拾一万凌一佰贰拾点贰一
const money1 = num2str.numToStr(10000110120.21) 
// 返回 10000110120.21
const money2 = num2str.strToNum('一佰亿凌一拾一万凌一佰贰拾点贰一')

num2str.setUnit({10: "时", 100: "摆", 1000: "签", 10000: "万", 100000000: "亿", 1000000000000: "兆"})
// 返回 一摆亿凌一时一万凌一摆贰时点贰一
const money3 = num2str.numToStr(10000110120.21) 
```

|API| 参数 |介绍
|--|--|--|
| setNums | nums{ Object  }|详情见下 （获取参数示例）|
| setUnit | units{ Object  }|详情见下 （获取参数示例）|
| setDecUnit| decUnit{ Object }|详情见下 （获取参数示例）|
| setMoneyUnits| moneyUnits{ Object }|详情见下 （获取参数示例）|
| numToStr| num{ number }|数字转中文
| numToStrMoney| num{ number }|数字金额转中文金额
| strToNum| num{ number }|中文转数字
| strToNumMoney| num{ number }|中文金额转数字金额

#### 获取参数示例
```js
// 返回所有参数示例
num2str.getDefaultParams()
```
```js
{
  nums: {
    '0': '零',
    '1': '壹',
    '2': '贰',
    '3': '叁',
    '4': '肆',
    '5': '伍',
    '6': '陆',
    '7': '柒',
    '8': '捌',
    '9': '玖'
  },
  units: {
    '10': '拾',
    '100': '佰',
    '1000': '仟',
    '10000': '万',
    '100000000': '亿',
    '1000000000000': '兆'
  },
  decUnit: { '.': '点', '/': '整' },
  moneyUnits: { '1': '圆', '0.1': '角', '0.01': '分', '0.001': '毫', '0.0001': '厘' }
}
```
