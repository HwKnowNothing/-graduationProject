/**
 * 房东的房源管理
 */
import React, {Component} from 'react';
import {Button, Card, Icon, NavBar, Modal, Toast, ActionSheet } from "antd-mobile";
import noFind from './noFind.png'
import {connect} from "react-redux";
import { getHousingInfo, getUserList, changeHouseInfo, deleteHouses } from '../../redux/actions';
import './housing-management.css'

const alert = Modal.alert;

class HousingManagement extends Component{
  constructor(props) {
    super(props);

  }

  componentWillMount() {
    const username = this.props.match.params.username;
    console.log(username,'用户名')
    const { getHousingInfo, getUserList } = this.props;
    // 通过username去查房源信息
    getHousingInfo(username);
    // 获取租客信息
    getUserList('zuke');
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

  /**
   * 点击已出租/未出租按钮
   */
  changeIsRentOut = (item) => {
    console.log(item,'信息')
    const { changeHouseInfo } = this.props;
    if (item.is_rent_out) {
      // 为 true 此时是要收回房源
      alert('提示', '是否要收回房源，收回后可再次出租', [
        { text: '取消', onPress: () => console.log('cancel') },
        {
          text: '确定',
          onPress: () =>
            changeHouseInfo(item._id, null)
        },
      ])
    } else {
      // 否则是要将房源出租 展开actionSheet
      this.showActionSheet(item);
    }
  };

  /**
   * 展开房源出租的actionSheet
   */
  showActionSheet = (item) => {
    console.log(this.props.userList, item,'userList')
    const { userList, changeHouseInfo } = this.props;
    let BUTTONS = [];
    // 租客列表长度不为0则添加到数组中
    if (userList.length !== 0) {
      for (let i = 0; i < userList.length; i++) {
        BUTTONS.push(userList[i].username);
        // 再最后加一个取消
        if (i + 1 === userList.length) {
          BUTTONS.push('取消');
        }
      }
    }
    // 保存一下长度，之后做判断用
    const arrLength = BUTTONS.length;
    ActionSheet.showActionSheetWithOptions({
        options: BUTTONS,
        cancelButtonIndex: BUTTONS.length - 1,
        // title: 'title',
        message: '请选择要出租房源的租客',
        maskClosable: true,
        'data-seed': 'logId',
      },
      (buttonIndex) => {
        if (buttonIndex + 1 < arrLength) {
          // 不是点了取消 去改变房源信息
          console.log(item._id, BUTTONS[buttonIndex],'这个');
          changeHouseInfo(item._id, BUTTONS[buttonIndex]);
        }
        console.log(arrLength, buttonIndex,'点击了啥')
      });
  }

  /**
   * 点击删除按钮
   * @param item 要删除的房源信息
   */
  deleteHousing = (item) => {
    console.log(item,'房源信息')
    const { deleteHouses } = this.props;
    alert('提示', '确定要删除该房源吗，删除后出租信息将清空', [
      { text: '取消', onPress: () => console.log('cancel') },
      {
        text: '确定',
        onPress: () =>
          deleteHouses(item._id)
      },
    ])
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
                  housingInfo.map((item, index, arr) => {
                    return (
                      <div  key={item._id} style={{ marginBottom: index + 1 === arr.length ? '60px' : '10px'}}>
                        <Card>
                          <Card.Body  className='card-body'>
                            <div className='card-left'>
                              <img src={JSON.parse(item.img)[0].url} alt="" className='card-img'/>
                            </div>
                            <div className='card-right'>
                              <div className='card-address'>{item.specific_address}</div>
                              <div className='card-area'>{item.area}</div>
                            </div>
                            <div className='card-prise'>{item.prise}</div>
                            <div
                              className={`card-rent-out ${!item.is_rent_out ? 'red-card' : ''}`}
                              onClick={() => this.changeIsRentOut(item)}
                            >
                              {item.is_rent_out ? '已出租' : '未出租'}
                            </div>
                            {
                              item.is_rent_out && <div className='card-zuke'>租客: {item.is_rent_out ? item.zuke : null}</div>
                            }
                            简介:
                            <div className='card-info'>{item.info}</div>
                          </Card.Body>
                          <Card.Footer extra={<div>
                            <div className='card-delete' onClick={() => this.deleteHousing(item)}>删除</div>
                          </div>} />
                        </Card>
                      </div>
                    )
                  })
                }
                <div className='add-housing-container'>
                  <div className='add-housing-btn' onClick={() => this.goToAddHousing()}>添加房源</div>
                </div>
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
    userList: state.userList,
  }),
  {getHousingInfo, getUserList, changeHouseInfo, deleteHouses}
)(HousingManagement)
