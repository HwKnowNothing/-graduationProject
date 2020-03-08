/*
* 包含n个action creator
* 异步action
* 同步action
* */
import io from 'socket.io-client';
import {
  reqRegister,
  reqLogin,
  reqUpdateUser,
  reqUser,
  reqUserList,
  reqChatMsgList,
  reqReadMsg,
  reqHousingInfo
} from '../api/index';
import {
  AUTH_SUCCESS,
  ERROR_MSG,
  RECEIVE_USER,
  RESET_USER,
  RECEIVE_USER_LIST,
  RECEIVE_MSG_LIST,
  RECEIVE_MSG,
  MSG_READ,
  RECEIVE_HOUSING_INFO
} from './action-types';

//授权成功的同步action
const authSuccess = (user) => ({type: AUTH_SUCCESS, data: user});
//错误提示的同步action
const errorMsg = (msg) => ({type: ERROR_MSG, data: msg});
// 接收用户的同步action
const receiveUser = (user) => ({type: RECEIVE_USER, data: user});
// 重置用户的同步action
export const resetUser = (msg) => ({type: RESET_USER, data: msg});
// 用户列表同步action
const receiveUserList = (userList) => ({type: RECEIVE_USER_LIST, data: userList});
// 接收消息列表的同步action
const receiveMsgList = ({users, chatMsgs, userid}) => ({type: RECEIVE_MSG_LIST, data: {users, chatMsgs, userid}});
// 接收一个消息的同步action
const receiveMsg = (chatMsg, userid) => ({type: RECEIVE_MSG, data: {chatMsg, userid}});
// 读取消息的同步action
const msgRead = ({count, from, to}) => ({type: MSG_READ, data: {count, from, to}});
// 获取房东的房源信息
const receiveHousingInfo = (data) => ({type: RECEIVE_HOUSING_INFO, data: data});

/**
 * 异步获取消息列表数据
 * @param dispatch
 * @param userid 用户的id
 * @returns {Promise<void>}
 */
async function getMsgList(dispatch, userid) {
  initIO(dispatch, userid);
  const response = await reqChatMsgList();
  const result = response.data;
  if (result.code === 0) {
    const {users, chatMsgs} = result.data;
    //分发action
    dispatch(receiveMsgList({users, chatMsgs, userid}))
  }
}

/**
* 单例对象
*   1.创建对象之前: 判断对象是否已经存在，如果没有才创建
*   2.创建对象之后: 保存对象
* */
function initIO(dispatch, userid) {
  if (!io.socket) {
    // 如果没有io.socket 就创建一个
    io.socket = io('ws://localhost:3500');
  }
  io.socket.on('receiveMsg', function (chatMsg) {
    console.log('客户端收到服务器发送的消息:', chatMsg);
    //只有当chatMsg是与当前用户相关的消息，才去分发同步action保存
    if (userid === chatMsg.from || userid === chatMsg.to) {
      dispatch(receiveMsg(chatMsg, userid))
    }
  })
}

/**
 * 保存用户发送的消息
 * @param from  消息来源用户
 * @param to    消息接收用户
 * @param content 消息的内容
 * @returns {function(...[*]=)}
 */
export const sendMsg = ({from, to, content}) => {
  return dispatch => {
    console.log('客户端向服务端发送消息', {from, to, content});
    // 发送消息
    io.socket.emit('sendMsg', {from, to, content})
  }
};

//读取消息的异步action
export const readMsg = (from, to) => {
  return async dispatch => {
    const response = await reqReadMsg(from);
    const result = response.data;
    if (result.code === 0) {
      const count = result.data;
      dispatch(msgRead({count, from, to}))
    }
  }
};

/**
 * 注册
 * @param user 包含了用户信息的对象 用户名 密码 用户类型
 * @returns {(function(...[*]=))|{data: *, type: string}}
 */
export const registerAct = (user) => {
  // 将user中包含的信息取出来
  const {username, password, password2, type} = user;
  // 表单的前台验证,如果不通过，则返回一个errorMsg的同步action
  if (!username) {
    // 用户名为空
    return errorMsg('请输入用户名');
  } else if (password !== password2) {
    // 两次密码不一致
    return errorMsg('两次密码不一致');
  }
  // 表单前台验证通过，返回一个发送ajax请求的异步action函数
  return async dispatch => {
    // 发送注册的异步请求
    const response = await reqRegister({username, password, type}); //response {code:0/1,data/msg}
    const result = response.data;
    if (result.code === 0) {
      // 成功
      getMsgList(dispatch, result.data._id);
      //分发成功的action
      dispatch(authSuccess(result.data))
    } else {
      // 失败
      // 分发失败的action
      dispatch(errorMsg(result.msg))
    }
  }
};

/**
 * 登陆
 * @param user 包含用户信息的对象 用户名 密码
 * @returns {(function(...[*]=))|{data: *, type: string}}
 */
export const login = (user) => {
  const {username, password} = user;
  // 表单的前台验证,如果不通过，则返回一个errorMsg的同步action
  if (!username) {
    // 用户名为空
    return errorMsg('请输入用户名')
  } else if (!password) {
    // 密码为空
    return errorMsg('请输入密码')
  }
  return async (dispatch) => {
    // 发送注册的异步请求
    const response = await reqLogin(user); //response {code:0/1,data/msg}
    const result = response.data;
    if (result.code === 0) {
      // 返回的code为0 表示成功了
      getMsgList(dispatch, result.data._id);
      // 分发成功的action
      dispatch(authSuccess(result.data))
    } else {
      // 返回其他就是失败
      // 分发失败的action
      dispatch(errorMsg(result.msg))
    }
  }
};

/**
 * 更新用户信息
 * @param user  用户的信息
 *        租客： 头像 地址 描述
 *        房东： 头像 地址 描述 面积 价格
 * @returns {function(...[*]=)}
 */
export const updateUser = (user) => {
  return async dispatch => {
    const response = await reqUpdateUser(user);
    const result = response.data;
    if (result.code === 0) {
      // 更新成功: data
      dispatch(receiveUser(result.data))
    } else {
      // 更新失败: msg
      dispatch(resetUser(result.msg))
    }
  }
};

/**
 * 获取用户的异步action cookie
 * cookie存在即可自动登陆
 * @returns {function(...[*]=)}
 */
export const getUser = () => {
  return async dispatch => {
    // 执行异步ajax请求
    const response = await reqUser();
    const result = response.data;
    if (result.code === 0) {
      // 成功
      getMsgList(dispatch, result.data._id);
      dispatch(receiveUser(result.data))
    } else {
      // 失败
      dispatch(resetUser(result.msg))
    }
  }
};

/**
 * 获取用户列表的异步action
 * @param type 当前的用户类型 房东获取租客列表 租客获取房东列表
 * @returns {function(...[*]=)}
 */
export const getUserList = (type) => {
  return async dispatch => {
    const response = await reqUserList(type);
    const result = response.data;
    if (result.code === 0) {
      // 成功
      dispatch(receiveUserList(result.data))
    }
  }
};

/**
 * 通过房东的用户名获取房东房源信息
 * @param userName 用户名
 * @returns {function(...[*]=)}
 */
export const getHousingInfo = (userName) => {
  console.log(userName,'zhiqin');
  return async dispatch => {
    const response = await reqHousingInfo(userName);
    const result = response.data;
    if (result.code === 0) {
      console.log(result.data,'daadadad');
      dispatch(receiveHousingInfo(result.data))
    }
  }
};




