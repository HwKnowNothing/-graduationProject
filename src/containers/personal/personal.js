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

  /**
   * 去房源信息页面
   */
  goToHousing = () => {
    const { username } = this.props.user;
    console.log(username,'点击')
    this.props.history.push(`/housing/${username}`)
  };

  /**
   * 去我的租房界面
   */
  goMyHousing = () => {
    console.log(111);
    const { username } = this.props.user;
    this.props.history.push(`/myHousing/${username}`)
  };

  render() {
    const {username, address, header, info, prise, area, type} = this.props.user;
    console.log(this.props.user,'11')
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
          {
            type === 'fangdong' && <Button onClick={this.goToHousing}>我的房源</Button>
          }
          {
            type === 'zuke' && <Button onClick={this.goMyHousing}>我的租房</Button>
          }
          <WhiteSpace/>
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
