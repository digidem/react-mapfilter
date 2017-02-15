let reStr = ''
for (var i = 0; i < 3; i++) {
  reStr += '(?:/((?:[^/]+?)))?'
}
reStr += '(?:/(?=$))?$'

export const routeRegExp = new RegExp(reStr, 'i')
