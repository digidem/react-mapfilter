import React from 'react'

export function createElement (componentOrElement, props, children) {
  if (React.isValidElement(componentOrElement)) {
    return React.cloneElement(componentOrElement, props, children)
  } else if (typeof componentOrElement === 'function') {
    return React.createElement(componentOrElement, props, children)
  } else {
    console.warn('Expected a React Element or a React Component')
    return null
  }
}
