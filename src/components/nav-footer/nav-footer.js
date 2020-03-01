import React, {Component} from 'react';
import {TabBar} from 'antd-mobile';
import {withRouter} from 'react-router-dom';

import './nav-footer.css'

//在非路由组件中使用路由库的API
class NavFooter extends Component {
  render() {
    let {navList,unReadCount} = this.props;
    //过滤 hide 为 true
    navList = navList.filter(item => !item.hide);
    const path = this.props.location.pathname;
    return (
      <div>
        <TabBar>
          {
            navList.map((item,index)=>(
              <TabBar.Item
                key={index}
                title={item.text}
                icon={{uri:require(`./images/${item.icon}.png`)}}
                selectedIcon={{uri:require(`./images/${item.icon}-selected.png`)}}
                selected={path===item.path}
                onPress={() => this.props.history.replace(item.path)}
                tabBarPosition
                badge={item.path==='/message'?unReadCount:0}
              />
            ))
          }
        </TabBar>
      </div>
    )
  }
}

export default withRouter(NavFooter);  //内部会向组件中传入一些路由组件特有的属性 history location match
