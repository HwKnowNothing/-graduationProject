/*
* reducer函数：根据老的state和指定的action返回新的state
* */
import {combineReducers} from 'redux';
import {isEmpty, setRedirectTo} from '../utils/index'

import {
  AUTH_SUCCESS,
  ERROR_MSG,
  RECEIVE_USER,
  RESET_USER,
  RECEIVE_USER_LIST,
  RECEIVE_MSG_LIST,
  RECEIVE_MSG,
  MSG_READ,
  RECEIVE_HOUSING_INFO,
  CHANGE_HOUSING,
  DELETE_HOUSING,
  GET_INFO,
  DELETE_INFO
} from './action-types'

const initUser = {
  username: '', //用户名
  type: '',     //用户类型  fangdong-info/zuke
  msg: '',      //用于存储错误提示信息
  redirectTo: ''  //需要自动重定向的路由路径
};

//产生user的state的reducer
function user(state = initUser, action) {
  switch (action.type) {
    case AUTH_SUCCESS:  //action.data为user
      const {type, header} = action.data;
      return {
        ...action.data,
        redirectTo: setRedirectTo(type, header)
      };
    case ERROR_MSG:    //action.data为msg
      return {...state, msg: action.data};
    case RECEIVE_USER: // data是user
      return action.data;
    case RESET_USER: // data是msg
      return {...initUser, msg: action.data};
    default:
      return state
  }
}

const initUserList = [];

//产生userlist的reducer
function userList(state = initUserList, action) {
  switch (action.type) {
    case RECEIVE_USER_LIST:
      return action.data;
    default:
      return state;
  }

}

//处理信息
const initChat = {
  users: {},     //所有用户信息的对象 属性名:userid 属性值:{username,header}
  chatMsgs: [], //当前用户所有相关msg的数组
  unReadCount: 0  //总的未读数量
};

function chat(state = initChat, action) {
  switch (action.type) {
    case RECEIVE_MSG_LIST:
      const {users, chatMsgs,userid} = action.data;
      return {
        users,
        chatMsgs,
        unReadCount: chatMsgs.reduce((preTotal,msg)=> preTotal+(!msg.read&&msg.to===userid?1:0),0)
      };
    case RECEIVE_MSG:
      const {chatMsg} = action.data;
      return {
        users: state.users,
        chatMsgs: [...state.chatMsgs, chatMsg],
        unReadCount: chatMsg.unReadCount + (!chatMsg.read&&chatMsg.to===action.data.userid?1:0)
      };
    case MSG_READ:
      const {from,to,count} = action.data;
      return {
        users: state.users,
        chatMsgs: state.chatMsgs.map(item=>{
          if (item.from === from && item.to === to && !item.read){
            return {...item,read:true}
          }else {
            return item;
          }
        }),
        unReadCount: state.unReadCount - count
      };
    default:
      return state;
  }
}

// 房源reducer
const initHousing = {
  housingInfo: [],
};
function housing(state = initHousing, action) {
  switch (action.type) {
    case RECEIVE_HOUSING_INFO:
      return Object.assign(
        {},
        state,
        {housingInfo: action.data});
    case CHANGE_HOUSING:
      return {
        ...state,
        housingInfo: state.housingInfo.map((item, index) => {
          if (item._id == action.data.housingId) {
            return { ...item, is_rent_out: !isEmpty(action.data.zuke), zuke: action.data.zuke ? action.data.zuke : null }
          } else {
            return item
          }
        })
      };
    case DELETE_HOUSING:
      const index = state.housingInfo.findIndex(item => item._id === action.data);
      const newArr = JSON.parse(JSON.stringify(state.housingInfo));
      newArr.splice(index, 1);
      return {
        ...state,
        housingInfo:newArr
      };
    default:
      return state;
  }
}

// 信息reducer
const InitInformation = {
  data: [],
};
function information(state = InitInformation, action) {
  switch (action.type) {
    case GET_INFO:
      return { ...state, data: action.data };
    case DELETE_INFO:
      const index = state.data.findIndex(item => item._id === action.data);
      const newArr = JSON.parse(JSON.stringify(state.data));
      newArr.splice(index, 1);
      return {
        ...state,
        data:newArr
      };
    default:
      return state;
  }
}

export default combineReducers({
  user,
  userList,
  chat,
  housing,
  information
})
//向外暴露的状态解构：{user: {},userList:{},chat:{}}
