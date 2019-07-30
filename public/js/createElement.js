import setProps from './setProps.js';

export default function createElement(tagName, props, child) {
  let element = document.createElement(tagName);
  setProps(element, props);

  if (child instanceof HTMLElement) {
    element.appendChild(child);
  } else if (typeof child === 'string' || typeof child === 'number') {
    element.appendChild(document.createTextNode(child));
  }

  return element;
}
