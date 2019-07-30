export default function setProps(element, props) {
  let keys = Object.keys(props);
  keys.forEach(key => {
    element.setAttribute(key, props[key]);
  });
}
