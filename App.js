


import { reactive } from './src/reactivity/index.js'

const h = (tag, props, children = []) => {
  return {
    tag,
    props,
    children,
  }
}

const App = {
  render(content) {
    return h("div", null, [
      h("div", null, String(content.state.message)),
      h(
        "button",
        {
          onclick: content.click
        },
        "click"
      ),
    ])
  },
  setup() {
    const state = reactive({ message: 'this is easy Vue3!!!' })

    const click = () => {
      console.log(state.message)
      state.message = state.message.split('').reverse().join('').toLocaleLowerCase()
    }

    return {
      state,
      click
    }
  }
}

export default App