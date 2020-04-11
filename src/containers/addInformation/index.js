import React, {Component} from 'react';
import { Icon, NavBar, List, TextareaItem, ImagePicker, WhiteSpace } from "antd-mobile";
import { connect } from "react-redux";
import { addInfo } from "../../redux/actions";
import './index.scss';

class AddInformation extends Component{
  constructor(props) {
    super(props);
  }

  state = {
    files: [], // 保存图片信息
    info: '',
  };

  /**
   * 渲染list的头部
   * @returns {*}
   */
  renderListHeader = () => {
    return (
      <div className='aic-header'>
        <div className='header-text'>填写发布信息内容</div>
        <div className='header-btn' onClick={() => this.clickSubmit()}>发布</div>
      </div>
    )
  };

  /**
   * 点击发布按钮
   */
  clickSubmit = () => {
    const { info, files } = this.state;
    const { user, addInfo } = this.props;
    const information = {
      username: user.username,
      id: user._id,
      type: user.type,
      info,
      imgs: JSON.stringify(files),
      time: (new Date()).getTime(),
      header: user.header,
    };
    addInfo(information);
    this.props.history.goBack();
  };

  /**
   * 保存发布的信息
   * @param info 输入的值
   */
  handleChange = (info) => {
    this.setState({ info })
  };

  /**
   * 操作图片时会调用
   * @param files 当前所有的图片信息
   * @param type 操作类型
   * @param index 操作图片的下标
   */
  onChange = (files, type, index) => {
    this.setState({
      files,
    });
  };

  render() {
    const { files } = this.state;
    return (
      <div className='add-information-container'>
        <NavBar
          icon={<Icon type='left'/>}
          onLeftClick={() => this.props.history.goBack()}
          className='nav-bar'
        >
          发布信息
        </NavBar>
        <List renderHeader={() => this.renderListHeader()}>
          <TextareaItem
            rows={3}
            placeholder="这一刻的想法..."
            onChange={val => {this.handleChange(val)}}
          />
          <ImagePicker
            files={files}
            onChange={this.onChange}
            onImageClick={(index, fs) => console.log(index, fs)}
            selectable={files.length < 7}
            multiple={true}
          />
          <WhiteSpace />
        </List>
      </div>
    );
  }
}

export default connect(
  state => ({user:state.user}),
  { addInfo }
)(AddInformation);
