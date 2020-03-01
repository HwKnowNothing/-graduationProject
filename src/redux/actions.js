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
  reqReadMsg
} from '../api/index';
import {
  AUTH_SUCCESS,
  ERROR_MSG,
  RECEIVE_USER,
  RESET_USER,
  RECEIVE_USER_LIST,
  RECEIVE_MSG_LIST,
  RECEIVE_MSG,
  MSG_READ
} from './action-types';


//异步获取消息列表数据
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

/*
* 单例对象
*   1.创建对象之前: 判断对象是否已经存在，如果没有才创建
*   2.创建对象之后: 保存对象
* */
function initIO(dispatch, userid) {
  if (!io.socket) {
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

//发送消息的异步action
export const sendMsg = ({from, to, content}) => {
  return dispatch => {
    console.log('客户端向服务端发送消息', {from, to, content});
    //发送消息
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
}
//授权成功的同步action
const authSuccess = (user) => ({type: AUTH_SUCCESS, data: user});
//错误提示的同步action
const errorMsg = (msg) => ({type: ERROR_MSG, data: msg});
// 接收用户的同步action
const receiveUser = (user) => ({type: RECEIVE_USER, data: user});
// 重置用户的同步action
export const resetUser = (msg) => ({type: RESET_USER, data: msg});
//用户列表同步action
const receiveUserList = (userList) => ({type: RECEIVE_USER_LIST, data: userList});
//接收消息列表的同步action
const receiveMsgList = ({users, chatMsgs, userid}) => ({type: RECEIVE_MSG_LIST, data: {users, chatMsgs, userid}});
//接收一个消息的同步action
const receiveMsg = (chatMsg, userid) => ({type: RECEIVE_MSG, data: {chatMsg, userid}});
//读取小心的同步action
const msgRead = ({count, from, to}) => ({type: MSG_READ, data: {count, from, to}})

//注册异步action
export const registerAct = (user) => {
  const {username, password, password2, type} = user;
  //表单的前台验证,如果不通过，则返回一个errorMsg的同步action
  //用户名为空
  if (!username) {
    return errorMsg('请输入用户名')
  } else if (password !== password2) { //密码不一致
    return errorMsg('两次密码不一致')
  }
  //表单前台验证通过，返回一个发送ajax请求的异步action函数
  return async dispatch => {
    //发送注册的异步请求
    const response = await reqRegister({username, password, type}); //response {code:0/1,data/msg}
    const result = response.data;
    if (result.code === 0) { //成功
      getMsgList(dispatch, result.data._id);
      //分发成功的action
      dispatch(authSuccess(result.data))
    } else { //失败
      //分发失败的action
      dispatch(errorMsg(result.msg))
    }
  }
};

//登录
export const login = (user) => {
  const {username, password} = user;
  //表单的前台验证,如果不通过，则返回一个errorMsg的同步action
  //用户名为空
  if (!username) {
    return errorMsg('请输入用户名')
  } else if (!password) { //密码为空
    return errorMsg('请输入密码')
  }
  return async (dispatch) => {
    //发送注册的异步请求
    const response = await reqLogin(user); //response {code:0/1,data/msg}
    const result = response.data;
    if (result.code === 0) { //成功
      getMsgList(dispatch, result.data._id);
      //分发成功的action
      dispatch(authSuccess(result.data))
    } else { //失败
      //分发失败的action
      dispatch(errorMsg(result.msg))
    }
  }
};

//更新用户异步action
export const updateUser = (user) => {
  return async dispatch => {
    const response = await reqUpdateUser(user)
    const result = response.data;
    if (result.code === 0) { // 更新成功: data
      dispatch(receiveUser(result.data))
    } else { // 更新失败: msg
      dispatch(resetUser(result.msg))
    }
  }
};

//获取用户的异步action cookie
export const getUser = () => {
  return async dispatch => {
    // 执行异步ajax请求
    const response = await reqUser();
    const result = response.data;
    if (result.code === 0) { // 成功
      getMsgList(dispatch, result.data._id);
      dispatch(receiveUser(result.data))
    } else { // 失败
      dispatch(resetUser(result.msg))
    }
  }
};

//获取用户列表的异步action
export const getUserList = (type) => {
  return async dispatch => {
    const response = await reqUserList(type);
    const result = response.data;
    if (result.code === 0) { // 成功
      dispatch(receiveUserList(result.data))
    }
  }
};





