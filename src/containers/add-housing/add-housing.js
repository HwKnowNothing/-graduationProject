/**
 * 添加房源
 */
import React, {Component} from 'react';
import { Button, Icon, InputItem, List, NavBar, TextareaItem, ImagePicker, Toast } from "antd-mobile";
import { connect } from "react-redux";
import { addHousing } from "../../redux/actions";
import { isEmpty } from '../../utils'
import './add-housing.css'

class AddHousing extends Component{
  constructor(props) {
    super(props);

  }

  state = {
    files: [], // 保存图片信息
    address: '',   //地址
    info: '', // 描述
    area: '', // 面积
    prise: '', // 价格
  };

  /**
   * 操作图片时会调用
   * @param files 当前所有的图片信息
   * @param type 操作类型
   * @param index 操作图片的下标
   */
  onChange = (files, type, index) => {
    console.log(files, type, index);
    this.setState({
      files,
    });
  };

  /**
   * 保存填写的信息
   * @param name 属性名
   * @param value 属性值
   */
  handleChange = (name,value) => {
    this.setState({
      [name]:value
    })
  };

  /**
   * 保存房源信息
   */
  saveHousingInfo = () => {
    const { files, address, area, info, prise } = this.state;
    const { user, addHousing } = this.props;
    // 先判断是否填写了全部信息
    if (isEmpty(files) || isEmpty(address) || isEmpty(area) || isEmpty(info) || isEmpty(prise)) {
      Toast.fail('请先填写完整信息', 1);
      return;
    }
    // 保存数据
    let housingInfo = {
      username: user.username,
      address,
      area,
      info,
      prise,
      img: JSON.stringify(files),
    };
    addHousing(housingInfo);
    this.props.history.goBack()
  };

  render() {
    const { files } = this.state;
    return (
      <div className='add-housing'>
        <NavBar
          icon={<Icon type='left'/>}
          onLeftClick={() => this.props.history.goBack()}
          className='nav-bar'>
          添加房源
        </NavBar>
        <div className='container'>
          <List renderHeader={() => '填写房源信息'}>
            <InputItem placeholder='请输入房源地址' onChange={val => {this.handleChange('address',val)}}>房源地址:</InputItem>
            <InputItem placeholder='请输入房间面积' onChange={val => {this.handleChange('area',val)}}>房间面积:</InputItem>
            <InputItem placeholder='请输入租房租金' onChange={val => {this.handleChange('prise',val)}}>租房租金:</InputItem>
            <TextareaItem title='租房描述:' rows={3} onChange={val => {this.handleChange('info',val)}}/>
            <ImagePicker
              files={files}
              onChange={this.onChange}
              onImageClick={(index, fs) => console.log(index, fs)}
              selectable={files.length < 7}
              multiple={true}
            />
            <Button type='primary' onClick={() => this.saveHousingInfo()}>保&nbsp;&nbsp;&nbsp;存</Button>
          </List>
        </div>
      </div>
    );
  }
}
export default connect(
  state => ({user:state.user}),
  { addHousing }
)(AddHousing)

