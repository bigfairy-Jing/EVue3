import util from '../lib/util.js';

function patchProp(el, key, prevV, nextV) {
  // onClick
  if (key.startsWith('on')) {
    const evName = key.slice(2).toLocaleLowerCase();
    el.addEventListener(evName, nextV);
  } else {
    if (nextV === null) {
      el.removeAttribute(key, nextV);
    } else {
      el.setAttribute(key, nextV);
    }
  }
}

// diff算法 （ VNodeTree 有三个属性 tag, props, children )
export function diff(v1, v2) {
  const { props: oldProps, children: oldChildren = [] } = v1;
  const { props: newProps, children: newChildren = [] } = v2;

  // tag 不一样，直接替换掉
  if (v1.tag !== v2.tag) {
    // Element.replaceWith() 方法将其父级子列表中的此 Element 替换为一组
    v1.el.replaceWith(util.createElement(v2.tag));
    return;
  }

  // tag  一样的情况  第一次，v2.el 是为空的
  const el = (v2.el = v1.el);

  if (newProps) {
    // 1. 新的props不等于老props的值 -> 直接赋值
    Object.keys(newProps).forEach((key) => {
      if (newProps[key] !== oldProps[key]) {
        patchProp(el, key, oldProps[key], newProps[key]);
      }
    });

    // 2. 遍历props -》 新props里面没有的话，那么都删除掉
    Object.keys(oldProps).forEach((key) => {
      if (!newProps[key]) {
        patchProp(el, key, oldProps[key], null);
      }
    });
  }

  // 处理子节点
  if (typeof newChildren === 'string') {
    if (typeof oldChildren === 'string') {
      // ①新的和旧的都为string
      if(newChildren !== oldChildren) el.innerText = newChildren;
    }
  } else if (Array.isArray(newChildren)) {
    if (typeof oldChildren === 'string') {
      // ②新的为Array 旧的为string
      v1.el.innerHTML = '';
      newChildren.forEach((vnode) => mountElement(vnode, el));
    } else if (Array.isArray(oldChildren)) {
      // ③新旧都为array
      const len = Math.min(newChildren.length, oldChildren.length);

      for (let i = 0; i < len; i++) {
        const oldVnode = oldChildren[i];
        const newVnode = newChildren[i];
        diff(oldVnode, newVnode);
      }

      if (oldChildren.length > len) {
        // 说明老的节点多
        // 都删除掉
        for (let i = len; i < oldChildren.length; i++) {
          util.removeEl(oldChildren[i], el);
        }
      } else if (newChildren.length > len) {
        // 说明 new 的节点多
        // 那么需要创建对应的节点
        for (let i = len; i < newChildren.length; i++) {
          mountElement(newChildren[i], el);
        }
      }
    }
  }
}

// 将虚拟dom节点 转换成真实的dom节点
export function mountElement(vnode, containerEl) {
  // 渲染成真实的dom节点
  const el = (vnode.el = util.createElement(vnode.tag));

  // 处理props
  if (vnode.props) {
    for (const key in vnode.props) {
      const val = vnode.props[key];
      patchProp(vnode.el, key, null, val);
    }
  }

  // 要处理 children
  if (Array.isArray(vnode.children)) {
    vnode.children.forEach((v) => mountElement(v, el));
  } else {
    util.insertEl(util.createText(vnode.children), el);
  }

  // 将最后得到的le插入到 mount调用的元素中
  util.insertEl(el, containerEl);
}
