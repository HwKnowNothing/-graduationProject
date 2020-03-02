import io from 'socket.io-client';

//客服端连接服务器  得到连接对象
const socket = io('ws://localhost:3500');
//发送消息
socket.emit('sendMsg',{name:'test'});
console.log('客户端向服务器发送消息',{name:'test'});

//绑定监听 接受服务器的消息
socket.on('receiveMsg',function (data) {
  console.log('接收到服务器消息:',data)
});
