/**
 * 房东的房源管理
 */
import React, {Component} from 'react';
import {Button, Card, Icon, NavBar, WhiteSpace, WingBlank} from "antd-mobile";
import noFind from './noFind.png'
import {connect} from "react-redux";
import { getHousingInfo } from '../../redux/actions';
import './housing-management.css'

class HousingManagement extends Component{
  constructor(props) {
    super(props);

  }

  componentWillMount() {
    const username = this.props.match.params.username;
    console.log(username,'用户名')
    const {getHousingInfo} = this.props;
    // 通过username去查房源信息
    getHousingInfo(username);
    //console.log(username,'房东的username')
  }

  componentWillReceiveProps(nextProps, nextContext) {
    console.log(nextProps,'shoudaole')
  }

  /**
   * 去添加房源页面
   */
  goToAddHousing = () => {
    this.props.history.push(`/addHousing`)
  };

  render() {
    const { housingInfo } = this.props.housing;
    console.log(housingInfo,'info')
    return (
      <div className='housing-page'>
        <NavBar
          icon={<Icon type='left'/>}
          onLeftClick={() => this.props.history.goBack()}
          className='nav-bar'>
          我的房源
        </NavBar>
        <div className='container'>
          {
            housingInfo.length === 0 ? (
              <div>
                <div className='no-find-img'>
                  <img src={noFind} alt="" className='no-img'/>
                </div>
                <div className='no-find-text'>
                  <span>您还没有添加房源信息</span>
                </div>
                <Button type='primary' size='small' inline className='add-btn' onClick={() => this.goToAddHousing()}>点击添加</Button>
              </div>
            ) : <div>111</div>
          }
        </div>
      </div>
    )
  }
}
export default connect(
  state => ({
    housing: state.housing,
  }),
  {getHousingInfo}
)(HousingManagement)
