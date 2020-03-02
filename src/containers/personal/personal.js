/*
* 个人中心主界面
* */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Result, List, WhiteSpace, Button,Modal} from 'antd-mobile';
import Cookies from 'js-cookie';
import {resetUser} from '../../redux/actions'

const Item = List.Item;
const Brief = Item.Brief;

class Personal extends Component {
  /**
   * 点击退出弹出二次提醒
   */
  logout = () => {
    Modal.alert('退出','是否要退出登录',[
      {
        text:'取消',
        onPress:()=>{}
      },
      {
        text:'确认',
        onPress:()=>{
          // 1.清除cookie中的userid
          Cookies.remove('userid');
          // 2.清除redux中的state
          this.props.resetUser()
        }
      }
    ])
  };

  render() {
    const {username, address, header, info, prise, area} = this.props.user;
    return (
      <div style={{marginTop:50}}>
        <Result
          img={<img src={require(`../../assets/images/${header}.png`)}
                    style={{width: 50}}
                    alt='header'
          />}
          title={username}
          message={address}
        />
        <List renderHeader={() => '相关信息'}>
          <Item multipleLine>
            {
              area ? <Brief>面积: {area}</Brief> : null
            }
            {
              prise ? <Brief>租金: {prise}</Brief> : null
            }
            <Brief>描述: {info}</Brief>
          </Item>
        </List>
        <WhiteSpace/>
        <List>
          <Button type='warning' onClick={this.logout}>退出登录</Button>
        </List>
      </div>
    )
  }
}

export default connect(
  state => ({user: state.user}),
  {resetUser}
)(Personal)
