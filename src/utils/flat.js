// @flow
// Adapted from https://github.com/hughsk/flat
// **Does not flatten arrays of primitives**

var isBuffer = require('is-buffer')

function arrayContainsObjects(arr) {
  return arr.some(v => Object.prototype.toString.call(v) === '[object Object]')
}

export function flatten(
  target: {},
  {
    delimiter = '.',
    maxDepth = Infinity
  }: { delimiter?: string, maxDepth?: number } = {}
): {} {
  var output = {}
  var didFlatten = false

  function step(object, prev, currentDepth = 1) {
    if (prev) didFlatten = true
    Object.keys(object).forEach(function(key) {
      var value = object[key]
      // We want to preserve arrays of strings and numbers, but flatten arrays of objects
      var isarray = Array.isArray(value) && !arrayContainsObjects(value)
      var type = Object.prototype.toString.call(value)
      var isbuffer = isBuffer(value)
      var isobject = type === '[object Object]' || type === '[object Array]'

      var newKey = prev ? prev + delimiter + key : key

      if (
        !isarray &&
        !isbuffer &&
        isobject &&
        Object.keys(value).length &&
        currentDepth < maxDepth
      ) {
        return step(value, newKey, currentDepth + 1)
      }

      // Remove any empty objects
      output[newKey] = value
    })
  }

  step(target)

  // don't mutate if we don't neet to
  return didFlatten ? output : target
}

export function unflatten(
  target: Object,
  {
    delimiter = '.',
    overwrite = false
  }: { delimiter: string, overwrite: boolean } = {}
) {
  var result = {}

  var isbuffer = isBuffer(target)
  if (
    isbuffer ||
    Object.prototype.toString.call(target) !== '[object Object]'
  ) {
    return target
  }

  // safely ensure that the key is
  // an integer.
  function getkey(key) {
    var parsedKey = Number(key)

    return isNaN(parsedKey) || key.indexOf('.') !== -1 ? key : parsedKey
  }

  var sortedKeys = Object.keys(target).sort(function(keyA, keyB) {
    return keyA.length - keyB.length
  })

  sortedKeys.forEach(function(key) {
    var split = key.split(delimiter)
    var key1 = getkey(split.shift())
    var key2 = getkey(split[0])
    var recipient = result

    while (key2 !== undefined) {
      var type = Object.prototype.toString.call(recipient[key1])
      var isobject = type === '[object Object]' || type === '[object Array]'

      // do not write over falsey, non-undefined values if overwrite is false
      if (!overwrite && !isobject && typeof recipient[key1] !== 'undefined') {
        return
      }

      if ((overwrite && !isobject) || (!overwrite && recipient[key1] == null)) {
        recipient[key1] = typeof key2 === 'number' ? [] : {}
      }

      recipient = recipient[key1]
      if (split.length > 0) {
        key1 = getkey(split.shift())
        key2 = getkey(split[0])
      }
    }

    // unflatten again for 'messy objects'
    recipient[key1] = unflatten(target[key], { delimiter, overwrite })
  })

  return result
}
