import React, {Component} from 'react';
import {connect} from 'react-redux';
import {NavBar, List, InputItem, Grid, Icon, Toast} from 'antd-mobile';
import { sendMsg, readMsg, getRejectId, changeReject } from '../../redux/actions'
import './chat.css'

const Item = List.Item;

class Chat extends Component {
  state = {
    content: '',
    //表情的显隐
    isShow: false
  };

  componentDidMount() {
    // 自动将聊天记录滑动底部
    window.scrollTo(0, document.body.scrollHeight);
    const from = this.props.match.params.userid;
    const to = this.props.user._id;
    // 发请求更新unReadCount
    this.props.readMsg(from, to)
  }

  componentWillUnmount() {
    const from = this.props.match.params.userid;
    const to = this.props.user._id;
    //发请求更新unReadCount
    this.props.readMsg(from, to)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    //发送信息后自动滑动到底部
    window.scrollTo(0, document.body.scrollHeight)
  }

  componentWillMount() {
    const { getRejectId, user } = this.props;
    const from = this.props.match.params.userid;
    getRejectId(user._id);
    getRejectId(from, 'other');
    //初始化表情列表
    const emojis = ['☺', '😫', '😄', '😃', '😺', '🤣', '😣', '😚', '😁', '😸', '😂', '😝', '😵', '😲', '🧵', '🎨', '🧶', '🧺', '✂', '🌀',
      '🧬', '👖', '🖍', '📿', '📌', '🎀', '📍', '🧷', '👕', '⏲', '👚', '💺', '✈', '🚌', '🚏', '🪑', '🛋', '🚄', '🎫', '✨'];
    this.emojis = emojis.map(item => ({text: item}))
  }

  /**
   *  点击发送时调用的函数，将input中的值发送
   */
  handleSend = (flag) => {
    if (flag !== -1) { // 表示对方屏蔽了消息
      Toast.fail('对方屏蔽了您的消息',1);
      return
    }
    const from = this.props.user._id;
    const to = this.props.match.params.userid;
    const content = this.state.content.trim();
    console.log(from,to,'1111');
    // 发送请求
    if (content) {
      // 有值才能发送
      this.props.sendMsg({from, to, content})
    }
    // 清空input
    this.setState({
      content: '',
      isShow: false
    })
  };

  /**
   * 切换 emoji 的显隐
   */
  toggleShow = () => {
    let isShow = !this.state.isShow;
    this.setState({
      isShow
    });
    // 解决emojis出现的bug
    if (isShow) {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 0)
    }
  };

  /**
   * 切换屏蔽
   * @param flag -1 表示未屏蔽 其他是屏蔽了
   */
  toggleReceiveMsg = (flag) => {
    console.log(flag,'falg')
    const { user, changeReject } = this.props;
    const { myRejectId,  otherRejectId } = this.props.chat;
    const targetId = this.props.match.params.userid; // 对方的id
    const id = user._id; // 自己的id
    if (flag !== -1) {
      // 此时要取消屏蔽对方消息
      const index = myRejectId.findIndex(item => item === targetId);
      const newArr = JSON.parse(JSON.stringify(myRejectId));
      newArr.splice(index, 1);
      console.log(newArr.join(','));
      changeReject(id, newArr.join(','))
    } else {
      // 屏蔽对方消息
      const newArr = JSON.parse(JSON.stringify(myRejectId));
      newArr.push(targetId);
      changeReject(id, newArr.join(','))
    }
  };

  render() {
    const { isShow } = this.state;
    const {user} = this.props;
    const { users, chatMsgs, myRejectId,  otherRejectId } = this.props.chat;
    console.log(myRejectId, otherRejectId);
    const targetId = this.props.match.params.userid;
    const rejectFlag = myRejectId.findIndex((item) => {
      return item === targetId
    });
    const rejectFlagTwo = otherRejectId.findIndex((item) => {
      return item === user._id
    });
    console.log(targetId);
    //console.log(rejectFlag,'flag')
    // 得到当前聊天的chatId
    const meId = user._id;
    if (!users[meId]) {
      // 因为msgList的获取是异步的，可能还没有获取到数据
      return null
    }
    const chatId = [meId, targetId].sort().join('_');
    //对chatMsg进行过滤
    const msgs = chatMsgs.filter(msg => msg.chat_id === chatId);
    //得到对方的头像
    const targetHeader = users[targetId].header;
    const targetIcon = targetHeader ? require(`../../assets/images/${targetHeader}.png`) : null;
    //debugger
    return (
      <div id='chat-page'>
        <NavBar
          icon={<Icon type='left'/>}
          onLeftClick={() => this.props.history.goBack()}
          className='nav-bar'>
          {users[targetId].username}
        </NavBar>
        <div className={`no-chat ${rejectFlag === -1 ? '' : 'red'}`} onClick={() => this.toggleReceiveMsg(rejectFlag)}>
          {rejectFlag !== -1 ? '您已屏蔽此人消息，点我接收他的消息' : '怕被打扰？ 点我不再接收他的消息'}
        </div>
        <List style={{ marginBottom: isShow ? 230 : 45, marginTop: 75}}>
          {
            msgs.map(msg => {
              if (targetId === msg.from) {// 对方发给我的
                return (
                  <Item
                    key={msg._id}
                    thumb={targetIcon}
                  >
                    {msg.content}
                  </Item>
                )
              } else { // 我发给对方的
                return (
                  <Item
                    key={msg._id}
                    className='chat-me'
                    extra='我'
                  >
                    {msg.content}
                  </Item>
                )
              }
            })
          }
        </List>
        <div className='am-tab-bar'>
          <InputItem
            placeholder='请输入聊天内容'
            value={this.state.content}
            onChange={val => this.setState({content: val})}
            onFocus={() => this.setState({isShow: false})}
            extra={
              <span>
                <span style={{marginRight: 5}} className='emoji' onClick={this.toggleShow}>😆</span>
                <span onClick={() => this.handleSend(rejectFlagTwo)}>发送</span>
              </span>
            }
          />
          {
            this.state.isShow ? (
              <Grid
                data={this.emojis}
                columnNum={8}
                carouselMaxRow={4}
                isCarousel={true}
                onClick={(item) => {
                  this.setState({
                    content: this.state.content + item.text
                  })
                }}
              />
            ) : null
          }
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({
    user: state.user,
    chat: state.chat
  }),
  { sendMsg, readMsg, getRejectId, changeReject }
)(Chat)
