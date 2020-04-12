import React, {Component} from 'react';
import {Button, Icon, NavBar} from "antd-mobile";
import {connect} from "react-redux";
import { getHousingByUsername, getComment } from '../../redux/actions';
import './index.scss'
import noFind from "../housing-management/noFind.png";
import HousingCard from "./housingCard";

class MyHousing extends Component{
  constructor(props) {
    super(props);

  }

  componentWillMount() {
    const username = this.props.match.params.username;
    const { getHousingByUsername, getComment } = this.props;
    console.log(username,'username');
    getHousingByUsername(username);
    getComment();
  }

  render() {
    const { housing } = this.props;
    console.log(housing);
    return (
      <div className='my-housing'>
        <NavBar
          icon={<Icon type='left'/>}
          onLeftClick={() => this.props.history.goBack()}
          className='nav-bar'>
          我的租房
        </NavBar>
        {
          housing.rentHousing.length === 0 ? (
            <div className='container'>
              <div className='no-find-img'>
                <img src={noFind} alt="" className='no-img'/>
              </div>
              <div className='no-find-text'>
                <span>您还没有租房信息哦，快去联系房东吧~</span>
              </div>
              <Button type='primary' size='small' inline className='add-btn' onClick={() => this.props.history.goBack()}>返回</Button>
            </div>
          ) : (
            <div className='housing-list'>
              {
                housing.rentHousing.map((item, index) => {
                  return (
                    <HousingCard item={item} key={item._id} comment={housing.housingComment} />
                  )
                })
              }
            </div>
          )
        }
      </div>
    );
  }
}

export default connect(
  state => ({
    housing: state.housing,
  }),
  { getHousingByUsername, getComment }
)(MyHousing);
