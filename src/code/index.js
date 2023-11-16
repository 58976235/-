
function num2strHandler(num, defaultParams, isMoney) {
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
}

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
    throw('请检查传入的中文是否和设置的参数匹配')
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
      throw ("请传入对象形式的参数")
      return
    }
    if (Object.keys(nums).length < 10) {
      throw ("传入参数不完整")
      return
    }
    let check = Object.keys(nums).every(item => {
      return Number(item).toString() != 'NaN' && Number(item) >= 0 && Number(item) < 10
    })
    if (!check) {
      throw ("传入参数不正确")
      return
    }
    this.defaultParams.nums = nums
  }
  setUnit(units) {
    if (typeof units != "object" || Array.isArray(units)) {
      throw ("请传入对象形式的参数")
      return
    }
    if (Object.keys(units).length < 6) {
      throw ("传入参数不完整")
      return
    }
    let unit = units['10'] || units['100'] || units['1000'] || units['10000'] || units['100000000'] || units['1000000000000']
    if (!unit) {
      throw ("传入参数不正确")
      return
    }
    this.defaultParams.units = units
  }
  setDecUnit(decUnit) {
    if (typeof decUnit != "object" || Array.isArray(decUnit)) {
      throw ("请传入对象形式的参数")
      return
    }
    if (Object.keys(decUnit).length < 2) {
      throw ("传入参数不完整")
      return
    }
    let dec = decUnit['.'] || decUnit['/']
    if (!dec) {
      throw ("传入参数不正确")
      return
    }
    this.defaultParams.decUnit = decUnit
  }
  setMoneyUnits(moneyUnits) {
    if (typeof moneyUnits != "object" || Array.isArray(moneyUnits)) {
      throw ("请传入对象形式的参数")
      return
    }
    if (Object.keys(moneyUnits).length < 5) {
      throw ("传入参数不完整")
      return
    }
    let check = Object.keys(moneyUnits).every(item => {
      return parseFloat(item).toString() != 'NaN' && parseFloat(item) > 0 && parseFloat(item) <= 1
    })
    if (!check) {
      throw ("传入参数不正确")
      return
    }
    this.defaultParams.moneyUnits = moneyUnits
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