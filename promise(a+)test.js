const p1 = new cPromise((resolve, reject) => {
  // reject(1);
  resolve(1);
  // throw new Error("执行executor的时候，我就抛出错误")
})

{  //分组测试1，测试多次调用
  p1.then((res) => {
    console.log("res1:", res);
  }, (err) => {
    console.log("err1:", err);
  })

  p1.then((res) => {
    console.log("res2:", res);
  }, (err) => {
    console.log("err2:", err);
  })
}

{ //分组测试二：测试当状态已不是pending下，处理onFulfilled和onRejected
  setTimeout(() => {
    p1.then((res) => {
      console.log("res1:", res);
    }, (err) => {
      console.log("err1:", err);
    })

    p1.then((res) => {
      console.log("res2:", res);
    }, (err) => {
      console.log("err2:", err);
    })
  }, 1000)
}

{ //分组测试三：链式调用 + 捕获异常
  setTimeout(() => {
    p1.then((res) => {
      console.log("res1:", res);
      return "res1res1res1"
    }, err => {
      console.log("err1:", err);
    }).then(res1Next => {
      console.log("res1Next:",res1Next);
    }, err1Next => {
      console.log("err1Next:", err1Next);
    })

    // p1.then((res2) => {
    //   console.log("res2:", res2);
    //   return "res1res1res1"
    // }, (err) => {
    //   console.log("err2:", err);
    //   // throw new Error("错误啦")
    //   return "err2err2err2"
    // }).then(res2Next => {
    //   console.log("res2Next:",res2Next);
    // }, err2Next => {
    //   console.log("err2Next:", err2Next);
    // })
  },1000)
}
