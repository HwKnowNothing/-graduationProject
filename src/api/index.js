/*
* 包含n个接口请求的函数模块
*   返回Promise
* */
import ajax from './ajax';

//注册
export const reqRegister = (user) => ajax('/register', user, 'POST');

//登录
export const reqLogin = ({username, password}) => ajax('/login', {username, password}, 'POST');

//更新用户
export const reqUpdateUser = (user) => ajax('/update', user, 'POST');

//获取用户信息 cookie
export const reqUser = () => ajax('/user');

//根据类型获取列表
export const reqUserList = (type) => ajax('/userlist', {type});

//获取当前用户的聊天信息列表
export const reqChatMsgList = () => ajax('/msglist');

//修改指定消息为已读
export const reqReadMsg = (from) => ajax('readmsg',{from},'POST');