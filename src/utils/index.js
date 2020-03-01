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