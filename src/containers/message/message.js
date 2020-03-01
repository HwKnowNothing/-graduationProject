/*
* 消息主界面
* */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {List, Badge} from 'antd-mobile';

const Item = List.Item;
const Brief = Item.Brief;
//对chatMsgs进行分组 通过chat_id 得到和每个人发送的最后一条消息lastMsg
/*
* 1.找出每个聊天的lastMsg，并用一个对象容器保存{chat_id:lastMsg}
* 2.得到所有lastMsg，并组成数组lastMsgs
* 3.对数组进行排序,按creat_time的降序
* */
function getLastMsgs(chatMsgs, userid) {
  //1
  const lastMsgObjs = {};
  chatMsgs.forEach(item => {
    //对item进行个体的统计
    if (item.to === userid && !item.read) {
      item.unReadCount = 1;
    } else {
      item.unReadCount = 0;
    }
    //得到item的聊天表示
    const chatId = item.chat_id;
    //获取已保存的当前组的lastMsg 可能有或者没有
    let lastMsg = lastMsgObjs[chatId];
    if (!lastMsg) { //没有 表示当前item就是所在组的lastMsg
      lastMsgObjs[chatId] = item;
    } else { //有  如果item比lastMsg晚，此时的item就是lastMsg
      //unReadCount
      const unReadCount = lastMsg.unReadCount + item.unReadCount;
      if (item.create_time > lastMsg.create_time) {
        lastMsgObjs[chatId] = item;
      }
      //保存unReadCount
      lastMsgObjs[chatId].unReadCount = unReadCount;
    }
  });
  //2.
  const lastMsgs = Object.values(lastMsgObjs);
  //3
  lastMsgs.sort(function (m1, m2) {
    return m2.create_time - m1.create_time
  });
  return lastMsgs;
}

class Message extends Component {
  render() {
    const {user} = this.props;
    const {users, chatMsgs} = this.props.chat;
    //对chatMsgs进行分组 通过chat_id 得到和每个人发送的最后一条消息
    const lastMsg = getLastMsgs(chatMsgs, user._id);
    return (
      <List style={{marginTop: 45, marginBottom: 45}}>
        {
          lastMsg.map(item => {

            //得到目标用户的id
            const targetUserId = item.to === user._id ? item.from : item.to;
            //得到目标用户的信息
            const targetUser = users[targetUserId];
            return (
              <Item
                key={item._id}
                extra={<Badge text={item.unReadCount}/>}
                thumb={targetUser.header ? require(`../../assets/images/${targetUser.header}.png`) : null}
                arrow='horizontal'
                onClick={() => {
                  this.props.history.push(`/chat/${targetUserId}`)
                }}
              >
                {item.content}
                <Brief>{targetUser.username}</Brief>
              </Item>
            )
          })
        }
      </List>
    )
  }
}

export default connect(
  state => ({user: state.user, chat: state.chat}),
  {}
)(Message)
