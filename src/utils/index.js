/*工具函数模块*/

/*
* 用户主界面
*   zuke  /zuke
*   fangdong  /fangdong
* 用户信息完善界面路由
*   zuke   /zukeinfo
*   fangdong /dangdonginfo
* 判断用户类型 user.type
* 判断是否已经完善信息 -> user.header是否有值
* */

//返回对应的路由路径
export function setRedirectTo(type, header) {
  let path = '';
  if (type === 'fangdong') {
    path = '/fangdong'
  } else {
    path = '/zuke'
  }
  if (!header) {
    path += 'info';
  }
  return path;
}

/**
 * 判断一个东西是不是空 空格 空字符串 undefined 长度为0的数组及对象会被认为是空的
 * @param key
 * @returns {boolean}
 */
export function isEmpty (key) {
  if (key === undefined || key === '' || key === null) {
    return true;
  }
  if (typeof (key) === 'string') {
    key = key.replace(trimReg, '');
    if (key == '' || key == null || key == 'null' || key == undefined || key == 'undefined') {
      return true;
    } else{
      return false;
    }
  } else if (typeof (key) === 'undefined') {
    return true;
  } else if (typeof (key) === 'object') {
    for (let i in key) {
      return false;
    }
    return true;
  } else if (typeof (key) === 'boolean') {
    return false;
  }
}

/**
 * 去掉前后 空格/空行/tab 的正则 预先定义 避免在函数中重复构造
 * @type {RegExp}
 */
let trimReg = /(^\s*)|(\s*$)/g;
