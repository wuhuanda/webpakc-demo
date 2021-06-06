import img from './assets/img/Ayanami_Rei.jpg';
import fonts from './assets/fonts/CascadiaCode.ttf';

import './index.less';

console.log('webpack demo.');

const test = '123';
console.log('🚀 ~ file: index.js ~ line 9 ~ test', test);

const obj1 = { a: 'a' };
const obj2 = { b: 'b' };
const mergeObj = _merge(obj1, obj2);
console.log("🚀 ~ file: index.js ~ line 14 ~ mergeObj", mergeObj)

const arr = ['1', '2', '3', '4'];
const arrMap = _.map(arr, (item, index) => index);
console.log('🚀 ~ file: index.js ~ line 16 ~ arrMap', arrMap);
