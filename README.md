# promise-self
手写promise，用js模拟实现c++的官方promise；
  promise规范分为早期的promise(a+)规范，以及后来的es6规范；
  区别是：promise(a+)规范有then(res => {}, err => {})方法，正确结果在第一个回掉取，错误结果在第二个回掉取；
  而es6规范不仅有then()方法，还有catch()方法，且错误回掉在catch内完成捕获；
  除此之外es6规范的promise还有一些类方法：比如all、allSettled、any、race；
