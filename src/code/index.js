
/**
 * @function: 数字转中文
 * @param {*} num 数字
 * @param {*} defaultParams 转换字符
 * @param {*} isMoney 是否是金额
 * @return {string} 
 */
function num2strHandler(num, defaultParams, isMoney) {
  try {
    let str = num.toString()
    let strArr = str.split('.')
    let integerArr = strArr[0].split('').reverse()
    let decimalArr = (strArr[1] || '').split('')

    let integerArray = []
    let arr = []
    integerArr.forEach(item => {
      if ((arr[arr.length - 1] == 0 || arr[arr.length - 1] == '&!$%#&') && item == 0) {
        arr.push('&!$%#&')
      } else {
        arr.push(item)
      }
      if (arr.length == 4) {
        integerArray.push(arr)
        arr = []
      }
    })
    if (arr.length) {
      integerArray.push(arr)
    }
    let resArr = []
    integerArray.forEach((item, index) => {
      let strArr = []
      item.forEach((child, childIndex) => {
        let _num = Math.pow(10, childIndex)
        let numStr = defaultParams.nums[child] || ''
        let unitStr = defaultParams.units[_num] || ''
        if (numStr == '' || numStr == defaultParams.nums[0]) {
          unitStr = ''
        }
        strArr.unshift(numStr + unitStr)
      })
      let _num = Math.pow(10, index * 4)
      let unitStr = defaultParams.units[_num] || ''
      if (strArr[strArr.length - 1] == defaultParams.nums[0]) {
        strArr[strArr.length - 1] = ''
      }
      let hasNum = strArr.some(item => item != '')
      if (hasNum) {
        strArr.push(unitStr)
      }
      resArr.unshift(...strArr)
    })
    let decimalResArr = []
    decimalArr.forEach((item, index) => {
      let _num = defaultParams.nums[item]
      if (isMoney) {
        let _n = 1 / Math.pow(10, index + 1)
        let moneyUnitStr = defaultParams.moneyUnits[_n]
        decimalResArr.push(_num + moneyUnitStr)
      } else {
        decimalResArr.push(_num)
      }
    })
    if (isMoney) {
      resArr.push(defaultParams.moneyUnits[1])
      if (decimalArr.length == 0) {
        resArr.push(defaultParams.decUnit['/'])
      }
    } else {
      if (decimalArr.length > 0) {
        decimalResArr.unshift(defaultParams.decUnit['.'])
      }
    }
    let integerStr = resArr.join('')
    let decimalStr = decimalResArr.join('')
    return integerStr + decimalStr
  } catch (error) {
    console.error("请检查传入的数字是否正确");
  }
}

/**
 * @function: 中文转数字
 * @param {*} num 中文数字
 * @param {*} defaultParams 转换字符
 * @param {*} isMoney 是否是金额
 * @return {string} 
 */
function str2NumHandler(str, defaultParams, isMoney) {
  try {
    let myParams = {}
    Object.keys(defaultParams).forEach(childKey => {
      let obj = {}
      Object.keys(defaultParams[childKey]).forEach(key => {
        obj[defaultParams[childKey][key]] = key
      })
      myParams[childKey] = obj
    })
    if (isMoney) {
      Object.keys(defaultParams.moneyUnits).forEach(key => {
        if (key == 1) {
          str = str.replace(defaultParams.moneyUnits[key], '.')
        } else {
          str = str.replace(defaultParams.moneyUnits[key], '')
        }
      })
    } else {
      str = str.replace(defaultParams.decUnit['.'], '.')
    }


    let strArr = str.split('.')
    let integerArr = strArr[0].split('')
    let decimalArr = (strArr[1] || '').split('')
    let res = '0'
    let numArr = []
    integerArr.forEach(key => {
      let isSplit = false
      let str = myParams.nums[key] || ''
      let unit = myParams.units[key] || 0
      if (str != '') {
        numArr.push(str)
      }
      if (unit > 0) {
        for (let i = 1; i < 4; i++) {
          if (Math.pow(10000, i) == unit) {
            isSplit = true
          }
        }
        if (!isSplit) {
          numArr[numArr.length - 1] = numArr[numArr.length - 1] * unit
        }
      }
      if (isSplit) {
        let _res = numArr.reduce((a, b) => a * 1 + b * 1)
        _res = _res * unit
        res = parseFloat(res) + _res
        isSplit = false
        numArr = []
      }
    })

    let _res = numArr.reduce((a, b) => a * 1 + b * 1)
    res = parseFloat(res) + _res
    let decResArr = []
    decimalArr.forEach(key => {
      decResArr.push(myParams.nums[key])
    })
    let integer = res
    let decimal = decResArr.join('')
    let resNum = integer
    if (decResArr.length) {
      resNum = integer + "." + decimal
    }
    return parseFloat(resNum)
  } catch (error) {
    throw ('请检查传入的中文是否和设置的参数匹配')
  }
}

class Num2Str {
  defaultParams = {
    nums: {
      0: "零", 1: "壹", 2: "贰", 3: "叁", 4: "肆", 5: "伍", 6: "陆", 7: "柒", 8: "捌", 9: "玖"
    },
    units: {
      10: "拾", 100: "佰", 1000: "仟", 10000: "万", 100000000: "亿", 1000000000000: "兆"
    },
    decUnit: {
      '.': "点", '/': '整'
    },
    moneyUnits: {
      1: "圆", 0.1: "角", 0.01: "分", 0.001: "毫", 0.0001: "厘"
    }
  }
  constructor() { }
  setNums(nums) {
    if (typeof nums != "object" || Array.isArray(nums)) {
      console.error("setNums:请传入对象形式的参数")
      return
    }
    let num = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    let check = Object.keys(nums).every(item => {
      return num.includes(parseFloat(item))
    })
    if (!check) {
      console.error("setNums:传入参数不正确")
      return
    }
    this.defaultParams.nums = Object.assign(this.defaultParams.nums, nums)
  }
  setUnit(units) {
    try {
      if (typeof units != "object" || Array.isArray(units)) {
        console.error("setUnit:请传入对象形式的参数")
        return
      }
      let num = [10, 100, 1000, 10000, 100000000, 1000000000000]
      let check = Object.keys(units).every(item => {
        return num.includes(parseFloat(item)) || num.includes(parseFloat(item))
      })
      if (!check) {
        console.error("setUnit:传入参数不正确")
        return
      }
      this.defaultParams.units = Object.assign(this.defaultParams.units, units)
    } catch (error) {

    }
  }
  setDecUnit(decUnit) {
    if (typeof decUnit != "object" || Array.isArray(decUnit)) {
      console.error("setDecUnit:请传入对象形式的参数")
      return
    }
    let num = ['.', '/']
    let check = Object.keys(decUnit).every(item => {
      return num.includes(item)
    })
    if (!check) {
      console.error("setDecUnit:传入参数不正确")
      return
    }
    this.defaultParams.decUnit = Object.assign(this.defaultParams.decUnit, decUnit)
  }
  setMoneyUnits(moneyUnits) {
    if (typeof moneyUnits != "object" || Array.isArray(moneyUnits)) {
      console.error("setMoneyUnits:请传入对象形式的参数")
      return
    }
    let num = ['1', '0.1', '0.01', '0.001', '0.0001']
    let check = Object.keys(moneyUnits).every(item => {
      return num.includes(item.toString()) || num.includes(item)
    })
    if (!check) {
      console.error("setMoneyUnits:传入参数不正确")
      return
    }
    this.defaultParams.moneyUnits = Object.assign(this.defaultParams.moneyUnits, moneyUnits)
  }
  getDefaultParams() {
    return this.defaultParams
  }
  numToStr(num) {
    return num2strHandler(num, this.defaultParams, false)
  }
  numToStrMoney(num) {
    return num2strHandler(num, this.defaultParams, true)
  }
  strToNum(str) {
    return str2NumHandler(str, this.defaultParams, false)
  }
  strToNumMoney(str) {
    return str2NumHandler(str, this.defaultParams, true)
  }
}

let num2str = new Num2Str()

export default num2str