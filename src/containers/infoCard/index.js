import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {ActionSheet, Toast} from 'antd-mobile';

class InfoCard extends Component{

  /**
   * 点击卡片上的头像
   * @param flag 是否为自己发布的信息
   * @param item 信息的详细数据
   */
  clickHeader = (flag, item, id) => {
    const { user, deleteInfo } = this.props;
    if (!flag) {
      if (item.type !== user.type) {
        // 不是自己发布的信息切不是同类型用户就去聊天界面
        this.props.history.push(`/chat/${id}`)
      } else {
        Toast.fail('不可与同类型用户聊天哦', 1)
      }
    } else {
      // 点击自己的头像就弹出删除提示
      ActionSheet.showActionSheetWithOptions({
          options: ['删除', '取消'],
          cancelButtonIndex:1,
          message: '是否要删除该信息',
          maskClosable: true,
          destructiveButtonIndex: 0,
          'data-seed': 'logId',
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            // 确认删除
            deleteInfo(item._id);
          }
        });
    }
  };

  render() {
    const { item, user } = this.props;
    const targetIcon = item.header ? require(`../../assets/images/${item.header}.png`) : require(`../../assets/images/头像1.png`);
    const flag = user.username === item.username;
    return (
      <div className={`info-card${flag ? '-my' : ''}`}>
        {
          !flag && (
            <div className='card-touxiang' onClick={() => this.clickHeader(flag, item, item.id)}>
              <img src={targetIcon} alt=""/>
            </div>
          )
        }
        <div className='card-infos'>
          <div className='infos-username'>
            {item.username}
          </div>
          <div className='infos-info'>
            {item.info}
          </div>
          <div className='info-img'>
            {
              JSON.parse(item.imgs).map((i, index) => {
                return (
                  <img src={i.url} alt="" className='img' key={index}/>
                )
              })
            }
          </div>
        </div>
        {
          flag && (
            <div className='card-touxiang'  onClick={() => this.clickHeader(flag, item, item.id)}>
              <img src={targetIcon} alt=""/>
            </div>
          )
        }
      </div>
    )
  }
}

export default withRouter(InfoCard);
