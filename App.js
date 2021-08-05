import { reactive } from './src/reactivity/index.js';

// 虚拟
const h = (tag, props, children = []) => {
  return {
    tag,
    props,
    children
  };
};

const App = {
  render(content) {
    return h('div', null, [
      h('div', null, `${content.state.message}`),
      h(
        'button',
        {
          onclick: content.reversiveHandle
        },
        '旋转按钮'
      ),
      h('div', null, `${content.state.num}`),
      h(
        'button',
        {
          onclick: content.addHandle
        },
        '++'
      ),
      // h(
      //   'input',
      //   {
      //     type:'text',
      //     value: content.state.inputVal,
      //     oninput: content.setInputVal
      //   },
      // )
    ]);
  },
  setup() {
    const state = reactive({ 
      message: 'this is easy Vue3!!!', 
      inputVal: '输入框的内容',
      num: 0 
    });

    const reversiveHandle = () => {
      console.log(state.message);
      state.message = state.message.split('').reverse().join('').toLocaleLowerCase();
    };

    const addHandle = () => {
      state.num++
    }

    const setInputVal = e => {
      state.inputVal = e.target.value
    }

    return {
      state,
      reversiveHandle,
      addHandle,
      setInputVal
    };
  }
};

export default App;
