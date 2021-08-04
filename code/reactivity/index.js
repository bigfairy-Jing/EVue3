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

const dep = new Dep(10);

function effectWatch(effect) {
  // 收集依赖
  currentEffect = effect;
  effect();
  dep.depend();
  currentEffect = null;
}

// let b;
// effectWatch(() => {
//   b = dep.value + 10
//   console.log('依赖调用了吗', b);
// });

// dep.value = 20
// dep.notice()

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
    dep = new Dep();
    depsMap.set(key, dep);
  }
  return dep;
};

// reactive
function reactive(raw) {
  return new Proxy(raw, {
    get(target, key) {
      // 获取到dep
      const dep = getDep(target, key);

      // 以上dep和map就成了一对, 这里就依赖收集
      dep.depend();

      return Reflect.get(target, key);
    },
    set(target, key, value) {
      // 获取到dep
      const dep = getDep(target, key);

      const result = Reflect.set(target, key, value);

      dep.notice();

      return result; // 设置成功返回ture
    }
  });
}

const user = reactive({
  age: 19
});

let double;
effectWatch(() => {
  console.log('-----reactiveiifivjeijviej');
  double = user.age;
  console.log(double);
});

user.age = 20;
