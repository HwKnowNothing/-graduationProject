//声明一个Promise对象
/*let promise = function() {
  return
};*/

//async使用await可以阻塞代码，等await后的异步成功才继续执行
async function f() {
  console.log('代码将被await阻塞');
  // response 就是 promise 执行成功的值
  const response = await new Promise(function(resolve, reject) {
    setTimeout(() => {
      console.log('setTimeout');
      resolve('wait 2'); //成功
    }, 2000);
  });
  console.log(response);
}

//async返回的是Promise对象,所以可以调用.then方法
f().then(function() {
  console.log('成功了');
});
