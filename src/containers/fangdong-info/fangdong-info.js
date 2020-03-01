/*
* 房东信息完善路由容器组件
* */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {NavBar, InputItem, TextareaItem, Button} from 'antd-mobile';
import {Redirect} from 'react-router-dom';

import HeaderSelector from "../../components/header-selector/header-selector";
import {updateUser} from '../../redux/actions'

class FangdongInfo extends Component {
  state = {
    header:'', //头像名称
    address:'',   //地址
    info: '', //描述
    area: '', //面积
    prise: '', //价格
  };

  //更新头像
  setHeader = (header) => {
    this.setState({
      header
    })
  };

  //收集表单信息
  handleChange = (name,value) => {
    this.setState({
      [name]:value
    })
  };

  save = () =>{
    this.props.updateUser(this.state)
  };

  render() {
    //信息已经完善，则重定向到对应主界面
    const {header,type} = this.props.user;
    if (header){  //如果头像有了，表示信息已经完善了
      const path = type==='zuke'?'/zuke':'/fangdong';
      return <Redirect to={path}/>
    }
    return (
      <div>
        <NavBar>完善房东信息</NavBar>
        <HeaderSelector setHeader={this.setHeader}/>
        <InputItem placeholder='请输入房源地址' onChange={val =>{this.handleChange('address',val)}}>房源地址:</InputItem>
        <InputItem placeholder='请输入房间面积' onChange={val =>{this.handleChange('area',val)}}>房间面积:</InputItem>
        <InputItem placeholder='请输入租房租金' onChange={val =>{this.handleChange('prise',val)}}>租房租金:</InputItem>
        <TextareaItem title='租房描述:' rows={3} onChange={val =>{this.handleChange('info',val)}}/>
        <Button type='primary' onClick={this.save}>保&nbsp;&nbsp;&nbsp;存</Button>
      </div>
    )
  }
}

export default connect(
  state => ({user:state.user}),
  {updateUser}
)(FangdongInfo)
