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
  DELETE_INFO,
  ZUKE_HOUSING,
  GET_ALL_COMMENT, ADD_COMMENT, DELETE_COMMENT, GET_REJECT_ID, GET_REJECT_ID_OTHER,
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
  unReadCount: 0,  //总的未读数量
  myRejectId: [], // 自身的屏蔽名单，用来判断聊天界面头部的显示
  otherRejectId: [], // 当前聊天对象的屏蔽id名单 如果用户id不在里面表示可以发送，在就不能发送信息
};

function chat(state = initChat, action) {
  switch (action.type) {
    case RECEIVE_MSG_LIST:
      const {users, chatMsgs,userid} = action.data;
      return {
        ...state,
        users,
        chatMsgs,
        unReadCount: chatMsgs.reduce((preTotal,msg)=> preTotal+(!msg.read&&msg.to===userid?1:0),0)
      };
    case RECEIVE_MSG:
      const {chatMsg} = action.data;
      return {
        ...state,
        users: state.users,
        chatMsgs: [...state.chatMsgs, chatMsg],
        unReadCount: chatMsg.unReadCount + (!chatMsg.read&&chatMsg.to===action.data.userid?1:0)
      };
    case MSG_READ:
      const {from,to,count} = action.data;
      return {
        ...state,
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
    case GET_REJECT_ID:
      return { ...state, myRejectId: action.data };
    case GET_REJECT_ID_OTHER:
      return { ...state, otherRejectId: action.data };
    default:
      return state;
  }
}

// 房源reducer
const initHousing = {
  housingInfo: [], // 房东的房源信息
  rentHousing: [], // 租客的租房信息
  housingComment: [], // 所有租房评论
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
    case ZUKE_HOUSING:
      return { ...state, rentHousing: action.data };
    case GET_ALL_COMMENT:
      return { ...state, housingComment: action.data };
    case ADD_COMMENT:
      const newHousingComment = JSON.parse(JSON.stringify(state.housingComment));
      newHousingComment.push(action.data);
      return { ...state, housingComment: newHousingComment };
    case DELETE_COMMENT:
      const i = state.housingComment.findIndex(item => item._id === action.data);
      const arr = JSON.parse(JSON.stringify(state.housingComment));
      arr.splice(i, 1);
      return {
        ...state,
        housingComment:arr
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
