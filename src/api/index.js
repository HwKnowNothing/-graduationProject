/**
* 包含n个接口请求的函数模块
*   返回Promise
*/
import ajax from './ajax';

/**
 * 注册
 * @param user 用户信息
 */
export const reqRegister = (user) => ajax('/register', user, 'POST');

/**
 * 登陆
 * @param username 用户名
 * @param password 密码
 */
export const reqLogin = ({username, password}) => ajax('/login', {username, password}, 'POST');

/**
 * 更新用户信息
 * @param user 用户信息
 */
export const reqUpdateUser = (user) => ajax('/update', user, 'POST');

/**
 * 获取用户信息 cookie
 */
export const reqUser = () => ajax('/user');

/**
 * 根据类型获取列表
 * @param type 用户类型
 */
export const reqUserList = (type) => ajax('/userlist', {type});

/**
 * 获取当前用户的聊天信息列表
 */
export const reqChatMsgList = () => ajax('/msglist');

/**
 * 修改指定消息为已读
 * @param  from 消息的来源
 */
export const reqReadMsg = (from) => ajax('readmsg',{from},'POST');

/**
 * 通过用户名获取房源信息
 * @param username 用户名
 */
export const reqHousingInfo = (username) => ajax('/housing', {username}, 'POST');

/**
 * 添加房源信息
 * @param housingInfo 房源信息
 */
export const reqAddHousing = (housingInfo) => ajax('/saveHousing', {housingInfo}, 'POST');

/**
 * 更新房源信息
 * @param housing 里面是房源的id和租客的userName
 */
export const reqChangeHouseInfo = (housing) => ajax('/changeHousingInfo', {housing}, 'POST');

/**
 * 删除房源信息
 * @param _id 要删除的房源id
 */
export const reqDelHousing = (_id) => ajax('/deleteHousing', {_id},'POST');

/**
 * 查找某一租客所租的房源
 * @param username 租客的username
 */
export const reqGetHousingByUsername = (username) => ajax('/getHousingByUsername', {username}, 'POST');

/**
 * 发布信息
 * @param information
 */
export const reqAddInfo = (information) => ajax('/addInformation', { information }, 'POST');

/**
 * 获取所有用户已发布的信息
 */
export const reqGetAllInfo = () => ajax('/getAllInfo', {}, 'POST');

/**
 * 删除发布的信息
 * @param _id 信息的Id
 */
export const reqDeleteInfo = (_id) => ajax('/deleteInfo', {_id}, 'POST');

/**
 * 获取所有评论
 */
export const reqGetComment = () => ajax('/getAllComment', {}, 'POST');

/**
 * 新增评论
 * @param comment
 */
export const reqAddNewComment = (comment) => ajax('/addComment', {comment}, 'POST' );

/**
 * 删除评论
 * @param _id 要删除的评论id
 */
export const reqDelComment = (_id) => ajax('/delComment', {_id},'POST');
