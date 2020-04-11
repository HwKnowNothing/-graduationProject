/*
* 主界面路由组件
* */
import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import Cookies from 'js-cookie';  //可以操作前端cookie的对象 set() get() remove()
import {NavBar} from 'antd-mobile'

import FangdongInfo from '../fangdong-info/fangdong-info';
import ZukeInfo from '../zuke-info/zuke-info';
import Fangdong from '../fangdong/fangdong';
import Zuke from '../zuke/zuke';
import HousingManagement from "../housing-management/housing-management";
import Information from "../information";
import Message from '../message/message';
import Personal from '../personal/personal';
import NouFound from '../../components/not-found/not-found';
import NavFooter from "../../components/nav-footer/nav-footer";
import Chat from '../chat/chat';
import AddHousing from "../add-housing/add-housing";
import AddInformation from "../addInformation";

import {setRedirectTo} from '../../utils/index';
import {getUser} from '../../redux/actions';

import './main.css'

class Main extends Component {
  // 给组件对象添加属性 导航的组件信息
  navList = [
    {
      path: '/fangdong', // 路由路径
      component: Fangdong,
      title: '租客列表',
      icon: 'zuke',
      text: '租客',
    },
    {
      path: '/zuke', // 路由路径
      component: Zuke,
      title: '房东列表',
      icon: 'fangdong',
      text: '房东',
    },
    {
      path: '/message', // 路由路径
      component: Message,
      title: '消息列表',
      icon: 'message',
      text: '消息',
    },
    {
      path: '/information',
      component: Information,
      title: '信息中心',
      icon: 'information',
      text: '信息'
    },
    {
      path: '/personal', // 路由路径
      component: Personal,
      title: '用户中心',
      icon: 'personal',
      text: '个人',
    }
  ];

  componentDidMount() {
    // cookie中有userid 但是redux管理的user中没有_id ，发送请求获取对应的user
    const userid = Cookies.get('userid');
    const {_id} = this.props.user;
    if (userid && !_id) {
      //发送异步请求，获取user
      this.props.getUser();
    }
  }

  render() {
    //1. 读取cookie中的userid 如果没有则自动重定向到登录界面，如果有则读取redux中的状态
    const userid = Cookies.get('userid');
    if (!userid) {
      return <Redirect to='/login'/>
    }
    /*
    * 2. 如果redux中有user没有_id，返回null(不做任何显示),
    *     如果有_id，则表示redux中已经含有用户信息,显示对应的界面
    *     如果请求的是根路径 / 根据user的type和header来计算出一个重定向的路由路径，并重定向
    * */
    const {user,unReadCount} = this.props;
    //debugger
    if (!user._id) {
      return null
    } else {
      let path = this.props.location.pathname;
      if (path === '/') {
        path = setRedirectTo(user.type, user.header);
        return <Redirect to={path}/>
      }
    }
    const {navList} = this;
    const path = this.props.location.pathname; //当前的请求路径
    const currentNav = navList.find(nav => nav.path === path); //得到当前的nav,可能不存在
    if (currentNav) {
      //当user的type为 fangdong 时，应该将底部导航的 房东 隐藏，反之亦然
      if (user.type === 'fangdong'){
        //隐藏房东列表
        navList[1].hide = true;
      }else {
        //隐藏租客列表
        navList[0].hide = true;
      }
    }
    return (
      <div>
        {currentNav ? <NavBar className='nav-bar'>{currentNav.title}</NavBar> : null}
        <Switch>
          {
            navList.map((item, index) => (
              <Route path={item.path} component={item.component} key={index}/>
            ))
          }
          <Route path='/fangdonginfo' component={FangdongInfo}/>
          <Route path='/zukeinfo' component={ZukeInfo}/>
          <Route path='/chat/:userid' component={Chat}/>
          <Route path='/housing/:username' component={HousingManagement}/>
          <Route path='/addHousing' component={AddHousing}/>
          <Route path='/addInformation' component={AddInformation}/>
          <Route component={NouFound}/>
        </Switch>
        {currentNav ? <NavFooter navList={navList} unReadCount={unReadCount}/> : null}
      </div>
    )
  }
}

export default connect(
  state => ({user: state.user,unReadCount:state.chat.unReadCount}),
  {getUser}
)(Main)

