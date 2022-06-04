const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class Promise {
  constructor() {
    // 状态初始化
    this.status = PENDING;
    this.value = null;
    this.reason = null;
  }
  then(on) {}
}
