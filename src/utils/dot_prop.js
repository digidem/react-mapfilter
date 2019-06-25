// @flow
import dotProp from 'dot-prop'

/**
 * Like https://github.com/sindresorhus/dot-prop but supports arrays as path
 */
export const get = (object: {}, path: string | string[]) => {
  if (!Array.isArray(path)) return dotProp.get(object, path)
  path = path.map(key => key.replace('.', '\\.')).join('.')
  return dotProp.get(object, path)
}

/**
 * Like https://github.com/sindresorhus/dot-prop but supports arrays as path,
 * and will always create arrays in an object when setting with a number as a
 * key e.g. set(obj, 'foo.0.bar', 'hello') will result in obj.foo = [{bar:
 * 'hello'}] whether obj.foo was set before or not
 */
export const set = (object: {}, path: string | string[], value: any) => {
  if (Array.isArray(path)) {
    path = path.map(key => key.replace('.', '\\.'))
  } else {
    path = path.split('.')
  }
  // Check for any path items that are a number
  if (!path.some(key => !isNaN(key)))
    return dotProp.set(object, path.join('.'), value)
  for (let i = 1; i < path.length; i++) {
    if (isNaN(path[i])) continue
    const subPath = path.slice(0, i).join('.')
    if (dotProp.get(object, subPath) !== undefined) continue
    dotProp.set(object, subPath, [])
  }
  return dotProp.set(object, path.join('.'), value)
}
