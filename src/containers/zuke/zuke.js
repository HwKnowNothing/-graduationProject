/*
* 租客主界面
* */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {getUserList} from '../../redux/actions'

import UserList from "../../components/user-list/user-list";

class Zuke extends Component {

  componentDidMount() {
    this.props.getUserList('fangdong');
  }

  render() {
    return (
      <UserList userList={this.props.userList}/>
    )
  }
}

export default connect(
  state => ({userList:state.userList}),
  {getUserList}
)(Zuke)
