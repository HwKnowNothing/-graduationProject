/*
* 登录路由组件
* */
import React, {Component} from 'react';
import {NavBar, WingBlank, List, InputItem, WhiteSpace, Button,Toast} from 'antd-mobile'
import Logo from "../../components/logo/logo";
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';

import {login} from '../../redux/actions';

class Login extends Component {
  state = {
    username:'',
    password:''
  };
  //表单改变时 更新state
  handleChange = (attr,val) =>{
    this.setState({
      [attr]:val
    })
  };
  // 点击 还没有账号 转到 注册
  toRegister = () => {
    this.props.history.replace('/register')
  };
  //点击登录
  login = () => {
    this.props.login(this.state)
  };
  componentDidUpdate(prevProps, prevState, snapshot) {
    const {msg} = this.props.user;
    if(msg){
      Toast.fail(msg, 1);
      this.props.user.msg = '';  //30
    }
  }
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
            <InputItem placeholder="请输入用户名" onChange={(val) => {this.handleChange('username', val)}}>用户名</InputItem>
            <InputItem placeholder="请输入密码" type='password' onChange={(val) => {this.handleChange('password', val)}}>密&nbsp;&nbsp;&nbsp;码</InputItem>
          </List>
          <WhiteSpace/>
          <Button type='primary' onClick={this.login}>登&nbsp;&nbsp;&nbsp;录</Button>
          <WhiteSpace/>
          <Button onClick={this.toRegister}>还没有账号</Button>
        </WingBlank>
      </div>
    )
  }
}

export default connect(
  state => ({user:state.user}),
  {login}
)(Login)