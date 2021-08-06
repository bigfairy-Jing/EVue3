

import { watchEffect } from './reactivity/index.js'
import { diff, mountElement } from './render/index.js'

/*
 *
 *
 * @param {*} options : {setup   render}
 * @return  mount函数传入参数为 container元素选择器
 */
export const createApp = (options) => {
  return {
    mount(continerElSelector) { // #app
      const containerEl = document.querySelector(continerElSelector);

      const setupResult = options.setup()

      const render = options.render(setupResult)

      // VNodeTree 有三个属性     tag, props, children,
      let isMounted = false;
      let prevVNodeTree;

      watchEffect(() => {
        // 初始化渲染
        if (!isMounted) {
          containerEl.innerHTML = ''
          isMounted = true
          const VNodeTree = options.render(setupResult)
          prevVNodeTree = VNodeTree
          mountElement(VNodeTree, containerEl)
        } else {
          // 更新
          const VNodeTree = options.render(setupResult)
          diff(prevVNodeTree, VNodeTree)
          prevVNodeTree = VNodeTree
        }
      })
    }
  }
}