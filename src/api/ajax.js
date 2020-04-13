/*
* 发送ajax请求的函数
*   返回一个Promise对象
* */
import axios from 'axios';

export default function ajax(url, data = {}, method = "GET") {
  if (method === 'GET') {
    // ?username=xx&password=xxx
    let paramSrt = '';
    Object.keys(data).forEach(key => {
      paramSrt += key + '=' + data[key] + '&';
    });
    //去掉最后面的 &
    if (paramSrt) {
      paramSrt = paramSrt.substring(0, paramSrt.length - 1)
    }
    //使用axios发送gei请求
    return axios.get(url + '?' + paramSrt);
  } else if (method === "POST") {
    return axios.post(url, data);
  }


}
