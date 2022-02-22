const Pending = "pending";
const Fulfilled = "fulfilled";
const Rejected = "rejected";

class cPromise {
  constructor(executor) {
    this.status = Pending;
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilleds = [];
    this.onRejecteds = [];

    const resolve = (value) => {
      if(this.status === Pending) {
        queueMicrotask(() => {                // 一旦resolve接下去要执行then，但得先保证then里到onFulfilled已添加再执行，因此这里得延迟,下面同理
          if(this.status !== Pending) return
          this.status = Fulfilled;
          this.value = value;
          this.onFulfilleds.length >0 && this.onFulfilleds.forEach(item => {
            item(this.value);
          });
        })
      }
    }

    const reject = (reason) => {
      if(this.status === Pending) {
        queueMicrotask(() => {
          if(this.status !== Pending) return
          this.reason = reason;
          this.status = Rejected;
          this.onRejecteds.length >0 && this.onRejecteds.forEach(item => {
            item(this.reason);
          });
        })
      }
    }

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled, onRejected) {
    return new cPromise((resolve, reject) => {
      if(this.status === Fulfilled) {
        try {
          if(onFulfilled) {
            const value = onFulfilled(this.value);
            resolve(value);
          }
        } catch (err) {
          reject(err);
        }
      }
      if(this.status === Rejected) {
        try {
          if(onRejected) {
            const reason = onRejected(this.reason);
            resolve(reason);                  //注意：链式调用的reject会走到下一个then的onFulfilled里（除非抛出异常，才会到下一个onRejected那里）
          }
        } catch (err) {
          reject(err);
        }
      }
      if(this.status === Pending) {
        try {
          this.onFulfilleds.push((firstValue) => {
            const value = onFulfilled(firstValue);
            resolve(value);
          })
        } catch (err) {
          reject(err);
        }
        try {
          this.onRejecteds.push((firstReason) => {
            const reason = onRejected(firstReason);
            resolve(reason);
          })
        } catch (err) {
          reject(err);
        }
      }
    })
  }
}

const p1 = new cPromise((resolve, reject) => {
  // reject(1);
  // resolve(1);
  throw new Error("执行executor的时候，我就抛出错误")
})

// p1.then((res) => {
//   console.log("res1:", res);
// }, (err) => {
//   console.log("err1:", err);
// })
//
// p1.then((res) => {
//   console.log("res2:", res);
// }, (err) => {
//   console.log("err2:", err);
// })

// setTimeout(() => {
//   p1.then((res) => {
//     console.log("res1:", res);
//   }, (err) => {
//     console.log("err1:", err);
//   })
//
//   p1.then((res) => {
//     console.log("res2:", res);
//   }, (err) => {
//     console.log("err2:", err);
//   })
// }, 1000)

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
