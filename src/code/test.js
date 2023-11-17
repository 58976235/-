import num2str from './index'

num2str.setNums({ 0: "凌", 1: "一" })
num2str.setMoneyUnits({1:'哈哈'})
num2str.setDecUnit({'.':'典'})
console.log(num2str.numToStrMoney('10000110120.21'));
console.log(num2str.strToNumMoney('一佰亿凌一拾一万凌一佰贰拾哈哈贰角一分'));
console.log(num2str.numToStr(10000110120.21) );