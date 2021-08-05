

import { watchEffect } from './reactivity/index.js'
import { diff, mountElement } from './render/index.js'

export const createApp = ( config ) => {
  return {
    mount(continerElSelector){
      const containerEl = document.querySelector(continerElSelector);

      const setupResult = config.setup()

      const render = config.render(setupResult)

      let isMounted = false;
      let prevSubTree;

      watchEffect(()=>{
        if(!isMounted) {
          containerEl.innerHTML = ''
          isMounted = true
          const subTree = config.render(setupResult)
          prevSubTree = subTree
          mountElement(subTree, containerEl)
        } else {
          const subTree = config.render(setupResult)
          diff(prevSubTree, subTree)
          prevSubTree = subTree
        }
      })
    }
  }
}