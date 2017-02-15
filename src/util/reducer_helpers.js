let reStr = ''
for (var i = 0; i < 3; i++) {
  reStr += '(?:/((?:[^/]+?)))?'
}
reStr += '(?:/(?=$))?$'

const routeRegExp = new RegExp(reStr, 'i')

module.exports = {
  routeRegExp
}
