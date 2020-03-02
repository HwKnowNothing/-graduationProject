/*
* 租客信息完善路由容器组件
* */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {NavBar, InputItem, TextareaItem, Button} from 'antd-mobile';
import {Redirect} from 'react-router-dom';

import {updateUser} from '../../redux/actions'
import HeaderSelector from "../../components/header-selector/header-selector";

class ZukeInfo extends Component {
  state = {
    header: '', //头像名称
    address: '',   //地址
    info: '', //描述
  };

  /**
   * 更新头像
   * @param header 头像的名称
   */
  setHeader = (header) => {
    this.setState({
      header
    })
  };

  /**
   * 收集表单的信息
   * @param name 属性
   * @param value 属性值
   */
  handleChange = (name, value) => {
    this.setState({
      [name]: value
    })
  };

  /**
   * 点击保存
   */
  save = () => {
    this.props.updateUser(this.state)
  };

  render() {
    // 信息已经完善，则重定向到对应主界面
    const {header, type} = this.props.user;
    if (header) {
      // 如果头像有了，表示信息已经完善了
      const path = type === 'zuke' ? '/zuke' : '/fangdong';
      return <Redirect to={path}/>
    }
    return (
      <div>
        <NavBar>完善租客信息</NavBar>
        <HeaderSelector setHeader={this.setHeader}/>
        <InputItem placeholder='请输入租房地址' onChange={val => {
          this.handleChange('address', val)
        }}>租房地址:</InputItem>
        <TextareaItem title='租房期望:' rows={3} onChange={val => {
          this.handleChange('info', val)
        }}/>
        <Button type='primary' onClick={this.save}>保&nbsp;&nbsp;&nbsp;存</Button>
      </div>
    )
  }
}

export default connect(
  state => ({user: state.user}),
  {updateUser}
)(ZukeInfo)
