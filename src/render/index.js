import util from '../lib/util.js'


function patchProp(el, key, prevV, nextV) {
  // onClick
  if (key.startsWith("on")) {
    const evName = key.slice(2).toLocaleLowerCase()
    el.addEventListener(evName, nextV)
  } else {
    if (nextValue === null) {
      el.removeAttribute(key, nextV)
    } else {
      el.setAttribute(key, nextV)
    }
  }
}


export function diff(v1, v2) {

  const { props: oldProps, children: oldChildren = [] } = v1;
  const { props: newProps, children: newChildren = [] } = v2;

  if (v1.tag !== v2.tag) {
    v1.replaceWith(util.createElement(v2.tag))
  } else {
    const el = (v2.el = v1.el)

    if (newProps) {
      // 1. 新的节点不等于老节点的值 -> 直接赋值
      Object.keys(newProps).forEach((key) => {
        if (newProps[key] !== oldProps[key]) {
          patchProp(el, key, oldProps[key], newProps[key]);
        }
      });

      // 2. 遍历老节点 -》 新节点里面没有的话，那么都删除掉
      Object.keys(oldProps).forEach((key) => {
        if (!newProps[key]) {
          patchProp(el, key, oldProps[key], null);
        }
      });
    }


    if (typeof newChildren === 'string') {
      if (typeof oldChildren === 'string') {
        if (newChildren !== oldChildren) el.textContent = newChildren
      }
    } else if (Array.isArray(newChildren)) {
      if (typeof oldChildren === 'string') {
        v1.el.innerHTML = ''
        newChildren.forEach(vnode => mountElement(vnode, el))
      } else if (Array.isArray(oldChildren)) {
        const len = Math.min(newChildren.length, oldChildren.length)

        for (let i = 0; i < len; i++) {
          const oldVnode = oldChildren[i]
          const newVnode = newChildren[i]
          diff(oldVnode, newVnode)
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
}





export function mountElement(vnode, containerEl) {
  // 渲染成真实的dom节点
  const el = (vnode.el = util.createElement(vnode.tag))

  // 处理props
  if (vnode.props) {
    for (const key in vnode.props) {
      const val = vnode.props[key]
      patchProp(vnode.el, key, null, val)
    }
  }

  // 要处理 children
  if (Array.isArray(vnode.children)) {
    vnode.children.forEach(v => mountElement(v, el))
  } else {
    util.insertEl(util.createText(vnode.children), el)
  }

  util.insertEl(el, containerEl)
}