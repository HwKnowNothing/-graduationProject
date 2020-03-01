/*
* 选择用户头像的UI组件
* */
import React, {Component} from 'react';
import {List, Grid} from 'antd-mobile';


export default class HeaderSelector extends Component {
  state = {
    icon:null  //对象,默认为null，当点击头像后读取
  };
  constructor(props){
    super(props);
    //选择头像的数据
    this.headerList = [];
    for (let i = 0;i<20;i++){
      this.headerList.push({
        text:'头像'+(i+1),
        icon: require(`../../assets/images/头像${i+1}.png`)
      })
    }
  }

  handleClick = ({text,icon}) =>{
    //更新当前组件的state
    this.setState({icon});
    //调用函数更新父组件状态
    this.props.setHeader(text);
  };

  render() {
    const {icon} = this.state;
    //头部
    const listHeader = !icon?'请选择头像':(
      <div>
        已选择的头像为: <img src={icon} alt="" style={{width:48,height:48}}/>
      </div>
    );
    return (
      <List renderHeader={()=>listHeader}>
        <Grid data={this.headerList}
              columNum={5}
              onClick={this.handleClick}
        />
      </List>
    )
  }
}