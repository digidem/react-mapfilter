function memoize (fn) {
  let cachedResult
  let cachedArgs = []
  return function () {
    const args = arguments
    let cached = !!cachedResult
    for (let i = 0; i < args.length; i++) {
      if (cachedArgs[i] !== args[i]) {
        cached = false
      }
    }
    if (!cached) {
      cachedResult = fn.apply(this, args)
      cachedArgs = args
    }
    return cachedResult
  }
}

module.exports = {
  memoize
}
