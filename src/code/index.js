/**
 * @function: 阿拉伯金额转中文大写
 * @param {number} money
 * @return {string}
 * @example 
 *  //return '伍仟零伍万贰仟贰佰伍拾陆圆贰角壹分'
 *  lowerToupper(50052256.21)
 */
export function lowerToupper(money) {
  //汉字的数字
  let cnNums = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"]
  //基本单位
  let cnIntRadice = ["", "拾", "佰", "仟"]
  //对应整数部分扩展单位
  let cnIntUnits = ["圆", "万", "亿", "兆"]
  //对应小数部分单位
  let cnDecUnits = ["角", "分", "毫", "厘"]

  const { integerArr, decimalArr } = moneySplit(money)
  // 超出范围则返回传入数据
  if (integerArr.length > 4 || decimalArr.length > 4) {
    return '超出范围'
  }
  let resArr = []
  // 整数部分处理
  integerArr.forEach((item, index) => {
    // 暂存区
    let _arr = []
    // 子数组倒叙遍历,先确定个位
    item.reverse().forEach((value, unit) => {
      // 拿到当前值的位数
      let unitStr = cnIntRadice[unit]
      // 如果当前是0 ,则单位不要
      if (value == 0) {
        let first = _arr[0] || ''
        // 判断暂存区第一项是否为0, 或者 第一个数据则直接跳过循环
        if (first == '零' || value == unit) {
          return
        }
        unitStr = ''
      }
      // 将当前值插入暂存区
      _arr.unshift(cnNums[value] + unitStr)
    })
    // 为暂存区添加单位
    _arr.push(cnIntUnits[index])
    // 将暂存区添加到结果
    resArr.unshift(..._arr)
  })
  let decimalStrArr = []
  // 小数部分处理
  decimalArr.forEach((item, index) => {
    decimalStrArr.push(cnNums[item] + cnDecUnits[index])
  })
  let _decimal = decimalStrArr.join('')
  let decimal = _decimal == '' ? '整' : _decimal
  let res = resArr.join('') + decimal
  return res

  function moneySplit(money) {
    // 转文本类型
    let moneyStr = money.toString();
    // 通过小数点分割
    let moneyArr = moneyStr.split('.')
    // 整数部分
    let integerNum = moneyArr[0] || ''
    // 小数部分
    let decimalNum = moneyArr[1] || ''
    // 整数部分倒叙
    let integerArr = integerNum.split('').reverse()
    let decimalArr = decimalNum.split('')

    let resArr = []
    let arr = []
    // 4个一组进行分组 对应单位 ["圆", "万", "亿", "兆"]
    integerArr.forEach(item => {
      arr.unshift(item)
      if (arr.length == 4) {
        resArr.unshift(arr)
        arr = []
      }
    })
    if (arr.length) {
      resArr.unshift(arr)
    }
    return {
      integerArr: resArr.reverse(), // 倒叙 先确定个位
      decimalArr
    }
  }
}
/**
 * @function: 中文大写金额转阿拉伯金额
 * @param {string} money
 * @return {number}
 * @example 
 *  //return 50052256.21
 *  upperTolower('伍仟零伍万贰仟贰佰伍拾陆圆贰角壹分')
 */
export function upperTolower(money) {
  const nums = {
    '零': 0,
    '壹': 1,
    '贰': 2,
    '叁': 3,
    '肆': 4,
    '伍': 5,
    '陆': 6,
    '柒': 7,
    '捌': 8,
    '玖': 9,
  }
  const radice = {
    '圆': 1,
    '拾': 10,
    '佰': 100,
    '仟': 1000,
    '万': 10000,
    '亿': 100000000,
    '兆': 10000000000000
  }
  const decUnits = {
    "角": 1,
    "分": 1,
    "毫": 1,
    "厘": 1
  }
  // 切割为字符串
  let list = money.split('')
  let res = '0'
  // 暂存值
  let pre = 0
  // 是否为字符串拼接
  let strAdd = false
  list.forEach(item => {
    let num = nums[item] || 'false'
    let radiceNum = radice[item] || 'false'
    if (num != 'false' && radiceNum == 'false') {
      // 暂存
      pre = num
    } else if (radiceNum != 'false') {
      if (strAdd) {
        let _num = res / 10
        res = _num.toString() + (pre * radiceNum).toString()
        strAdd = false
      } else {
        res = parseFloat(res) + (pre * radiceNum)
      }
    } else {
      if (item == '零') {
        strAdd = true
      } else if (decUnits[item] == 1) {
        res += item == '角' ? '.' + pre : pre.toString()
      }
    }
  })
  return parseFloat(res)
}
