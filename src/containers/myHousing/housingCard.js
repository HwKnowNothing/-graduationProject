import React, {Component} from 'react';
import {Icon} from "antd-mobile";
import Comment from "./comment";

class HousingCard extends Component{
  constructor(props) {
    super(props);
  }

  state = {
    isOpen: false, // 评论是否展开
    cardComment: [],
  };

  /**
   * 控制评论区显隐
   */
  changeIsOpen = () => {
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen });
  };


  render() {
    const { item } = this.props;
    const { isOpen, cardComment } = this.state;
    return (
      <div className='card-container'>
        <div className='card-top'>
          <div className='img-container'>
            <img src={JSON.parse(item.img)[0].url} alt="" className='img'/>
          </div>
          <div className='info-container'>
            <div className='info-fangdong'>
              房东：<span className='info-name'>{item.username}</span>
            </div>
            <div>
              租金：<span className='info-prise'>{item.prise}</span>
            </div>
          </div>
        </div>
        <div className='card-bottom'>
          简介：
          <div className='card-info'>
            {item.info}
          </div>
          <div className='card-comment' style={{ marginBottom: !isOpen ? 0 : 10 }}>
            <div onClick={this.changeIsOpen}>
              评论
              <Icon type={!isOpen ? 'down' : 'up'} size={item} className='card-icon' />
            </div>
          </div>
          {
            isOpen && <Comment item={item} />
          }
        </div>
      </div>
    );
  }
}

export default HousingCard;
