/*
* 注册路由组件
* */
import React, {Component} from 'react';
import {NavBar, WingBlank, List, InputItem, WhiteSpace, Radio, Button, Toast} from 'antd-mobile'
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';

import {registerAct} from '../../redux/actions';
import Logo from "../../components/logo/logo";

class Register extends Component {
  state = {
    username: '',
    password: '',
    password2: '', //确认密码
    type: 'zuke',
  };
  componentDidUpdate(prevProps, prevState, snapshot) {
    const {msg} = this.props.user;
    if(msg){
      Toast.fail(msg, 1);
      this.props.user.msg = '';  //30
    }
  }

  //点击注册时调用
  register = () => {
    //console.log(this.state)
    this.props.registerAct(this.state);
  };
  //表单中的数据改变时，更新state
  handleChange = (attr, val) => {
    //更新状态
    this.setState({
      [attr]: val,
    })
  };

  //点击 已有账号 转到登录界面
  toLogin = () => {
    this.props.history.replace('/login')
  };

  render() {
    const {redirectTo} = this.props.user;
    //如果redirectTo有值，就需要重定向到指定路径
    if (redirectTo){
      return <Redirect to={redirectTo}/>
    }
    return (
      <div>
        <NavBar>蚂&nbsp;蚁&nbsp;租&nbsp;房</NavBar>
        <Logo/>
        <WingBlank>
          <List>
            <InputItem
              placeholder="请输入用户名"
              onChange={val => {
                this.handleChange('username', val)
              }}
            >
              用户名
            </InputItem>
            <InputItem
              placeholder="请输入密码"
              type='password'
              onChange={val => {
                this.handleChange('password', val)
              }}
            >
              密&nbsp;&nbsp;&nbsp;码
            </InputItem>
            <InputItem
              placeholder="请确认密码"
              type='password'
              onChange={val => {
                this.handleChange('password2', val)
              }}
            >
              确认密码
            </InputItem>
            <List.Item>
              <span>用户类型</span>&nbsp;&nbsp;&nbsp;
              <Radio checked={this.state.type === 'fangdong'} onChange={() => {
                this.handleChange('type', 'fangdong')
              }}>房东</Radio>&nbsp;&nbsp;&nbsp;
              <Radio checked={this.state.type === 'zuke'} onChange={() => {
                this.handleChange('type', 'zuke')
              }}>租客</Radio>
            </List.Item>
          </List>
          <WhiteSpace/>
          <Button type='primary' onClick={this.register}>注&nbsp;&nbsp;&nbsp;册</Button>
          <WhiteSpace/>
          <Button onClick={this.toLogin}>已有账号</Button>
        </WingBlank>
      </div>
    )
  }
}


export default connect(
  state => ({
    user: state.user
  }),
  {registerAct}
)(Register)