import React, {Component} from 'react';
import './index.scss'
import { connect } from "react-redux";
import InfoCard from "../infoCard";
import { getAllInfo, deleteInfo } from "../../redux/actions";
import {Icon, NavBar} from "antd-mobile";

class Information extends Component {
  constructor() {
    super();
  }

  componentWillMount() {
    const { getAllInfo } = this.props;
    // 获取所有已发布的信息
    getAllInfo();
  }

  /**
   * 去发布信息页面
   */
  clickRightIcon = () => {
    this.props.history.push(`/addInformation`);
  };

  /**
   * 删除所选的信息
   * @param id
   */
  delInfo = (id) => {
    const { deleteInfo } = this.props;
    deleteInfo(id);
  };

  render() {
    const { information, user } = this.props;
    return (
      <div className='information-container'>
        <NavBar
          icon={<Icon type='left'/>}
          onLeftClick={() => this.props.history.goBack()}
          className='nav-bar'
          rightContent={[
            <div onClick={this.clickRightIcon} key='0'>
              <Icon type="ellipsis" style={{ marginRight: '16px' }} />
            </div>,
          ]}
        >
          信息中心
        </NavBar>
        <div>
          {
            information.data.map((item, index) => {
              return <InfoCard item={item} key={index} user={user} deleteInfo={this.delInfo} />
            })
          }
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    information:state.information,
    user: state.user,
  }),
  { getAllInfo, deleteInfo }
)(Information);
