import React, { Component } from 'react';
import { Button, InputItem, List } from "antd-mobile";
import { connect } from "react-redux";
import { addComment, delComment } from "../../redux/actions";

class Comment extends Component{
  constructor(props) {
    super(props);
  }

  state = {
    comment: '',
    cardComment: [],
  };

  /**
   * 发布评论
   */
  submitComment = () => {
    const { comment } = this.state;
    const { item, addComment, user } = this.props;
    const data = {
      username: user.username,
      id: item._id,
      comment,
      header: user.header,
    };
    addComment(data);
    this.setState({ comment: '' })
  };

  /**
   * 删除评论
   * @param item 评论的详细信息
   */
  delComment = (item) => {
    const { delComment } = this.props;
    delComment(item._id);
  };

  render() {
    const { comment } = this.state;
    const { housing, item, user } = this.props;
    const newArr = [];
    housing.housingComment.map(i => {
      if (i.id === item._id) {
        newArr.push(i);
      }
    });
    return (
      <div>
        {
          newArr.length === 0 && (
            <div className='no-comment'>
              还没有评论哦，快来抢沙发吧
            </div>
          )
        }
        {
          newArr.length !== 0 && (
            <div>
              {
                newArr.map((item, index) => {
                  return (
                    <div key={item._id} className='comment-card'>
                      <div className='card-name'>{item.username}:</div>
                      <div className='card-comments'>{item.comment}</div>
                      {
                        user.username === item.username && <div className='card-del' onClick={() => this.delComment(item)}>删除</div>
                      }
                    </div>
                  )
                })
              }
            </div>
          )
        }
        <List>
          <InputItem
            placeholder="填写评论吧~"
            onChange={val => {this.setState({ comment: val })}}
            value={comment}
          />
        </List>
        <Button type='primary' size='small' inline className='add-btn' onClick={this.submitComment}>发表</Button>
      </div>
    );
  }
}

export default connect(
  state => ({
    housing: state.housing,
    user: state.user,
  }),
  { addComment, delComment }
)(Comment);
