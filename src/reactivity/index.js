// 响应式库

// 依赖
let currentEffect;
class Dep {
  // 1. 收集依赖
  constructor(val) {
    this.effects = new Set();
    this._val = val;
  }

  get value() {
    this.depend();
    return this._val;
  }

  set value(newV) {
    this._val = newV;
    this.notice(); // 在值更新完之后更新
  }

  depend() {
    if (currentEffect) this.effects.add(currentEffect);
  }

  // 2. 触发依赖
  notice() {
    // 触发之前收集到的依赖
    this.effects.forEach((effect) => effect());
  }
}

export const watchEffect = (effect) => {
  // 收集依赖
  currentEffect = effect;
  effect();
  currentEffect = null;
}

// +++++++++++++++++++++++++++++++++++++++++++++++
const targetMap = new WeakMap();
const getDep = (target, key) => {
  let depsMap = targetMap.get(target);

  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);

  if (!dep) {
    dep = new Dep(target[key]);
    depsMap.set(key, dep);
  }
  return dep;
};

// reactive
const reactvieHandlers = {
  get(target, key) {
    const value = getDep(target, key).value
    if (value && typeof value === 'object') {
      return reactive(value)
    } else {
      return value
    }
  },
  set(target, key, value) {
    getDep(target, key).value = value
    return true
  }
}

export function reactive(obj) {
  return new Proxy(obj, reactvieHandlers)
}



// 测试代码, 需要删除export
// const user = reactive({
//   age: 19
// });

// let double;
// watchEffect(() => {
//   console.log('-----reactiveiifivjeijviej');
//   double = user.age;
//   console.log(double);
// });

// user.age = 20