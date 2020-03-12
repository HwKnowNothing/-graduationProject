/**
 * 房东的房源管理
 */
import React, {Component} from 'react';
import {Button, Card, Icon, NavBar } from "antd-mobile";
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
    const { getHousingInfo } = this.props;
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
            ) : (
              <div className='card-list'>
                {
                  housingInfo.map((item, index) => {
                    return (
                      <Card key={item._id}>
                        <Card.Body>
                          <div className='card-left'>
                            <img src={JSON.parse(item.img)[0].url} alt="" className='card-img'/>
                          </div>
                          <div className='card-right'>
                            <div className='card-address'>{item.specific_address}</div>
                            <div className='card-area'>{item.area}</div>
                          </div>
                          <div className='card-prise'>{item.prise}</div>
                          <div className={`card-rent-out ${!item.is_rent_out ? 'red-card' : ''}`}>{item.is_rent_out ? '已出租' : '未出租'}</div>
                          简介:
                          <div className='card-info'>{item.info}</div>
                        </Card.Body>
                        <Card.Footer extra={<div>删除</div>} />
                      </Card>
                    )
                  })
                }
              </div>
            )
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
