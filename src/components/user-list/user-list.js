/*
* 显示某一用户类型的列表
* */
import React, {Component} from 'react';
import {WingBlank,WhiteSpace,Card} from 'antd-mobile';
import {withRouter} from 'react-router-dom';

const {Header,Body} = Card;
class UserList extends Component {

  render() {
    const {userList} = this.props;
    return (
      <WingBlank style={{marginBottom:55,marginTop:50}}>
        {
          userList.map((item,index)=>(
            <div key={item._id}>
              <WhiteSpace/>
              <Card onClick={() => this.props.history.push(`/chat/${item._id}`)}>
                <Header
                  thumb={require(`../../assets/images/${item.header}.png`)}
                  extra={item.username}
                />
                <Body>
                  <div>地址：{item.address}</div>
                  {item.area?<div>面积：{item.area}</div>:null}
                  {item.prise?<div>租金：{item.prise}</div>:null}
                  <div>描述：{item.info}</div>
                </Body>
              </Card>
            </div>
          ))
        }
      </WingBlank>
    )
  }
}
export default withRouter(UserList);