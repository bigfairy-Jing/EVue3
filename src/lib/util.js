export default {
  removeEl(el, parent){
    parent.remove(el)
  },

  insertEl(el, parent){
    parent.append(el)
  },

  createText(text){
    return new Text(text)
  },

  createElement(type){
    return document.createElement(type)
  },
}